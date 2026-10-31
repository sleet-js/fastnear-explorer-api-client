// ========================================
// DELEGATE_CONTEXT
// who really did what in a transaction.
//
// for a normal transaction the answer is the transaction's own
// signer and receiver.
//
// for a RELAYED transaction the outer signer is the RELAYER — the
// account that paid the gas and submitted the transaction. the real
// economic actor is the delegate body's sender_id, and the real
// receiver is its receiver_id.
//
// so a delegated transaction reports:
//   signer_id    -> the delegate's sender (the real actor)
//   receiver_id  -> the delegate's receiver
//   relayer_id   -> the transaction's signer
//
// this is what makes the red "relayed by" badge on a transaction row
// show the right account.
// ========================================

import type { ACTION } from "../tx/ACTION.js";

export interface DELEGATE_CONTEXT {
  signer_id: string;
  receiver_id: string;
  relayer_id: string | null;
  is_delegated: boolean;
  actions: ACTION[];
}
// ========================================
// copyright 2026 by sleet.near
