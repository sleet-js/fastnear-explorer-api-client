// ========================================
// API_HEALTH
// GET /health — is the service up.
//
// this is the cheapest call there is — no parameters, no account.
// ========================================

import { api_get_path_required } from "../../stuff/API_GET_PATH.js";
import type { API_STATUS_PARAMS } from "../../types/v1/API_STATUS_PARAMS.js";
import type { HEALTH_RESPONSE } from "../../types/v1/HEALTH_RESPONSE.js";

export async function api_health(
  params: API_STATUS_PARAMS = {},
): Promise<HEALTH_RESPONSE> {
  const { config, signal, quiet } = params;
  return api_get_path_required<HEALTH_RESPONSE>({
    endpoint: "health",
    config,
    signal,
    quiet,
    label: "V1 HEALTH",
  });
}
// ========================================
// copyright 2026 by sleet.near
