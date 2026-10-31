// ========================================
// API_BASE_URL
// the host of one of the fastnear services for a given network.
//
// `service` picks which one:
//   "tx"  — the v0 transaction api
//   "api" — the v1 account api
//   "rpc" — the json-rpc node
// ========================================

import type { API_CLIENT_CONFIG } from "./API_CLIENT_CONFIG";
import { ENDPOINTS } from "./ENDPOINTS";
import type { NETWORK_ID } from "../types/NETWORK_ID";

export type SERVICE = "tx" | "api" | "rpc";

export function api_base_url(
  service: SERVICE,
  config: API_CLIENT_CONFIG = {},
): string {
  if (config.base_url !== undefined) return config.base_url;
  const network: NETWORK_ID = config.network ?? "mainnet";
  return ENDPOINTS[network][service];
}
// ========================================
// copyright 2026 by sleet.near
