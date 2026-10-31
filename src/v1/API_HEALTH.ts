// ========================================
// API_HEALTH
// GET /health — is the service up.
//
// this is the cheapest call there is — no parameters, no account.
// ========================================

import { api_get_path_required } from "../stuff/API_GET_PATH";
import type { API_STATUS_PARAMS } from "../types/API_STATUS_PARAMS";
import type { HEALTH_RESPONSE } from "../types/HEALTH_RESPONSE";

export async function api_health(
  params: API_STATUS_PARAMS = {},
): Promise<HEALTH_RESPONSE> {
  const { config, signal } = params;
  return api_get_path_required<HEALTH_RESPONSE>({
    endpoint: "health",
    config,
    signal,
    label: "api_health failed",
  });
}
// ========================================
// copyright 2026 by sleet.near
