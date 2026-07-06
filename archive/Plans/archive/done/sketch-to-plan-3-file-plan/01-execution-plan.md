# Sketch-to-Plan — Pending

**Last updated:** 2026-06-29

**Path convention:** planner and site paths are under `site/` unless noted.

**Resume:** §1 — failure contract **browser proof** (unit logic already green).

---

## §1 Failure contract `[ ]`

**Surfaces:** `site/features/planner/ai/sketchToPlan.ts`, `site/app/api/planner/sketch-to-plan/route.ts`, prompts / `spaceSuggest.ts`

**Pending proof:**

- Typed recoverable vs unrecoverable failures visible in workspace  
- Not only Vitest — E2E or manual browser script when permitted  

---

## §2 Draft preservation `[ ]`

**Surfaces:** `site/features/planner/editor/PlannerWorkspace.tsx`, `site/features/planner/lib/floorPlanImageImport.ts`, `site/features/planner/editor/usePlannerSessionHandlers.ts`

**Pending proof:**

- Upload preserved before fetch  
- Current draft preserved before conversion  

---

## §3 Underlay, preview, retry `[ ]`

**Surfaces:** `site/features/planner/canvas-fabric/floorplanCanvas.ts`, `site/features/planner/editor/PlannerTopBar.tsx`, `site/features/planner/ai/applySuggestedLayout.ts`, `site/features/planner/ai/AIAssistDrawer.tsx`

**Pending proof:**

- Underlay before fetch  
- Preview before commit  
- Reject → rollback  
- Retry preserves manual work  
- Recovery UI visible on planner route  

---

## §4 Close `[ ]`

Packet closes when §1–3 have browser proof or a logged gap in `Failures.md`.

**Unit gate (already green):** `pnpm --filter oando-site exec vitest run tests/unit/features/planner/ai/sketchToPlan.test.ts tests/unit/app/api/planner/sketch-to-plan/route.test.ts tests/unit/planner-ai-sketchToPlan.test.ts`
