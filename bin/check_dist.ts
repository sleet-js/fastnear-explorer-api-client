#!/usr/bin/env bun
// ========================================
// CHECK_DIST
// the bin that checks the published artifact is actually usable.
//
// A PACKAGE THAT BUILDS IS NOT A PACKAGE THAT WORKS. the tsc
// compiler emits extensionless relative imports:
//
//     import { ENDPOINTS } from "./stuff/ENDPOINTS";
//
// bun resolves that fine. node does NOT — its esm resolver needs the
// full path with the extension. so a consumer who installs the
// package and runs it under node gets ERR_MODULE_NOT_FOUND on the
// very first import, while every local test passes.
//
// this bin checks the built output for that, and for the other
// things that must be true of a publishable artifact:
//
//   - every relative import in the js carries a .js extension
//   - the entry points the package.json points at exist
//   - the js actually imports under plain node
//   - nothing that should not ship is in the tarball
//
// argv:
//   bun bin/check_dist.ts
//
// it needs a build first: `bun run build`.
// ========================================

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const DIST = join(ROOT, "dist");

const failures: string[] = [];

function fail(message: string): void {
  failures.push(message);
}

function collect_files(dir: string, extension: string): string[] {
  const found: string[] = [];

  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      found.push(...collect_files(path, extension));
      continue;
    }
    if (path.endsWith(extension)) found.push(path);
  }

  return found;
}

// --- the dist must exist ------------------------------------------
if (!existsSync(DIST)) {
  console.error("❌ dist/ does not exist — run `bun run build` first");
  process.exit(1);
}

// --- every relative import needs a .js extension -----------------
const js_files = collect_files(DIST, ".js");
const RELATIVE_IMPORT = /\bfrom\s+"(\.\.?\/[^"]*)"/g;

let extensionless = 0;

for (const file of js_files) {
  const source = readFileSync(file, "utf-8");
  for (const match of source.matchAll(RELATIVE_IMPORT)) {
    const specifier = match[1] as string;
    if (/\.(js|mjs|cjs|json|node)$/.test(specifier)) continue;
    if (/\/index$/.test(specifier)) continue;
    extensionless++;
    if (extensionless <= 5) {
      console.error(`  ${file.replace(`${ROOT}/`, "")} imports "${specifier}" with no .js`);
    }
  }
}

if (extensionless > 0) {
  fail(
    `${extensionless} relative import(s) have no .js extension — node's esm resolver needs them`,
  );
}

// --- the entry points must exist ---------------------------------
const package_json = JSON.parse(
  readFileSync(join(ROOT, "package.json"), "utf-8"),
);

const entry_points: string[] = [
  package_json.main,
  package_json.module,
  package_json.types,
];

for (const entry of entry_points) {
  if (typeof entry !== "string") continue;
  if (!existsSync(join(ROOT, entry))) {
    fail(`package.json points at "${entry}" but it does not exist`);
  }
}

// --- the js must import under plain node --------------------------
try {
  execFileSync(
    "node",
    [
      "--input-type=module",
      "-e",
      `import(${JSON.stringify(join(DIST, "index.js"))}).then(() => console.log("ok")).catch((e) => { console.error(e.message); process.exit(1); });`,
    ],
    { stdio: ["ignore", "pipe", "pipe"], encoding: "utf-8" },
  );
} catch (error) {
  const output = (error as { stderr?: string }).stderr ?? "";
  fail(`the built js does not import under node: ${output.split("\n")[0]}`);
}

// --- nothing that should not ship is in the tarball ---------------
const shipped = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  cwd: ROOT,
  encoding: "utf-8",
});

const packed = JSON.parse(shipped) as { files: { path: string }[] }[];
const paths = (packed[0]?.files ?? []).map((file) => file.path);

for (const prefix of ["bin/", "src/", "scripts/"]) {
  const leaked = paths.filter((path) => path.startsWith(prefix));
  if (leaked.length > 0) {
    fail(`${leaked.length} ${prefix} file(s) would ship: ${leaked.slice(0, 3).join(", ")}`);
  }
}

// --- report --------------------------------------------------------
console.log(`CHECK DIST`);
console.log(`  js files       ${js_files.length}`);
console.log(`  packed files   ${paths.length}`);

if (failures.length === 0) {
  console.log("\nALL DIST CHECKS PASSED");
  process.exit(0);
}

console.error(`\n${failures.length} FAILURE(S):`);
for (const failure of failures) {
  console.error(`  ${failure}`);
}
process.exit(1);
// ========================================
// copyright 2026 by sleet.near
