// ========================================
// ACTION_TYPE
// the names of every action the protocol knows.
//
// the api serializes most actions as a single-key object keyed by the
// name (`{ "FunctionCall": {...} }`), but a UNIT variant comes back as
// a bare string. `CreateAccount` is the unit variant, so it arrives
// as the plain string "CreateAccount" — not wrapped in an object.
//
// NOTE: the api may add action names in a future protocol version.
// an unknown name is still carried by the raw action, it just is not
// part of this union. see PARSED_ACTION for how that is surfaced.
// ========================================

export type ACTION_TYPE =
  | "CreateAccount"
  | "FunctionCall"
  | "Transfer"
  | "AddKey"
  | "DeleteKey"
  | "DeleteAccount"
  | "DeployContract"
  | "Delegate"
  | "Stake"
  | "UseGlobalContract";
// ========================================
// copyright 2026 by sleet.near
