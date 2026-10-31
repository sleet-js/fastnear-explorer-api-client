// ========================================
// ACCESS_KEY_PERMISSION
// what an access key is allowed to do.
//
// either the unit variant "FullAccess" (a bare string) or a
// function-call restriction.
// ========================================

import type { FUNCTION_CALL_PERMISSION } from "./FUNCTION_CALL_PERMISSION";

export type ACCESS_KEY_PERMISSION = "FullAccess" | FUNCTION_CALL_PERMISSION;
// ========================================
// copyright 2026 by sleet.near
