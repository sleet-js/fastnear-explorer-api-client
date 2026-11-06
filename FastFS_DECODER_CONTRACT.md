# the shared FastFS decoder — the contract both repos implement

this file is the agreement between the explorer api client (which parses
the chain's transactions) and the rex engine's frontend (which shows a
QUEUED call, before it is signed). both sides decode the same borsh
payload, and the two must not drift.

## the payload

a FastFS upload is a function call to `__fastdata_fastfs` whose arguments
are **raw borsh bytes**, not json.

```
enum FastfsData {
    Simple(SimpleFastfs),    // variant index 0
    Partial(PartialFastfs),  // variant index 1
}

struct SimpleFastfs {
    relative_path: String,
    content: Option<FastfsFileContent>,
}

struct FastfsFileContent {
    mime_type: String,
    content: Vec<u8>,
}

struct PartialFastfs {
    relative_path: String,
    offset: u32,          // a multiple of 1 MiB, and < 32 MiB
    full_size: u32,       // the whole file's size, 1..=33554432
    mime_type: String,
    content_chunk: Vec<u8>, // <= 1 MiB
    nonce: u32,           // 1..=2147483647
}
```

borsh's rules, which is all an encoder needs:

- the enum's variant index is ONE byte, written before the variant's fields
- a `String` is a u32 length prefix (little-endian) then the utf-8 bytes
- a `Vec<u8>` is a u32 length prefix then the bytes
- an `Option<T>` is ONE byte — 0 for None, 1 for Some — then the value
- every integer is little-endian

## the decoded shape

ONE shape, used by both repos. the field names are the ones below.

```ts
interface FASTFS_FILE_INFO {
  // "simple" or "partial".
  kind: "simple" | "partial";
  // the path inside the namespace. always present.
  relative_path: string;
  // the mime type. empty string when the payload carries none.
  mime_type: string;
  // the bytes of the content. empty when there are none.
  content: Uint8Array;
  // the size of THIS payload's bytes: the whole file for a simple
  // upload, the chunk for a partial one.
  size: number;
  // for a partial upload: where this chunk starts. 0 for a simple one.
  offset: number;
  // for a partial upload: the nonce, shared by every chunk of one upload.
  // 0 for a simple one.
  nonce: number;
  // true when the payload is a delete — a simple upload with no content.
  is_delete: boolean;
  // how many bytes the whole file is, for a partial upload. 0 for a
  // simple one, whose `size` already says it.
  total_size: number;
}
```

and the url:

```ts
// https://{predecessor}.fastfs.io/{receiver}/{relative_path}
function fastfs_file_url_fun(
  predecessor: string,
  receiver: string,
  relative_path: string,
): string;

// fastfs://{predecessor}/{receiver}/{relative_path}
function fastfs_file_uri_fun(
  predecessor: string,
  receiver: string,
  relative_path: string,
): string;
```

## the rules the decoder holds to

- **the receiver is ANY account.** `fastfs.near` is the convention and the
  namespace everyone uses, and there is no contract on it.
- **`predecessor` is the account that SIGNED the transaction**, not the
  receiver. it is the receipt's predecessor.
- **a delete is a simple upload with no content.** `content` is empty and
  `is_delete` is true.
- **a partial upload's `size` is the CHUNK's size** and `total_size` is the
  whole file's size. they are different numbers and a reader must not
  confuse them. (the upstream spec agrees: `full_size` is "the total size
  in bytes… the same in every chunk" and `content_chunk` is the chunk.)
- **a delete's `size` is 0** and that is not "an empty file" — a delete
  carries no file at all, so the file-size limit does not apply to it.
- **the limits**, which the indexer enforces and what fails them is dropped
  SILENTLY: path <= 1024 chars, mime non-empty and <= 256 chars, chunk
  <= 1 MiB, offset a multiple of 1 MiB and < 32 MiB, whole file
  1..=33554432 bytes, nonce 1..=2147483647.
- **a simple payload is NOT checked for a mime type when it has no
  content** — the delete case carries no mime and is never refused for one.
- **the receipt FAILS with `CodeDoesNotExist`** — by design. the receiver has
  no contract and does not need one; the indexer reads the transaction, not
  the receipt. so a failed receipt on a FastFS call is the expected outcome,
  not a failure.

## the decode must never throw

a payload that is not FastFS borsh, or that is truncated, gives `null`.
the caller then renders the bytes as hex, which is what it does today.
a decoder that throws would take down a transaction page.

## the hex format

the hex of a byte array, for the views that show raw bytes:

```
00 09 00 00 00 68 65 6c 6c 6f
```

- one space between the bytes
- **a line break every 16 bytes**, so a long payload is readable and a
  reader can count the offset
- the lines are NOT indented — the offset is on the line, so an indent
  would make the offset wrong

the line break is part of the FORMAT, not a css concern. a css `word-break`
breaks at arbitrary characters and lands mid-byte, so the bytes on a line
would not line up with the offset.
