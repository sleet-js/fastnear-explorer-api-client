// ========================================
// STAKE_ACTION
// stakes NEAR from a validator or pool account.
//
// only ever seen on receipt-level actions — the protocol creates them
// itself, a transaction cannot contain one.
// ========================================

export interface STAKE_ACTION {
  stake: string;
  public_key: string;
}
// ========================================
// copyright 2026 by sleet.near
