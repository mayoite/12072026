import fs from "node:fs";
import { createRequire } from "node:module";
const require=createRequire("E:/12072026/site/platform/drizzle/x.js");
const envTxt=fs.readFileSync("E:/12072026/.env.local","utf8");
for(const line of envTxt.split(/\r?\n/)){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,"");}
const url=process.env.PRODUCTS_DATABASE_URL;
const postgresPath=require.resolve("postgres");
const postgres=(await import("file://"+postgresPath.replace(/\/g,"/"))).default;
const sql=postgres(url,{ssl:"require",max:1,idle_timeout:5,connect_timeout:8});
try{
  const tables=await sql`select table_name from information_schema.tables where table_schema='public' and table_name in ('svg_revisions','block_descriptors','svg_revision_artifacts') order by table_name`;
  console.log("tables present:", tables.map(t=>t.table_name).join(",")||"NONE");
  for(const t of ["svg_revisions","block_descriptors","svg_revision_artifacts"]){
    try{const r=await sql.unsafe(`select count(*)::int c from ${t}`);console.log(`  ${t}: ${r[0].c} rows`);}
    catch(e){console.log(`  ${t}: ERR ${e.message.slice(0,60)}`);}
  }
  try{const r=await sql`select slug,current_version from block_descriptors order by updated_at desc limit 5`;console.log("recent block_descriptors:",JSON.stringify(r));}catch(e){console.log("bd sample err:",e.message.slice(0,60));}
}catch(e){console.log("QUERY FAILED:",e.message.slice(0,150));}
finally{await sql.end({timeout:5});}
