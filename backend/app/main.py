import logging
import secrets
import smtplib
import time
from email.message import EmailMessage

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .rag import get_rag_service
from .schemas import ChatRequest, ChatResponse, ContactCodeRequest, ContactMessageRequest, Source

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mebrie Awoke Portfolio API",
    description="Portfolio API with a retrieval-augmented assistant and verified contact form.",
    version="1.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# Short-lived in-memory challenges. Use Redis if deploying multiple API instances.
verification_codes: dict[str, dict] = {}
code_requests: dict[str, list[float]] = {}\nip_code_requests: dict[str, list[float]] = {}
MAX_CODE_AGE_SECONDS = 600
MAX_CODE_ATTEMPTS = 5
MAX_CODE_REQUESTS_PER_HOUR = 3


def send_email(message: EmailMessage) -> None:
    if not all([settings.smtp_host, settings.smtp_username, settings.smtp_password, settings.smtp_from_email]):
        raise HTTPException(status_code=503, detail="Email delivery is not configured yet. Please try again later.")
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(message)
    except (OSError, smtplib.SMTPException):
        logger.exception("Portfolio email delivery failed")
        raise HTTPException(status_code=502, detail="Email delivery failed. Please try again later.")


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "portfolio-api"}


@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    question = payload.question.strip()
    if len(question) < 2:
        raise HTTPException(status_code=422, detail="Please enter a question with at least 2 characters.")
    if not settings.groq_api_key:
        raise HTTPException(status_code=503, detail="The AI assistant is not configured yet. Please try again later.")
    try:
        answer, sources = get_rag_service().answer(question)
        return ChatResponse(answer=answer, sources=[Source(**source) for source in sources])
    except RuntimeError as exc:
        logger.warning("RAG assistant configuration or knowledge error: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Portfolio assistant request failed")
        raise HTTPException(status_code=502, detail="The assistant is temporarily unavailable. Please try again.") from exc


@app.post("/api/contact/send-code")
def send_contact_code(payload: ContactCodeRequest, request: Request) -> dict[str, str]:
    if payload.website.strip():
        return {"message": "If the address is valid, a verification code has been sent."}

    email = payload.email.strip().lower()
    now = time.time()
    client_ip = request.client.host if request.client else "unknown"
    ip_recent = [stamp for stamp in ip_code_requests.get(client_ip, []) if now - stamp < 3600]
    if len(ip_recent) >= 8:
        raise HTTPException(status_code=429, detail="Too many verification requests from this connection. Please try again later.")
    recent = [stamp for stamp in code_requests.get(email, []) if now - stamp < 3600]
    if len(recent) >= MAX_CODE_REQUESTS_PER_HOUR:
        raise HTTPException(status_code=429, detail="Too many verification requests. Please try again later.")

    code = f"{secrets.randbelow(1_000_000):06d}"
    verification_codes[email] = {"code": code, "created": now, "attempts": 0}
    code_requests[email] = recent + [now]
    ip_code_requests[client_ip] = ip_recent + [now]

    message = EmailMessage()
    message["Subject"] = "Verify your email for Mebrie's portfolio"
    message["From"] = settings.smtp_from_email
    message["To"] = email
    message.set_content(
        f"Your verification code is {code}.\n\n"
        "Enter this code on Mebrie's portfolio contact form to confirm that you own this email address. "
        "The code expires in 10 minutes. If you did not request it, ignore this email."
    )
    send_email(message)
    return {"message": "A verification code has been sent to your email address."}


@app.post("/api/contact/verify-and-send")
def verify_and_send_contact(payload: ContactMessageRequest) -> dict[str, str]:
    if payload.website.strip():
        return {"message": "Your message has been submitted."}

    email = payload.email.strip().lower()
    challenge = verification_codes.get(email)
    if not challenge or time.time() - challenge["created"] > MAX_CODE_AGE_SECONDS:
        verification_codes.pop(email, None)
        raise HTTPException(status_code=400, detail="Your verification code has expired. Request a new code.")

    challenge["attempts"] += 1
    if challenge["attempts"] > MAX_CODE_ATTEMPTS:
        verification_codes.pop(email, None)
        raise HTTPException(status_code=429, detail="Too many incorrect attempts. Request a new code.")
    if not secrets.compare_digest(challenge["code"], payload.code.strip()):
        raise HTTPException(status_code=400, detail="The verification code is incorrect.")

    message = EmailMessage()
    message["Subject"] = f"Portfolio message: {payload.subject.strip()}"
    message["From"] = settings.smtp_from_email
    message["To"] = settings.contact_to_email
    message["Reply-To"] = email
    message.set_content(
        "New verified message from your portfolio website.\n\n"
        f"Name: {payload.name.strip()}\n"
        f"Email: {email}\n"
        f"Subject: {payload.subject.strip()}\n\n"
        f"{payload.message.strip()}"
    )
    send_email(message)
    verification_codes.pop(email, None)
    return {"message": "Your verified message has been sent successfully."}
