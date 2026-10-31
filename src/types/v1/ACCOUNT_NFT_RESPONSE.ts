// ========================================
// ACCOUNT_NFT_RESPONSE
// what GET /v1/account/{id}/nft answered with.
// ========================================

import type { ACCOUNT_NFT } from "./ACCOUNT_NFT.js";

export interface ACCOUNT_NFT_RESPONSE {
  account_id: string;
  tokens: ACCOUNT_NFT[];
}
// ========================================
// copyright 2026 by sleet.near
