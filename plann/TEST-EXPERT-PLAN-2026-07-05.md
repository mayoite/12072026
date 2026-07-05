# Test Expert Plan (draft)

**Source:** Composer 2.5 subagent — [Test expert plan draft](48d122b9-16cb-4259-813f-3a6a0bb6b7d5)  
**Status:** Draft for coordinator revision → `TEST-PLAN-REVISED-2026-07-05.md`  
**Date:** 2026-07-05

---

## 1. Executive summary

Oando has a **mature Vitest estate** (814 test files) and **focused Playwright** (23 specs). Phase 1 testing follows **1A then 1B**. Biggest risks: PLAN-FAIL-0408 open, `PlannerCommand` not wired in production UI, no Playwright on `/planner/open3d`, heavy `release:gate`.

**Recommendation:** TEST-0 → TEST-3 aligned to 1A/1B; fast vs full CI split; close 0408 with behavior-first tests, not `coverageGap.test.ts` gaming.

## 2–10. Full expert content

See subagent transcript for pyramid, TEST-0→TEST-3 phases, coverage strategy, Playwright scope, new tests (§7), CI tiers, first 5 tasks, what NOT to do.

**First 5 execution tasks (expert):**

1. TEST-0: full Vitest + evidence (`run-evidence-cmd.ps1`)
2. TEST-0: gate audits (`test:audit:hollow`, `gate-skips`, `eslint-disable`)
3. TEST-0: dual coverage baseline (`test:coverage` + `test:coverage:site`)
4. TEST-1: `phase1CommandCatalog.test.ts` + new `plannerCommandWiring.test.ts`
5. TEST-1: `svgPackageBoundaries` + open3d catalog slice
