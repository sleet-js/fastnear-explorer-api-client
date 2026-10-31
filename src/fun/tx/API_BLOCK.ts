// ========================================
// API_BLOCK
// POST /v0/block — one block, by height or hash.
//
// `with_transactions` adds the block's transactions, `with_receipts`
// adds its receipts. both come back as flat rows, not full objects.
//
// note the api returns `block_receipts` even when `with_receipts` is
// not set — it is always present, and may be empty.
// ========================================

import { api_post } from "../../stuff/API_POST";
import type { API_BLOCK_PARAMS } from "../../types/tx/API_BLOCK_PARAMS";
import type { API_BLOCK_RESPONSE } from "../../types/tx/API_BLOCK_RESPONSE";

export async function api_block(
  params: API_BLOCK_PARAMS,
): Promise<API_BLOCK_RESPONSE> {
  const { config, signal, quiet, ...body } = params;
  return api_post<API_BLOCK_RESPONSE>({
    endpoint: "block",
    body,
    config,
    signal,
    quiet,
    label: "TX BLOCK",
  });
}
// ========================================
// copyright 2026 by sleet.near
