// ========================================
// READ_ACCESS_KEY_PERMISSION
// read the permission of an AddKey action as a short string.
//
// two shapes:
//   "FullAccess"                            -> "FullAccess"
//   { "FunctionCall": { receiver_id, ... } } -> "FunctionCall → {receiver_id}"
//
// returns null when the payload holds no permission.
// ========================================

export function read_access_key_permission(
  payload: Record<string, unknown>,
): string | null {
  const access_key = payload["access_key"];
  if (typeof access_key !== "object" || access_key === null) return null;

  const permission = (access_key as Record<string, unknown>)["permission"];
  if (typeof permission === "string") return permission;
  if (typeof permission !== "object" || permission === null) return null;

  const function_call = (permission as Record<string, unknown>)["FunctionCall"];
  if (typeof function_call !== "object" || function_call === null) return null;

  const receiver_id = (function_call as Record<string, unknown>)["receiver_id"];
  return `FunctionCall → ${typeof receiver_id === "string" ? receiver_id : "?"}`;
}
// ========================================
// copyright 2026 by sleet.near
