// ========================================
// API_RPC_PARAMS
// what a json-rpc query takes.
// ========================================

export interface API_RPC_PARAMS {
  request_type: string;
  account_id?: string;
  method_name?: string;
  args_base64?: string;
  finality?: "optimistic" | "near-final" | "final";
  block_id?: number;
  block_hash?: string;
}
// ========================================
// copyright 2026 by sleet.near
