// ========================================
// V1_ENDPOINT_PATHS
// the path for every endpoint the V1 api exposes.
//
// the v1 api is GET-only — the parameters are in the path.
//
// there are two generations of path on this api. the v0 paths answer
// with contract ids only, the v1 paths answer with full rows.
//
// one key per endpoint so the path is written down exactly once.
// ========================================

export const V1_ENDPOINT_PATHS = {
  health: "/health",
  status: "/status",

  account_full: "/v1/account/{account_id}/full",
  account_ft: "/v1/account/{account_id}/ft",
  account_nft: "/v1/account/{account_id}/nft",
  account_staking: "/v1/account/{account_id}/staking",

  account_contracts_ft: "/v0/account/{account_id}/ft",
  account_contracts_nft: "/v0/account/{account_id}/nft",
  account_staking_ids: "/v0/account/{account_id}/staking",

  public_key: "/v1/public_key/{public_key}",
  public_key_all: "/v1/public_key/{public_key}/all",
  public_key_v0: "/v0/public_key/{public_key}",
  public_key_v0_all: "/v0/public_key/{public_key}/all",

  token_top_holders: "/v1/ft/{token_id}/top",
} as const;

export type V1_ENDPOINT_KEY = keyof typeof V1_ENDPOINT_PATHS;
// ========================================
// copyright 2026 by sleet.near
