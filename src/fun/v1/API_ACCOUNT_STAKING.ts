// ========================================
// API_ACCOUNT_STAKING
// GET /v1/account/{id}/staking — the staking pools an account is
// delegated to.
//
// the same rows as the `pools` field of api_account_full, without
// the rest of the account.
// ========================================

import { api_get_path } from "../../stuff/API_GET_PATH.js";
import type { ACCOUNT_STAKING_RESPONSE } from "../../types/v1/ACCOUNT_STAKING_RESPONSE.js";
import type { API_ACCOUNT_TOKENS_PARAMS } from "../../types/v1/API_ACCOUNT_TOKENS_PARAMS.js";

export async function api_account_staking(
  params: API_ACCOUNT_TOKENS_PARAMS,
): Promise<ACCOUNT_STAKING_RESPONSE | null> {
  const { config, signal, account_id, quiet } = params;
  return api_get_path<ACCOUNT_STAKING_RESPONSE>({
    endpoint: "account_staking",
    values: { account_id },
    config,
    signal,
    quiet,
    not_found_as_null: true,
    label: "V1 ACCOUNT STAKING",
  });
}
// ========================================
// copyright 2026 by sleet.near
