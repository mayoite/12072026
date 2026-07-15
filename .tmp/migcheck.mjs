import fs from "node:fs";import {createRequire} from "node:module";import {pathToFileURL} from "node:url";
const require=createRequire("E:/12072026/site/x.js");
for(const line of fs.readFileSync("E:/12072026/.env.local","utf8").split(/\r?\n/)){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,"");}
const postgres=(await import(pathToFileURL(require.resolve("postgres")).href)).default;
const sql=postgres(process.env.PRODUCTS_DATABASE_URL,{prepare:false,ssl:"require",max:1,connect_timeout:10});
try{
  const d=await sql`select hash,created_at from drizzle.__drizzle_migrations order by created_at desc limit 8`;
  console.log("drizzle migrations applied:",d.length);
  const sm=await sql`select version,name from supabase_migrations.schema_migrations where version like '20260714%' or name ilike '%svg%'`;
  console.log("supabase svg migration row:",JSON.stringify(sm));
}catch(e){console.log("err",e.message.slice(0,80));}finally{await sql.end({timeout:5});}
