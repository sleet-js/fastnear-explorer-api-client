// ========================================
// RAW_TRANSACTION
// the signed transaction itself.
//
// `public_key` and `signature` are "{curve}:{base58}". `nonce` is a
// number. `priority_fee` is a number.
// ========================================

import type { ACTION } from "./ACTION";

export interface RAW_TRANSACTION {
  signer_id: string;
  public_key: string;
  nonce: number;
  receiver_id: string;
  actions: ACTION[];
  priority_fee: number;
  signature: string;
  hash: string;
}
// ========================================
// copyright 2026 by sleet.near
