import fs from "node:fs";
import path from "node:path";

const dataPath="updates.json";
const inboxDir="inbox";
const db=JSON.parse(fs.readFileSync(dataPath,"utf8"));
const originalIds=new Set(db.updates.map(x=>x.id));
const files=fs.existsSync(inboxDir)?fs.readdirSync(inboxDir).filter(x=>x.endsWith(".json")).sort():[];
let latestScan=db.updatedAt;
let added=0;

for(const file of files){
  const batch=JSON.parse(fs.readFileSync(path.join(inboxDir,file),"utf8"));
  if(!batch.scannedAt) throw new Error(`Missing scannedAt in ${file}`);
  if(new Date(batch.scannedAt)>new Date(latestScan)) latestScan=batch.scannedAt;
  for(const x of batch.updates||[]){
    if(!x.id||!x.date||!x.title||!x.layer||!x.impact||!Array.isArray(x.sources)||!x.sources.length) throw new Error(`Invalid record in ${file}`);
    if(x.sources.some(s=>!s.name||!/^https?:\/\//.test(s.url))) throw new Error(`Invalid source in ${x.id}`);
    if(originalIds.has(x.id)||db.updates.some(y=>y.id===x.id)) continue;
    // Daily runs never create milestones. Only the monthly review, approved by a person, does.
    // A new item the agent filed as a milestone becomes a signal that is watched as a candidate.
    if(x.kind!=="signal"){
      console.log(`Filed ${x.id} as a signal and milestone candidate (agent set kind "${x.kind}").`);
      x.kind="signal";
      if(!x.candidate) x.candidate={status:"watching",flaggedOn:x.date,tests:{note:"The research agent filed this as a milestone. The monthly review decides."}};
    }
    if(x.candidate){
      x.candidate.status="watching";
      if(!/^\d{4}-\d{2}-\d{2}$/.test(x.candidate.flaggedOn||"")) x.candidate.flaggedOn=x.date;
    }
    db.updates.push(x); added++;
  }
}
db.updatedAt=latestScan;
const ids=db.updates.map(x=>x.id);
if(new Set(ids).size!==ids.length) throw new Error("Duplicate update IDs");
fs.writeFileSync(dataPath,JSON.stringify(db,null,2)+"\n");
console.log(JSON.stringify({ok:true,files:files.length,added,count:db.updates.length,updatedAt:db.updatedAt}));
