// ========================================
// API_RPC_QUERY
// the json-rpc node, for the things the explorer api does not serve.
//
// the node speaks json-rpc 2.0 with a single "query" method:
//
//   { "jsonrpc": "2.0", "id": "1", "method": "query",
//     "params": { "request_type": "view_account", ... } }
//
// the three request types used here:
//   view_account          — balance, storage, code hash
//   view_access_key_list  — the account's access keys
//   call_function         — call a contract method (base64 in/out)
//
// this is the same node the fastnear frontend uses, so token
// metadata can be fetched from here when it is needed.
//
// THE NODE ANSWERS A FAILURE WITH HTTP 200 AND A JSON-RPC ERROR
// BODY. so the http status alone does not say what went wrong — the
// error code inside the body does. that code is put on the thrown
// error as `status`, so the retry helper can act on it.
// ========================================

import { api_base_url } from "../../stuff/API_BASE_URL";
import { create_api_error } from "../../stuff/API_ERROR";
import { api_log } from "../../stuff/API_LOG";
import { api_retry } from "../../stuff/API_RETRY";
import type { API_RPC_CALL_PARAMS } from "../../types/v1/API_RPC_CALL_PARAMS";
import type { API_RPC_RESPONSE } from "../../types/v1/API_RPC_RESPONSE";

export async function api_rpc_query<t = unknown>({
  params,
  config = {},
  signal,
  label,
  quiet = false,
  not_found_as_null = false,
}: API_RPC_CALL_PARAMS): Promise<t | null> {
  const url = api_base_url("rpc", config);
  const call_label = label ?? `RPC ${params.request_type.toUpperCase()}`;

  return api_retry(
    async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "1",
          method: "query",
          params: { finality: "final", ...params },
        }),
        signal,
      });

      const json = (await response.json()) as API_RPC_RESPONSE<t>;

      if (!response.ok || json.error !== undefined) {
        const cause = json.error?.cause?.name;
        if (not_found_as_null && cause === "UNKNOWN_ACCOUNT") {
          if (!quiet) {
            api_log({
              label: call_label,
              url,
              method: "POST",
              status: response.status,
              status_text: response.statusText,
              response: null,
            });
          }
          return null;
        }

        // the node answers 200 with an error body, so the http
        // status says nothing. use the code inside the body.
        const code = read_error_code(json);
        const error = create_api_error(
          code ?? response.status,
          response.statusText,
          json.error?.message ?? JSON.stringify(json.error),
          `${call_label.toLowerCase()} failed`,
        );

        if (!quiet) {
          api_log({
            label: call_label,
            url,
            method: "POST",
            status: error.status,
            status_text: response.statusText,
            error: error.message,
          });
        }

        throw error;
      }

      const result = json.result ?? null;

      if (!quiet) {
        api_log({
          label: call_label,
          url,
          method: "POST",
          status: response.status,
          status_text: response.statusText,
          response: result,
        });
      }

      return result;
    },
    { attempts: 3 },
  );
}

// the json-rpc error body carries a numeric code, sometimes negative
// (-429 for a rate limit). the absolute value is what matters.
function read_error_code(json: API_RPC_RESPONSE<unknown>): number | null {
  const error = json.error as { code?: unknown } | undefined;
  if (typeof error?.code !== "number") return null;
  return Math.abs(error.code);
}
// ========================================
// copyright 2026 by sleet.near
