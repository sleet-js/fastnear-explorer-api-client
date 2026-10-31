// ========================================
// RESOLVE_TOTAL_GAS
// the total gas a transaction burnt.
//
// the transaction's own gas plus the gas of every receipt it
// spawned. a transaction that does a lot of work pays for the
// receipts too, so the row total is the sum of both.
//
// gas is a number in the api — it is Tgas scaled by 1e12, so the
// values fit in a js number without loss.
// ========================================

import type { TRANSACTION_DETAIL } from "../types/tx/TRANSACTION_DETAIL.js";

export function resolve_total_gas(tx: TRANSACTION_DETAIL): number {
  let total = tx.execution_outcome.outcome.gas_burnt;
  for (const receipt of tx.receipts) {
    total += receipt.execution_outcome.outcome.gas_burnt;
  }
  return total;
}
// ========================================
// copyright 2026 by sleet.near
