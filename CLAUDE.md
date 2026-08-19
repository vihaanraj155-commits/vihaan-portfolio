# Project notes for Claude

Personal portfolio site for **Vihaan Rajagopal**. Read this before making changes.

## Running it

Backend first — the frontend proxies to it.

```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

```powershell
cd frontend
npm run dev          # http://localhost:5173
```

`.venv` and `node_modules` are already installed. Do not re-run setup.

## Where things live

**All site copy is in `backend/app/content.py`.** It is served at runtime via `/api/site`, so
editing text needs no frontend rebuild — just refresh. After editing content, run
`npm run sync:content` from `frontend/` (backend must be up) to refresh the bundled offline
snapshot at `frontend/src/content/fallback.json`.

Design tokens for both themes are in `frontend/src/index.css`. Themes switch on
`<html data-theme>`, and Tailwind's `dark:` variant is redefined to match — do not assume
`dark:` follows the OS.

## About Vihaan (so the copy stays accurate)

High school student at Edison High School, expected 2028. Not a professional engineer — the
site is deliberately framed as **"Student Researcher & Developer"**. Earlier drafts overstated
this as "Software Engineer & Systems Researcher"; do not drift back toward inflated framing.
Accurate and specific is the goal.

## Attribution rules — important

The TeLLMe and CityOS work is **collaborative research** at Rutgers WINLAB with the NSF
Center for Smart Streetscapes, led by Prof. Jorge Ortiz, with PhD mentors Taqiya Ehsan and
Shuren Xia. Vihaan joined in 2026. It is **not** Vihaan's solo work.

His actual contribution was the TeLLMe frontend plus the API integration layer binding the
smart-room sensors and the CARLA simulator to the query pipeline, and getting the system
running end to end. On CityOS he contributed more broadly but mainly through TeLLMe.

Every `Project` therefore carries:

- `context` — who the work was done with (`None` for independent work)
- `contribution` — what Vihaan personally did

`test_collaborative_projects_state_the_contribution` fails the build if a project names
collaborators without a personal contribution. **Never weaken or delete that test.** Never
describe collaborative research as if it were solo.

Related: the actual CityOS/TeLLMe source repos are the lab's work and must not be published
without Prof. Ortiz's permission. This repo only *describes* the research, which is fine.

## Still unconfirmed

- Whether the named collaborators are happy to appear on a public site
- Portrait is intentionally absent — About shows a "VR" monogram until
  `frontend/public/portrait.jpg` exists
- `vihaanrajagopal.com` is assumed in `index.html`, `robots.txt`, `sitemap.xml`

## Privacy

`backend/static/resume.pdf` is served publicly at `/api/resume` by the deployed site, so it is
the **phone-free** version: it was regenerated from `Vihaan_Rajagopal_Resume_2026.docx` with the
`| (m) <number>` fragment removed from the header line. Keep it that way — anything added to that
PDF is world-readable the moment it deploys.

The **earlier** résumé, which did contain the phone number, is still in git history. That is
harmless while the repo is private, but the history must be rewritten before the repo is ever
made public.

## Deployment

The site is one container on Fly.io: the root `Dockerfile` builds the React bundle in a Node
stage and hands it to FastAPI, which serves the SPA and the API from a single origin on port
8000. `backend/app/spa.py` is what nginx used to do — immutable caching for `/assets`, `no-store`
for `index.html`, and a history-API fallback.

`docker-compose.yml` and the two per-service Dockerfiles are unchanged and still run the local
nginx-fronted stack; they are not what deploys.

Pushing to `master` runs `.github/workflows/ci.yml`, which gates on ruff + pytest + `npm run
build` and then deploys to Fly. Runtime secrets (SMTP) live in `fly secrets`, never in the repo
or in GitHub.

Two constraints that must not be broken:

- **One machine only.** `services/rate_limit.py` keeps its window in process memory and the
  data volume attaches to a single machine. Never `fly scale count 2`, never add `--workers`.
- **The catch-all route must stay last.** `mount_frontend()` is called after every
  `include_router`; reversing that order makes the SPA swallow the entire API.

After editing `backend/app/content.py`, run `npm run sync:content` from `frontend/` with the
backend up. `test_bundled_fallback_matches_api_content` fails the build if you forget.

## Checks before saying done

```powershell
cd backend;  .\.venv\Scripts\python.exe -m ruff check .  # lint gate, also runs in CI
cd backend;  .\.venv\Scripts\python.exe -m pytest -q     # 20 tests
cd frontend; npm run build                               # type-check + build
```

To exercise the deployed single-origin shape locally, without Docker:

```powershell
cd frontend; npm run build
cd ..\backend
$env:FRONTEND_DIST = "..\frontend\dist"; $env:ENVIRONMENT = "production"
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8010
```

Then confirm `/` and `/projects/<slug>` return the shell, `/assets/<hashed>.js` is immutable,
and a missing asset or an unknown `/api/*` path 404s **as JSON rather than HTML** — that last
one is the failure mode the catch-all route exists to avoid.

Accessibility is a maintained property, not a one-off: every text/background pair clears WCAG
AA in both themes, and reduced motion is honoured in `use-reveal.ts` (final-state content, no
animation). Keep both true.
