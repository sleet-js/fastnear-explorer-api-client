// ========================================
// FASTFS_DISPLAY_KIND
// what a mime type allows a ui to show.
//
// "text"   — shown as text
// "image"  — shown as an image
// "video"  — shown as a video
// null     — shown as raw bytes, as hex
//
// this is the KIND, not the mime type. the mime type itself is on
// FASTFS_FILE_INFO. a ui switches on the kind, because that is the
// decision it has to make; the mime type is only what told it.
// ========================================

export type FASTFS_DISPLAY_KIND = "text" | "image" | "video";
// ========================================
// copyright 2026 by sleet.near
