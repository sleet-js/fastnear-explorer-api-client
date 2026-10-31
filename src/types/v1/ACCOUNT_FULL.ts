// ========================================
// ACCOUNT_FULL
// the full overview of one account.
//
// this is what GET /v1/account/{id}/full returns. `state` is null for
// an account that does not exist.
// ========================================

import type { ACCOUNT_FT_TOKEN } from "./ACCOUNT_FT_TOKEN";
import type { ACCOUNT_NFT } from "./ACCOUNT_NFT";
import type { ACCOUNT_POOL } from "./ACCOUNT_POOL";
import type { ACCOUNT_FULL_STATE } from "./ACCOUNT_FULL_STATE";

export interface ACCOUNT_FULL {
  account_id: string;
  state: ACCOUNT_FULL_STATE | null;
  tokens: ACCOUNT_FT_TOKEN[];
  nfts: ACCOUNT_NFT[];
  pools: ACCOUNT_POOL[];
}
// ========================================
// copyright 2026 by sleet.near
