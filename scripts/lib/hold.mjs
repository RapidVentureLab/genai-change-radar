// Moves items out of an inbox file into inbox/held/<same name>, with the reasons.
// Held items are not published. They are listed on the site under "Corrections and
// held items" until a person fixes or drops them.
import fs from "node:fs";
import path from "node:path";

export function holdItems(file, failed) {
  if (!failed.length) return;
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const heldDir = path.join(path.dirname(file), "held");
  fs.mkdirSync(heldDir, { recursive: true });
  const heldFile = path.join(heldDir, path.basename(file));
  const existing = fs.existsSync(heldFile) ? JSON.parse(fs.readFileSync(heldFile, "utf8")) : { updates: [] };
  for (const { x, reasons } of failed) existing.updates.push({ ...x, heldReasons: reasons });
  fs.writeFileSync(heldFile, JSON.stringify(existing, null, 2) + "\n");
  const bad = new Set(failed.map((f) => f.x.id));
  data.updates = (data.updates || []).filter((x) => !bad.has(x.id));
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`Held ${failed.length} item(s) in ${heldFile}.`);
}

export function summary(title, text) {
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### ${title}\n\n\`\`\`\n${text}\n\`\`\`\n`);
}
