// ========================================
// API_ACCOUNT_PARAMS
// what POST /v0/account takes.
// ========================================

import type { API_CLIENT_CONFIG } from "../../stuff/API_CLIENT_CONFIG";
import type { ACCOUNT_FILTERS } from "./ACCOUNT_FILTERS";

export interface API_ACCOUNT_PARAMS extends ACCOUNT_FILTERS {
  account_id: string;
  config?: API_CLIENT_CONFIG;
  signal?: AbortSignal;
  // turn the framed call log off.
  quiet?: boolean;
}
// ========================================
// copyright 2026 by sleet.near
