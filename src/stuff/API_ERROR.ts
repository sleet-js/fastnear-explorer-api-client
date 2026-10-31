// ========================================
// API_ERROR
// the error thrown when the api answers with a non-2xx status.
//
// the fastnear api answers failures with PLAIN TEXT, not json —
// "Json deserialize error: missing field `account_id` at line 1
// column 2". the body is kept so the message survives.
// ========================================

export interface API_ERROR extends Error {
  status: number;
  body: string;
}

export function create_api_error(
  status: number,
  status_text: string,
  body: string,
  fallback: string,
): API_ERROR {
  const detail = body.trim();
  const error = new Error(
    detail.length > 0 ? `${fallback}: ${detail}` : `${fallback}: HTTP ${status}`,
  ) as API_ERROR;
  error.name = "API_ERROR";
  error.status = status;
  error.body = body;
  return error;
}
// ========================================
// copyright 2026 by sleet.near
