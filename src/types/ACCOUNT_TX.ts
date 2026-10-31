// ========================================
// ACCOUNT_TX
// one transaction as it appears in an account's history.
//
// the is_* flags say how the account was involved. `is_real_signer`
// is the one to trust for "did this account actually send it" —
// `is_signer` is also true for a relayer.
// ========================================

export interface ACCOUNT_TX {
  account_id: string;
  transaction_hash: string;
  tx_block_height: number;
  tx_block_timestamp: string;
  tx_index: number;
  is_success: boolean;
  is_signer: boolean;
  is_receiver: boolean;
  is_real_signer: boolean;
  is_real_receiver: boolean;
  is_predecessor: boolean;
  is_function_call: boolean;
  is_any_signer: boolean;
  is_delegated_signer: boolean;
  is_event_log: boolean;
  is_action_arg: boolean;
  is_explicit_refund_to: boolean;
}
// ========================================
// copyright 2026 by sleet.near
