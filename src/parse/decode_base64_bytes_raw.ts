// ========================================
// DECODE_BASE64_BYTES_RAW
// base64 to RAW BYTES.
//
// `decode_base64_bytes` gives the utf-8 TEXT of a base64 string, and
// `decode_args` re-encodes that text back into bytes. the round trip
// is LOSSY for anything that is not valid utf-8: a byte sequence
// that is not utf-8 becomes U+FFFD, and the bytes come back
// different and longer.
//
// that is fine for a json argument, which is what the text decoder
// is for. it is NOT fine for FastFS, whose payload is a borsh blob
// holding a file's bytes — a png is not utf-8 and must survive the
// decode untouched.
//
// this decoder keeps the bytes as they are. it is the one a binary
// payload needs.
// ========================================

const BASE64_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const BASE64_MAP = new Map<string, number>(
  [...BASE64_ALPHABET].map((char, index) => [char, index]),
);

/**
 * the raw bytes of a base64 string. null when the input is not
 * base64.
 */
export function decode_base64_bytes_raw(base64: string): Uint8Array | null {
  if (base64.length === 0) return new Uint8Array();

  const clean = base64.replace(/[\r\n\s]/g, "");
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i += 4) {
    const chunk = [0, 1, 2, 3].map((offset) => {
      const char = clean[i + offset];
      if (char === undefined || char === "=") return -1;
      return BASE64_MAP.get(char) ?? -1;
    });

    const [a, b, c, d] = chunk as [number, number, number, number];
    if (a < 0) return null;

    bytes.push(((a << 2) | (b >> 4)) & 0xff);
    if (c >= 0) bytes.push((((b & 0x0f) << 4) | (c >> 2)) & 0xff);
    if (d >= 0) bytes.push((((c & 0x03) << 6) | d) & 0xff);
  }

  return new Uint8Array(bytes);
}
// ========================================
// copyright 2026 by sleet.near
