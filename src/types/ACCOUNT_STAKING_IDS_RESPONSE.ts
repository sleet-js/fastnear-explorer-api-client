// ========================================
// ACCOUNT_STAKING_IDS_RESPONSE
// what GET /v0/account/{id}/staking answered with.
//
// pool ids only — the v1 path adds the update height.
// ========================================

export interface ACCOUNT_STAKING_IDS_RESPONSE {
  account_id: string;
  pools: string[];
}
// ========================================
// copyright 2026 by sleet.near
