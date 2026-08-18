"""FastAPI application factory for the portfolio backend."""

import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import get_settings
from .routers import contact, content, meta

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    meta.mark_started()
    logging.getLogger(__name__).info(
        "Portfolio API %s starting in %s mode", settings.version, settings.environment
    )
    yield


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.version,
        description=(
            "Serves the content, contact, and resume endpoints for the personal portfolio of "
            "Vihaan Rajagopal."
        ),
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
        max_age=600,
    )

    @app.exception_handler(RequestValidationError)
    async def validation_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        """Flatten FastAPI validation errors into {field, message} pairs.

        The contact form maps these straight onto its inputs, so the default nested ``loc``
        arrays would just have to be unpicked on the client instead.
        """
        errors = []
        for error in exc.errors():
            location = [str(part) for part in error["loc"] if part not in ("body", "query")]
            errors.append(
                {"field": ".".join(location) or "request", "message": error["msg"]}
            )
        return JSONResponse(status_code=422, content={"detail": errors})

    app.include_router(content.router)
    app.include_router(contact.router)
    app.include_router(meta.router)

    return app


app = create_app()
