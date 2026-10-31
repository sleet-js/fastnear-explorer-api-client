// ========================================
// TRY_PARSE_JSON
// parse text as json, or give null.
//
// the contract arguments are usually json. when they are, this gives
// the parsed object for a json view. when they are not — a raw
// string, a binary blob — it gives null and the caller shows the
// bytes instead.
//
// only an object or an array counts. a bare number or string parses
// as json but is not worth calling json in a ui.
//
// a broken payload gives null, never an exception.
// ========================================

export function try_parse_json(text: string): unknown | null {
  const trimmed = text.trim();
  if (trimmed.length === 0) return null;

  // a json object or array starts with { or [ — a bare number or
  // string is not worth calling json.
  const first = trimmed[0];
  if (first !== "{" && first !== "[") return null;

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed;
  } catch {
    return null;
  }
}
// ========================================
// copyright 2026 by sleet.near
