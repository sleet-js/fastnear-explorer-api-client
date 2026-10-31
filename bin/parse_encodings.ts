#!/usr/bin/env bun
// ========================================
// PARSE_ENCODINGS
// the self-check bin for the encodings.
//
// base58 and base64 are easy to get subtly wrong — a shift that
// overflows, a missing zero pad, a leading-zero byte dropped. this
// bin round-trips random data through both and checks the result.
//
// it needs no network, so it runs anywhere.
//
// argv:
//   bun bin/parse_encodings.ts [--rounds n]
//
// examples:
//   bun bin/parse_encodings.ts
//   bun bin/parse_encodings.ts --rounds 5000
// ========================================

import {
  decode_base58,
  decode_base64_bytes,
  decode_bytes,
  encode_base58,
  encode_base64,
} from "../src/index.js";
import { split_argv } from "./fun/split_argv.js";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS: string[] = [];

// --- argv ----------------------------------------------------------
const { flags } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

const rounds = Number(flags.get("--rounds") ?? "2000");

let failures = 0;

function check(condition: boolean, message: string): void {
  if (condition) return;
  failures++;
  console.error(`  FAIL: ${message}`);
}

// --- base58 -------------------------------------------------------
console.log(`base58, ${rounds} round(s)...`);

for (let round = 0; round < rounds; round++) {
  const length = 1 + Math.floor(Math.random() * 64);
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);

  const encoded = encode_base58(bytes);
  const decoded = decode_base58(encoded);

  check(decoded !== null, `round ${round}: decode returned null`);
  if (decoded === null) continue;

  check(
    decoded.length === bytes.length,
    `round ${round}: length ${decoded.length} != ${bytes.length}`,
  );
  check(
    bytes.every((byte, index) => byte === decoded[index]),
    `round ${round}: bytes differ`,
  );
}

// a known value — the empty byte array must encode to the empty
// string, and a single zero byte to "1".
check(encode_base58(new Uint8Array([0])) === "1", "single zero byte must be '1'");
check(
  encode_base58(new Uint8Array([0, 0, 1])) === "112",
  "leading zeros must be preserved",
);

// --- base64 -------------------------------------------------------
console.log(`base64, ${rounds} round(s)...`);

// base64 of TEXT is what a contract call sends, so the round trip is
// checked on text — random bytes would decode to replacement
// characters and the comparison would be meaningless.
const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]\":,_ ";

for (let round = 0; round < rounds; round++) {
  const length = 1 + Math.floor(Math.random() * 64);
  let text = "";
  for (let i = 0; i < length; i++) {
    text += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }

  const encoded = encode_base64(text);
  const decoded = decode_base64_bytes(encoded);

  check(
    decoded === text,
    `round ${round}: "${text}" came back as "${decoded}"`,
  );
}

check(encode_base64("{}") === "e30=", "'{}' must encode to 'e30='");
check(decode_base64_bytes("e30=") === "{}", "'e30=' must decode to '{}'");

// --- raw bytes ---------------------------------------------------
// the rpc node answers a contract call with raw bytes, not base64.
// decode_bytes is the decoder for that path.
console.log(`raw bytes, ${rounds} round(s)...`);

for (let round = 0; round < rounds; round++) {
  const length = 1 + Math.floor(Math.random() * 64);
  let text = "";
  for (let i = 0; i < length; i++) {
    text += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }

  const bytes = new TextEncoder().encode(text);
  const decoded = decode_bytes(bytes);

  check(
    decoded === text,
    `round ${round}: "${text}" came back as "${decoded}"`,
  );
}

check(
  decode_bytes(new TextEncoder().encode('{"spec":"ft-1.0.0"}')) ===
    '{"spec":"ft-1.0.0"}',
  "a json payload must survive the byte round trip",
);

// --- report -------------------------------------------------------
if (failures === 0) {
  console.log("\nALL ENCODING CHECKS PASSED");
  process.exit(0);
}

console.error(`\n${failures} ENCODING FAILURE(S)`);
process.exit(1);
// ========================================
// copyright 2026 by sleet.near
