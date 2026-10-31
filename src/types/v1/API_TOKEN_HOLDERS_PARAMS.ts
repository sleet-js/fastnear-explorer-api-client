// ========================================
// API_TOKEN_HOLDERS_PARAMS
// what the top holders lookup takes.
// ========================================

import type { API_CLIENT_CONFIG } from "../../stuff/API_CLIENT_CONFIG.js";

export interface API_TOKEN_HOLDERS_PARAMS {
  token_id: string;
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  // turn the framed call log off.
  quiet?: boolean;
}
// ========================================
// copyright 2026 by sleet.near
