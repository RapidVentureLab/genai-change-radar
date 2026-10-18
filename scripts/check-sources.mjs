// Reopens every source link and reports the ones that no longer work.
//
// Usage:
//   node scripts/check-sources.mjs                       check milestone sources in updates.json
//   node scripts/check-sources.mjs --all                 check sources of every item
//   node scripts/check-sources.mjs --file other.json     check a different dataset
//
// Results:
//   ok       the page loaded (2xx or a redirect that ends in 2xx)
//   blocked  the site refused an automated request (401, 403, 429). Not a failure:
//            many vendor sites block bots. Check these by hand if they persist.
//   broken   404, 410, a 5xx error, or the domain did not answer. The run fails,
//            which sends the usual GitHub failure email.
import fs from "node:fs";
import { checkAll } from "./lib/links.mjs";

const args = process.argv.slice(2);
const fileArg = args.indexOf("--file");
const file = fileArg >= 0 ? args[fileArg + 1] : "updates.json";
const all = args.includes("--all");

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const items = (data.updates || []).filter((x) => all || x.kind === "milestone");

const checks = [];
for (const item of items) {
  for (const s of item.sources || []) checks.push({ id: item.id, name: s.name, url: s.url });
}
// Check each URL once, even if several items cite it.
const urls = [...new Set(checks.map((c) => c.url))];

const results = await checkAll(urls);

const broken = checks.filter((c) => results[c.url].result === "broken");
const blocked = checks.filter((c) => results[c.url].result === "blocked");
const ok = urls.filter((u) => results[u].result === "ok").length;

const lines = [`Source check: ${items.length} items, ${urls.length} unique links. ${ok} ok, ${new Set(blocked.map((c) => c.url)).size} blocked, ${new Set(broken.map((c) => c.url)).size} broken.`];
if (broken.length) {
  lines.push("\nBroken (fix or replace these sources):");
  for (const c of broken) lines.push(`  ${c.id}: ${c.name}\n    ${c.url} (${results[c.url].status})`);
}
if (blocked.length) {
  lines.push("\nBlocked automated access (check by hand if this persists):");
  for (const c of blocked) lines.push(`  ${c.id}: ${c.url} (${results[c.url].status})`);
}
const report = lines.join("\n");
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, "### Source check\n\n```\n" + report + "\n```\n");

if (broken.length) process.exit(1);
