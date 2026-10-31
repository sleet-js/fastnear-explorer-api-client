// ========================================
// API_STATUS_PARAMS
// what the status and health lookups take.
// ========================================

import type { API_CLIENT_CONFIG } from "../../stuff/API_CLIENT_CONFIG.js";

export interface API_STATUS_PARAMS {
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  // turn the framed call log off.
  quiet?: boolean;
}
// ========================================
// copyright 2026 by sleet.near
