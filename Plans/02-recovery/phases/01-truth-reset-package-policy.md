# 01 Truth Reset And Package Policy

Goal: decide allowed packages from live imports.

## Modules

- Package policy.
- Repo docs that mention packages.
- Frontend engine policy.
- Package bundling policy.

## Allowed Scope

1. `package.json`
2. `site/package.json`
3. `pnpm-lock.yaml`
4. `PACKAGES.md`
5. `Plans/02-recovery/*`

## Hard No-Go Scope

1. Runtime code unless only reading.
2. Package removal without import proof.
3. Package upgrade without explicit reason.
4. Engine change without live import proof.
5. `optimizePackageImports` changes without measured bundle need.

## Read First

1. `PACKAGES.md`
2. `gpt5.5.md`
3. `Readme.md`
4. `Plans/02-recovery/01-module-baseline.md`

## Initial Commands

```powershell
rg -n "@svgdotjs|lucide-react|motion|framer-motion|@react-three/drei|@mantine|fabric-editor-kit|@tiptap|@vercel-labs/json-render|@phosphor-icons|@ark-ui|react-aria-components|@puckeditor|figma" site package.json pnpm-lock.yaml PACKAGES.md
rg -n "fabric|three|@react-three/fiber|@react-three/drei|optimizePackageImports|turbopack|webpack" site package.json pnpm-lock.yaml PACKAGES.md START.md
pnpm install --frozen-lockfile
```

## Engine Policy

Do not change engines in this phase.

Current recovery stance:

1. Keep Fabric as the 2D planner engine.
2. Keep Three as the 3D runtime engine.
3. Keep React Three Fiber as the React binding for Three.
4. Keep Drei as audit/defer until imports and viewer need prove it.
5. Keep the current SVG compiler path.
6. Keep Penpot as workflow only, with no package by default.

Package bundling changes are deferred.

Use `optimizePackageImports` only after a proven heavy named-export package creates bundle cost.

## Exit Evidence

1. Import census.
2. Current package table.
3. Keep/remove/audit/defer decisions.
4. Install result, if run.
5. Engine keep/audit/defer table.

## Likely Failures

1. Stale lockfile.
2. Unused package drift.
3. Runtime imports hidden in planner or admin.
4. Heavy named-export packages without bundle proof.

## Stop Conditions

1. Import proof is ambiguous.
2. Removal touches planner, SVG, or admin runtime.
3. Install fails for registry or engine reasons.
4. Engine change is requested without live import proof.
