// ========================================
// API_ACCOUNT_FT
// GET /v1/account/{id}/ft — the fungible tokens an account holds.
//
// the same rows as the `tokens` field of api_account_full, without
// the rest of the account.
// ========================================

import { api_get_path } from "../stuff/API_GET_PATH";
import type { ACCOUNT_FT_RESPONSE } from "../types/ACCOUNT_FT_RESPONSE";
import type { API_ACCOUNT_TOKENS_PARAMS } from "../types/API_ACCOUNT_TOKENS_PARAMS";

export async function api_account_ft(
  params: API_ACCOUNT_TOKENS_PARAMS,
): Promise<ACCOUNT_FT_RESPONSE | null> {
  const { config, signal, account_id } = params;
  return api_get_path<ACCOUNT_FT_RESPONSE>({
    endpoint: "account_ft",
    values: { account_id },
    config,
    signal,
    not_found_as_null: true,
    label: "api_account_ft failed",
  });
}
// ========================================
// copyright 2026 by sleet.near
