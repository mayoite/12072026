# P02 — Engine lock plan review (suggestions)

**Date:** 2026-07-09  
**Plan:** `Plans/trustdata/phases/P02-engine-lock.md`  
**Reviewer role:** planning expert (trust-data)  
**Scope:** Plan + path verification only. No product code.  
**Skills:** `/using-superpowers` (required); plan handbook `Agents/Agents-Plan.md`; live path verification (no worktrees).

---

## Live path verification (2026-07-09)

| Claim in plan | Live result |
|---------------|-------------|
| `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` | **OK** — `OPEN3D_FABRIC_FURNITURE_ENV` + `=== "1"` only |
| `canvas-fabric-stage/` barrel, layer, mapper, CSS | **OK** — all five files present |
| `FeasibilityCanvas.tsx` | **OK** |
| `ThreeLazyViewer.tsx` / `ThreeViewerInner.tsx` | **OK** — `enableControls = true` default; OrbitControls dynamic import when true |
| `OOPlannerWorkspace.tsx` mounts Feasibility + Lazy3DViewer; flag gates FurnitureFabricLayer | **OK** — Lazy3DViewer call omits `enableControls` → default ON |
| `Open3dPlannerHost` → `Open3dNativeHost` → workspace | **OK** for `/planner/open3d` |
| Guest/canvas → same host chain only | **INCOMPLETE** — both go via `Open3dPlannerWorkspaceRoute` first |
| `site/app/planner/open3d|guest|canvas` pages | **OK** |
| `ModelViewerPreview.tsx` admin-only path | **OK** |
| `_archive/fabric/` | **OK** |
| Unit flag tests `furnitureFabricMapper.test.ts` | **OK** — OFF / non-1 / exact `"1"` cases |
| `site/features/planner/lib/featureFlags.ts` | **OK** — product flags only; no Fabric env reader |
| `Planner3DViewer.tsx` R3F+drei OrbitControls | **OK** |
| Packages in `site/package.json` | **OK** — `fabric@7.4.0`, `three@^0.185.1`, `@react-three/fiber@^9.6.1`, `@react-three/drei@^10.7.7`; **no** `konva` / `react-konva` |
| Research MASTER-CHART / ENGINE-DECISION | **OK** under `D:\websites\research\2026-07-09-world-standard\comparison\` |
| Plan A `00A-START` / `02B-PHASE-2B-2C` | **OK** |
| Design spec world-standard | **OK** |
| Evidence `02-engine-lock/` | **Missing** (expected pre-exec) — and **conflicts** with trustdata RESULTS-MAP |
| Evidence `01-engine-lock/` (RESULTS-MAP / CP-02 / MASTER) | **Missing** (expected) — **canonical** per map |

**Flag consumers (rg):** `fabricFurnitureFlag.ts`, `index.ts` barrel, `OOPlannerWorkspace.tsx`, `furnitureFabricMapper.test.ts`, docs in `open3d/README.md`. Matches plan intent.

**Approach A:** Confirmed default in `Plans/trustdata/00-START.md` and INDEX (owner checkboxes still unchecked — plan-only continue allowed; CP-02 execution still needs owner engine sign-off).

---

## P0 — Must fix in plan (blockers / wrong truth)

### P0-1 — Evidence root conflicts with RESULTS-MAP / CHECKPOINTS / MASTER
- **Problem:** Phase file uses `results/planner/world-standard-wave/02-engine-lock/` everywhere. Trustdata canon uses **`01-engine-lock/`** (`RESULTS-MAP.md`, `CHECKPOINTS.md` CP-02 row, `MASTER-CHECKLIST.md`, `AGENT-RULES.md`). `02-browser-open3d-journey/` is reserved for P07/W1–W2.
- **Fix:** Make **`01-engine-lock/`** the sole evidence root in P02. State explicitly why the folder is `01-` not `02-` (map reservation). List required artifacts under that root; allow README + richer files beyond RESULTS-MAP’s minimum `NOTES.md`.

### P0-2 — Guest/canvas host chain omits `Open3dPlannerWorkspaceRoute`
- **Problem:** Plan maps guest/canvas as page → `Open3dPlannerHost` → `Open3dNativeHost` → workspace. Live code:
  - `/planner/open3d` → `Open3dPlannerHost` → `Open3dNativeHost` → `OOPlannerWorkspace`
  - `/planner/guest` + `/planner/canvas` → **`Open3dPlannerWorkspaceRoute`** (Providers + ProjectSetupGate + dynamic host) → `Open3dPlannerHost` → …
- **Fix:** Task 3 + 2D files table must include `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx` and dual host chains.

### P0-3 — Vitest command path will fail under package filter
- **Problem:** Command uses `vitest run site/tests/unit/...` with `pnpm --filter oando-site`. Package CWD is `site/`; live scripts/evidence use `tests/unit/...` (no `site/` prefix). Sibling phases (P08/P09) use `pnpm exec vitest run tests/unit/...` from site context.
- **Fix:** Canonical PowerShell from repo root:
  1. Create evidence dir under `01-engine-lock`
  2. `Set-Location site` then `pnpm exec vitest run tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts`
  3. Tee absolute path into `01-engine-lock/vitest-fabric-flag-raw.log`
  4. Write `vitest-fabric-flag-run.json` with real exitCode/counts (no placeholders)

### P0-4 — OWNER sign-off filename must be single canonical
- **Problem:** `OWNER-SIGN OFF.md` (space) + optional `OWNER-SIGNOFF.md` invites dual files and missed CP-02.6.
- **Fix:** Only **`OWNER-SIGNOFF.md`**. Plan Task 6 boxes + copy into that file.

### P0-5 — Task 0 missing run meta / HEAD (P01 parity, no TBD)
- **Problem:** P01 requires `HEAD.txt` + `run.json` with real values. P02 Task 0 only creates README — agents invent meta or leave blanks.
- **Fix:** Task 0 requires `HEAD.txt` (`git rev-parse HEAD` + `git status -sb`), `run.json` (`phase`, `checkout`, `evidenceRoot`, `approach`, `startedAt` ISO after command, `worktrees: false`), and README goal = **confirm lock, not Fabric cutover**.

---

## P1 — Should fix (accuracy / anti-thrash)

### P1-1 — Orbit code-truth row for workspace call site
- Document: `OOPlannerWorkspace` mounts `<Lazy3DViewer projectData={...} />` with **no** `enableControls` prop → default `true` → OrbitControls path in `ThreeViewerInner`. P02 locks default; P04 proves product journey. Flag stale `WAVE.md` line “no orbit controls” as possible contradiction for P01 inventory, not a reason to re-open engine choice.

### P1-2 — Anti-thrash audit must cover residual “hybrid” / “under evaluation” language
- Expand Task 7 greps: `insurance`, `hybrid` (in open3d live docs/routes), Plan A residuals (`Konva/Fabric under evaluation` in `00A-START.md`). List for **later docs pass**; do not mass-rewrite in P02. `ENGINE-LOCK-RECORD.md` **supersedes** residual evaluation wording for agent thrash purposes after CP-02.

### P1-3 — PACKAGE-PIN record ranges exactly
- Record package.json strings as-is: `fabric` exact `7.4.0` (not caret); three/r3f/drei caret ranges; explicit **konva absent** from `site/package.json`. No upgrades in this phase.

### P1-4 — Flag inventory: pointer-ownership known limits (already partially present)
- Keep Task 2.6 limits from `open3d/README.md` (select+flag full-stage pointer-events; pan/zoom desync). Add: flag-ON is **migration spike**, not dual-CAD product mode (anti-thrash #2).

### P1-5 — CP-02 / 00-START mirror
- Task 6 / CP-02.6: after owner marks, mirror engine checkboxes into `Plans/trustdata/00-START.md` engine section (CHECKPOINTS CP-02 criterion 6). Agent presents boxes; owner marks; agent may update 00-START only when owner has marked (or records explicit deferral).

### P1-6 — Approach A binding sentence at top
- One non-negotiable line: Approach **A** = W1–W8 on Feasibility + document model first; Fabric.js v7 full stage remains **destination**; Feasibility is **interim**; Three + orbit ON; **no hybrid thrash**. Do not re-pick engines in P03+.

---

## P2 — Nice to have

### P2-1 — Evidence artifact checklist table (filename → task)
### P2-2 — Related paths: add WorkspaceRoute + RESULTS-MAP + CHECKPOINTS
### P2-3 — Prior fabric slice citation: `results/planner/fabric-stage-slice/run.json` (10 unit pass, DONE_WITH_CONCERNS)
### P2-4 — Secondary 3D surface note: `Planner3DViewer` is R3F ecosystem, not a second engine vote
### P2-5 — Explicit “no product code” in Task 5–7 (grep/tests/docs inventory only)

---

## Suggested apply order (for plan revision)

1. P0-1 evidence root → `01-engine-lock/`  
2. P0-2 host chain + WorkspaceRoute  
3. P0-3 vitest command  
4. P0-4 OWNER-SIGNOFF.md  
5. P0-5 Task 0 meta  
6. P1-1 orbit call-site truth  
7. P1-2 thrash language greps  
8. P1-3 package pin precision  
9. P1-5 00-START mirror  
10. P1-6 Approach A banner  

---

## Out of scope (do not do in P02)

- Product implementation (select/delete, Fabric walls, orbit Playwright).  
- Package upgrades.  
- Mass doc rewrites of “hybrid” comments.  
- Re-debating Konva vs Fabric without failed-spike evidence.  
- Worktrees.  
- Push.

---

## Disposition

| ID | Priority | Applied to plan? |
|----|----------|------------------|
| P0-1 | P0 | Yes |
| P0-2 | P0 | Yes |
| P0-3 | P0 | Yes |
| P0-4 | P0 | Yes |
| P0-5 | P0 | Yes |
| P1-1 | P1 | Yes |
| P1-2 | P1 | Yes |
| P1-3 | P1 | Yes |
| P1-4 | P1 | Yes |
| P1-5 | P1 | Yes |
| P1-6 | P1 | Yes |
| P2-1..5 | P2 | Yes (light) |
