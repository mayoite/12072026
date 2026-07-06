# Unified Planner — Handover

**Last updated:** 2026-06-29

**Plan:** [`01-execution-plan.md`](01-execution-plan.md) · **Scope:** [`00-start.md`](00-start.md)

---

## Done (agent, 2026-06-29)

| Check | Result |
|-------|--------|
| `pnpm --filter oando-site run test:planner` | **2073/2073** Vitest pass (384 files) |
| Includes | `plannerRuntime`, `plannerPersistence`, `syncQueueProcessor`, `offlineStorage`, `aiService`, `assetPipeline`, BOM/export unit lanes |

Implementation for §1–§4 is in tree; **unit/integration Vitest is green**.

---

## Not done (proof gaps — plan §1–§5)

Per `01-execution-plan.md`, these need **browser/runtime evidence**, not more unit tests:

| Section | Still open |
|---------|------------|
| **§1** Runtime cleanup | Remount / strict-mode teardown, 2D↔3D switch, stale async cancellation |
| **§2** Startup performance | Before/after bundle + timing, chunk trace, cold-start validation |
| **§3** State / persistence / AI | Visible save state, AI abort + stale-response rejection in browser |
| **§4** Catalog / DB | Ingest dedupe evidence, live EXPLAIN/RLS capture, route observability |
| **§5** Close | Blocked until §1–§4 proof or explicit `Failures.md` gaps |

**Gate policy:** No Playwright / `release:gate` for this pack until `Failures.md` known-failure policy allows (see `00-start.md`).

**Related (Failures.md):** PL-F5 offline E2E · PL-F6 BOM browser smoke · PL-F7 unified proofs — deferred.

**Sketch recovery:** owned by `archive/plans/done/sketch-to-plan-3-file-plan/` — not §3 here.

---

## Next (when gate opens)

1. Browser proof scripts for §1 teardown + §3 save/AI abort  
2. Bundle/timing capture for §2  
3. `test:planner-catalog` / planner-chrome skipped specs (auth chrome)  
4. Close §5 packet or log explicit gaps per section

---

## Baseline

| Item | Now |
|------|-----|
| Planner Vitest | **2073/2073** |
| Browser proof §1–§4 | **open** |
| Playwright planner pack | deferred (gate policy) |
