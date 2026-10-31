// ========================================
// API_ACCOUNT_RESPONSE
// what POST /v0/account answered with.
//
// `resume_token` is how the history pages. a page without a token
// is the last page.
// ========================================

import type { ACCOUNT_TX } from "./ACCOUNT_TX.js";

export interface API_ACCOUNT_RESPONSE {
  account_txs: ACCOUNT_TX[];
  resume_token?: string;
  txs_count: number;
}
// ========================================
// copyright 2026 by sleet.near
