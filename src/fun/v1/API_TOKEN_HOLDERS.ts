// ========================================
// API_TOKEN_HOLDERS
// GET /v1/ft/{token_id}/top — the top holders of a fungible token.
//
// biggest balance first. the api answers with up to 100 accounts.
//
// `balance` is a decimal string of the token's smallest unit.
// ========================================

import { api_get_path_required } from "../../stuff/API_GET_PATH";
import type { API_TOKEN_HOLDERS_PARAMS } from "../../types/v1/API_TOKEN_HOLDERS_PARAMS";
import type { TOKEN_HOLDERS_RESPONSE } from "../../types/v1/TOKEN_HOLDERS_RESPONSE";

export async function api_token_holders(
  params: API_TOKEN_HOLDERS_PARAMS,
): Promise<TOKEN_HOLDERS_RESPONSE> {
  const { config, signal, token_id, quiet } = params;
  return api_get_path_required<TOKEN_HOLDERS_RESPONSE>({
    endpoint: "token_top_holders",
    values: { token_id },
    config,
    signal,
    quiet,
    label: "V1 TOKEN HOLDERS",
  });
}
// ========================================
// copyright 2026 by sleet.near
