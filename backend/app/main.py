import json
import logging
import urllib.error
import urllib.request

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .rag import get_rag_service
from .schemas import ChatRequest, ChatResponse, ContactMessageRequest, Source

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mebrie Awoke Portfolio API",
    description="Portfolio API with a retrieval-augmented assistant and contact form.",
    version="1.5.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


def send_email(*, reply_to: str, subject: str, body: str) -> None:
    """Send a contact email through Resend's HTTPS API."""
    if not settings.resend_api_key:
        logger.error("RESEND_API_KEY is not configured")
        raise HTTPException(
            status_code=503,
            detail="Email delivery is not configured yet. Please try again later.",
        )

    payload = {
        "from": settings.email_from,
        "to": [settings.contact_to_email],
        "reply_to": reply_to,
        "subject": subject,
        "text": body,
    }
    request = urllib.request.Request(
        "https://api.resend.com/emails",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {settings.resend_api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "MebriePortfolio/1.5.1 (contact-form)",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            result = json.loads(response.read().decode("utf-8"))

        if not isinstance(result, dict) or not result.get("id"):
            logger.error("Resend returned an unexpected response")
            raise HTTPException(
                status_code=502,
                detail="Email delivery failed. Please try again later.",
            )
    except urllib.error.HTTPError as exc:
        # Do not log request headers or API keys.
        error_body = exc.read().decode("utf-8", errors="replace")
        logger.error("Resend API returned HTTP %s: %s", exc.code, error_body[:1000])
        raise HTTPException(
            status_code=502,
            detail="Email delivery failed. Please check the email service configuration.",
        ) from exc
    except HTTPException:
        raise
    except (urllib.error.URLError, TimeoutError, OSError, ValueError):
        logger.exception("Portfolio email request to Resend failed")
        raise HTTPException(
            status_code=502,
            detail="Email delivery failed. Please try again later.",
        )


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
    subject = f"Portfolio message: {payload.subject.strip()}"
    body = (
        "New message from your portfolio website.\n\n"
        f"Name: {payload.name.strip()}\n"
        f"Email: {email}\n"
        f"Subject: {payload.subject.strip()}\n\n"
        f"{payload.message.strip()}"
    )

    send_email(reply_to=email, subject=subject, body=body)
    return {"message": "Your message has been sent successfully."}
