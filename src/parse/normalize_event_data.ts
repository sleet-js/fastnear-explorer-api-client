// ========================================
// NORMALIZE_EVENT_DATA
// the `data` of an event as a list.
//
// the protocol does not fix the shape of `data`:
//   - usually an array of objects
//   - sometimes a single object
//   - sometimes an array of plain strings or booleans
//
// this flattens all of those into one list, so a parser can walk it
// without checking the shape first.
//
// an event with no data gives an empty list.
// ========================================

import type { EVENT_DATA } from "../types/shared/EVENT_DATA.js";
import type { EVENT_JSON } from "../types/shared/EVENT_JSON.js";

export function normalize_event_data(event: EVENT_JSON): EVENT_DATA[] {
  const data = event.data;
  if (data === undefined || data === null) return [];
  if (Array.isArray(data)) return data as EVENT_DATA[];
  return [data as EVENT_DATA];
}
// ========================================
// copyright 2026 by sleet.near
