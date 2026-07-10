# World-Standard Planner Residual Wave — Master Executable Plan (plans2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → plan/review inputs → extensive plan, no length cap).
>
> **Every subagent brief starts with:** `/using-superpowers` + fit skills for the active phase.
>
> **Checkout:** `D:\OandO07072026` only · **no worktrees** · **no product code under wrong phase labels**.

**Goal:** Re-prove and residual-close the open3d world-standard wave (W0–W8 + CP-01–CP-10) against live code after evidence wipe, then pass **P11** integration honesty — without greenfield thrash of already-landed product.

**Architecture:** Approach **A** locked. One document model (UUID entities, mm; furniture rotation **degrees**). Live interactive 2D = **FeasibilityCanvas**. Destination 2D = **Fabric.js v7** full stage (flag default OFF). 3D = **Three.js** imperative path with **OrbitControls ON** via defaults + `getOpen3dViewerControlProps()`. Persistence = local IndexedDB autosave with honest local labels (cloud optional / default cancel). Evidence file-of-record only under repo-root `results/planner/world-standard-wave/`. **GATE ≠ product ship.**

**Tech Stack:** pnpm monorepo · Next.js `oando-site` · TypeScript · Vitest · Playwright · Three.js · Fabric `7.4.0` · Canvas 2D · PowerShell evidence capture · no new paid deps in residual wave.

**Inputs consumed:**
- **Repo read:** 2026-07-10 — workspace `D:\OandO07072026` — HEAD `cb62c4eb5fff3a0c3e1ea099809b4e7d77d74ecc` (dirty tree possible; **re-read at execute**)
- **Plan source (sole):** `D:\OandO07072026\plans2/` — all P01–P10 `IMPLEMENTATION-PLAN.md` + README
- **CODE-REVIEW-REPORT.md under idiotplanners2:** **NONE** — plan from plans + live repo only
- **Not used as authority:** missing `idiotplanners1/`; sibling `plans1/` (Idiots2 / plans1 lane)
- **Program maps:** `Plans/INDEX.md`, `Plans/README.md`, `Plans/Research/RESULTS-MAP.md`, `Plans/phases/*`
- **Design:** `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`
- **Brainstormers (optional intent):** `archive/Idiots/P0X-*/REPORT.md` (root `Idiots/` may be absent)
- **Constitution:** `AGENTS.md`, `testing-handbook.md`, `START.md`

**Done when:**
1. Kill-order residuals P01–P10 executed as **re-prove + residual** (not rewrite theater).
2. Map-minimum (and phase extras) exist under live `results/planner/world-standard-wave/*` for each claimed green gate — or honest FAIL/OPEN/WAIVE.
3. Real product residuals closed: especially **P06** honesty/id W5, **P07** journey bar rewrite, **P03** browser+unit gaps, **P09** aria residual.
4. **P11** close-out pack lands with dual language and crosswalk.
5. No competitor copy; no worktrees; no paper PASS.

**Evidence folder (wave root):** `results/planner/world-standard-wave/`  
**Create on execute; re-prove if missing** — at package write **entire `results/` was MISSING**.

**Deep plans:** Do not paste 15k lines of per-phase TDD here. When a task needs full code, open the cited `plans2/P0X-…/IMPLEMENTATION-PLAN.md` and execute those steps. This master plan is the **operator spine + residual synthesis + cross-cutting law**.

---

## 1. Repo reality (live 2026-07-10)

### 1.1 Critical disk truth

| Path | Status | Impact |
|------|--------|--------|
| `results/` | **MISSING** | All historical CP PASS unproven |
| `idiotplanners1/` | **MISSING** | Source → `plans2/` |
| `plans2/` | Present — plans only (no code reviews) | Sole residual plan source |
| `plans1/` | Present — plans + CODE-REVIEW-REPORT | **Not** plans2 authority |
| `Plans/trustdata/` | Removed | Use `Plans/phases` + `Plans/Research` |
| `ayushdocs/` | Often missing | Use `Plans/Research/Others/*` |
| open3d product tree | **Present** and large | Residual-first |
| open3d unit tests | ~91 files | Re-run for evidence, not invent |
| E2E world specs | Present | Harden / re-run |
| `E:\OandO-backups\trustdata-2026-07-10\` | Cited by P10 (verify mount) | Optional restore; not live green |

### 1.2 Production spine (what exists)

```
site/app/planner/(workspace)/guest|canvas  → Open3dPlannerWorkspaceRoute → Host → Native → OOPlannerWorkspace
site/app/planner/open3d                    → Open3dPlannerHost → Native → OOPlannerWorkspace
site/features/planner/open3d/
  canvas-feasibility/FeasibilityCanvas     ← live 2D
  canvas-fabric-stage/                     ← dest spike (flag OFF)
  editor/*                                 ← workspace, keyboard, tools, status
  3d/*                                     ← Lazy3DViewer, OrbitControls, scene nodes
  catalog/*                                ← place, Block2D, modular cabinet
  persistence/*                            ← IDB autosave
  model/*                                  ← project types, units (degrees)
```

**Archive:** `site/features/planner/_archive/fabric/` — not live default.  
**Redirects:** `/planner/fabric` → `/planner/open3d` (next.config) — fabric “fallback routes” claims are stale.

### 1.3 Package pins (re-confirm at execute)

| Package | Live string (package write) |
|---------|------------------------------|
| `fabric` | `7.4.0` exact |
| `three` | `^0.185.1` |
| `@react-three/fiber` | `^9.6.1` |
| `@react-three/drei` | `^10.7.7` |
| `konva` | **absent** |

### 1.4 Contradictions (seed — inventory must expand)

| ID | Claim | Live | Action |
|----|-------|------|--------|
| X01 | Phase DONE / CP PASS | `results/` missing | Re-prove |
| X02 | trustdata paths | Tree cleaned | Path correct to Plans/* |
| X03 | Fabric fallback works | Permanent redirect | Inventory + do not use for W |
| X04 | Design “no select/delete” | Code has pick+delete | Buyer-visible re-prove P03 |
| X05 | Orbit omit-only | Workspace spreads helper | Document helper |
| X06 | Expert empty-box / no toe | Multi-prim + toe present | Evidence-first P05/P08 |
| X07 | Journey proves W1–W2 | Spec partial / configurator | Rewrite P07 |
| X08 | Help account saves | IDB-only open3d | P06 residual |
| X09 | aria-keyshortcuts map | Stale hard-code on Feasibility | P09 residual |
| X10 | Scoreboard PASS | No map files | Paper green ban |

### 1.5 Repo-first checklist (package writer completed)

- [x] Real open3d / test paths listed
- [x] Missing evidence noted
- [x] HEAD recorded with dirty honesty
- [x] idiotplanners2 all ten plans read (headers + residual sections + task maps)
- [x] CODE-REVIEW absence noted
- [x] Task list written only after Phase 1+2

---

## 2. Synthesis table — all 10 phase plans (+ reviews)

| Phase | Gate | Evidence folder | Code posture (idiotplanners2) | Residual class | Code review in idiotplanners2? | Deep plan |
|-------|------|-----------------|-------------------------------|----------------|--------------------------------|-----------|
| P01 | Baseline | `00-product-truth/` | Inventory only; no feature edits | Full pack recreate | **No** | [IMPLEMENTATION-PLAN](../plans2/P01-product-truth/IMPLEMENTATION-PLAN.md) |
| P02 | Engine | `01-engine-lock/` | Zero product impl default | Full pack recreate + unit re-run | **No** | [IMPLEMENTATION-PLAN](../plans2/P02-engine-lock/IMPLEMENTATION-PLAN.md) |
| P03 | **W3** | `03-select-delete/` | Code mostly landed; Mode A | Unit gaps + **browser mandatory** + evidence | **No** | [IMPLEMENTATION-PLAN](../plans2/P03-select-delete/IMPLEMENTATION-PLAN.md) |
| P04 | **W4** | `04-orbit-continuity/` | Three-layer + degrees landed | Verify + evidence + optional harden | **No** | [IMPLEMENTATION-PLAN](../plans2/P04-orbit-continuity/IMPLEMENTATION-PLAN.md) |
| P05 | **W2** symbols | `05-symbols-svg/` | Multi-prim shipped | Re-prove + honesty NOTES + visual | **No** | [IMPLEMENTATION-PLAN](../plans2/P05-symbols-svg/IMPLEMENTATION-PLAN.md) |
| P06 | **W5–W6** | `06-save-honesty/` | Flush skeleton landed | **Real product residual** (help, testids, projectRef, id W5) | **No** | [IMPLEMENTATION-PLAN](../plans2/P06-save-honesty/IMPLEMENTATION-PLAN.md) |
| P07 | **W1–W2** place | `02-browser-open3d-journey/` | Spec partial | **Rewrite journey bar** + helper | **No** | [IMPLEMENTATION-PLAN](../plans2/P07-draw-place-journey/IMPLEMENTATION-PLAN.md) |
| P08 | **W7** | `08-mesh-quality/` | Toe mesh landed | Evidence-first NOTES + smoke + logs | **No** | [IMPLEMENTATION-PLAN](../plans2/P08-mesh-quality/IMPLEMENTATION-PLAN.md) |
| P09 | **W8** | `09-shortcuts-chrome/` | Map invert landed | aria residual + evidence + rail asserts | **No** | [IMPLEMENTATION-PLAN](../plans2/P09-shortcuts-chrome/IMPLEMENTATION-PLAN.md) |
| P10 | Pack | `10-handover/` | Pack-only; no site features | Mode A default if results missing | **No** | [IMPLEMENTATION-PLAN](../plans2/P10-evidence-handover/IMPLEMENTATION-PLAN.md) |
| **P11** | Close-out | `11-world-standard-closeout/` | **plans2 only** | Integration crosswalk | N/A | [P11-CHECKLIST](./P11-CHECKLIST.md) |

---

## 3. Kill order (with references)

```
P00  plans2/00-START.md
P01  plans2/P01-product-truth/IMPLEMENTATION-PLAN.md
P02  plans2/P02-engine-lock/IMPLEMENTATION-PLAN.md
P03  plans2/P03-select-delete/IMPLEMENTATION-PLAN.md
P07  plans2/P07-draw-place-journey/IMPLEMENTATION-PLAN.md
P06  plans2/P06-save-honesty/IMPLEMENTATION-PLAN.md
P04  plans2/P04-orbit-continuity/IMPLEMENTATION-PLAN.md
P05  plans2/P05-symbols-svg/IMPLEMENTATION-PLAN.md
P08  plans2/P08-mesh-quality/IMPLEMENTATION-PLAN.md
P09  plans2/P09-shortcuts-chrome/IMPLEMENTATION-PLAN.md
P10  plans2/P10-evidence-handover/IMPLEMENTATION-PLAN.md
P11  plans2/P11-CHECKLIST.md
```

**Why this order (not phase-number order):** Serial spine from `Plans/INDEX.md` — engine before product gates; **W3** before journey thrash; **W1–W2 browser** before save; fill orbit/symbols/mesh/shortcuts; pack; integration.

**One phase at a time.** Inside a phase, follow that plan’s Task 00…N.

**Code reviews:** none under idiotplanners2 — if executor opens `plans1/P0X/CODE-REVIEW-REPORT.md`, treat as **optional cross-check only**, never override repo or idiotplanners2.

---

## 4. Ethics / non-copy

| Allowed | Forbidden |
|---------|-----------|
| JTBD / industry patterns as test questions | Paste competitor CSS/JS/SVG/GLB/screenshots into `site/` |
| O&O Phosphor / original chrome | Firecrawl re-scrape as routine |
| Research under `D:\websites` as ideas | Claiming research scores as live product green |
| Cite archive Idiots reports for bar | Shipping competitor path blobs |

---

## 5. File map (wave-level)

### Create (evidence / pack only — on execute)

| Path | When |
|------|------|
| `results/planner/world-standard-wave/**` | Each phase Task 00+ |
| `results/…/11-world-standard-closeout/**` | P11 |
| Phase NOTES / run.json / logs / PNGs | Per RESULTS-MAP + phase extras |

### Modify (product — residual only)

| Path | Typical residual |
|------|------------------|
| `helpSections.ts` | P06 account over-claim |
| `TopBar.tsx` / status labels / autosave hook | P06 testids, projectRef, leave flush |
| `FeasibilityCanvas.tsx` | P09 aria-keyshortcuts |
| `plannerCanvasHelpers.ts` | P07 `getFurnitureCount` |
| `open3d-world-standard-journey.spec.ts` | P07 bar rewrite |
| `open3d-save-honesty.spec.ts` | P06 id asserts |
| `site/package.json` scripts | P07 `test:e2e:world-standard-w1w2` |
| open3d tests under `site/tests/unit/...` | Gap tests only (P03 etc.) |

### Do not thrash

| Path | Rule |
|------|------|
| Fabric full walls cutover | Out of residual wave |
| Document radians rewrite | Forbidden false reverse |
| `Planner3DViewer` R3F as W4 proof | Out of W4 |
| Dual selection stores | Forbidden P03 |
| Designer static GLB | Forbidden P08 |
| P10 edits under `site/features` for gates | Forbidden |

---

## 6. Task list

### Task 00: Session zero / setup verification

**Files:**
- Create: `results/planner/world-standard-wave/00-start/NOTES.md` (preferred)
- Reference: `plans2/00-START.md`

- [ ] **Step 1: Confirm workspace**

```powershell
cd D:\OandO07072026
# Expect: path is main checkout; no worktree path
pwd
```

Expected: `D:\OandO07072026`

- [ ] **Step 2: Record HEAD honesty**

```powershell
git rev-parse HEAD
git status -sb
git log -1 --oneline
```

Expected: SHA printed; dirty OK; paste into `00-start/NOTES.md`.

- [ ] **Step 3: Confirm source resolution**

```powershell
Test-Path .\idiotplanners1
Test-Path .\plans2/README.md
Test-Path .\results
```

Expected: `idiotplanners1` False; `plans2` True; `results` likely False → re-prove posture.

- [ ] **Step 4: Layout guard**

```powershell
pnpm run check:layout
```

Expected: exit 0.

- [ ] **Step 5: Write 00-start NOTES**

Create directory and NOTES with: Approach A, date, agent, HEAD, “results wiped → full re-prove”, source = idiotplanners2.

- [ ] **Step 6: Optional capability smoke**

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d/hostWiringP01.test.ts --reporter=verbose
```

Expected: exit 0 or honest fail (log later under P01).

- [ ] **Step 7: Open kill-order next**

Next = **P01**. Open deep plan: `plans2/P01-product-truth/IMPLEMENTATION-PLAN.md`.

**Done when:** Session-zero checklist in `00-START.md` ticked; NOTES exists or intentional skip logged.

---

### Task group P01: Product truth inventory (re-prove)

**Deep plan:** `plans2/P01-product-truth/IMPLEMENTATION-PLAN.md`  
**Evidence:** `results/planner/world-standard-wave/00-product-truth/`  
**Product code:** **None** under open3d features (inventory only).

**Posture:** Full re-execution of inventory Tasks 00–07 from deep plan. Phase DONE headers are **stale**.

- [ ] **P01.1 — Scaffold evidence**

```powershell
New-Item -ItemType Directory -Force -Path "D:\OandO07072026\results\planner\world-standard-wave\00-product-truth" | Out-Null
git rev-parse HEAD > D:\OandO07072026\results\planner\world-standard-wave\00-product-truth\HEAD.txt
```

- [ ] **P01.2 — Engines / hosts / fabric truth**  
  Follow deep plan: dual host chains; fabric redirect; flag OFF default. Record path:line in INVENTORY.

- [ ] **P01.3 — W1–W8 matrix**  
  Code-present vs browser-missing; no blank rows. Default browser = `browser-missing` until Playwright artifacts exist.

- [ ] **P01.4 — Claims corpus**  
  Use `Plans/Research/Others/*` if `ayushdocs/` missing. List contradictions including paper PASS.

- [ ] **P01.5 — Vitest smoke**

```powershell
cd D:\OandO07072026
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d/hostWiringP01.test.ts --reporter=verbose *> results\planner\world-standard-wave\00-product-truth\vitest-hostWiringP01.log
```

Expected: non-empty log; `run.json.vitestSmoke` ∈ {ok,failed,skipped}.

- [ ] **P01.6 — INVENTORY.md + CONTRADICTIONS.md + BUYER-HARD-STOP.md + P02 freeze list**  
  Map minimum: INVENTORY + CONTRADICTIONS required.

- [ ] **P01.7 — Dual-state language**  
  CP artifacts ready-for-review ≠ buyer product ship.

- [ ] **P01.8 — Commit**

```powershell
git add results/planner/world-standard-wave/00-product-truth
git commit -m "docs(p01): re-prove product truth inventory pack (results wipe)"
```

**Stop-if-fail:** Editing open3d product for inventory; claiming browser green without artifacts.

**Done when:** Deep plan Done-when § met on disk.

---

### Task group P02: Engine lock freeze (re-prove)

**Deep plan:** `plans2/P02-engine-lock/IMPLEMENTATION-PLAN.md`  
**Evidence:** `results/planner/world-standard-wave/01-engine-lock/`  
**Product code:** Default **none**.

- [ ] **P02.1 — Scaffold + HEAD + run.json**

- [ ] **P02.2 — ENGINE-LOCK-RECORD.md**  
  Must include live orbit helper truth:

```text
Workspace: <Lazy3DViewer {...getOpen3dViewerControlProps()} />
OPEN3D_ORBIT_DEFAULT_ENABLED = true
Fabric dest; Feasibility interim; no hybrid; SKU; BOQ>photoreal
```

- [ ] **P02.3 — PACKAGE-PIN.md from live package.json**

```powershell
Select-String -Path site\package.json -Pattern '"fabric"|"three"|"@react-three|konva'
```

- [ ] **P02.4 — FLAG-INVENTORY + ENTRYPOINT-MAP** (guest/canvas via WorkspaceRoute)

- [ ] **P02.5 — Unit re-runs (unfiltered logs)**

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts `
  tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx `
  --reporter=verbose
```

Redirect logs into `01-engine-lock/`.

- [ ] **P02.6 — ANTI-THRASH-AUDIT + LICENSE hygiene note (no purchase)**

- [ ] **P02.7 — OWNER-SIGNOFF or written deferral**

- [ ] **P02.8 — NOTES.md map minimum + CP-02-SUMMARY**

- [ ] **P02.9 — Commit**

```powershell
git commit -m "docs(p02): re-prove engine lock pack under 01-engine-lock"
```

**Stop-if-fail:** Fabric cutover; Konva add; package upgrades as “lock.”

---

### Task group P03: W3 select / delete / undo (residual + re-prove)

**Deep plan:** `plans2/P03-select-delete/IMPLEMENTATION-PLAN.md`  
**Evidence:** `results/planner/world-standard-wave/03-select-delete/`  
**Mode:** **A** residual (default). **B** on red product. **C** greenfield only if helpers missing (unlikely).

**Hard rule:** Unit alone = **FAIL**.

- [ ] **P03.1 — Scaffold evidence + Fabric OFF**

```powershell
# Ensure flag not "1" in .env.local for proofs
```

- [ ] **P03.2 — Close unit residual gaps (TDD)**  
  Execute deep plan Tasks 01–06 for missing cases only, e.g.:
  - Feasibility canvas furniture select pointer case
  - locked-only same-ref; pose restore explicit
  - Ctrl+Backspace no-delete  
  **Do not** rewrite `applySelectionDelete` signature to appendix return-pair.

- [ ] **P03.3 — Run unit pack → log**

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/lib/geometry/canvasPicking.test.ts `
  --reporter=verbose
```

(Adjust paths if file names differ; use deep plan exact list.)

Expected: exit 0 with unfiltered log under `03-select-delete/`.

- [ ] **P03.4 — Browser pack**

```powershell
cd D:\OandO07072026\site
# pnpm run dev in other terminal
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-w3-select-delete.spec.ts --reporter=list
```

Expected: Select → Delete → count drop → Ctrl+Z restore; PNGs + browser-run.json under evidence (per spec).

- [ ] **P03.5 — Canonical run.json + NOTES** (Fabric OFF, no dual store)

- [ ] **P03.6 — Commit slices** (tests / product / evidence)

**Stop-if-fail:** Claiming W3 from unit only; journey folder substitute; Fabric ON proof.

---

### Task group P07: W1–W2 browser journey (rewrite bar + re-prove)

**Deep plan:** `plans2/P07-draw-place-journey/IMPLEMENTATION-PLAN.md`  
**Evidence:** `results/planner/world-standard-wave/02-browser-open3d-journey/`

**Why early in kill order:** Proves authoring path after W3 machinery exists.

- [ ] **P07.1 — Scaffold + alias pointer optional**

- [ ] **P07.2 — Add `getFurnitureCount` to plannerCanvasHelpers**  
  Full code in deep plan Task 01. Promote strict helper; delete body-scrape `-1` locals.

- [ ] **P07.3 — Rewrite `open3d-world-standard-journey.spec.ts`**  
  Binding bar:
  - serial · timeout ≥120s
  - open3d primary → guest fallback · record `routeUsed`
  - W1 walls Δ + Opening label (not D) + objects Δ
  - W2 place ≥2 incl. **cabinet-v0** via `placeCatalogOnCanvas`
  - **Forbidden:** configurator as sole green
  - PNGs 01–07 · playwright-run.json · canvas PNG >5k

  Full storyboard: deep plan Task 02–04.

- [ ] **P07.4 — npm script**

Add `test:e2e:world-standard-w1w2` per deep plan (or document equivalent one-liner in NOTES).

- [ ] **P07.5 — Sign-off command**

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
```

Expected: pass; artifacts under `02-browser-open3d-journey/`.

- [ ] **P07.6 — Product fix only if red for real product reason** (deep Task 06)

- [ ] **P07.7 — Commit**

**Stop-if-fail:** Seed false-green; absolute furniture≥1 without clear storage; configurator-only place; claiming W3–W8 from this phase.

---

### Task group P06: W5–W6 save honesty (residual product + re-prove)

**Deep plan:** `plans2/P06-save-honesty/IMPLEMENTATION-PLAN.md`  
**Evidence:** `06-save-honesty/` + `save-reload/`  
**Approach:** Residual close (not re-implement flush from zero).

**Top residual list (repo debt):**

| Residual | Action class |
|----------|--------------|
| Help account over-claim | Product copy fix |
| Save testids / data-storage | Product chrome |
| projectRef for flushPersist | Product hook |
| Leave bare `saver.flush()` | Product hook |
| W5 id asserts in e2e | Test raise L3 |
| Weak autosave unit mocks | Test |
| Cloud Task 07 | **Cancel** + NOTES unless owner unlocks |

- [ ] **P06.1 — Scaffold evidence**

- [ ] **P06.2 — TDD residual fixes** per deep plan order (labels → hook → e2e ids)

- [ ] **P06.3 — Unit pack**

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/open3d/saveReloadContinuity.test.ts `
  tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts `
  --reporter=verbose
```

- [ ] **P06.4 — Browser W5 hard reload ids**

```powershell
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-save-honesty.spec.ts --reporter=list
```

Raise to assert **same wall + furniture UUIDs** (not count-only). Use `clearPlannerStorageInPage` not wipe-on-reload helper.

- [ ] **P06.5 — W6 grep / dual surface NOTES** (no bare Saved; no account lie)

- [ ] **P06.6 — Cancel cloud Task 07 with NOTES** (default)

- [ ] **P06.7 — Commit**

**Stop-if-fail:** Claiming cloud backup; count-only as W5 L3; success toast “Saved” bare.

---

### Task group P04: W4 orbit continuity (verify + re-prove)

**Deep plan:** `plans2/P04-orbit-continuity/IMPLEMENTATION-PLAN.md`  
**Evidence:** `04-orbit-continuity/`

- [ ] **P04.1 — Scaffold + THREE-LAYER-AUDIT template**

- [ ] **P04.2 — Unit pose + orbit logs**

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/open3d/poseContinuityW4.test.ts `
  tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx `
  tests/unit/features/planner/open3d/documentViewContinuity.test.ts `
  --reporter=verbose
```

- [ ] **P04.3 — Layer 1–2 code audit** (defaults + workspace spread) — no thrash

- [ ] **P04.4 — Playwright W4**

```powershell
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=list
```

Expected: 3D orbit attr true; left-drag; 2D↔3D; PNGs + browser-run.json **or** written deferral with owner language.

- [ ] **P04.5 — NOTES: degrees document; count-proxy e2e limitation honesty**

- [ ] **P04.6 — Commit**

**Stop-if-fail:** Layer-1-only orbit claim; document radians thrash; J4 anti-pattern as proof.

---

### Task group P05: W2 symbols / SVG honesty (re-prove)

**Deep plan:** `plans2/P05-symbols-svg/IMPLEMENTATION-PLAN.md`  
**Evidence:** `05-symbols-svg/`

- [ ] **P05.1 — Scaffold**

- [ ] **P05.2 — Unit re-run cabinet-v0 + renderBlock2D**

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts `
  --reporter=verbose
```

- [ ] **P05.3 — Do not re-apply BLOCK_STYLE.storage empty-box regression**

- [ ] **P05.4 — Honesty NOTES** (Path B Block2D authority; Path C publish only; no Feasibility load of `/svg-catalog`)

- [ ] **P05.5 — Visual prim-JSON and/or PNG under evidence**

- [ ] **P05.6 — CP-05.json / SUMMARY split symbolQuality vs svgHonestySmoke**

- [ ] **P05.7 — Commit**

**Stop-if-fail:** Fabric ON as symbol proof; portal svg-catalog as plan symbols; unit count alone without visual.

---

### Task group P08: W7 mesh quality (evidence-first)

**Deep plan:** `plans2/P08-mesh-quality/IMPLEMENTATION-PLAN.md`  
**Evidence:** `08-mesh-quality/`  
**Approach A** unless formula drift → Approach B TDD.

- [ ] **P08.1 — Scaffold + HEAD**

- [ ] **P08.2 — NOTES.md bar doc** (toe/carcass/door matrix; residual no handles)

- [ ] **P08.3 — Unit primary + blast logs**

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  --reporter=verbose
```

- [ ] **P08.4 — Visual smoke**

```powershell
cd D:\OandO07072026\site
node scripts/p08-cabinet-v0-visual-smoke.mjs
# ensure outputs land under results/.../08-mesh-quality/ per script args / deep plan
```

- [ ] **P08.5 — run.json + CP-08 closeout**

- [ ] **P08.6 — Commit**

**Stop-if-fail:** Unit-only W7; designer GLB; photoreal claim; primary folder rename.

---

### Task group P09: W8 shortcuts / chrome (residual + re-prove)

**Deep plan:** `plans2/P09-shortcuts-chrome/IMPLEMENTATION-PLAN.md`  
**Evidence:** `09-shortcuts-chrome/`

- [ ] **P09.1 — Scaffold**

- [ ] **P09.2 — Re-run truth matrix**

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx `
  --reporter=verbose
```

- [ ] **P09.3 — Fix Feasibility stale `aria-keyshortcuts`** to map-driven helper (deep plan)

- [ ] **P09.4 — Extend rail a11y for Dimension (M) / Wall (W) if still partial**

- [ ] **P09.5 — Hide-tools inventory NOTES** (`chrome-hide-tools: none` if none)

- [ ] **P09.6 — Forbidden: rebind Dimension→D**

- [ ] **P09.7 — Commit**

**Stop-if-fail:** Second letter table; claiming W8 without `09-` artifacts.

---

### Task group P10: Evidence handover pack

**Deep plan:** `plans2/P10-evidence-handover/IMPLEMENTATION-PLAN.md`  
**Evidence:** `10-handover/`  
**Scope:** Pack / honesty / backup **only** — **no** `site/` product features.

- [ ] **P10.1 — Probe D: results + optional E: survivor**

```powershell
Test-Path D:\OandO07072026\results\planner\world-standard-wave
Test-Path E:\OandO-backups\trustdata-2026-07-10
```

- [ ] **P10.2 — Lock mode**
  - **Mode A** FAIL-honest if gates incomplete / results sparse
  - **H4** restore from E: only with owner D1
  - **Mode B** only if W0–W8 green/WAIVE on live D:

- [ ] **P10.3 — Write six files**  
  README · W-GATES · MASTER-SYNC · HEAD · FAILURES-SNIP · BACKUP-LOG  
  Full templates: deep plan Task 01.

- [ ] **P10.4 — MASTER Shape B refusal if MASTER missing** (do not invent 94 ticks)

- [ ] **P10.5 — Backup procedure + BACKUP-LOG** (per-source codes)

- [ ] **P10.6 — Dual language: GATE ≠ product**

- [ ] **P10.7 — Commit pack** (docs/evidence only)

**Stop-if-fail:** Mode B PASS with missing folders; site feature edits under P10; ceremony ship claim.

---

### Task group P11: Integration / world-standard close-out

**Checklist:** `plans2/P11-CHECKLIST.md`  
**Evidence:** `11-world-standard-closeout/`

- [ ] **P11.1 — Create close-out folder + HEAD.txt**

- [ ] **P11.2 — CROSSWALK.md** re-read every W folder status from disk

- [ ] **P11.3 — Cross-cutting asserts** (Fabric OFF proofs, degrees, SVG triple-path, orbit three-layer, Dimension=M, journey not configurator-only)

- [ ] **P11.4 — Integration unit re-smoke** (commands in P11-CHECKLIST)

- [ ] **P11.5 — Optional browser journey re-smoke**

- [ ] **P11.6 — DUAL-LANGUAGE.md**

- [ ] **P11.7 — run.json + NOTES + INTEGRATION-SMOKE.md**

- [ ] **P11.8 — Failures.md residual note**

- [ ] **P11.9 — Commit + push policy**

**Done when:** P11 Mode A or B exit criteria met honestly.

---

### Cross-cutting tasks (any phase)

#### CX1 — Stale path hygiene (docs only when touching)

When editing phase docs / inventory:

- Replace `Plans/trustdata/*` → `Plans/phases/*` or `Plans/Research/*`
- Replace forbidden evidence names per RESULTS-MAP
- Replace root `ayushdocs/` → `Plans/Research/Others/` if missing

#### CX2 — results/ recreate discipline

- Create folder only when depositing real content
- Never empty-folder green
- Never `site/results/`

#### CX3 — False-green traps (always)

See §8 catalog. Each phase NOTES must refuse the traps for that gate.

---

## 7. Test matrix (master)

| Gate | Unit command / suite | Browser | Evidence |
|------|----------------------|---------|----------|
| CP-01 | hostWiringP01 | List only | `00-product-truth/` |
| CP-02 | furnitureFabricMapper + orbitControlsDefault | N/A | `01-engine-lock/` |
| W3 | applySelectionDelete + keyboard + pick | open3d-w3-select-delete | `03-select-delete/` |
| W1–W2 place | helpers if any | open3d-world-standard-journey | `02-browser-open3d-journey/` |
| W5–W6 | saveReloadContinuity + status labels | open3d-save-honesty (ids) | `06-save-honesty/` |
| W4 | poseContinuityW4 + orbitControlsDefault | open3d-w4-orbit-continuity | `04-orbit-continuity/` |
| W2 symbols | furnitureBlock2D.cabinet-v0 + renderBlock2D | optional | `05-symbols-svg/` |
| W7 | modularCabinetV0 + export + visual smoke | optional mesh-symbol | `08-mesh-quality/` |
| W8 | toolShortcutTruth + keyboard + rail a11y | optional | `09-shortcuts-chrome/` |
| Pack | N/A product | N/A | `10-handover/` |
| P11 | multi-suite re-smoke | optional journey | `11-world-standard-closeout/` |

**Integrity:** Unfiltered logs; no silent skips; missing console = fail when required.

---

## 8. False-green catalog (master)

| ID | Trap | Block |
|----|------|-------|
| FG01 | Phase header PASS without `results/` | Re-prove law |
| FG02 | Unit green = W3 / browser W1–W2 | Dual proof required |
| FG03 | Configurator batch as CP-07 place | Forbidden sole green |
| FG04 | Fabric flag ON as symbol/select proof | Flag OFF |
| FG05 | svg-catalog / portal as plan symbols | Honesty NOTES |
| FG06 | Orbit default constant only | Three-layer + browser |
| FG07 | Save count-only as W5 | UUID identity |
| FG08 | Bare “Saved” / account help with IDB-only | P06 residual |
| FG09 | E: historical folders = live green | Re-proven on HEAD? column |
| FG10 | P10 pack = product ship | Dual language |
| FG11 | Empty evidence dirs | Content required |
| FG12 | site/results dumps | Redirect to root |
| FG13 | Dimension→D “fix” | Product law M |
| FG14 | Document radians thrash | Degrees authority |
| FG15 | WAVE.md / research as W pass | Research ≠ gate |
| FG16 | Scoreboard / PENDING over-claim | Disk re-read wins |
| FG17 | Filtered vitest/playwright logs | testing-handbook |
| FG18 | Seed IDB residual furniture | clear storage + deltas |
| FG19 | applySelectionDelete multi-loop history | One updateProject |
| FG20 | Claiming idiotplanners1 source | Missing → idiotplanners2 |

---

## 9. Stop-if-fail / CP criteria

| Event | Action |
|-------|--------|
| Goal change / Fabric cutover mid-wave | Stop; owner align |
| Map-minimum missing on claimed green | Fail CP; reopen phase |
| Unit-only W3 claim | Fail CP-03 |
| Mode B P10 without D: greens | Convert Mode A |
| Product edit under P10/P11 labels for gates | Reopen owning P0X |
| Purchase / force-push | Stop |
| Ethics violation | Stop; reverse |

CP green floors: **RESULTS-MAP** + phase extras in deep plans. Both required.

---

## 10. Commit sequence (suggested)

| Order | Message pattern |
|------:|-----------------|
| 1 | `docs(p00): session zero / 00-start notes` |
| 2 | `docs(p01): re-prove product truth inventory` |
| 3 | `docs(p02): re-prove engine lock pack` |
| 4 | `test/fix(p03): W3 residual + evidence` |
| 5 | `test(p07): world-standard W1–W2 journey bar` |
| 6 | `fix/test(p06): save honesty residual + W5 ids` |
| 7 | `docs/test(p04): re-prove orbit continuity` |
| 8 | `docs/test(p05): re-prove symbols SVG honesty` |
| 9 | `docs/test(p08): re-prove mesh quality pack` |
| 10 | `fix/test(p09): shortcuts aria residual + evidence` |
| 11 | `docs(p10): handover pack Mode A/B` |
| 12 | `docs(p11): world-standard close-out` |

Push origin when landable; mayoite ~45m / big land. Never force-push.

---

## 11. Risks & owner decisions

| Risk | Mitigation |
|------|------------|
| Evidence wipe recurs | P10 backup + mayoite; new dated E: folders |
| Playwright flake | Serial journey; gold helpers; deltas; NOTES wait strategy |
| Owner wants Mode B now | Impossible without D: greens or WAIVE |
| Agent rewrites green mesh/Block2D | Residual-first posture; Approach A |
| plans1 conflict | Do not write plans1; different source wave |
| Dirty tree confuses HEAD | Record status in every phase HEAD.txt |
| Cloud unlock mid-P06 | Only with owner D3 |

Owner decision defaults: see `00-START.md`.

---

## 12. Self-review (package vs skill + inputs)

| Check | Status |
|-------|--------|
| Repo read first | Yes — §1 |
| idiotplanners2 second | Yes — all 10 plans |
| Code reviews | Absent — stated |
| Source idiotplanners1 missing | Resolved → idiotplanners2 |
| Required header fields | Yes |
| Kill order with references | Yes §3 |
| Task 00 setup | Yes |
| Residual vs rewrite | Yes |
| Cross-cutting stale paths / results / false-green | Yes |
| Test matrix | Yes §7 |
| False-green catalog | Yes §8 |
| Stop-if-fail | Yes §9 |
| Commit sequence | Yes §10 |
| Risks | Yes §11 |
| Full code in every residual step | Delegated to deep plans when large; residual commands explicit here |
| Placeholder scan | No TBD gates; open owner decisions named |
| Ethics | Yes §4 |
| P11 + 00-START | Delivered as sibling docs |

**Length honesty:** Master is extensive spine + residual synthesis. Per-phase full TDD source remains in `plans2` (1.2k–2k lines each) — intentionally not duplicated to avoid drift.

---

## 13. Appendices

### A — RESULTS-MAP folder cheat

| Phase | Folder |
|-------|--------|
| P00 | `00-start/` |
| P01 | `00-product-truth/` |
| P02 | `01-engine-lock/` |
| P03 | `03-select-delete/` |
| P04 | `04-orbit-continuity/` |
| P05 | `05-symbols-svg/` |
| P06 | `06-save-honesty/` |
| P07 | `02-browser-open3d-journey/` |
| P08 | `08-mesh-quality/` |
| P09 | `09-shortcuts-chrome/` |
| P10 | `10-handover/` |
| P11 | `11-world-standard-closeout/` |

### B — W gates one screen

| Gate | Meaning | Primary proof phase |
|------|---------|---------------------|
| W1 | Walls + opening | P07 |
| W2 place | ≥2 incl cabinet-v0 | P07 |
| W2 symbols | Readable Block2D | P05 |
| W3 | Select + delete + undo | P03 |
| W4 | 2D↔3D + orbit | P04 |
| W5 | Save reload same ids | P06 |
| W6 | Local vs cloud honesty | P06 |
| W7 | Readable multi-part mesh | P08 |
| W8 | Labels match keys | P09 |

### C — Default execute commands (from site/)

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run <paths> --reporter=verbose
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts <spec> --reporter=list
```

### D — Agent brief template

```text
/using-superpowers
+ verification-before-completion (+ TDD / chrome-devtools as needed)

Execute plans2 kill order phase P0X only.
Deep plan: plans2/P0X-*/IMPLEMENTATION-PLAN.md
Master: plans2/EXECUTABLE-PLAN.md
Repo wins; results missing = re-prove; residual not rewrite.
Evidence only under results/planner/world-standard-wave/<canonical>/.
No worktrees. No plans1. No competitor copy.
```

### E — Execution handoff

**Plan package complete under `plans2/`.**

**Two execution options:**

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development — one phase per subagent, kill order.  
2. **Inline Execution** — superpowers:executing-plans — same order.

Start: `plans2/00-START.md` → P01.

---

*End of master executable plan.*
