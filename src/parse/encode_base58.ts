// ========================================
// ENCODE_BASE58
// base58 encode bytes.
//
// base58 is the encoding near uses for hashes, keys and account ids —
// it has no 0, O, I or l, so it survives being read aloud.
//
// this is a plain implementation with no browser globals, so it runs
// the same in node, bun and the browser.
// ========================================

const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

export function encode_base58(bytes: Uint8Array): string {
  let zeros = 0;
  while (zeros < bytes.length && bytes[zeros] === 0) zeros++;

  const digits: number[] = [];
  for (let i = zeros; i < bytes.length; i++) {
    let carry = bytes[i] as number;
    for (let j = 0; j < digits.length; j++) {
      carry += (digits[j] as number) << 8;
      digits[j] = carry % 58;
      carry = (carry / 58) | 0;
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }

  return (
    BASE58_ALPHABET[0]!.repeat(zeros) +
    digits
      .reverse()
      .map((digit) => BASE58_ALPHABET[digit]!)
      .join("")
  );
}
// ========================================
// copyright 2026 by sleet.near
