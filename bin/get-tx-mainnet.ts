#!/usr/bin/env bun
/**
 * Get specific transaction details (mainnet)
 * 
 * Usage: bun run bin/get-tx-mainnet.ts
 */

import { getTransactions } from "../src/index";

// Recent transaction hash from sleet.near
const txHash = "2NicER9jsngemFWLoxPEGTPdgMbzGy4AcD5BaP4DnwPW";

async function main() {
  console.log(`🔍 Fetching transaction ${txHash} (mainnet)...\n`);

  try {
    const response = await getTransactions([txHash]);

    if (response.transactions.length === 0) {
      console.log("❌ Transaction not found");
      return;
    }

    const tx = response.transactions[0];
    
    console.log("📋 Transaction Details:");
    console.log(`  Hash: ${tx.transaction.hash}`);
    console.log(`  Signer: ${tx.transaction.signer_id}`);
    console.log(`  Receiver: ${tx.transaction.receiver_id}`);
    console.log(`  Actions: ${tx.transaction.actions.length}`);
    console.log();
    
    console.log("📊 Execution Outcome:");
    console.log(`  Block Height: ${tx.execution_outcome.block_height}`);
    console.log(`  Block Hash: ${tx.execution_outcome.block_hash}`);
    console.log(`  Timestamp: ${tx.execution_outcome.block_timestamp}`);
    console.log(`  Gas Burnt: ${tx.execution_outcome.outcome.gas_burnt}`);
    console.log(`  Tokens Burnt: ${tx.execution_outcome.outcome.tokens_burnt}`);
    console.log(`  Executor: ${tx.execution_outcome.outcome.executor_id}`);
    console.log(`  Logs: ${tx.execution_outcome.outcome.logs.length}`);
    console.log();
    
    if (tx.receipts.length > 0) {
      console.log(`📬 Receipts: ${tx.receipts.length}`);
      tx.receipts.forEach((receipt, i) => {
        console.log(`  [${i}] ${receipt.receipt.receiver_id} <- ${receipt.receipt.predecessor_id}`);
      });
    }
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
  }
}

main();
