// ========================================
// FUNCTION_CALL_ACTION
// a contract method call.
//
// `args` is base64 of the JSON argument object. `gas` is a plain
// number (u64). `deposit` is a decimal string of yoctoNEAR.
// ========================================

export interface FUNCTION_CALL_ACTION {
  method_name: string;
  args: string;
  gas: number;
  deposit: string;
}
// ========================================
// copyright 2026 by sleet.near
