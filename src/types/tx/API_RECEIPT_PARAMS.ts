// ========================================
// API_RECEIPT_PARAMS
// what POST /v0/receipt takes.
// ========================================

import type { API_CLIENT_CONFIG } from "../../stuff/API_CLIENT_CONFIG.js";

export interface API_RECEIPT_PARAMS {
  receipt_id: string;
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  // turn the framed call log off.
  quiet?: boolean;
}
// ========================================
// copyright 2026 by sleet.near
