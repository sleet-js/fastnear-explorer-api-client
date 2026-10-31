// ========================================
// SPLIT_ARGV
// bin primitive that separates positional args from flags in one
// pass, so every bin parses argv the same way.
//
// a flag listed in the bin's own boolean_flags takes no value; every
// other --flag takes the next token as its value.
//
// booleans are tracked by index rather than stored in the map, so a
// bin reads `seen.has("--desc")` instead of guessing whether the map
// holds "true" or an empty string.
// ========================================

export interface SPLIT_ARGV_OPTIONS {
  // the flags that stand alone with no value.
  boolean_flags?: Iterable<string>;
}

export interface SPLIT_ARGV_RESULT {
  positional: string[];
  flags: Map<string, string>;
  // true when the flag appeared in argv at all, boolean or not.
  seen: Set<string>;
}

export function split_argv(
  argv: string[],
  options: SPLIT_ARGV_OPTIONS = {},
): SPLIT_ARGV_RESULT {
  const boolean_flags = new Set(options.boolean_flags ?? []);
  const positional: string[] = [];
  const flags = new Map<string, string>();
  const seen = new Set<string>();

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i] as string;
    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }
    seen.add(token);
    if (boolean_flags.has(token)) continue;

    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      console.error(`split_argv: ${token} was passed without a value`);
      process.exit(1);
    }
    flags.set(token, value);
    i++;
  }

  return { positional, flags, seen };
}
// ========================================
// copyright 2026 by sleet.near
