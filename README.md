# Vihaan Rajagopal — Personal Portfolio

A two-tier portfolio site: a **React + TypeScript + Tailwind CSS** frontend and a **Python
(FastAPI)** backend that owns all site content, the contact endpoint, and the résumé download.

The design goal is Apple/Google-grade restraint — tight typographic tracking, hairline
structure instead of shadows, one accent colour, generous whitespace, and motion that gets out
of the way. Light and dark themes are both first-class.

---

## Still to confirm

Details are taken from `Vihaan_Rajagopal_Resume_2026.docx` and from Vihaan directly. What
remains:

- [ ] **Collaborator names** — the research projects publicly credit Prof. Jorge Ortiz and
      PhD mentors Taqiya Ehsan and Shuren Xia. Confirm they are happy to be named on a public
      site before it goes live.
- [ ] **Portrait** — intentionally blank; the About section shows a "VR" monogram. Add
      `frontend/public/portrait.jpg` when a photo exists.
- [ ] **Domain** — `vihaanrajagopal.com` is still assumed in `index.html`, `robots.txt`,
      and `sitemap.xml`

Confirmed and in place: name, email, location, GitHub, education, all seven experience
entries, the WINLAB / NSF CS3 affiliation and 2026 start, project attribution, and the real
résumé PDF.

### How attribution works

The smart-space research is collaborative, and the site says so structurally rather than in
passing. Every `Project` carries:

- `context` — who the work was done with. Rendered as a callout under the summary on the
  detail page, and as a "Collaborative" marker on the work card.
- `contribution` — what Vihaan personally did. Rendered as an accent-tinted **My contribution**
  block, placed above the system description in the sidebar.

A test (`test_collaborative_projects_state_the_contribution`) fails the build if a project
names collaborators without stating a personal contribution, so shared work can never
silently read as solo work.

---

## Requirements

- Python 3.11+ (developed on 3.14.2)
- Node.js 20+ (developed on 25.2.1)
- Docker, only for the container workflow

## Run it locally

Two terminals. **Backend first** — the frontend proxies to it.

```powershell
# Terminal 1 — backend on http://127.0.0.1:8000
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
python -m uvicorn app.main:app --reload --port 8000
```

```powershell
# Terminal 2 — frontend on http://localhost:5173
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. Interactive API docs are at <http://127.0.0.1:8000/docs>.

> If dependency wheels fail to build on a very new Python, create the venv with an older
> interpreter instead: `py -3.12 -m venv .venv`. The Docker image already pins 3.12.

## Editing your content

**All site copy lives in one file: `backend/app/content.py`.** Edit it, save, and refresh the
browser — the frontend fetches content at runtime, so there is no rebuild step.

After changing content, refresh the offline snapshot so the site still shows current text when
the API is unreachable:

```powershell
cd frontend
npm run sync:content     # backend must be running
```

| To change | Edit |
| --- | --- |
| Name, tagline, bio, socials, availability | `PROFILE` in `backend/app/content.py` |
| Projects (cards + detail pages) | `PROJECTS` |
| Experience timeline | `EXPERIENCE` |
| Education | `EDUCATION` |
| Capabilities | `SKILLS` |
| Writing section | `WRITING` — the section is hidden while this list is empty |
| Colours, type scale, spacing | `frontend/src/index.css` |
| Résumé PDF | replace `backend/static/resume.pdf` (converted from the .docx) |
| Portrait | add `frontend/public/portrait.jpg` |

## Tests

```powershell
cd backend
.\.venv\Scripts\python.exe -m pytest        # 19 tests
```

```powershell
cd frontend
npm run build                               # type-check + production build
```

## Docker

```powershell
docker compose up --build
```

Site on <http://localhost:8080>; nginx serves the bundle and reverse-proxies `/api` to the
backend, so everything is one origin and CORS never applies. Contact submissions persist in the
`contact-data` volume.

---

## Architecture

```
backend/                     FastAPI · Pydantic v2 · pytest
  app/content.py             ← all site copy
  app/models.py              Pydantic schemas (mirrored by frontend/src/lib/types.ts)
  app/routers/               content · contact · meta
  app/services/              rate_limit · contact_store
frontend/                    Vite · React 19 · TypeScript · Tailwind v4
  src/index.css              ← design tokens, both themes
  src/lib/                   api · site-context · use-theme · use-reveal
  src/components/sections/   Hero · Work · Experience · Education · Skills · About
                             · Writing · Contact
  src/pages/                 Home · ProjectDetail · NotFound
```

### API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/site` | Whole payload in one request — what the app actually calls |
| GET | `/api/profile` · `/api/projects` · `/api/experience` · `/api/education` · `/api/skills` · `/api/writing` | Granular reads |
| GET | `/api/projects/{slug}` | One project · 404 if unknown |
| POST | `/api/contact` | Validated, rate-limited submission |
| GET | `/api/resume` | Résumé PDF |
| GET | `/api/health` | Status, version, uptime |

### Decisions worth knowing

- **Content is served, not compiled.** Editing text does not require a frontend rebuild. The
  cost is a fetch on load, which is covered by skeletons and the snapshot below.
- **Offline snapshot.** `frontend/src/content/fallback.json` is bundled and rendered if the API
  is unreachable. A portfolio showing an error page is worse than one showing slightly stale
  text. Regenerate with `npm run sync:content`.
- **Theme without flash.** An inline script in `index.html` resolves the theme before first
  paint. Tailwind's `dark:` variant is redefined against `[data-theme]` so it agrees with the
  toggle rather than the OS.
- **Contact spam handling.** A hidden honeypot field returns `200` and stores nothing, so bots
  get no signal. Real submissions are rate-limited to 5 per hour per IP and appended to
  `backend/data/messages.jsonl`. Set `SMTP_HOST` in `.env` to also relay by email; a relay
  failure never fails a request that was already stored.
- **Accessibility is enforced, not assumed.** Every text/background pair clears WCAG AA in both
  themes (verified: lightest text is 4.91:1 light / 5.99:1 dark). Reduced motion is honoured in
  the JS hook, so those visitors get final-state content with no animation at all.

## Configuration

Copy `backend/.env.example` to `backend/.env`. Every value is optional.

| Variable | Default | Purpose |
| --- | --- | --- |
| `ENVIRONMENT` | `development` | Reported by `/api/health` |
| `CORS_ORIGINS` | localhost dev origins | Comma-separated; empty under Docker (same origin) |
| `CONTACT_RATE_LIMIT` | `5` | Submissions per window per IP |
| `CONTACT_RATE_WINDOW_SECONDS` | `3600` | Window length |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` / `SMTP_TO` | empty | Optional email relay |

The frontend needs no configuration unless the API is on a different origin, in which case set
`VITE_API_BASE` in `frontend/.env.local`.
