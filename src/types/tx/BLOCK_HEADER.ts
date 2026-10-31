// ========================================
// BLOCK_HEADER
// one block's header row.
//
// matches the upstream openapi spec field for field.
// `block_timestamp` is a nanosecond STRING here, but a number in a
// receipt's block_timestamp — the api is not consistent about it.
// ========================================

export interface BLOCK_HEADER {
  block_height: number;
  block_hash: string;
  prev_block_hash: string;
  prev_block_height: number | null;
  block_timestamp: string;
  block_ordinal: number | null;
  gas_price: string;
  gas_burnt: string;
  total_supply: string;
  author_id: string;
  num_transactions: number;
  num_receipts: number;
  chunks_included: number;
  epoch_id: string;
  next_epoch_id: string;
  protocol_version: number;
  tokens_burnt: string;
}
// ========================================
// copyright 2026 by sleet.near
