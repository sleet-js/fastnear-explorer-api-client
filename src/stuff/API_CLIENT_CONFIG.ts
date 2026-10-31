// ========================================
// API_CLIENT_CONFIG
// how to reach the api.
//
// `network` picks the default host for that chain. `base_url`
// overrides the host entirely — useful for a local mock or a proxy.
// ========================================

import type { NETWORK_ID } from "../types/shared/NETWORK_ID";

export interface API_CLIENT_CONFIG {
  network?: NETWORK_ID;
  base_url?: string;
}
// ========================================
// copyright 2026 by sleet.near
