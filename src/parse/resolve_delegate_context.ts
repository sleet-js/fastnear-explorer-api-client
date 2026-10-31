// ========================================
// RESOLVE_DELEGATE_CONTEXT
// work out who really did what in a transaction.
//
// for a normal transaction the answer is the transaction's own signer
// and receiver.
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

import { get_delegate_body } from "./get_delegate_body";
import type { ACTION } from "../types/ACTION";
import type { DELEGATE_CONTEXT } from "../types/DELEGATE_CONTEXT";
import type { RAW_TRANSACTION } from "../types/RAW_TRANSACTION";

export function resolve_delegate_context(
  transaction: RAW_TRANSACTION,
): DELEGATE_CONTEXT {
  const base: DELEGATE_CONTEXT = {
    signer_id: transaction.signer_id,
    receiver_id: transaction.receiver_id,
    relayer_id: null,
    is_delegated: false,
    actions: transaction.actions,
  };

  // only a single delegate action can be delegated — a transaction
  // with several actions is not a relay.
  if (transaction.actions.length !== 1) return base;

  const body = get_delegate_body(transaction.actions[0] as ACTION);
  if (body === null) return base;

  return {
    signer_id: body.sender_id !== "" ? body.sender_id : base.signer_id,
    receiver_id: body.receiver_id !== "" ? body.receiver_id : base.receiver_id,
    relayer_id: transaction.signer_id,
    is_delegated: true,
    actions: body.actions,
  };
}
// ========================================
// copyright 2026 by sleet.near
