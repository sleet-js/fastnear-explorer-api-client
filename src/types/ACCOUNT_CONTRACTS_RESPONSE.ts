// ========================================
// ACCOUNT_CONTRACTS_RESPONSE
// what the v0 account lookups answered with.
//
// the v0 paths answer with contract ids only — the balances and the
// update heights come from the v1 paths.
// ========================================

export interface ACCOUNT_CONTRACTS_RESPONSE {
  account_id: string;
  contract_ids: string[];
}
// ========================================
// copyright 2026 by sleet.near
