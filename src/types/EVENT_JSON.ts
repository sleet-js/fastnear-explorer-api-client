// ========================================
// EVENT_JSON
// a parsed `EVENT_JSON:` log line.
//
// the api writes contract events into receipt logs as
// "EVENT_JSON:" followed by json. this is the parsed form.
//
// `data` is the event payload. it is usually an array of objects but
// the protocol does not guarantee it — some standards emit a single
// object, some emit an array of plain strings.
//
// `standard` is the token/contract standard name. it is optional
// because some contracts emit events without one.
// ========================================

export interface EVENT_JSON {
  standard?: string;
  version?: string;
  event?: string;
  producer?: string;
  data?: unknown;
  [key: string]: unknown;
}
// ========================================
// copyright 2026 by sleet.near
