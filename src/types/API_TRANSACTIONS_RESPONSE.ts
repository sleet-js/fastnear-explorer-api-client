// ========================================
// API_TRANSACTIONS_RESPONSE
// what POST /v0/transactions answered with.
// ========================================

import type { TRANSACTION_DETAIL } from "./TRANSACTION_DETAIL";

export interface API_TRANSACTIONS_RESPONSE {
  transactions: TRANSACTION_DETAIL[];
}
// ========================================
// copyright 2026 by sleet.near
