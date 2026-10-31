# @sleet-js/fastnear-explorer-api-client

clean ts library for the fastnear apis, with a pure transaction parser.

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

## the apis it covers

three services, all fastnear's, none of them redundant — each covers
something the others do not.

| service | host | repo |
|---|---|---|
| **tx api** | `tx.main.fastnear.com` | [fastnear/explorer-api](https://github.com/fastnear/explorer-api) |
| **v1 api** | `api.fastnear.com` | [fastnear/fastnear-api-server-rs](https://github.com/fastnear/fastnear-api-server-rs) |
| **rpc node** | `rpc.mainnet.fastnear.com` | [fastnear/nearcore](https://github.com/fastnear/nearcore) — this one is the standard NEAR node, not a fastnear service |

- the **tx api** gives the transaction graph — nested actions,
  receipts, outcomes, event logs
- the **v1 api** gives aggregated account state — balance, storage,
  every ft / nft / pool held, plus the public key lookup
- the **rpc node** gives contract internals — `ft_metadata`,
  `view_account`, `view_access_key_list`

---

## what is in here

| layer | folder | what it does |
|---|---|---|
| endpoints | `src/fun/` | one file per endpoint, split by service — `fun/tx/` for the tx api, `fun/v1/` for the v1 api |
| plumbing | `src/stuff/` | the fetch helpers, the hosts, the endpoint paths, the error type, the retry |
| parser | `src/parse/` | the transaction parser — pure, no network, no dom |
| types | `src/types/` | one type per file, `SCREAMING_SNAKE_CASE`, split by service — `types/tx/`, `types/v1/`, `types/shared/` |

functions are `snake_case`. types are `SCREAMING_SNAKE_CASE`.

### the endpoints

| folder | service | functions |
|---|---|---|
| `src/fun/tx/` | the tx api | `api_blocks`, `api_block`, `api_transactions`, `api_account`, `api_receipt` |
| `src/fun/v1/` | the v1 api | `api_account_full`, `api_account_ft`, `api_account_nft`, `api_account_staking`, `api_account_contracts`, `api_account_staking_ids`, `api_public_key`, `api_token_holders`, `api_status`, `api_health` |
| `src/fun/v1/` | the rpc node | `api_rpc_query`, `api_rpc_call_function` |

---

## the api

### the tx api

```ts
import {
  api_blocks,
  api_block,
  api_transactions,
  api_account,
  api_receipt,
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

// one receipt and the transaction that made it
const receipt = await api_receipt({
  receipt_id: "96F2anuMy9WXVgRvpkh9ALbtRqPMomcEYxzuaCryXEjW",
});
```

### the v1 api

```ts
import {
  api_account_full,
  api_account_ft,
  api_account_nft,
  api_account_staking,
  api_account_contracts,
  api_public_key,
  api_token_holders,
  api_status,
  api_health,
} from "@sleet-js/fastnear-explorer-api-client";

// the account overview — balance, tokens, nfts, pools
const account = await api_account_full({ account_id: "near" });
console.log(account?.state?.balance, account?.tokens.length);

// the granular slices of the same thing
const ft = await api_account_ft({ account_id: "near" });
const nft = await api_account_nft({ account_id: "near" });
const staking = await api_account_staking({ account_id: "near" });

// the lighter v0 paths — contract ids only
const ids = await api_account_contracts({
  account_id: "near",
  kind: "ft",
});
console.log(ids?.contract_ids);

// WHICH ACCOUNTS SHARE THIS KEY?
const lookup = await api_public_key({
  public_key: "ed25519:6mtSNkJ1MjvNpc7sL6KAV6HykPhRrLcqv9DoYRAyKju3",
});
console.log(lookup.account_ids);

// add include_all to also catch limited-access (function-call) keys
const all = await api_public_key({
  public_key: "ed25519:6mtSNkJ1MjvNpc7sL6KAV6HykPhRrLcqv9DoYRAyKju3",
  include_all: true,
});

// the top holders of a token
const holders = await api_token_holders({ token_id: "wrap.near" });
console.log(holders.accounts.length, holders.accounts[0]);

// is the indexer keeping up?
const status = await api_status();
console.log(status.sync_block_height, status.sync_latency_sec);

const health = await api_health();
console.log(health.status);
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

## releasing

there is a release workflow in `.github/workflows/release.yml`. it is
manual — trigger it from the Actions tab.

it bumps the version, commits, tags, builds and publishes to npm with
trusted publishing (OIDC). there is no npm token in the repo.

the git tag and the npm version are always the same string:

```
tag v0.1.1  <->  npm @sleet-js/fastnear-explorer-api-client@0.1.1
```

the workflow takes a `bump` of `patch` only, or an exact `version`.
the package is pre-1.0, so a breaking change ships as a `patch` — a
`major` bump would take it to 1.0.0 and imply a stability promise it
does not make.

### the npm side, once

```
Package Settings -> Trusted Publisher -> GitHub Actions
  Organization or user : sleet-js
  Repository           : fastnear-explorer-api-client
  Workflow filename    : release.yml
  Allowed actions      : npm publish
```

the config must complete its first publish within 2 days or it
expires.

### the scripts

you can run the version steps by hand:

```sh
bun run release:version patch   # what would the next version be?
bun run version:dry-run         # preview the bump
bun run version:sync 0.1.1      # write an exact version
```

`release:version` looks at BOTH the local package.json and the
versions already on npm, and takes the higher one. that way a version
published but never committed cannot be published twice.

---

## the call log

every call prints a framed block — the same format the middleman
packages use:

```
=============================
 TX BLOCKS via POST on: https://tx.main.fastnear.com/v0/blocks
RESPONSE STATUS: 200 - OK
RESPONSE: { ... }
=============================
```

a failed call prints the same frame with `FAILED` and the error
instead of the response.

**the log is on by default.** pass `quiet: true` to turn it off — a
library that prints on every call is unusable inside a server or a
ui:

```ts
const blocks = await api_blocks({ limit: 10, quiet: true });
```

`bun bin/api_log_format.ts` shows the format, and `--quiet` shows the
same call with the log off.

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
