const fs=require("fs");
const j=JSON.parse(fs.readFileSync("D:/OandO07072026/results/tests/vitest-results.json","utf8"));
function strip(s){return (s||"").replace(/\u001b\[[0-9;]*m/g,"");}
const samples=[
  ["planner-host/route RTL", /open3d-planner-host|open3d-planner-route|getMultipleElementsFound|Loading planner/],
  ["supabase/env", /Missing required env var|NEXT_PUBLIC_SUPABASE/],
  ["marketing hero testid", /data-testid=.hero|Unable to find an element by: \[data-testid=.hero.\]/],
];
for (const [label,re] of samples) {
  console.log("\n########", label);
  let n=0;
  for (const tr of j.testResults||[]) {
    for (const a of tr.assertionResults||[]) {
      if(a.status!=="failed") continue;
      const m=strip(a.failureMessages?.[0]||"");
      if(re.test(m)||re.test(tr.name)) {
        console.log(tr.name.replace(/.*site[\\/]/,""), ">", a.title);
        console.log(m.slice(0,900));
        if(++n>=2) break;
      }
    }
    if(n>=2) break;
  }
}
