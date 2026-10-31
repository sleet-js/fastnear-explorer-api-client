// ========================================
// API_ACCOUNT_FULL
// GET /v1/account/{id}/full — the account overview.
//
// one call gives the balance, the storage used, whether there is a
// contract, and every ft / nft / staking pool the account holds.
//
// an account that does not exist answers 404, which comes back as
// null rather than an exception.
// ========================================

import { api_get_path } from "../../stuff/API_GET_PATH";
import type { ACCOUNT_FULL } from "../../types/v1/ACCOUNT_FULL";
import type { API_ACCOUNT_FULL_PARAMS } from "../../types/v1/API_ACCOUNT_FULL_PARAMS";

export async function api_account_full(
  params: API_ACCOUNT_FULL_PARAMS,
): Promise<ACCOUNT_FULL | null> {
  const { config, signal, account_id, quiet } = params;
  return api_get_path<ACCOUNT_FULL>({
    endpoint: "account_full",
    values: { account_id },
    config,
    signal,
    quiet,
    not_found_as_null: true,
    label: "V1 ACCOUNT FULL",
  });
}
// ========================================
// copyright 2026 by sleet.near
