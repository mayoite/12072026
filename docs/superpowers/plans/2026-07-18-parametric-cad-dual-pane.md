# Parametric CAD Dual-Pane Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship locked Admin parametric CAD dual-pane: plan left + planner `CanvasToolRail` + form right + status strip + summary chips (scenarios 32 + 35 + 37).

**Architecture:** Drop dockview for parametric. One dual-pane shell owns plan|form. Tool rail is imported from Planner only. Publish path unchanged (Maker multipath + confirm action).

**Tech Stack:** Next.js admin route, React 19, React Aria, Phosphor, locked chrome CSS modules, Vitest.

**Spec:** `docs/superpowers/specs/2026-07-18-parametric-cad-dual-pane-design.md`

---

### Task 1: Layout shell + planner rail

**Files:**
- Modify: `site/features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx`
- Modify: `site/app/css/core/locked/chrome/studio-chrome.css`
- Modify: `site/app/css/core/locked/admin/svg-editor-shell.css` (parametric status under topbar only)
- Test: `site/tests/unit/features/admin/svg-editor/parametric/LinearDeskParametricForm.test.tsx`

- [x] **Step 1:** Dual-pane plan-left form-right; no AdminSvgDockHost
- [x] **Step 2:** Mount `CanvasToolRail` pinned on plan column
- [x] **Step 3:** Status band + summary chips (37)
- [ ] **Step 4:** Parametric workspace grid: topbar → status → feedback → workspace (37 order)
- [ ] **Step 5:** 32 craft: rail full height, plan fills, denser CAD stage
- [ ] **Step 6:** Unit tests for dual-pane + rail + chips + multipath + publish
- [ ] **Step 7:** `pnpm --filter oando-site exec vitest run tests/unit/features/admin/svg-editor/parametric/LinearDeskParametricForm.test.tsx` → PASS
- [ ] **Step 8:** Commit verified slice

### Task 2: Browser smoke (parent)

- [ ] Open `http://localhost:3000/admin/svg-editor/parametric` only (not 127.0.0.1)
- [ ] Confirm plan left, form right, planner rail, status, chips, multipath desk
- [ ] Publish control single primary

### Task 3: Out of scope (do not block)

- C4 place + BOQ browser
- Freehand dock redesign
