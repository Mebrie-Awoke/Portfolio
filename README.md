# Mebrie Awoke — Portfolio

A full-stack personal portfolio with a React frontend and a FastAPI RAG assistant.

## Structure
- `frontend/` — React + Vite portfolio and chat interface
- `backend/` — FastAPI service, document chunking, embeddings, ChromaDB retrieval, and Groq generation
- `backend/knowledge/profile.md` — curated CV-grounded knowledge used by the assistant

## Run locally

### Backend
Python 3.11+ is recommended.

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
# Copy .env.example to .env and add your GROQ_API_KEY
uvicorn app.main:app --reload
```

API docs: http://127.0.0.1:8000/docs

### Frontend
```bash
cd frontend
npm install
# Copy .env.example to .env
npm run dev
```

Set `VITE_API_URL=http://127.0.0.1:8000` in `frontend/.env`.

## RAG assistant
The backend chunks the portfolio knowledge, creates sentence-transformer embeddings, stores them in ChromaDB, retrieves relevant passages for each question, and uses Groq to generate a context-grounded answer. If the knowledge base does not contain the answer, the assistant says so.

## Configuration and deployment
Backend settings are documented in `backend/.env.example`. Never expose or commit `GROQ_API_KEY`. Deploy frontend and backend separately, set `VITE_API_URL` to the deployed API URL, configure backend `CORS_ORIGINS` for the frontend domain, and persist the ChromaDB directory on a persistent disk.

## Content accuracy
Project descriptions are based on the supplied CV. Verify project repository URLs and add the public CV PDF, screenshots, and live demos before publishing.
