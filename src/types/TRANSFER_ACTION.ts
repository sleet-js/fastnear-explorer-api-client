// ========================================
// TRANSFER_ACTION
// a native NEAR transfer between two accounts.
//
// `deposit` is a decimal string of yoctoNEAR. it is a string, not a
// number — yoctoNEAR amounts overflow a js number.
// ========================================

export interface TRANSFER_ACTION {
  deposit: string;
}
// ========================================
// copyright 2026 by sleet.near
