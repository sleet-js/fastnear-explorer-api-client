// ========================================
// IS_EVENT_DATA_OBJECT
// is this event datum a plain object?
//
// the nep141 / nep171 / nep245 events always put objects in `data`,
// but other standards put strings there. the token parsers only look
// at objects, so they check with this first.
// ========================================

export function is_event_data_object(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
// ========================================
// copyright 2026 by sleet.near
