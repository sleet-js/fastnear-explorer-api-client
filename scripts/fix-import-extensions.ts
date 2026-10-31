// ========================================
// FIX_IMPORT_EXTENSIONS
// add the `.js` extension to the relative imports in the built js.
//
// WHY: node's esm resolver requires the full path, extension and all.
// the typescript compiler does NOT add it — it emits
//
//     import { ENDPOINTS } from "./stuff/ENDPOINTS";
//
// which bun resolves fine and node does NOT. a consumer who installs
// the package and runs it under node gets
//
//     ERR_MODULE_NOT_FOUND
//
// on the very first import.
//
// the fix is to rewrite the emitted imports to
//
//     import { ENDPOINTS } from "./stuff/ENDPOINTS.js";
//
// the source keeps its extensionless imports — that is what
// typescript wants — and this runs over the OUTPUT.
//
// the `.d.ts` files are left alone: typescript resolves the
// extensionless path there, and that is how the types resolve for
// an editor.
//
// usage:
//   bun run scripts/fix-import-extensions.ts
// ========================================

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIST_DIR = join(import.meta.dir, "..", "dist");

// a relative import with no extension:
//   from "./stuff/ENDPOINTS"
//   from "../parse/parse_transaction"
//   from "./API_RPC_QUERY"
const RELATIVE_IMPORT = /(\bfrom\s+")(\.\.?\/[^"]*?)(")/g;

function collect_js_files(dir: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      files.push(...collect_js_files(path));
      continue;
    }
    if (path.endsWith(".js")) files.push(path);
  }

  return files;
}

// a path that already has an extension, or that points at a folder
// with an index file, must be left alone.
function needs_extension(specifier: string): boolean {
  if (/\.(js|mjs|cjs|json|node)$/.test(specifier)) return false;
  // "./foo/index" -> the folder already has an index.js
  if (/\/index$/.test(specifier)) return false;
  return true;
}

function main() {
  const files = collect_js_files(DIST_DIR);
  let changed_files = 0;
  let changed_imports = 0;

  for (const file of files) {
    const source = readFileSync(file, "utf-8");

    const fixed = source.replace(
      RELATIVE_IMPORT,
      (match, prefix: string, specifier: string, suffix: string) => {
        if (!needs_extension(specifier)) return match;
        changed_imports++;
        return `${prefix}${specifier}.js${suffix}`;
      },
    );

    if (fixed !== source) {
      writeFileSync(file, fixed);
      changed_files++;
    }
  }

  console.log(
    `✅ added .js to ${changed_imports} import(s) across ${changed_files} file(s)`,
  );
}

main();
// ========================================
// copyright 2026 by sleet.near
