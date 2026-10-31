// ========================================
// TOKEN_TYPE
// which token standard a transfer moved.
//
// "near"  — native NEAR
// "nep141" — fungible token
// "nep245" — multi token
//
// the type is a string, not a closed union, because a custom parser
// may report a transfer under a standard this package does not know.
// ========================================

export type TOKEN_TYPE = "near" | "nep141" | "nep245" | (string & {});
// ========================================
// copyright 2026 by sleet.near
