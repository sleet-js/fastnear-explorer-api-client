// ========================================
// DECODED_ARGS
// a decoded function call argument.
//
// `bytes` is the raw payload. `text` is the utf-8 reading of it.
// `json` is the parsed json, when the payload IS json — most
// contract arguments are.
//
// `is_printable` says whether the text is human-readable, which is
// what decides between showing the utf-8 and showing hex.
// ========================================

export interface DECODED_ARGS {
  bytes: Uint8Array;
  text: string;
  json: unknown | null;
  is_printable: boolean;
}
// ========================================
// copyright 2026 by sleet.near
