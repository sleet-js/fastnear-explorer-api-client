// ========================================
// FASTFS_LIMITS
// the limits the FastFS indexer enforces, and a checker for them.
//
// these are the INDEXER's limits. a payload that breaks them is
// dropped SILENTLY by the indexer — the file never lands. so a
// decoded payload that breaks them describes something that is not
// really there.
//
//   path        <= 1024 chars
//   mime        non-empty and <= 256 chars
//   chunk       <= 1 MiB
//   offset      a multiple of 1 MiB and < 32 MiB
//   whole file  1..=33554432 bytes
//   nonce       1..=2147483647
//
// A SIMPLE PAYLOAD WITH NO CONTENT IS NOT CHECKED FOR A MIME TYPE.
//
// the delete case carries no mime, and it is never refused for one.
// the check for an empty mime is only for a payload that DOES carry
// content.
//
// A DELETE IS ALSO EXEMPT FROM THE FILE-SIZE CHECK.
//
// the 1..=33554432 limit is on an UPLOAD. a delete carries NO FILE —
// its size is 0 because there is nothing there, not because the file
// is empty — so it is never refused for a file that is too small.
//
// the checker returns a list of human-readable problems, one per
// broken limit, and an empty list when the payload is fine. it never
// throws, and it never returns a problem for a delete's missing mime.
// ========================================

import type { FASTFS_FILE_INFO } from "../../types/shared/FASTFS_FILE_INFO";

// --- the limits ---------------------------------------------------

/** the longest a relative path may be, in chars. */
export const FASTFS_MAX_PATH_LENGTH = 1024;
/** the longest a mime type may be, in chars. */
export const FASTFS_MAX_MIME_LENGTH = 256;
/** the largest one chunk may be, in bytes. 1 MiB. */
export const FASTFS_MAX_CHUNK_SIZE = 1048576;
/** the largest a whole file may be, in bytes. 32 MiB. */
export const FASTFS_MAX_FILE_SIZE = 33554432;
/** the smallest a whole file may be, in bytes. */
export const FASTFS_MIN_FILE_SIZE = 1;
/** the largest a nonce may be. */
export const FASTFS_MAX_NONCE = 2147483647;
/** the smallest a nonce may be. */
export const FASTFS_MIN_NONCE = 1;
/** the offset must be a multiple of this. 1 MiB. */
export const FASTFS_OFFSET_STEP = 1048576;
/** the offset must be below this. 32 MiB. */
export const FASTFS_MAX_OFFSET = 33554432;

// --- the checker --------------------------------------------------

export function fastfs_validate_fun(info: FASTFS_FILE_INFO): string[] {
  const problems: string[] = [];

  if (info.relative_path.length > FASTFS_MAX_PATH_LENGTH) {
    problems.push(
      `the path is ${info.relative_path.length} chars, the limit is ${FASTFS_MAX_PATH_LENGTH}`,
    );
  }

  // a delete carries no mime, so it is never checked for one.
  if (!info.is_delete) {
    if (info.mime_type.length === 0) {
      problems.push("the mime type is empty");
    } else if (info.mime_type.length > FASTFS_MAX_MIME_LENGTH) {
      problems.push(
        `the mime type is ${info.mime_type.length} chars, the limit is ${FASTFS_MAX_MIME_LENGTH}`,
      );
    }
  }

  if (info.content.length > FASTFS_MAX_CHUNK_SIZE) {
    problems.push(
      `the chunk is ${info.content.length} bytes, the limit is ${FASTFS_MAX_CHUNK_SIZE}`,
    );
  }

  if (info.kind === "partial") {
    if (info.offset % FASTFS_OFFSET_STEP !== 0) {
      problems.push(
        `the offset ${info.offset} is not a multiple of ${FASTFS_OFFSET_STEP}`,
      );
    }
    if (info.offset >= FASTFS_MAX_OFFSET) {
      problems.push(
        `the offset ${info.offset} is not below ${FASTFS_MAX_OFFSET}`,
      );
    }
    if (info.total_size < FASTFS_MIN_FILE_SIZE) {
      problems.push(
        `the whole file is ${info.total_size} bytes, the smallest is ${FASTFS_MIN_FILE_SIZE}`,
      );
    } else if (info.total_size > FASTFS_MAX_FILE_SIZE) {
      problems.push(
        `the whole file is ${info.total_size} bytes, the limit is ${FASTFS_MAX_FILE_SIZE}`,
      );
    }
    if (info.nonce < FASTFS_MIN_NONCE) {
      problems.push(`the nonce ${info.nonce} is below ${FASTFS_MIN_NONCE}`);
    } else if (info.nonce > FASTFS_MAX_NONCE) {
      problems.push(`the nonce ${info.nonce} is above ${FASTFS_MAX_NONCE}`);
    }
  } else if (!info.is_delete) {
    // a simple upload's size IS the whole file's size.
    //
    // a delete is exempt: it carries NO FILE, so its size is 0
    // because there is nothing there, not because the file is empty.
    // the 1..=33554432 limit is on an UPLOAD.
    if (info.size < FASTFS_MIN_FILE_SIZE) {
      problems.push(
        `the whole file is ${info.size} bytes, the smallest is ${FASTFS_MIN_FILE_SIZE}`,
      );
    } else if (info.size > FASTFS_MAX_FILE_SIZE) {
      problems.push(
        `the whole file is ${info.size} bytes, the limit is ${FASTFS_MAX_FILE_SIZE}`,
      );
    }
  }

  return problems;
}
// ========================================
// copyright 2026 by sleet.near
