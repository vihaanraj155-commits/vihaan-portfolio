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

- `vihaanrajagopal.com` is assumed in `index.html`, `robots.txt`, `sitemap.xml`

Settled: Vihaan confirmed on 2026-08-18 that the named collaborators consent to appearing on
the public site. The portrait is in place at `frontend/public/portrait.jpg`; the "VR" monogram
is now only the `onError` fallback in `About.tsx`, so do not treat it as the intended state.

## Privacy

`backend/static/resume.pdf` is the real résumé and contains a **phone number**. The GitHub repo
is **private** partly for this reason. Before making the repo public, remove the phone number
from the résumé — git history is permanent.

## Checks before saying done

```powershell
cd backend;  .\.venv\Scripts\python.exe -m pytest -q    # 19 tests
cd frontend; npm run build                              # type-check + build
```

Accessibility is a maintained property, not a one-off: every text/background pair clears WCAG
AA in both themes, and reduced motion is honoured in `use-reveal.ts` (final-state content, no
animation). Keep both true.
