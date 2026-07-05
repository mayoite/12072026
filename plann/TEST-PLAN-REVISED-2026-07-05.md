# Test Plan — Revised (execution authority)

**Status:** Locked for execution  
**Authority stack:** `REVISION-2026-07-05.md` → **this file** → `docs/architecture/MODULE-UI-CONTRACT.md` → `TEST-EXPERT-PLAN-2026-07-05.md` (reference only)  
**Date:** 2026-07-05

---

## Coordinator revisions (vs expert draft)

| Expert | Revised call | Reason |
|--------|--------------|--------|
| `plannerCommandWiring.test.ts` before wire | **Red first, then wire** | TDD for 1A P0 |
| `test:open3d` script | **Yes** — minimal smoke until shell stable | Guest E2E ≠ open3d proof |
| `check:site-ui:*` in TEST-1 | **`lint:ui` + `lint:ui:strict` mapped to gates** | Same contract as UI plan |
| Close 0408 in TEST-3 only | **Agreed** | No partial closure |
| Full `release:gate` every PR | **Nightly + pre-promotion** | PR = fast + slices |

---

## Anti-drift test layer (new)

UI drift is a **testable contract**. Tests enforce what lint cannot alone.

| Test / gate | Path | Asserts |
|-------------|------|---------|
| UI lint (warn) | `pnpm run lint:ui` | Admin palette; open3d Tailwind TSX; module hex |
| UI lint (strict) | `pnpm run lint:ui:strict` | Same; exit 1 on violation |
| Open3d icons | `tests/unit/features/planner/open3d/open3dIconPolicy.test.ts` | No `lucide-react` under open3d; no emoji in chrome TSX |
| Command boundary | `plannerCommandBoundary.test.ts` | No `dispatchOpen3dAction` in editor except allowlist |
| Module CSS (optional) | stylelint or extended `lint:ui` | `color-no-hex` in `open3d/**/*.module.css` |

**PR rule:** Any new file under `features/planner/open3d/editor/` or `app/admin/` must not regress these gates.

---

## Phases

### TEST-0 — Baseline (pre-1A, ~2 days)

| Task | Command |
|------|---------|
| Full vitest + evidence | `run-evidence-cmd.ps1` → `pnpm --filter oando-site run test` |
| Audits | `test:audit:hollow`, `test:audit:gate-skips`, `test:audit:eslint-disable` |
| Dual coverage | `test:coverage` + `test:coverage:site` |
| Layout | `test:layout:check` |
| UI contract baseline | `pnpm run lint:ui` (record warnings count) |

**Exit:** `results/site/phase-test-0/` with complete artifacts.

### TEST-1 — 1A gates

| Stream | Deliverable |
|--------|-------------|
| PlannerCommand | `plannerCommandWiring.test.ts` + `plannerCommandBoundary.test.ts` |
| Catalog | cap ≤24 in `useOpen3dWorkspaceCatalog.test.ts` |
| Icons | `open3dIconPolicy.test.ts` |
| E2E | `tests/e2e/open3d-workspace.spec.ts` + `test:open3d` in `package.json` |
| UI contract | `lint:ui` on PR; `lint:ui:strict` when UI-1 shell accepted → `release:gate:fast` |
| Shell | E2E: `100dvh`, no scroll; screenshot optional under `results/site/phase1/ui-1/` |

### TEST-2 — 1B gates

| Stream | Deliverable |
|--------|-------------|
| Publish | API 422 on compile fail; no partial persist |
| Golden | three reference blocks in `svgPhase1Completion.test.ts` |
| Boundaries | extend `svgPackageBoundaries.test.ts` for Puck consumer |
| Puck | component or admin E2E smoke |
| Admin UI | `lint:ui` on new `app/admin/svg-editor/**` |

### TEST-3 — Release readiness

- Full `release:gate` evidence
- PLAN-FAIL-0408 closure only with per-file CSV + console JSON
- `lint:ui:strict` + `open3dIconPolicy` + `test:open3d` green

---

## Execution order (agent)

**Now (parallel with UI-1 L1 shell):**

1. TEST-0 baseline (when policy allows heavy runs)
2. Add `plannerCommandWiring.test.ts` + `plannerCommandBoundary.test.ts` (red)
3. Add `open3dIconPolicy.test.ts`
4. Add `open3d-workspace.spec.ts` skeleton + `test:open3d` script

**After 1A P0 + UI-1 shell:**

5. Wire `useWorkspaceCanvas` → green command tests
6. Enable `lint:ui:strict` in `release:gate:fast`
7. Expand open3d E2E: place → undo → save → reload

---

## CI matrix (coordinator)

| Tier | Commands | When |
|------|----------|------|
| **PR fast** | `release:gate:fast` + `lint:ui` | Every push |
| **PR fast (post UI-1)** | above + `lint:ui:strict` | After shell acceptance |
| **Planner slice** | `test:planner` + `test:layout:check` | Open3d PRs |
| **Nightly** | `test:planner-catalog` + `test:open3d` | Regression |
| **Pre-promotion** | `release:gate` | TEST-3 |

### `release:gate:fast` target composition (after UI-1)

```text
lint → lint:ui:strict → typecheck → test → audit:hollow (exclude marketing) → audit:eslint-disable
```

---

## New module test checklist

When adding `features/planner/open3d/editor/<NewPanel>.tsx`:

- [ ] Unit test if behavior non-trivial; otherwise shell integration covers it
- [ ] `lint:ui` / `lint:ui:strict` pass
- [ ] `open3dIconPolicy.test.ts` still passes
- [ ] No co-located `*.test.ts` under `features/` (`test:layout:check`)

---

## What NOT to do

- Claim 1A on guest E2E alone
- Close PLAN-FAIL-0408 without full dual coverage evidence
- Game coverage via `coverageGap.test.ts` only
- Skip `lint:ui` because warn mode is on — **track warning count to zero before strict**
- Add co-located tests under `features/`
- Block 1A on Puck E2E (1B scope)
