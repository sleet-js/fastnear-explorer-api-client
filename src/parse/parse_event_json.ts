// ========================================
// PARSE_EVENT_JSON
// read an `EVENT_JSON:` log line.
//
// contracts write their events into receipt logs as the literal
// prefix "EVENT_JSON:" followed by json. this pulls the json out and
// parses it.
//
// returns null for a log that is not an event, or whose json is
// broken. a broken log must not take down the whole parse.
// ========================================

import type { EVENT_JSON } from "../types/shared/EVENT_JSON";

export const EVENT_JSON_PREFIX = "EVENT_JSON:";

export function parse_event_json(log: string): EVENT_JSON | null {
  if (!log.startsWith(EVENT_JSON_PREFIX)) return null;

  const payload = log.slice(EVENT_JSON_PREFIX.length).trim();
  if (payload.length === 0) return null;

  try {
    const parsed: unknown = JSON.parse(payload);
    if (typeof parsed !== "object" || parsed === null) return null;
    if (Array.isArray(parsed)) return null;
    return parsed as EVENT_JSON;
  } catch {
    return null;
  }
}
// ========================================
// copyright 2026 by sleet.near
