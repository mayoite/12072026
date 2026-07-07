const fs=require("fs");
const j=JSON.parse(fs.readFileSync("D:/OandO07072026/results/tests/vitest-results.json","utf8"));
function strip(s){return (s||"").replace(/\u001b\[[0-9;]*m/g,"");}
const byFile=[];
const bucketMap=[
  ["planner-host/route RTL", /open3d-planner-host|open3d-planner-route|getMultipleElementsFound|Loading planner/],
  ["supabase/env", /Missing required env var|NEXT_PUBLIC_SUPABASE/],
  ["marketing hero testid", /data-testid=.hero|portfolio page|KpiCounter/],
  ["three.js WebGL", /isWebGLSupported|ThreeViewer|WebGL|three-lazy|min-height: 400px/],
  ["open3d model/coverage", /modelOperations|coverageGap/],
  ["svg admin", /svgPhase1|svg-editor/],
  ["scripts governance", /check-marketing|check-site-page/],
  ["catalog", /catalog-adapters|catalogDrizzle/],
  ["dashboard", /dashboard/],
  ["ECONNREFUSED", /ECONNREFUSED|fetch failed/],
];
const bucketCounts={};
for (const tr of j.testResults||[]) {
  const failed=(tr.assertionResults||[]).filter(a=>a.status==="failed");
  if(!failed.length) continue;
  const path=tr.name.replace(/.*[\\/]site[\\/]/,"").replace(/\\/g,"/");
  const msgs=failed.map(f=>strip(f.failureMessages?.[0]||"")).join("\n");
  byFile.push({path, fails: failed.length, msgs});
  for (const f of failed) {
    const m=strip(f.failureMessages?.[0]||"");
    const hay=path+" "+m;
    let hit="other";
    for (const [name,re] of bucketMap) if(re.test(hay)) { hit=name; break; }
    bucketCounts[hit]=(bucketCounts[hit]||0)+1;
  }
}
console.log("FAILED FILES", byFile.length);
byFile.sort((a,b)=>b.fails-a.fails).forEach(f=>console.log(f.fails+"\t"+f.path));
console.log("\nBUCKETS");
Object.entries(bucketCounts).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log(v+"\t"+k));
