// ========================================
// API_PUBLIC_KEY_PARAMS
// what the public key lookups take.
//
// the key goes in the path, so it must be url-encoded by the
// caller — a base58 key is safe, but the spec allows other forms.
// ========================================

import type { API_CLIENT_CONFIG } from "../../stuff/API_CLIENT_CONFIG.js";

export interface API_PUBLIC_KEY_PARAMS {
  public_key: string;
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  // turn the framed call log off.
  quiet?: boolean;
}
// ========================================
// copyright 2026 by sleet.near
