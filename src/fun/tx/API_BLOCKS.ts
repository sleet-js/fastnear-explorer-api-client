// ========================================
// API_BLOCKS
// POST /v0/blocks — a bounded list of blocks.
//
// the api caps the list at 100 blocks per call. `from_block_height`
// and `to_block_height` narrow the range; `desc` flips the order.
//
// without `desc` the answer comes back OLDEST first, starting from
// the first block ever. pass `desc: true` for the newest.
// ========================================

import { api_post } from "../../stuff/API_POST";
import type { API_BLOCKS_PARAMS } from "../../types/tx/API_BLOCKS_PARAMS";
import type { API_BLOCKS_RESPONSE } from "../../types/tx/API_BLOCKS_RESPONSE";

export async function api_blocks(
  params: API_BLOCKS_PARAMS = {},
): Promise<API_BLOCKS_RESPONSE> {
  const { config, signal, quiet, ...filters } = params;
  return api_post<API_BLOCKS_RESPONSE>({
    endpoint: "blocks",
    body: filters,
    config,
    signal,
    quiet,
    label: "TX BLOCKS",
  });
}
// ========================================
// copyright 2026 by sleet.near
