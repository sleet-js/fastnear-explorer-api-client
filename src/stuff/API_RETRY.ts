// ========================================
// API_RETRY
// the retry helper for a request the api rate limited.
//
// the fastnear api answers 429 when too many requests arrive at once:
//   { "error": { "code": -429, "message": "Rate limits exceeded..." } }
//
// this waits and tries again, with a delay that grows each time.
//
// the delay is randomised a little so many callers do not all wake
// up at the same moment.
// ========================================

export interface API_RETRY_OPTIONS {
  // how many times to try in total, including the first try.
  attempts?: number;
  // the wait before the first retry, in ms. it doubles each time.
  base_delay_ms?: number;
  // the ceiling for the wait.
  max_delay_ms?: number;
  // the statuses worth retrying.
  retry_statuses?: number[];
}

export const DEFAULT_RETRY_OPTIONS: Required<API_RETRY_OPTIONS> = {
  attempts: 4,
  base_delay_ms: 400,
  max_delay_ms: 4000,
  retry_statuses: [429, 502, 503, 504],
};

export async function api_retry<t>(
  run: () => Promise<t>,
  options: API_RETRY_OPTIONS = {},
): Promise<t> {
  const attempts = options.attempts ?? DEFAULT_RETRY_OPTIONS.attempts;
  const base_delay = options.base_delay_ms ?? DEFAULT_RETRY_OPTIONS.base_delay_ms;
  const max_delay = options.max_delay_ms ?? DEFAULT_RETRY_OPTIONS.max_delay_ms;
  const retry_statuses =
    options.retry_statuses ?? DEFAULT_RETRY_OPTIONS.retry_statuses;

  let last_error: unknown;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await run();
    } catch (error) {
      last_error = error;

      const status = read_status(error);
      const can_retry =
        status !== null && retry_statuses.includes(status) && attempt < attempts - 1;

      if (!can_retry) throw error;

      const delay = Math.min(base_delay * 2 ** attempt, max_delay);
      const jitter = Math.floor(Math.random() * 100);
      await sleep(delay + jitter);
    }
  }

  throw last_error;
}

function read_status(error: unknown): number | null {
  if (typeof error !== "object" || error === null) return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// ========================================
// copyright 2026 by sleet.near
