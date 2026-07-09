# Plan A — 03C: Phase 3 — Polish & Mobile + Phase 4 — Handover

**Parent:** [00A-START.md](00A-START.md) · **Prev:** [02B-PHASE-2B-2C.md](02B-PHASE-2B-2C.md)

---

## Phase 3 — Polish & Mobile

**Goal:** Professional-grade UX. Mobile editing. Accessibility. Performance.

**Prerequisite:** Phase 2C gates pass

---

### 3.1 — Professional Workspace Polish

Make the workspace feel like a real design tool, not a prototype.

- [ ] Top bar: project name, save state indicator, floor selector, unit selector, 2D/3D toggle, undo/redo, save
- [ ] Resizable panels (`react-resizable-panels`, already installed)
- [ ] Canvas-maximise mode (collapse panels, exact restore)
- [ ] Canvas ≥ 60% of workspace at 1440px with panels open
- [ ] Keyboard shortcuts: V (select), W (wall), D (door), H (window), T (text), Space (pan), Escape (cancel)
- [ ] Status bar: active tool, measurement input, coordinate display
- [ ] First-use guidance: draw room, place furniture, or import floorplan

### 3.2 — Mobile Editing

The planner must work on phones and tablets. The challenge is fitting a full workspace into a small screen.

- [ ] Canvas-first layout on mobile (canvas takes full screen, panels hidden by default)
- [ ] Vaul drawer for panels (one at a time, swipe to dismiss)
- [ ] Compact bottom command bar (essential tools only)
- [ ] 44×44 CSS-pixel touch targets (minimum for reliable tapping)
- [ ] Gesture precedence: pan, pinch-zoom, object drag, drawer swipe (no conflicts)
- [ ] Safe-area and virtual-keyboard bounds respected (no content behind notch or keyboard)
- [ ] Landscape layout on tablets (panels beside canvas, not stretched portrait drawers)

### 3.3 — Accessibility

React Aria handles much of this, but canvas-based apps need extra attention.

- [ ] Screen reader: announce tool changes, selections, save state, validation errors
- [ ] Focus order: top bar → tools → canvas (with alternative accessible representation) → panels → status
- [ ] Non-pointer editing: numeric controls for all geometry operations (type dimensions instead of dragging)
- [ ] Reduced motion support (respect `prefers-reduced-motion`)
- [ ] Forced colours support (respect `forced-colors`)
- [ ] 200% zoom support (no clipping, no overflow)
- [ ] Axe: zero serious/critical violations

### 3.4 — Performance

These budgets ensure the app feels responsive, especially on the 2D canvas where customers spend most of their time.

| Metric | Budget | Why |
|--------|--------|-----|
| First usable 2D canvas | ≤ 2.5s | Customer shouldn't wait to start drawing |
| 3D scene interactive | ≤ 4s after activation | 3D is toggled on demand, can be slightly slower |
| Interaction FPS | 60fps target, never below 45fps | Canvas panning/zooming must feel smooth |
| Initial bundle | 3D code absent from initial load | Lazy-load gate: `ThreeLazyViewer` stays out of main chunk |
| Bundle boundary | Admin/compiler packages absent from planner bundles | Boundary test prevents bloat |
| Background | Pause/reduce 3D rendering when tab hidden | Saves CPU/GPU for other tabs |

### Phase 3 Gates

| Gate | Check |
|------|-------|
| Responsive | Full workflow at 1440×900, 1024×768, 768×1024, 390×844, mobile landscape |
| A11y | Axe audit pass (zero serious/critical) |
| Keyboard | Manual keyboard-only workflow pass |
| Performance | All performance budgets met |
| Release | `pnpm run release:gate` — pass |

---

## Phase 4 — Promotion & Handover

**Goal:** Controlled rollout. Documentation. Transfer.

**Prerequisite:** Phase 3 gates pass

---

### 4.1 — Route Promotion

Each route is verified individually before being declared production-ready.

- [ ] Accept Open3D on one unchanged revision with full evidence
- [ ] `/planner/open3d` — production (already live)
- [ ] `/planner/guest` — verified: guest restrictions, persistence boundaries, onboarding
- [ ] `/planner/canvas` — verified: authenticated save/reload, document compatibility
- [ ] Compare: screenshots, commands, saved documents, permissions, bundle boundaries before each promotion
- [ ] Retain rollback capability (archive previous route implementations)

### 4.2 — Admin Publishing Hardening

The admin publish workflow needs production-grade safety before real admins use it with real data.

- [ ] Role permissions: create, edit, approve, publish, rollback, archive
- [ ] Optimistic concurrency (revision IDs prevent silent overwrites — two admins editing the same product don't lose each other's work)
- [ ] Immutable published revisions (once published, a revision is never modified — only a new revision can be created)
- [ ] Version comparison, clone, import, export
- [ ] Unknown/deprecated blocks render as recoverable placeholders (not crashes)

### 4.3 — Documentation

- [ ] Update `Readme.md` with current architecture
- [ ] Update `START.md` with current dev commands
- [ ] Update `docs/architecture/` to reflect Plan A decisions
- [x] Archive old plan files to `archive/plans-v1-2026-07-08/` (done 2026-07-08)
- [ ] Write operator runbook for admin publishing workflow

### 4.4 — Handover Checklist

This is the final sign-off. All of these must be true on a single, unchanged git revision.

- [ ] All Phase 3 gates pass on one unchanged revision
- [ ] Evidence captured under `results/<module>/<phase>/<cmd>/`
- [ ] No unexplained console errors, warnings, failed requests
- [ ] Coverage floor met (`PLAN-FAIL-0408` resolved)
- [ ] Rollback procedures tested
- [ ] Handover document signed off
