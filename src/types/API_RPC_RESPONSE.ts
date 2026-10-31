// ========================================
// API_RPC_RESPONSE
// the json-rpc envelope.
//
// the `result` is what the query returned. for a call_function that
// is the object holding the RAW BYTES of the answer — the bytes are
// under `result.result`.
// ========================================

export interface API_RPC_RESPONSE<t = unknown> {
  jsonrpc: "2.0";
  id: string;
  result?: t;
  error?: {
    name?: string;
    message?: string;
    cause?: { name?: string };
  };
}
// ========================================
// copyright 2026 by sleet.near
