// ========================================
// FUNCTION_CALL_PERMISSION
// the function-call half of an access key permission.
//
// `allowance` is a decimal string of yoctoNEAR and may be null,
// which means "no allowance cap".
// ========================================

export interface FUNCTION_CALL_PERMISSION {
  allowance: string | null;
  receiver_id: string;
  method_names: string[];
}
// ========================================
// copyright 2026 by sleet.near
