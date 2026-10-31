// ========================================
// API_LOG
// the framed log block every call prints.
//
// the format is the one the middleman packages use:
//
//   =============================
//    LABEL via POST on: https://...
//   RESPONSE STATUS: 200 - OK
//   RESPONSE: { ... }
//   =============================
//
// a failed call prints the same frame with FAILED and the error
// instead of the response.
//
// THE LOG IS ON BY DEFAULT. pass `quiet: true` to turn it off —
// a library that prints on every call is unusable inside a server
// or a ui, so the caller decides.
// ========================================

export interface API_LOG_PARAMS {
  // the uppercase name of the call — "TX BLOCKS".
  label: string;
  // the url the call went to.
  url: string;
  // the http method.
  method: string;
  // the status and status text.
  status: number;
  status_text: string;
  // the parsed response body.
  response?: unknown;
  // the error message, for a failed call.
  error?: string;
}

// the frame marker.
const FRAME = "=============================";

export function api_log({
  label,
  url,
  method,
  status,
  status_text,
  response,
  error,
}: API_LOG_PARAMS): void {
  const failed = error !== undefined;
  console.log(FRAME);
  console.log(
    ` ${label} ${failed ? "FAILED on:" : `via ${method} on:`}`,
    url,
  );
  console.log("RESPONSE STATUS:", `${status} - ${status_text}`);
  if (failed) {
    console.log("ERROR:", error);
  } else {
    console.log("RESPONSE:", response);
  }
  console.log(FRAME);
}
// ========================================
// copyright 2026 by sleet.near
