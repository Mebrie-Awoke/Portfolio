# Portfolio
A personal portfolio website for Mebrie Awoke, showcasing software development, AI/ML work, projects, experience, and contact details.

## Features
- Modern single-page portfolio layout
- Responsive design for desktop and mobile
- Project and experience sections
- Downloadable CV
- Floating AI assistant that answers questions based on the portfolio and CV content

## Files
- `Portfolio/Index.html` — main page structure
- `Portfolio/style.css` — styling and responsive layout
- `Portfolio/script.js` — interactions and AI assistant logic
- `Portfolio/Mebrie Awoke_CV.pdf` — downloadable resume

## Run locally
From the project root:

```bash
cd /workspaces/Portfolio/Portfolio
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/Index.html
```

## Notes
The site is static and does not require a build step. The AI assistant works entirely in the browser using local portfolio/CV data.
