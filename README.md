# Mebrie Awoke — Portfolio

A full-stack personal portfolio with a React frontend and a FastAPI assistant.

## Structure

- `frontend/` — React + Vite portfolio and chat interface
- `backend/` — FastAPI API, portfolio retrieval, Groq responses, and verified contact form
- `backend/knowledge/profile.md` — CV-grounded knowledge used by the assistant
- `backend/google-apps-script/Code.gs` — Gmail HTTPS email gateway

## Run locally

### Backend

Python 3.12 is recommended.

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
# Copy .env.example to .env and set GROQ_API_KEY and email gateway values
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

The backend ranks relevant passages from the small, static portfolio knowledge file using lightweight lexical retrieval, then uses Groq to generate concise, context-grounded answers. This avoids loading large embedding models or a local vector database.

## Render deployment

Create a Web Service from this repository with:

- Root directory: `backend`
- Runtime: Python 3
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

The `backend/.python-version` file pins Python to 3.12.11.

Set these Render environment variables:

- `GROQ_API_KEY` — your Groq API key
- `GROQ_MODEL=llama-3.3-70b-versatile`
- `CORS_ORIGINS` — deployed frontend origin, e.g. `https://mebrieawoke.vercel.app`
- `EMAIL_API_URL` — deployed Google Apps Script web app URL ending in `/exec`
- `EMAIL_API_SECRET` — same long random secret configured in Apps Script Script Properties
- `CONTACT_TO_EMAIL=mebrieawoke941@gmail.com`

Health check: `/api/health`.

## Verified contact form email setup

Render free web services block outbound SMTP connections. The contact form therefore sends mail through a Google Apps Script HTTPS gateway, which uses Gmail on the Google account that owns the script. No custom domain is required.

1. Sign in to [Google Apps Script](https://script.google.com/) using the Gmail account that should send the messages.
2. Create a project and paste the contents of `backend/google-apps-script/Code.gs` into `Code.gs`.
3. Open **Project Settings** and add a Script Property:
   - Property: `EMAIL_API_SECRET`
   - Value: a long random secret (at least 32 characters). Do not commit or share it.
4. Choose **Deploy > New deployment > Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorize the requested Gmail permission and deploy. Copy the web app URL ending in `/exec`.
6. In Render, set `EMAIL_API_URL` to that URL and `EMAIL_API_SECRET` to the exact same secret.
7. Remove the old `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, and `SMTP_FROM_EMAIL` variables from Render. They are no longer used.
8. Save and redeploy the Render service, then test the contact form.

The Apps Script must be deployed from the Gmail account you want to send from. Keep the secret private. Apps Script and Gmail sending quotas apply.

Verification codes expire after 10 minutes, allow up to five attempts, and requests are rate-limited. Challenges and rate limits are stored in process memory, so keep one API instance.
