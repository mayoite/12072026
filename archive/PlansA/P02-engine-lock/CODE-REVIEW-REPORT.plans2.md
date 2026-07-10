# CODE-REVIEW-REPORT — P02 Engine Lock (idiotplanners2)

| Field | Value |
|-------|--------|
| **Date** | 2026-07-10 |
| **Source** | Idiots |
| **Plan reviewed** | `D:\OandO07072026\plans2/P02-engine-lock\IMPLEMENTATION-PLAN.md` |
| **Phase card** | `D:\OandO07072026\Plans\phases\P02-engine-lock\P02-engine-lock.md` |
| **Checkout** | `D:\OandO07072026` · single worktree · `HEAD` `cb62c4eb5fff3a0c3e1ea099809b4e7d77d74ecc` · `main...origin/main` |
| **Review mode** | Repo first → plan claims → evidence/missing-results honesty · **no product code changes · no plan edits** |
| **Verdict** | **APPROVE-WITH-FIXES** |

---

## Executive summary

P02 is an **evidence re-prove** phase, not an engine re-platform. Live product code already implements the stack the plan wants to freeze:

| Layer | Live truth (2026-07-10) |
|-------|-------------------------|
| 2D interim | `FeasibilityCanvas` sole interactive 2D when Fabric furniture flag OFF |
| 2D destination spike | `canvas-fabric-stage/` · enable only when `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE === "1"` |
| 3D planner | Three → `Lazy3DViewer` / `ThreeViewerInner` + OrbitControls ON |
| Orbit product contract | Workspace spreads `getOpen3dViewerControlProps()` → typed `{ enableControls: true }` |
| Hybrid ban | `konva` / `react-konva` **absent** from `site/package.json` |
| Pins | `fabric` exact `7.4.0`; three/r3f/drei carets match plan |
| **Evidence** | Entire **`results/` tree missing** → CP-02 **unproven on this checkout** |

The implementation plan correctly:

1. Treats phase-card **DONE / CP-02 PASS** as stale without disk artifacts.  
2. Forces full Tasks 0–8 under canonical `results/planner/world-standard-wave/01-engine-lock/` (never `02-engine-lock/`).  
3. Documents **repo-wins** orbit helper over phase/Idiots “omit enableControls” prose.  
4. Scopes default product work to **zero** (unit re-runs only; optional minimal fix only on real lock regression).  
5. Separates packages expert **FIX** (Fancyapps/GSAP hygiene) from engine lock green.

**Do not re-build** flag, fabric stage, Feasibility, orbitDefaults, host chains, or unit tests. Execute evidence pack; re-run existing vitest contracts; freeze decisions in `ENGINE-LOCK-RECORD.md`.

**CP-02 is not green today.** Missing `results/` = unproven. Phase status table must not unlock P03 product work.

**Fix before/while execute (path honesty + hygiene accuracy — not engine re-votes):**

1. Brainstormer path `Idiots/P02-engine-lock/REPORT.md` is **not on disk** at repo root — live report is `archive/Idiots/P02-engine-lock/REPORT.md`.  
2. Soften “gsap / @gsap/react used” — `gsap` is used; **`@gsap/react` has zero app imports**.  
3. Keep OWNER-SIGNOFF honest (marks or written DEFERRED); do not equate plan-only continue with CP-02 PASS.

---

## Repo truth table

| # | Claim (plan / phase / idiots) | Verified (this checkout) | Status |
|---|------------------------------|---------------------------|--------|
| 1 | Entire `results/` missing → re-prove CP-02 | `Test-Path results` = **False**; no `01-engine-lock/` | **MATCH** (unproven) |
| 2 | Canonical evidence = `01-engine-lock/` not `02-` | `Plans/Research/RESULTS-MAP.md` maps P02 → `01-engine-lock/`; `02-` reserved for browser journey | **MATCH** |
| 3 | Flag exact `"1"` only | `fabricFurnitureFlag.ts`: `env[...] === "1"` | **MATCH** |
| 4 | Workspace: flag ON → Feasibility furniture off + `FurnitureFabricLayer` | `OOPlannerWorkspace.tsx` ~232–240, ~933, ~950 | **MATCH** |
| 5 | Workspace spreads `getOpen3dViewerControlProps()` | Lines ~1010–1012 | **MATCH** |
| 6 | Phase still says prop **omitted** → default ON | Phase §3D orbit + “prop omitted at call site” (~90, ~161) | **PHASE STALE**; plan correctly prefers helper |
| 7 | `OPEN3D_ORBIT_DEFAULT_ENABLED = true` | `orbitDefaults.ts` | **MATCH** |
| 8 | Helper return type forces `{ enableControls: true }` | `getOpen3dViewerControlProps()` | **MATCH** |
| 9 | OrbitControls from three examples path + `data-orbit-enabled` | `ThreeViewerInner.tsx` dynamic import + attribute | **MATCH** |
| 10 | Host: open3d → Host; guest/canvas → WorkspaceRoute | Confirmed in three `page.tsx` files | **MATCH** |
| 11 | open3d README omits WorkspaceRoute | README table: guest/canvas → Host only | **MATCH** (stale doc) |
| 12 | `fabric` exact `7.4.0` | `site/package.json` | **MATCH** |
| 13 | three `^0.185.1`, r3f `^9.6.1`, drei `^10.7.7` | package.json | **MATCH** |
| 14 | model-viewer `^4.3.1` admin | dep present; `ModelViewerPreview.tsx` exists | **MATCH** |
| 15 | konva / react-konva absent | No package.json lines | **MATCH** |
| 16 | `@fancyapps/ui` present; likely unused | `^6.1.14` in deps; **zero** app imports under `site/` | **MATCH** |
| 17 | gsap / `@gsap/react` used outside engine | `gsap` in `useScrollAnimation.ts`; **`@gsap/react` no imports** | **PARTIAL** |
| 18 | Flag/mapper unit suite exists | `furnitureFabricMapper.test.ts` (exact-1, near-miss, barrel) | **MATCH** (code only; **no** vitest evidence log) |
| 19 | Orbit unit suite exists | `orbitControlsDefault.test.tsx` | **MATCH** (code only; **no** evidence log) |
| 20 | `threeLazy` / `workspaceShell` tests exist | Present under open3d unit tree | **MATCH** |
| 21 | Fabric stage files keep / do not delete | All five + Feasibility + workspace present | **MATCH** |
| 22 | `_archive/fabric/` not live guest/canvas | Live routes use open3d host chain | **MATCH** |
| 23 | `featureFlags.ts` ≠ Fabric env reader | Separate product registry | **MATCH** |
| 24 | Phase DONE / CP PASS without files | Status table **DONE** 2026-07-09 + **PASS** | **STALE / FALSE-GREEN risk** |
| 25 | `Plans/trustdata/*` dead | Operational home: `Plans/phases/`, `Plans/Research/` | **MATCH** (phase card still cites trustdata in authority chain) |
| 26 | Brainstormer `Idiots/P02-engine-lock/REPORT.md` | Root `Idiots/` **missing**; live = `archive/Idiots/P02-engine-lock/REPORT.md` | **FAIL (plan path)** |
| 27 | Approach A binding in design | Design: **Owner pick (locked): A**; status APPROVED | **MATCH** |
| 28 | Product code default = none | Correct for lock confirmation | **SOUND** |
| 29 | Packages SHIP separate from engine lock | Expert `05-packages-stack.md` **FIX**; plan LICENSE-HYGIENE-NOTE | **SOUND** |
| 30 | Single worktree only | `git worktree list` → one entry at `D:/OandO07072026` | **MATCH** |

---

## Findings

### Blocking

#### B1 — Brainstormer path does not exist at cited location

- **Claim:** Plan inputs / Task 0 / run.json cite `Idiots/P02-engine-lock/REPORT.md` only (never Idiots2).  
- **Verified:** `Test-Path Idiots` = **False**. Live report: `D:\OandO07072026\archive\Idiots\P02-engine-lock\REPORT.md`. Root `Idiots2/` also missing (archive only).  
- **Judgment:** Intent (Idiots wave authority, not Idiots2) is correct. **Filesystem path is wrong.** Agents that `Read` the plan path will fail or recreate a phantom tree.  
- **Action:** On execute, treat authority as **`archive/Idiots/P02-engine-lock/REPORT.md`**. Do not invent root `Idiots/`. Do not import Idiots2 conclusions as authority.

#### B2 — CP-02 cannot be claimed PASS on this checkout

- **Claim (phase card):** Engine lock pack **DONE**; CP-02 **PASS** with full artifact set under `01-engine-lock/`.  
- **Verified:** No `results/` directory at all. No HEAD/run/ENGINE-LOCK-RECORD/vitest logs/OWNER-SIGNOFF. RESULTS-MAP requires at least NOTES under `01-engine-lock/`.  
- **Judgment:** Plan correctly forces re-prove from zero. Any skip to P03 product code because the phase table says DONE = **false green**.  
- **Action:** Execute plan Tasks 0–8; only then reassess CP-02. OWNER Template B (deferral) ≠ execution unlock for product gates.

---

### High

#### H1 — Phase orbit prose still wrong; plan correctly elevates helper

- **Claim (phase):** Workspace mounts Lazy3DViewer **without** overriding `enableControls` → default ON.  
- **Verified:** Workspace **explicitly** spreads `getOpen3dViewerControlProps()`; `orbitDefaults.ts` documents “defaults alone are not enough.”  
- **Judgment:** Plan ENGINE-LOCK-RECORD / ENTRYPOINT / Task 5b are correct. Re-implementing omit-only would **weaken** the lock.  
- **Action:** Evidence must cite helper + orbit unit tests. Do not change product mount to match stale phase prose.

#### H2 — open3d README host table incomplete (docs residual)

- **Claim (plan):** guest/canvas go through `Open3dPlannerWorkspaceRoute`.  
- **Verified:** `guest/page.tsx` and `canvas/page.tsx` import WorkspaceRoute. README still lists Host only and titles stack “production hybrid.”  
- **Judgment:** Plan rightly avoids mass README rewrite in P02. ENTRYPOINT-MAP must win over README.  
- **Action:** List residual language in ANTI-THRASH-AUDIT; no product thrash.

#### H3 — `@gsap/react` “used” overstated

- **Claim (plan Tech Stack / hygiene):** gsap / `@gsap/react` present; used outside engine vote.  
- **Verified:** `gsap` + ScrollTrigger in `site/lib/hooks/useScrollAnimation.ts`. **No** `@gsap/react` imports in `site/**/*.{ts,tsx,js,jsx}`. Both still in `package.json`.  
- **Judgment:** Hygiene note still valid. Do not treat unused `@gsap/react` as product need without owner.  
- **Action:** LICENSE-HYGIENE-NOTE: `gsap` **used**; `@gsap/react` **present, no import found** (candidate remove with owner).

#### H4 — Owner sign-off still open

- **Claim:** CP-02 needs OWNER-SIGNOFF marks or explicit written deferral.  
- **Verified:** Phase expert pass: owner sign-off open; ENGINE-DECISION research may still say PROPOSED; no OWNER file (results missing). Packages expert **FIX**.  
- **Judgment:** Plan Task 6 Template A vs B is correct. Deferral allows plan-only continue; **not** CP-02 green.  
- **Action:** Execute Task 6 honestly; if owner silent → DEFERRED language; do not check CP-02.6 green.

#### H5 — Unit lock tests exist but are unproven without evidence logs

- **Claim (done when):** Fabric flag + orbit vitest re-runs logged under `01-engine-lock/`.  
- **Verified:** Test files exist and appear comprehensive by source read. **No** `vitest-*-raw.log` / run.json on disk.  
- **Judgment:** “Tests exist in tree” ≠ “CP-02 re-proven.” Plan Task 5 / 5b is mandatory.  
- **Action:** Re-run with package-relative paths from `site/`; tee full logs; zero suppression.

---

### Medium

#### M1 — Residual “hybrid” labels are inventory, not permission to thrash

- **Claim:** After lock, residual hybrid language does not re-open engines.  
- **Verified:** `open3d/README.md` title “production hybrid”; `importGraphProof.ts` stack enum `open3d-hybrid` for guest/canvas/open3d. Guest/canvas page comments still say “open3d hybrid.”  
- **Judgment:** Historical multi-layer naming (Feasibility + Three + optional Fabric spike), not “add Konva.” Task 7 greps will light up — **expected**.  
- **Action:** Record paths; forbid “hybrid means re-platform” PRs.

#### M2 — `three-stdlib` present but unmentioned in pin list

- **Claim:** Package pin covers fabric/three/r3f/drei/model-viewer.  
- **Verified:** Also `"three-stdlib": "^2.36.1"`.  
- **Judgment:** Not a second engine. Optional PACKAGE-PIN footnote so agents do not “dedupe by deleting.”  
- **Action:** Optional one-line in Task 4; no install thrash.

#### M3 — Phase authority chain still lists `Plans/trustdata/`

- **Claim (plan):** trustdata dead; use Plans/phases + Research.  
- **Verified:** Phase file authority chain still mentions trustdata.  
- **Judgment:** Plan correctly rewires. Do not write evidence only into dead trees.  
- **Action:** Follow plan §1.3 authority map on execute.

#### M4 — Secondary unit `hostWiringP01.test.ts` also asserts flag wire

- **Claim:** Re-run mapper + orbit suites only.  
- **Verified:** `hostWiringP01.test.ts` checks workspace source for `isOpen3dFabricFurnitureEnabled` and default OFF.  
- **Judgment:** Extra confidence; not required for CP-02. Do not invent new tests unless 5/5b fail.  
- **Action:** Optional cite in FLAG-INVENTORY.

#### M5 — Commit cadence heavy but AGENTS-aligned

- **Claim:** Commit after each landable evidence slice.  
- **Judgment:** Acceptable for false-green-sensitive evidence pack. Batching meta is OK; skipping files is not.  
- **Action:** Prefer plan sequence; no force-push.

#### M6 — `@fancyapps/ui` zero-use confirmed

- **Claim:** Proprietary; likely unused.  
- **Verified:** Zero app imports.  
- **Judgment:** Supports hygiene FIX without engine re-vote.  
- **Action:** Owner remove or clear — agent must not purchase.

---

### Low

#### L1 — Plan length vs YAGNI

- Extensive templates fit an **evidence-only** phase where false-green is the main failure mode.  
- **Action:** Execute; do not expand into Fabric walls / select-delete / Playwright orbit.

#### L2 — Secondary Three surfaces (Planner3DViewer, site ThreeViewer)

- Still Three family; plan correctly marks non-votes.  
- **Action:** Do not merge into open3d workspace engine swap.

#### L3 — Guest/canvas page comments say “hybrid” + archive fabric fallback

- Residual wording; routes are open3d WorkspaceRoute.  
- **Action:** Anti-thrash inventory only.

#### L4 — Research ENGINE-DECISION may remain PROPOSED

- Plan correctly does not rewrite research status without owner.  
- **Action:** OWNER-SIGNOFF is agent authority for engines after marks; research patch optional later.

---

## Already exists (do not re-build)

### Product / engine stack

| Asset | Path | Role |
|-------|------|------|
| Fabric flag | `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` | exact `"1"` only |
| Fabric layer + mapper + CSS + barrel | `canvas-fabric-stage/*` | destination spike |
| FeasibilityCanvas | `canvas-feasibility/FeasibilityCanvas.tsx` | live interim 2D |
| Workspace host | `editor/OOPlannerWorkspace.tsx` | flag wire + orbit helper spread |
| Orbit defaults | `3d/orbitDefaults.ts` | constant + typed helper |
| Lazy / Inner 3D | `ThreeLazyViewer.tsx` · `ThreeViewerInner.tsx` | OrbitControls construct |
| Workspace route shell | `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx` | guest/canvas |
| Host / NativeHost | `Open3dPlannerHost.tsx` · `Open3dNativeHost.tsx` | chain |
| Archive fabric | `site/features/planner/_archive/fabric/` | not live |
| Admin model-viewer | `admin/svg-editor/ModelViewerPreview.tsx` | admin only |
| Secondary R3F | `site/features/planner/3d/Planner3DViewer.tsx` | not re-vote |

### Tests (re-run; do not invent coverage)

| File | Role |
|------|------|
| `site/tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts` | Flag + mapper authority |
| `site/tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx` | Orbit lock authority |
| `threeLazy.test.tsx` · `workspaceShell.test.tsx` · `hostWiringP01.test.ts` | Supporting; not CP substitutes |

### Authority / plan inputs (read, not re-author as product)

| Path | Role |
|------|------|
| `plans2/P02-engine-lock/IMPLEMENTATION-PLAN.md` | Execute plan under review |
| `Plans/phases/P02-engine-lock/*` | Phase card + experts (canvas SHIP / packages FIX) |
| `archive/Idiots/P02-engine-lock/REPORT.md` | Live Idiots brainstormer (path fix needed) |
| Design Approach A | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
| RESULTS-MAP | `Plans/Research/RESULTS-MAP.md` |

### Missing (must create on execute)

All of `results/planner/world-standard-wave/01-engine-lock/` checklist: HEAD, run.json, README, NOTES, ENGINE-LOCK-RECORD, FLAG-INVENTORY, ENTRYPOINT-MAP, PACKAGE-PIN, LICENSE-HYGIENE-NOTE, vitest fabric/orbit logs+json, OWNER-SIGNOFF, ANTI-THRASH-AUDIT, CP-02-SUMMARY.

---

## Residual / re-prove

| Item | Status | What re-proves it |
|------|--------|-------------------|
| CP-02 green | **Unproven** | Full `01-engine-lock/` pack on disk |
| Fabric flag contract | Code present; **log missing** | Task 5 vitest + raw log |
| Orbit ON + helper | Code present; **log missing** | Task 5b vitest + raw log |
| Package pins | Live package.json match | PACKAGE-PIN.md snapshot at execute time |
| Owner engine approval | Open | OWNER-SIGNOFF marks or DEFERRED |
| Packages commercial SHIP | **Not** claimed by engine lock | Fancyapps/GSAP owner hygiene (separate) |
| Host chains | Code verified this review | ENTRYPOINT-MAP.md for agents |
| Residual hybrid docs | Present | ANTI-THRASH-AUDIT list only |
| Fabric walls cutover | Out of scope | Later (not P02) |
| Select/delete / orbit Playwright | Out of scope | P03 / P04 |

---

## False-green traps

| Trap | Why it fails this checkout | Plan defense |
|------|----------------------------|--------------|
| Phase table DONE/PASS without `results/` | Entire tree missing | Re-prove law; Tasks 0–8 |
| Invent `02-engine-lock/` | Wrong RESULTS-MAP folder | Explicit ban |
| “Tests exist ⇒ CP green” | No vitest evidence logs | Task 5/5b mandatory logs |
| “Packages installed ⇒ product score 4” | O&O self-score honesty | CP-02-SUMMARY non-claim |
| Flag-ON dual-CAD as product | Spike only | FLAG-INVENTORY limits |
| Delete `canvas-fabric-stage/` as insurance | Destination kept under Approach A | Anti-thrash #5–6 |
| Disable orbit for CI | Lock is ON | Orbit unit + lock record |
| OWNER deferral = CP PASS | Plan Template B forbids | Task 6 language |
| Cite root `Idiots/` as if present | Path archived | **B1** — use archive path |
| Copy Idiots2 conclusions into this wave | Wrong source for idiotplanners2 | Plan “Idiots only” intent |
| Mass README rewrite mid-P02 | Scope creep | Plan: list only |
| Package upgrades in P02 | Out of scope | PACKAGE-PIN freeze |

---

## Score (1–10)

| Dimension | Score | Note |
|-----------|-------|------|
| Plan vs live engine code accuracy | **9** | Flag, hosts, pins, orbit helper all match |
| Evidence / CP honesty | **3** | Phase claims PASS; disk has zero pack — plan itself scores high for calling this out |
| Scope control (no cutover thrash) | **9** | Clear non-goals; default zero product code |
| Path / input integrity | **6** | Brainstormer path wrong (archive); otherwise solid |
| Execute readiness | **8** | Tasks 0–8 actionable after B1 path fix |
| **Overall plan quality for execute** | **8** | **APPROVE-WITH-FIXES** |

CP-02 **phase completion** on this checkout: **0/10 unproven** (results missing). That is not a plan-quality penalty — it is the work still required.

---

## Kill-order (if thrash starts)

1. **Do not** claim CP-02 PASS without `results/planner/world-standard-wave/01-engine-lock/` files.  
2. **Do not** Fabric full walls cutover / Konva experiment / package upgrades in P02.  
3. **Do not** re-implement flag, orbitDefaults, or host chains that already match the lock.  
4. **Do not** treat phase “omit enableControls” as truth — helper is authority.  
5. **Do not** enable Fabric flag for W product proofs (default OFF).  
6. **Do not** write evidence under `02-engine-lock/` or `site/results/`.  
7. **Do not** unlock P03 product code on OWNER deferral alone.  
8. **Do** re-run existing vitest contracts and preserve full raw logs.  
9. **Do** freeze D1–D14 + anti-thrash 1–13 in ENGINE-LOCK-RECORD.  
10. **Do** use `archive/Idiots/P02-engine-lock/REPORT.md` as Idiots authority until root path restored (if ever).

---

## Bottom line

**Verdict: APPROVE-WITH-FIXES.**

The idiotplanners2 P02 plan is the right shape: **confirm and evidence-lock** engines that are already in the repo; do not re-platform. Live stack matches Fabric dest / Feasibility interim / Three+orbit helper / no Konva. The phase card’s DONE/PASS is **not believable** on this checkout because **`results/` is missing** — re-prove is mandatory.

Execute after fixing authority path honesty (archive Idiots) and hygiene accuracy (`@gsap/react` unused). Do not expand scope. Do not greenwash CP-02.

### Top 3

1. **`results/` missing → CP-02 unproven** — re-run Tasks 0–8; phase DONE/PASS is false-green until pack exists.  
2. **Brainstormer path broken** — use `archive/Idiots/P02-engine-lock/REPORT.md`, not root `Idiots/...`.  
3. **Do not rebuild engines** — freeze helper+flag+hosts in evidence; re-run unit logs only; orbit prose in phase is stale.

---

**Report path:** `D:\OandO07072026\plans2/P02-engine-lock\CODE-REVIEW-REPORT.md`
