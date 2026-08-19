"""Contact form submission."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status

from ..config import Settings, get_settings
from ..models import ContactRequest, ContactResponse
from ..services.contact_store import send_notification, store_message
from ..services.rate_limit import SlidingWindowRateLimiter, client_key

router = APIRouter(prefix="/api", tags=["contact"])

# Module-level so the window survives across requests. Configured lazily on first use so the
# limits stay driven by Settings rather than hard-coded here.
_limiter: SlidingWindowRateLimiter | None = None


def get_limiter(settings: Settings) -> SlidingWindowRateLimiter:
    global _limiter
    if _limiter is None:
        _limiter = SlidingWindowRateLimiter(
            limit=settings.contact_rate_limit,
            window_seconds=settings.contact_rate_window_seconds,
        )
    return _limiter


def reset_limiter() -> None:
    """Drop the limiter so a fresh one is built from current settings. Used in tests."""
    global _limiter
    _limiter = None


@router.post(
    "/contact",
    response_model=ContactResponse,
    responses={429: {"description": "Too many submissions"}},
    summary="Send a message",
)
def submit_contact(
    payload: ContactRequest,
    request: Request,
    settings: Annotated[Settings, Depends(get_settings)],
) -> ContactResponse:
    # Honeypot: a filled hidden field means a bot. Return success so it learns nothing, and
    # store nothing.
    if payload.website.strip():
        return ContactResponse(message="Thanks — your message has been received.")

    # Fly sets Fly-Client-IP itself and overwrites any client-supplied value, whereas it only
    # *appends* to X-Forwarded-For -- so the first XFF hop is attacker-controlled and could be
    # rotated to walk straight past the limit. Prefer Fly's header, fall back to XFF for the
    # nginx/docker-compose stack.
    key = client_key(
        request.headers.get("fly-client-ip") or request.headers.get("x-forwarded-for"),
        request.client.host if request.client else None,
    )
    allowed, retry_after = get_limiter(settings).check(key)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many messages sent from this address. Please try again later.",
            headers={"Retry-After": str(retry_after)},
        )

    store_message(payload, settings, key)
    send_notification(payload, settings)

    return ContactResponse(message="Thanks — your message has been received.")
