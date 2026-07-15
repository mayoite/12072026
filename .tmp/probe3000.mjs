import { chromium } from "playwright";
const BASE="http://localhost:3000";
const b=await chromium.launch();
for(const r of ["/admin/","/admin/svg-editor/"]){
  const ctx=await b.newContext({viewport:{width:1440,height:900}});
  const p=await ctx.newPage();
  const resp=await p.goto(BASE+r,{waitUntil:"networkidle",timeout:90000}).catch(e=>({status:()=>"ERR:"+e.message.slice(0,50)}));
  await p.waitForTimeout(1500);
  const title=await p.title().catch(()=>"?");
  const h=await p.locator("h1,h2").first().innerText().catch(()=>"(no h)");
  const len=(await p.locator("body").innerText().catch(()=>"")).length;
  console.log(`[${r}] status=${resp?.status?.()} title="${title}" h="${h.slice(0,60)}" bodyLen=${len}`);
  await ctx.close();
}
await b.close();
