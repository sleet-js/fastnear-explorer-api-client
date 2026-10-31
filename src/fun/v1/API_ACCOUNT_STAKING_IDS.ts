// ========================================
// API_ACCOUNT_STAKING_IDS
// GET /v0/account/{id}/staking — the staking pool ids an account
// is delegated to.
//
// the v0 path answers with ids only, which is lighter than the v1
// path.
// ========================================

import { api_get_path } from "../../stuff/API_GET_PATH.js";
import type { ACCOUNT_STAKING_IDS_RESPONSE } from "../../types/v1/ACCOUNT_STAKING_IDS_RESPONSE.js";
import type { API_ACCOUNT_TOKENS_PARAMS } from "../../types/v1/API_ACCOUNT_TOKENS_PARAMS.js";

export async function api_account_staking_ids(
  params: API_ACCOUNT_TOKENS_PARAMS,
): Promise<ACCOUNT_STAKING_IDS_RESPONSE | null> {
  const { config, signal, account_id, quiet } = params;
  return api_get_path<ACCOUNT_STAKING_IDS_RESPONSE>({
    endpoint: "account_staking_ids",
    values: { account_id },
    config,
    signal,
    quiet,
    not_found_as_null: true,
    label: "V1 ACCOUNT STAKING IDS",
  });
}
// ========================================
// copyright 2026 by sleet.near
