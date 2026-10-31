// ========================================
// ENVELOPED_ACTION
// the actions that arrive as a single-key object keyed by the action
// name.
//
//   { "FunctionCall": { ... } }
//   { "Transfer": { ... } }
//
// THIS UNION NARROWS. once the string arm is ruled out, a check on
// the key names the action:
//
//   if (typeof action === "string") return null;
//   if ("Transfer" in action) {
//     const deposit: string = action.Transfer.deposit;
//   }
//
// that is what makes the action types worth writing out by hand
// rather than leaving them as an open record.
// ========================================

import type { ADD_KEY_ACTION } from "./ADD_KEY_ACTION";
import type { DELEGATE_ACTION } from "./DELEGATE_ACTION";
import type { DELETE_ACCOUNT_ACTION } from "./DELETE_ACCOUNT_ACTION";
import type { DELETE_KEY_ACTION } from "./DELETE_KEY_ACTION";
import type { DEPLOY_CONTRACT_ACTION } from "./DEPLOY_CONTRACT_ACTION";
import type { FUNCTION_CALL_ACTION } from "./FUNCTION_CALL_ACTION";
import type { STAKE_ACTION } from "./STAKE_ACTION";
import type { TRANSFER_ACTION } from "./TRANSFER_ACTION";
import type { USE_GLOBAL_CONTRACT_ACTION } from "./USE_GLOBAL_CONTRACT_ACTION";

export type ENVELOPED_ACTION =
  | { FunctionCall: FUNCTION_CALL_ACTION }
  | { Transfer: TRANSFER_ACTION }
  | { AddKey: ADD_KEY_ACTION }
  | { DeleteKey: DELETE_KEY_ACTION }
  | { DeleteAccount: DELETE_ACCOUNT_ACTION }
  | { DeployContract: DEPLOY_CONTRACT_ACTION }
  | { Delegate: DELEGATE_ACTION }
  | { Stake: STAKE_ACTION }
  | { UseGlobalContract: USE_GLOBAL_CONTRACT_ACTION };
// ========================================
// copyright 2026 by sleet.near
