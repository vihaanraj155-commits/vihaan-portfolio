import fallbackContent from "@/content/fallback.json";
import type { ContactPayload, FieldError, SiteContent } from "@/lib/types";

/**
 * In development Vite proxies /api to the backend, so a relative base keeps the browser on a
 * single origin and CORS never applies. In production the same holds behind nginx. Set
 * VITE_API_BASE only when the API genuinely lives on another origin.
 */
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

const REQUEST_TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fieldErrors: FieldError[] = [],
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });

    if (!response.ok) {
      throw await toApiError(response);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  const retryAfterHeader = response.headers.get("retry-after");
  const retryAfter = retryAfterHeader ? Number(retryAfterHeader) : undefined;

  let fieldErrors: FieldError[] = [];
  let message = `Request failed with status ${response.status}`;

  try {
    const body = await response.json();
    if (Array.isArray(body?.detail)) {
      fieldErrors = body.detail as FieldError[];
      message = fieldErrors[0]?.message ?? message;
    } else if (typeof body?.detail === "string") {
      message = body.detail;
    }
  } catch {
    // Non-JSON error body; the status-based message above is the best we have.
  }

  return new ApiError(message, response.status, fieldErrors, retryAfter);
}

export type SiteSource = "api" | "fallback";

export interface SiteResult {
  content: SiteContent;
  source: SiteSource;
}

/**
 * Load site content, falling back to the bundled snapshot if the API is unreachable.
 *
 * A portfolio that renders an error page when its backend is down is worse than one that
 * renders slightly stale text, so the snapshot is a deliberate part of the design rather
 * than a safety net that should rarely trigger.
 */
export async function fetchSite(): Promise<SiteResult> {
  try {
    const content = await request<SiteContent>("/api/site");
    return { content, source: "api" };
  } catch (error) {
    console.warn("Falling back to bundled content snapshot:", error);
    return { content: fallbackContent as SiteContent, source: "fallback" };
  }
}

export async function sendContact(payload: ContactPayload): Promise<{ ok: boolean; message: string }> {
  return request("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export const resumeUrl = `${API_BASE}/api/resume`;
