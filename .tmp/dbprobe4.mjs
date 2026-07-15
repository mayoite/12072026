import fs from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire("E:/12072026/site/platform/drizzle/x.js");
const envTxt = fs.readFileSync("E:/12072026/.env.local", "utf8");
for (const line of envTxt.split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const url = process.env.PRODUCTS_DATABASE_URL;
const postgres = (await import(pathToFileURL(require.resolve("postgres")).href)).default;
const sql = postgres(url, { prepare: false, ssl: "require", max: 1, idle_timeout: 5, connect_timeout: 10 });
try {
  const who = await sql`select current_database() db, current_user usr, current_schema() sch`;
  console.log("identity:", JSON.stringify(who[0]));
  const all = await sql`select table_schema, table_name from information_schema.tables where table_schema not in ('pg_catalog','information_schema') order by table_schema, table_name`;
  console.log("total user tables:", all.length);
  console.log(JSON.stringify(all.map((r) => `${r.table_schema}.${r.table_name}`)));
  const svgish = await sql`select table_schema, table_name from information_schema.tables where table_name ilike '%svg%' or table_name ilike '%descriptor%' or table_name ilike '%revision%'`;
  console.log("svg/descriptor/revision-ish tables:", JSON.stringify(svgish));
} catch (e) { console.log("QUERY FAILED:", e.message.slice(0, 160)); }
finally { await sql.end({ timeout: 5 }); }
