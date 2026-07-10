# CODE-REVIEW-REPORT — P02 Engine Lock

**Date:** 2026-07-10  
**Plan:** `plans1/P02-engine-lock/IMPLEMENTATION-PLAN.md`  
**Reviewer role:** Plan-vs-repo technical review (read-only on product code)  
**Checkout verified:** `D:\OandO07072026` (main checkout; no worktree work)  
**Verdict:** **APPROVE-WITH-FIXES**

---

## Executive summary

The P02 implementation plan is **technically sound for this monorepo** and correctly scopes the phase as **evidence re-prove only** (no Fabric cutover, no package upgrades, no Konva, no P03/P04 product work). Live code already implements the locked stack the plan wants to freeze:

| Layer | Live truth (2026-07-10) |
|-------|-------------------------|
| 2D interim | `FeasibilityCanvas` (Canvas 2D API) sole furniture/walls path when flag OFF |
| 2D destination spike | `canvas-fabric-stage/` + `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE === "1"` only |
| 3D planner | Three + Lazy3DViewer → ThreeViewerInner + OrbitControls ON |
| Orbit product path | `getOpen3dViewerControlProps()` spread on workspace (stronger than phase “omit prop” text) |
| Hybrid ban | `konva` / `react-konva` **absent** from `site/package.json` |
| Evidence | Entire `results/` tree **missing** → CP-02 must be re-proved from zero |

The plan correctly rejects phase-card **DONE/PASS** theater without disk artifacts, bans the wrong folder name `02-engine-lock/`, documents false-green traps, and adds **Task 5b orbit unit re-run** to match evolved orbit helper truth.

**Do not re-build** flag, fabric stage, Feasibility, orbitDefaults, host chains, or unit tests. Execute evidence Tasks 0–8 (+ optional 5c only on real FAIL).

**Fix before/while execute (non-blocking for product code, blocking for path honesty):**

1. Brainstormer path in plan Appendix A / Inputs is wrong: live report is `archive/Idiots2/P02-engine-lock/REPORT.md`, **not** root `Idiots2/...` (root path does not exist).  
2. Soften “gsap / @gsap/react used” — `gsap` is used; **`@gsap/react` has zero app imports**.  
3. Optional: cite residual “hybrid” labels in `importGraphProof.ts` + open3d README title as anti-thrash inventory only (plan already mostly covers this).

---

## Repo truth checked (plan claim | reality | status)

| # | Plan claim | Live reality | Status |
|---|------------|--------------|--------|
| 1 | `results/` missing → re-prove CP-02 | `Test-Path results` = **False**; `site/results` = **False** | **MATCH** |
| 2 | Evidence canonical = `01-engine-lock/` not `02-` | `Plans/Research/RESULTS-MAP.md` enforces `01-engine-lock/` for P02; `02-` reserved for P07 journey | **MATCH** |
| 3 | Flag exact `"1"` only | `fabricFurnitureFlag.ts` → `env[...] === "1"` | **MATCH** |
| 4 | Workspace wires flag → Fabric layer + hide Feasibility furniture | `OOPlannerWorkspace.tsx`: `feasibilityLayerVisibility` forces `furniture: false` when ON; mounts `FurnitureFabricLayer` | **MATCH** |
| 5 | Workspace spreads `getOpen3dViewerControlProps()` | Lines ~1010–1012: `<Lazy3DViewer {...getOpen3dViewerControlProps()} />` | **MATCH** |
| 6 | Phase “omit enableControls” is stale | Phase file still says prop omitted; code uses helper | **PLAN CORRECT (phase stale)** |
| 7 | `OPEN3D_ORBIT_DEFAULT_ENABLED = true` | `orbitDefaults.ts` | **MATCH** |
| 8 | Helper type forces `{ enableControls: true }` | Return type literal `true` | **MATCH** |
| 9 | Host: open3d → Host; guest/canvas → WorkspaceRoute | Confirmed in `site/app/planner/**/page.tsx` | **MATCH** |
| 10 | open3d README omits WorkspaceRoute | README table: guest/canvas → Host only | **MATCH (stale doc)** |
| 11 | `fabric` exact `7.4.0` | `site/package.json` | **MATCH** |
| 12 | three `^0.185.1`, r3f `^9.6.1`, drei `^10.7.7` | package.json | **MATCH** |
| 13 | model-viewer `^4.3.1` admin | dep present; `ModelViewerPreview.tsx` exists | **MATCH** |
| 14 | konva / react-konva absent | No package.json lines | **MATCH** |
| 15 | `@fancyapps/ui` present; hygiene risk | `^6.1.14` in deps; **zero** app imports under `site/` | **MATCH** (likely unused) |
| 16 | gsap / @gsap/react used | `gsap` used in `lib/hooks/useScrollAnimation.ts`; **`@gsap/react` no imports** | **PARTIAL** |
| 17 | Mapper + flag unit suite exists | `furnitureFabricMapper.test.ts` (exact-1 + near-miss + barrel) | **MATCH** |
| 18 | Orbit unit suite exists | `orbitControlsDefault.test.tsx` (helper + construct + opt-out) | **MATCH** |
| 19 | `threeLazy.test.tsx`, `workspaceShell.test.tsx` exist | Present under open3d unit tree | **MATCH** |
| 20 | Fabric stage files keep / do not delete | All five + Feasibility + workspace present | **MATCH** |
| 21 | `_archive/fabric/` not live guest/canvas | Live routes use open3d host chain | **MATCH** |
| 22 | `featureFlags.ts` ≠ Fabric env reader | Separate product registry; Fabric flag isolated | **MATCH** (plan claim) |
| 23 | Phase card DONE / CP PASS without files | Status table claims DONE 2026-07-09 + PASS | **STALE PHASE (plan correctly flags)** |
| 24 | `Plans/trustdata/*` dead | INDEX / RESULTS-MAP live under `Plans/phases` + `Plans/Research` | **MATCH** |
| 25 | Approach A binding in INDEX | Kill order P02 → `01-engine-lock/` | **MATCH** |
| 26 | Brainstormer at `Idiots2/P02-engine-lock/REPORT.md` | Root `Idiots2` **missing**; live = `archive/Idiots2/P02-engine-lock/REPORT.md` | **FAIL (plan path)** |
| 27 | Product code default = none | Correct for lock confirmation | **MATCH / SOUND** |
| 28 | CP-02.5b orbit re-run required | Orbit helper is product authority; unit exists | **SOUND extension** |
| 29 | Residual hybrid language inventory | README “production hybrid”; `importGraphProof` stack `open3d-hybrid` | **MATCH residual** |
| 30 | Zero suppression of vitest logs | Aligns with `testing-handbook` / AGENTS | **SOUND** |

---

## Findings

### Blocking

#### B1 — Brainstormer / Appendix path does not exist on disk

- **Claim:** Inputs + Appendix A list `D:\OandO07072026\Idiots2\P02-engine-lock\REPORT.md`.
- **Verified:** `Test-Path Idiots2` = **False**. Live report: `D:\OandO07072026\archive\Idiots2\P02-engine-lock\REPORT.md` (content reviewed; Approach A + D1–D14 align with plan synthesis).
- **Judgment:** Agents that `Read` the plan’s path will fail or invent a second brainstorm. Intent of “Idiots2 only, never Idiots” is right; **filesystem path is wrong**.
- **Action:** Before execute, treat authority as **`archive/Idiots2/P02-engine-lock/REPORT.md`**. Do **not** recreate root `Idiots2/` tree. (Plan file itself is out of scope for this review to edit.)

#### B2 — CP-02 cannot be claimed PASS on this checkout today

- **Claim (phase card):** Engine lock pack DONE; CP-02 PASS with full artifact set.
- **Verified:** No `results/` directory at all. RESULTS-MAP requires `01-engine-lock/` + NOTES minimum (+ richer pack for phase).
- **Judgment:** Plan correctly forces re-prove. Any agent that skips to P03 product code because phase table says DONE = **false green**.
- **Action:** Execute plan Tasks 0–8; only then reassess CP-02. OWNER Template B ≠ execution unlock.

---

### High

#### H1 — Phase orbit prose still wrong; plan correctly elevates helper

- **Claim (phase P02-engine-lock.md):** Workspace mounts Lazy3DViewer **without** `enableControls` → default ON.
- **Verified:** Workspace **explicitly** spreads `getOpen3dViewerControlProps()`; `orbitDefaults.ts` documents “defaults alone are not enough.”
- **Judgment:** Plan’s ENGINE-LOCK-RECORD + ENTRYPOINT + Task 5b are the right authority. Re-implementing “omit prop only” would **weaken** the lock.
- **Action:** Evidence must cite helper + unit tests. Optional later docs fix on phase card; **do not** change product mount.

#### H2 — open3d README host table incomplete (docs residual, not engine re-vote)

- **Claim (plan):** guest/canvas go through `Open3dPlannerWorkspaceRoute`.
- **Verified:** `guest/page.tsx` and `canvas/page.tsx` import WorkspaceRoute (Providers + ProjectSetupGate + dynamic Host). README omits this and still titles stack “production hybrid.”
- **Judgment:** Plan rightly says **do not mass-rewrite README in P02**. ENTRYPOINT-MAP must win over README.
- **Action:** List in ANTI-THRASH-AUDIT residual language; no product thrash.

#### H3 — `@gsap/react` “used” overstated

- **Claim (plan Tech Stack / PACKAGE-PIN hygiene):** gsap / `@gsap/react` present and used outside engine vote.
- **Verified:** `gsap` + ScrollTrigger imported in `site/lib/hooks/useScrollAnimation.ts`. **No** `@gsap/react` imports in `site/**/*.{ts,tsx,js,jsx}`. Both still in `package.json`.
- **Judgment:** Hygiene note still valid (non-MIT / cleared-table debt). Do not treat unused `@gsap/react` as engine or as proof of product need without owner.
- **Action:** LICENSE-HYGIENE-NOTE should say: `gsap` **used**; `@gsap/react` **present, no import found** (candidate remove with owner).

#### H4 — Owner sign-off still open (expert + phase)

- **Claim:** CP-02 needs OWNER-SIGNOFF marks or explicit deferral.
- **Verified:** Expert `05-packages-stack.md` verdict **FIX**; owner sign-off open; no evidence OWNER file (results missing).
- **Judgment:** Plan Task 6 Template A vs B is correct. **Do not** unlock P03 product implementation on deferral alone (plan §9 already states this).
- **Action:** Execute Task 6 honestly; if owner silent → Template B and keep planning-only.

---

### Medium

#### M1 — Residual “hybrid” code labels are inventory, not permission to thrash

- **Claim:** After lock, residual “hybrid” titles do not re-open engines.
- **Verified:** `open3d/README.md` title “production hybrid”; `cleanup/importGraphProof.ts` uses stack enum `open3d-hybrid` for guest/canvas/open3d routes.
- **Judgment:** These describe historical folder naming / multi-layer (Feasibility+Three+optional Fabric spike), not “add Konva.” Plan supersession language is right; greps in Task 7 will light up — **expected**.
- **Action:** Record paths; forbid “hybrid means re-platform” PRs.

#### M2 — `three-stdlib` present but unmentioned

- **Claim:** Package pin list covers fabric/three/r3f/drei/model-viewer.
- **Verified:** Also `"three-stdlib": "^2.36.1"` (used by R3F/drei ecosystem, e.g. Planner3DViewer types).
- **Judgment:** Not a second engine. Optional footnote in PACKAGE-PIN so agents do not “dedupe by deleting.”
- **Action:** Optional one-line in Task 4 output; no install thrash.

#### M3 — `babylon_config` column in generated DB types

- **Claim:** No Babylon engine thrash.
- **Verified:** `database.admin.types.ts` has `babylon_config` JSON fields (schema residue). No planner workspace Babylon engine.
- **Judgment:** Not a P02 product engine vote. Do not invent Babylon viewer from column names.
- **Action:** If grepped in anti-thrash, classify as schema residue.

#### M4 — Commit cadence (11 doc commits) is process-heavy but AGENTS-aligned

- **Claim:** Commit after each landable slice.
- **Verified:** AGENTS: commit as you go; evidence-only phase.
- **Judgment:** Acceptable. Agents may batch meta if needed, but plan sequence is fine. Not a reason to skip evidence files.
- **Action:** Prefer plan sequence; no force-push.

#### M5 — Phase authority chain still lists `Plans/trustdata/`

- **Claim (plan):** trustdata dead; use Plans/phases + Research.
- **Verified:** Phase file authority chain still mentions trustdata; expert packages doc still cites trustdata paths.
- **Judgment:** Plan correctly rewires. Executors must not write evidence pointers only into dead trees.
- **Action:** Follow plan §1.3 authority map.

#### M6 — Secondary unit `hostWiringP01.test.ts` already asserts flag wire

- **Claim:** Re-run mapper + orbit suites only.
- **Verified:** `hostWiringP01.test.ts` checks workspace source for `isOpen3dFabricFurnitureEnabled` and default OFF.
- **Judgment:** Extra confidence; not required for CP-02. Do not invent new tests unless 5/5b fail.
- **Action:** Optional cite in FLAG-INVENTORY “also covered by hostWiringP01.”

---

### Low

#### L1 — Plan length vs YAGNI

- Extensive templates are appropriate for an **evidence-only** phase where false-green is the main failure mode. Not “implement Fabric walls again.”
- **Action:** Execute; do not expand into product features.

#### L2 — open3d README cites dead Plan A path `Plans/01-execution/core/02B-...`

- Residual docs debt; archive path exists under `archive/Plans/...` per phase file.
- **Action:** Later docs pass; not P02 product work.

#### L3 — `Planner3DViewer` / site `ThreeViewer` also use OrbitControls (drei)

- Still Three family; plan correctly marks secondary surfaces as non-votes.
- **Action:** Do not merge into open3d workspace engine swap.

#### L4 — Task 00 vs Task 0 numbering

- Mild confusion risk only.
- **Action:** Run both; 00 is preconditions, 0 is evidence seed.

---

## What already exists (do not re-build)

### Product / engine stack (shipped)

| Asset | Path | Role |
|-------|------|------|
| Fabric furniture flag | `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` | Exact `"1"` gate |
| Fabric layer + mapper + CSS + barrel | `canvas-fabric-stage/*` | Spike stage |
| FeasibilityCanvas | `canvas-feasibility/FeasibilityCanvas.tsx` | Live interim 2D |
| Workspace host | `editor/OOPlannerWorkspace.tsx` | Flag + 2D/3D mount |
| Orbit defaults + helper | `3d/orbitDefaults.ts` | Product orbit contract |
| Lazy / Inner 3D | `ThreeLazyViewer.tsx`, `ThreeViewerInner.tsx` | Three + OrbitControls |
| Workspace route shell | `ui/Open3dPlannerWorkspaceRoute.tsx` | guest/canvas |
| Hosts | `Open3dPlannerHost`, `Open3dNativeHost` | Route composition |
| App routes | `app/planner/open3d`, `(workspace)/guest`, `(workspace)/canvas` | Entry |
| Document model | `open3d/model/*` | UUID + mm truth |
| Admin model-viewer | `admin/svg-editor/ModelViewerPreview.tsx` | Non-workspace |
| Secondary R3F | `features/planner/3d/Planner3DViewer.tsx` | Same engine family |
| Archive fabric | `_archive/fabric/` | Not live path |

### Tests (re-run into `results/`, do not rewrite for coverage theater)

| Suite | Path | Covers |
|-------|------|--------|
| Fabric flag + mapper | `site/tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts` | poses, entityId, exact-1, near-miss, barrel |
| Orbit contract | `.../orbitControlsDefault.test.tsx` | default ON, helper, construct, opt-out, `data-orbit-enabled` |
| Lazy smoke | `threeLazy.test.tsx` | smoke only |
| Workspace shell | `workspaceShell.test.tsx` | mocks Lazy3DViewer — **not** orbit authority alone |
| Host wiring (extra) | `hostWiringP01.test.ts` | flag wire static/source checks |

### Packages already pinned (freeze; no upgrade in P02)

```
fabric=7.4.0
three=^0.185.1
@react-three/fiber=^9.6.1
@react-three/drei=^10.7.7
@google/model-viewer=^4.3.1
konva=ABSENT
react-konva=ABSENT
```

### Authority docs (consume, do not fork)

- `Plans/phases/P02-engine-lock/*` (execute card + expert essays)  
- `Plans/INDEX.md` kill order  
- `Plans/Research/RESULTS-MAP.md` folder lock  
- `archive/Idiots2/P02-engine-lock/REPORT.md` (intent)  
- Design: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`  

---

## Residual / re-prove only

Everything under:

`results/planner/world-standard-wave/01-engine-lock/`

| Artifact | Why residual |
|----------|--------------|
| HEAD.txt, run.json, README, NOTES | Meta + map floor |
| ENGINE-LOCK-RECORD.md | Written freeze with **helper** orbit truth |
| FLAG-INVENTORY.md | Consumer list + W-gate flag OFF |
| ENTRYPOINT-MAP.md | WorkspaceRoute + helper call site |
| PACKAGE-PIN.md | Exact strings from live package.json |
| LICENSE-HYGIENE-NOTE.md | Fancyapps unused + GSAP debt (not engine re-vote) |
| vitest-fabric-flag-raw.log + run.json | Fresh unit proof |
| vitest-orbit-default-raw.log + run.json | Fresh orbit proof (plan extension CP-02.5b) |
| OWNER-SIGNOFF.md | Marks **or** explicit DEFERRAL |
| ANTI-THRASH-AUDIT.md | Greps + residual hybrid language list |
| CP-02-SUMMARY.md | Criteria map + non-claims |

**Not residual product work:**

- Fabric walls cutover  
- Select/delete (P03)  
- Orbit Playwright journey (P04)  
- Package upgrades / Konva experiment  
- Mesh class-leading (P08)  
- Mass README rewrite  

**Optional product code (Task 5c only):** restore flag or orbit helper if units fail for a real regression — then stop and re-prove. Default = skip.

---

## False-green / evidence risks

| Trap | Risk on this repo | Plan mitigation | Residual risk |
|------|-------------------|-----------------|---------------|
| Phase DONE without `results/` | **High** — status table already claims PASS | Re-prove entire pack | Agent skips to P03 |
| Invent `02-engine-lock/` | Medium (map confusion) | Explicit ban | Wrong folder forever |
| Empty Tee / suppressed vitest log | Medium on PowerShell pipelines | Length check + raw log | “PASS” from empty file |
| Fabric unit pass = full stage shipped | Medium | Summary non-claims | Marketing thrash |
| Flag-ON for W proofs | Medium | FLAG W-gate OFF | Dual pointer product |
| Orbit “locked” from stale omit-prop prose | Medium | Task 5b + helper | Weaker evidence |
| OWNER DEFERRAL treated as green unlock | **High** | Template B language | P03 product starts early |
| Packages installed = product score 4 | Low/med | Honesty in summary | Research self-score ~2 |
| Dump under `site/results` | Low currently (absent) | Layout ban / check:layout | Future tool default |
| trustdata as proof root | Medium (stale phase links) | Plan §1.3 | Agents write dead paths |
| Wrong Idiots2 path | Medium | This report | Plan inputs fail open |
| “Hybrid” README → re-open engines | Medium | Supersession + audit | Argument theater |
| Delete `canvas-fabric-stage` as insurance | Medium historically | Anti-thrash 5–6 | Destination abandoned |
| Soften flag to truthy coercion | Low if tests held | 5c forbids | Silent dual enable |
| `enableControls={false}` on workspace for CI | Medium | Audit + 5b | Product nav dies |

**Evidence policy reminder (AGENTS):** `results/` may be deleted = **unproven**. No silent pass. Preserve full vitest output.

---

## Plan quality score (1–10)

**8.5 / 10**

| Dimension | Score | Notes |
|-----------|------:|-------|
| Repo-first accuracy (engine APIs) | 9.5 | Flag, helper, hosts, packages verified |
| Scope discipline (YAGNI) | 9 | Zero product cutover by default |
| False-green defense | 9 | Strong catalog + owner gate |
| Path / authority hygiene | 7 | Results/trustdata good; **Idiots2 path wrong** |
| Test plan realism | 9 | Existing suites; correct cwd/paths |
| Alignment with AGENTS layout | 9 | Root `results/` only |
| Kill-order readiness for P03 | 8 | Clear if OWNER Template A; weaker if deferral |
| Bloat vs necessity | 8 | Long but appropriate for evidence phase |

Deductions: wrong brainstormer filesystem path; minor GSAP package usage imprecision; phase/docs residual not fully enumerated in importGraphProof (audit will catch).

---

## Kill-order notes for this phase

From `Plans/INDEX.md` + plan §9:

1. **P01 product truth** before / adjacent honesty (not re-opened by this plan).  
2. **P02 / CP-02** = engine lock **evidence** under `01-engine-lock/` — **this plan**.  
3. **Unlock P03 select/delete product code** only after:
   - Full artifact checklist on disk, **and**
   - OWNER-SIGNOFF Template A (or written owner waive).  
4. Deferral (Template B) → **plan-only** continue; **do not** claim W3 execution green.  
5. P04 orbit Playwright is **not** P02. Unit orbit proof ≠ browser continuity.  
6. Approach **A** remains binding: W1–W8 on Feasibility + document first; Fabric destination retained.  
7. Fail-forward Konva **full** only after failed Fabric spike with `results/` proof — never hybrid.  
8. Mesh complaints → **P08**, not “switch Three/Babylon.”  
9. Evidence folder: **`01-engine-lock/` only**. Never create `02-engine-lock/` as P02 canonical.  
10. Work only in `D:\OandO07072026` main checkout; commit evidence slices; push/mirror per AGENTS when landable.

---

## Bottom line

**Verdict: APPROVE-WITH-FIXES.**

Execute this plan as written for **evidence lock confirmation**. Live product stack already matches Approach A (Feasibility interim · Fabric destination spike · Three + orbit helper ON · no Konva). The main work is **honest re-prove** under `results/planner/world-standard-wave/01-engine-lock/` because **`results/` is absent** and the phase card’s DONE/PASS is **stale theater**.

**Do not:**

- Re-implement engines, cut over Fabric walls, upgrade packages, add Konva, or start P03 select/delete under a fake CP-02 green.  
- Trust root path `Idiots2/...` — use **`archive/Idiots2/P02-engine-lock/REPORT.md`**.  
- Treat owner silence as unlock.

**Do:**

- Tasks 0–8 + 5b unit re-runs with raw logs.  
- OWNER Template A or explicit DEFERRAL.  
- Anti-thrash greps listing residual hybrid language without mass rewrites.  
- Preserve PACKAGE-PIN exact strings; hygiene note for Fancyapps (unused) + GSAP (used / `@gsap/react` unused).

---

## Appendix — Key code anchors (verified 2026-07-10)

### Flag

```typescript
// site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts
return env[OPEN3D_FABRIC_FURNITURE_ENV] === "1";
```

### Orbit product helper

```typescript
// site/features/planner/open3d/3d/orbitDefaults.ts
export const OPEN3D_ORBIT_DEFAULT_ENABLED = true as const;
export function getOpen3dViewerControlProps(): { enableControls: true } {
  return { enableControls: OPEN3D_ORBIT_DEFAULT_ENABLED };
}
```

### Workspace 3D mount

```tsx
// site/features/planner/open3d/editor/OOPlannerWorkspace.tsx (~1010)
<Lazy3DViewer
  projectData={workspaceCanvas.project}
  {...getOpen3dViewerControlProps()}
/>
```

### Routes

| Route | Entry |
|-------|--------|
| `/planner/open3d` | `Open3dPlannerHost` |
| `/planner/guest` | `Open3dPlannerWorkspaceRoute` |
| `/planner/canvas` | `Open3dPlannerWorkspaceRoute` |

### Disk checks run by reviewer

| Check | Result |
|-------|--------|
| `results/` | missing |
| `site/results/` | missing |
| Root `Idiots2/` | missing |
| `archive/Idiots2/P02-engine-lock/REPORT.md` | present |
| konva in package.json | absent |
| fancyapps app imports | none found |
| @gsap/react imports | none found |

---

## Reviewer non-claims

- Did **not** re-run vitest (this review is static plan-vs-repo; execute phase owns green logs).  
- Did **not** implement product or evidence files.  
- Did **not** edit `IMPLEMENTATION-PLAN.md`.  
- Did **not** claim CP-02 PASS.

---

**Report path:** `D:\OandO07072026\plans1/P02-engine-lock\CODE-REVIEW-REPORT.md`
