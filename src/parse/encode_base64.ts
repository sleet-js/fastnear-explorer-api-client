// ========================================
// ENCODE_BASE64
// base64 encode a string.
//
// the mirror of decode_base64 — used to send call_function arguments
// to the rpc node.
// ========================================

const BASE64_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function encode_base64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let result = "";

  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes[i] as number;
    const b = bytes[i + 1];
    const c = bytes[i + 2];

    result += BASE64_ALPHABET[a >> 2];
    result += BASE64_ALPHABET[((a & 0x03) << 4) | ((b ?? 0) >> 4)];
    result += b === undefined ? "=" : BASE64_ALPHABET[((b & 0x0f) << 2) | ((c ?? 0) >> 6)];
    result += c === undefined ? "=" : BASE64_ALPHABET[c & 0x3f];
  }

  return result;
}
// ========================================
// copyright 2026 by sleet.near
