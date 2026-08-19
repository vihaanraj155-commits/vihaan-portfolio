# Single-container build: the React bundle is compiled by Node, then handed to FastAPI, which
# serves both the site and the API from one origin on one port.
#
# backend/Dockerfile and frontend/Dockerfile are still used by docker-compose.yml for the local
# nginx-fronted stack. This file is what gets deployed.

# ---------- stage 1: build the SPA ----------
FROM node:22-alpine AS web

WORKDIR /web

# Lockfile first so the dependency layer caches across source changes.
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
# `npm run build` is `tsc -b && vite build`, so a type error fails the image build.
RUN npm run build

# ---------- stage 2: runtime ----------
# Python 3.12 rather than 3.14: every dependency has prebuilt wheels here, so the image builds
# without a toolchain.
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# gosu lets the entrypoint fix volume ownership as root and then drop to appuser.
RUN apt-get update \
    && apt-get install -y --no-install-recommends gosu \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY backend/static ./static
COPY backend/scripts ./scripts

# Matches the `frontend_dist` default in app/config.py, where BASE_DIR is /app.
COPY --from=web /web/dist ./frontend_dist

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Contact submissions are written here. fly.toml mounts a volume over it so they survive a
# deploy -- without that mount the machine's filesystem is ephemeral and messages are lost.
RUN mkdir -p /app/data \
    && chmod +x /usr/local/bin/docker-entrypoint.sh \
    && useradd --create-home --uid 1001 appuser \
    && chown -R appuser:appuser /app

# Deliberately NOT `USER appuser`: the entrypoint has to start as root to chown the mounted
# volume, then execs the server as appuser via gosu. See docker-entrypoint.sh.

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=4).status == 200 else 1)"

# No --workers: services/rate_limit.py keeps its sliding window in process memory, so a second
# worker would silently double the contact-form rate limit.
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
