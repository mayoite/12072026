# 01 Truth Reset And Package Policy

Goal: decide allowed packages from live imports.

## Modules

- Package policy.
- Repo docs that mention packages.

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

## Read First

1. `PACKAGES.md`
2. `gpt5.5.md`
3. `Readme.md`
4. `Plans/02-recovery/01-module-baseline.md`

## Initial Commands

```powershell
rg -n "@svgdotjs|lucide-react|motion|framer-motion|@react-three/drei|@mantine|fabric-editor-kit|@tiptap|@vercel-labs/json-render|@phosphor-icons|@ark-ui|react-aria-components|@puckeditor|figma" site package.json pnpm-lock.yaml PACKAGES.md
pnpm install --frozen-lockfile
```

## Exit Evidence

1. Import census.
2. Current package table.
3. Keep/remove/audit/defer decisions.
4. Install result, if run.

## Likely Failures

1. Stale lockfile.
2. Unused package drift.
3. Runtime imports hidden in planner or admin.

## Stop Conditions

1. Import proof is ambiguous.
2. Removal touches planner, SVG, or admin runtime.
3. Install fails for registry or engine reasons.
