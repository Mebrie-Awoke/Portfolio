# Mebrie Awoke — Portfolio

A full-stack personal portfolio with a React frontend and a FastAPI assistant.

## Structure

- `frontend/` — React + Vite portfolio and chat interface
- `backend/` — FastAPI API, lightweight portfolio retrieval, Groq responses, and verified contact form
- `backend/knowledge/profile.md` — CV-grounded knowledge used by the assistant

## Run locally

### Backend

Python 3.12 is recommended.

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
# Copy .env.example to .env and set GROQ_API_KEY
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

## Assistant

The backend ranks relevant passages from the small, static portfolio knowledge file using lightweight lexical retrieval, then uses Groq to generate concise, context-grounded answers. This avoids loading large embedding models or a local vector database, keeping the API suitable for low-memory hosting.

## Render deployment

Create a **Web Service** from this repository with:

- Root directory: `backend`
- Runtime: Python 3
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

The `backend/.python-version` file pins Python to 3.12.11.

Set these environment variables in Render:

- `GROQ_API_KEY` — your Groq API key
- `GROQ_MODEL=llama-3.3-70b-versatile`
- `CORS_ORIGINS` — your deployed frontend origin (for example, `https://your-site.vercel.app`)

Health check: `/api/health`.

## Verified contact form

The contact form emails a one-time 6-digit code to the visitor. The message is delivered to `mebrieawoke941@gmail.com` only after the correct code is entered. Codes expire after 10 minutes, allow up to five attempts, and verification requests are rate-limited.

Configure these Render environment variables to enable email:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_USERNAME` — the sending Gmail account
- `SMTP_PASSWORD` — a Google App Password (not the normal Gmail password)
- `SMTP_FROM_EMAIL` — the sending Gmail address
- `CONTACT_TO_EMAIL=mebrieawoke941@gmail.com`

Never commit real API keys or email credentials. Verification codes and rate limits are stored in process memory, so use a single API instance.
