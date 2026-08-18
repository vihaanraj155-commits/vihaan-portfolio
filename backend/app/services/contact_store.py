"""Persistence and optional email relay for contact-form submissions.

Storage is a JSONL append, which is the right shape here: writes are rare, the file is
trivially greppable, and there is no schema migration to own. Email is strictly best-effort
on top of that -- a submission is never lost because an SMTP relay was unreachable.
"""

import json
import logging
import smtplib
from datetime import UTC, datetime
from email.message import EmailMessage
from pathlib import Path

from ..config import Settings
from ..models import ContactRequest

logger = logging.getLogger(__name__)


def store_message(payload: ContactRequest, settings: Settings, client_ip: str) -> None:
    """Append a submission to the JSONL store, creating the data directory if needed."""
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    record = {
        "received_at": datetime.now(UTC).isoformat(),
        "name": payload.name,
        "email": str(payload.email),
        "subject": payload.subject,
        "message": payload.message,
        "client_ip": client_ip,
    }
    path: Path = settings.messages_path
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")


def send_notification(payload: ContactRequest, settings: Settings) -> bool:
    """Relay the submission by email if SMTP is configured.

    Returns True when a message was sent. Any failure is logged and swallowed: the caller has
    already persisted the submission, so an SMTP outage must not surface as a 500.
    """
    if not settings.smtp_host:
        return False

    recipient = settings.smtp_to or settings.smtp_from
    if not recipient:
        logger.warning("SMTP host configured but no recipient set; skipping notification")
        return False

    message = EmailMessage()
    message["Subject"] = f"[Portfolio] {payload.subject}"
    message["From"] = settings.smtp_from or settings.smtp_user
    message["To"] = recipient
    message["Reply-To"] = str(payload.email)
    message.set_content(
        f"From: {payload.name} <{payload.email}>\n"
        f"Subject: {payload.subject}\n\n"
        f"{payload.message}\n"
    )

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as server:
            server.starttls()
            if settings.smtp_user:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(message)
        return True
    except Exception:  # noqa: BLE001 - deliberately broad; delivery is best-effort
        logger.exception("Failed to relay contact submission by email")
        return False
