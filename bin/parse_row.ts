#!/usr/bin/env bun
// ========================================
// PARSE_ROW
// the bin that renders a transaction the way an explorer row does.
//
// this is the closest thing to what you see in the fastnear ui:
// one line per action, one line per transfer, with the accounts,
// the amounts and the gas.
//
// argv:
//   bun bin/parse_row.ts <hash> [<hash> ...] [--network mainnet|testnet]
//
// examples:
//   bun bin/parse_row.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg
// ========================================

import {
  api_transactions,
  format_gas,
  format_near,
  parse_transaction,
} from "../src/index";
import { resolve_network } from "./fun/resolve_network";
import { split_argv } from "./fun/split_argv";

// --- FLAGS ---------------------------------------------------------
const BOOLEAN_FLAGS = ["--testnet"];

// --- argv ----------------------------------------------------------
const { positional, flags, seen } = split_argv(process.argv.slice(2), {
  boolean_flags: BOOLEAN_FLAGS,
});

if (positional.length === 0) {
  console.error("usage: bun bin/parse_row.ts <hash> [<hash> ...]");
  process.exit(1);
}

const network = resolve_network(flags, seen);

const response = await api_transactions({
  tx_hashes: positional,
  config: { network },
});

// --- render -------------------------------------------------------
for (const tx of response.transactions) {
  const parsed = parse_transaction(tx);

  const status =
    parsed.is_success === null
      ? "pending"
      : parsed.is_success
        ? "ok"
        : "failed";

  console.log("=".repeat(72));
  console.log(
    `${parsed.hash.slice(0, 10)}...  ${parsed.signer_id} -> ${parsed.receiver_id}  ` +
      `${format_gas(parsed.gas_burnt)}  ${status}`,
  );

  for (const action of parsed.actions) {
    const label = action.method_name ?? action.type;
    const deposit =
      action.deposit !== undefined && action.deposit !== "0"
        ? ` ${format_near(action.deposit)}`
        : "";
    console.log(`  </> ${label}${deposit}`);
  }

  for (const transfer of parsed.transfers) {
    const from = transfer.from ?? "Mint";
    const to = transfer.to ?? "Burn";
    const amount =
      transfer.token_type === "near"
        ? format_near(transfer.amount)
        : transfer.amount;
    console.log(`  ◎ ${from} -> ${to}  ${amount} ${transfer.token_type}`);
  }

  for (const transfer of parsed.nft_transfers) {
    const from = transfer.from ?? "Mint";
    const to = transfer.to ?? "Burn";
    console.log(`  ▧ ${from} -> ${to}  #${transfer.token_id}`);
  }
}
// ========================================
// copyright 2026 by sleet.near
