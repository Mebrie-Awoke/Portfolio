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
# Windows: .venv\Scripts\activate
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
Project descriptions are based on the supplied CV. Verify project repository URLs and add any public CV, screenshots, and live demos you want to publish.

## Verified contact form

The contact form sends a one-time 6-digit code to the visitor's email address. The message is delivered to `mebrieawoke941@gmail.com` only after the visitor enters the correct code. Codes expire after 10 minutes, allow up to five attempts, and verification requests are rate-limited.

Configure these environment variables on the backend (Render) before enabling the form:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_USERNAME` — the Gmail account used to send mail
- `SMTP_PASSWORD` — a Google App Password (not the normal Gmail password)
- `SMTP_FROM_EMAIL` — the same sending Gmail address
- `CONTACT_TO_EMAIL=mebrieawoke941@gmail.com`

For local development, add the same settings to `backend/.env`. Never commit real credentials. Verification codes are stored in process memory; use Redis if running multiple backend instances or requiring persistent rate limits.
