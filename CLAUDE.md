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
Center for Smart Streetscapes, led by Prof. Jorge Ortiz, with PhD mentors including Taqiya
Ehsan. Vihaan joined in 2026. It is **not** Vihaan's solo work. Only Prof. Ortiz and Taqiya
Ehsan are named on the site by choice; other mentors and researchers are referred to
collectively. Do not add further individual names without asking.

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

- The production hostname is assumed to be `vihaan-portfolio.pages.dev`, the Cloudflare
  default for this repo name. Confirm it against the real deployment.

Settled: Vihaan confirmed on 2026-08-18 that the named collaborators consent to appearing on
the public site. The portrait is in place at `frontend/public/portrait.jpg`; the "VR" monogram
is now only the `onError` fallback in `About.tsx`, so do not treat it as the intended state.

## Privacy

`backend/static/resume.pdf` is served publicly at `/api/resume` by the deployed site, so it is
the **phone-free** version: it was regenerated from `Vihaan_Rajagopal_Resume_2026.docx` with the
`| (m) <number>` fragment removed from the header line. Keep it that way — anything added to that
PDF is world-readable the moment it deploys.

The **earlier** résumé, which did contain the phone number, is still in git history. That is
harmless while the repo is private, but the history must be rewritten before the repo is ever
made public.

## Deployment

The site deploys as a **static bundle to Cloudflare Pages**: root directory `frontend`, build
command `npm run build:static`, output directory `dist`. There is no backend in production.
Cloudflare builds from its own git integration, so `.github/workflows/ci.yml` is checks-only
(ruff + pytest + `npm run build`) and deploys nothing.

Nothing about this is Fly-specific any more; Fly was removed because it has no free tier.
Do not reintroduce it.

The static build depends on two files that are easy to overlook:

- **`frontend/public/_redirects`** — `/* /index.html 200`. React Router owns `/projects/:slug`
  client-side, so without it every deep link 404s on the host. `vite preview` ignores it.
- **`frontend/public/resume.pdf`** — the static copy of `backend/static/resume.pdf`, because
  `/api/resume` does not exist in production. `test_public_resume_matches_backend_copy` fails
  on drift.

The hostname `vihaan-portfolio.pages.dev` is hardcoded in `index.html`, `robots.txt` and
`sitemap.xml`. A custom domain means editing those three and adding it in the Cloudflare
dashboard.

The root `Dockerfile`, `docker-entrypoint.sh` and `backend/app/spa.py` still build a working
single-container image serving the SPA and API from one origin, and `docker-compose.yml` still
runs the local nginx-fronted stack. Neither is part of the deploy; they are kept only as a
self-hosting path. If you touch `spa.py`, the catch-all route must stay last — `mount_frontend()`
is called after every `include_router`, and reversing that makes the SPA swallow the API.

After editing `backend/app/content.py`, run `npm run sync:content` from `frontend/` with the
backend up. `test_bundled_fallback_matches_api_content` fails the build if you forget.

## Two build modes

`npm run build` expects the backend (the self-hosting container path). `npm run build:static` loads
`frontend/.env.static`, sets `VITE_CONTACT_ENDPOINT=off`, and produces the bundle for
Cloudflare Pages / Netlify, which is the current deployment plan.

`off` swaps the contact form for a mail-link panel. Any other value is used as the POST target
verbatim, which is how a form service gets wired in. Do not "fix" the static build by pointing
the form back at `/api/contact` -- there is no backend there to answer it.

The static build leans entirely on `frontend/src/content/fallback.json`, so a stale snapshot is
no longer merely cosmetic: it *is* the site. Always run `npm run sync:content` after editing
`content.py`; `test_bundled_fallback_matches_api_content` is the guard.

The resume exists twice on purpose -- `backend/static/resume.pdf` (source of truth) and
`frontend/public/resume.pdf` (what the static build serves, since `/api/resume` does not exist
there). `test_public_resume_matches_backend_copy` fails if they drift. Update both, never one.

## Checks before saying done

```powershell
cd backend;  .\.venv\Scripts\python.exe -m ruff check .  # lint gate, also runs in CI
cd backend;  .\.venv\Scripts\python.exe -m pytest -q     # 21 tests
cd frontend; npm run build                               # type-check + build
cd frontend; npm run build:static                        # the bundle that actually ships
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
