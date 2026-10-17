// Checks the filter fields of radar items against docs/taxonomy.json.
//
// Usage:
//   node scripts/schema-check.mjs <file.json>          report problems
//   node scripts/schema-check.mjs <file.json> --strict exit 1 if any item has problems
//   node scripts/schema-check.mjs <inbox.json> --hold  move items with problems to inbox/held/<name>
//
// Rules (see docs/TAXONOMY.md):
//   vendors   required, at least one, each from the vendor list
//   decisions optional, at most three, each from the decision list
//   action    optional; type from the action list, "what" required,
//             "by" only as a real YYYY-MM-DD date
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const tax = JSON.parse(fs.readFileSync(path.join(root, "docs", "taxonomy.json"), "utf8"));
const VENDORS = new Set(tax.vendors.map((v) => v.id));
const DECISIONS = new Set(tax.decisions.map((d) => d.id));
const ACTIONS = new Set(tax.actionTypes.map((a) => a.id));

function validDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + "T00:00:00Z");
  return !isNaN(d) && d.toISOString().slice(0, 10) === s;
}

export function checkItem(x) {
  const errors = [];
  if (!Array.isArray(x.vendors) || x.vendors.length === 0) errors.push("vendors: missing or empty");
  else {
    for (const v of x.vendors) if (!VENDORS.has(v)) errors.push(`vendors: unknown value "${v}"`);
    if (new Set(x.vendors).size !== x.vendors.length) errors.push("vendors: duplicate value");
  }
  if (x.kind === "milestone" && (!x.short || String(x.short).split(/\s+/).length > 4)) errors.push("short: milestones need a timeline label of one to four words");
  if (x.decisions !== undefined) {
    if (!Array.isArray(x.decisions)) errors.push("decisions: must be a list");
    else {
      if (x.decisions.length > 3) errors.push(`decisions: ${x.decisions.length} values, limit 3`);
      for (const d of x.decisions) if (!DECISIONS.has(d)) errors.push(`decisions: unknown value "${d}"`);
    }
  }
  if (x.action !== undefined) {
    const a = x.action;
    if (!a || typeof a !== "object") errors.push("action: must be an object");
    else {
      if (!ACTIONS.has(a.type)) errors.push(`action.type: unknown value "${a.type}"`);
      if (!a.what || !String(a.what).trim()) errors.push("action.what: missing");
      if (a.by !== undefined && !validDate(a.by)) errors.push(`action.by: "${a.by}" is not a real YYYY-MM-DD date`);
    }
  }
  return errors;
}

// ---- main ----
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith("--"));
  if (!file) {
    console.error("Usage: node scripts/schema-check.mjs <file.json> [--strict|--hold]");
    process.exit(2);
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const items = data.updates || [];
  const failed = items.map((x) => ({ x, errors: checkItem(x) })).filter((r) => r.errors.length);

  const lines = [`Schema check: ${items.length} items, ${items.length - failed.length} pass, ${failed.length} with problems`];
  for (const r of failed) {
    lines.push(`\nFAIL ${r.x.id}`);
    for (const e of r.errors) lines.push(`  ${e}`);
  }
  const report = lines.join("\n");
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, "### Schema check\n\n```\n" + report + "\n```\n");

  if (args.includes("--hold") && failed.length) {
    const heldDir = path.join(path.dirname(file), "held");
    fs.mkdirSync(heldDir, { recursive: true });
    const heldFile = path.join(heldDir, path.basename(file));
    const existing = fs.existsSync(heldFile) ? JSON.parse(fs.readFileSync(heldFile, "utf8")) : { updates: [] };
    for (const r of failed) existing.updates.push({ ...r.x, heldReasons: r.errors });
    fs.writeFileSync(heldFile, JSON.stringify(existing, null, 2) + "\n");
    const bad = new Set(failed.map((r) => r.x.id));
    data.updates = items.filter((x) => !bad.has(x.id));
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
    console.log(`\nHeld ${failed.length} item(s) in ${heldFile}.`);
  }
  if (args.includes("--strict") && failed.length) process.exit(1);
}
