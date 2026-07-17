# T-W2 — TF-07 typecheck stability

**Date:** 2026-07-17  
**Agent:** T-W2  
**Scope:** typecheck race on `.next/dev/types`; tsconfig + typecheck script only.  
**Not owned:** `PlannerFabricStage.tsx` product types (left to Planner).

## Verdict

| Item | Status |
|------|--------|
| TF-07 race (missing / flipped `.next/dev/types`) | **Mitigated** via `next typegen` + drop `dev/types` from include |
| Full `pnpm run typecheck` | **FAIL exit 2** — product error only |
| Stack healthy / T4 typecheck green | **Not claimed** |

## Cause (race)

1. `next dev` rewrites `site/next-env.d.ts` to `import "./.next/dev/types/routes.d.ts"`.
2. `next typegen` / `next build` rewrite it to `import "./.next/types/routes.d.ts"`.
3. `site/next-env.d.ts` is **tracked** in git; last local command decides the path.
4. Old typecheck was bare `tsc -p tsconfig.json --noEmit` with include of both `.next/types` and `.next/dev/types` → depends on leftover `.next` tree and concurrent dev writes.

## Fix applied (owned files only)

### `site/package.json`

```json
"typecheck": "next typegen && tsc -p tsconfig.json --noEmit"
```

Next 16.2.9 CLI: `next typegen` generates route types under `.next/types` and rewrites `next-env.d.ts` to that stable path before `tsc`. Matches Next docs CI pattern.

### `site/tsconfig.json`

- Kept: `".next/types/**/*.ts"`
- Removed: `".next/dev/types/**/*.ts"` from `include` so concurrent `next dev` mid-writes are not part of the typecheck program.

Root `package.json` already proxies: `"typecheck": "pnpm --filter oando-site typecheck"`. No root script change needed.

## Real exits (this session)

| Command | Exit | Notes |
|---------|------|--------|
| `pnpm run typecheck` (after clean `.next/types` + stale `next-env` pointing at missing `dev/types`) | **2** | typegen OK; tsc fails product only |
| `pnpm run check:layout` | **0** | |

### Remaining tsc error (not in T-W2 scope)

```
features/planner/canvas/PlannerFabricStage.tsx(1550,29): error TS2345
Argument of type 'ModifiedEvent<TPointerEvent>' is not assignable to ...
Types of property 'e' are incompatible (TouchEvent vs { clientX?: number; clientY?: number }).
```

**Owner for fix:** Planner (canvas / Fabric event typing). T-W2 did not rewrite product code.

## Proof race path is stable

1. Deleted `.next/types` and `.next/dev/types`.
2. Forced `next-env.d.ts` → `import "./.next/dev/types/routes.d.ts"`.
3. `pnpm run typecheck` ran `next typegen` → generated `.next/types/routes.d.ts`, rewrote `next-env.d.ts` to `.next/types`, then `tsc`.
4. No missing-module / empty-types failure. Only `PlannerFabricStage` remains.

## Honesty

- **TF-07:** race mitigated in script/tsconfig; claim as **PARTIAL** until full typecheck exit 0.
- **Full typecheck:** still **FAIL** on Planner product typing.
- No commit. No `any`. No PlannerFabricStage edits.
