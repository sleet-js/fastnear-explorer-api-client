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
export { ENDPOINTS } from "./stuff/ENDPOINTS";
export {
  TX_ENDPOINT_PATHS,
  type TX_ENDPOINT_KEY,
} from "./stuff/TX_ENDPOINT_PATHS";
export {
  V1_ENDPOINT_PATHS,
  type V1_ENDPOINT_KEY,
} from "./stuff/V1_ENDPOINT_PATHS";
export {
  DEFAULT_CONFIG,
  DEFAULT_NETWORK,
  DEFAULT_BASE_URL,
} from "./stuff/API_CONFIG";
export { api_base_url, type SERVICE } from "./stuff/API_BASE_URL";
export { create_api_error, type API_ERROR } from "./stuff/API_ERROR";
export type { API_CLIENT_CONFIG } from "./stuff/API_CLIENT_CONFIG";
export type { NETWORK_ID as NETWORK } from "./types/shared/NETWORK_ID";

// --- the tx api ---------------------------------------------------
export { api_blocks } from "./fun/tx/API_BLOCKS";
export { api_block } from "./fun/tx/API_BLOCK";
export {
  api_transactions,
  TRANSACTIONS_BATCH_SIZE,
} from "./fun/tx/API_TRANSACTIONS";
export { api_account } from "./fun/tx/API_ACCOUNT";
export { api_receipt } from "./fun/tx/API_RECEIPT";

// --- the v1 api ---------------------------------------------------
export { api_health } from "./fun/v1/API_HEALTH";
export { api_status } from "./fun/v1/API_STATUS";
export { api_account_full } from "./fun/v1/API_ACCOUNT_FULL";
export { api_account_ft } from "./fun/v1/API_ACCOUNT_FT";
export { api_account_nft } from "./fun/v1/API_ACCOUNT_NFT";
export { api_account_staking } from "./fun/v1/API_ACCOUNT_STAKING";
export {
  api_account_contracts,
  type ACCOUNT_CONTRACT_KIND,
} from "./fun/v1/API_ACCOUNT_CONTRACTS";
export { api_account_staking_ids } from "./fun/v1/API_ACCOUNT_STAKING_IDS";
export {
  api_public_key,
  type API_PUBLIC_KEY_PARAMS_EXTENDED,
} from "./fun/v1/API_PUBLIC_KEY";
export { api_token_holders } from "./fun/v1/API_TOKEN_HOLDERS";

// --- the rpc node -------------------------------------------------
export { api_rpc_query } from "./fun/v1/API_RPC_QUERY";
export { api_rpc_call_function } from "./fun/v1/API_RPC_CALL_FUNCTION";

// --- the parser ---------------------------------------------------
export { parse_transaction } from "./parse/parse_transaction";
export { parse_action } from "./parse/parse_action";
export { get_action_type } from "./parse/get_action_type";
export { get_action_payload } from "./parse/get_action_payload";
export { get_delegate_body } from "./parse/get_delegate_body";
export { is_delegate_action } from "./parse/is_delegate_action";
export { resolve_delegate_context } from "./parse/resolve_delegate_context";
export { resolve_success } from "./parse/resolve_success";
export { resolve_total_gas } from "./parse/resolve_total_gas";
export { parse_event_json, EVENT_JSON_PREFIX } from "./parse/parse_event_json";
export { normalize_event_data } from "./parse/normalize_event_data";
export { collect_events } from "./parse/collect_events";
export { normalize_owner } from "./parse/normalize_owner";
export { is_event_data_object } from "./parse/is_event_data_object";

// --- the decoded arguments -----------------------------------------
export { decode_args } from "./parse/decode_args";
export { try_parse_json } from "./parse/try_parse_json";
export { is_printable_text } from "./parse/is_printable_text";
export { bytes_to_hex } from "./parse/bytes_to_hex";
export { args_view_modes } from "./parse/args_view_modes";
export { default_args_view_mode } from "./parse/default_args_view_mode";
export { format_storage_bytes } from "./parse/format_storage_bytes";
export { is_non_zero_balance } from "./parse/is_non_zero_balance";

// --- the parser registry ------------------------------------------
export { DEFAULT_PARSER_REGISTRY } from "./parse/registry/DEFAULT_PARSER_REGISTRY";
export { create_parser_registry } from "./parse/registry/create_parser_registry";
export { register_parser } from "./parse/registry/register_parser";
export { DEFAULT_PLUGINS } from "./parse/plugins/DEFAULT_PLUGINS";
export { plugin_near_transfer } from "./parse/plugins/PLUGIN_NEAR_TRANSFER";
export { plugin_nep141_transfer } from "./parse/plugins/PLUGIN_NEP141_TRANSFER";
export { plugin_nep245_transfer } from "./parse/plugins/PLUGIN_NEP245_TRANSFER";
export { plugin_nep171_nft_transfer } from "./parse/plugins/PLUGIN_NEP171_NFT_TRANSFER";
export { plugin_delete_account_transfer } from "./parse/plugins/PLUGIN_DELETE_ACCOUNT_TRANSFER";
export { plugin_fastfs } from "./parse/plugins/PLUGIN_FASTFS";

// --- fastfs -------------------------------------------------------
// the FastFS decoder. see FastFS_DECODER_CONTRACT.md — the same
// contract the rex engine's frontend implements.
export { fastfs_decode_fun } from "./parse/fastfs/fastfs_decode";
export {
  fastfs_file_url_fun,
  fastfs_file_uri_fun,
} from "./parse/fastfs/fastfs_file_url";
export { fastfs_bytes_to_hex_fun } from "./parse/fastfs/fastfs_bytes_to_hex";
export {
  fastfs_validate_fun,
  FASTFS_MAX_PATH_LENGTH,
  FASTFS_MAX_MIME_LENGTH,
  FASTFS_MAX_CHUNK_SIZE,
  FASTFS_MAX_FILE_SIZE,
  FASTFS_MIN_FILE_SIZE,
  FASTFS_MAX_NONCE,
  FASTFS_MIN_NONCE,
  FASTFS_OFFSET_STEP,
  FASTFS_MAX_OFFSET,
} from "./parse/fastfs/fastfs_limits";
export {
  fastfs_is_call_fun,
  fastfs_can_display_fun,
  FASTFS_METHOD_NAME,
} from "./parse/fastfs/fastfs_is";

// --- formatting ---------------------------------------------------
export { format_near } from "./parse/format_near";
export { format_near_with_unit } from "./parse/format_near_with_unit";
export { format_gas } from "./parse/format_gas";
export { format_token_amount } from "./parse/format_token_amount";
export { time_ago } from "./parse/time_ago";
export { parse_public_key } from "./parse/parse_public_key";
export { truncate_public_key_data } from "./parse/truncate_public_key_data";
export { encode_base58 } from "./parse/encode_base58";
export { decode_base58 } from "./parse/decode_base58";
export { decode_bytes } from "./parse/decode_bytes";
export { encode_base64 } from "./parse/encode_base64";
export { decode_base64_bytes } from "./parse/decode_base64";
export { decode_base64_bytes_raw } from "./parse/decode_base64_bytes_raw";
export { base58_from_base64 } from "./parse/base58_from_base64";

// --- types --------------------------------------------------------
export type { ACTION } from "./types/tx/ACTION";
export type { UNIT_ACTION } from "./types/tx/UNIT_ACTION";
export type { ENVELOPED_ACTION } from "./types/tx/ENVELOPED_ACTION";
export type { RAW_ACTION } from "./types/tx/RAW_ACTION";
export type { ACTION_TYPE } from "./types/tx/ACTION_TYPE";
export type { ADD_KEY_ACTION } from "./types/tx/ADD_KEY_ACTION";
export type { DELEGATE_ACTION } from "./types/tx/DELEGATE_ACTION";
export type { DELEGATE_ACTION_BODY } from "./types/tx/DELEGATE_ACTION_BODY";
export type { DELETE_ACCOUNT_ACTION } from "./types/tx/DELETE_ACCOUNT_ACTION";
export type { DELETE_KEY_ACTION } from "./types/tx/DELETE_KEY_ACTION";
export type { DEPLOY_CONTRACT_ACTION } from "./types/tx/DEPLOY_CONTRACT_ACTION";
export type { FUNCTION_CALL_ACTION } from "./types/tx/FUNCTION_CALL_ACTION";
export type { STAKE_ACTION } from "./types/tx/STAKE_ACTION";
export type { TRANSFER_ACTION } from "./types/tx/TRANSFER_ACTION";
export type { USE_GLOBAL_CONTRACT_ACTION } from "./types/tx/USE_GLOBAL_CONTRACT_ACTION";
export type { ACCESS_KEY } from "./types/tx/ACCESS_KEY";
export type { ACCESS_KEY_PERMISSION } from "./types/tx/ACCESS_KEY_PERMISSION";
export type { FUNCTION_CALL_PERMISSION } from "./types/tx/FUNCTION_CALL_PERMISSION";
export type { ACTION_ERROR } from "./types/tx/ACTION_ERROR";
export type { ERROR_KIND } from "./types/tx/ERROR_KIND";
export type { EXECUTION_STATUS } from "./types/tx/EXECUTION_STATUS";
export type { EXECUTION_OUTCOME } from "./types/tx/EXECUTION_OUTCOME";
export type { RECEIPT } from "./types/tx/RECEIPT";
export type { RECEIPT_OUTCOME } from "./types/tx/RECEIPT_OUTCOME";
export type { RECEIPT_WITH_OUTCOME } from "./types/tx/RECEIPT_WITH_OUTCOME";
export type { RECEIPT_ROW } from "./types/tx/RECEIPT_ROW";
export type { RAW_TRANSACTION } from "./types/tx/RAW_TRANSACTION";
export type { TRANSACTION_DETAIL } from "./types/tx/TRANSACTION_DETAIL";
export type { BLOCK_HEADER } from "./types/tx/BLOCK_HEADER";
export type { BLOCK_TX } from "./types/tx/BLOCK_TX";
export type { BLOCK_FILTERS } from "./types/tx/BLOCK_FILTERS";
export type { ACCOUNT_TX } from "./types/tx/ACCOUNT_TX";
export type { ACCOUNT_FILTERS } from "./types/tx/ACCOUNT_FILTERS";
export type { ACCOUNT_FULL } from "./types/v1/ACCOUNT_FULL";
export type { ACCOUNT_FULL_STATE } from "./types/v1/ACCOUNT_FULL_STATE";
export type { ACCOUNT_FT_TOKEN } from "./types/v1/ACCOUNT_FT_TOKEN";
export type { ACCOUNT_NFT } from "./types/v1/ACCOUNT_NFT";
export type { ACCOUNT_POOL } from "./types/v1/ACCOUNT_POOL";
export type { PARSED_ACTION } from "./types/shared/PARSED_ACTION";
export type { PARSED_PUBLIC_KEY } from "./types/shared/PARSED_PUBLIC_KEY";
export type { PARSE_RESULT } from "./types/shared/PARSE_RESULT";
export type { PARSER_CONTEXT } from "./types/shared/PARSER_CONTEXT";
export type { PARSER_OPTIONS } from "./types/shared/PARSER_OPTIONS";
export type { PARSER_REGISTRY } from "./types/shared/PARSER_REGISTRY";
export type { TRANSFER_PARSER } from "./types/shared/TRANSFER_PARSER";
export type { TRANSFER_INFO } from "./types/shared/TRANSFER_INFO";
export type { NFT_TRANSFER_INFO } from "./types/shared/NFT_TRANSFER_INFO";
export type { CUSTOM_TRANSFER } from "./types/shared/CUSTOM_TRANSFER";
export type { TOKEN_TYPE } from "./types/shared/TOKEN_TYPE";
export type { EVENT_JSON } from "./types/shared/EVENT_JSON";
export type { EVENT_DATA } from "./types/shared/EVENT_DATA";
export type { DECODED_ARGS } from "./types/shared/DECODED_ARGS";
export type { ARGS_VIEW_MODE } from "./types/shared/ARGS_VIEW_MODE";
export type { DELEGATE_CONTEXT } from "./types/shared/DELEGATE_CONTEXT";
export type { COLLECTED_EVENT } from "./types/shared/COLLECTED_EVENT";
export type { FASTFS_FILE_INFO } from "./types/shared/FASTFS_FILE_INFO";
export type { FASTFS_DISPLAY_KIND } from "./types/shared/FASTFS_DISPLAY_KIND";
export type { API_RPC_RESPONSE } from "./types/v1/API_RPC_RESPONSE";
export type { API_RPC_PARAMS } from "./types/v1/API_RPC_PARAMS";
export type { API_RPC_CALL_PARAMS } from "./types/v1/API_RPC_CALL_PARAMS";
export type { API_RPC_CALL_FUNCTION_PARAMS } from "./types/v1/API_RPC_CALL_FUNCTION_PARAMS";
export type { API_RPC_CALL_FUNCTION_RESULT } from "./types/v1/API_RPC_CALL_FUNCTION_RESULT";
export type { API_BLOCKS_RESPONSE } from "./types/tx/API_BLOCKS_RESPONSE";
export type { API_BLOCKS_PARAMS } from "./types/tx/API_BLOCKS_PARAMS";
export type { API_BLOCK_RESPONSE } from "./types/tx/API_BLOCK_RESPONSE";
export type { API_BLOCK_PARAMS } from "./types/tx/API_BLOCK_PARAMS";
export type { API_TRANSACTIONS_RESPONSE } from "./types/tx/API_TRANSACTIONS_RESPONSE";
export type { API_TRANSACTIONS_PARAMS } from "./types/tx/API_TRANSACTIONS_PARAMS";
export type { API_ACCOUNT_RESPONSE } from "./types/tx/API_ACCOUNT_RESPONSE";
export type { API_ACCOUNT_PARAMS } from "./types/tx/API_ACCOUNT_PARAMS";
export type { API_RECEIPT_RESPONSE } from "./types/tx/API_RECEIPT_RESPONSE";
export type { API_RECEIPT_PARAMS } from "./types/tx/API_RECEIPT_PARAMS";
export type { API_ACCOUNT_FULL_PARAMS } from "./types/v1/API_ACCOUNT_FULL_PARAMS";
export type { API_ACCOUNT_TOKENS_PARAMS } from "./types/v1/API_ACCOUNT_TOKENS_PARAMS";
export type { API_PUBLIC_KEY_PARAMS } from "./types/v1/API_PUBLIC_KEY_PARAMS";
export type { API_TOKEN_HOLDERS_PARAMS } from "./types/v1/API_TOKEN_HOLDERS_PARAMS";
export type { API_STATUS_PARAMS } from "./types/v1/API_STATUS_PARAMS";
export type { HEALTH_RESPONSE } from "./types/v1/HEALTH_RESPONSE";
export type { API_STATUS_RESPONSE } from "./types/v1/API_STATUS_RESPONSE";
export type { PUBLIC_KEY_LOOKUP_RESPONSE } from "./types/v1/PUBLIC_KEY_LOOKUP_RESPONSE";
export type { ACCOUNT_CONTRACTS_RESPONSE } from "./types/v1/ACCOUNT_CONTRACTS_RESPONSE";
export type { ACCOUNT_STAKING_IDS_RESPONSE } from "./types/v1/ACCOUNT_STAKING_IDS_RESPONSE";
export type { ACCOUNT_FT_RESPONSE } from "./types/v1/ACCOUNT_FT_RESPONSE";
export type { ACCOUNT_NFT_RESPONSE } from "./types/v1/ACCOUNT_NFT_RESPONSE";
export type { ACCOUNT_STAKING_RESPONSE } from "./types/v1/ACCOUNT_STAKING_RESPONSE";
export type { TOKEN_HOLDERS_RESPONSE } from "./types/v1/TOKEN_HOLDERS_RESPONSE";
// ========================================
// copyright 2026 by sleet.near
