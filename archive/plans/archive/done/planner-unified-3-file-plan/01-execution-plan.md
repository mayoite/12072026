# Unified Planner — Pending

**Last updated:** 2026-06-29

**Path convention:** planner and site paths are under `site/` unless noted.

**Resume:** Section 1 below. All sections are **implementation present; proof missing** unless noted.

---

## §1 Runtime cleanup `[ ]`

**Surfaces:** `site/features/planner/canvas-fabric/plannerRuntime.ts`, `floorplanCanvas.ts`, `FloorplanContext.tsx`, `Planner3DViewer.tsx`, `usePlannerFabricAutosave.ts`, `useAssetLoader.ts`, `usePlannerSessionHandlers.ts`, `usePlannerPanels.ts`, `usePlannerCatalogHydration.ts`

**Proof still needed:**

- Remount / strict-mode teardown  
- 2D ↔ 3D switch teardown  
- Stale async cancellation  

---

## §2 Startup performance `[ ]`

**Surfaces:** `PlannerWorkspace.tsx`, `plannerRuntime.ts`, session/panel/catalog hooks (same family as §1)

**Proof still needed:**

- Before/after bundle + timing  
- Chunk / import trace  
- Throttled cold-start validation  

---

## §3 State, persistence, baseline AI `[ ]`

**Surfaces:** `plannerPersistence.ts`, `offlineStorage.ts`, `cloudPlanHydration.ts`, `syncQueueProcessor.ts`, `aiService.ts`, `/api/planner/ai-advisor`

**Proof still needed:**

- Save / sync / hydration / conflict branches (runtime)  
- Visible save state  
- AI abort + stale-response rejection (browser or integration)  

**Not here:** sketch underlay / preview / rollback → sketch pack.

---

## §4 Catalog, assets, DB `[ ]`

**Surfaces:** `ingest-planner-catalog.ts`, `catalogStore.ts`, `assetPipeline.ts` (registry empty until real GLBs), plan API routes

**Proof still needed:**

- Ingest / dedupe evidence  
- Live query / RLS / EXPLAIN (needs DB env)  
- Route observability capture  

---

## §5 Verification `[ ]`

Close packet only when §1–4 have proof or explicit logged gaps in `Failures.md`.

## Related (status only in Failures.md)

PL-F5 offline E2E · PL-F6 BOM browser smoke · PL-F7 proofs — **after** known failures cleared (`Failures.md` gate policy).
