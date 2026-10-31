// ========================================
// API_ACCOUNT_FULL_PARAMS
// what GET /v1/account/{id}/full takes.
// ========================================

import type { API_CLIENT_CONFIG } from "../stuff/API_CLIENT_CONFIG";

export interface API_ACCOUNT_FULL_PARAMS {
  account_id: string;
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
}
// ========================================
// copyright 2026 by sleet.near
