// ========================================
// RECEIPT
// one receipt, with the actions it carried.
//
// the inner `receipt` object is either an Action receipt
// (`{ "Action": {...} }`) or a Data receipt
// (`{ "Data": {...} }`). action receipts live in `receipts[]`, data
// receipts live in `data_receipts[]`.
// ========================================

import type { ACTION } from "./ACTION";

export interface RECEIPT {
  block_height: number;
  block_hash: string;
  block_timestamp: number;
  receipt_index: number;
  predecessor_id: string;
  receiver_id: string;
  receipt_id: string;
  priority: number;
  receipt:
    | {
        Action: {
          signer_id: string;
          signer_public_key: string;
          gas_price: string;
          output_data_receivers: unknown[];
          input_data_ids: string[];
          actions: ACTION[];
          is_promise_yield: boolean;
        };
      }
    | {
        Data: {
          data_id: string;
          data: string;
          is_promise_resume: boolean;
        };
      };
}
// ========================================
// copyright 2026 by sleet.near
