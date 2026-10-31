// ========================================
// API_ACCOUNT_FULL
// GET /v1/account/{id}/full — the account overview.
//
// one call gives the balance, the storage used, whether there is a
// contract, and every ft / nft / staking pool the account holds.
//
// this is the v1 api on api.fastnear.com, not the v0 tx api.
//
// an account that does not exist answers 404, which comes back as
// null rather than an exception.
// ========================================

import { api_base_url } from "../stuff/API_BASE_URL";
import { api_get } from "../stuff/API_GET";
import type { API_ACCOUNT_FULL_PARAMS } from "../types/API_ACCOUNT_FULL_PARAMS";
import type { ACCOUNT_FULL } from "../types/ACCOUNT_FULL";

export async function api_account_full(
  params: API_ACCOUNT_FULL_PARAMS,
): Promise<ACCOUNT_FULL | null> {
  const { config, signal, account_id } = params;
  const url = `${api_base_url("api", config)}/v1/account/${account_id}/full`;
  return api_get<ACCOUNT_FULL>({
    url,
    config,
    signal,
    not_found_as_null: true,
    label: "api_account_full failed",
  });
}
// ========================================
// copyright 2026 by sleet.near
