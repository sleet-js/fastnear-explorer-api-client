// ========================================
// BASE58_FROM_BASE64
// turn a base64 string into its base58 form.
//
// used for DeployContract, where the api carries the code hash as
// base64 but near displays it as base58.
//
// returns null when the input is not valid base64.
// ========================================

import { decode_base64_bytes } from "./decode_base64";
import { encode_base58 } from "./encode_base58";

const BASE64_CHARS = /^[A-Za-z0-9+/]*={0,2}$/;

export function base58_from_base64(base64: string): string | null {
  if (base64.length === 0) return null;
  if (!BASE64_CHARS.test(base64)) return null;

  // decode to raw bytes, not to text — a code hash is not utf-8.
  const bytes = base64_to_bytes(base64);
  if (bytes === null) return null;
  return encode_base58(bytes);
}

function base64_to_bytes(base64: string): Uint8Array | null {
  const clean = base64.replace(/[\r\n\s]/g, "");
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const map = new Map<string, number>(
    [...alphabet].map((char, index) => [char, index]),
  );

  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const chunk = [0, 1, 2, 3].map((offset) => {
      const char = clean[i + offset];
      if (char === undefined || char === "=") return -1;
      return map.get(char) ?? -1;
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
