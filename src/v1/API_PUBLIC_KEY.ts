// ========================================
// API_PUBLIC_KEY
// GET /v1/public_key/{key} — the accounts that registered a key.
//
// THE ANSWER TO "which accounts share this key?".
//
// `include_all` picks the lookup:
//   false (default) — full-access keys only
//   true            — full-access AND limited (function-call) keys
//
// the key may be any of the forms the protocol uses:
//
//   ed25519:…  secp256k1:…  ml-dsa-65:…  ml-dsa-65-hash:…
//
// an account with no key registered answers with an empty list —
// that is not an error.
// ========================================

import { api_get_path_required } from "../stuff/API_GET_PATH";
import type { API_PUBLIC_KEY_PARAMS } from "../types/API_PUBLIC_KEY_PARAMS";
import type { PUBLIC_KEY_LOOKUP_RESPONSE } from "../types/PUBLIC_KEY_LOOKUP_RESPONSE";

export interface API_PUBLIC_KEY_PARAMS_EXTENDED extends API_PUBLIC_KEY_PARAMS {
  include_all?: boolean;
  // use the legacy v0 path instead of the v1 one.
  legacy?: boolean;
}

export async function api_public_key(
  params: API_PUBLIC_KEY_PARAMS_EXTENDED,
): Promise<PUBLIC_KEY_LOOKUP_RESPONSE> {
  const { config, signal, public_key, include_all = false, legacy = false } =
    params;

  const endpoint = legacy
    ? include_all
      ? "public_key_v0_all"
      : "public_key_v0"
    : include_all
      ? "public_key_all"
      : "public_key";

  return api_get_path_required<PUBLIC_KEY_LOOKUP_RESPONSE>({
    endpoint,
    values: { public_key },
    config,
    signal,
    label: "api_public_key failed",
  });
}
// ========================================
// copyright 2026 by sleet.near
