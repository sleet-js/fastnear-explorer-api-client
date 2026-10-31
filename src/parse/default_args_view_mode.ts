// ========================================
// DEFAULT_ARGS_VIEW_MODE
// the view to open a decoded argument on.
//
//   json  — the payload IS json, so show it structured
//   raw   — the payload is printable text, so show it as text
//   hex   — the payload is binary, so show the bytes
// ========================================

import type { ARGS_VIEW_MODE } from "../types/shared/ARGS_VIEW_MODE";

export function default_args_view_mode(
  has_json: boolean,
  is_printable: boolean,
): ARGS_VIEW_MODE {
  if (has_json) return "json";
  if (is_printable) return "raw";
  return "hex";
}
// ========================================
// copyright 2026 by sleet.near
