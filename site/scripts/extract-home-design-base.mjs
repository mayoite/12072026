import fs from "node:fs";
import path from "node:path";

const siteRoot = path.resolve(import.meta.dirname, "..");
const outDir = path.resolve(siteRoot, "../results/site/design-base-home");
fs.mkdirSync(outDir, { recursive: true });

const classes = new Set();
const tokens = new Set();

function walk(rel) {
  const p = path.join(siteRoot, rel);
  if (!fs.existsSync(p)) return;
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const f of fs.readdirSync(p)) walk(path.join(rel, f));
    return;
  }
  if (!/\.(tsx|ts|css)$/.test(p)) return;
  const t = fs.readFileSync(p, "utf8");
  for (const m of t.matchAll(/\b(home-[a-z0-9-]+|shell-[a-z0-9-]+|typ-[a-z0-9-]+|btn-[a-z0-9-]+)\b/g)) {
    classes.add(m[1]);
  }
  for (const m of t.matchAll(/var\((--[a-zA-Z0-9-]+)/g)) {
    tokens.add(m[1]);
  }
}

[
  "components/home",
  "app/(site)/page.tsx",
  "app/css/core/components/home-media-layers.css",
  "app/css/core/components/cards.css",
  "app/css/core/components/client-badge.css",
].forEach(walk);

const classList = [...classes].sort();
const tokenList = [...tokens].sort();
fs.writeFileSync(path.join(outDir, "HOME-CLASSES.txt"), `${classList.join("\n")}\n`);
fs.writeFileSync(path.join(outDir, "HOME-TOKENS-SAMPLE.txt"), `${tokenList.join("\n")}\n`);

const notes = `# Homepage = design base (Phase 2)

**Date:** 2026-07-10  
**Rule:** Suite pages align to home. Locked CSS frozen (\`Agents/INDEX.md\`).

## Role
Homepage is the **visual system root** for the public website suite:
- type scale via \`typ-*\`
- marketing sections via \`home-*\` / shell
- card media layering pattern (media → overlay → footer)
- buttons \`btn-*\` where used

## Inventories (generated)
- \`HOME-CLASSES.txt\` — ${classList.length} home/shell/type/btn class hits from home components + page
- \`HOME-TOKENS-SAMPLE.txt\` — ${tokenList.length} CSS custom properties referenced

## Align suite (Phase 3–4) using
1. Same type utilities (\`typ-label\`, \`typ-h*\`, \`page-copy*\`)
2. Same shell spacing patterns (\`home-shell-xl\`, section borders)
3. Card media: one image layer, badges above, isolation
4. **No** new palette; tokens from \`theme.css\` only

## Explicit non-goals this phase
- Homepage redesign
- Locked CSS edits
- Portal DB schema repair (honest error UI is Phase 1)

## Status
**Phase 2 DONE** — base documented for suite alignment.
`;
fs.writeFileSync(path.join(outDir, "NOTES.md"), notes);
console.log(JSON.stringify({ classes: classList.length, tokens: tokenList.length, outDir }, null, 2));
