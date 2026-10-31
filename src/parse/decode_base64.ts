// ========================================
// DECODE_BASE64
// base64 decode without the browser's atob.
//
// the rpc node answers call_function with raw bytes, and contract
// actions carry their arguments as base64 strings. atob only exists
// in a browser, so this is done by hand to keep the package usable
// in node and bun too.
// ========================================

const BASE64_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const BASE64_MAP = new Map<string, number>(
  [...BASE64_ALPHABET].map((char, index) => [char, index]),
);

export function decode_base64_bytes(input: number[] | string): string {
  const text =
    typeof input === "string"
      ? input
      : String.fromCharCode(...input);

  const clean = text.replace(/[\r\n\s]/g, "");
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i += 4) {
    const chunk = [0, 1, 2, 3].map((offset) => {
      const char = clean[i + offset];
      if (char === undefined || char === "=") return -1;
      return BASE64_MAP.get(char) ?? -1;
    });

    const [a, b, c, d] = chunk as [number, number, number, number];
    if (a < 0) break;

    bytes.push(((a << 2) | (b >> 4)) & 0xff);
    if (c >= 0) bytes.push((((b & 0x0f) << 4) | (c >> 2)) & 0xff);
    if (d >= 0) bytes.push((((c & 0x03) << 6) | d) & 0xff);
  }

  return new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes));
}
// ========================================
// copyright 2026 by sleet.near
