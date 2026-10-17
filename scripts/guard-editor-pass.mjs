// Makes sure the editor pass changed wording only.
//
// Usage:
//   node scripts/guard-editor-pass.mjs <before.json> <after.json>
//
// Compares the protected fields of every item. If the editor pass changed any of
// them, added or removed items, or broke the JSON, the file at <after.json> is
// restored from <before.json> and the reason is printed. The research agent's
// original wording then goes on to the style check as it was.
import fs from "node:fs";

const PROTECTED = ["id", "date", "layer", "kind", "impact", "cloudPrimitives", "tradeoffs", "sources"];

const [beforePath, afterPath] = process.argv.slice(2);
if (!beforePath || !afterPath) {
  console.error("Usage: node scripts/guard-editor-pass.mjs <before.json> <after.json>");
  process.exit(2);
}

const beforeText = fs.readFileSync(beforePath, "utf8");
const before = JSON.parse(beforeText);

function restore(reason) {
  fs.writeFileSync(afterPath, beforeText);
  console.log(`Editor pass discarded: ${reason}. Kept the research agent's wording.`);
  process.exit(0);
}

let after;
try {
  after = JSON.parse(fs.readFileSync(afterPath, "utf8"));
} catch (e) {
  restore("output was not valid JSON");
}

const b = before.updates || [];
const a = after.updates || [];
if (a.length !== b.length) restore(`item count changed from ${b.length} to ${a.length}`);
if (after.scannedAt !== before.scannedAt) restore("scannedAt changed");

for (let i = 0; i < b.length; i++) {
  for (const f of PROTECTED) {
    if (JSON.stringify(b[i][f]) !== JSON.stringify(a[i][f])) restore(`${f} changed on ${b[i].id}`);
  }
}

let edited = 0;
for (let i = 0; i < b.length; i++) if (JSON.stringify(b[i]) !== JSON.stringify(a[i])) edited++;
console.log(`Editor pass accepted: ${edited} of ${b.length} item(s) reworded, protected fields unchanged.`);
