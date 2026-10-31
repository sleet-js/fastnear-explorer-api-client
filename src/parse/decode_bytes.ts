// ========================================
// DECODE_BYTES
// raw bytes to a utf-8 string.
//
// the rpc node answers a contract call with the result as an array
// of RAW BYTES, not as base64. so the bytes go straight through the
// text decoder.
//
// this is deliberately separate from decode_base64_bytes, which
// decodes a base64 STRING. mixing the two up is easy — the base64
// decoder would treat each byte as a character code and silently
// produce an empty string.
// ========================================

export function decode_bytes(input: number[] | Uint8Array): string {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}
// ========================================
// copyright 2026 by sleet.near
