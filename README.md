# @sleet-js/fastnear-explorer-api-client

clean ts library for the fastnear explorer api, with a pure transaction parser.

```sh
bun i
bun run build
# publish
bun publish --dry-run
bunx npm login
bun publish --access public
# other
bun run typecheck
bun run verify
```

---

## what is in here

| layer | folder | what it does |
|---|---|---|
| endpoints | `src/fun/` | one file per endpoint — `api_blocks`, `api_block`, `api_transactions`, `api_account`, `api_receipt`, `api_account_full`, `api_rpc_query`, `api_rpc_call_function` |
| plumbing | `src/stuff/` | the fetch helper, the hosts, the endpoint paths, the error type, the retry |
| parser | `src/parse/` | the transaction parser — pure, no network, no dom |
| types | `src/types/` | one type per file, `SCREAMING_SNAKE_CASE` |

functions are `snake_case`. types are `SCREAMING_SNAKE_CASE`.

---

## the api

```ts
import {
  api_blocks,
  api_block,
  api_transactions,
  api_account,
  api_account_full,
} from "@sleet-js/fastnear-explorer-api-client";

// the recent blocks
const blocks = await api_blocks({ limit: 10, desc: true });
console.log(blocks.blocks[0].block_height);

// one block, with its transactions
const block = await api_block({
  block_id: 222453064,
  with_transactions: true,
});
console.log(block.block_txs.length, block.block_receipts.length);

// full transactions — this is the nested shape
const txs = await api_transactions({
  tx_hashes: ["JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg"],
});
console.log(txs.transactions[0].transaction.actions);

// an account's history
const history = await api_account({ account_id: "sleet.near", limit: 50 });
console.log(history.account_txs, history.resume_token);

// the account overview — balance, tokens, nfts, pools
const account = await api_account_full({ account_id: "near" });
console.log(account?.state?.balance);
```

every endpoint takes one options object. the network goes in `config`:

```ts
const blocks = await api_blocks({
  limit: 10,
  config: { network: "testnet" },
});
```

or point it somewhere else entirely:

```ts
const blocks = await api_blocks({
  limit: 10,
  config: { base_url: "https://my-proxy.example.com" },
});
```

---

## the parser

one entry point. it takes a transaction and gives back everything a ui needs.

```ts
import { api_transactions, parse_transaction } from "@sleet-js/fastnear-explorer-api-client";

const { transactions } = await api_transactions({ tx_hashes: [hash] });
const parsed = parse_transaction(transactions[0]);

parsed.signer_id;      // the real signer — the delegate's sender when relayed
parsed.relayer_id;     // the relayer, when the tx was relayed
parsed.is_success;     // true | false | null (null = still settling)
parsed.gas_burnt;      // tx gas + every receipt's gas
parsed.actions;        // flat actions, ready to render
parsed.transfers;      // near | nep141 | nep245 transfers
parsed.nft_transfers;  // nep171 transfers
```

the parser is pure. no network, no dom, no react. the same input always
gives the same output.

### adding a parser of your own

a plugin is a plain object. there is no base class and no registration
call — you pass it in.

```ts
import { parse_transaction } from "@sleet-js/fastnear-explorer-api-client";

const my_plugin = {
  id: "myapp.my-token",
  priority: 500,

  parse_event(event, context, contract_id) {
    if (event.standard !== "my-standard") return [];

    return [{
      from: null,
      to: context.signer_id,
      amount: "1",
      token_type: "my-standard",
      contract_id,
      extra: { note: "my token" },
    }];
  },
};

const parsed = parse_transaction(tx, { plugins: [my_plugin] });
parsed.custom_transfers;  // your transfers land here
```

to take over a built-in instead of adding to it:

```ts
const my_plugin = {
  id: "myapp.my-nep141",
  priority: 50,
  overrides: true,
  claims: ["nep141"],
  parse_event(event, context, contract_id) { ... },
};
```

the built-in nep141 parser is then dropped, so your transfers are the
only ones reported for that standard.

see `src/parse/plugins/README.md` for the whole story.

---

## formatting

```ts
import { format_near, format_near_with_unit, format_gas, time_ago } from "@sleet-js/fastnear-explorer-api-client";

format_near("1000000000000000000000000");       // "1"
format_near_with_unit("1000000000000000000000000"); // "1 NEAR"
format_gas(3780000000000);                      // "3.78 Tgas"
time_ago("1793289264112006841");                // "2d ago"
```

---

## bins

there are no test files in this package. verification runs through the
bins in `bin/` — see `bin/README.md`.

```sh
bun bin/parse_encodings.ts
bun bin/parse_verify.ts
bun bin/parse_transaction.ts <hash>
bun bin/parse_row.ts <hash>
bun bin/parse_corpus.ts --standards
```

---

## notes on the api

- every v0 endpoint is a POST with a json body
- the api caps `/v0/blocks` at 100 rows
- `/v0/transactions` takes at most 20 hashes per call
- the api answers failures with plain text, not json
- the api rate limits — the client retries with a backoff
- `block_receipts` is always present in a block response

=====================
<br/>
copyright 2026 by sleet.near
