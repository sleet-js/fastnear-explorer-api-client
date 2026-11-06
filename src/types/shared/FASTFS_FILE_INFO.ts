// ========================================
// FASTFS_FILE_INFO
// one decoded FastFS upload.
//
// a FastFS upload is a function call to `__fastdata_fastfs` whose
// arguments are RAW BORSH BYTES, not json. this is what those bytes
// decode to.
//
// `size` AND `total_size` mean DIFFERENT THINGS and a reader must not
// confuse them:
//
//   size       — for a simple upload, the file's whole size. for a
//                partial upload, the size of THIS CHUNK.
//   total_size — for a partial upload, the size of the WHOLE file. 0
//                for a simple one, whose `size` already says it.
//
// `offset` and `nonce` are 0 for a simple upload. for a partial one
// they are where the chunk starts and the nonce every chunk of one
// upload shares.
//
// `is_delete` is true for a DELETE — a simple upload with no content.
// a delete carries no mime type, so its `mime_type` is the empty
// string.
//
// this shape is the AGREEMENT between this package and the rex
// engine's frontend. see FastFS_DECODER_CONTRACT.md.
// ========================================

export interface FASTFS_FILE_INFO {
  /** "simple" or "partial". */
  kind: "simple" | "partial";
  /** the path inside the namespace. always present. */
  relative_path: string;
  /** the mime type. empty string when the payload carries none. */
  mime_type: string;
  /** the bytes of the content. empty when there are none. */
  content: Uint8Array;
  /** the chunk's size for a partial upload, the file's size for a simple one. */
  size: number;
  /** for a partial upload: where this chunk starts. 0 for a simple one. */
  offset: number;
  /** for a partial upload: the nonce every chunk of one upload shares. */
  nonce: number;
  /** true when the payload is a delete — a simple upload with no content. */
  is_delete: boolean;
  /** the whole file's size, for a partial upload. 0 for a simple one. */
  total_size: number;
}
// ========================================
// copyright 2026 by sleet.near
