import json
import logging
import urllib.error
import urllib.request
from email.message import EmailMessage

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .rag import get_rag_service
from .schemas import ChatRequest, ChatResponse, ContactMessageRequest, Source

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mebrie Awoke Portfolio API",
    description="Portfolio API with a retrieval-augmented assistant and contact form.",
    version="1.4.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)



def send_email(message: EmailMessage) -> None:
    """Send mail through the Google Apps Script HTTPS gateway.

    Render free web services cannot make outbound SMTP connections. The Apps
    Script web app sends through Gmail on the account that owns the script.
    """
    if not settings.email_api_url or not settings.email_api_secret:
        raise HTTPException(
            status_code=503,
            detail="Email delivery is not configured yet. Please try again later.",
        )

    if not settings.email_api_url.startswith("https://script.google.com/macros/s/"):
        logger.error("EMAIL_API_URL must be a Google Apps Script /exec URL")
        raise HTTPException(status_code=503, detail="Email delivery is not configured correctly.")

    payload = {
        "secret": settings.email_api_secret,
        "to": str(message["To"]),
        "subject": str(message["Subject"]),
        "body": message.get_content(),
        "replyTo": str(message["Reply-To"]) if message.get("Reply-To") else "",
    }
    request = urllib.request.Request(
        settings.email_api_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        # Apps Script ContentService responds through a Google redirect; urllib
        # follows that redirect and reads the final JSON response.
        with urllib.request.urlopen(request, timeout=30) as response:
            result = json.loads(response.read().decode("utf-8"))
        if not isinstance(result, dict) or result.get("success") is not True:
            logger.error("Google Apps Script rejected an email request")
            raise HTTPException(status_code=502, detail="Email delivery failed. Please try again later.")
    except HTTPException:
        raise
    except (urllib.error.URLError, TimeoutError, OSError, ValueError, json.JSONDecodeError):
        logger.exception("Portfolio email API request failed")
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
        answer, sources = get_rag_service().answer(
            question,
            history=[item.model_dump() for item in payload.history],
        )
        return ChatResponse(answer=answer, sources=[Source(**source) for source in sources])
    except RuntimeError as exc:
        logger.warning("RAG assistant configuration or knowledge error: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Portfolio assistant request failed")
        raise HTTPException(status_code=502, detail="The assistant is temporarily unavailable. Please try again.") from exc


@app.post("/api/contact/send")
def send_contact_message(payload: ContactMessageRequest) -> dict[str, str]:
    if payload.website.strip():
        return {"message": "Your message has been submitted."}

    email = payload.email.strip().lower()
    message = EmailMessage()
    message["Subject"] = f"Portfolio message: {payload.subject.strip()}"
    message["To"] = settings.contact_to_email
    message["Reply-To"] = email
    message.set_content(
        "New message from your portfolio website.\n\n"
        f"Name: {payload.name.strip()}\n"
        f"Email: {email}\n"
        f"Subject: {payload.subject.strip()}\n\n"
        f"{payload.message.strip()}"
    )
    send_email(message)
    return {"message": "Your message has been sent successfully."}
