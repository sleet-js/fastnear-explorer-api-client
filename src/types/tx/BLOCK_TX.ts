// ========================================
// BLOCK_TX
// one transaction as it appears in a block listing.
//
// a flat summary row — the full nested transaction is only available
// from POST /v0/transactions.
// ========================================

export interface BLOCK_TX {
  transaction_hash: string;
  signer_id: string;
  receiver_id: string;
  real_signer_id: string;
  real_receiver_id: string;
  tx_block_height: number;
  tx_block_timestamp: string;
  tx_index: number;
  gas_burnt: number;
  is_success: boolean;
  is_completed: boolean;
  is_relayed: boolean;
  tokens_burnt: string;
  shard_id: number;
  nonce: number;
  priority_fee: number;
  signer_public_key: string;
  tx_block_hash: string;
  last_block_height: number;
}
// ========================================
// copyright 2026 by sleet.near
