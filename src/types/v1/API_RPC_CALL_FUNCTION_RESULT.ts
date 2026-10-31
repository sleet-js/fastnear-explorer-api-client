// ========================================
// API_RPC_CALL_FUNCTION_RESULT
// what a call_function answer holds.
//
// `result` is the RAW BYTES of the answer, not a base64 string.
// ========================================

export interface API_RPC_CALL_FUNCTION_RESULT {
  block_hash: string;
  block_height: number;
  logs: string[];
  result: number[];
}
// ========================================
// copyright 2026 by sleet.near
