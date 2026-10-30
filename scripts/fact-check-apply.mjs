// Applies the fact checker's verdicts to today's inbox.
//
//   node scripts/fact-check-apply.mjs <inbox.json> <verdicts.json> [--hold]
//
//   supported     published
//   unsupported   held, with the fact checker's problems as reasons
//   unverifiable  published, and recorded as not verified in the audit file
//   no verdict    treated as unverifiable
//
// If the verdicts file is missing or broken, nothing is held and the run records that
// the fact check did not run. The audit record is written to inbox/factcheck/<name>.
import fs from "node:fs";
import path from "node:path";
import { holdItems, summary } from "./lib/hold.mjs";

const [file, verdictFile, ...rest] = process.argv.slice(2);
if (!file || !verdictFile) { console.error("Usage: node scripts/fact-check-apply.mjs <inbox.json> <verdicts.json> [--hold]"); process.exit(2); }
const items = JSON.parse(fs.readFileSync(file, "utf8")).updates || [];
if (!items.length) { console.log("Fact check: no items today."); process.exit(0); }

let verdicts = null;
try {
  const v = JSON.parse(fs.readFileSync(verdictFile, "utf8"));
  if (v.checkedAt && Array.isArray(v.items)) verdicts = v;
} catch { /* missing or not JSON */ }

const auditDir = path.join(path.dirname(file), "factcheck");
const auditFile = path.join(auditDir, path.basename(file));
fs.mkdirSync(auditDir, { recursive: true });

if (!verdicts) {
  const msg = `Fact check did not run or wrote no valid result. ${items.length} item(s) continue without it.`;
  console.warn(msg);
  summary("Fact check", msg);
  fs.writeFileSync(auditFile, JSON.stringify({ ran: false, checkedAt: null, items: items.map((x) => ({ id: x.id, verdict: "not checked" })) }, null, 2) + "\n");
  process.exit(0);
}

const byId = new Map(verdicts.items.map((v) => [v.id, v]));
const failed = [];
const audit = [];
for (const x of items) {
  const v = byId.get(x.id);
  const verdict = v && ["supported", "unsupported", "unverifiable"].includes(v.verdict) ? v.verdict : "unverifiable";
  const problems = (v && Array.isArray(v.problems) ? v.problems : []).map(String).filter(Boolean);
  const notes = (v && Array.isArray(v.notes) ? v.notes : []).map(String).filter(Boolean);
  audit.push({ id: x.id, title: x.title, verdict, sourcesRead: (v && v.sourcesRead) || [], problems, notes });
  if (verdict === "unsupported") failed.push({ x, reasons: problems.length ? problems.map((p) => `Fact check: ${p}`) : ["Fact check: a claim is not supported by the sources"] });
}
fs.writeFileSync(auditFile, JSON.stringify({ ran: true, checkedAt: verdicts.checkedAt, items: audit }, null, 2) + "\n");

const count = (k) => audit.filter((a) => a.verdict === k).length;
const lines = [`Fact check: ${items.length} items. ${count("supported")} supported, ${count("unsupported")} unsupported (held), ${count("unverifiable")} could not be verified.`];
for (const a of audit) {
  lines.push(`${a.verdict.padEnd(13)} ${a.id}`);
  for (const p of a.problems) lines.push(`              ${p}`);
  for (const n of a.notes) lines.push(`              note: ${n}`);
}
const report = lines.join("\n");
console.log(report);
summary("Fact check", report);
if (rest.includes("--hold")) holdItems(file, failed);
