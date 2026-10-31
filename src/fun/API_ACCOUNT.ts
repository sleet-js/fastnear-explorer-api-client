// ========================================
// API_ACCOUNT
// POST /v0/account — one account's transaction history.
//
// the history is paginated with `resume_token`: pass the token from
// the previous page to get the next one. a page without a token is
// the last page.
//
// the is_* filters narrow the history — see ACCOUNT_FILTERS.
// ========================================

import { api_post } from "../stuff/API_POST";
import type { API_ACCOUNT_PARAMS } from "../types/API_ACCOUNT_PARAMS";
import type { API_ACCOUNT_RESPONSE } from "../types/API_ACCOUNT_RESPONSE";

export async function api_account(
  params: API_ACCOUNT_PARAMS,
): Promise<API_ACCOUNT_RESPONSE> {
  const { config, signal, ...body } = params;
  return api_post<API_ACCOUNT_RESPONSE>({
    endpoint: "account",
    body,
    config,
    signal,
    label: "api_account failed",
  });
}
// ========================================
// copyright 2026 by sleet.near
