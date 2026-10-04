/**
 * Pre-deploy sanity check for the static Mission Deck site.
 *   node scripts/check-site.mjs
 *
 * Verifies: every referenced local asset exists, inline JS parses, tags balance,
 * form ids are unique, no stale dates, and no retired event branding remains.
 * Exits non-zero so it can gate a deploy.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rel = (p) => path.join(ROOT, p);

let failures = 0;
const fail = (msg) => { failures += 1; console.log("  FAIL  " + msg); };
const ok = (msg) => console.log("  ok    " + msg);

const html = fs.readFileSync(rel("index.html"), "utf8");

/* ---------------------------------------------------- assets referenced --- */
console.log("\nAssets");
const wanted = new Set();
// url(...) in inline CSS
for (const m of html.matchAll(/url\(\s*["']?([^)"']+)/g)) {
  const u = m[1].trim();
  if (/^(#|data:|https?:|mailto:|file$|s,window)/.test(u) || u.includes("${")) continue;
  wanted.add(u.split("?")[0]);
}
// src/href attributes that look like images
for (const m of html.matchAll(/(?:src|href)\s*=\s*"([^"]+\.(?:jpg|jpeg|png|webp|avif|svg|gif))"/gi)) {
  wanted.add(m[1].split("?")[0]);
}
for (const a of wanted) {
  const onDisk = fs.existsSync(rel(a));
  onDisk ? ok(a) : fail(`${a} is referenced but missing from disk`);
}

/* ------------------------------------------------- inline script syntax --- */
console.log("\nInline JavaScript");
const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((m) => m[1])
  .filter((s) => s.trim());
let n = 0;
for (const s of scripts) {
  n += 1;
  try {
    new vm.Script(s, { filename: `index.html#script-${n}` });
    ok(`script #${n} (${s.length} chars)`);
  } catch (e) {
    fail(`script #${n}: ${e.message}`);
  }
}
/* ------------------------------------------------------------ tag balance -- */
console.log("\nMarkup");
for (const tag of ["form", "div", "section", "aside", "table", "tbody", "tr"]) {
  const open = (html.match(new RegExp(`<${tag}[\\s>]`, "gi")) || []).length;
  const close = (html.match(new RegExp(`</${tag}>`, "gi")) || []).length;
  open === close ? ok(`<${tag}> ${open}/${close} balanced`) : fail(`<${tag}> ${open} open vs ${close} close`);
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
const dupes = [...new Set(ids.filter((id) => ids.filter((x) => x === id).length > 1))];
dupes.length ? fail("duplicate ids: " + dupes.join(", ")) : ok(`${ids.length} ids, all unique`);

/* -------------------------------------------------------------- dates ----- */
console.log("\nEvent date");
for (const stale of ["2026-10-08", "Oct 8, 2026", "Oct 08, 2026", "08 OCT 2026", "October 8, 2026"]) {
  html.includes(stale) ? fail(`stale date present: ${stale}`) : ok(`no "${stale}"`);
}
const hit = ["2026-10-13", "Oct 13, 2026", "13 OCT 2026", "October 13, 2026"].filter((s) => html.includes(s));
hit.length ? ok(`${hit.length} October 13 reference(s)`) : fail("no October 13 reference found");

/* ------------------------------------------------------------- branding --- */
console.log("\nBranding");
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (/node_modules|\.next|\.vercel|tsconfig\.tsbuildinfo|package-lock\.json/.test(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (/\.(html|js|mjs|cjs|ts|tsx|json|css|md|txt)$/i.test(e.name)) files.push(full);
  }
})(ROOT);

// Accent-insensitive, so a re-introduced "Omertà" in any casing is still caught.
// Match 2K26 as a standalone label, not inside the Vercel project hostname slug.
const RETIRED = /omert|om26|\b2k26\b/i;
let branded = 0;
for (const f of files) {
  // The checker necessarily contains the words it looks for.
  if (f.endsWith("check-site.mjs")) continue;
  const rel = path.relative(ROOT, f);
  const text = fs.readFileSync(f, "utf8");
  text.split(/\r?\n/).forEach((line, i) => {
    if (RETIRED.test(line)) {
      branded += 1;
      fail(`${rel}:${i + 1}  ${line.trim().slice(0, 90)}`);
    }
  });
}
if (!branded) ok("no retired event branding anywhere in the repo");

/* ----------------------------------------------------------------- env ---- */
console.log("\nSecrets");
if (fs.existsSync(rel(".env")) || fs.existsSync(rel(".env.local")))
  fail("local environment files must not be committed or needed by the static site");
const pkg = JSON.parse(fs.readFileSync(rel("package.json"), "utf8"));
const forbiddenDeps = ["mongodb", "exceljs", "nodemailer", "mysql", "mysql2", "pg", "@supabase/supabase-js"];
const installedForbidden = forbiddenDeps.filter((d) => (pkg.dependencies || {})[d] || (pkg.devDependencies || {})[d]);
installedForbidden.length
  ? fail(`database/email dependencies remain: ${installedForbidden.join(", ")}`)
  : ok("no database or server-side email dependencies are declared");
if (!fs.existsSync(rel(".gitignore")) || !/^\.env$/m.test(fs.readFileSync(rel(".gitignore"), "utf8")))
  fail(".gitignore does not ignore .env");

console.log(failures ? `\n${failures} problem(s) found.` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
