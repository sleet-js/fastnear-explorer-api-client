// ========================================
// RECEIPT_WITH_OUTCOME
// a receipt together with the outcome of running it.
// ========================================

import type { RECEIPT } from "./RECEIPT";
import type { RECEIPT_OUTCOME } from "./RECEIPT_OUTCOME";

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
