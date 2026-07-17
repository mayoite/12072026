# Implementation plan: Product quality ROI (~7 → toward 8.5)

**Status:** Approved via owner option A (2026-07-18).  
**Branch:** `main` (owner consent: push + execute on main).  
**No worktrees** (AGENTS.md).  
**Workers:** up to 6 parallel implementers; non-overlapping file ownership.

## Goal

Ship the highest-ROI slice from explore workers toward product **8.5**, not a full rewrite.

## Non-goals

- DB-SVG cutover / `SVG_RELEASE_AUTHORITY=db`
- Full brand-true 30 SKU authoring from marketing photos
- Cloud autosave
- Admin dual-write production proof

## Tasks

### T1 — Fix maker SVG Y / viewBox (plan paint)

**Owner files:**  
`site/features/planner/asset-engine/svg/makerJsToPath.ts`  
`site/features/planner/asset-engine/svg/makerJsRecipes.ts` (only if needed)  
Unit: `site/tests/unit/features/planner/asset-engine/**` or new test beside makerJsToPath  

**Problem:** Maker.js exports paths with negative Y while viewBox is `0 0 w h` → desks clip blank on canvas.

**Steps:**
1. Write failing unit: linear-desk path `d` must stay within `[0, width] × [0, depth]` (no negative Y for standard recipe).
2. Fix export: flip Y into plan space (Y-down) or set exporter options so paths match viewBox.
3. Re-run compile for one fixture desk; assert path bbox inside viewBox.
4. Document one-line comment at fix site.

**Done when:** Unit green; desk maker paths non-negative Y relative to viewBox.

**Do not:** Re-seed all inventory in this task (optional follow-up `sync:descriptor-svgs` by orchestrator after merge).

---

### T2 — Guest chrome diet v2

**Owner files:**  
`site/features/planner/editor/TopBar.tsx`  
`site/features/planner/editor/PlannerWorkflowBar.tsx`  
`site/features/planner/editor/CanvasToolRail.tsx` (guest: hide letter shortcuts in labels if easy)  
`site/features/planner/editor/dock/ModularPlannerShell.tsx` (status footer copy only)  
Tests: `TopBar.test.tsx`, related unit  

**Problem:** Guest still sees unit selector, heavy More exports, long workflow essays, CAD letters, object-count status.

**Steps:**
1. Guest: hide display-unit control in TopBar (keep for members).
2. Guest More menu: keep Export BOQ CSV/JSON + Help + Sketch optional; demote or hide Import plan / raw DXF-style noise if present for guests.
3. Workflow bar guest: shorter titles only (drop long detail essays) or single-line steps.
4. Status footer: guest-friendly “Add furniture to build quote” vs object census (keep metrics data-testid if needed).
5. Unit tests for guest TopBar (no unit control; still has Help + Save).

**Done when:** Guest TopBar tests green; copy calmer without removing Save/Help/2D-3D.

---

### T3 — Inventory first-paint simplify

**Owner files:**  
`site/features/planner/editor/InventoryPanel.tsx`  
`site/features/planner/catalog/inventory/inventoryTaxonomy.ts` (only if needed for empty categories)  
Tests under inventory / InventoryPanel  

**Problem:** Filter stack denser than guest TopBar; hollow Lighting hurts trust.

**Steps:**
1. Guest (or default office-systems): collapse advanced filters behind “More filters” or hide material/availability/seats until expanded.
2. Hide empty category chips that have zero items when possible.
3. Keep search + desks-first order + Place.
4. Unit: guest/default shows fewer filter controls than before (assert data-testid counts).

**Done when:** Unit green; no regression to Place/SKU preview.

---

### T4 — Review BOQ commercial surface

**Owner files:**  
`site/features/planner/editor/ReviewQuotePanel.tsx`  
`site/features/planner/editor/review-quote-panel.module.css`  
`site/features/planner/shared/export/brandedPdfExport.ts` and/or `pdfExport.ts` (disclaimer + totals if low-risk)  
Tests: ReviewQuotePanel unit if exists  

**Problem:** No in-panel lines; PDF weak as client email.

**Steps:**
1. Show top line summary in Review: furniture count, seats, unpriced count, pricing mode label (demo).
2. If BOQ lines available from existing helpers without new pricing engine, list up to 8 lines (name, qty, unit note).
3. PDF: add footer disclaimer “Demo list / not approved commercial quote” + grand total line if data exists.
4. Primary button hierarchy: branded PDF primary, CSV secondary for guests.
5. Unit for new panel text.

**Done when:** Unit green; no fake prices invented beyond existing demo list.

---

### T5 — Site entry contract + siteProduct continuity

**Owner files:**  
`site/components/home/InteractiveTools.tsx`  
`site/features/site/data/homepage.ts` (planner suite href if needed)  
`site/lib/analytics/plannerEntry.ts` (if helpers needed)  
Guest planner entry: find consumer for `siteProduct` query (guest page or workspace bootstrap)  
`site/app/planner/(workspace)/guest/**` or `PlannerWorkspaceRoute`  

**Problem:** Tools band → `/planner` overview; PDP stamps `siteProduct` but canvas ignores it.

**Steps:**
1. Point InteractiveTools / homepage planner launch at `/choose-product?mode=guest` (or guest with params).
2. On guest workspace load: if `siteProduct` query present, surface toast/banner “Designing with {slug}” and attempt inventory select/focus if item exists.
3. Do not invent placement if SKU missing — toast only is OK.
4. Unit or light test for href + param parse.

**Done when:** Tools CTA matches guest entry; siteProduct at least visible in UI.

---

### T6 — Trust honesty + sticky i18n

**Owner files:**  
`site/components/home/WhyChooseUs.tsx`  
`site/features/site/data/proof.ts` or TRUSTED_BY stats  
`site/components/home/MobileStickyCta.tsx`  
`site/i18n/messages/en.json` if sticky needs messages  
Tests: homepage / WhyChooseUs unit if any  

**Problem:** Universal BIFMA/5-year oversell; client KPI soft; sticky CTA not i18n.

**Steps:**
1. Soften WhyChooseUs certification copy to product-level truth (“where certified” / remove universal BIFMA claim).
2. Align or re-label client count claim if it duplicates projects (prefer “Selected clients” language).
3. MobileStickyCta: use next-intl or shared homepage CTA label/href from same source as hero.
4. Unit/snapshot for copy change.

**Done when:** No universal false BIFMA claim; sticky shares CTA truth with hero.

---

## Verification (orchestrator)

After workers:

```powershell
pnpm --filter oando-site exec vitest run <touched tests>
pnpm run check:layout
```

Optional: `pnpm --filter oando-site run sync:descriptor-svgs` after T1.

Push only if owner already authorized (yes).

## Risk

- T2/T3 both touch guest UX — file ownership split enforced.
- T4 must not invent commercial prices.
- T1 may need re-sync SVGs for desks to show in prod paint.
