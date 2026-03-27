#!/usr/bin/env bun
/**
 * Get account transactions for sleet.testnet (testnet)
 * 
 * Usage: bun run bin/get-account-testnet.ts
 */

import { getAccount, ENDPOINTS } from "../src/index";

const accountId = "sleet.testnet";

console.log(`🔍 Fetching transactions for ${accountId} (testnet)...\n`);

try {
  const response = await getAccount(accountId, {
    limit: 10,
    desc: true,
  }, {
    baseUrl: ENDPOINTS.testnet.api,
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
