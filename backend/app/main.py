from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .rag import get_rag_service
from .schemas import ChatRequest, ChatResponse, Source

@asynccontextmanager
async def lifespan(app: FastAPI):
    get_rag_service()
    yield

app = FastAPI(title="Mebrie Awoke Portfolio API",
              description="Portfolio and retrieval-augmented assistant API.",
              version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins,
                   allow_credentials=False, allow_methods=["GET", "POST"],
                   allow_headers=["Content-Type"])

@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "portfolio-api"}

@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    try:
        answer, sources = get_rag_service().answer(payload.question.strip())
        return ChatResponse(answer=answer, sources=[Source(**item) for item in sources])
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Assistant temporarily unavailable. Please try again.") from exc
