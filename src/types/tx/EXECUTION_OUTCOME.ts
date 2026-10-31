// ========================================
// EXECUTION_OUTCOME
// the outcome of running a transaction.
// ========================================

import type { RECEIPT_OUTCOME } from "./RECEIPT_OUTCOME.js";

export interface EXECUTION_OUTCOME {
  block_hash: string;
  block_timestamp: number;
  block_height: number;
  index: number;
  id: string;
  outcome: RECEIPT_OUTCOME;
}
// ========================================
// copyright 2026 by sleet.near
