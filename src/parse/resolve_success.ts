// ========================================
// RESOLVE_SUCCESS
// did the transaction succeed?
//
// the answer is tri-state:
//   true  — it succeeded
//   false — it failed
//   null  — it has not finished yet
//
// "SuccessReceiptId" means the work moved on to another receipt, so
// the chain is followed: the receipt it names is looked up in the
// receipt list and ITS status decides.
//
// the chain can be more than one link long — a receipt can hand off
// to a receipt that hands off again. this walks it to the end,
// with a depth cap so a malformed chain cannot loop forever.
// ========================================

import type { EXECUTION_STATUS } from "../types/EXECUTION_STATUS";
import type { RECEIPT_WITH_OUTCOME } from "../types/RECEIPT_WITH_OUTCOME";
import type { TRANSACTION_DETAIL } from "../types/TRANSACTION_DETAIL";

const MAX_CHAIN_DEPTH = 32;

export function resolve_success(tx: TRANSACTION_DETAIL): boolean | null {
  const by_id = new Map<string, RECEIPT_WITH_OUTCOME>();
  for (const receipt of tx.receipts) {
    by_id.set(receipt.receipt.receipt_id, receipt);
  }

  let status: EXECUTION_STATUS = tx.execution_outcome.outcome.status;

  for (let depth = 0; depth < MAX_CHAIN_DEPTH; depth++) {
    if ("Failure" in status) return false;
    if ("SuccessValue" in status) return true;
    if (!("SuccessReceiptId" in status)) return null;

    const next = by_id.get(status.SuccessReceiptId);
    if (next === undefined) return null;
    status = next.execution_outcome.outcome.status;
  }

  return null;
}
// ========================================
// copyright 2026 by sleet.near
