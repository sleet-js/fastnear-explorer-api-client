import { fetchApi, type ApiClientConfig } from "./client";
import type {
  BlocksResponse,
  BlockDetailResponse,
  TransactionsResponse,
  AccountResponse,
  AccountFilters,
} from "./types";

export function getBlocks(
  params: { limit?: number; desc?: boolean; to_block_height?: number; from_block_height?: number } = {},
  config?: ApiClientConfig
): Promise<BlocksResponse> {
  return fetchApi<BlocksResponse>("blocks", params, config);
}

export function getBlock(
  blockId: string | number,
  opts: { with_transactions?: boolean } = {},
  config?: ApiClientConfig
): Promise<BlockDetailResponse> {
  return fetchApi<BlockDetailResponse>("block", { block_id: blockId, ...opts }, config);
}

export function getTransactions(
  txHashes: string[],
  config?: ApiClientConfig
): Promise<TransactionsResponse> {
  return fetchApi<TransactionsResponse>("transactions", {
    tx_hashes: txHashes,
  }, config);
}

export function getAccount(
  accountId: string,
  filters: { resume_token?: string; limit?: number } & AccountFilters = {},
  config?: ApiClientConfig
): Promise<AccountResponse> {
  return fetchApi<AccountResponse>("account", {
    account_id: accountId,
    ...filters,
  }, config);
}
