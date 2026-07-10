# World-Standard Planner — Master Executable Plan (P00–P11 residual)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.  
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer/review inputs → extensive plan, no length cap).

**Goal:** Re-prove W0–W8 / CP-01–CP-10 on a checkout where **`results/` is missing**, close residual honesty/product gaps from CODE-REVIEW reports, and exit via **P11** with an honest ship decision — without rewriting already-landed open3d product code.

**Architecture:** Approach **A** remains binding: FeasibilityCanvas interim 2D + document model authority; Fabric furniture stage is destination spike (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE === "1"` only, default OFF for all W proofs); Three.js + OrbitControls via Lazy3DViewer with **explicit** `getOpen3dViewerControlProps()`; hybrid/Konva banned; evidence only under repo-root `results/planner/world-standard-wave/`. This package is a **residual execute spine**, not a greenfield planner rewrite.

**Tech Stack:** Next.js (oando-site) · TypeScript strict · Vitest · Playwright · Canvas 2D Feasibility · optional Fabric 7.4.0 spike · Three + R3F/drei (viewer) · IndexedDB guest/member local · pnpm monorepo.

**Inputs consumed:**
- Repo read: 2026-07-10 · HEAD `cb62c4e` (re-check) · dirty: Plans/Others deleted; archive/Idiots*, idiotplanners2 untracked · **`results/` MISSING**
- Code reviews: `archive/PlansA/P01…P10-*/CODE-REVIEW-REPORT.md` (**primary residual authority**)
- Implementation plans: `archive/PlansA/P0X-*/IMPLEMENTATION-PLAN.md` (task detail when residual needs steps)
- Brainstormer: `archive/Idiots2/P0X-*/REPORT.md` (root Idiots2 absent)
- Phase map: `archive/Plans/INDEX.md`, `archive/Plans/Research/RESULTS-MAP.md`, `archive/Plans/phases/*`
- Conduct: `AGENTS.md`, `testing-handbook.md`, `START.md`

**Done when:**
1. Map-minimum artifacts exist for every RESULTS-MAP primary folder on **this HEAD**, **or** honest FAIL/WAIVE documented in P10/P11.
2. Residual product gaps from reviews closed (P06 help/UUID, P07 journey identity, P04 wiring/console, P08 smoke/G5 honesty, P09 aria, P03 unit gaps).
3. P11 SHIP-HONESTY = READY **or** explicit NOT READY with residual list — never paper READY.
4. `pnpm run check:layout` PASS; no false-green traps left uncalled.

**Evidence folder (wave root):** `results/planner/world-standard-wave/`  
**Package folder:** `plans1/` (orchestration) · phase docs: `archive/PlansA/`  
**Per-phase folders:** see RESULTS-MAP (folder numbers ≠ phase numbers).

---

## 1. Repo reality

### 1.1 Brutal workspace facts (synthesis-time; re-prove on execute)

| Check | Fact |
|-------|------|
| Checkout | `.` main · no worktrees required |
| `results/` | **MISSING** → all prior GATE/CP PASS unproven |
| Layout | `pnpm run check:layout` fails until `results/` exists |
| Root `Idiots2/` | **Absent** → use `archive/Idiots2/` |
| `Plans/trustdata/` | Live under `Plans/trustdata/`; phases/Research canonical in `archive/Plans/` |
| Planner product | Dense under `site/features/planner/open3d/` (~143+ files class) |
| Tests | Dense unit + e2e **sources**; logs not deposited under wave folders |
| Ethics | Firecrawl dead; `D:\websites` ideas only |

### 1.2 What code actually does (summary)

| Surface | Live truth |
|---------|------------|
| Guest/canvas | `Open3dPlannerWorkspaceRoute` → Host → OOPlannerWorkspace |
| Open3d pilot | Direct Host |
| 2D | FeasibilityCanvas; Fabric furniture OFF unless env `"1"` |
| Fabric routes | Permanent redirect to `/planner/open3d/` |
| Select/delete | Landed; keyboard Del/Bksp; pure `applySelectionDelete` |
| Orbit | Default ON + helper spread on Lazy3DViewer |
| Save | Local IDB flush spine; labels mostly local; help still overclaims |
| Symbols | cabinet-v0 multi-prim Block2D unit-green |
| Mesh | toe→carcass→door unit-green primary |
| Shortcuts | Map invert honest; aria-keyshortcuts partial hardcode |
| Journey e2e | Partial: guest/wall/chair-configurator — **not** CP-07 bar |

### 1.3 Contradictions (plan/card vs disk)

| Claim source | Lie / drift | Truth |
|--------------|-------------|-------|
| Phase cards PASS | Artifacts gone | Unproven |
| RESULTS-MAP “WAVE exists” | Files missing | Treat as process contradiction |
| Expert P05 “2 prims” | Stale | Multi-prim live |
| Expert P09 “D→dimension” | Stale | Map invert D→door, M→dimension |
| Phase P08 “no toe” | Stale | Toe in mesh |
| Phase P06 §0 pre-flush | Stale | Flush landed |
| Plan Idiots2 root path | Wrong | archive/ |
| importGraphProof fabric paths | Dead FS rows | Contradiction inventory |
| open3d README hybrid / host table | Incomplete | ENTRYPOINT evidence wins |

### 1.4 Missing evidence

Entire tree. Recreate on execute. Optional E: backup is **not** HEAD proof without re-verify.

---

## 2. Synthesis of CODE-REVIEW verdicts

| Phase | Verdict | Score (review) | Product rewrite? | Residual focus | Report |
|-------|---------|----------------|------------------|----------------|--------|
| **P01** | APPROVE-WITH-FIXES | 8/10 | No (inventory) | `00-product-truth/` pack; rg fallback; full self-check | `archive/PlansA/P01-product-truth/CODE-REVIEW-REPORT.md` |
| **P02** | APPROVE-WITH-FIXES | 8.5/10 | No (lock) | `01-engine-lock/` freeze pack + units; OWNER A/B | `…/P02-engine-lock/…` |
| **P03** | APPROVE-WITH-FIXES | 8/10 | No (Mode A) | Unit gaps + browser W3 + `03-select-delete/` | `…/P03-select-delete/…` |
| **P04** | APPROVE-WITH-FIXES | 7.5/10 | Harden only | Wiring unit + console e2e + `04-orbit-continuity/` | `…/P04-orbit-continuity/…` |
| **P05** | APPROVE re-prove | 8.5 plan / 1 evidence | No unless RED | Units re-log + prim-JSON + `05-symbols-svg/` | `…/P05-symbols-svg/…` |
| **P06** | FAIL / NOT GREEN | 3 CP readiness | **Yes residual** | Help, UUID e2e, labels/testids, projectRef, write tests | `…/P06-save-honesty/…` |
| **P07** | CONDITIONAL APPROVE | 7.5/10 | **E2E rewrite** | Journey CP-07 bar; identity B1/B2; Opening couple | `…/P07-draw-place-journey/…` |
| **P08** | CONDITIONAL mesh OK | 6.5 overall / 0 evidence | Smoke only | NOTES + smoke + G5 honesty + `08-mesh-quality/` | `…/P08-mesh-quality/…` |
| **P09** | APPROVE residual | 8.5 plan / 4 CP | Aria + tests | `canvasKeyShortcutsAttribute` + rail + `09-` pack | `…/P09-shortcuts-chrome/…` |
| **P10** | Mode A only | 86 Mode A / 0 Mode B | Pack only | FAIL-honest six files; Mode B blocked | `…/P10-evidence-handover/…` |

### 2.1 Bar synthesis (buyer-visible)

| Gate | Meaning | Done needs |
|------|---------|------------|
| W1 | Draw walls + opening | Browser Δ metrics (P07) |
| W2 | Place ≥2 incl cabinet-v0; Block2D readable | P07 place + P05 symbols |
| W3 | Select + Del + undo | P03 unit **+** browser |
| W4 | 2D↔3D pose + orbit ON | P04 unit pose + browser orbit |
| W5 | Save → hard reload → **same entity ids** | P06 UUID e2e |
| W6 | Local vs cloud labels honest | P06 labels + help |
| W7 | Toe/door/carcass readable mesh | P08 NOTES + visual |
| W8 | Tool labels match handlers | P09 map + aria residual |

---

## 3. Ethics / non-copy

- Research under `D:\websites` and historical Firecrawl scrapes = **JTBD/patterns only**.
- Do **not** paste competitor UI, assets, or copy into `site/`.
- Cleared paid table is owner domain (`ayushdocs` may live under Research/Others mapping) — agent never purchases.
- No plagiarism of competitor planners for “world-standard” screenshots as product UI.

---

## 4. File map (residual execute)

### 4.1 Evidence create (all phases)

```
results/planner/world-standard-wave/
  00-start/
  00-product-truth/
  01-engine-lock/
  02-browser-open3d-journey/
  03-select-delete/
  04-orbit-continuity/
  05-symbols-svg/
  06-save-honesty/save-reload/
  08-mesh-quality/
  09-shortcuts-chrome/
  10-handover/
  11-integration-closeout/
```

### 4.2 Product / test modify (residual only)

| Phase | Likely touch |
|-------|----------------|
| P03 | `site/tests/unit/.../applySelectionDelete.test.ts`, canvas/keyboard tests; e2e W3 |
| P04 | **Create** `workspaceOrbitWiring.test.ts`; harden `open3d-w4-orbit-continuity.spec.ts` |
| P05 | Optional `furnitureBlock2D.authority-honesty.test.ts`; no geometry unless RED |
| P06 | `helpSections.ts`, `workspaceStatusLabels.ts`, TopBar, autosave hook, persistence tests, e2e save-honesty |
| P07 | `open3d-world-standard-journey.spec.ts`, `plannerCanvasHelpers.ts`, package.json script |
| P08 | Smoke module + CLI if missing; G5 validation honesty; demo catalog description optional |
| P09 | `canvasTool.ts` or new helper for aria attr; `FeasibilityCanvas.tsx`; rail a11y + donorParity tests |
| P01–P02,P10 | Evidence markdown only (default) |

### 4.3 Do not touch (default)

- `_archive/fabric` product restore  
- Mass README rewrites  
- Konva add  
- Babylon from schema columns  
- Idiotplanners plan files  

---

## 5. Architecture & data flow (locked)

```
Buyer → /planner/guest|canvas|open3d
  → WorkspaceRoute / Host
  → OOPlannerWorkspace
       ├─ FeasibilityCanvas (2D authority, fabric furniture OFF)
       ├─ Inventory place → document furniture UUIDs
       ├─ Keyboard → useWorkspaceKeyboard → setTool / deleteSelection
       ├─ Lazy3DViewer + getOpen3dViewerControlProps() → OrbitControls
       └─ useOpen3dWorkspaceAutosave → createAutoSaver → IndexedDB
```

W proofs require Fabric flag **OFF**. Document rotation furniture = **degrees**; scene nodes = radians via adapter (do not reverse).

---

## 6. Kill order with source references

| # | Work | Evidence | Source review / plan |
|---|------|----------|----------------------|
| 0 | Session zero | `00-start/` | `plans1/00-START.md` |
| 1 | P01 product truth | `00-product-truth/` | `archive/PlansA/P01-…/CODE-REVIEW-REPORT.md` |
| 2 | P02 engine lock | `01-engine-lock/` | `archive/PlansA/P02-…/CODE-REVIEW-REPORT.md` |
| 3 | P03 W3 residual | `03-select-delete/` | `archive/PlansA/P03-…/CODE-REVIEW-REPORT.md` |
| 4 | P07 W1–W2 journey | `02-browser-open3d-journey/` | `archive/PlansA/P07-…/CODE-REVIEW-REPORT.md` |
| 5 | P06 W5–W6 residual | `06-save-honesty/` | `archive/PlansA/P06-…/CODE-REVIEW-REPORT.md` |
| 6 | P04 W4 residual | `04-orbit-continuity/` | `archive/PlansA/P04-…/CODE-REVIEW-REPORT.md` |
| 7 | P05 symbols re-prove | `05-symbols-svg/` | `archive/PlansA/P05-…/CODE-REVIEW-REPORT.md` |
| 8 | P08 mesh residual | `08-mesh-quality/` | `archive/PlansA/P08-…/CODE-REVIEW-REPORT.md` |
| 9 | P09 shortcuts residual | `09-shortcuts-chrome/` | `archive/PlansA/P09-…/CODE-REVIEW-REPORT.md` |
| 10 | P10 handover Mode A/B | `10-handover/` | `archive/PlansA/P10-…/CODE-REVIEW-REPORT.md` |
| 11 | P11 integration | `11-integration-closeout/` | `plans1/P11-CHECKLIST.md` |

Detail templates for long dumps remain in each IMPLEMENTATION-PLAN — **use only for residual steps**, not full rewrite.

---

## 7. Task list

### Task 00: Session zero / setup verification

**Maps to:** [00-START.md](./00-START.md)  
**Files:** Create evidence under `results/planner/world-standard-wave/00-start/` only.

- [ ] **Step 1:** Confirm single worktree

```powershell
cd .
git worktree list
```

Expected: one main checkout line; no extra worktrees for this work.

- [ ] **Step 2:** Record HEAD + dirty

```powershell
git log -1 --format="%H %s" | Set-Content results\planner\world-standard-wave\00-start\HEAD.txt
git status -sb | Set-Content results\planner\world-standard-wave\00-start\DIRTY.txt
```

(If `results` missing, create dirs first.)

- [ ] **Step 3:** Create wave root

```powershell
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\00-start" | Out-Null
```

- [ ] **Step 4:** Layout gate

```powershell
pnpm run check:layout
```

Expected: PASS once `results/` exists; FAIL documents missing `results/` if skipped Step 3.

- [ ] **Step 5:** Tooling preflight → `00-start/NOTES.md`

  - `Get-Command rg` → present or **Select-String fallback** policy  
  - Brainstormer path = `archive/Idiots2/`  
  - Fabric env unset  
  - Approach A binding  

- [ ] **Step 6:** Commit (main agent)

```powershell
git add results/planner/world-standard-wave/00-start plans1
git commit -m "docs(plans1): session zero evidence scaffold"
```

**Stop if:** multi-worktree; owner goal changed.

---

### Task group P01: Product truth re-prove (inventory only)

**Evidence:** `results/planner/world-standard-wave/00-product-truth/`  
**Review:** `archive/PlansA/P01-product-truth/CODE-REVIEW-REPORT.md`  
**Mode:** Inventory only — **no** open3d feature edits.

#### Task 01.00 — Scaffold pack

- [ ] Create folder; write `HEAD.txt`, `run.json` (`status: in-progress`), `authority-path-map.md` mapping:

| Dead path | Live path |
|-----------|-----------|
| `Idiots2/…` | `archive/Idiots2/…` |
| `Plans/trustdata/…` | `Plans/trustdata/` + `archive/Plans/phases/` + `archive/Plans/Research/` |
| `ayushdocs/…` | `archive/museum/Plans-Others/` (if present) |

#### Task 01.01 — Tree inventory

- [ ] List open3d tree file counts; key-files-exist checklist from review table (FeasibilityCanvas, OOPlannerWorkspace, orbitDefaults, fabric flag, newEntityId, hosts, redirects).
- [ ] Fail closed if any **required** production path False.

#### Task 01.02 — Routes / fabric / import graph

- [ ] Grep or Select-String: fabric redirects in `next.config.js` (`destination:.*planner/open3d`).
- [ ] Document dual host chains.
- [ ] Write `import-graph-stale-paths.tsv` for fabric-legacy graph rows whose FS path is missing.
- [ ] **Do not** “fix” importGraphProof in P01.

PowerShell fallback example (when `rg` missing):

```powershell
Get-ChildItem site\features\planner\open3d -Recurse -Include *.ts,*.tsx |
  Select-String -Pattern "deleteSelection|formatAutosaveStatus|OrbitControls" |
  ForEach-Object { "$($_.Path):$($_.LineNumber):$($_.Line.Trim())" } |
  Set-Content results\planner\world-standard-wave\00-product-truth\greps-w-sample.txt
```

#### Task 01.03 — CAPABILITY-MATRIX W1–W8

- [ ] Matrix columns: capability | code-present|partial|absent | unit-green|missing | browser-green|missing | path:line notes.
- [ ] Until smoke: **unit-missing**; until e2e pack: **browser-missing** even if code-present.
- [ ] Tighten W6 greps to `Saved locally|Draft saved locally|formatAutosaveStatus|Saving locally` (avoid bare `local`).

#### Task 01.04 — Claims register

- [ ] Concat claim sources from design + PENDING-style notes + phase cards.
- [ ] ≥13 rows including evidence-missing + import-graph stale.

#### Task 01.05 — Required vitest capability smoke

```powershell
cd site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/hostWiringP01.test.ts `
  tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx `
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts `
  tests/unit/features/planner/open3d/poseContinuityW4.test.ts `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\00-product-truth\vitest-capability-smoke-raw.log
```

- [ ] Update matrix **unit** tokens only from log (no silent skip).
- [ ] List e2e specs as sources only — **do not** claim browser-green.

#### Task 01.06 — Deep-read NOTES

- [ ] Path:line notes for Feasibility handle API, deleteSelection, formatAutosaveStatus.

#### Task 01.07 — Land INVENTORY + CONTRADICTIONS + README

**Required non-empty (fail-closed):**

- `INVENTORY.md`
- `CONTRADICTIONS.md`
- `PRODUCT-TRUTH.md` (or equivalent summary)
- `README.md`
- `run.json`
- `authority-path-map.md`
- `import-graph-stale-paths.tsv`
- `vitest-capability-smoke-raw.log`

- [ ] Self-check script includes **all** of the above (review H1).
- [ ] Status `ready-for-review` — **do not auto CP-01 pass**.

#### Task 01.08 — Owner/reviewer pass/fail

- [ ] Human sets pass only after pack review.

**Commit:** `docs(planner): P01 product-truth re-prove pack`

---

### Task group P02: Engine lock re-prove

**Evidence:** `01-engine-lock/`  
**Review:** `archive/PlansA/P02-engine-lock/CODE-REVIEW-REPORT.md`  
**Default product code:** none.

#### Task 02.00 — Scaffold

- [ ] Create `01-engine-lock/`; HEAD; run.json.
- [ ] **Never** create `02-engine-lock/` as P02 canonical.

#### Task 02.01 — ENGINE-LOCK-RECORD.md

Freeze with **live** truth:

- 2D interim = FeasibilityCanvas  
- Fabric destination = flag exact `"1"`  
- 3D = Three + Lazy3DViewer + OrbitControls  
- Orbit product authority = `getOpen3dViewerControlProps()` spread (not “omit prop”)  
- Konva absent  

#### Task 02.02 — FLAG-INVENTORY + ENTRYPOINT-MAP + PACKAGE-PIN

- [ ] Consumers of fabric flag; W-gate OFF rule.
- [ ] Entrypoints: open3d Host; guest/canvas WorkspaceRoute.
- [ ] Pin strings from `site/package.json` (fabric 7.4.0, three, r3f, drei, model-viewer; konva ABSENT; optional three-stdlib footnote).
- [ ] LICENSE note: fancyapps unused; **gsap used**; **@gsap/react no imports**.

#### Task 02.03 — Unit re-runs (raw logs)

```powershell
cd site
pnpm exec vitest run tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\01-engine-lock\vitest-fabric-flag-raw.log

pnpm exec vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\01-engine-lock\vitest-orbit-default-raw.log
```

- [ ] Length-check logs non-empty.
- [ ] Task 5c product restore **only** if real FAIL.

#### Task 02.04 — OWNER-SIGNOFF

- [ ] Template A (marks) **or** Template B (explicit DEFERRAL).
- [ ] Deferral ≠ unlock false W3 product celebration; evidence still required.

#### Task 02.05 — ANTI-THRASH-AUDIT + SUMMARY

- [ ] Greps residual hybrid language (README, importGraphProof) — inventory only.
- [ ] CP-02-SUMMARY non-claims: fabric unit ≠ full stage; orbit unit ≠ W4 browser.

**Commit:** `docs(planner): P02 engine-lock evidence freeze`

---

### Task group P03: W3 select/delete residual (Mode A)

**Evidence:** `03-select-delete/`  
**Review:** `archive/PlansA/P03-select-delete/CODE-REVIEW-REPORT.md`  
**Do not:** rewrite `applySelectionDelete` signature; dual-store migrate; Fabric ON proof.

#### Task 03.00 — Scaffold + baseline unit log

- [ ] Create evidence dir; baseline vitest of existing pick/delete/keyboard suites → raw log.

#### Task 03.01 — Unit gaps (TDD)

Extend existing tests (full cases described in IMPLEMENTATION-PLAN residual; execute from review list):

- [ ] Locked furniture skip → same project ref / no history push via `updateOpen3dProject`
- [ ] Multi-id delete then undo restores **ids + pose** through history helper (not hand-rolled past alone)
- [ ] Empty selection no-op
- [ ] Canvas select pointer → setSelection (Feasibility furniture path)
- [ ] Keyboard: Ctrl+Bksp does not delete; Del in input does not; optional omitted handler

**Files:**

- Modify: `site/tests/unit/features/planner/open3d/**/applySelectionDelete.test.ts` (path as on disk)
- Modify: `…/open3dWorkspaceKeyboard.test.tsx`
- Modify: `…/open3dFeasibilityCanvas.test.tsx` and/or canvasPicking tests
- Prefer live names over stale `deleteSelection.test.ts`

Run:

```powershell
cd site
pnpm exec vitest run <gap-test-files> --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\03-select-delete\vitest-w3-pack-raw.log
```

Expected: PASS; if RED on production behavior, fix minimal product — default expect GREEN without product edit (review M3).

#### Task 03.02 — Browser W3 hard gate

```powershell
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -ErrorAction SilentlyContinue
# Run open3d-w3-select-delete.spec.ts with evidence dir under 03-select-delete/
```

- [ ] Use `selectPlannerTool(page, "Select")` not fragile raw clicks only.
- [ ] Place **delta** before assert furniture ≥1.
- [ ] Assert delete Δ + undo restore (count min; document id residual if not instrumented).
- [ ] PNGs retained; raw log; `run.json`.
- [ ] **Unit alone = FAIL W3.**

#### Task 03.03 — W3-ACCEPTANCE.md + run.json

- [ ] Criteria table CP-03.x from data only.

**Commit:** `test(open3d): P03 W3 residual unit+browser evidence`

---

### Task group P07: W1–W2 journey rewrite

**Evidence:** `02-browser-open3d-journey/`  
**Review:** `archive/PlansA/P07-draw-place-journey/CODE-REVIEW-REPORT.md`  
**Mode:** Rewrite-in-place e2e + helpers — **not** Fabric cutover.

#### Task 07.00 — Scaffold evidence dir

- [ ] Create `02-browser-open3d-journey/`; NOTES with Approach A; Fabric OFF.

#### Task 07.01 — Helper `getFurnitureCount`

**Files:** Modify `site/tests/e2e/plannerCanvasHelpers.ts`

- [ ] Parse `.pw-status-bar` furniture count; prefer `0` on miss not `-1` if plan residual requires (align with honest polls).
- [ ] Optional `drawWallByTwoClicks` shared helper.

#### Task 07.02 — Rewrite `open3d-world-standard-journey.spec.ts`

**Hard requirements (review):**

| Requirement | Detail |
|-------------|--------|
| Entry | Prefer `/planner/open3d` then guest fallback; storage clear when guest |
| W1 wall | Metric **Δ** not absolute seed walls |
| W1 Opening | Objects **Δ**; label **Opening**; coords **bound to successful wall segment** |
| W2 | Place **cabinet-v0** via exact Add CTA used for place |
| W2 second | Real SKU id from **same button** used to place (not assumed string) |
| Ban | Configurator/chair as sole W2 success path — **delete** |
| Storyboard | Screenshots 01–07 CP names; non-blank PNG byteLength floor |
| Proof | Write `playwright-run.json` **after** asserts (exit 0 only if green) |
| Identity | **No** force `includesCabinetV0 = true`; no body-only “Modular Cabinet” as placed proof |

#### Task 07.03 — npm script

- [ ] Add `test:e2e:world-standard-w1w2` (or document alias to open3d-world runner) in `site/package.json`.

#### Task 07.04 — Re-prove

```powershell
pnpm --filter oando-site run test:e2e:world-standard-w1w2
# or documented equivalent
```

- [ ] Artifacts under `02-browser-open3d-journey/` only.
- [ ] NOTES: non-claims (not P03/P04/P05 quality/mesh).

**Commit:** `test(e2e): P07 W1-W2 journey rewrite + evidence`

**Stop if:** identity false-green paths reintroduced.

---

### Task group P06: W5–W6 residual honesty

**Evidence:** `06-save-honesty/` + `save-reload/`  
**Review:** `archive/PlansA/P06-save-honesty/CODE-REVIEW-REPORT.md`  
**Do not:** re-land flush/pagehide already present; mount fabric save indicator; cloud wire (cancel Task 07).

#### Task 06.00 — Scaffold + baseline

- [ ] Create folders; baseline vitest continuity + labels → log.

#### Task 06.01 — AutoSaver write-proof units

**Files:** `site/tests/unit/.../planner-autosave.test.ts` (and/or new hook test)

- [ ] Mock `saveProject`; assert schedule writes; flush writes pending; cancel; no silent drop.
- [ ] Delete dead double-gate empty `if` in `persistence.ts` if still present (clarity).

#### Task 06.02 — Single label helper contract

**Files:** `workspaceStatusLabels.ts` (+ tests)

- [ ] Introduce or complete `open3dSaveStatusLabel` (or extend `formatAutosaveStatus`) single table:
  - Forbidden bare “Saved” / cloud copy when `cloudEnabled=false`
  - Error: “Local save failed”
  - Idle: “Ready (local)” consistency across surfaces

#### Task 06.03 — projectRef flush hardening

**Files:** `useOpen3dWorkspaceAutosave.ts`

- [ ] `projectRef` always latest project for schedule/flush.
- [ ] Export `storage` / `cloudEnabled` / `isLocalSaved` as residual contract needs.

#### Task 06.04 — TopBar + workspace dual surface + testids

**Files:** `TopBar.tsx`, workspace status pill

- [ ] Both surfaces same helper.
- [ ] `data-testid="open3d-save-status"` (+ storage/status attrs as plan residual).
- [ ] Success toast after Save flush ack: local-qualified.

#### Task 06.05 — Help / FAQ honesty (buyer-visible lie)

**Files:** `site/features/planner/help/helpSections.ts` + unit

- [ ] Remove “members keep named save slots in their account” style overclaim while open3d autosave is IDB-only.
- [ ] Guest vs member copy honest (export/publish ≠ cloud autosave durability).
- [ ] Grep artifact under evidence: no forbidden phrases.

#### Task 06.06 — W5 E2E UUID equality

**Files:** `site/tests/e2e/open3d-save-honesty.spec.ts`

- [ ] After Save + hard reload, assert **wall + furniture UUIDs** equal (IDB snapshot parse or export envelope) — **not furniture count alone**.
- [ ] Screenshots + `06-browser-run.json` under `save-reload/`.
- [ ] Use reload-safe storage clear helpers.

#### Task 06.07 — Cancel cloud wire

- [ ] NOTES: `cloudEnabled=false`; Task 07 cancelled unless owner unlocks.

**Commit sequence (example):**  
`fix(open3d): P06 label/help honesty` → `fix(open3d): projectRef flush` → `test(e2e): W5 UUID save-reload`

---

### Task group P04: W4 orbit residual

**Evidence:** `04-orbit-continuity/`  
**Review:** `archive/PlansA/P04-orbit-continuity/CODE-REVIEW-REPORT.md`

#### Task 04.00 — Scaffold + THREE-LAYER-AUDIT.md

| Layer | Meaning | Status target |
|-------|---------|---------------|
| 1 | Defaults ON | Closed in product |
| 2 | Workspace spreads helper | Closed product; **add unit** |
| 3 | Unit + browser + evidence | Open until pack |

#### Task 04.01 — Add `workspaceOrbitWiring.test.ts`

**Create:** `site/tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts`  
(path under open3d unit tree as fits)

- [ ] Read workspace source via `path.join(process.cwd(), "features/planner/open3d/editor/OOPlannerWorkspace.tsx")` (prefer cwd=site).
- [ ] Assert source contains `getOpen3dViewerControlProps` and does not set product `enableControls={false}` on Lazy3DViewer mount.
- [ ] Run → raw log under `04-orbit-continuity/`.

#### Task 04.02 — Pose unit honesty

- [ ] Either extend `poseContinuityW4` wall matrix **or** document C5 ownership in `documentViewContinuity` inside THREE-LAYER-AUDIT (no thrash replace).

#### Task 04.03 — Harden Playwright console contract

**Modify:** `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts`

- [ ] Write `console-messages.txt`.
- [ ] `expect(hardAppErrors).toEqual([])` **or** explicit NOTES deferral — never silent soft-green.
- [ ] Keep anti-J4 grammar (radiogroup 2D|3D, planner-3d-canvas, data-orbit-enabled).
- [ ] Document: browser proves count + orbit attr; **pose ids/mm/rotation are unit-layer**.

#### Task 04.04 — Re-run browser pack

- [ ] PNGs + browser-run.json real green status.

**Commit:** `test(open3d): P04 W4 wiring unit + orbit evidence`

---

### Task group P05: Symbols re-prove only

**Evidence:** `05-symbols-svg/`  
**Review:** `archive/PlansA/P05-symbols-svg/CODE-REVIEW-REPORT.md`  
**Hard:** Do **not** rewrite `modularCabinetBlock` unless units RED. Do not re-apply storage fill.

#### Task 05.00 — Scaffold

#### Task 05.01 — Unit re-prove

```powershell
cd site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\05-symbols-svg\01-unit-reprove\vitest-raw.log
```

Expected: **22/22 PASS** (13+9) unless regression.

#### Task 05.02 — SVG honesty NOTES

- [ ] Canvas Block2D ≠ publish `/svg-catalog` authority.
- [ ] Optional smoke: honesty only; do not claim pipeline green without exit 0.

#### Task 05.03 — prim-JSON dumps

- [ ] pair / slab / none doorStyle dumps under `05-visual/`.

#### Task 05.04 — Optional authority static test

- [ ] Feasibility source must not load `/svg-catalog` for paint (if landing Task 06).

#### Task 05.05 — CP-05.json + SUMMARY

- [ ] Split `symbolQuality` vs `svgHonestySmoke`.
- [ ] Non-claims: not full W2 without P07; not mesh P08.

**Commit:** `docs(planner): P05 symbols re-prove evidence`

---

### Task group P08: Mesh quality residual

**Evidence:** `08-mesh-quality/`  
**Review:** `archive/PlansA/P08-mesh-quality/CODE-REVIEW-REPORT.md`  
**Hard:** Skip geometry Task 03 if formulas/toe present. No designer GLB. No photoreal thrash.

#### Task 08.00 — Scaffold + toe re-proof grep

- [ ] Confirm `toe` / constants in `modularCabinetV0.ts` (already present).

#### Task 08.01 — NOTES.md bar

- [ ] Numbers: TOE 100/50, door 18; matrix 2/3/4; fail modes; residual (handles, G8, door Z depth).

#### Task 08.02 — Unit re-runs

```powershell
# primary 19 tests expected green
# blast place green; meshStages may FAIL nodeCount — fix honesty
```

- [ ] Capture raw logs under evidence.
- [ ] **H1 fix:** node env for export validation test **or** assert bytes/plan without hybrid `valid:true` + `nodeCount:0`.

#### Task 08.03 — SKIP geometry rewrite

- [ ] Record skip in closeout unless formulas drift.

#### Task 08.04 — Headless visual smoke

- [ ] Implement planned smoke **without inventing door color** not in runtime mesh (same hex or silhouette grading).
- [ ] PNGs + `visual-smoke.md` under `08-mesh-quality/`.

#### Task 08.05 — run.json + CP-08 table

- [ ] Path-prove only under `08-mesh-quality/` (never `07-mesh` / `09-mesh`).

**Optional docs:** demo catalog description mentions toe; stages note honesty.

**Commit:** `test(open3d): P08 mesh evidence + smoke honesty`

---

### Task group P09: Shortcuts residual

**Evidence:** `09-shortcuts-chrome/`  
**Review:** `archive/PlansA/P09-shortcuts-chrome/CODE-REVIEW-REPORT.md`  
**Hard:** Skip invert rewrite if baseline GREEN. Never Dimension→D. Never folder `08-shortcuts-chrome/`.

#### Task 09.00 — Scaffold + baseline vitest

```powershell
cd site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx `
  tests/unit/features/planner/open3d/donorParity.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\09-shortcuts-chrome\baseline-vitest-raw.log
```

Expected: **22/22 PASS**.

#### Task 09.01 — Skip Task 02 product invert

- [ ] NOTES: skip; matrix green.

#### Task 09.02 — `canvasKeyShortcutsAttribute` (required for W8 PASS)

**Files:**

- Create helper (e.g. in `canvasTool.ts` or adjacent): builds space-separated list from map letters + documented workspace chords.
- Modify `FeasibilityCanvas.tsx` hard-coded `aria-keyshortcuts` → helper.
- Unit tests for attribute completeness (includes R O M P N; D maps door not dimension).

Example contract (adjust to live map):

```typescript
// Conceptual — implement to match CANVAS_TOOL_SHORTCUTS values
export function canvasKeyShortcutsAttribute(options?: {
  includeCanvasZoom?: boolean;
}): string {
  const letters = Object.values(/* CANVAS_TOOL_SHORTCUTS */).join(" ");
  const workspace = "Tab Escape Control+Z Control+Shift+Z Control+Y Control+K";
  const zoom = options?.includeCanvasZoom === false ? "" : "0 + -";
  return [letters, workspace, zoom].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}
```

- [ ] NOTES: when `delegateKeyboard=true`, zoom may be listed as ownership documentation (review M2).

#### Task 09.03 — Rail a11y extensions

- [ ] Assert Dimension **(M)**, Wall **(W)**; anti Dimension **(D)** forbidden on Dimension control.

#### Task 09.04 — Palette donorParity harden

- [ ] Call `buildPaletteCommands()` zero-arg; full tool-* vs map loop for subset keys.

#### Task 09.05 — Hide-tools inventory

- [ ] CSS/shell scan → likely `chrome-hide-tools: none` in NOTES.

#### Task 09.06 — Final pack

- [ ] Unfiltered logs + `run.json` + CP-09.1–09.6 from data.

**Commit:** `fix(open3d): P09 aria-keyshortcuts + W8 evidence`

---

### Task group P10: Evidence handover

**Evidence:** `10-handover/`  
**Review:** `archive/PlansA/P10-evidence-handover/CODE-REVIEW-REPORT.md`

#### Task 10.00 — Mode selection

| Mode | When |
|------|------|
| **A (default)** | Any primary folder missing map-min → FAIL-honest pack |
| **B** | All primaries map-min green on HEAD + optional CHECKPOINTS/MASTER restored honestly |
| **Pack-B recover** | Optional from E:/git with **remap** + re-verify every folder |

#### Task 10.01 — Six-file pack schema

Required:

1. `README.md`  
2. `W-GATES.md` — Status from **disk only**; no “PASS not re-run on HEAD” theater  
3. `MASTER-SYNC.md` — honest if MASTER file missing  
4. `HEAD.txt`  
5. `FAILURES-SNIP.md` — do not re-certify dead Failures paths as live  
6. `BACKUP-LOG.md` — E: path shape honesty  

#### Task 10.02 — Probe all folders

- [ ] Script or checklist: exists + map-min non-empty.
- [ ] Empty mkdir ≠ ready.

#### Task 10.03 — Mode A content

- [ ] W-GATES rows FAIL or MISSING until residual DONE.
- [ ] Do **not** mark CP-10 PASS in Mode A.

#### Task 10.04 — If Mode B later

- [ ] Only after P01–P09 residual DONE and P11 inputs ready; still re-run rule: historical packs need HEAD re-prove notes.

**Commit:** `docs(planner): P10 handover pack Mode A honesty`

---

### Task group P11: Integration close-out

**Execute:** [P11-CHECKLIST.md](./P11-CHECKLIST.md) entirely.  
**Evidence:** `11-integration-closeout/` + consistency with W folders.

- [ ] Complete all P11.0–P11.9 checkboxes.
- [ ] SHIP-HONESTY READY or NOT READY.

---

## 8. Test matrix

| Area | Unit | Browser | Command pattern | Expected |
|------|------|---------|-----------------|----------|
| P01 smoke | hostWiring, orbit, delete, pose, shortcuts | — | vitest tee → `00-product-truth/` | PASS logs |
| P02 fabric flag | furnitureFabricMapper | — | vitest tee → `01-engine-lock/` | PASS |
| P02 orbit | orbitControlsDefault | — | vitest | PASS |
| P03 W3 | pick, delete, keyboard, canvas select gaps | open3d-w3-select-delete | vitest + playwright | Both green for CP-03 |
| P07 W1–W2 | — | journey rewrite | playwright serial | Δ wall, opening, cabinet-v0, 2nd SKU |
| P06 write | autosave mocks | — | vitest | writes proven |
| P06 labels | status label forbidden list | — | vitest | no bare cloud |
| P06 W5 | saveReloadContinuity | save-honesty UUID | vitest + playwright | UUID match |
| P04 wiring | workspaceOrbitWiring | — | vitest | source lock |
| P04 W4 | orbit + pose | open3d-w4 | both | console hard or deferred |
| P05 symbols | cabinet-v0 + render | optional PNG | vitest 22 | PASS |
| P08 mesh | modularCabinetV0 + export | smoke PNG | vitest + smoke | primary green; G5 honest |
| P09 W8 | 4 suites + aria | optional | vitest | 22 + new aria green |
| P11 | open3d unit spine | buyer journey | vitest + e2e + layout | SHIP decision |

**Evidence layout for test dumps:** prefer phase wave folders; general vitest may also use `results/tests/` per handbook — **W claims** need wave folders.

---

## 9. False-green catalog (aggregated)

| ID | Trap | Blocks | Mitigation in this plan |
|----|------|--------|-------------------------|
| FG01 | Phase card PASS without `results/` | All CP | Re-prove mandatory |
| FG02 | PENDING / goals W PASS notes | All | Ignore for PASS |
| FG03 | Unit green = browser green | W3,W4,W5,W7,W8 | Dual hard gates |
| FG04 | E2e **spec exists** = pass | All browser | Artifacts required |
| FG05 | hostWiring green = fabric routes live | P01 | stale-paths tsv |
| FG06 | Empty `rg` greps | P01 matrix | Select-String / fail-closed |
| FG07 | Self-check incomplete pack | P01 | Full required set |
| FG08 | Folder `02-engine-lock` for P02 | P02 | Ban; use `01-` |
| FG09 | OWNER DEFERRAL = W3 unlock | P02/P03 | Explicit |
| FG10 | Journey folder as W3 | P03 | Ban |
| FG11 | Count-only delete undo | P03 | Unit id/pose; document browser residual |
| FG12 | Soft console W4 | P04 | Hard assert or NOTES |
| FG13 | Defaults alone = orbit product | P04 | Wiring unit |
| FG14 | Browser count = pose ids | P04 | Document layers |
| FG15 | Storage fill restore thrash | P05 | RED-only geometry |
| FG16 | Unit symbols = full W2 | P05 | Need P07 place |
| FG17 | Count-only save reload | P06 | UUID e2e |
| FG18 | Help account slots lie | P06 | Rewrite + grep |
| FG19 | Gate wiring = gate pass | P06 | Evidence folder |
| FG20 | Body “Modular Cabinet” = placed | P07 | Place CTA identity |
| FG21 | Assumed secondCatalogId | P07 | Observe from button |
| FG22 | Configurator as W2 | P07 | Delete path |
| FG23 | Absolute seed walls | P07 | Deltas |
| FG24 | Units = W7 | P08 | NOTES + visual |
| FG25 | Smoke door recolor ≠ mesh | P08 | Align colors |
| FG26 | G5 valid:true nodeCount 0 | P08 | Honest validation |
| FG27 | Map invert green = W8 PASS | P09 | aria residual + evidence |
| FG28 | Thin W8 PASS notes | P09 | `09-` pack |
| FG29 | `08-shortcuts-chrome` folder | P09 | Ban |
| FG30 | Historical W-GATES PASS | P10 | Disk-only status |
| FG31 | E: restore without re-verify | P10 | Remap + re-prove |
| FG32 | Empty mkdir theater | P10/P11 | Map-min non-empty |
| FG33 | Research scores = W | All | Ethics + FG |
| FG34 | site/results dumps | All | layout check |
| FG35 | Silent vitest skip | All | testing-handbook |

---

## 10. Stop-if-fail / CP criteria

| Event | Action |
|-------|--------|
| Layout red with site dumps | Fix dumps first |
| P01 greps empty tool fail | Stop matrix; fix tooling |
| P02 units fail real regression | 5c minimal restore only; re-prove |
| P03 browser red | Debug with PNGs kept; no paper PASS |
| P07 identity uncertain | Fail closed; fix B1/B2 |
| P06 count-only “green” | Reject; require UUID |
| P08 smoke prettier than mesh | Reject |
| P09 Dimension→D temptation | Reject |
| Any PASS with missing folder | Reject |
| Goal change | Stop for owner |

**CP green floor:** RESULTS-MAP map-minimum **and** phase residual from this plan.

---

## 11. Commit sequence (suggested)

1. `docs(plans1): master executable package` (package itself)  
2. `docs(planner): session zero + results root`  
3. `docs(planner): P01 product-truth re-prove`  
4. `docs(planner): P02 engine-lock freeze`  
5. `test(open3d): P03 W3 residual`  
6. `test(e2e): P07 W1-W2 journey`  
7. `fix(open3d): P06 save honesty residual` (+ tests)  
8. `test(open3d): P04 W4 residual`  
9. `docs(planner): P05 symbols re-prove`  
10. `test(open3d): P08 mesh evidence/smoke`  
11. `fix(open3d): P09 aria + W8 evidence`  
12. `docs(planner): P10 handover Mode A`  
13. `docs(planner): P11 integration closeout`  

Push origin when landable; mayoite ~45m. Never force-push.

---

## 12. Risks & owner decisions

| Risk | Severity | Mitigation |
|------|----------|------------|
| Executor rewrites green geometry/engines | High | This plan residual-only; reviews cite |
| Stale phase cards read first | High | “Repo + CODE-REVIEW win” banner |
| Browser flake walls/openings | Med | Retries; bind Opening to wall; screenshots |
| Happy-dom G5 lies | Med | P08 H1 |
| Missing Playwright env/browsers | Med | START.md install; honest deferral |
| E: path confusion | Med | Remap NOTES |
| Dirty tree / Plans moves | Low | DIRTY honesty |
| Owner silence on P02 signoff | Med | Template B |

| Owner decision | Default |
|----------------|---------|
| Cloud autosave | Off / cancel |
| P02 Template A/B | B ok for planning; A preferred before marketing freeze |
| Pack-B recover vs rebuild | Prefer rebuild via residual kill order |
| Ship READY with residual mesh beauty | READY only if manufacturer bar met; beauty residual OK |

---

## 13. Self-review (plan vs skill)

| Check | Status |
|-------|--------|
| Repo read first | Yes §1 |
| Reviews second | Yes §2 |
| Residual over rewrite paste | Yes Tasks |
| Archive Idiots2 path | Yes cross-cutting |
| results missing → re-prove | Yes |
| Checkbox tasks | Yes |
| Full product code dumps for green paths | **Intentionally omitted** (YAGNI; detail in idiotplanners if RED recovery needed) |
| Residual code sketches | P09 aria + pointers; P06/P07/P03 as step contracts |
| False-green catalog | §9 aggregated |
| P11 present | Task group + P11-CHECKLIST |
| Placeholder scan | No TBD |
| Length honesty | Extensive residual; not re-paste of 10 full plans |

**Brainstormer coverage:** Intent/bar from archive Idiots2 absorbed via reviews (Approach A, false-green, raised bar). Path corrected.

**Repo coverage:** Open3d anchors, RESULTS-MAP folders, test paths listed in REFERENCES.

---

## 14. Appendices

### A. Canonical folder ↔ phase (quick)

See [REFERENCES.md](./REFERENCES.md) and RESULTS-MAP.

### B. Forbidden actions (one screen)

- Worktrees  
- site/results  
- Fabric ON for W proofs  
- Konva hybrid  
- Paper PASS  
- Dimension→D  
- Cloud theater  
- Competitor copy  
- Force-push  

### C. Execution handoff

**Plan complete — phase docs canonical under `archive/PlansA/`; orchestration under `plans1/`.**

**1. Subagent-Driven (recommended)** — one phase residual group per subagent; never two writers on same package; brief starts with `/using-superpowers`.

**2. Inline Execution** — single agent walks Task 00 → P11.

Start at [00-START.md](./00-START.md). Track [CHECKLIST-MASTER.md](./CHECKLIST-MASTER.md). Justify deltas via [CHANGES-JUSTIFICATION.md](./CHANGES-JUSTIFICATION.md).
