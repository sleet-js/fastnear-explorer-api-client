// ========================================
// RECEIPT_ROW
// one receipt as it appears in a block listing.
//
// a flat row — the receipt body itself is not included here, only
// where it came from and who it ran for.
// ========================================

export interface RECEIPT_ROW {
  receipt_id: string;
  block_height: number;
  block_timestamp: string;
  receipt_index: number;
  appear_block_height: number;
  appear_receipt_index: number;
  transaction_hash: string;
  tx_block_height: number;
  tx_block_timestamp: string;
  tx_index: number;
  predecessor_id: string;
  receiver_id: string;
  receipt_type: string;
  priority: number;
  shard_id: number;
  is_success: boolean;
}
// ========================================
// copyright 2026 by sleet.near
