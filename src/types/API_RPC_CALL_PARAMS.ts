// ========================================
// API_RPC_CALL_PARAMS
// what api_rpc_query takes.
// ========================================

import type { API_CLIENT_CONFIG } from "../stuff/API_CLIENT_CONFIG";
import type { API_RPC_PARAMS } from "./API_RPC_PARAMS";

export interface API_RPC_CALL_PARAMS {
  params: API_RPC_PARAMS;
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  label?: string;
  /** when true, an UNKNOWN_ACCOUNT error resolves to null instead of throwing */
  not_found_as_null?: boolean;
}
// ========================================
// copyright 2026 by sleet.near
