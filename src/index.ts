// FastNear Explorer API Client
// Reusable client library for FastNear Explorer API

// Configuration
export {
  ENDPOINTS,
  networkId,
  apiBaseUrl,
  getFastNearBaseUrl,
  type NetworkId,
} from "./api/config";

// API Client
export { fetchApi, type ApiClientConfig } from "./api/client";

// v0 API Endpoints
export {
  getBlocks,
  getBlock,
  getTransactions,
  getAccount,
} from "./api/endpoints";

// v1 FastNear API
export { getAccountFull } from "./api/fastnearApi";
export type {
  AccountFullState,
  AccountFtToken,
  AccountNft,
  AccountPool,
  AccountFullResponse,
} from "./api/fastnearApi";

// Types
export type {
  BlockHeader,
  BlocksResponse,
  BlockTx,
  BlockDetailResponse,
  TransactionDetail,
  TransactionAction,
  ExecutionOutcome,
  ReceiptWithOutcome,
  TransactionsResponse,
  AccountTx,
  AccountResponse,
  BlockFilters,
  AccountFilters,
} from "./api/types";
