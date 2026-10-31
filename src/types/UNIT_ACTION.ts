// ========================================
// UNIT_ACTION
// the actions that arrive as a BARE STRING.
//
// the api serializes most actions as a single-key object, but a unit
// variant has no body to wrap, so it comes back as the plain name.
//
//   "CreateAccount"
//
// that is why the ACTION union has a string arm.
//
// a string is not an object, so a consumer that wants to read an
// action's body must check the type first:
//
//   if (typeof action === "string") {
//     // "CreateAccount"
//   } else if ("Transfer" in action) {
//     action.Transfer.deposit
//   }
// ========================================

export type UNIT_ACTION = "CreateAccount";
// ========================================
// copyright 2026 by sleet.near
