import fs from "node:fs";
// load env.local from repo root
const envTxt=fs.readFileSync("../.env.local","utf8");
for(const line of envTxt.split(/\r?\n/)){
  const m=line.match(/^([A-Z_]+)=(.*)$/); if(m && !process.env[m[1]]) process.env[m[1]]=m[2];
}
const url=process.env.PRODUCTS_DATABASE_URL;
console.log("PRODUCTS_DATABASE_URL host:", url? new URL(url.replace(/^postgres(ql)?:/,"http:")).host : "MISSING");
let pg;
try { pg = await import("pg"); } catch(e){ console.log("pg module not available:", e.message); process.exit(0); }
const { Client } = pg.default||pg;
const c=new Client({ connectionString:url, ssl:{rejectUnauthorized:false}, connectionTimeoutMillis:8000 });
try{
  await c.connect();
  console.log("CONNECTED to Products DB");
  const q=async(s)=>{try{const r=await c.query(s);return r.rows;}catch(e){return "ERR:"+e.message.slice(0,80);}};
  console.log("svg_revisions count:", JSON.stringify(await q("select count(*)::int from svg_revisions")));
  console.log("block_descriptors count:", JSON.stringify(await q("select count(*)::int from block_descriptors")));
  console.log("svg_revision_artifacts count:", JSON.stringify(await q("select count(*)::int from svg_revision_artifacts")));
  console.log("sample block_descriptors:", JSON.stringify(await q("select slug,current_version,current_checksum from block_descriptors order by updated_at desc limit 5")));
}catch(e){ console.log("CONNECT FAILED:", e.message.slice(0,150)); }
finally{ await c.end().catch(()=>{}); }
