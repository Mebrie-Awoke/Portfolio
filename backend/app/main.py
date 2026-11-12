import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .rag import get_rag_service
from .schemas import ChatRequest, ChatResponse, Source

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mebrie Awoke Portfolio API",
    description="Portfolio API with a retrieval-augmented assistant.",
    version="1.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    # Keep health checks lightweight; do not load the embedding model here.
    return {"status": "ok", "service": "portfolio-api"}


@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    question = payload.question.strip()
    if len(question) < 2:
        raise HTTPException(status_code=422, detail="Please enter a question with at least 2 characters.")
    if not settings.groq_api_key:
        raise HTTPException(
            status_code=503,
            detail="The AI assistant is not configured yet. Please try again later.",
        )
    try:
        answer, sources = get_rag_service().answer(question)
        return ChatResponse(answer=answer, sources=[Source(**source) for source in sources])
    except RuntimeError as exc:
        logger.warning("RAG assistant configuration or knowledge error: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Portfolio assistant request failed")
        raise HTTPException(
            status_code=502,
            detail="The assistant is temporarily unavailable. Please try again.",
        ) from exc
