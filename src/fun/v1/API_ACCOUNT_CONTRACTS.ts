// ========================================
// API_ACCOUNT_CONTRACTS
// GET /v0/account/{id}/ft and /v0/account/{id}/nft — the contract
// ids an account holds tokens from.
//
// the v0 paths answer with ids only, which is much lighter than the
// v1 paths. use these when the ids are all you need.
//
// `kind` picks which one: "ft" or "nft".
// ========================================

import { api_get_path } from "../../stuff/API_GET_PATH";
import type { ACCOUNT_CONTRACTS_RESPONSE } from "../../types/v1/ACCOUNT_CONTRACTS_RESPONSE";
import type { API_ACCOUNT_TOKENS_PARAMS } from "../../types/v1/API_ACCOUNT_TOKENS_PARAMS";

export type ACCOUNT_CONTRACT_KIND = "ft" | "nft";

export async function api_account_contracts(
  params: API_ACCOUNT_TOKENS_PARAMS & { kind: ACCOUNT_CONTRACT_KIND },
): Promise<ACCOUNT_CONTRACTS_RESPONSE | null> {
  const { config, signal, account_id, kind, quiet } = params;
  return api_get_path<ACCOUNT_CONTRACTS_RESPONSE>({
    endpoint: kind === "ft" ? "account_contracts_ft" : "account_contracts_nft",
    values: { account_id },
    config,
    signal,
    quiet,
    not_found_as_null: true,
    label: `V1 ACCOUNT CONTRACTS ${kind.toUpperCase()}`,
  });
}
// ========================================
// copyright 2026 by sleet.near
