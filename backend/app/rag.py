from pathlib import Path
import chromadb
from groq import Groq
from sentence_transformers import SentenceTransformer
from .config import settings

KNOWLEDGE_FILE = Path(__file__).resolve().parents[1] / "knowledge" / "profile.md"

def split_into_chunks(text: str, chunk_size: int = 180, overlap: int = 30) -> list[str]:
    words = text.split()
    chunks, start = [], 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end]).strip()
        if chunk:
            chunks.append(chunk)
        if end == len(words):
            break
        start = end - overlap
    return chunks

class PortfolioRAG:
    def __init__(self) -> None:
        self.embedder = SentenceTransformer(settings.embedding_model)
        self.client = chromadb.PersistentClient(path=settings.chroma_path)
        self.collection = self.client.get_or_create_collection(
            name=settings.collection_name, metadata={"hnsw:space": "cosine"}
        )
        self._index_knowledge()

    def _index_knowledge(self) -> None:
        text = KNOWLEDGE_FILE.read_text(encoding="utf-8")
        chunks = split_into_chunks(text)
        ids = [f"profile-{i}" for i in range(len(chunks))]
        existing = set(self.collection.get(ids=ids).get("ids", []))
        pending = [(i, chunk) for i, chunk in enumerate(chunks) if ids[i] not in existing]
        if pending:
            docs = [chunk for _, chunk in pending]
            vectors = self.embedder.encode(docs, normalize_embeddings=True).tolist()
            self.collection.add(ids=[ids[i] for i, _ in pending], documents=docs, embeddings=vectors)

    def retrieve(self, question: str, limit: int = 4) -> list[dict[str, str]]:
        vector = self.embedder.encode([question], normalize_embeddings=True).tolist()[0]
        result = self.collection.query(query_embeddings=[vector],
            n_results=min(limit, self.collection.count()), include=["documents", "distances"])
        docs, distances = result.get("documents", [[]])[0], result.get("distances", [[]])[0]
        return [{"section": "Portfolio knowledge", "excerpt": doc}
                for doc, distance in zip(docs, distances) if distance <= 0.75]

    def answer(self, question: str) -> tuple[str, list[dict[str, str]]]:
        if not settings.groq_api_key:
            raise RuntimeError("Assistant is not configured. Add GROQ_API_KEY to backend environment.")
        sources = self.retrieve(question)
        if not sources:
            return ("I couldn't find that information in Mebrie's portfolio or CV. Please contact Mebrie for confirmation.", [])
        context = "\n\n".join(item["excerpt"] for item in sources)
        completion = Groq(api_key=settings.groq_api_key).chat.completions.create(
            model=settings.groq_model, temperature=0.2, max_tokens=500,
            messages=[
                {"role": "system", "content":
                 "You are Mebrie Awoke Yizngaw's portfolio assistant. Answer only from supplied context. "
                 "Never invent facts, dates, metrics, links, or achievements. If the answer is absent, say you do not know. "
                 "Be concise and professional."},
                {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"},
            ])
        return completion.choices[0].message.content or "I couldn't generate an answer.", sources

rag_service: PortfolioRAG | None = None

def get_rag_service() -> PortfolioRAG:
    global rag_service
    if rag_service is None:
        rag_service = PortfolioRAG()
    return rag_service
