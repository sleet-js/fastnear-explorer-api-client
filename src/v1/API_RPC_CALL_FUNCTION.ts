// ========================================
// API_RPC_CALL_FUNCTION
// call a contract method through the json-rpc node.
//
// the arguments go in as base64 and the result comes back as RAW
// BYTES — an array of byte values, not a base64 string. the bytes
// are decoded straight to text.
//
// `ft_metadata` and `mt_metadata_base_by_token_id` are the two that
// matter for token display:
//   ft_metadata                  -> { spec, name, symbol, decimals, icon }
//   mt_metadata_base_by_token_id -> [{ name, symbol, decimals, icon }]
// ========================================

import { api_rpc_query } from "./API_RPC_QUERY";
import { decode_bytes } from "../parse/decode_bytes";
import { encode_base64 } from "../parse/encode_base64";
import type { API_RPC_CALL_FUNCTION_PARAMS } from "../types/API_RPC_CALL_FUNCTION_PARAMS";
import type { API_RPC_CALL_FUNCTION_RESULT } from "../types/API_RPC_CALL_FUNCTION_RESULT";

export async function api_rpc_call_function<t = unknown>(
  params: API_RPC_CALL_FUNCTION_PARAMS,
): Promise<t | null> {
  const {
    contract_id,
    method_name,
    args = {},
    config,
    signal,
    not_found_as_null,
  } = params;

  const result = await api_rpc_query<API_RPC_CALL_FUNCTION_RESULT>({
    params: {
      request_type: "call_function",
      account_id: contract_id,
      method_name,
      args_base64: encode_base64(JSON.stringify(args)),
    },
    config,
    signal,
    not_found_as_null,
    label: `api_rpc_call_function ${method_name} failed`,
  });

  if (result === null || result.result === undefined) return null;

  const text = decode_bytes(result.result);
  if (text.length === 0) return null;

  return JSON.parse(text) as t;
}
// ========================================
// copyright 2026 by sleet.near
