#!/usr/bin/env bun
// ========================================
// PARSE_FASTFS
// the verification bin for the FastFS decoder.
//
// it checks the decoder against the REAL mainnet FastFS transaction
// and against hand-written payloads:
//
//   1. the real transaction decodes to the exact numbers it must
//   2. the plugin ENRICHES the one action — the count stays at one,
//      and the action's type stays `FunctionCall`
//   3. an ordinary call keeps its actions and gains no FastFS detail
//   4. a partial payload decodes, and its `size` is the CHUNK's
//      size while its `total_size` is the whole file's
//   5. a delete — a simple upload with no content — decodes as one
//   6. garbage, a truncated payload and an unknown variant all give
//      null
//   7. the hex has the byte separators and the line break every 16
//      bytes
//   8. the url and the uri are the ones the contract says
//   9. the limits: a long path is a problem, a delete with no mime
//      is NOT
//  10. the method name and the display kind
//  11. the decoder never throws
//
// WHY THE REAL TRANSACTION MATTERS.
//
// a hand-written test vector can be wrong in the same way the
// decoder is wrong — you write the payload from the same
// understanding of borsh that the decoder reads it with, so the two
// mistakes cancel out and the test passes. the real one cannot.
//
// argv:
//   bun bin/parse_fastfs.ts
//
// examples:
//   bun bin/parse_fastfs.ts
// ========================================

import {
  decode_base64_bytes_raw,
  fastfs_bytes_to_hex_fun,
  fastfs_can_display_fun,
  fastfs_decode_fun,
  fastfs_file_uri_fun,
  fastfs_file_url_fun,
  fastfs_is_call_fun,
  fastfs_validate_fun,
  parse_transaction,
} from "../src/index.js";
import type { FASTFS_FILE_INFO } from "../src/index.js";

// --- the real transaction -----------------------------------------
// a real mainnet FastFS upload: a `fastnear.png` of 121477 bytes
// with the mime `image/png`, uploaded by `mob.near` to `fastfs.near`.
const REAL_TX_HASH = "5vUqtNhYchWyrifviVZ9F6k4QprgfW9fjSAtcGMdQyRw";
const REAL_SIGNER = "mob.near";
const REAL_RECEIVER = "fastfs.near";
const REAL_PATH = "fastnear.png";
const REAL_MIME = "image/png";
const REAL_SIZE = 121477;

// --- the checks ----------------------------------------------------
let failures = 0;

function check(condition: boolean, message: string): void {
  if (condition) return;
  failures++;
  console.error(`  FAIL: ${message}`);
}

// --- the payload builders -----------------------------------------
// a borsh writer, so the test vectors are built from the SPEC and
// not copied out of the decoder.

/** a little-endian u32. */
function u32(value: number): number[] {
  const bytes: number[] = [];
  let rest = value >>> 0;
  for (let i = 0; i < 4; i++) {
    bytes.push(rest & 0xff);
    rest = rest >>> 8;
  }
  return bytes;
}

/** a length-prefixed utf-8 string. */
function borsh_string(value: string): number[] {
  const raw = [...new TextEncoder().encode(value)];
  return [...u32(raw.length), ...raw];
}

/** a length-prefixed byte run. */
function borsh_bytes(value: number[]): number[] {
  return [...u32(value.length), ...value];
}

/** the Simple variant with content. */
function simple_payload(
  relative_path: string,
  mime_type: string,
  content: number[],
): number[] {
  return [
    0,
    ...borsh_string(relative_path),
    1, // Some
    ...borsh_string(mime_type),
    ...borsh_bytes(content),
  ];
}

/** the Simple variant with no content — a delete. */
function delete_payload(relative_path: string): number[] {
  return [0, ...borsh_string(relative_path), 0];
}

/** the Partial variant. */
function partial_payload(
  relative_path: string,
  offset: number,
  full_size: number,
  mime_type: string,
  chunk: number[],
  nonce: number,
): number[] {
  return [
    1,
    ...borsh_string(relative_path),
    ...u32(offset),
    ...u32(full_size),
    ...borsh_string(mime_type),
    ...borsh_bytes(chunk),
    ...u32(nonce),
  ];
}

// --- 1. the real transaction --------------------------------------
console.log("the real mainnet transaction...");

{
  const response = await fetch("https://tx.main.fastnear.com/v0/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tx_hashes: [REAL_TX_HASH] }),
  });

  if (!response.ok) {
    console.error(`  FAIL: the api answered ${response.status}`);
    process.exit(1);
  }

  const body = (await response.json()) as {
    transactions?: {
      transaction?: {
        signer_id?: string;
        receiver_id?: string;
        actions?: {
          FunctionCall?: { method_name?: string; args?: string };
        }[];
      };
    }[];
  };

  const tx = body.transactions?.[0]?.transaction;
  const call = tx?.actions?.[0]?.FunctionCall;

  if (tx === undefined || call === undefined) {
    console.error("  FAIL: the api did not answer with the transaction");
    process.exit(1);
  }

  check(call.method_name === "__fastdata_fastfs", "the method name is not the FastFS one");
  check(tx.signer_id === REAL_SIGNER, `the signer is ${tx.signer_id}, expected ${REAL_SIGNER}`);
  check(tx.receiver_id === REAL_RECEIVER, `the receiver is ${tx.receiver_id}, expected ${REAL_RECEIVER}`);

  const bytes = decode_base64_bytes_raw(call.args ?? "");
  if (bytes === null) {
    console.error("  FAIL: the args are not base64");
    process.exit(1);
  }

  const info = fastfs_decode_fun(bytes);
  if (info === null) {
    console.error("  FAIL: the real payload did not decode");
    process.exit(1);
  }

  check(info.kind === "simple", `the kind is ${info.kind}, expected simple`);
  check(info.relative_path === REAL_PATH, `the path is "${info.relative_path}", expected "${REAL_PATH}"`);
  check(info.mime_type === REAL_MIME, `the mime is "${info.mime_type}", expected "${REAL_MIME}"`);
  check(info.size === REAL_SIZE, `the size is ${info.size}, expected ${REAL_SIZE}`);
  check(info.content.length === REAL_SIZE, `the content is ${info.content.length} bytes, expected ${REAL_SIZE}`);
  check(info.total_size === 0, `the total size is ${info.total_size}, expected 0 for a simple one`);
  check(info.offset === 0, `the offset is ${info.offset}, expected 0 for a simple one`);
  check(info.nonce === 0, `the nonce is ${info.nonce}, expected 0 for a simple one`);
  check(info.is_delete === false, "a simple upload with content is not a delete");

  // the bytes must survive the decode untouched. a png starts with
  // this magic, and the file is not utf-8 — a lossy decode would
  // mangle it.
  const magic = [...info.content.slice(0, 8)];
  const png_magic = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  check(
    magic.every((byte, index) => byte === png_magic[index]),
    `the content does not start with the png magic — got ${magic.join(" ")}`,
  );

  // the payload must not have problems.
  const problems = fastfs_validate_fun(info);
  check(problems.length === 0, `the real payload has problems: ${problems.join("; ")}`);

  // the url the contract says.
  const url = fastfs_file_url_fun(REAL_SIGNER, REAL_RECEIVER, info.relative_path);
  check(
    url === "https://mob.near.fastfs.io/fastfs.near/fastnear.png",
    `the url is "${url}"`,
  );

  // and the plugin reports it.
  const parsed = parse_transaction({
    transaction: {
      hash: REAL_TX_HASH,
      signer_id: REAL_SIGNER,
      receiver_id: REAL_RECEIVER,
      public_key: "ed25519:11111111111111111111111111111111",
      nonce: 1,
      actions: [
        {
          FunctionCall: {
            method_name: "__fastdata_fastfs",
            args: call.args ?? "",
            gas: 30000000000000,
            deposit: "0",
          },
        },
      ],
    },
    execution_outcome: {
      block_height: 1,
      block_timestamp: 1,
      outcome: { logs: [], receipt_ids: [], gas_burnt: 0, tokens_burnt: "0", executor_id: REAL_SIGNER, status: { SuccessValue: "" } },
    },
    receipts: [],
  } as never);

  // --- WHY THE COUNT IS CHECKED: the plugin ENRICHES the action that
  // is already there. an earlier version reported a second action, so
  // one call looked like two actions, and the count a reader checks
  // was a lie. one FastFS call must be one action.
  check(
    parsed.actions.length === 1,
    `the transaction has ${parsed.actions.length} action(s), expected 1`,
  );

  const fastfs_action = parsed.actions.find(
    (action) => action.fastfs !== undefined,
  );
  check(fastfs_action !== undefined, "the plugin enriched no action");
  // the type stays `FunctionCall` — that is what the call was.
  check(
    fastfs_action?.type === "FunctionCall",
    `the action's type is "${fastfs_action?.type}", expected "FunctionCall"`,
  );
  check(fastfs_action?.method_name === "__fastdata_fastfs", "the method name is wrong");
  check(fastfs_action?.fastfs?.size === REAL_SIZE, "the plugin's size is wrong");
  check(
    fastfs_action?.fastfs?.relative_path === REAL_PATH,
    `the plugin's path is "${fastfs_action?.fastfs?.relative_path}"`,
  );
  check(
    fastfs_action?.fastfs_url === "https://mob.near.fastfs.io/fastfs.near/fastnear.png",
    `the plugin's url is "${fastfs_action?.fastfs_url}"`,
  );

  // no action of a type of its own — the plugin does not add one.
  check(
    !parsed.actions.some((action) => action.type === "Fastfs"),
    "the plugin added an action of its own",
  );

  console.log(
    `  ok: ${REAL_PATH}, ${REAL_MIME}, ${REAL_SIZE} bytes, url ${url}`,
  );
}

// --- 2. an ordinary call -------------------------------------------
console.log("an ordinary call...");

{
  // --- WHY AN ORDINARY CALL IS CHECKED: the plugin touches every
  // parsed action, so it could add a detail to a call that is not a
  // FastFS upload, or change the count of an ordinary transaction.
  // neither may happen.
  const parsed = parse_transaction({
    transaction: {
      hash: "ordinary",
      signer_id: "alice.near",
      receiver_id: "contract.near",
      public_key: "ed25519:11111111111111111111111111111111",
      nonce: 1,
      actions: [
        {
          FunctionCall: {
            method_name: "set_greeting",
            args: Buffer.from('{"greeting":"hello"}', "utf-8").toString("base64"),
            gas: 30000000000000,
            deposit: "0",
          },
        },
        { Transfer: { deposit: "1000000000000000000000000" } },
      ],
    },
    execution_outcome: {
      block_height: 1,
      block_timestamp: 1,
      outcome: { logs: [], receipt_ids: [], gas_burnt: 0, tokens_burnt: "0", executor_id: "alice.near", status: { SuccessValue: "" } },
    },
    receipts: [],
  } as never);

  check(
    parsed.actions.length === 2,
    `the transaction has ${parsed.actions.length} action(s), expected 2`,
  );
  check(
    !parsed.actions.some((action) => action.fastfs !== undefined),
    "an ordinary call was given FastFS details",
  );
  check(
    !parsed.actions.some((action) => action.fastfs_url !== undefined),
    "an ordinary call was given a FastFS url",
  );
  check(
    parsed.actions[0]?.type === "FunctionCall",
    `the first action's type is "${parsed.actions[0]?.type}"`,
  );

  console.log("  ok: an ordinary call keeps its two actions and gains nothing");
}

// --- 3. a partial payload -----------------------------------------
console.log("a partial payload...");

{
  const chunk = [1, 2, 3, 4, 5, 6, 7, 8];
  const bytes = new Uint8Array(
    partial_payload("big.bin", 1048576, 2097152, "application/octet-stream", chunk, 42),
  );

  const info = fastfs_decode_fun(bytes);
  check(info !== null, "the partial payload did not decode");
  check(info?.kind === "partial", `the kind is ${info?.kind}, expected partial`);
  check(info?.relative_path === "big.bin", `the path is "${info?.relative_path}"`);
  check(info?.mime_type === "application/octet-stream", `the mime is "${info?.mime_type}"`);
  // the CHUNK's size, not the file's. this is the whole point of
  // having two numbers.
  check(info?.size === chunk.length, `the size is ${info?.size}, expected ${chunk.length}`);
  check(info?.total_size === 2097152, `the total size is ${info?.total_size}, expected 2097152`);
  check(info?.offset === 1048576, `the offset is ${info?.offset}, expected 1048576`);
  check(info?.nonce === 42, `the nonce is ${info?.nonce}, expected 42`);
  check(info?.is_delete === false, "a partial payload is not a delete");
  check(
    info?.content.length === chunk.length,
    `the content is ${info?.content.length} bytes, expected ${chunk.length}`,
  );

  console.log("  ok: the chunk's size and the whole file's size are different numbers");
}

// --- 4. a delete --------------------------------------------------
console.log("a delete...");

{
  const bytes = new Uint8Array(delete_payload("gone.txt"));

  const info = fastfs_decode_fun(bytes);
  check(info !== null, "the delete did not decode");
  check(info?.kind === "simple", `the kind is ${info?.kind}, expected simple`);
  check(info?.relative_path === "gone.txt", `the path is "${info?.relative_path}"`);
  check(info?.is_delete === true, "a simple with no content is not a delete");
  check(info?.content.length === 0, `the content is ${info?.content.length} bytes, expected 0`);
  check(info?.mime_type === "", `the mime is "${info?.mime_type}", expected the empty string`);
  check(info?.size === 0, `the size is ${info?.size}, expected 0`);
  check(info?.total_size === 0, `the total size is ${info?.total_size}, expected 0`);
  check(info?.offset === 0, `the offset is ${info?.offset}, expected 0`);
  check(info?.nonce === 0, `the nonce is ${info?.nonce}, expected 0`);

  console.log("  ok: a delete is a simple with no content");
}

// --- 5. the null cases --------------------------------------------
console.log("garbage, truncated and unknown...");

{
  check(fastfs_decode_fun(new Uint8Array()) === null, "empty bytes did not give null");
  check(
    fastfs_decode_fun(new Uint8Array([0xff, 0xff, 0xff, 0xff])) === null,
    "garbage did not give null",
  );
  check(
    fastfs_decode_fun(new Uint8Array([0xde, 0xad, 0xbe, 0xef, 0x00, 0x11])) === null,
    "garbage that starts with a zero did not give null",
  );
  // an unknown variant byte.
  check(
    fastfs_decode_fun(new Uint8Array([2, 0, 0, 0, 0])) === null,
    "an unknown variant did not give null",
  );
  check(
    fastfs_decode_fun(new Uint8Array([255, 0, 0, 0, 0])) === null,
    "an unknown variant did not give null",
  );

  // a truncated payload is null, NOT a partial result. every cut of
  // a good payload must give null.
  const good = new Uint8Array(simple_payload("a.txt", "text/plain", [1, 2, 3, 4, 5]));
  for (let cut = 1; cut < good.length; cut++) {
    const truncated = good.slice(0, cut);
    check(
      fastfs_decode_fun(truncated) === null,
      `a payload truncated to ${cut} byte(s) did not give null`,
    );
  }

  // a truncated partial payload too.
  const partial = new Uint8Array(
    partial_payload("b.bin", 0, 10, "application/octet-stream", [1, 2, 3], 7),
  );
  for (let cut = 1; cut < partial.length; cut++) {
    check(
      fastfs_decode_fun(partial.slice(0, cut)) === null,
      `a partial payload truncated to ${cut} byte(s) did not give null`,
    );
  }

  console.log("  ok: garbage, truncation and unknown variants all give null");
}

// --- 6. the hex format --------------------------------------------
console.log("the hex format...");

{
  const bytes = new Uint8Array(20);
  for (let i = 0; i < bytes.length; i++) bytes[i] = i;

  const hex = fastfs_bytes_to_hex_fun(bytes);
  const lines = hex.split("\n");

  check(lines.length === 2, `the hex has ${lines.length} line(s), expected 2`);
  check(
    lines[0] === "00 01 02 03 04 05 06 07 08 09 0a 0b 0c 0d 0e 0f",
    `the first line is "${lines[0]}"`,
  );
  check(lines[1] === "10 11 12 13", `the second line is "${lines[1]}"`);
  // no indent — the offset is on the line.
  check(!lines[1]?.startsWith(" "), "the lines are indented");
  // one space between the bytes.
  check(!hex.includes("  "), "the bytes are separated by more than one space");

  // exactly 16 bytes on a line.
  const many = new Uint8Array(33);
  const many_lines = fastfs_bytes_to_hex_fun(many).split("\n");
  check(many_lines.length === 3, `33 bytes made ${many_lines.length} line(s), expected 3`);
  check(
    many_lines[0]?.split(" ").length === 16,
    `the first line has ${many_lines[0]?.split(" ").length} bytes, expected 16`,
  );
  check(
    many_lines[2]?.split(" ").length === 1,
    `the last line has ${many_lines[2]?.split(" ").length} bytes, expected 1`,
  );

  check(fastfs_bytes_to_hex_fun(new Uint8Array()) === "", "empty bytes are not the empty string");

  console.log("  ok: one space between the bytes, a line break every 16");
}

// --- 7. the url and the uri ---------------------------------------
console.log("the url and the uri...");

{
  check(
    fastfs_file_url_fun("mob.near", "fastfs.near", "fastnear.png") ===
      "https://mob.near.fastfs.io/fastfs.near/fastnear.png",
    "the url is wrong",
  );
  check(
    fastfs_file_uri_fun("mob.near", "fastfs.near", "fastnear.png") ===
      "fastfs://mob.near/fastfs.near/fastnear.png",
    "the uri is wrong",
  );
  // the receiver is ANY account — there is no contract on it.
  check(
    fastfs_file_url_fun("alice.near", "bob.near", "a/b.txt") ===
      "https://alice.near.fastfs.io/bob.near/a/b.txt",
    "the url for another receiver is wrong",
  );

  console.log("  ok: the url and the uri");
}

// --- 8. the limits ------------------------------------------------
console.log("the limits...");

{
  // a path over 1024 chars is a problem.
  const long_path = "a".repeat(1025);
  const long_info = fastfs_decode_fun(
    new Uint8Array(simple_payload(long_path, "text/plain", [1])),
  );
  check(long_info !== null, "the long path did not decode");
  const long_problems = long_info === null ? [] : fastfs_validate_fun(long_info);
  check(long_problems.length > 0, "a path over 1024 chars is not a problem");

  // a path of exactly 1024 is fine.
  const edge_path = "a".repeat(1024);
  const edge_info = fastfs_decode_fun(
    new Uint8Array(simple_payload(edge_path, "text/plain", [1])),
  );
  const edge_problems = edge_info === null ? ["did not decode"] : fastfs_validate_fun(edge_info);
  check(edge_problems.length === 0, `a path of 1024 chars is a problem: ${edge_problems.join("; ")}`);

  // a delete with no mime is NOT a problem.
  const delete_info = fastfs_decode_fun(new Uint8Array(delete_payload("gone.txt")));
  check(delete_info !== null, "the delete did not decode");
  const delete_problems = delete_info === null ? ["did not decode"] : fastfs_validate_fun(delete_info);
  check(
    delete_problems.length === 0,
    `a delete with no mime is a problem: ${delete_problems.join("; ")}`,
  );

  // a delete carries no FILE, so its size of 0 is not a file that
  // is too small.
  check(
    delete_info?.size === 0,
    `the delete's size is ${delete_info?.size}, expected 0`,
  );

  // an upload with no mime IS a problem.
  const no_mime = fastfs_decode_fun(new Uint8Array(simple_payload("a.txt", "", [1])));
  check(no_mime !== null, "the payload with no mime did not decode");
  const no_mime_problems = no_mime === null ? [] : fastfs_validate_fun(no_mime);
  check(no_mime_problems.length > 0, "an upload with no mime is not a problem");

  // a bad offset is a problem.
  const bad_offset = fastfs_decode_fun(
    new Uint8Array(partial_payload("b.bin", 100, 10, "text/plain", [1], 7)),
  );
  const bad_offset_problems = bad_offset === null ? [] : fastfs_validate_fun(bad_offset);
  check(bad_offset_problems.length > 0, "an offset that is not a multiple of 1 MiB is not a problem");

  // a bad nonce is a problem.
  const bad_nonce = fastfs_decode_fun(
    new Uint8Array(partial_payload("b.bin", 0, 10, "text/plain", [1], 0)),
  );
  const bad_nonce_problems = bad_nonce === null ? [] : fastfs_validate_fun(bad_nonce);
  check(bad_nonce_problems.length > 0, "a nonce of 0 is not a problem");

  console.log("  ok: the limits are the indexer's");
}

// --- 9. the small predicates --------------------------------------
console.log("the method name and the display kind...");

{
  check(fastfs_is_call_fun("__fastdata_fastfs"), "the FastFS method is not matched");
  check(!fastfs_is_call_fun("__fastdata_other"), "another method is matched");
  check(!fastfs_is_call_fun(""), "the empty method is matched");

  check(fastfs_can_display_fun("text/plain") === "text", "text/plain is not text");
  check(fastfs_can_display_fun("text/csv") === "text", "text/csv is not text");
  check(fastfs_can_display_fun("application/json") === "text", "application/json is not text");
  check(fastfs_can_display_fun("image/png") === "image", "image/png is not an image");
  check(fastfs_can_display_fun("video/mp4") === "video", "video/mp4 is not a video");
  check(fastfs_can_display_fun("application/octet-stream") === null, "octet-stream is shown");
  check(fastfs_can_display_fun("application/pdf") === null, "pdf is shown");
  check(fastfs_can_display_fun("") === null, "the empty mime is shown");

  console.log("  ok: the method name and the display kind");
}

// --- 10. the decoder never throws ---------------------------------
console.log("the decoder never throws...");

{
  // every possible short payload, and every byte value in the
  // variant position.
  for (let length = 0; length <= 24; length++) {
    for (let head = 0; head < 256; head++) {
      const bytes = new Uint8Array(length);
      if (length > 0) bytes[0] = head;
      for (let i = 1; i < length; i++) bytes[i] = (i * 37 + head) % 256;
      try {
        fastfs_decode_fun(bytes);
      } catch (error) {
        check(false, `the decoder threw on ${length} byte(s): ${String(error)}`);
        break;
      }
    }
  }

  console.log("  ok: nothing threw");
}

// --- report -------------------------------------------------------
if (failures === 0) {
  console.log("\nALL FASTFS CHECKS PASSED");
  process.exit(0);
}

console.error(`\n${failures} FASTFS FAILURE(S)`);
process.exit(1);
// ========================================
// copyright 2026 by sleet.near
