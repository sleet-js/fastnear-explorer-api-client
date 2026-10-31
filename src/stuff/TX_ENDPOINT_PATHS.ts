// ========================================
// TX_ENDPOINT_PATHS
// the path for every endpoint the TX api exposes.
//
// the tx api is POST-only — every endpoint takes a json body.
//
// one key per endpoint so the path is written down exactly once.
// ========================================

export const TX_ENDPOINT_PATHS = {
  blocks: "/v0/blocks",
  block: "/v0/block",
  transactions: "/v0/transactions",
  account: "/v0/account",
  receipt: "/v0/receipt",
} as const;

export type TX_ENDPOINT_KEY = keyof typeof TX_ENDPOINT_PATHS;
// ========================================
// copyright 2026 by sleet.near
