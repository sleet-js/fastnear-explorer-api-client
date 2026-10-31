// ========================================
// API_ACCOUNT_NFT
// GET /v1/account/{id}/nft — the nft contracts an account holds
// tokens from.
//
// the same rows as the `nfts` field of api_account_full, without
// the rest of the account.
// ========================================

import { api_get_path } from "../stuff/API_GET_PATH";
import type { ACCOUNT_NFT_RESPONSE } from "../types/ACCOUNT_NFT_RESPONSE";
import type { API_ACCOUNT_TOKENS_PARAMS } from "../types/API_ACCOUNT_TOKENS_PARAMS";

export async function api_account_nft(
  params: API_ACCOUNT_TOKENS_PARAMS,
): Promise<ACCOUNT_NFT_RESPONSE | null> {
  const { config, signal, account_id } = params;
  return api_get_path<ACCOUNT_NFT_RESPONSE>({
    endpoint: "account_nft",
    values: { account_id },
    config,
    signal,
    not_found_as_null: true,
    label: "api_account_nft failed",
  });
}
// ========================================
// copyright 2026 by sleet.near
