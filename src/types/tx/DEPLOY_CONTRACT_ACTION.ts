// ========================================
// DEPLOY_CONTRACT_ACTION
// deploys contract code to an account.
//
// `code` is base64 of the 32-byte CODE HASH, not of the contract
// source. the api gives the hash; to render it as base58 the bytes
// are decoded with decode_base64 and re-encoded with encode_base58.
// ========================================

export interface DEPLOY_CONTRACT_ACTION {
  code: string;
}
// ========================================
// copyright 2026 by sleet.near
