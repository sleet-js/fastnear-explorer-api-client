// ========================================
// ENDPOINTS
// the hosts for every fastnear service this client talks to.
// ========================================

import type { NETWORK_ID } from "../types/shared/NETWORK_ID.js";

export const ENDPOINTS = {
  mainnet: {
    tx: "https://tx.main.fastnear.com",
    api: "https://api.fastnear.com",
    rpc: "https://rpc.mainnet.fastnear.com",
  },
  testnet: {
    tx: "https://tx.test.fastnear.com",
    api: "https://test.api.fastnear.com",
    rpc: "https://rpc.testnet.fastnear.com",
  },
} as const satisfies Record<NETWORK_ID, { tx: string; api: string; rpc: string }>;
// ========================================
// copyright 2026 by sleet.near
