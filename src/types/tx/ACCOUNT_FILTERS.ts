// ========================================
// ACCOUNT_FILTERS
// the filters POST /v0/account accepts.
//
// every is_* flag narrows the history to transactions where the
// account was involved in that way.
// ========================================

export interface ACCOUNT_FILTERS {
  is_signer?: boolean;
  is_delegated_signer?: boolean;
  is_real_signer?: boolean;
  is_any_signer?: boolean;
  is_predecessor?: boolean;
  is_explicit_refund_to?: boolean;
  is_receiver?: boolean;
  is_real_receiver?: boolean;
  is_function_call?: boolean;
  is_action_arg?: boolean;
  is_event_log?: boolean;
  is_success?: boolean;
  from_tx_block_height?: number;
  to_tx_block_height?: number;
  desc?: boolean;
  limit?: number;
  resume_token?: string;
}
// ========================================
// copyright 2026 by sleet.near
