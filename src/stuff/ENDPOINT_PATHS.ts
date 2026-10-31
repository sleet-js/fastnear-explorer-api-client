// ========================================
// ENDPOINT_PATHS
// the path for every endpoint the tx api exposes. one key per
// endpoint so the path is written down exactly once.
//
// note the api is POST-only — every endpoint takes a json body.
// ========================================

export const ENDPOINT_PATHS = {
  blocks: "/v0/blocks",
  block: "/v0/block",
  transactions: "/v0/transactions",
  account: "/v0/account",
  receipt: "/v0/receipt",
} as const;

export type ENDPOINT_KEY = keyof typeof ENDPOINT_PATHS;
// ========================================
// copyright 2026 by sleet.near
