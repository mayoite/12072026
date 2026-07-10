# World-Standard Planner — Master Executable Plan (PlansA residual)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.  
> **Plan skill:** writing-plans (repo first → both plan packages + code reviews → residual-only tasks).

**Goal:** Re-prove W0–W8 / CP-01–CP-10 on a checkout where **`results/` is missing**, close residual honesty/product gaps from **both** CODE-REVIEW waves, and exit via **P11** with an honest ship decision — without rewriting already-landed open3d product code.

**Architecture:** Approach **A** remains binding: FeasibilityCanvas interim 2D + document model authority; Fabric furniture stage is destination spike (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE === "1"` only, default OFF for all W proofs); Three.js + OrbitControls via Lazy3DViewer with **explicit** `getOpen3dViewerControlProps()`; hybrid/Konva banned; evidence only under repo-root `results/planner/world-standard-wave/`. This package is a **residual execute spine**, not a greenfield planner rewrite.

**Tech Stack:** Next.js (oando-site) · TypeScript strict · Vitest · Playwright · Canvas 2D Feasibility · optional Fabric 7.4.0 spike · Three + R3F/drei (viewer) · IndexedDB guest/member local · pnpm monorepo.

**Inputs consumed:**
- Repo skim: AGENTS evidence rules · HEAD re-check at execute · **`results/` MISSING** at package write
- **plans1/** (Idiots2 + CODE-REVIEW) — full package roots + all reviews + residual IMPL full; re-prove IMPL section skim
- **plans2/** (Idiots + CODE-REVIEW) — same coverage class
- Brainstormers: `archive/Idiots2/` (primary lineage), `archive/Idiots/` (secondary)
- Phase map: `Plans/INDEX.md`, `Plans/Research/RESULTS-MAP.md`
- Conduct: `AGENTS.md`, `testing-handbook.md`, `START.md`

**Done when:**
1. Map-minimum artifacts exist for every RESULTS-MAP primary folder on **this HEAD**, **or** honest FAIL/WAIVE documented in P10/P11.
2. Residual product gaps from reviews closed (P06 help/UUID, P07 journey identity, P04 wiring/console, P08 smoke/G5 honesty, P09 aria, P03 unit gaps).
3. P11 SHIP-HONESTY = READY **or** explicit NOT READY with residual list — never paper READY.
4. `pnpm run check:layout` PASS; no false-green traps left uncalled.

**Evidence folder (wave root):** `results/planner/world-standard-wave/`  
**Package folder:** `PlansA/`  
**Deep recovery only:** `plans1/P0X-*/IMPLEMENTATION-PLAN.md` (prefer) or `plans2/…` — **never dual-run both packages**.

---

## 1. Repo reality

### 1.1 Brutal workspace facts (synthesis-time; re-prove on execute)

| Check | Fact |
|-------|------|
| Checkout | `D:\OandO07072026` main · no worktrees |
| `results/` | **MISSING** → all prior GATE/CP PASS unproven |
| Layout | `pnpm run check:layout` fails until `results/` exists |
| Root `Idiots2/` / `Idiots/` | **Absent** → use `archive/Idiots2/` and `archive/Idiots/` |
| `Plans/trustdata/` | Removed → use `Plans/phases` + `Plans/Research` |
| Planner product | Dense under `site/features/planner/open3d/` |
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

### 1.3 Synthesis of CODE-REVIEW verdicts (stricter of both)

| Phase | plans1 verdict | plans2 verdict | PlansA decision |
|-------|----------------|----------------|-----------------|
| P01 | APPROVE-WITH-FIXES | APPROVE-WITH-FIXES | Inventory pack re-prove |
| P02 | APPROVE-WITH-FIXES | APPROVE-WITH-FIXES | Freeze pack; no rebuild |
| P03 | APPROVE-WITH-FIXES | FAIL UNPROVEN (evidence) | Mode A residual + browser **mandatory** |
| P04 | APPROVE-WITH-FIXES | FAIL NOT PROVEN (evidence) | Re-prove + wiring unit + console harden |
| P05 | APPROVE re-prove | APPROVE residual-only | Units + prim-JSON; no geometry thrash |
| P06 | FAIL NOT GREEN | FAIL NOT GREEN | **Code residual** Tasks 00–06; cancel 07 |
| P07 | CONDITIONAL APPROVE | FAIL + CONDITIONAL plan | **Journey rewrite** + identity B fixes |
| P08 | CONDITIONAL mesh OK | evidence-first OK | NOTES + smoke; skip toe rewrite |
| P09 | APPROVE residual | FAIL W8 until residual | **aria + rail + evidence** |
| P10 | Mode A only | Mode A only | FAIL-honest six files; Mode B blocked |

---

## 2. Kill order

```
P00 → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11
```

---

## 3. Ethics / non-copy

- Research under `D:\websites` and historical Firecrawl scrapes = **JTBD/patterns only**.
- Do **not** paste competitor UI, assets, or copy into `site/`.
- Agent never purchases. No competitor path blobs as product UI.

---

## 4. File map (residual execute)

### 4.1 Evidence create

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
| P03 | unit gap tests; e2e W3 |
| P04 | **Create** `workspaceOrbitWiring.test.ts`; harden `open3d-w4-orbit-continuity.spec.ts` |
| P05 | Optional authority static test; no geometry unless RED |
| P06 | `helpSections.ts`, `workspaceStatusLabels.ts`, TopBar, autosave hook, persistence tests, e2e save-honesty |
| P07 | `open3d-world-standard-journey.spec.ts`, `plannerCanvasHelpers.ts`, package.json script |
| P08 | Smoke + G5 honesty; no toe thrash |
| P09 | `canvasKeyShortcutsAttribute` helper; `FeasibilityCanvas.tsx`; rail a11y + donorParity tests |
| P01–P02,P10 | Evidence markdown only (default) |

### 4.3 Do not touch (default)

- `_archive/fabric` product restore · Konva add · R3F port of open3d viewer · dual selection stores · designer static GLB · Dimension→D rebind · cloud autosave without owner unlock

---

## 5. Task list

### Task 00: Session zero / setup verification

**Maps to:** [00-START.md](./00-START.md)  
**Files:** Create evidence under `results/planner/world-standard-wave/00-start/` only.

- [ ] **Step 1: Confirm single worktree**

```powershell
cd D:\OandO07072026
git worktree list
```

Expected: one main checkout line; no extra worktrees for this work.

- [ ] **Step 2: Create wave root + record HEAD**

```powershell
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\00-start" | Out-Null
git log -1 --format="%H %s" | Set-Content results\planner\world-standard-wave\00-start\HEAD.txt
git status -sb | Set-Content results\planner\world-standard-wave\00-start\DIRTY.txt
```

- [ ] **Step 3: Layout gate**

```powershell
pnpm run check:layout
```

Expected: PASS once `results/` exists.

- [ ] **Step 4: Tooling preflight → `00-start/NOTES.md`**

  - `Get-Command rg` → present or **Select-String fallback** policy  
  - Brainstormer paths = `archive/Idiots2/` + `archive/Idiots/`  
  - Fabric env unset  
  - Approach A binding  
  - Source = **PlansA** (not dual plans1/plans2)

- [ ] **Step 5: Optional capability smoke**

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d/hostWiringP01.test.ts --reporter=verbose
```

Expected: exit 0 or honest fail (log later under P01).

- [ ] **Step 6: Commit (main agent)**

```powershell
git add results/planner/world-standard-wave/00-start PlansA
git commit -m "docs(PlansA): session zero evidence scaffold"
```

**Stop if:** multi-worktree; owner goal changed.

---

### Task group P01: Product truth re-prove (inventory only)

**Evidence:** `results/planner/world-standard-wave/00-product-truth/`  
**Review:** `plans1/P01-product-truth/CODE-REVIEW-REPORT.md` (+ optional plans2)  
**Mode:** Inventory only — **no** open3d feature edits.

- [ ] **P01.00 — Scaffold pack**

```powershell
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\00-product-truth" | Out-Null
git rev-parse HEAD | Set-Content results\planner\world-standard-wave\00-product-truth\HEAD.txt
```

Write `run.json` (`status: in-progress`), `authority-path-map.md`:

| Dead path | Live path |
|-----------|-----------|
| `Idiots2/…` | `archive/Idiots2/…` |
| `Idiots/…` | `archive/Idiots/…` |
| `Plans/trustdata/…` | `Plans/phases/` + `Plans/Research/` |
| `ayushdocs/…` | `Plans/Research/Others/` (if present) |

- [ ] **P01.01 — Key-files exist (fail closed)**  
  FeasibilityCanvas, OOPlannerWorkspace, orbitDefaults, fabric flag, newEntityId, hosts, redirects. Fail closed if required production path False.

- [ ] **P01.02 — Routes / fabric / import graph**  
  Document dual host chains; fabric permanent redirects; write `import-graph-stale-paths.tsv` for dead FS rows. **Do not** “fix” importGraphProof in P01.

PowerShell fallback (when `rg` missing):

```powershell
Get-ChildItem site\features\planner\open3d -Recurse -Include *.ts,*.tsx |
  Select-String -Pattern "deleteSelection|formatAutosaveStatus|OrbitControls" |
  ForEach-Object { "$($_.Path):$($_.LineNumber):$($_.Line.Trim())" } |
  Set-Content results\planner\world-standard-wave\00-product-truth\greps-w-sample.txt
```

- [ ] **P01.03 — CAPABILITY-MATRIX W1–W8**  
  Columns: capability | code-present|partial|absent | unit-green|missing | browser-green|missing | path:line.  
  Until smoke: **unit-missing**; until e2e pack: **browser-missing** even if code-present.

- [ ] **P01.04 — Claims register ≥13 rows** including evidence-missing + paper PASS.

- [ ] **P01.05 — Required vitest capability smoke**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/hostWiringP01.test.ts `
  tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx `
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts `
  tests/unit/features/planner/open3d/poseContinuityW4.test.ts `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\00-product-truth\vitest-capability-smoke-raw.log
```

- [ ] **P01.06 — Land required pack (fail-closed self-check includes all)**  
  Non-empty: `INVENTORY.md`, `CONTRADICTIONS.md`, `PRODUCT-TRUTH.md` (or summary), `README.md`, `run.json`, `authority-path-map.md`, `import-graph-stale-paths.tsv`, vitest log.  
  Status `ready-for-review` — **do not auto CP-01 pass**.

**Commit:** `docs(planner): P01 product-truth re-prove pack`

---

### Task group P02: Engine lock re-prove

**Evidence:** `01-engine-lock/` (never `02-engine-lock/` as P02)  
**Review:** `plans1/P02-engine-lock/CODE-REVIEW-REPORT.md`  
**Default product code:** none.

- [ ] **P02.00 — Scaffold** HEAD + run.json

- [ ] **P02.01 — ENGINE-LOCK-RECORD.md** with live truth:
  - 2D interim = FeasibilityCanvas  
  - Fabric destination = flag exact `"1"`  
  - 3D = Three + Lazy3DViewer + OrbitControls  
  - Orbit product authority = `getOpen3dViewerControlProps()` spread  
  - Konva absent  

- [ ] **P02.02 — FLAG-INVENTORY + ENTRYPOINT-MAP + PACKAGE-PIN** from live `site/package.json`  
  LICENSE: gsap used; @gsap/react unused if no imports.

- [ ] **P02.03 — Unit re-runs (raw logs)**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/canvas-fabric-stage/furnitureFabricMapper.test.ts --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\01-engine-lock\vitest-fabric-flag-raw.log

pnpm exec vitest run tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\01-engine-lock\vitest-orbit-default-raw.log
```

- [ ] **P02.04 — OWNER-SIGNOFF** Template A **or** explicit DEFERRAL (B)

- [ ] **P02.05 — ANTI-THRASH-AUDIT + CP-02-SUMMARY** non-claims (fabric unit ≠ full stage; orbit unit ≠ W4 browser)

**Stop-if-fail:** Fabric cutover; Konva; package upgrades as “lock.”

**Commit:** `docs(planner): P02 engine-lock evidence freeze`

---

### Task group P03: W3 select/delete residual (Mode A)

**Evidence:** `03-select-delete/`  
**Review:** `plans1/P03-select-delete/CODE-REVIEW-REPORT.md`  
**Hard:** Unit alone = **FAIL W3**. Do not rewrite `applySelectionDelete` signature; no dual-store; Fabric OFF.

- [ ] **P03.00 — Scaffold + baseline unit log** of pick/delete/keyboard suites

- [ ] **P03.01 — Unit gaps (TDD)** only if missing cases still red:
  - Locked furniture skip → same project ref / no history push
  - Multi-id delete then undo restores **ids + pose** through history helper
  - Empty selection no-op
  - Canvas select pointer → setSelection (Feasibility furniture path)
  - Keyboard: Ctrl+Bksp does not delete; Del in input does not

**Files (prefer live names):**
- `site/tests/unit/features/planner/open3d/**/applySelectionDelete.test.ts`
- `…/open3dWorkspaceKeyboard.test.tsx`
- `…/open3dFeasibilityCanvas.test.tsx` and/or `canvasPicking` tests

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/lib/geometry/canvasPicking.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\03-select-delete\vitest-w3-pack-raw.log
```

- [ ] **P03.02 — Browser W3 hard gate**

```powershell
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -ErrorAction SilentlyContinue
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-w3-select-delete.spec.ts --reporter=list
```

  - Prefer `selectPlannerTool(page, "Select")`  
  - Place **delta** before assert furniture ≥1  
  - Assert delete Δ + undo restore  
  - PNGs + raw log + `run.json` under `03-select-delete/`  
  - **Unit alone = FAIL**

- [ ] **P03.03 — W3-ACCEPTANCE.md** from data only

**Commit:** `test(open3d): P03 W3 residual unit+browser evidence`

---

### Task group P07: W1–W2 journey rewrite (**code residual**)

**Evidence:** `02-browser-open3d-journey/`  
**Review:** `plans1/P07-draw-place-journey/CODE-REVIEW-REPORT.md` + plans2 (stricter FAIL for CP-07)  
**Mode:** Rewrite-in-place e2e + helpers — **not** Fabric cutover.

#### Task 07.00 — Scaffold

- [ ] Create `02-browser-open3d-journey/`; NOTES with Approach A; Fabric OFF; HEAD.

#### Task 07.01 — Helper `getFurnitureCount`

**Files:** Modify `site/tests/e2e/plannerCanvasHelpers.ts`

- [ ] **Implement** (mirror walls/objects parsers; miss → **0** not `-1`):

```typescript
import type { Page } from "@playwright/test";

/** Parse `.pw-status-bar` furniture count. Missing metric → 0 (honest poll). */
export async function getFurnitureCount(page: Page): Promise<number> {
  const text = await page.locator(".pw-status-bar").innerText().catch(() => "");
  const m = text.match(/(\d+)\s*furniture/i);
  if (!m) return 0;
  return Number.parseInt(m[1], 10);
}
```

Optional: export `drawWallByTwoClicks` shared with journey.

- [ ] Verify export present:

```powershell
cd D:\OandO07072026\site
node -e "const fs=require('fs'); const s=fs.readFileSync('tests/e2e/plannerCanvasHelpers.ts','utf8'); if(!s.includes('export async function getFurnitureCount')) process.exit(1); console.log('getFurnitureCount: ok')"
```

#### Task 07.02 — Rewrite `open3d-world-standard-journey.spec.ts`

**Hard requirements (both reviews):**

| Requirement | Detail |
|-------------|--------|
| Entry | Prefer `/planner/open3d` then guest fallback; storage clear when guest; `routeUsed` in proof |
| Serial | `mode: "serial"`; timeout ≥120s |
| W1 wall | Metric **Δ** not absolute seed walls |
| W1 Opening | Objects **Δ**; label **Opening** (not shortcut D); coords **bound to successful wall segment** |
| W2 | Place **cabinet-v0** via exact Add CTA used for place (`placeCatalogOnCanvas`) |
| W2 second | Real SKU id from **same button** used to place (not assumed string / search alone) |
| Ban | Configurator/chair as sole W2 success path — **delete** `placeSeatsFromConfigurator` success path from this spec |
| Storyboard | Screenshots 01–07; non-blank canvas PNG byteLength **> 5000** |
| Proof | Write `playwright-run.json` **after** asserts (exit 0 only if green) |
| Identity | **No** force `includesCabinetV0 = true`; no body-only “Modular Cabinet” as placed proof |

**Proof shape (must assert real place, not force):**

```typescript
// Conceptual contract for proof object — implement in rewrite
type JourneyProof = {
  routeUsed: "open3d" | "guest";
  wallsBefore: number;
  wallsAfterDraw: number;
  objectsAfterWalls: number;
  objectsAfterOpening: number;
  furnitureBefore: number;
  furnitureAfter: number;
  includesCabinetV0: boolean; // set ONLY after place CTA for Modular Cabinet succeeds + furniture Δ
  secondCatalogId: string;    // recorded from the SAME Add button used in placeCatalogOnCanvas
  canvasPngBytes: number;
  result: "pass" | "fail";
};
```

**Forbidden patterns to delete/reject:**

```typescript
// FORBIDDEN — remove if present
// includesCabinetV0 = true; // unconditional
// body text includes "Modular Cabinet" as sole place proof
// secondCatalogId = "sample-desk-1" // assumed without using that button
// await placeSeatsFromConfigurator(...) as sole W2 green
```

#### Task 07.03 — npm script

- [ ] Add to `site/package.json` (or document equivalent in NOTES):

```json
"test:e2e:world-standard-w1w2": "playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts"
```

#### Task 07.04 — Re-prove

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -ErrorAction SilentlyContinue
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
```

- [ ] Artifacts under `02-browser-open3d-journey/` only (PNGs 01–07, playwright-run.json, raw log).
- [ ] NOTES non-claims: not P03/P04/P05 quality/mesh.

**Commit:** `test(e2e): P07 W1-W2 journey rewrite + evidence`  
**Stop if:** identity false-green paths reintroduced.

**Deep dump if needed:** `plans1/P07-draw-place-journey/IMPLEMENTATION-PLAN.md` Tasks 01–06.

---

### Task group P06: W5–W6 residual honesty (**code residual**)

**Evidence:** `06-save-honesty/` + `save-reload/`  
**Review:** both P06 CODE-REVIEW (FAIL NOT GREEN)  
**Do not:** re-land flush/pagehide already present; mount fabric save indicator; cloud wire (cancel Task 07).

#### Task 06.00 — Scaffold + baseline

- [ ] Create folders; baseline vitest continuity + labels → log.

```powershell
New-Item -ItemType Directory -Force -Path "results\planner\world-standard-wave\06-save-honesty\save-reload" | Out-Null
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/saveReloadContinuity.test.ts `
  tests/unit/features/planner/open3d/workspaceStatusLabels.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\06-save-honesty\baseline-vitest-raw.log
```

#### Task 06.01 — AutoSaver write-proof units

**Files:** `site/tests/unit/.../planner-autosave.test.ts` (and/or new hook test)

- [ ] Mock `saveProject`; assert schedule writes; flush writes pending; cancel; no silent drop.
- [ ] Delete dead double-gate empty `if` in `persistence.ts` if still present.

#### Task 06.02 — Single label helper contract

**Files:** `site/features/planner/open3d/editor/workspaceStatusLabels.ts` (+ tests)

- [ ] Introduce or complete `open3dSaveStatusLabel` (or extend `formatAutosaveStatus`) single table:
  - Forbidden bare “Saved” / cloud copy when `cloudEnabled=false`
  - Error: “Local save failed”
  - Idle: “Ready (local)” consistency across surfaces

```typescript
// Contract sketch — align names with live file; keep pure
export type Open3dSaveLabelInput = {
  cloudEnabled: boolean;
  phase: "idle" | "saving" | "saved" | "unsaved" | "error";
  isGuest?: boolean;
};

export function open3dSaveStatusLabel(input: Open3dSaveLabelInput): string {
  if (input.phase === "error") return "Local save failed";
  if (input.phase === "saving") return "Saving locally…";
  if (input.phase === "saved") return "Saved locally";
  if (input.phase === "unsaved") return "Unsaved local changes";
  // idle
  if (input.cloudEnabled) return "Ready"; // cloud path only if wired
  return "Ready (local)";
}
```

#### Task 06.03 — projectRef flush hardening

**Files:** `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts`

- [ ] `projectRef` always latest project for schedule/flush.
- [ ] Leave paths (`pagehide` / visibility / unmount) call `flushPersist` with current project — not bare stale `saver.flush()` without rebuild.
- [ ] Export `storage` / `cloudEnabled` / `isLocalSaved` as residual contract needs.

#### Task 06.04 — TopBar + workspace dual surface + testids

**Files:** TopBar, workspace status pill

- [ ] Both surfaces same helper.
- [ ] `data-testid="open3d-save-status"` (+ storage/status attrs as needed).
- [ ] Success toast after Save flush ack: local-qualified (never bare “Saved” when cloud off).

#### Task 06.05 — Help / FAQ honesty (buyer-visible lie)

**Files:** `site/features/planner/help/helpSections.ts` + unit

- [ ] Remove “members keep named save slots in their account” style overclaim while open3d autosave is IDB-only.
- [ ] Guest vs member copy honest (export/publish ≠ cloud autosave durability).
- [ ] Grep artifact under evidence: no forbidden phrases.

```powershell
Get-ChildItem site\features\planner\help -Recurse -Include *.ts,*.tsx |
  Select-String -Pattern "named save slots|account.*save|synced to (your )?account|cloud save" |
  ForEach-Object { "$($_.Path):$($_.LineNumber):$($_.Line.Trim())" } |
  Set-Content results\planner\world-standard-wave\06-save-honesty\help-forbidden-grep.txt
# Expect: empty or only intentional residual NOTES exceptions
```

#### Task 06.06 — W5 E2E UUID equality

**Files:** `site/tests/e2e/open3d-save-honesty.spec.ts`

- [ ] After Save + hard reload, assert **wall + furniture UUIDs** equal (IDB snapshot parse or export envelope) — **not furniture count alone**.
- [ ] Screenshots + `06-browser-run.json` under `save-reload/`.
- [ ] Use reload-safe storage clear helpers (`clearPlannerStorageInPage`), not wipe-on-reload.

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-save-honesty.spec.ts --reporter=list
```

#### Task 06.07 — Cancel cloud wire

- [ ] NOTES: `cloudEnabled=false`; Task 07 cancelled unless owner unlocks.

**Commit sequence:**  
`fix(open3d): P06 label/help honesty` → `fix(open3d): projectRef flush` → `test(e2e): W5 UUID save-reload`

**Deep dump:** `plans1/P06-save-honesty/IMPLEMENTATION-PLAN.md` Tasks 00–08 (prefer plans1; plans2 has same residual + stronger leave-flush emphasis).

---

### Task group P04: W4 orbit residual

**Evidence:** `04-orbit-continuity/`  
**Review:** plans1 (wiring unit H2, console H1) + plans2 (FAIL unproven)

- [ ] **P04.00 — Scaffold + THREE-LAYER-AUDIT.md**

| Layer | Meaning | Status target |
|-------|---------|---------------|
| 1 | Defaults ON | Closed in product |
| 2 | Workspace spreads helper | Closed product; **add unit** |
| 3 | Unit + browser + evidence | Open until pack |

- [ ] **P04.01 — Create `workspaceOrbitWiring.test.ts`**

**Create:** `site/tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts`

```typescript
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("workspaceOrbitWiring (layer 2 source lock)", () => {
  it("spreads getOpen3dViewerControlProps and does not force enableControls={false}", () => {
    const src = readFileSync(
      path.join(process.cwd(), "features/planner/open3d/editor/OOPlannerWorkspace.tsx"),
      "utf8",
    );
    expect(src).toContain("getOpen3dViewerControlProps");
    expect(src).not.toMatch(/enableControls\s*=\s*\{\s*false\s*\}/);
  });
});
```

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/workspaceOrbitWiring.test.ts --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\04-orbit-continuity\vitest-wiring-raw.log
```

- [ ] **P04.02 — Pose + orbit unit logs**

```powershell
pnpm exec vitest run `
  tests/unit/features/planner/open3d/poseContinuityW4.test.ts `
  tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx `
  tests/unit/features/planner/open3d/documentViewContinuity.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\04-orbit-continuity\vitest-pose-orbit-raw.log
```

- [ ] **P04.03 — Harden Playwright console contract**  
  Modify `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts`: write `console-messages.txt`; `expect(hardAppErrors).toEqual([])` **or** explicit NOTES deferral — never silent soft-green.  
  Document: browser proves count + orbit attr; **pose ids/mm/rotation are unit-layer**.

```powershell
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=list
```

- [ ] **P04.04 — PNGs + browser-run.json** under `04-orbit-continuity/`

**Stop-if-fail:** R3F port; document radians thrash; Layer-1-only orbit claim.

**Commit:** `test(open3d): P04 W4 wiring unit + orbit evidence`

---

### Task group P05: Symbols re-prove only

**Evidence:** `05-symbols-svg/`  
**Hard:** Do **not** rewrite modular Block2D unless units RED.

- [ ] **P05.00 — Scaffold**

- [ ] **P05.01 — Unit re-prove**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts `
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\05-symbols-svg\01-unit-reprove\vitest-raw.log
```

Expected: **22/22 PASS** (13+9) unless regression.

- [ ] **P05.02 — SVG honesty NOTES** (Block2D ≠ publish `/svg-catalog`)
- [ ] **P05.03 — prim-JSON dumps** pair/slab/none under evidence
- [ ] **P05.04 — CP-05.json** split `symbolQuality` vs `svgHonestySmoke`; non-claim full W2 without P07

**Commit:** `docs(planner): P05 symbols re-prove evidence`

---

### Task group P08: Mesh quality residual

**Evidence:** `08-mesh-quality/` only (never `07-mesh` / `09-mesh`)  
**Hard:** Skip geometry rewrite if formulas/toe present. No designer GLB. No photoreal thrash.

- [ ] **P08.00 — Scaffold + toe re-proof grep** in `modularCabinetV0.ts`
- [ ] **P08.01 — NOTES.md bar** (TOE 100/50, door 18; matrix; residual no handles)
- [ ] **P08.02 — Unit re-runs**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/modularCabinetV0.test.ts `
  tests/unit/features/planner/open3d/modularCabinetV0GlbExport.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\08-mesh-quality\vitest-mesh-raw.log
```

- [ ] **P08.03 — G5 validation honesty** — fix hybrid `valid:true` + `nodeCount:0` if present (honest env or assert without lie)
- [ ] **P08.04 — Headless visual smoke**

```powershell
cd D:\OandO07072026\site
node scripts/p08-cabinet-v0-visual-smoke.mjs
# outputs must land under results/.../08-mesh-quality/
```

  Without inventing door color not in runtime mesh.

- [ ] **P08.05 — run.json + CP-08** path-prove only

**Commit:** `test(open3d): P08 mesh evidence + smoke honesty`

---

### Task group P09: Shortcuts residual (**code residual**)

**Evidence:** `09-shortcuts-chrome/` (never `08-shortcuts-chrome/`)  
**Hard:** Skip invert rewrite if baseline GREEN. Never Dimension→D.

#### Task 09.00 — Scaffold + baseline

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx `
  tests/unit/features/planner/open3d/donorParity.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object ..\results\planner\world-standard-wave\09-shortcuts-chrome\baseline-vitest-raw.log
```

Expected: matrix GREEN (handlers already inverted).

#### Task 09.01 — Skip product invert

- [ ] NOTES: skip Task invert rewrite; matrix green.

#### Task 09.02 — `canvasKeyShortcutsAttribute` (required for W8 PASS)

**Files:**
- Create helper in `canvasTool.ts` (or adjacent)
- Modify `FeasibilityCanvas.tsx` hard-coded `aria-keyshortcuts` → helper
- Unit tests: includes R O M P N; D maps door not dimension

```typescript
// Implement to match live CANVAS_TOOL_SHORTCUTS values
export function canvasKeyShortcutsAttribute(options?: {
  includeCanvasZoom?: boolean;
}): string {
  const letters = Object.values(/* CANVAS_TOOL_SHORTCUTS */).join(" ");
  const workspace = "Tab Escape Control+Z Control+Shift+Z Control+Y Control+K";
  const zoom = options?.includeCanvasZoom === false ? "" : "0 + -";
  return [letters, workspace, zoom].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}
```

Wire FeasibilityCanvas:

```tsx
// Replace stale hard-coded string with:
aria-keyshortcuts={canvasKeyShortcutsAttribute()}
```

NOTES: when `delegateKeyboard=true`, zoom may be listed as ownership documentation.

#### Task 09.03 — Rail a11y extensions

- [ ] Assert Dimension **(M)**, Wall **(W)**; anti Dimension **(D)** forbidden on Dimension control.

#### Task 09.04 — Palette donorParity harden

- [ ] Call `buildPaletteCommands()` zero-arg; full tool-* vs map loop for subset keys.

#### Task 09.05 — Hide-tools inventory

- [ ] CSS/shell scan → likely `chrome-hide-tools: none` in NOTES.

#### Task 09.06 — Final pack

- [ ] Unfiltered logs + `run.json` + CP-09.1–09.6 from data.

**Commit:** `fix(open3d): P09 aria-keyshortcuts + W8 evidence`

**Deep dump:** `plans1/P09-shortcuts-chrome/IMPLEMENTATION-PLAN.md` Tasks 00–06.

---

### Task group P10: Evidence handover (Mode A default)

**Evidence:** `10-handover/`  
**Scope:** Pack / honesty / backup **only** — **no** `site/` product features.

- [ ] **P10.00 — Mode selection**

| Mode | When |
|------|------|
| **A (default)** | Any primary folder missing map-min → FAIL-honest pack |
| **B** | All primaries map-min green on HEAD |
| **Pack-B recover** | Optional from E:/git with **remap** + re-verify every folder |

- [ ] **P10.01 — Six-file pack**

1. `README.md`  
2. `W-GATES.md` — Status from **disk only**  
3. `MASTER-SYNC.md` — honest if MASTER missing (do not invent 94 ticks)  
4. `HEAD.txt`  
5. `FAILURES-SNIP.md` — do not re-certify dead Failures paths as live  
6. `BACKUP-LOG.md` — E: path shape honesty  

- [ ] **P10.02 — Probe all folders** exists + map-min non-empty (empty mkdir ≠ ready)
- [ ] **P10.03 — Mode A content** W-GATES rows FAIL/MISSING until residual DONE; **do not** mark CP-10 PASS in Mode A

```powershell
Test-Path D:\OandO07072026\results\planner\world-standard-wave
Test-Path E:\OandO-backups\trustdata-2026-07-10
```

**Commit:** `docs(planner): P10 handover pack Mode A honesty`

---

### Task group P11: Integration close-out

**Execute:** [P11-CHECKLIST.md](./P11-CHECKLIST.md) entirely.  
**Evidence:** `11-integration-closeout/` + consistency with W folders.

- [ ] Complete all P11 checkboxes.
- [ ] SHIP-HONESTY READY or NOT READY.
- [ ] Include CROSSWALK + DUAL-LANGUAGE (from plans2 strengths) + buyer journey pack (from plans1 strengths).

---

## 6. Test matrix

| Area | Unit | Browser | Expected |
|------|------|---------|----------|
| P01 smoke | hostWiring, orbit, delete, pose, shortcuts | — | PASS logs |
| P02 | fabric flag + orbit default | — | PASS |
| P03 W3 | pick, delete, keyboard, canvas gaps | open3d-w3-select-delete | Both green |
| P07 W1–W2 | — | journey rewrite | Δ wall, opening, cabinet-v0, 2nd SKU |
| P06 | autosave mocks + labels | save-honesty UUID | UUID match |
| P04 | wiring + pose + orbit | open3d-w4 | console hard or deferred |
| P05 | cabinet-v0 + render 22 | optional PNG | PASS |
| P08 | modularCabinetV0 + export | smoke PNG | primary green; G5 honest |
| P09 | 4 suites + aria | optional | matrix + aria green |
| P11 | open3d unit spine | buyer journey | SHIP decision |

---

## 7. False-green catalog (merged)

| ID | Trap | Mitigation |
|----|------|------------|
| FG01 | Phase card PASS without `results/` | Re-prove mandatory |
| FG02 | Unit green = browser green | Dual hard gates |
| FG03 | Configurator as W2 | P07 ban |
| FG04 | Count-only save reload | UUID e2e |
| FG05 | Help account slots lie | P06 rewrite |
| FG06 | Body “Modular Cabinet” = placed | Place CTA identity |
| FG07 | Force includesCabinetV0 true | Forbidden |
| FG08 | Map invert green = W8 PASS | aria residual + evidence |
| FG09 | Historical W-GATES PASS | Disk-only status |
| FG10 | E: restore without re-verify | Remap + re-prove |
| FG11 | Empty mkdir theater | Map-min non-empty |
| FG12 | site/results dumps | layout check |
| FG13 | Dimension→D “fix” | Forbidden |
| FG14 | Soft console W4 | Hard assert or NOTES |
| FG15 | Defaults alone = orbit product | Wiring unit |
| FG16 | G5 valid:true nodeCount 0 | Honest validation |
| FG17 | Silent vitest skip | testing-handbook |
| FG18 | Dual-run plans1 then plans2 | **PlansA only** |

Full extended catalog: see `plans1/EXECUTABLE-PLAN.md` §9 and `plans2/EXECUTABLE-PLAN.md` §8.

---

## 8. Stop-if-fail

| Event | Action |
|-------|--------|
| Layout red with site dumps | Fix dumps first |
| P07 identity uncertain | Fail closed; fix B1/B2 |
| P06 count-only “green” | Reject; require UUID |
| P09 Dimension→D temptation | Reject |
| Any PASS with missing folder | Reject |
| Mode B without D: greens | Convert Mode A |
| Goal change | Stop for owner |

---

## 9. Commit sequence (suggested)

1. `docs(PlansA): merged residual package`  
2. `docs(planner): session zero + results root`  
3. `docs(planner): P01 product-truth re-prove`  
4. `docs(planner): P02 engine-lock freeze`  
5. `test(open3d): P03 W3 residual`  
6. `test(e2e): P07 W1-W2 journey`  
7. `fix/test(open3d): P06 save honesty residual`  
8. `test(open3d): P04 W4 residual`  
9. `docs(planner): P05 symbols re-prove`  
10. `test(open3d): P08 mesh evidence/smoke`  
11. `fix(open3d): P09 aria + W8 evidence`  
12. `docs(planner): P10 handover Mode A`  
13. `docs(planner): P11 integration closeout`  

Push origin when landable; mayoite ~45m. Never force-push.

---

## 10. Risks & owner decisions

| Risk | Mitigation |
|------|------------|
| Executor rewrites green geometry/engines | Residual-only; reviews cite |
| Browser flake walls/openings | Retries; bind Opening to wall; screenshots |
| Happy-dom G5 lies | P08 honesty fix |
| E: path confusion | Remap NOTES |
| Owner silence on P02 signoff | Template B OK |

| Owner decision | Default |
|----------------|---------|
| Cloud autosave | Off / cancel |
| Pack-B recover vs rebuild | Prefer rebuild via residual kill order |
| Ship READY with residual mesh beauty | READY only if manufacturer bar met |

---

## 11. Self-review

| Check | Status |
|-------|--------|
| Both packages covered | Yes — MERGE-NOTES + README coverage table |
| Repo + reviews win | Yes |
| Residual over rewrite paste | Yes |
| Archive Idiots2 + Idiots paths | Yes |
| results missing → re-prove | Yes |
| Checkbox tasks | Yes |
| Full product code dumps for green paths | **Intentionally omitted** |
| Residual code contracts | P06/P07/P09 + P04 wiring |
| No dual-run | Yes FG18 |
| Placeholder scan | No TBD gates |

**Deep plans not duplicated:** open `plans1/P0X-*/IMPLEMENTATION-PLAN.md` only when RED recovery needs full TDD dump.
