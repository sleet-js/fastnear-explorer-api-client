// ========================================
// EXECUTION_STATUS
// the outcome status of a transaction or receipt.
//
// three shapes, all single-key:
//
//   { "SuccessValue": "" }                  — done, no value returned
//   { "SuccessReceiptId": "<receipt_id>" }  — done, another receipt runs
//   { "Failure": { "ActionError": {...} } } — failed
//
// "SuccessReceiptId" means the work continues in another receipt, so
// a transaction is only truly finished when that receipt is too.
// resolve_success walks that chain.
// ========================================

import type { ACTION_ERROR } from "./ACTION_ERROR";

export type EXECUTION_STATUS =
  | { SuccessValue: string }
  | { SuccessReceiptId: string }
  | { Failure: { ActionError: ACTION_ERROR } };
// ========================================
// copyright 2026 by sleet.near
