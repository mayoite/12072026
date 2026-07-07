const fs=require("fs");
const j=JSON.parse(fs.readFileSync("D:/OandO07072026/results/tests/vitest-results.json","utf8"));
function strip(s){return (s||"").replace(/\u001b\[[0-9;]*m/g,"");}
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
];
for (const tr of j.testResults||[]) {
  for (const a of tr.assertionResults||[]) {
    if(a.status!=="failed") continue;
    const path=tr.name.replace(/.*[\\/]site[\\/]/,"").replace(/\\/g,"/");
    const m=strip(a.failureMessages?.[0]||"");
    const hay=path+" "+m;
    let hit="other";
    for (const [name,re] of bucketMap) if(re.test(hay)) { hit=name; break; }
    if(hit==="other") {
      console.log("---", path, "|", a.title);
      console.log(m.slice(0,800));
    }
  }
}
