// ========================================
// ACCOUNT_STAKING_RESPONSE
// what GET /v1/account/{id}/staking answered with.
// ========================================

import type { ACCOUNT_POOL } from "./ACCOUNT_POOL.js";

export interface ACCOUNT_STAKING_RESPONSE {
  account_id: string;
  pools: ACCOUNT_POOL[];
}
// ========================================
// copyright 2026 by sleet.near
