// ========================================
// API_CONFIG
// the default configuration.
//
// DEFAULT_NETWORK picks the chain, DEFAULT_BASE_URL overrides the
// host. a caller can override either per call through
// API_CLIENT_CONFIG.
// ========================================

import type { API_CLIENT_CONFIG } from "./API_CLIENT_CONFIG.js";
import type { NETWORK_ID } from "../types/shared/NETWORK_ID.js";

export const DEFAULT_NETWORK: NETWORK_ID = "mainnet";

export const DEFAULT_BASE_URL: string | undefined = undefined;

export const DEFAULT_CONFIG: API_CLIENT_CONFIG = {
  network: DEFAULT_NETWORK,
  base_url: DEFAULT_BASE_URL,
};
// ========================================
// copyright 2026 by sleet.near
