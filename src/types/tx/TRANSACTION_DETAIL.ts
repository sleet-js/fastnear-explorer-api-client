// ========================================
// TRANSACTION_DETAIL
// one transaction, fully expanded.
//
// this is what POST /v0/transactions returns for each hash.
//
// `data_receipts` holds Data receipts — the promise payloads. they
// are shaped like receipts but carry no execution outcome.
// ========================================

import type { EXECUTION_OUTCOME } from "./EXECUTION_OUTCOME";
import type { RAW_TRANSACTION } from "./RAW_TRANSACTION";
import type { RECEIPT } from "./RECEIPT";
import type { RECEIPT_WITH_OUTCOME } from "./RECEIPT_WITH_OUTCOME";

export interface TRANSACTION_DETAIL {
  transaction: RAW_TRANSACTION;
  execution_outcome: EXECUTION_OUTCOME;
  receipts: RECEIPT_WITH_OUTCOME[];
  data_receipts: {
    block_height: number;
    block_hash: string;
    block_timestamp: number;
    predecessor_id: string;
    receiver_id: string;
    receipt_id: string;
    receipt_index: number;
    priority: number;
    receipt: { Data: { data_id: string; data: string; is_promise_resume: boolean } };
  }[];
}
// ========================================
// copyright 2026 by sleet.near
