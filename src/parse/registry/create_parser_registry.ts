// ========================================
// CREATE_PARSER_REGISTRY
// build a parser registry from a list of plugins.
//
// the plugins are sorted by priority — lower first — so the
// deterministic order is the same no matter how the list was
// written.
//
// OVERRIDES: a plugin with `overrides: true` claims the standards
// listed in its `claims` field. any OTHER plugin claiming the same
// standard is dropped — whether it is a built-in or another
// overriding plugin.
//
// that is how a consumer replaces a built-in behaviour:
//
//   {
//     id: "myapp.nep141",
//     priority: 50,          // runs first
//     overrides: true,
//     claims: ["nep141"],    // the built-in nep141 plugin is dropped
//     parse_event(event) { ... },
//   }
//
// THE WINNER OF A CLAIM IS THE HIGHEST PRIORITY OVERRIDER.
//
// if two plugins both override "nep141", the one with the lower
// priority number wins and the other is dropped. this is what keeps
// an override from turning into duplicated transfers — a silent
// double-count in a financial parser is worse than an error.
//
// AN OVERRIDE ONLY BEATS A PLUGIN OF EQUAL OR LOWER PRIORITY.
//
// an override at priority 200 replaces the built-in nep141 plugin
// (also 200). one at priority 201 does not — it runs after the
// built-in, so it is not replacing it, it is adding to it.
//
// the registry is frozen — the array cannot be changed after it is
// built. use register_parser to make a new one with an extra plugin.
// ========================================

import type { PARSER_REGISTRY } from "../../types/PARSER_REGISTRY";
import type { TRANSFER_PARSER } from "../../types/TRANSFER_PARSER";

export function create_parser_registry(
  plugins: TRANSFER_PARSER[],
): PARSER_REGISTRY {
  const sorted = [...plugins].sort(
    (left, right) => (left.priority ?? 1000) - (right.priority ?? 1000),
  );

  const priority_of = new Map<string, number>();
  for (const plugin of sorted) {
    priority_of.set(plugin.id, plugin.priority ?? 1000);
  }

  // the winning override for each claimed standard.
  const claimed_by = new Map<string, string>();

  for (const plugin of sorted) {
    if (plugin.overrides !== true) continue;
    for (const claim of plugin.claims ?? []) {
      const winner = claimed_by.get(claim);
      if (winner === undefined) {
        claimed_by.set(claim, plugin.id);
        continue;
      }
      // an existing winner keeps the claim unless this plugin has a
      // strictly higher priority (a lower number).
      const winner_priority = priority_of.get(winner) ?? 1000;
      const plugin_priority = plugin.priority ?? 1000;
      if (plugin_priority < winner_priority) {
        claimed_by.set(claim, plugin.id);
      }
    }
  }

  const kept = sorted.filter((plugin) => {
    const claims = plugin.claims ?? [];
    if (claims.length === 0) return true;

    const plugin_priority = plugin.priority ?? 1000;

    for (const claim of claims) {
      const winner = claimed_by.get(claim);
      // nobody claimed it — the plugin stays.
      if (winner === undefined) continue;
      // this plugin IS the winner — it stays.
      if (winner === plugin.id) continue;

      // somebody else won this claim. the plugin is dropped UNLESS
      // it runs strictly earlier than the winner — then it is not
      // the one being replaced, it is just an earlier plugin.
      const winner_priority = priority_of.get(winner) ?? 1000;
      if (plugin_priority >= winner_priority) return false;
    }

    return true;
  });

  return { parsers: Object.freeze(kept) as TRANSFER_PARSER[] };
}
// ========================================
// copyright 2026 by sleet.near
