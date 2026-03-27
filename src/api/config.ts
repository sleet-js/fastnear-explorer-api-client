/**
 * Network configuration for FastNear API client
 */
export type NetworkId = "mainnet" | "testnet";

/**
 * Default endpoints for FastNear
 */
export const ENDPOINTS = {
  mainnet: {
    api: "https://tx.main.fastnear.com",
    fastnear: "https://api.fastnear.com",
  },
  testnet: {
    api: "https://tx.test.fastnear.com",
    fastnear: "https://test.api.fastnear.com",
  },
} as const;

/**
 * Default network (mainnet)
 */
export const networkId: NetworkId = "mainnet";

/**
 * Default API base URL
 */
export const apiBaseUrl = ENDPOINTS.mainnet.api;

/**
 * Get the FastNear API base URL for v1 endpoints
 * @param networkId - Network to connect to
 * @returns FastNear API base URL
 */
export function getFastNearBaseUrl(nid: NetworkId = "mainnet"): string {
  return ENDPOINTS[nid].fastnear;
}
