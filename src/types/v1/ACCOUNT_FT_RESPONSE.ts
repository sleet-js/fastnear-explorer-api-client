// ========================================
// ACCOUNT_FT_RESPONSE
// what GET /v1/account/{id}/ft answered with.
// ========================================

import type { ACCOUNT_FT_TOKEN } from "./ACCOUNT_FT_TOKEN.js";

export interface ACCOUNT_FT_RESPONSE {
  account_id: string;
  tokens: ACCOUNT_FT_TOKEN[];
}
// ========================================
// copyright 2026 by sleet.near
