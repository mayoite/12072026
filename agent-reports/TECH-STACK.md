# Tech stack — status

**Date:** 2026-07-17  
**Stack healthy:** **OPEN / PARTIAL**  
**Plans:** `plan/TechStack/COMPLETION-CONTRACT.md` · `FEATURES.md` · `FINISH-PLAN.md` (trio landed)

## Scope
pnpm/Node workspace, engines, CI pins, gates, env names, DB/R2 client boundaries.

## From plan files (not gate PASS)
| Item | Truth |
|------|--------|
| Root pnpm | **11.13.0** |
| CI pnpm pin | **11.9.0** → **TF-02 / TF-21 FAIL** (T-W1 may update) |
| Typecheck race | **TF-07 PARTIAL** — typegen fix landed; full tsc still FAIL |
| SVG authority | disk live → TF-10 PARTIAL |
| T0–T3, T5, T7–T8 | PARTIAL |
| T4 / T6 / release:gate | OPEN / FAIL |

## Open next (from FINISH-PLAN)
1. Align CI pnpm to **11.13.0**  
2. Planner: fix `PlannerFabricStage` TS2345 so typecheck exit 0  
3. Fresh lint + typecheck + unit (T4)  
4. Build + release:gate (T6)  
5. Keep DB-SVG honesty  

## Checklist
Owner-ordered: T0 inventory, T1/T2 code map, T4 health, T5 AI/env names, T7 disk honesty + health, T8 plan trio/layout purity marked **[PASS]** where evidenced. T4 lint/typecheck and T6 release:gate remain OPEN/FAIL.

## Bar
Lockfile wins versions. Code wins engines. Exit 0 required for release PASS.

## T-W2

**Slice:** TF-07 typecheck stability (`2026-07-17-tw2-typecheck.md`)

| Change | Detail |
|--------|--------|
| `site/package.json` typecheck | `next typegen && tsc -p tsconfig.json --noEmit` |
| `site/tsconfig.json` include | drop `.next/dev/types/**/*.ts`; keep `.next/types/**/*.ts` |

| Command | Exit | Truth |
|---------|------|--------|
| `pnpm run typecheck` | **2** | typegen stable; remaining error `PlannerFabricStage.tsx:1550` TS2345 |
| `pnpm run check:layout` | **0** | |

**TF-07:** race mitigated (generate before tsc; no dual dev-types include). **Not PASS** for full typecheck until Planner fabric event typing is fixed. No product rewrite by T-W2.
