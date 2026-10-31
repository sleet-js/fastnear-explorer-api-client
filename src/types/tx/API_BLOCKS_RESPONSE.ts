// ========================================
// API_BLOCKS_RESPONSE
// the blocks a POST /v0/blocks call answered with.
// ========================================

import type { BLOCK_HEADER } from "./BLOCK_HEADER.js";

export interface API_BLOCKS_RESPONSE {
  blocks: BLOCK_HEADER[];
}
// ========================================
// copyright 2026 by sleet.near
