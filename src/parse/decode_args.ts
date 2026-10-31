// ========================================
// DECODE_ARGS
// decode a function call's base64 `args`.
//
// a contract call carries its arguments as a base64 string. this
// turns that into something renderable:
//
//   const decoded = decode_args(action.args);
//   decoded.text    // the utf-8 text
//   decoded.json    // the parsed json, when it is json
//   decoded.bytes   // the raw bytes
//
// an empty or malformed input gives an empty result rather than
// throwing — a broken argument must not take the parse down.
//
// the contract arguments are usually json, so `json` is usually
// filled in. when the payload is not json it is null and the bytes
// are still there for a hex or base64 view.
// ========================================

import { decode_base64_bytes } from "./decode_base64";
import { is_printable_text } from "./is_printable_text";
import { try_parse_json } from "./try_parse_json";
import type { DECODED_ARGS } from "../types/shared/DECODED_ARGS";

export function decode_args(base64: string | undefined | null): DECODED_ARGS {
  const empty: DECODED_ARGS = {
    bytes: new Uint8Array(),
    text: "",
    json: null,
    is_printable: true,
  };

  if (base64 === undefined || base64 === null || base64.length === 0) {
    return empty;
  }

  const text = decode_base64_bytes(base64);

  return {
    bytes: new TextEncoder().encode(text),
    text,
    json: try_parse_json(text),
    is_printable: is_printable_text(text),
  };
}
// ========================================
// copyright 2026 by sleet.near
