#!/usr/bin/env bun
/**
 * Get account transactions for sleet.near (mainnet)
 * 
 * Usage: bun run bin/get-account-mainnet.ts
 */

import { getAccount } from "../src/index";

const accountId = "sleet.near";

console.log(`🔍 Fetching transactions for ${accountId} (mainnet)...\n`);

try {
  const response = await getAccount(accountId, {
    limit: 10,
    desc: true,
  });

  console.log(`✅ Found ${response.txs_count} total transactions`);
  console.log(`📄 Showing ${response.account_txs.length} transactions:\n`);

  for (const tx of response.account_txs) {
    console.log(`  Hash: ${tx.transaction_hash}`);
    console.log(`  Block: ${tx.tx_block_height} | Time: ${tx.tx_block_timestamp}`);
    console.log(`  Success: ${tx.is_success} | Signer: ${tx.is_signer} | Receiver: ${tx.is_receiver}`);
    console.log(`  Function Call: ${tx.is_function_call}\n`);
  }

  if (response.resume_token) {
    console.log(`📌 Resume token: ${response.resume_token}`);
  }
} catch (error) {
  console.error("❌ Error:", error instanceof Error ? error.message : error);
}
