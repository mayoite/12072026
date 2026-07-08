# Plan A — 01A: Phase 2A — UI Stabilisation

**Parent:** [00A-START.md](00A-START.md) · **Next:** [02B-PHASE-2B-2C.md](02B-PHASE-2B-2C.md)

---

**Goal:** Lock the UI foundation. Fix component library conflicts, standardise icons, harden the CSS contract.

**Prerequisite:** None (start immediately)

---

## 2A.1 — React Aria Completion

- [ ] Audit all planner components for remaining hand-rolled keyboard/focus logic
- [ ] Ensure CommandPalette, TopBar, PropertiesPanel, InventoryPanel are fully React Aria
- [ ] Write integration tests for keyboard nav (Tab, Arrow, Enter, Escape) across all React Aria components
- [ ] Verify 100dvh layout holds after every component change

## 2A.2 — Lucide → Phosphor Migration (Planner Module Only)

**Scope:** Replace `lucide-react` imports with `@phosphor-icons/react` across all `features/planner/**` files.

**Why:** User prefers Phosphor. Lucide is used in ~50 files site-wide, but the planner module should have one icon system. Non-planner code (`features/shared/`, `features/site-assistant/`, `features/crm/`, `components/`) stays on Lucide for now.

**Files to update:**
- [ ] `open3d/editor/`: TopBar, PropertiesPanel, InventoryPanel, CanvasToolRail, LayersPanel
- [ ] `ui/`: PlannerSaveIndicator, PlannerSessionDialog, PlannerEmptyCanvas
- [ ] `shared/components/editor/`: Toolbar, ViewToggle
- [ ] `admin/`: AdminCatalogManager, AdminWorkspaceCatalogPageView
- [ ] `admin/svg-editor/`: AdminSvgEditorListView, AdminSvgEditorEditView
- [ ] `onboarding/`: OnboardingCoach, ProjectSetupStep, StartingPointStep
- [ ] `landing/`: PlannerFeaturesHubPage, PlannerToolsShowcase, PlannerFeaturePageView, plannerFeaturePages
- [ ] `help/`: PlannerHelpPage
- [ ] `3d/`: Planner3DViewer

**Guard test:**
- [ ] Add `open3dIconPolicy.test.tsx`: no `lucide-react` in `features/planner/**`

**Do NOT touch:**
- `features/shared/` (used by non-planner pages)
- `features/site-assistant/` (separate module)
- `features/crm/` (separate module)
- `components/` (shared site components)

## 2A.3 — CSS Hardening

- [ ] Run CSS hardcoding audit and pass gate
- [ ] Verify all planner components use CSS Modules or semantic tokens
- [ ] No raw colours, inline z-index, magic spacing, or hardcoded breakpoints in planner JSX
- [ ] Add reduced-motion, forced-colors, focus-visible states to planner components

## 2A.4 — Dead Dependency Cleanup

- [ ] Remove `@svgdotjs/svg.js`, `@svgdotjs/svg.resize.js`, `@svgdotjs/svg.select.js` from `package.json`
- [ ] Remove `html-to-image` from `package.json`
- [ ] Verify `motion` / `motion-utils` are peer deps or standalone; remove if standalone with zero imports
- [ ] Run `pnpm install` + `pnpm run typecheck` + `pnpm run test` after removal

---

## 2A Gates (Must ALL Pass Before Phase 2B)

| Gate | Command / Check |
|------|----------------|
| Typecheck | `pnpm run typecheck` — pass |
| Lint | `pnpm run lint` — pass |
| Tests | `pnpm run test` — pass (no regressions) |
| UI lint | `pnpm run lint:ui:strict` — pass |
| Icon guard | No `lucide-react` in `features/planner/**` (test) |
| Keyboard | Integration test suite for React Aria components — pass |
| Layout | 100dvh layout verified at 1440×900, 1024×768, 768×1024, 390×844 |
