// ========================================
// FASTNEAR EXPLORER API CLIENT
// a typed client for the fastnear explorer api.
//
// three layers:
//   fun/   — one file per endpoint. this is the api surface.
//   stuff/ — the shared plumbing every endpoint goes through.
//   parse/ — the transaction parser. pure, no network, no dom.
//   types/ — the types, one per file.
//
// THE PARSER HAS ONE ENTRY POINT:
//
//   parse_transaction(tx)            — the built-in parsers
//   parse_transaction(tx, { plugins }) — plus your own
//
// see src/parse/parse_transaction.ts for how to add a custom
// parser.
// ========================================

// --- configuration ------------------------------------------------
export { ENDPOINTS } from "./stuff/ENDPOINTS.js";
export {
  TX_ENDPOINT_PATHS,
  type TX_ENDPOINT_KEY,
} from "./stuff/TX_ENDPOINT_PATHS.js";
export {
  V1_ENDPOINT_PATHS,
  type V1_ENDPOINT_KEY,
} from "./stuff/V1_ENDPOINT_PATHS.js";
export {
  DEFAULT_CONFIG,
  DEFAULT_NETWORK,
  DEFAULT_BASE_URL,
} from "./stuff/API_CONFIG.js";
export { api_base_url, type SERVICE } from "./stuff/API_BASE_URL.js";
export { create_api_error, type API_ERROR } from "./stuff/API_ERROR.js";
export type { API_CLIENT_CONFIG } from "./stuff/API_CLIENT_CONFIG.js";
export type { NETWORK_ID as NETWORK } from "./types/shared/NETWORK_ID.js";

// --- the tx api ---------------------------------------------------
export { api_blocks } from "./fun/tx/API_BLOCKS.js";
export { api_block } from "./fun/tx/API_BLOCK.js";
export {
  api_transactions,
  TRANSACTIONS_BATCH_SIZE,
} from "./fun/tx/API_TRANSACTIONS.js";
export { api_account } from "./fun/tx/API_ACCOUNT.js";
export { api_receipt } from "./fun/tx/API_RECEIPT.js";

// --- the v1 api ---------------------------------------------------
export { api_health } from "./fun/v1/API_HEALTH.js";
export { api_status } from "./fun/v1/API_STATUS.js";
export { api_account_full } from "./fun/v1/API_ACCOUNT_FULL.js";
export { api_account_ft } from "./fun/v1/API_ACCOUNT_FT.js";
export { api_account_nft } from "./fun/v1/API_ACCOUNT_NFT.js";
export { api_account_staking } from "./fun/v1/API_ACCOUNT_STAKING.js";
export {
  api_account_contracts,
  type ACCOUNT_CONTRACT_KIND,
} from "./fun/v1/API_ACCOUNT_CONTRACTS.js";
export { api_account_staking_ids } from "./fun/v1/API_ACCOUNT_STAKING_IDS.js";
export {
  api_public_key,
  type API_PUBLIC_KEY_PARAMS_EXTENDED,
} from "./fun/v1/API_PUBLIC_KEY.js";
export { api_token_holders } from "./fun/v1/API_TOKEN_HOLDERS.js";

// --- the rpc node -------------------------------------------------
export { api_rpc_query } from "./fun/v1/API_RPC_QUERY.js";
export { api_rpc_call_function } from "./fun/v1/API_RPC_CALL_FUNCTION.js";

// --- the parser ---------------------------------------------------
export { parse_transaction } from "./parse/parse_transaction.js";
export { parse_action } from "./parse/parse_action.js";
export { get_action_type } from "./parse/get_action_type.js";
export { get_action_payload } from "./parse/get_action_payload.js";
export { get_delegate_body } from "./parse/get_delegate_body.js";
export { is_delegate_action } from "./parse/is_delegate_action.js";
export { resolve_delegate_context } from "./parse/resolve_delegate_context.js";
export { resolve_success } from "./parse/resolve_success.js";
export { resolve_total_gas } from "./parse/resolve_total_gas.js";
export { parse_event_json, EVENT_JSON_PREFIX } from "./parse/parse_event_json.js";
export { normalize_event_data } from "./parse/normalize_event_data.js";
export { collect_events } from "./parse/collect_events.js";
export { normalize_owner } from "./parse/normalize_owner.js";
export { is_event_data_object } from "./parse/is_event_data_object.js";

// --- the parser registry ------------------------------------------
export { DEFAULT_PARSER_REGISTRY } from "./parse/registry/DEFAULT_PARSER_REGISTRY.js";
export { create_parser_registry } from "./parse/registry/create_parser_registry.js";
export { register_parser } from "./parse/registry/register_parser.js";
export { DEFAULT_PLUGINS } from "./parse/plugins/DEFAULT_PLUGINS.js";
export { plugin_near_transfer } from "./parse/plugins/PLUGIN_NEAR_TRANSFER.js";
export { plugin_nep141_transfer } from "./parse/plugins/PLUGIN_NEP141_TRANSFER.js";
export { plugin_nep245_transfer } from "./parse/plugins/PLUGIN_NEP245_TRANSFER.js";
export { plugin_nep171_nft_transfer } from "./parse/plugins/PLUGIN_NEP171_NFT_TRANSFER.js";
export { plugin_delete_account_transfer } from "./parse/plugins/PLUGIN_DELETE_ACCOUNT_TRANSFER.js";

// --- formatting ---------------------------------------------------
export { format_near } from "./parse/format_near.js";
export { format_near_with_unit } from "./parse/format_near_with_unit.js";
export { format_gas } from "./parse/format_gas.js";
export { format_token_amount } from "./parse/format_token_amount.js";
export { time_ago } from "./parse/time_ago.js";
export { parse_public_key } from "./parse/parse_public_key.js";
export { truncate_public_key_data } from "./parse/truncate_public_key_data.js";
export { encode_base58 } from "./parse/encode_base58.js";
export { decode_base58 } from "./parse/decode_base58.js";
export { decode_bytes } from "./parse/decode_bytes.js";
export { encode_base64 } from "./parse/encode_base64.js";
export { decode_base64_bytes } from "./parse/decode_base64.js";
export { base58_from_base64 } from "./parse/base58_from_base64.js";

// --- types --------------------------------------------------------
export type { ACTION } from "./types/tx/ACTION.js";
export type { UNIT_ACTION } from "./types/tx/UNIT_ACTION.js";
export type { ENVELOPED_ACTION } from "./types/tx/ENVELOPED_ACTION.js";
export type { RAW_ACTION } from "./types/tx/RAW_ACTION.js";
export type { ACTION_TYPE } from "./types/tx/ACTION_TYPE.js";
export type { ADD_KEY_ACTION } from "./types/tx/ADD_KEY_ACTION.js";
export type { DELEGATE_ACTION } from "./types/tx/DELEGATE_ACTION.js";
export type { DELEGATE_ACTION_BODY } from "./types/tx/DELEGATE_ACTION_BODY.js";
export type { DELETE_ACCOUNT_ACTION } from "./types/tx/DELETE_ACCOUNT_ACTION.js";
export type { DELETE_KEY_ACTION } from "./types/tx/DELETE_KEY_ACTION.js";
export type { DEPLOY_CONTRACT_ACTION } from "./types/tx/DEPLOY_CONTRACT_ACTION.js";
export type { FUNCTION_CALL_ACTION } from "./types/tx/FUNCTION_CALL_ACTION.js";
export type { STAKE_ACTION } from "./types/tx/STAKE_ACTION.js";
export type { TRANSFER_ACTION } from "./types/tx/TRANSFER_ACTION.js";
export type { USE_GLOBAL_CONTRACT_ACTION } from "./types/tx/USE_GLOBAL_CONTRACT_ACTION.js";
export type { ACCESS_KEY } from "./types/tx/ACCESS_KEY.js";
export type { ACCESS_KEY_PERMISSION } from "./types/tx/ACCESS_KEY_PERMISSION.js";
export type { FUNCTION_CALL_PERMISSION } from "./types/tx/FUNCTION_CALL_PERMISSION.js";
export type { ACTION_ERROR } from "./types/tx/ACTION_ERROR.js";
export type { ERROR_KIND } from "./types/tx/ERROR_KIND.js";
export type { EXECUTION_STATUS } from "./types/tx/EXECUTION_STATUS.js";
export type { EXECUTION_OUTCOME } from "./types/tx/EXECUTION_OUTCOME.js";
export type { RECEIPT } from "./types/tx/RECEIPT.js";
export type { RECEIPT_OUTCOME } from "./types/tx/RECEIPT_OUTCOME.js";
export type { RECEIPT_WITH_OUTCOME } from "./types/tx/RECEIPT_WITH_OUTCOME.js";
export type { RECEIPT_ROW } from "./types/tx/RECEIPT_ROW.js";
export type { RAW_TRANSACTION } from "./types/tx/RAW_TRANSACTION.js";
export type { TRANSACTION_DETAIL } from "./types/tx/TRANSACTION_DETAIL.js";
export type { BLOCK_HEADER } from "./types/tx/BLOCK_HEADER.js";
export type { BLOCK_TX } from "./types/tx/BLOCK_TX.js";
export type { BLOCK_FILTERS } from "./types/tx/BLOCK_FILTERS.js";
export type { ACCOUNT_TX } from "./types/tx/ACCOUNT_TX.js";
export type { ACCOUNT_FILTERS } from "./types/tx/ACCOUNT_FILTERS.js";
export type { ACCOUNT_FULL } from "./types/v1/ACCOUNT_FULL.js";
export type { ACCOUNT_FULL_STATE } from "./types/v1/ACCOUNT_FULL_STATE.js";
export type { ACCOUNT_FT_TOKEN } from "./types/v1/ACCOUNT_FT_TOKEN.js";
export type { ACCOUNT_NFT } from "./types/v1/ACCOUNT_NFT.js";
export type { ACCOUNT_POOL } from "./types/v1/ACCOUNT_POOL.js";
export type { PARSED_ACTION } from "./types/shared/PARSED_ACTION.js";
export type { PARSED_PUBLIC_KEY } from "./types/shared/PARSED_PUBLIC_KEY.js";
export type { PARSE_RESULT } from "./types/shared/PARSE_RESULT.js";
export type { PARSER_CONTEXT } from "./types/shared/PARSER_CONTEXT.js";
export type { PARSER_OPTIONS } from "./types/shared/PARSER_OPTIONS.js";
export type { PARSER_REGISTRY } from "./types/shared/PARSER_REGISTRY.js";
export type { TRANSFER_PARSER } from "./types/shared/TRANSFER_PARSER.js";
export type { TRANSFER_INFO } from "./types/shared/TRANSFER_INFO.js";
export type { NFT_TRANSFER_INFO } from "./types/shared/NFT_TRANSFER_INFO.js";
export type { CUSTOM_TRANSFER } from "./types/shared/CUSTOM_TRANSFER.js";
export type { TOKEN_TYPE } from "./types/shared/TOKEN_TYPE.js";
export type { EVENT_JSON } from "./types/shared/EVENT_JSON.js";
export type { EVENT_DATA } from "./types/shared/EVENT_DATA.js";
export type { DELEGATE_CONTEXT } from "./types/shared/DELEGATE_CONTEXT.js";
export type { COLLECTED_EVENT } from "./types/shared/COLLECTED_EVENT.js";
export type { API_RPC_RESPONSE } from "./types/v1/API_RPC_RESPONSE.js";
export type { API_RPC_PARAMS } from "./types/v1/API_RPC_PARAMS.js";
export type { API_RPC_CALL_PARAMS } from "./types/v1/API_RPC_CALL_PARAMS.js";
export type { API_RPC_CALL_FUNCTION_PARAMS } from "./types/v1/API_RPC_CALL_FUNCTION_PARAMS.js";
export type { API_RPC_CALL_FUNCTION_RESULT } from "./types/v1/API_RPC_CALL_FUNCTION_RESULT.js";
export type { API_BLOCKS_RESPONSE } from "./types/tx/API_BLOCKS_RESPONSE.js";
export type { API_BLOCKS_PARAMS } from "./types/tx/API_BLOCKS_PARAMS.js";
export type { API_BLOCK_RESPONSE } from "./types/tx/API_BLOCK_RESPONSE.js";
export type { API_BLOCK_PARAMS } from "./types/tx/API_BLOCK_PARAMS.js";
export type { API_TRANSACTIONS_RESPONSE } from "./types/tx/API_TRANSACTIONS_RESPONSE.js";
export type { API_TRANSACTIONS_PARAMS } from "./types/tx/API_TRANSACTIONS_PARAMS.js";
export type { API_ACCOUNT_RESPONSE } from "./types/tx/API_ACCOUNT_RESPONSE.js";
export type { API_ACCOUNT_PARAMS } from "./types/tx/API_ACCOUNT_PARAMS.js";
export type { API_RECEIPT_RESPONSE } from "./types/tx/API_RECEIPT_RESPONSE.js";
export type { API_RECEIPT_PARAMS } from "./types/tx/API_RECEIPT_PARAMS.js";
export type { API_ACCOUNT_FULL_PARAMS } from "./types/v1/API_ACCOUNT_FULL_PARAMS.js";
export type { API_ACCOUNT_TOKENS_PARAMS } from "./types/v1/API_ACCOUNT_TOKENS_PARAMS.js";
export type { API_PUBLIC_KEY_PARAMS } from "./types/v1/API_PUBLIC_KEY_PARAMS.js";
export type { API_TOKEN_HOLDERS_PARAMS } from "./types/v1/API_TOKEN_HOLDERS_PARAMS.js";
export type { API_STATUS_PARAMS } from "./types/v1/API_STATUS_PARAMS.js";
export type { HEALTH_RESPONSE } from "./types/v1/HEALTH_RESPONSE.js";
export type { API_STATUS_RESPONSE } from "./types/v1/API_STATUS_RESPONSE.js";
export type { PUBLIC_KEY_LOOKUP_RESPONSE } from "./types/v1/PUBLIC_KEY_LOOKUP_RESPONSE.js";
export type { ACCOUNT_CONTRACTS_RESPONSE } from "./types/v1/ACCOUNT_CONTRACTS_RESPONSE.js";
export type { ACCOUNT_STAKING_IDS_RESPONSE } from "./types/v1/ACCOUNT_STAKING_IDS_RESPONSE.js";
export type { ACCOUNT_FT_RESPONSE } from "./types/v1/ACCOUNT_FT_RESPONSE.js";
export type { ACCOUNT_NFT_RESPONSE } from "./types/v1/ACCOUNT_NFT_RESPONSE.js";
export type { ACCOUNT_STAKING_RESPONSE } from "./types/v1/ACCOUNT_STAKING_RESPONSE.js";
export type { TOKEN_HOLDERS_RESPONSE } from "./types/v1/TOKEN_HOLDERS_RESPONSE.js";
// ========================================
// copyright 2026 by sleet.near
