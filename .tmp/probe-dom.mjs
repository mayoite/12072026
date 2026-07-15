import { chromium } from "playwright";
const BASE=process.env.BASE_URL||"http://localhost:3123";
const routes=["/admin/","/admin/svg-editor/","/planner/guest/"];
const b=await chromium.launch();
for(const r of routes){
  const ctx=await b.newContext({viewport:{width:1440,height:900}});
  const p=await ctx.newPage();
  const resp=await p.goto(BASE+r,{waitUntil:"networkidle",timeout:60000});
  await p.waitForTimeout(1200);
  const title=await p.title();
  const h1=await p.locator("h1,h2").first().innerText().catch(()=>"(no h)");
  const bodyLen=(await p.locator("body").innerText().catch(()=>"")).length;
  const hasLogin=/sign in|log in|login|password|supabase/i.test(await p.content());
  console.log(`\n[${r}] status=${resp?.status()} title="${title}"`);
  console.log(`  firstHeading="${h1.slice(0,80)}" bodyTextLen=${bodyLen} loginish=${hasLogin}`);
  await ctx.close();
}
await b.close();
