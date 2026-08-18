"""A dependency-free sliding-window rate limiter.

Deliberately in-memory: this API runs as a single process behind a single origin, and adding
Redis to throttle a personal contact form would be a poor trade. Counters reset on restart,
which is acceptable for the threat model (casual spam, not a determined attacker).
"""

import threading
import time
from collections import defaultdict, deque


class SlidingWindowRateLimiter:
    """Allow at most ``limit`` hits per ``window_seconds`` for each key."""

    def __init__(self, limit: int, window_seconds: int) -> None:
        self._limit = limit
        self._window = window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def check(self, key: str) -> tuple[bool, int]:
        """Record an attempt for ``key``.

        Returns ``(allowed, retry_after_seconds)``. ``retry_after_seconds`` is 0 when allowed.
        """
        now = time.monotonic()
        cutoff = now - self._window

        with self._lock:
            hits = self._hits[key]
            while hits and hits[0] <= cutoff:
                hits.popleft()

            if len(hits) >= self._limit:
                retry_after = int(hits[0] + self._window - now) + 1
                return False, max(retry_after, 1)

            hits.append(now)
            return True, 0

    def reset(self) -> None:
        """Clear all counters. Used by the test suite."""
        with self._lock:
            self._hits.clear()


def client_key(forwarded_for: str | None, client_host: str | None) -> str:
    """Derive a rate-limit key, preferring the first hop of X-Forwarded-For.

    Behind the nginx reverse proxy in docker-compose, ``client_host`` is the proxy itself, so
    every visitor would otherwise share one bucket.
    """
    if forwarded_for:
        first_hop = forwarded_for.split(",")[0].strip()
        if first_hop:
            return first_hop
    return client_host or "unknown"
