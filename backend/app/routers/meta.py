"""Operational endpoints: health probe and resume download."""

import time
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse

from ..config import Settings, get_settings
from ..models import HealthResponse

router = APIRouter(prefix="/api", tags=["meta"])

# Captured at import time; the lifespan hook in main.py refreshes it on startup.
_started_at = time.monotonic()


def mark_started() -> None:
    global _started_at
    _started_at = time.monotonic()


@router.get("/health", response_model=HealthResponse, summary="Liveness and uptime")
def health(settings: Annotated[Settings, Depends(get_settings)]) -> HealthResponse:
    return HealthResponse(
        version=settings.version,
        environment=settings.environment,
        uptime_seconds=round(time.monotonic() - _started_at, 3),
    )


@router.get("/resume", summary="Download resume as PDF", response_class=FileResponse)
def resume(settings: Annotated[Settings, Depends(get_settings)]) -> FileResponse:
    path = settings.resume_path
    if not path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume is not available yet.",
        )
    return FileResponse(
        path,
        media_type="application/pdf",
        filename="Vihaan-Rajagopal-Resume.pdf",
        headers={"Cache-Control": "public, max-age=3600"},
    )
