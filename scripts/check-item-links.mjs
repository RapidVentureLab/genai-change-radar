// Daily link check: opens every source link of today's items before they are published.
//
//   node scripts/check-item-links.mjs <inbox.json> [--hold]
//
// An item is held when its first source (the primary source) is broken, or when every
// one of its sources is broken. A "blocked" link (the site refuses bots) does not hold
// an item. The fact check reads those pages instead.
import fs from "node:fs";
import { checkAll } from "./lib/links.mjs";
import { holdItems, summary } from "./lib/hold.mjs";

const [file, ...rest] = process.argv.slice(2);
if (!file) { console.error("Usage: node scripts/check-item-links.mjs <inbox.json> [--hold]"); process.exit(2); }
const items = JSON.parse(fs.readFileSync(file, "utf8")).updates || [];
const results = await checkAll(items.flatMap((x) => (x.sources || []).map((s) => s.url)));

const failed = [];
const lines = [];
for (const x of items) {
  const srcs = x.sources || [];
  const states = srcs.map((s) => ({ ...s, ...results[s.url] }));
  const broken = states.filter((s) => s.result === "broken");
  lines.push(`${x.id}: ${states.map((s) => `${s.result} (${s.status})`).join(", ") || "no sources"}`);
  const reasons = [];
  if (!srcs.length) reasons.push("Link check: the item has no sources");
  else if (states[0].result === "broken") reasons.push(`Link check: the primary source does not open (${states[0].status}): ${states[0].url}`);
  else if (broken.length === srcs.length) reasons.push("Link check: none of the sources open");
  if (reasons.length) failed.push({ x, reasons });
}
const report = `Link check: ${items.length} items, ${Object.keys(results).length} links. ${failed.length} held.\n` + lines.join("\n");
console.log(report);
summary("Link check", report);
if (rest.includes("--hold")) holdItems(file, failed);
