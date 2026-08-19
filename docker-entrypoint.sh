#!/bin/sh
set -e

# A Fly volume mounts as a fresh, root-owned filesystem *over* /app/data, shadowing the
# appuser-owned directory baked into the image. Without this chown appuser cannot create
# messages.jsonl, so every contact submission 500s in production -- while working perfectly
# under a plain `docker run`, which has no volume. Fix ownership as root, then drop privileges.
mkdir -p /app/data
chown -R appuser:appuser /app/data || true

exec gosu appuser "$@"
