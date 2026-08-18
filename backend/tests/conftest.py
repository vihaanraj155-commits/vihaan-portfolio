"""Shared fixtures.

Every test gets an isolated data directory and a fresh rate limiter, so submissions written
by one test never leak into another and the 429 test starts from an empty window.
"""

from collections.abc import Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.config import Settings, get_settings
from app.main import app
from app.routers.contact import reset_limiter


@pytest.fixture
def settings(tmp_path: Path) -> Settings:
    return Settings(
        environment="test",
        data_dir=tmp_path / "data",
        static_dir=tmp_path / "static",
        smtp_host="",
        contact_rate_limit=5,
        contact_rate_window_seconds=3600,
    )


@pytest.fixture
def client(settings: Settings) -> Iterator[TestClient]:
    app.dependency_overrides[get_settings] = lambda: settings
    reset_limiter()
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    reset_limiter()


@pytest.fixture
def valid_payload() -> dict[str, str]:
    return {
        "name": "Ada Lovelace",
        "email": "ada@example.com",
        "subject": "Collaboration",
        "message": "I would like to talk about verified multi-agent coordination protocols.",
        "website": "",
    }
