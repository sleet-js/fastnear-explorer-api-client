// ========================================
// API_RPC_CALL_FUNCTION_PARAMS
// what api_rpc_call_function takes.
// ========================================

import type { API_CLIENT_CONFIG } from "../../stuff/API_CLIENT_CONFIG";

export interface API_RPC_CALL_FUNCTION_PARAMS {
  contract_id: string;
  method_name: string;
  args?: Record<string, unknown>;
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  // turn the framed call log off.
  quiet?: boolean;
  not_found_as_null?: boolean;
}
// ========================================
// copyright 2026 by sleet.near
