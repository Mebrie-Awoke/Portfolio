# Mebrie Awoke — Portfolio

A full-stack personal portfolio built with **React + Vite** and **FastAPI**. It features an AI-powered portfolio assistant and a contact form that delivers visitor messages to my inbox.

## Features

- Responsive portfolio with light and dark themes
- Projects, skills, experience, and contact sections
- AI portfolio assistant powered by Groq
- Retrieval-augmented answers grounded in portfolio information
- Direct contact form submission — visitors can send a message without email verification
- Gmail delivery through a Google Apps Script HTTPS gateway

## Tech stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Python, FastAPI, Pydantic |
| AI assistant | Groq API, lightweight retrieval |
| Email delivery | Google Apps Script, Gmail |
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
│   ├── google-apps-script/
│   │   └── Code.gs
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
.venv\Scripts\Activate.ps1
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

The contact form does **not** require email verification. A visitor submits their name, email address, subject, and message. The backend validates the fields and sends the message to the configured inbox. The visitor's email is included as the reply-to address.

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
| `EMAIL_API_URL` | Deployed Google Apps Script web app URL ending in `/exec` |
| `EMAIL_API_SECRET` | Secret shared with the Apps Script deployment |
| `CONTACT_TO_EMAIL` | Inbox that receives contact messages |

### Gmail HTTPS email gateway

Render free web services block outbound SMTP connections. Email is therefore sent through a Google Apps Script HTTPS web app, which uses Gmail on the account that owns the script. A custom domain is not required.

1. Sign in to [Google Apps Script](https://script.google.com/) using the Gmail account that should send the messages.
2. Create a project and paste the contents of `backend/google-apps-script/Code.gs` into its `Code.gs` file.
3. In **Project Settings → Script Properties**, add `EMAIL_API_SECRET` with a long random value (at least 32 characters).
4. Select **Deploy → New deployment → Web app**.
5. Set **Execute as** to **Me** and **Who has access** to **Anyone**.
6. Authorize the requested Gmail permissions and deploy the web app.
7. Copy the deployment URL ending in `/exec`.
8. Set `EMAIL_API_URL` and the same `EMAIL_API_SECRET` in Render.
9. Set `CONTACT_TO_EMAIL` to the inbox where portfolio messages should arrive.
10. Save the Render environment variables and redeploy the backend.

Keep the secret private. Do not commit it to the repository or expose it in frontend code. Apps Script and Gmail sending quotas apply.

## Health check

After deployment, visit:

```text
https://YOUR-RENDER-SERVICE.onrender.com/api/health
```

A healthy service responds with a JSON status of `ok`.
