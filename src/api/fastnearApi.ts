import type { NetworkId } from "./config";
import { getFastNearBaseUrl } from "./config";

export interface AccountFullState {
  balance: string;
  locked: string;
  storage_bytes: number;
}

export interface AccountFtToken {
  balance: string;
  contract_id: string;
  last_update_block_height: number | null;
}

export interface AccountNft {
  contract_id: string;
  last_update_block_height: number | null;
}

export interface AccountPool {
  pool_id: string;
  last_update_block_height: number | null;
}

export interface AccountFullResponse {
  account_id: string;
  state: AccountFullState | null;
  tokens: AccountFtToken[];
  nfts: AccountNft[];
  pools: AccountPool[];
}

export async function getAccountFull(
  accountId: string,
  networkId: NetworkId = "mainnet",
  signal?: AbortSignal
): Promise<AccountFullResponse | null> {
  const baseUrl = getFastNearBaseUrl(networkId);
  const res = await fetch(`${baseUrl}/v1/account/${accountId}/full`, {
    signal,
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<AccountFullResponse>;
}
