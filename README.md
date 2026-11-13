# Mebrie Awoke — Portfolio

A full-stack personal portfolio built with **React + Vite** and **FastAPI**. It features an AI-powered portfolio assistant and a contact form that delivers visitor messages to my inbox.

## Features

- Responsive portfolio with light and dark themes
- Projects, skills, experience, and contact sections
- AI portfolio assistant powered by Groq
- Retrieval-augmented answers grounded in portfolio information
- Contact form with a hidden honeypot field for basic spam filtering
- Transactional email delivery through the Resend HTTPS API

## Tech stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Python, FastAPI, Pydantic |
| AI assistant | Groq API, lightweight retrieval |
| Email delivery | Resend API |
| Deployment | Vercel (frontend), Render (backend) |

## Repository structure

```text
.
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schemas.py
│   │   └── rag.py
│   ├── knowledge/
│   │   └── profile.md
│   ├── .env.example
│   └── requirements.txt
└── frontend/
    └── src/
        └── App.jsx
```

## Run locally

### 1. Backend

Python 3.12 is recommended.

```bash
cd backend
python -m venv .venv
```

Activate the environment:

```powershell
# Windows
.venv\\Scripts\\Activate.ps1
```

```bash
# macOS / Linux
source .venv/bin/activate
```

Install dependencies and configure environment variables:

```bash
pip install -r requirements.txt
```

Copy `.env.example` to `.env`, then set the required values. Start the API:

```bash
uvicorn app.main:app --reload
```

The backend runs at http://127.0.0.1:8000.

Interactive API documentation: http://127.0.0.1:8000/docs

### 2. Frontend

In another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` and set:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the development server:

```bash
npm run dev
```

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend health |
| POST | `/api/chat` | Ask the portfolio AI assistant |
| POST | `/api/contact/send` | Send a contact message to the portfolio owner |

### Contact form

The contact form does **not** require email verification. A visitor submits their name, email address, subject, and message. The backend sends the message to the configured inbox using Resend. The visitor's email is included as the reply-to address.

Example request:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Project opportunity",
  "message": "Hello, I would like to discuss a project with you.",
  "website": ""
}
```

The `website` field is a hidden honeypot used as a basic spam trap. Keep it empty for legitimate submissions.

## AI assistant

The backend retrieves relevant passages from `backend/knowledge/profile.md` using lightweight lexical retrieval and uses Groq to generate concise, context-grounded answers. This avoids loading large embedding models or maintaining a vector database.

## Deployment

### Frontend — Vercel

Deploy the `frontend` directory to Vercel and configure:

```env
VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com
```

Replace the value with the actual public URL of your Render backend.

### Backend — Render

Create a Render Web Service from this repository:

- **Root directory:** `backend`
- **Runtime:** Python 3
- **Build command:** `pip install -r requirements.txt`
- **Start command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

The `backend/.python-version` file pins Python to 3.12.11.

Configure these environment variables in Render:

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key for the AI assistant |
| `GROQ_MODEL` | Model name, e.g. `llama-3.3-70b-versatile` |
| `CORS_ORIGINS` | Deployed frontend origin, e.g. `https://mebrieawoke.vercel.app` |
| `RESEND_API_KEY` | API key created in the Resend dashboard |
| `EMAIL_FROM` | Verified sender, e.g. `Portfolio <hello@yourdomain.com>` |
| `CONTACT_TO_EMAIL` | Inbox that receives contact messages |

### Configure Resend

1. Create an account at [Resend](https://resend.com/).
2. Open **API Keys** and create an API key. Add it to Render as `RESEND_API_KEY`.
3. For an initial test, leave `EMAIL_FROM` as `Portfolio <onboarding@resend.dev>`. Resend's test sender only allows delivery to the email address associated with your Resend account.
4. To receive messages from all portfolio visitors, add a domain you own in the Resend dashboard and complete its DNS verification. Then set `EMAIL_FROM` to an address on that verified domain, for example `Portfolio <hello@yourdomain.com>`.
5. Set `CONTACT_TO_EMAIL` to the inbox where you want to receive messages.
6. Save the Render environment variables. Render will redeploy the backend.

Keep the API key private. Never put it in frontend code or commit it to GitHub. The backend calls Resend over HTTPS, so no SMTP configuration is needed.

## Health check

After deployment, visit:

```text
https://YOUR-RENDER-SERVICE.onrender.com/api/health
```

A healthy service responds with a JSON status of `ok`.
