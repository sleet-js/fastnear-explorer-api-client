// ========================================
// BASE58_FROM_BASE64
// turn a base64 string into its base58 form.
//
// used for DeployContract, where the api carries the code hash as
// base64 but near displays it as base58.
//
// returns null when the input is not valid base64.
// ========================================

import { decode_base64_bytes_raw } from "./decode_base64_bytes_raw";
import { encode_base58 } from "./encode_base58";

const BASE64_CHARS = /^[A-Za-z0-9+/]*={0,2}$/;

export function base58_from_base64(base64: string): string | null {
  if (base64.length === 0) return null;
  if (!BASE64_CHARS.test(base64)) return null;

  // decode to raw bytes, not to text — a code hash is not utf-8.
  const bytes = decode_base64_bytes_raw(base64);
  if (bytes === null) return null;
  return encode_base58(bytes);
}
// ========================================
// copyright 2026 by sleet.near
