// ========================================
// BYTES_TO_HEX
// bytes as a hex string.
//
// this is the hex view of a decoded argument — one byte per pair of
// hex digits, separated by a space so the pairs are readable.
//
//   bytes_to_hex(new Uint8Array([0, 255]))  ->  "00 ff"
// ========================================

export function bytes_to_hex(bytes: Uint8Array): string {
  const parts: string[] = [];
  for (const byte of bytes) {
    parts.push(byte.toString(16).padStart(2, "0"));
  }
  return parts.join(" ");
}
// ========================================
// copyright 2026 by sleet.near
