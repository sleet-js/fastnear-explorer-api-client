// ========================================
// API_RECEIPT_RESPONSE
// what POST /v0/receipt answered with.
//
// the receipt body itself is not included — this is the flat row,
// the same shape a block listing carries.
// ========================================

import type { RECEIPT_ROW } from "./RECEIPT_ROW.js";
import type { TRANSACTION_DETAIL } from "./TRANSACTION_DETAIL.js";

export interface API_RECEIPT_RESPONSE {
  receipt: RECEIPT_ROW | null;
  transaction: TRANSACTION_DETAIL | null;
}
// ========================================
// copyright 2026 by sleet.near
