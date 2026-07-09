# P01 product-truth — expert review suggestions

**Reviewer role:** planning expert (tech lead + PM)  
**Date:** 2026-07-09  
**Plan reviewed:** `Plans/trustdata/phases/P01-product-truth.md`  
**Method:** full plan read + live path spot-check under `D:\OandO07072026\site` and trustdata authority files. **No product code changes.**

---

## Strengths (short)

- Clear **inventory-only** scope: no open3d feature edits, evidence only under `results/planner/world-standard-wave/01-product-truth/`.
- Strong standing rules: superpowers, no worktrees, commit-as-we-go, push-on-ask, trust data.
- Task decomposition is executable: PowerShell steps, checkbox syntax, gate-oriented greps, deep-read notes, CP-01 hard stop.
- Most primary production paths are **real** (FeasibilityCanvas, OOPlannerWorkspace, ThreeViewer*, Open3dNativeHost, unit root, WAVE/COMPARISON, design spec, ayushdocs).
- Aligns with Approach A / W1–W8 framing and handoff intent toward P02.

---

## Gaps / risks / contradictions

### Authority / checkpoint mismatch (P0)

| Authority | Requires for CP-01 |
|-----------|-------------------|
| `Plans/trustdata/checkpoints/CHECKPOINTS.md` | `INVENTORY.md`, `CONTRADICTIONS.md` under `01-product-truth/` |
| `Plans/trustdata/RESULTS-MAP.md` | Same minimum artifacts |
| **P01 plan as written** | `PRODUCT-TRUTH.md`, `CAPABILITY-MATRIX.md`, `CLAIMS-REGISTER.md`, notes — **never names** `INVENTORY.md` / `CONTRADICTIONS.md` |

Risk: agents produce a rich pack that still **fails CP-01** on folder contract.

### Wrong or stale path claims (P0)

| Claim in plan | Live fact (2026-07-09) |
|---------------|------------------------|
| Fabric archive routes `site/app/planner/fabric/*` | **No** `site/app/planner/fabric/` App Router tree. Archive code is `site/features/planner/_archive/fabric/`. |
| “Fabric archive (legacy; not default live 2D)” as page files | `site/config/build/next.config.js` **permanent redirects** `/planner/fabric` and `/planner/fabric/:path*` → `/planner/open3d/`. Fallback routes in archive README are **stale** relative to redirects. |
| Host chain starts at `Open3dPlannerHost` only | Guest/canvas: `Open3dPlannerWorkspaceRoute` → dynamic `Open3dPlannerHost` → `Open3dNativeHost` → workspace. Pilot `/planner/open3d` imports `Open3dPlannerHost` **directly** (no WorkspaceRoute / ProjectSetupGate wrapper). Host path: `site/features/planner/ui/Open3dPlannerHost.tsx`. |

### Command / process contradictions (P0–P1)

- Task 05 Step 5 vitest smoke is **“optional if time”** but CP-01 fail conditions include **“Silent skip of vitest smoke without log of why”** — agents can “optionally skip” and still fail.
- Task 01 “must include” table lists keyboard/canvas/autosave files; Step 3 `key-files-exist.tsv` only tests **6** paths (omits those three).
- W6 grep limited to `*Status*.{ts,tsx}` — will miss honesty copy in TopBar, repositories, UI strings outside Status-named files.
- W4 grep includes bare `2d|3d` — extremely noisy; matrix quality degrades.
- Claims table lists `ayushdocs/09-VERIFY-SNAPSHOT.md` and design spec; concat script **omits** both (and SESSION-RECAP).
- “Log under Failures” has no absolute path (`D:\OandO07072026\Failures.md`).
- CP-01 owner mark: plan says update CHECKPOINTS “when maintained”; **CHECKPOINTS.md already exists** and is the CP ledger — should be an explicit final step when owner/reviewer passes.

### Path spot-check summary (production-relevant)

**Exist (confirmed):**

- `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`
- `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`
- `site/features/planner/open3d/3d/ThreeViewerInner.tsx`, `ThreeLazyViewer.tsx`
- `site/features/planner/open3d/ui/Open3dNativeHost.tsx`
- `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`, `useWorkspaceCanvas.ts`
- `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts`
- `site/features/planner/open3d/README.md`
- Routes: `site/app/planner/(workspace)/guest/page.tsx`, `canvas/page.tsx`, `open3d/page.tsx`
- Host: `site/features/planner/ui/Open3dPlannerHost.tsx`, `Open3dPlannerWorkspaceRoute.tsx`
- Fabric overlay: `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts`
- Unit root: `site/tests/unit/features/planner/open3d/` (incl. named smoke tests)
- E2E: `site/tests/e2e/planner-*.spec.ts` present
- Package name `oando-site`; script `test:planner`
- Evidence parents: `results/planner/world-standard-wave/WAVE.md`, `COMPARISON-CHART.md`
- Spec: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`
- ayushdocs set as listed

**Wrong / incomplete as stated:**

- `site/app/planner/fabric/*` page tree — **missing** (redirects only)
- Host chain missing WorkspaceRoute + dual entry difference
- Archive root is `site/features/planner/_archive/fabric/`, not app/planner/fabric

**Orbit honesty note for inventory (not a plan path bug):** `OrbitControls` **is** loaded in `ThreeViewerInner.tsx` when `enableControls` (default true). WAVE.md still lists “no orbit controls” as a top blocker — inventory must treat that as **docs vs code** contradiction, not assume WAVE is code-truth.

---

## Must-fix (P0)

1. **CP-01 artifact contract:** Require canonical `INVENTORY.md` + `CONTRADICTIONS.md` (RESULTS-MAP / CHECKPOINTS). Keep matrix/claims/notes as supporting evidence; make PRODUCT-TRUTH either alias content of INVENTORY or a required companion that INVENTORY indexes.
2. **Correct Fabric truth:** Replace `site/app/planner/fabric/*` with archive path + next.config redirect fact; register as claim rows (README/archive README vs redirects).
3. **Correct host/route chain** with absolute paths: dual entry (guest/canvas via WorkspaceRoute; open3d direct Host).
4. **Vitest smoke:** Make attempt **required** OR require an explicit `vitestSmoke: "skipped"` / `"failed"` reason in `run.json` + log file — never silent skip; remove “optional if time” wording that conflicts with CP fail.
5. **key-files-exist.tsv:** Include every path from the must-include table (keyboard, canvas hooks, autosave) plus Host + WorkspaceRoute.

---

## Should-fix (P1)

1. Expand W6 greps beyond `*Status*` (TopBar, persistence repos, workspace labels).
2. Tighten W4 patterns (`OrbitControls|enableControls|viewMode` etc.); avoid bare `2d|3d`.
3. Add Task 02 reads for `Open3dPlannerHost.tsx`, `Open3dPlannerWorkspaceRoute.tsx`, and redirect lines in `site/config/build/next.config.js`.
4. Expand claims concat to include `09-VERIFY-SNAPSHOT.md`, world-standard design spec, optional SESSION-RECAP.
5. Name **Failures.md** path on stop conditions.
6. Explicit CP-01 close step: update `Plans/trustdata/checkpoints/CHECKPOINTS.md` status when pass/fail (owner or unlocked reviewer).
7. Prefer smoke command via package cwd: `pnpm --filter oando-site exec …` with paths relative to `site/` **or** document `cd site` + `pnpm run test:planner` with tee to evidence root.
8. Task 05 e2e listing: also capture non-`*planner*` related specs that touch planner journey (`admin-svg-publish-p01.spec.ts`, `sketch-to-plan-pipeline.spec.ts`) so coverage map is not name-filter blind.
9. CAPABILITY-MATRIX “Unit test file” column: resolve from `unit-test-list.txt` + named suites; forbid “assume unit-green” without smoke/log cite.
10. Preconditions: record Approach A default from `00-START.md` into run.json (`approach: "A"`).

---

## Nice-to-have (P2)

1. Parallelism file-ownership table (which agent owns which evidence filename) to avoid clobber.
2. Minimal JSON schema fields documented once for `run.json` (required keys list).
3. Note PowerShell `Set-Content -Encoding utf8` may write BOM; prefer utf8NoBOM if agents parse logs strictly.
4. Cross-link RESULTS-MAP row for P01 in Task 00.
5. One-line “do not re-scrape Planner5D” ethics pointer already in START — optional restate in Task 04.

---

## Revision disposition

All **P0 + P1** items are incorporated into the revised `Plans/trustdata/phases/P01-product-truth.md` (same path). P2 left as optional guidance inside Agent operating rules / notes where cheap; not bloating task count.
