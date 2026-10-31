// ========================================
// API_ACCOUNT_TOKENS_PARAMS
// what the account token and pool lookups take.
//
// the account id goes in the path.
// ========================================

import type { API_CLIENT_CONFIG } from "../../stuff/API_CLIENT_CONFIG.js";

export interface API_ACCOUNT_TOKENS_PARAMS {
  account_id: string;
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  // turn the framed call log off.
  quiet?: boolean;
}
// ========================================
// copyright 2026 by sleet.near
