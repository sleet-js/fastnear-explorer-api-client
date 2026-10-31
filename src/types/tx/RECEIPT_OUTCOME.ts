// ========================================
// RECEIPT_OUTCOME
// the execution outcome of one receipt.
// ========================================

import type { EXECUTION_STATUS } from "./EXECUTION_STATUS.js";

export interface RECEIPT_OUTCOME {
  logs: string[];
  receipt_ids: string[];
  gas_burnt: number;
  tokens_burnt: string;
  executor_id: string;
  status: EXECUTION_STATUS;
  metadata?: {
    version: number;
    gas_profile: unknown;
    contracts?: (null | { local?: string; global_hash?: string })[];
  };
}
// ========================================
// copyright 2026 by sleet.near
