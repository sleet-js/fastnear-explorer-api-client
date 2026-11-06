// ========================================
// FASTFS_DECODE
// decode a FastFS payload.
//
// a FastFS upload is a function call to `__fastdata_fastfs` whose
// arguments are RAW BORSH BYTES, not json:
//
//   enum FastfsData {
//       Simple(SimpleFastfs),    // variant 0
//       Partial(PartialFastfs),  // variant 1
//   }
//
//   struct SimpleFastfs {
//       relative_path: String,
//       content: Option<FastfsFileContent>,
//   }
//
//   struct FastfsFileContent {
//       mime_type: String,
//       content: Vec<u8>,
//   }
//
//   struct PartialFastfs {
//       relative_path: String,
//       offset: u32,
//       full_size: u32,
//       mime_type: String,
//       content_chunk: Vec<u8>,
//       nonce: u32,
//   }
//
// borsh's rules, which is all a decoder needs:
//   - the variant index is ONE byte, before the variant's fields
//   - a `String` is a u32 length prefix (little-endian) then utf-8
//   - a `Vec<u8>` is a u32 length prefix then the bytes
//   - an `Option<T>` is ONE byte — 0 for None, 1 for Some — then it
//   - every integer is little-endian
//
// THE DECODER NEVER THROWS.
//
// a payload that is not FastFS borsh, or that is truncated, gives
// null. the caller then renders the bytes as hex, which is what it
// does today. a decoder that throws would take down a transaction
// page, so every read here is bounds-checked and a short read is a
// null, never a partial result.
//
// TRAILING BYTES ARE IGNORED.
//
// the payload is a flat struct of the fields below and nothing else,
// so there is nothing left over to check. a payload with extra bytes
// at the end still decodes — the contract does not say it should not,
// and refusing it would drop a payload that reads fine.
//
// THE RECEIPT FAILS WITH `CodeDoesNotExist` — by design. the receiver
// has no contract and does not need one; the indexer reads the
// transaction, not the receipt. so a failed receipt on a FastFS call
// is the expected outcome, not a failure.
//
// see FastFS_DECODER_CONTRACT.md for the shape this decodes into.
// ========================================

import type { FASTFS_FILE_INFO } from "../../types/shared/FASTFS_FILE_INFO";

// the variant bytes of the FastfsData enum.
const FASTFS_VARIANT_SIMPLE = 0;
const FASTFS_VARIANT_PARTIAL = 1;

// one decoder, reused. `fatal: false` so a payload with invalid
// utf-8 in a path or a mime type gives replacement characters
// instead of throwing.
const FASTFS_TEXT_DECODER = new TextDecoder("utf-8", { fatal: false });

// --- internals ----------------------------------------------------

// a cursor over the payload. every read checks the bounds first, so
// a truncated payload stops the walk instead of reading past the end.
class READER {
  private readonly bytes: Uint8Array;
  private offset: number;

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
    this.offset = 0;
  }

  // one byte. null when there is none.
  u8(): number | null {
    if (this.offset + 1 > this.bytes.length) return null;
    const value = this.bytes[this.offset] ?? 0;
    this.offset += 1;
    return value;
  }

  // a little-endian u32.
  u32(): number | null {
    if (this.offset + 4 > this.bytes.length) return null;
    const view = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset + this.offset,
      4,
    );
    this.offset += 4;
    return view.getUint32(0, true);
  }

  // a length-prefixed byte run. null when the prefix or the run is
  // short.
  bytes_of(length: number): Uint8Array | null {
    if (this.offset + length > this.bytes.length) return null;
    const slice = this.bytes.slice(this.offset, this.offset + length);
    this.offset += length;
    return slice;
  }

  // a length-prefixed utf-8 string.
  string(): string | null {
    const length = this.u32();
    if (length === null) return null;
    const raw = this.bytes_of(length);
    if (raw === null) return null;
    return FASTFS_TEXT_DECODER.decode(raw);
  }
}

// a simple upload, with or without content.
function decode_simple(reader: READER): FASTFS_FILE_INFO | null {
  const relative_path = reader.string();
  if (relative_path === null) return null;

  // the Option byte. 0 is None — a DELETE. 1 is Some. anything else
  // is not borsh, so the payload is not FastFS.
  const has_content = reader.u8();
  if (has_content === null) return null;
  if (has_content !== 0 && has_content !== 1) return null;

  if (has_content === 0) {
    // a delete. no mime, no content.
    return {
      kind: "simple",
      relative_path,
      mime_type: "",
      content: new Uint8Array(),
      size: 0,
      offset: 0,
      nonce: 0,
      is_delete: true,
      total_size: 0,
    };
  }

  const mime_type = reader.string();
  if (mime_type === null) return null;

  const content_length = reader.u32();
  if (content_length === null) return null;

  const content = reader.bytes_of(content_length);
  if (content === null) return null;

  return {
    kind: "simple",
    relative_path,
    mime_type,
    content,
    // a simple upload carries the whole file, so its size IS the
    // file's size and there is no separate total.
    size: content.length,
    offset: 0,
    nonce: 0,
    is_delete: false,
    total_size: 0,
  };
}

// a partial upload — one chunk of a bigger file.
function decode_partial(reader: READER): FASTFS_FILE_INFO | null {
  const relative_path = reader.string();
  if (relative_path === null) return null;

  const offset = reader.u32();
  if (offset === null) return null;

  const full_size = reader.u32();
  if (full_size === null) return null;

  const mime_type = reader.string();
  if (mime_type === null) return null;

  const chunk_length = reader.u32();
  if (chunk_length === null) return null;

  const content = reader.bytes_of(chunk_length);
  if (content === null) return null;

  const nonce = reader.u32();
  if (nonce === null) return null;

  return {
    kind: "partial",
    relative_path,
    mime_type,
    content,
    // the CHUNK's size, not the file's. total_size says the file's.
    size: content.length,
    offset,
    nonce,
    is_delete: false,
    total_size: full_size,
  };
}

// --- the decoder ---------------------------------------------------

export function fastfs_decode_fun(bytes: Uint8Array): FASTFS_FILE_INFO | null {
  try {
    if (bytes.length === 0) return null;

    const reader = new READER(bytes);

    const variant = reader.u8();
    if (variant === null) return null;

    if (variant === FASTFS_VARIANT_SIMPLE) return decode_simple(reader);
    if (variant === FASTFS_VARIANT_PARTIAL) return decode_partial(reader);

    // an unknown variant is not FastFS borsh.
    return null;
  } catch {
    // the decoder must never throw. a payload that upsets a reader
    // is a payload that is not FastFS.
    return null;
  }
}
// ========================================
// copyright 2026 by sleet.near
