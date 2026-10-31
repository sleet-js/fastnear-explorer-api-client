// ========================================
// API_TRANSACTIONS_PARAMS
// what POST /v0/transactions takes.
//
// at most 20 hashes per call — the api rejects more.
// ========================================

import type { API_CLIENT_CONFIG } from "../stuff/API_CLIENT_CONFIG";

export interface API_TRANSACTIONS_PARAMS {
  tx_hashes: string[];
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
}
// ========================================
// copyright 2026 by sleet.near
