# Execution Plan

Date: 2026-07-07

Use this after the module baseline and recovery plan.

## Work Loop

1. Read the module docs.
2. Inspect live code.
3. Define the smallest repair.
4. Edit only that module.
5. Run scoped checks.
6. Commit and push.
7. Record truth.

## Module Work Template

| Field | Required |
| --- | --- |
| Module | Name and paths |
| Problem | Live evidence |
| Scope | Files allowed |
| Change | Smallest repair |
| Checks | Exact commands |
| Result | Pass, fail, or skipped |
| Commit | Hash after push |

## First Module: Package Policy

Allowed scope:
- `package.json`
- `site/package.json`
- `pnpm-lock.yaml`
- `PACKAGES.md`
- package references in `Plans/02-recovery`

Initial commands:

```powershell
rg -n "@svgdotjs|lucide-react|motion|framer-motion|@react-three/drei|@mantine|fabric-editor-kit|@tiptap|@vercel-labs/json-render" site package.json pnpm-lock.yaml PACKAGES.md
pnpm install --frozen-lockfile
```

Do not remove a package until imports prove it is unused or replaceable.

## Second Module: CSS and Tailwind

Allowed scope:
- `site/app/css`
- `site/scripts/lint-ui-contract.mjs`
- affected module CSS only

Initial commands:

```powershell
pnpm --filter oando-site run lint:ui
pnpm --filter oando-site run lint:ui:strict
```

Expected risk:
- Strict lint may fail.
- That is useful evidence.

## Third Module: Admin SVG Editor

Allowed scope:
- `site/features/planner/admin/svg-editor`
- direct tests for admin SVG editor

Initial commands:

```powershell
pnpm --filter oando-site exec eslint -c config/build/eslint.config.mjs features/planner/admin/svg-editor --max-warnings=0
pnpm --filter oando-site run typecheck
```

Expected first failures:
- unused vars
- import type rules
- forbidden dynamic import type annotations

## Commit Policy

Commit after each safe block.

Push after each commit.

Use direct messages:
- `baseline: add module recovery plan`
- `chore(packages): record package policy truth`
- `fix(admin-svg): clear lint cluster`

## Evidence Policy

Do not claim:
- passing lint without command output
- passing tests without exit code
- clean console without browser capture
- deployable without build evidence

