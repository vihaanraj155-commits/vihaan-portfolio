"""The résumé the static build serves must be the résumé the API serves.

``backend/static/resume.pdf`` is the source of truth, but a static host has no backend to ask
for it, so ``frontend/public/resume.pdf`` is shipped as a plain asset and ``resumeUrl`` points
there. Two copies means they can drift, and the failure is silent and bad: replacing only the
backend copy leaves the public site handing out the previous résumé -- which is how the version
still carrying a phone number would get published after being removed.
"""

import hashlib
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_COPY = REPO_ROOT / "backend" / "static" / "resume.pdf"
PUBLIC_COPY = REPO_ROOT / "frontend" / "public" / "resume.pdf"


def _digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def test_public_resume_matches_backend_copy() -> None:
    if not PUBLIC_COPY.is_file():
        pytest.skip(f"No static copy at {PUBLIC_COPY}")

    assert _digest(PUBLIC_COPY) == _digest(BACKEND_COPY), (
        "frontend/public/resume.pdf differs from backend/static/resume.pdf. Copy the backend "
        "file over the public one so the static build serves the current résumé."
    )
