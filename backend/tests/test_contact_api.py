"""Contact endpoint: validation, honeypot, persistence, and rate limiting."""

import json

from fastapi.testclient import TestClient

from app.config import Settings


def test_valid_submission_is_stored(
    client: TestClient, settings: Settings, valid_payload: dict[str, str]
) -> None:
    response = client.post("/api/contact", json=valid_payload)
    assert response.status_code == 200
    assert response.json()["ok"] is True

    lines = settings.messages_path.read_text(encoding="utf-8").strip().splitlines()
    assert len(lines) == 1
    record = json.loads(lines[0])
    assert record["email"] == valid_payload["email"]
    assert record["message"] == valid_payload["message"]
    assert record["received_at"]


def test_short_message_is_rejected(
    client: TestClient, settings: Settings, valid_payload: dict[str, str]
) -> None:
    response = client.post("/api/contact", json={**valid_payload, "message": "too short"})
    assert response.status_code == 422
    detail = response.json()["detail"]
    assert detail[0]["field"] == "message", "errors must be flattened for the form to map them"
    assert not settings.messages_path.exists()


def test_invalid_email_is_rejected(
    client: TestClient, valid_payload: dict[str, str]
) -> None:
    response = client.post("/api/contact", json={**valid_payload, "email": "not-an-email"})
    assert response.status_code == 422
    assert response.json()["detail"][0]["field"] == "email"


def test_honeypot_silently_discards(
    client: TestClient, settings: Settings, valid_payload: dict[str, str]
) -> None:
    """A bot gets a 200 so it learns nothing, but nothing is written."""
    response = client.post("/api/contact", json={**valid_payload, "website": "http://spam.example"})
    assert response.status_code == 200
    assert response.json()["ok"] is True
    assert not settings.messages_path.exists()


def test_rate_limit_blocks_sixth_submission(
    client: TestClient, settings: Settings, valid_payload: dict[str, str]
) -> None:
    for attempt in range(settings.contact_rate_limit):
        assert client.post("/api/contact", json=valid_payload).status_code == 200, attempt

    blocked = client.post("/api/contact", json=valid_payload)
    assert blocked.status_code == 429
    assert int(blocked.headers["retry-after"]) > 0

    lines = settings.messages_path.read_text(encoding="utf-8").strip().splitlines()
    assert len(lines) == settings.contact_rate_limit, "blocked request must not be stored"
