# fastnear-explorer-api-client — usage guide

a typed client for the fastnear apis, with a pure transaction parser.

- the tx api — `src/fun/tx/`, one file per endpoint
- the v1 api — `src/fun/v1/`, one file per endpoint
- the parser — `src/parse/`, one master entry point plus a plugin seam
- the types — `src/types/`, one type per file, `SCREAMING_SNAKE_CASE`,
  split by service into `types/tx/`, `types/v1/` and `types/shared/`

functions are `snake_case`. types are `SCREAMING_SNAKE_CASE`.

## the three services

| service | host | repo |
|---|---|---|
| tx api | `tx.main.fastnear.com` | [fastnear/explorer-api](https://github.com/fastnear/explorer-api) |
| v1 api | `api.fastnear.com` | [fastnear/fastnear-api-server-rs](https://github.com/fastnear/fastnear-api-server-rs) |
| rpc node | `rpc.mainnet.fastnear.com` | [fastnear/nearcore](https://github.com/fastnear/nearcore) — the standard NEAR node, not a fastnear service |

each covers something the others do not. the tx api has the transaction
graph, the v1 api has aggregated account state, the rpc node has
contract internals.

---

## install

```bash
npm install @sleet-js/fastnear-explorer-api-client
# or
bun add @sleet-js/fastnear-explorer-api-client
```

---

## quick start

```typescript
import {
  api_blocks,
  api_transactions,
  parse_transaction,
} from "@sleet-js/fastnear-explorer-api-client";

// the recent blocks
const blocks = await api_blocks({ limit: 10, desc: true });
console.log(blocks.blocks[0].block_height);

// a transaction, parsed
const { transactions } = await api_transactions({
  tx_hashes: ["JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg"],
});
const parsed = parse_transaction(transactions[0]);

console.log(parsed.signer_id, "->", parsed.receiver_id);
console.log(parsed.gas_burnt, parsed.is_success);
for (const transfer of parsed.transfers) {
  console.log(transfer.from, "->", transfer.to, transfer.amount);
}
```

---

## networks

mainnet is the default. testnet goes in `config`:

```typescript
import { api_blocks } from "@sleet-js/fastnear-explorer-api-client";

const blocks = await api_blocks({
  limit: 10,
  config: { network: "testnet" },
});
```

or point the client somewhere else entirely:

```typescript
const blocks = await api_blocks({
  limit: 10,
  config: { base_url: "https://my-proxy.example.com" },
});
```

| network | v0 tx api | v1 account api | json-rpc node |
|---|---|---|---|
| mainnet | `https://tx.main.fastnear.com` | `https://api.fastnear.com` | `https://rpc.mainnet.fastnear.com` |
| testnet | `https://tx.test.fastnear.com` | `https://test.api.fastnear.com` | `https://rpc.testnet.fastnear.com` |

the endpoint paths are written down once each, in
`src/stuff/TX_ENDPOINT_PATHS.ts` and `src/stuff/V1_ENDPOINT_PATHS.ts`.

---

## the endpoints

every endpoint takes ONE options object. `config` and `signal` are
optional on all of them.

### api_blocks

POST /v0/blocks — a bounded list of blocks.

```typescript
const { blocks } = await api_blocks({
  limit: 20,
  desc: true,
  from_block_height: 222453000,
  to_block_height: 222453010,
});
```

the api caps the list at 100 rows. without `desc` the answer comes
back oldest first.

### api_block

POST /v0/block — one block, by height or hash.

```typescript
const block = await api_block({
  block_id: 222453064,
  with_transactions: true,
  with_receipts: true,
});

console.log(block.block.block_height);
console.log(block.block_txs.length);
console.log(block.block_receipts.length);
```

`block_receipts` is always present, even without `with_receipts` — it
is just empty then.

### api_transactions

POST /v0/transactions — full transactions by hash. at most 20 per call.

```typescript
const { transactions } = await api_transactions({
  tx_hashes: ["HASH1", "HASH2"],
});
```

this is the endpoint that gives the nested shape — actions, receipts,
outcomes. everything the parser needs.

### api_account

POST /v0/account — one account's transaction history.

```typescript
const history = await api_account({
  account_id: "sleet.near",
  limit: 50,
  is_real_signer: true,
  is_success: true,
  desc: true,
});

console.log(history.account_txs);
console.log(history.resume_token);
```

the history pages with `resume_token`:

```typescript
let resume_token: string | undefined;
const all = [];

do {
  const page = await api_account({
    account_id: "sleet.near",
    limit: 100,
    resume_token,
  });
  all.push(...page.account_txs);
  resume_token = page.resume_token;
} while (resume_token !== undefined);
```

the `is_*` flags narrow the history:

| flag | meaning |
|---|---|
| `is_real_signer` | the account really sent it |
| `is_real_receiver` | the account really received it |
| `is_any_signer` | the account signed it, directly or as a delegate |
| `is_delegated_signer` | the account signed it as a delegate |
| `is_predecessor` | the account ran one of the receipts |
| `is_function_call` | the account was called by a function call |
| `is_event_log` | the account emitted an event |
| `is_action_arg` | the account was an argument |
| `is_explicit_refund_to` | the account got an explicit refund |
| `is_success` | the transaction succeeded |

### api_receipt

POST /v0/receipt — one receipt, with the transaction that made it.

```typescript
const { receipt, transaction } = await api_receipt({
  receipt_id: "96F2anuMy9WXVgRvpkh9ALbtRqPMomcEYxzuaCryXEjW",
});
```

### api_account_full

GET /v1/account/{id}/full — the account overview.

```typescript
const account = await api_account_full({ account_id: "near" });

if (account !== null) {
  console.log(account.state?.balance);
  console.log(account.tokens);
  console.log(account.nfts);
  console.log(account.pools);
}
```

an account that does not exist comes back as `null`.

### api_account_ft, api_account_nft, api_account_staking

the granular slices of the overview. same rows, without the rest of
the account.

```typescript
const ft = await api_account_ft({ account_id: "near" });
const nft = await api_account_nft({ account_id: "near" });
const staking = await api_account_staking({ account_id: "near" });

console.log(ft?.tokens.length, nft?.tokens.length, staking?.pools.length);
```

all three come back as `null` for an account that does not exist.

### api_account_contracts, api_account_staking_ids

the lighter v0 paths — ids only, no balances.

```typescript
const ft_ids = await api_account_contracts({
  account_id: "near",
  kind: "ft",
});
console.log(ft_ids?.contract_ids);

const nft_ids = await api_account_contracts({
  account_id: "near",
  kind: "nft",
});

const pool_ids = await api_account_staking_ids({ account_id: "near" });
```

`kind` is `"ft"` or `"nft"`.

### api_public_key

**which accounts share this public key?**

```typescript
import { api_public_key } from "@sleet-js/fastnear-explorer-api-client";

const lookup = await api_public_key({
  public_key: "ed25519:6mtSNkJ1MjvNpc7sL6KAV6HykPhRrLcqv9DoYRAyKju3",
});

console.log(lookup.account_ids);
```

by default this answers with the accounts that registered the key at
**full access**. to also catch the accounts that hold it as a limited
(function-call) access key, add `include_all`:

```typescript
const all = await api_public_key({
  public_key: "ed25519:6mtSNkJ1MjvNpc7sL6KAV6HykPhRrLcqv9DoYRAyKju3",
  include_all: true,
});
```

the key may be any of the forms the protocol uses:

```
ed25519:…   secp256k1:…   ml-dsa-65:…   ml-dsa-65-hash:…
```

a key no account has registered answers with an empty list — that is
not an error.

the legacy v0 path is available too:

```typescript
const legacy = await api_public_key({
  public_key: "ed25519:...",
  legacy: true,
});
```

### api_token_holders

the top holders of a fungible token, biggest balance first. the api
answers with up to 100 accounts.

```typescript
const holders = await api_token_holders({ token_id: "wrap.near" });

console.log(holders.token_id, holders.accounts.length);
console.log(holders.accounts[0]);
```

`balance` is a decimal string of the token's smallest unit — it does
not fit in a js number.

### api_status, api_health

how far the indexer has got, and whether the service is up.

```typescript
const status = await api_status();
console.log(status.sync_block_height, status.sync_latency_sec);

const health = await api_health();
console.log(health.status);
```

`status` also has `sync_balance_block_height` — the height the
**balances** are indexed to. balances lag the blocks, so this is the
number to check before trusting a balance.

### api_rpc_query

the json-rpc node, for what the explorer api does not serve.

```typescript
import { api_rpc_query } from "@sleet-js/fastnear-explorer-api-client";

const result = await api_rpc_query<{ amount: string }>({
  params: {
    request_type: "view_account",
    account_id: "sleet.near",
  },
});
```

### api_rpc_call_function

a contract call.

```typescript
import { api_rpc_call_function } from "@sleet-js/fastnear-explorer-api-client";

const metadata = await api_rpc_call_function<{
  spec: string;
  name: string;
  symbol: string;
  decimals: number;
  icon?: string;
}>({
  contract_id: "batman-4.nearlytrade.near",
  method_name: "ft_metadata",
});

console.log(metadata?.symbol, metadata?.decimals);
```

the arguments go in as base64 and the answer comes back as raw bytes,
which this decodes for you.

---

## the parser

`parse_transaction` is the one entry point.

```typescript
import { parse_transaction } from "@sleet-js/fastnear-explorer-api-client";

const parsed = parse_transaction(transaction);
```

it is pure — no network, no dom, no react. the same input always gives
the same output.

### what comes back

```typescript
interface PARSE_RESULT {
  hash: string;
  signer_id: string;        // the REAL signer — the delegate's sender when relayed
  receiver_id: string;
  public_key?: string;
  relayer_id: string | null; // set when the tx was relayed
  is_delegated: boolean;
  block_height: number;
  timestamp: string;
  gas_burnt: number;        // tx gas + every receipt's gas
  is_success: boolean | null; // null = still settling
  actions: PARSED_ACTION[];
  transfers: TRANSFER_INFO[];      // near | nep141 | nep245
  nft_transfers: NFT_TRANSFER_INFO[]; // nep171
  custom_transfers: CUSTOM_TRANSFER[]; // from your own plugins
  receipts: RECEIPT_WITH_OUTCOME[];
  raw: TRANSACTION_DETAIL;   // nothing is ever lost
}
```

### the actions

each action is flat, with a `type` saying what it was:

```typescript
for (const action of parsed.actions) {
  switch (action.type) {
    case "FunctionCall":
      console.log(action.method_name, action.deposit, action.gas);
      break;
    case "Transfer":
      console.log("near transfer", action.deposit);
      break;
    case "AddKey":
      console.log(action.public_key, action.access_key_permission);
      break;
    case "DeployContract":
      console.log(action.code_hash_base58);
      break;
    default:
      console.log(action.type);
  }
}
```

`action.raw` holds the original action, untouched.

### the arguments

a function call carries its arguments as a base64 string. the parsed
action has them decoded as well:

```typescript
const action = parsed.actions[0];

if (action.args_decoded !== undefined) {
  console.log(action.args_decoded.text);   // the utf-8 text
  console.log(action.args_decoded.json);   // the parsed json, when it is json
  console.log(action.args_decoded.bytes);  // the raw bytes
}
```

to decide which view to show:

```typescript
import {
  args_view_modes,
  default_args_view_mode,
  bytes_to_hex,
} from "@sleet-js/fastnear-explorer-api-client";

const decoded = action.args_decoded!;

console.log(args_view_modes(decoded.json !== null));
// -> ["json", "raw", "hex", "base64"] or ["raw", "hex", "base64"]

console.log(default_args_view_mode(decoded.json !== null, decoded.is_printable));
// -> "json" | "raw" | "hex"

console.log(bytes_to_hex(decoded.bytes));
// -> "7b 22 72 65 63 65 69 76 65 72 ..."
```

the standalone helpers work on their own too:

```typescript
import {
  decode_args,
  try_parse_json,
  is_printable_text,
} from "@sleet-js/fastnear-explorer-api-client";

const decoded = decode_args(action.args);
```

a malformed or empty argument gives an empty result rather than
throwing.

### fastfs

a FastFS upload is a function call to `__fastdata_fastfs` whose
arguments are raw borsh bytes, not json. the parser decodes them and
reports the upload as a detail ON that call.

the call stays a `FunctionCall` and the action count stays what the
chain recorded — one call, one action:

```typescript
const upload = parsed.actions.find((action) => action.fastfs !== undefined);

if (upload !== undefined) {
  console.log(upload.type);                    // "FunctionCall"
  console.log(upload.fastfs?.relative_path);  // "fastnear.png"
  console.log(upload.fastfs?.mime_type);      // "image/png"
  console.log(upload.fastfs?.size);           // 121477
  console.log(upload.fastfs?.content);        // the bytes
  console.log(upload.fastfs_url);             // where it is served from
}
```

`size` and `total_size` are different numbers for a partial upload —
`size` is the chunk's size, `total_size` is the whole file's. a reader
must not confuse them.

`is_delete` is true for a delete, which is a simple upload with no
content. a delete carries no mime type, so its `mime_type` is the empty
string.

the decoder never throws. a payload that is not FastFS borsh, or that
is truncated, gives `null`:

```typescript
import {
  fastfs_decode_fun,
  fastfs_file_url_fun,
  fastfs_file_uri_fun,
  fastfs_bytes_to_hex_fun,
  fastfs_validate_fun,
  fastfs_can_display_fun,
} from "@sleet-js/fastnear-explorer-api-client";

const info = fastfs_decode_fun(bytes);
// null for anything that is not a FastFS payload

fastfs_file_url_fun("mob.near", "fastfs.near", "fastnear.png");
// "https://mob.near.fastfs.io/fastfs.near/fastnear.png"

fastfs_file_uri_fun("mob.near", "fastfs.near", "fastnear.png");
// "fastfs://mob.near/fastfs.near/fastnear.png"

// what a ui can show for this mime type.
fastfs_can_display_fun("image/png");  // "text" | "image" | "video" | null

// the indexer's limits. an empty list means the payload is fine.
fastfs_validate_fun(info);
```

the hex has a line break every 16 bytes, so a reader can count the
offset:

```typescript
console.log(fastfs_bytes_to_hex_fun(new Uint8Array([0, 9, 0, 0, 0])));
// "00 09 00 00 00"
```

`FastFS_DECODER_CONTRACT.md` in the repo root is the contract this
decoder and the rex engine's frontend both implement.

### the transfers

```typescript
for (const transfer of parsed.transfers) {
  console.log(
    transfer.from ?? "Mint",
    "->",
    transfer.to ?? "Burn",
    transfer.amount,
    transfer.token_type,
    transfer.contract_id,
  );
}
```

`from` is null for a mint, `to` is null for a burn.

`token_type` is `"near"`, `"nep141"`, `"nep245"`, or whatever standard
your own plugin reports.

### the relayer

a relayed transaction has a relayer — the account that paid the gas
and submitted it. the parser reports the REAL actor:

```typescript
if (parsed.is_delegated) {
  console.log(parsed.signer_id, "acted through", parsed.relayer_id);
}
```

### success

`is_success` is tri-state:

- `true` — it succeeded
- `false` — it failed
- `null` — it has not finished yet

the status of a transaction can point at ANOTHER receipt, which may
point at another. the parser follows that chain to the end.

---

## adding a parser of your own

a plugin is a plain object. there is no base class and no registration
call — you pass it in.

```typescript
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
console.log(parsed.custom_transfers);
```

`extra` is what marks a transfer as custom — without it the runtime
cannot tell it apart from a built-in one.

### the hooks

| hook | what it returns |
|---|---|
| `parse_transfers(context)` | fungible transfers |
| `parse_nft_transfers(context)` | nft transfers |
| `parse_event(event, context, contract_id)` | transfers from one event |
| `parse_actions(context)` | extra parsed actions — APPENDED |
| `enrich_actions(context)` | nothing. the details go onto `context.parsed_actions` in place |
| `matches(context)` | `false` to skip the plugin |

every hook is optional.

`parse_actions` APPENDS and `enrich_actions` MODIFIES. an appended
action makes the transaction look like it did more than it did, so a
plugin that knows something about an action that is already parsed
enriches it instead.

```typescript
const my_plugin = {
  id: "myapp.my-protocol",
  priority: 500,
  enrich_actions(context) {
    for (const action of context.parsed_actions) {
      if (action.method_name !== "__my_method") continue;
      action.my_detail = decode_my_payload(action.args);
    }
  },
};
```

### priority

lower runs first. the built-ins use:

| priority | plugin |
|---|---|
| 100 | native near transfers |
| 150 | delete-account refunds |
| 200 | nep141 |
| 300 | nep245 |
| 400 | nep171 |

a plugin with no priority gets 1000, so it runs after the built-ins.

### taking over a built-in

```typescript
const my_plugin = {
  id: "myapp.my-nep141",
  priority: 50,
  overrides: true,
  claims: ["nep141"],
  parse_event(event, context, contract_id) { ... },
};
```

the built-in nep141 parser is dropped, so your transfers are the only
ones reported for that standard.

### a reusable registry

build a registry once and pass it every time:

```typescript
import {
  create_parser_registry,
  register_parser,
  DEFAULT_PLUGINS,
} from "@sleet-js/fastnear-explorer-api-client";

const registry = register_parser(
  create_parser_registry([...DEFAULT_PLUGINS, my_plugin]),
  another_plugin,
);

const parsed = parse_transaction(tx, { registry });
```

a registry REPLACES the defaults — include `DEFAULT_PLUGINS` if you
still want them.

### the account overview

the account overview is a set of small helpers:

```typescript
import {
  format_storage_bytes,
  is_non_zero_balance,
} from "@sleet-js/fastnear-explorer-api-client";

console.log(format_storage_bytes(2263199));  // "2.2 MB"

console.log(is_non_zero_balance("0"));       // false
console.log(is_non_zero_balance(""));        // false
console.log(is_non_zero_balance("500"));     // true
```

`is_non_zero_balance` filters the tokens an account has touched but
does not hold — most of them.

---

## formatting

```typescript
import {
  format_near,
  format_near_with_unit,
  format_gas,
  format_token_amount,
  format_storage_bytes,
  time_ago,
  parse_public_key,
  truncate_public_key_data,
} from "@sleet-js/fastnear-explorer-api-client";

format_near("1000000000000000000000000");          // "1"
format_near_with_unit("1000000000000000000000000"); // "1 NEAR"
format_gas(3780000000000);                          // "3.78 Tgas"
format_token_amount("3029112427489378333", 18);     // "3.02911"
format_storage_bytes(2263199);                     // "2.2 MB"
time_ago("1793289264112006841");                   // "2d ago"

const key = parse_public_key("ed25519:79NxjQ...");
key.curve;            // "ed25519"
key.is_post_quantum;  // false
```

`format_near` and `format_token_amount` work on the STRING, never on a
number — yoctoNEAR amounts overflow a js number.

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
instead of the response:

```
=============================
 TX ACCOUNT FAILED on: https://tx.main.fastnear.com/v0/account
RESPONSE STATUS: 400 - Bad Request
ERROR: tx account failed: Json deserialize error: invalid value: "", the Account ID is too short at line 1 column 17
=============================
```

the label is the name of the call — `TX BLOCKS`, `V1 ACCOUNT FULL`,
`V1 PUBLIC KEY`, `RPC CALL FUNCTION ft_metadata`.

**the log is on by default.** pass `quiet: true` to turn it off:

```typescript
const blocks = await api_blocks({ limit: 10, quiet: true });
```

every endpoint takes it.

---

## errors

the api answers failures with PLAIN TEXT, not json. the client keeps
the server's own message and puts it on the error.

```typescript
import { api_blocks, type API_ERROR } from "@sleet-js/fastnear-explorer-api-client";

try {
  await api_blocks({ limit: 1000 });
} catch (error) {
  if (error instanceof Error && "status" in error) {
    const api_error = error as API_ERROR;
    console.log(api_error.status);  // 400
    console.log(api_error.body);    // the server's message
  }
}
```

the api rate limits with a 429. the client retries with a backoff
before giving up.

### abort

every endpoint takes an `AbortSignal`:

```typescript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

try {
  await api_blocks({ limit: 10, signal: controller.signal });
} catch (error) {
  if (error instanceof Error && error.name === "AbortError") {
    console.log("cancelled");
  }
}
```

```typescript
import {
  format_near,
  format_near_with_unit,
  format_gas,
  format_token_amount,
  format_storage_bytes,
  time_ago,
  parse_public_key,
  truncate_public_key_data,
} from "@sleet-js/fastnear-explorer-api-client";

format_near("1000000000000000000000000");          // "1"
format_near_with_unit("1000000000000000000000000"); // "1 NEAR"
format_gas(3780000000000);                          // "3.78 Tgas"
format_token_amount("3029112427489378333", 18);     // "3.02911"
format_storage_bytes(2263199);                     // "2.2 MB"
time_ago("1793289264112006841");                   // "2d ago"

const key = parse_public_key("ed25519:79NxjQ...");
key.curve;            // "ed25519"
key.is_post_quantum;  // false
```

there are no test files in this package. verification runs through the
bins — see `bin/README.md`.

```sh
bun bin/parse_encodings.ts
bun bin/parse_verify.ts
bun bin/parse_transaction.ts <hash>
bun bin/parse_row.ts <hash>
bun bin/parse_corpus.ts --standards
bun bin/parse_custom_plugin.ts <hash>
```

---

## notes on the api

- every tx api endpoint is a POST with a json body
- every v1 api endpoint is a GET with the parameters in the path
- the tx api caps `/v0/blocks` at 100 rows
- `/v0/transactions` takes at most 20 hashes per call
- the tx api answers failures with plain text
- the api rate limits — the client retries with a backoff
- `block_receipts` is always present in a block response
- the v1 api answers 404 for an account that does not exist, which
  comes back as `null` rather than an exception
- the v1 api needs no api key for any of these endpoints
- `CreateAccount` arrives as a bare string, every other action arrives
  as a single-key object
- an event's `data` is usually a list of objects, but it can be a
  single object or a list of plain strings
- "no owner" is encoded either by a missing key or by an empty string

---

## license

MIT
