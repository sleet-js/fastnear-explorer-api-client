// ========================================
// API_BLOCK_RESPONSE
// what POST /v0/block answered with.
//
// `block_receipts` is always present — the api returns it even when
// `with_receipts` was not asked for. it is just empty then.
// ========================================

import type { BLOCK_HEADER } from "./BLOCK_HEADER.js";
import type { BLOCK_TX } from "./BLOCK_TX.js";
import type { RECEIPT_ROW } from "./RECEIPT_ROW.js";

export interface API_BLOCK_RESPONSE {
  block: BLOCK_HEADER;
  block_txs: BLOCK_TX[];
  block_receipts: RECEIPT_ROW[];
}
// ========================================
// copyright 2026 by sleet.near
