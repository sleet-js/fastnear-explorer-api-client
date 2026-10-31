// ========================================
// ACCOUNT_FULL_STATE
// the balance/storage part of an account's overview.
//
// `balance` and `locked` are decimal strings of yoctoNEAR.
// ========================================

export interface ACCOUNT_FULL_STATE {
  balance: string;
  locked: string;
  storage_bytes: number;
}
// ========================================
// copyright 2026 by sleet.near
