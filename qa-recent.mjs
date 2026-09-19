// Dependency-free QA for dashboard recency semantics.
// Run: node qa-recent.mjs
import fs from "node:fs";
const db=JSON.parse(fs.readFileSync(new URL("./updates.json", import.meta.url),"utf8"));
const ranked=db.updates.map((item,index)=>({item,index})).sort((a,b)=>b.item.date.localeCompare(a.item.date)||b.index-a.index).map(x=>x.item);
const maxDate=db.updates.reduce((m,x)=>x.date>m?x.date:m,"");
const sameDay=db.updates.map((item,index)=>({item,index})).filter(x=>x.item.date===maxDate);
const expected=sameDay.sort((a,b)=>b.index-a.index)[0].item;
const actual=ranked[0];
const ids=new Set();
for(const x of db.updates){
  if(!x.id||!x.date||!x.title) throw new Error("Required field missing: "+JSON.stringify(x));
  if(ids.has(x.id)) throw new Error("Duplicate id: "+x.id);
  ids.add(x.id);
}
if(actual.id!==expected.id) throw new Error(`Recency failure: expected ${expected.id}, got ${actual.id}`);
if(db.updates.length!==ids.size) throw new Error("Record-count/id uniqueness failure");
console.log(JSON.stringify({ok:true,count:db.updates.length,updatedAt:db.updatedAt,latest:{date:actual.date,id:actual.id,title:actual.title},top5:ranked.slice(0,5).map(x=>({date:x.date,id:x.id,title:x.title}))},null,2));
