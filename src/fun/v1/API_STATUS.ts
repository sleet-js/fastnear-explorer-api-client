// ========================================
// API_STATUS
// GET /status — how far the indexer has got.
//
// `sync_block_height` is the indexed height. `sync_latency_sec` is
// how far behind the chain head it is. `sync_balance_block_height`
// is the height the balances are indexed to — balances lag.
//
// this is the call to use to check whether the indexer is keeping up
// before trusting a balance.
// ========================================

import { api_get_path_required } from "../../stuff/API_GET_PATH.js";
import type { API_STATUS_PARAMS } from "../../types/v1/API_STATUS_PARAMS.js";
import type { API_STATUS_RESPONSE } from "../../types/v1/API_STATUS_RESPONSE.js";

export async function api_status(
  params: API_STATUS_PARAMS = {},
): Promise<API_STATUS_RESPONSE> {
  const { config, signal, quiet } = params;
  return api_get_path_required<API_STATUS_RESPONSE>({
    endpoint: "status",
    config,
    signal,
    quiet,
    label: "V1 STATUS",
  });
}
// ========================================
// copyright 2026 by sleet.near
