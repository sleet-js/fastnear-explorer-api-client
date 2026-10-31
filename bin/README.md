# bin

runnable bins for the fastnear apis client. these are how the package
is verified — there are no test files in it.

all commands run from the project root.

---

## tx api bins

one bin per endpoint.

### api_blocks

POST /v0/blocks — the recent block list.

```sh
bun bin/api_blocks.ts --limit 5
bun bin/api_blocks.ts --limit 5 --desc
bun bin/api_blocks.ts --from 222453000 --to 222453010
bun bin/api_blocks.ts --limit 3 --testnet
```

`--desc` flips the order. without it the api answers oldest first.
`--limit` accepts 1..100 — the api caps the list at 100 rows.

### api_block

POST /v0/block — one block, by height or hash.

```sh
bun bin/api_block.ts 222453064
bun bin/api_block.ts 222453064 --transactions --receipts
bun bin/api_block.ts 96pvkznpNepxKQJqtuX2mwYFneQuMc3REq2L85qko2Td
```

### api_transactions

POST /v0/transactions — full transactions by hash. at most 20 hashes
per call.

```sh
bun bin/api_transactions.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg
bun bin/api_transactions.ts HASH1 HASH2 --json
```

### api_account

POST /v0/account — one account's transaction history.

```sh
bun bin/api_account.ts sleet.near --limit 5
bun bin/api_account.ts sleet.near --limit 5 --desc
bun bin/api_account.ts sleet.near --signer --success
bun bin/api_account.ts sleet.near --resume '<token>'
```

`--signer` narrows to transactions the account really sent.
`--receiver` to ones it received. `--success` / `--failed` filter by
outcome. `--resume` takes the token from a previous run.

### api_receipt

POST /v0/receipt — one receipt and the transaction that made it.

```sh
bun bin/api_receipt.ts 96F2anuMy9WXVgRvpkh9ALbtRqPMomcEYxzuaCryXEjW
```

---

## v1 api bins

### api_account_full

GET /v1/account/{id}/full — the account overview. balance, storage,
tokens, nft contracts, staking pools.

```sh
bun bin/api_account_full.ts near
bun bin/api_account_full.ts sleet.near --json
```

### api_account_tokens

the granular slices of the overview, and the lighter v0 paths.

```sh
bun bin/api_account_tokens.ts near --ft
bun bin/api_account_tokens.ts near --nft
bun bin/api_account_tokens.ts near --staking
bun bin/api_account_tokens.ts near --ft --ids
```

`--ids` uses the v0 path — contract ids only, no balances.

### api_public_key

which accounts share a public key.

```sh
bun bin/api_public_key.ts ed25519:6mtSNkJ1MjvNpc7sL6KAV6HykPhRrLcqv9DoYRAyKju3
bun bin/api_public_key.ts ed25519:11111111111111111111111111111111 --all
```

`--all` also catches the limited-access (function-call) keys.
`--legacy` uses the v0 path.

### api_token_holders

the top holders of a fungible token.

```sh
bun bin/api_token_holders.ts wrap.near
bun bin/api_token_holders.ts wrap.near --top 10
```

### api_status

how far the indexer has got, and whether the service is up.

```sh
bun bin/api_status.ts
bun bin/api_status.ts --health
```

### api_rpc_call_function

a contract call through the json-rpc node.

```sh
bun bin/api_rpc_call_function.ts batman-4.nearlytrade.near ft_metadata
bun bin/api_rpc_call_function.ts wrap.near ft_metadata --json
```

---

## the log format

### api_log_format

show the framed log block a call prints.

```sh
bun bin/api_log_format.ts
bun bin/api_log_format.ts --quiet
```

every other bin calls with `quiet: true`, so the bin's own summary is
what you see. this one shows the frame itself.

---

## parser bins

### parse_transaction

parse one transaction and print it.

```sh
bun bin/parse_transaction.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg
bun bin/parse_transaction.ts HASH1 HASH2 --json
bun bin/parse_transaction.ts HASH --full
```

### parse_row

render a transaction the way an explorer row does — one line per
action, one per transfer.

```sh
bun bin/parse_row.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg
```

### parse_args

show a function call's decoded arguments — the json, the raw text or
the hex.

```sh
bun bin/parse_args.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg
bun bin/parse_args.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg --hex
bun bin/parse_args.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg --action 1
```

### parse_verify

the verification bin. pulls a live corpus, parses every transaction
and checks the invariants. exits non-zero if anything fails.

```sh
bun bin/parse_verify.ts
bun bin/parse_verify.ts --blocks 20 --txs 150
```

it checks:

- nothing throws
- every parse has a hash
- a settled transaction resolves to true or false, never null
- a failed transaction resolves to false
- gas is never negative
- every transfer has an amount and a token type
- no transfer has an empty owner
- every action has a type
- a delegated transaction reports a relayer, and its signer is not
  the relayer
- the overrides mechanism really replaces a built-in parser

### parse_corpus

pull many transactions and report what the parser found across all of
them. the bin to reach for when you want to know which action types
and event standards are in the wild.

```sh
bun bin/parse_corpus.ts --blocks 10 --txs 60
bun bin/parse_corpus.ts --blocks 5 --txs 30 --standards
```

### parse_custom_plugin

prove that a custom plugin plugs in. shows the built-ins running
alongside a consumer plugin, and an override plugin replacing a
built-in.

```sh
bun bin/parse_custom_plugin.ts JCCCEDDB5gwKeUi6otSVv6ajM4nt9gn4AtWVfqNB7DTg
```

### parse_encodings

the self-check for base58, base64 and raw bytes. needs no network, so
it runs anywhere.

```sh
bun bin/parse_encodings.ts
bun bin/parse_encodings.ts --rounds 5000
```

---

## bin helpers

`bin/fun/` holds the shared bin primitives.

| file | what it does |
|---|---|
| `split_argv.ts` | separates positional args from flags |
| `check_limit.ts` | checks a `--limit` against the range an endpoint accepts |
| `resolve_network.ts` | turns `--network` / `--testnet` into a network id |
| `throttle.ts` | pauses between calls, so the api does not rate limit |

========================================
<br/>
copyright 2026 by sleet.near
