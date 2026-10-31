// ========================================
// API_BLOCKS_PARAMS
// what POST /v0/blocks takes.
// ========================================

import type { API_CLIENT_CONFIG } from "../../stuff/API_CLIENT_CONFIG.js";
import type { BLOCK_FILTERS } from "./BLOCK_FILTERS.js";

export interface API_BLOCKS_PARAMS extends BLOCK_FILTERS {
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  // turn the framed call log off.
  quiet?: boolean;
}
// ========================================
// copyright 2026 by sleet.near
