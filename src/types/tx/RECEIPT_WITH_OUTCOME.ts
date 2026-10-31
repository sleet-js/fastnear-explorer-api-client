// ========================================
// RECEIPT_WITH_OUTCOME
// a receipt together with the outcome of running it.
// ========================================

import type { RECEIPT } from "./RECEIPT.js";
import type { RECEIPT_OUTCOME } from "./RECEIPT_OUTCOME.js";

export interface RECEIPT_WITH_OUTCOME {
  execution_outcome: {
    block_hash: string;
    block_timestamp: number;
    block_height: number;
    index: number;
    id: string;
    outcome: RECEIPT_OUTCOME;
  };
  receipt: RECEIPT;
}
// ========================================
// copyright 2026 by sleet.near
