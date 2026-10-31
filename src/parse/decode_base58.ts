// ========================================
// DECODE_BASE58
// base58 decode a string back to bytes.
//
// the inverse of encode_base58. returns null when the string holds a
// character outside the base58 alphabet.
// ========================================

const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const BASE58_MAP = new Map<string, number>(
  [...BASE58_ALPHABET].map((char, index) => [char, index]),
);

export function decode_base58(text: string): Uint8Array | null {
  const bytes: number[] = [];

  for (const char of text) {
    const value = BASE58_MAP.get(char);
    if (value === undefined) return null;
    let carry = value;
    for (let j = 0; j < bytes.length; j++) {
      carry += (bytes[j] as number) * 58;
      bytes[j] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }

  for (const char of text) {
    if (char !== "1") break;
    bytes.push(0);
  }

  return new Uint8Array(bytes.reverse());
}
// ========================================
// copyright 2026 by sleet.near
