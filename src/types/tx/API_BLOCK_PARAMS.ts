// ========================================
// API_BLOCK_PARAMS
// what POST /v0/block takes.
// ========================================

import type { API_CLIENT_CONFIG } from "../../stuff/API_CLIENT_CONFIG.js";

export interface API_BLOCK_PARAMS {
  block_id: string | number;
  with_transactions?: boolean;
  with_receipts?: boolean;
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  // turn the framed call log off.
  quiet?: boolean;
}
// ========================================
// copyright 2026 by sleet.near
