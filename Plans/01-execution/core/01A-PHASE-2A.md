# Plan A — 01A: Phase 2A — UI Stabilisation

**Parent:** [00A-START.md](00A-START.md) · **Next:** [02B-PHASE-2B-2C.md](02B-PHASE-2B-2C.md)

---

**Goal:** Lock the UI foundation. Fix component library conflicts, standardise icons, harden the CSS contract.

**Prerequisite:** None (start immediately)

**Locked elsewhere (do not re-open in 2A):**
- **2D engine:** Fabric.js v7 full stage — *cutover in 2B* (decision is done; not idle insurance).
- **Furniture:** modular/parametric + SVG extrude generation is **must-do**; **designer static GLB removed** (not an exception).
- **Visual tests:** Playwright screenshots (Percy removed).

---

## 2A.1 — React Aria Completion

- [ ] Audit all planner components for remaining hand-rolled keyboard/focus logic
- [ ] Ensure CommandPalette, TopBar, PropertiesPanel, InventoryPanel are fully React Aria
- [ ] Write integration tests for keyboard nav (Tab, Arrow, Enter, Escape) across all React Aria components
- [ ] Verify 100dvh layout holds after every component change

## 2A.2 — Lucide → Phosphor Migration

**Status (2026-07-09):** **Done site-wide** (user: Phosphor only). `lucide-react` removed from `site/package.json` and tech-stack-generator; imports rewritten to `@phosphor-icons/react`. Guard: `tests/unit/features/planner/open3d/open3dIconPolicy.test.ts`.

**Scope completed:** `app/`, `features/**` (incl. planner + CRM + shared + assistant), `components/`, `lib/`, tests mocks, `optimizePackageImports`.

**Guard test:**
- [x] `open3dIconPolicy.test.ts`: no `lucide-react` in production sources; package dep absent

## 2A.3 — CSS Hardening

- [ ] Run CSS hardcoding audit and pass gate
- [ ] Verify all planner components use CSS Modules or semantic tokens
- [ ] No raw colours, inline z-index, magic spacing, or hardcoded breakpoints in planner JSX
- [ ] Add reduced-motion, forced-colors, focus-visible states to planner components

## 2A.4 — Dead Dependency Cleanup

> **Done in 00A (2026-07-09):** `@svgdotjs/*`, `html-to-image`, `motion`, `motion-utils` removed with import census + typecheck evidence under `results/planner/00a-start/`.

- [x] Remove `@svgdotjs/svg.js`, `@svgdotjs/svg.resize.js`, `@svgdotjs/svg.select.js` from `package.json`
- [x] Remove `html-to-image` from `package.json`
- [x] Verify `motion` / `motion-utils` are peer deps or standalone; remove if standalone with zero imports
- [ ] Run full `pnpm run test` after 2A UI changes (00A ran typecheck + scoped planner suites only)

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
