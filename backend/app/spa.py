"""Serve the built React bundle from FastAPI.

In production the whole site ships as one container: the Node build stage emits
``frontend/dist`` and this module hands those files out from the same origin as the API. The
browser therefore never makes a cross-origin request, so CORS stays switched off and
``VITE_API_BASE`` stays empty -- the frontend keeps calling relative ``/api`` paths exactly as
it does against the Vite dev proxy.

This is the single-container replacement for what ``frontend/nginx.conf`` does in the
docker-compose stack, which is still supported for local prod-like runs.

When the bundle is absent -- backend-only development, and the whole test suite -- everything
here no-ops and the app behaves exactly as it did before.
"""

import logging
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

logger = logging.getLogger(__name__)

# index.html names the hashed bundles, so caching it would keep serving the previous build's
# asset URLs after a deploy.
INDEX_CACHE_CONTROL = "no-cache, no-store, must-revalidate"

# Everything under /assets carries a content hash in its filename, so a cached copy can never
# be stale for changed content.
ASSET_CACHE_CONTROL = "public, max-age=31536000, immutable"

# favicon.svg, robots.txt, sitemap.xml and friends keep their names across deploys, so they get
# a short cache rather than an immutable one.
PUBLIC_FILE_CACHE_CONTROL = "public, max-age=3600"


class ImmutableStaticFiles(StaticFiles):
    """StaticFiles that stamps the immutable cache header on every hit.

    ``file_response`` is overridden through ``*args``/``**kwargs`` because its signature has
    shifted between Starlette releases and starlette is an unpinned transitive dependency.
    """

    def file_response(self, *args: Any, **kwargs: Any) -> Any:
        response = super().file_response(*args, **kwargs)
        response.headers["Cache-Control"] = ASSET_CACHE_CONTROL
        return response


def mount_frontend(app: FastAPI, dist_dir: Path) -> bool:
    """Serve ``dist_dir`` as the site's frontend. Returns False when there is nothing to serve.

    Must be called *after* every API router is registered: the catch-all route added here
    matches any path, and FastAPI resolves routes in registration order.
    """
    if not dist_dir.is_dir():
        logger.info("No frontend bundle at %s; serving the API only", dist_dir)
        return False

    root = dist_dir.resolve()
    index_file = root / "index.html"
    if not index_file.is_file():
        logger.warning("Frontend bundle at %s has no index.html; serving the API only", root)
        return False

    # Mounted before the catch-all, so a missing hashed asset 404s here rather than falling
    # through and answering a stale script tag with HTML.
    assets_dir = root / "assets"
    if assets_dir.is_dir():
        app.mount("/assets", ImmutableStaticFiles(directory=assets_dir), name="assets")

    def index_response() -> FileResponse:
        return FileResponse(
            index_file, media_type="text/html", headers={"Cache-Control": INDEX_CACHE_CONTROL}
        )

    # HEAD is listed explicitly: FastAPI's APIRoute, unlike Starlette's Route, does not infer it
    # from GET, and monitoring and `curl -I` both use it.
    @app.api_route("/{spa_path:path}", methods=["GET", "HEAD"], include_in_schema=False)
    async def serve_spa(spa_path: str) -> FileResponse:
        # An unmatched /api path is a typo or a probe, never a page. Falling through to
        # index.html would answer it 200 text/html and leave the caller parsing markup as JSON.
        if spa_path == "api" or spa_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not found")

        if spa_path and spa_path != "index.html":
            candidate = (root / spa_path).resolve()
            # is_relative_to rejects ../ escapes, which resolve() has already normalised.
            if candidate.is_relative_to(root) and candidate.is_file():
                return FileResponse(
                    candidate, headers={"Cache-Control": PUBLIC_FILE_CACHE_CONTROL}
                )

            # A final segment with an extension was asking for a file, not a page. Returning
            # the shell instead would turn a missing asset into "unexpected token '<'".
            if "." in spa_path.rsplit("/", 1)[-1]:
                raise HTTPException(status_code=404, detail="Not found")

        # Anything else is a client-side route such as /projects/tellme-interface. React Router
        # resolves it in the browser, so a hard refresh has to return the shell.
        return index_response()

    logger.info("Serving frontend bundle from %s", root)
    return True
