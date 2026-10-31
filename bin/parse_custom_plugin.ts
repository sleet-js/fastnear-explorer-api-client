#!/usr/bin/env bun
// ========================================
// PARSE_CUSTOM_PLUGIN
// the bin that proves the extension mechanism works.
//
// it registers a CUSTOM parser plugin — one this package does not
// ship — and shows that it runs alongside the built-ins.
//
// the plugin here reads a made-up "demo" event standard, so you can
// see the custom transfers land in `custom_transfers` while the
// built-in nep141/nep171 transfers still land in their own lists.
//
// argv:
//   bun bin/parse_custom_plugin.ts <hash> [<hash> ...]
//       [--network mainnet|testnet] [--testnet]
//
// examples:
//   bun bin/parse_custom_plugin.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg
// ========================================

import {
  api_transactions,
  parse_transaction,
  type PARSER_CONTEXT,
  type TRANSFER_PARSER,
} from "../src/index.js";
import { resolve_network } from "./fun/resolve_network.js";
import { split_argv } from "./fun/split_argv.js";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--testnet"];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

if (positional.length === 0) {
  console.error("usage: bun bin/parse_custom_plugin.ts <hash> [<hash> ...]");
  process.exit(1);
}

const network = resolve_network(flags, seen);

// --- the custom plugin ---------------------------------------------
// a plugin that reports a transfer for a contract standard this
// package knows nothing about.
//
// THIS IS THE WHOLE EXTENSION MECHANISM: an object with an id and
// a parse_event hook. nothing else is needed.
const demo_plugin: TRANSFER_PARSER = {
  id: "demo.unknown-standard",
  priority: 500,

  parse_event(event, context: PARSER_CONTEXT, contract_id: string) {
    if (event.standard !== "demo-standard") return [];

    return [
      {
        from: null,
        to: context.signer_id,
        amount: "1",
        token_type: "demo-standard",
        contract_id,
        extra: { note: "reported by a custom plugin" },
      },
    ];
  },
};

// a plugin that takes over a built-in. it claims nep141, so the
// built-in nep141 plugin is dropped and this one answers instead.
const override_plugin: TRANSFER_PARSER = {
  id: "demo.override-nep141",
  priority: 50,
  overrides: true,
  claims: ["nep141"],

  parse_event(event) {
    if (event.standard !== "nep141") return [];
    return [
      {
        from: null,
        to: "override.near",
        amount: "999",
        token_type: "nep141",
        contract_id: "override.near",
      },
    ];
  },
};

// --- run -----------------------------------------------------------
const response = await api_transactions({
  tx_hashes: positional,
  config: { network },
  quiet: true,
});

for (const tx of response.transactions) {
  const without_plugin = parse_transaction(tx);
  const with_plugin = parse_transaction(tx, { plugins: [demo_plugin] });
  const with_override = parse_transaction(tx, { plugins: [override_plugin] });

  console.log("HASH", with_plugin.hash);
  console.log(
    "  built-in transfers   ",
    without_plugin.transfers.length + without_plugin.nft_transfers.length,
  );
  console.log("  custom transfers    ", with_plugin.custom_transfers.length);

  for (const transfer of with_plugin.custom_transfers) {
    console.log(
      `    ${transfer.from ?? "Mint"} -> ${transfer.to ?? "Burn"}  ` +
        `${transfer.amount} ${transfer.token_type}  (${String(transfer.extra["note"])})`,
    );
  }

  if (with_plugin.custom_transfers.length === 0) {
    console.log("  (this transaction had no demo-standard events — that is fine)");
  }

  // the override: the built-in nep141 transfers must be GONE.
  const builtin_nep141 = without_plugin.transfers.filter(
    (t) => t.token_type === "nep141",
  ).length;
  const override_nep141 = with_override.transfers.filter(
    (t) => t.token_type === "nep141",
  );

  console.log("  OVERRIDE");
  console.log(`    built-in nep141      ${builtin_nep141}`);
  console.log(`    after the override  ${override_nep141.length}`);
  for (const transfer of override_nep141) {
    console.log(`      ${transfer.from ?? "Mint"} -> ${transfer.to ?? "Burn"}  ${transfer.amount}`);
  }
  if (
    builtin_nep141 > 0 &&
    override_nep141.length === 1 &&
    override_nep141[0]?.amount === "999"
  ) {
    console.log("    ok — the override replaced the built-in");
  }
}
// ========================================
// copyright 2026 by sleet.near
