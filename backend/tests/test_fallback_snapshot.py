"""The bundled offline snapshot must match what the API serves.

``frontend/src/content/fallback.json`` is what the site renders when the API is unreachable. It
is refreshed by ``npm run sync:content``, which is easy to forget after editing ``content.py``,
and a stale snapshot is invisible -- no component reads the ``source`` flag, so cached content
is indistinguishable from live content in the UI. Comparing the two here keeps them honest
without standing a server up in CI.
"""

import json
from pathlib import Path

import pytest
from fastapi.encoders import jsonable_encoder

from app.content import get_site_content

FALLBACK_PATH = (
    Path(__file__).resolve().parents[2] / "frontend" / "src" / "content" / "fallback.json"
)


def test_bundled_fallback_matches_api_content() -> None:
    if not FALLBACK_PATH.is_file():
        pytest.skip(f"No bundled snapshot at {FALLBACK_PATH}")

    snapshot = json.loads(FALLBACK_PATH.read_text(encoding="utf-8"))

    assert snapshot == jsonable_encoder(get_site_content()), (
        "frontend/src/content/fallback.json is out of date. Start the backend and run "
        "`npm run sync:content` from frontend/ to refresh it."
    )
