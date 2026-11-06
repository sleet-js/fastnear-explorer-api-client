// ========================================
// FASTFS_IS
// two small predicates about a FastFS call.
//
// `fastfs_is_call_fun` says whether a method name is the FastFS one.
// the FastFS upload is a function call to `__fastdata_fastfs` —
// there is no contract on the receiver, so the METHOD NAME is the
// only thing that identifies the call.
//
// `fastfs_can_display_fun` says what a mime type allows a ui to
// show: text, an image, a video, or nothing (raw bytes as hex).
//
// the mime type is matched on its TYPE part only. a mime type may
// carry parameters — `text/plain; charset=utf-8` — and the
// parameters say nothing about how the file is shown.
// ========================================

import type { FASTFS_DISPLAY_KIND } from "../../types/shared/FASTFS_DISPLAY_KIND";

/** the method name a FastFS upload is called by. */
export const FASTFS_METHOD_NAME = "__fastdata_fastfs";

export function fastfs_is_call_fun(method_name: string): boolean {
  return method_name === FASTFS_METHOD_NAME;
}

export function fastfs_can_display_fun(
  mime_type: string,
): FASTFS_DISPLAY_KIND | null {
  // the type part, without the parameters.
  const type = mime_type.split(";")[0]?.trim().toLowerCase() ?? "";
  if (type === "") return null;

  if (type.startsWith("text/")) return "text";
  // json is text. the other application types are not — an octet
  // stream is bytes and a pdf is a document.
  if (type === "application/json") return "text";
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";

  return null;
}
// ========================================
// copyright 2026 by sleet.near
