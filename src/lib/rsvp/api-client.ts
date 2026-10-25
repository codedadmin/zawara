import type { Rsvp, RsvpInput, WeekKey } from "./types";

const ENDPOINT = "/api/rsvps";
const RETRY_DELAY_MS = 800;

/** status 0 means the request never reached the server (offline, DNS, etc). */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get isRetryable(): boolean {
    return this.status === 0 || this.status >= 500;
  }
}

export function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch (err) {
    if (isAbortError(err)) throw err;
    throw new ApiError("Can't reach the family list. Check your connection.", 0);
  }

  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok) {
    throw new ApiError(body?.error ?? `Something went wrong (${res.status}).`, res.status);
  }
  return body as T;
}

export async function fetchRsvps(week: WeekKey, signal?: AbortSignal): Promise<Rsvp[]> {
  const { rsvps } = await request<{ rsvps: Rsvp[] }>(
    `${ENDPOINT}?week=${encodeURIComponent(week)}`,
    { signal },
  );
  return rsvps;
}

/** Saves (creates or updates) an answer. Retries once on a flaky connection. */
export async function saveRsvp(week: WeekKey, input: RsvpInput): Promise<Rsvp> {
  const send = () =>
    request<{ rsvp: Rsvp }>(ENDPOINT, {
      method: "PUT",
      body: JSON.stringify({ week, ...input }),
    }).then((body) => body.rsvp);

  try {
    return await send();
  } catch (err) {
    if (!(err instanceof ApiError) || !err.isRetryable) throw err;
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS + Math.random() * RETRY_DELAY_MS));
    return send();
  }
}
