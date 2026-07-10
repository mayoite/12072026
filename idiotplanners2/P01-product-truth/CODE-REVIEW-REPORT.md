# CODE-REVIEW-REPORT — P01 Product Truth (idiotplanners2)

**Date:** 2026-07-10  
**Plan:** `idiotplanners2/P01-product-truth/IMPLEMENTATION-PLAN.md`  
**Source brainstorm:** Idiots (wave 1) — live deliverable is `archive/Idiots/P01-product-truth/REPORT.md` (repo-root `Idiots/` **absent**)  
**Reviewer role:** receiving-code-review rigor against **live repo truth** only  
**Scope of this review:** Plan vs disk. **No product code changes. IMPLEMENTATION-PLAN.md not edited.**  
**Reviewer HEAD snapshot:** `cb62c4eb5fff3a0c3e1ea099809b4e7d77d74ecc` · single worktree `D:/OandO07072026` · branch `main`  
**Verdict:** **APPROVE-WITH-FIXES**

---

## Executive summary

- **Correct phase shape:** Inventory-only re-proof under `results/planner/world-standard-wave/00-product-truth/` is the right response to a checkout where **local `results/` is gone** while phase cards / PENDING still claim CP-01 / W-gate PASS. The plan’s dual-state language (CP artifacts vs buyer product), FOLDER-LOCK (`00-` not `01-`), Approach A freeze, no open3d feature edits, and required non-silent vitest smoke are aligned with live authority (`AGENTS.md`, `Plans/Research/RESULTS-MAP.md`, `Plans/phases/P01-product-truth/`).
- **Repo pre-reads are unusually accurate:** Dual host chains, fabric permanent redirects (next.config L206–207), fabric flag exact `"1"`, deleteSelection ~L326, `getOpen3dViewerControlProps` ~L1012, OrbitControls construct ~L171+, `formatAutosaveStatus` local strings, Dimension=`M` / Door=`D`, hostWiringP01 four pure tests — all re-verified on disk with matching path:line anchors.
- **Operational fixes required before / during execute (not conceptual rework):**
  1. **`rg` is not on PATH** in this PowerShell environment — Task 02–04 greps as written hard-fail.
  2. **E: backup exists** but layout is **`results-world-standard-wave/`**, not `results/planner/world-standard-wave/`. Plan recovery text under-specifies the real path; a naive copy path fails even though a full historical pack is present.
  3. **Brainstorm path hygiene:** plan/README cite `Idiots/…`; live path is `archive/Idiots/…`.
- **Do not treat this review as CP-01 pass.** CP-01 remains unproven on this checkout until local `results/planner/world-standard-wave/00-product-truth/` exists with non-empty `INVENTORY.md` + `CONTRADICTIONS.md` + smoke log, HEAD-aligned to current code.
- **Do not rebuild product for P01.** Import-graph fabric-legacy rows, archive rollback README, guest/canvas fabric comments, open3d README route-table drift, and design-spec “no furniture select/delete” are **contradiction inventory**, not mid-phase product fixes.

---

## Repo truth checked (plan claim | reality | status)

### Brutal workspace facts (this review session)

| Check | Live fact | Plan claim | Status |
|-------|-----------|------------|--------|
| Checkout / worktrees | Single worktree `D:/OandO07072026` on `main` | main only, no worktrees | **MATCH** |
| `results/` at repo root | **Missing** (`list_dir` / `Test-Path` false) | Missing → re-prove | **MATCH** |
| `results/planner/world-standard-wave/00-product-truth/` | Missing | Missing → map fail / re-execute | **MATCH** |
| `WAVE.md` / `COMPARISON-CHART.md` | Missing locally | Missing unless restored | **MATCH** |
| Root `ayushdocs/` | **Absent** | Use `Plans/Research/Others/` | **MATCH** |
| `Plans/trustdata/` | **Absent** (cleaned; still in some phase card fossils) | Live = `Plans/phases` + `Plans/Research` | **MATCH** |
| `Plans/Research/checkpoints/CHECKPOINTS.md` | **Absent** | Missing; local `CP-01-LEDGER.md` | **MATCH** |
| Honesty docs | Present under `Plans/Research/Others/*` (git status: `Plans/Others/*` deleted, Research/Others untracked move) | Claims corpus live paths | **MATCH** |
| Root `Idiots/` | **Absent** | Inputs cite `Idiots/P01-…` | **MISMATCH (path)** |
| `archive/Idiots/P01-product-truth/REPORT.md` | **Present** (wave 1) | Not named as live path | **Plan path stale** |
| `E:\OandO-backups\trustdata-2026-07-10\` | **Present** | Optional restore | **MATCH (available)** |
| E: layout for wave | `…/results-world-standard-wave/00-product-truth/` (+ full sibling dirs, WAVE, TRUTH-LOCK, gate-e2e) | Implies generic `world-standard-wave/00-product-truth` under backup root | **MISMATCH (layout)** |
| E: historical HEAD (pack HEAD.txt) | `e3905cf5600a46613a2f4129bd43a9323a28bced` (ahead of old tip) | Must re-verify vs current HEAD | **HEAD-stale pack** |
| Current HEAD | `cb62c4eb5fff3a0c3e1ea099809b4e7d77d74ecc` | Executor records into HEAD.txt | **OK process** |
| `rg` on PATH | **Not available** | Assumed in PowerShell tasks | **MISMATCH / exec risk** |
| `site/results/` gitignore | Root `.gitignore` forbids `site/results/` only; root `results/` not ignored | Evidence under root `results/` | **MATCH (safe to commit)** |

### Production open3d + hosts (plan §1.2–1.4)

| Plan claim | Repo reality | Status |
|------------|--------------|--------|
| Live tree `site/features/planner/open3d/` | Exists; ~**143** files (recurse, no node_modules) | **OK** |
| Top-level roles (feasibility, fabric-stage, editor, 3d, catalog, model, persistence, ui, lib, shared, store, ai, cleanup) | All present | **OK** |
| Archive `site/features/planner/_archive/fabric/` | Present | **OK** |
| Guest → `Open3dPlannerWorkspaceRoute` → Providers + ProjectSetupGate → Host | `guest/page.tsx` + WorkspaceRoute source verified | **OK** |
| Canvas same shell; guestMode from auth | `canvas/page.tsx` verified | **OK** |
| `/planner/open3d` direct Host, no WorkspaceRoute | `open3d/page.tsx` imports Host only | **OK** |
| Host → NativeHost → OOPlannerWorkspace | Thin wrappers verified | **OK** |
| No `app/planner/fabric` pages | `Test-Path` false; hostWiring asserts same | **OK** |
| Permanent redirect fabric → open3d | `next.config.js` L206–207 permanent true | **OK** |
| Fabric overlay env exact `"1"` | `fabricFurnitureFlag.ts` | **OK** |
| Guest/canvas comments still claim archive fabric fallback | Both page JSDoc still say `archive fallback: /planner/fabric/…` | **OK (seed X05)** |
| Archive README rollback “unchanged” fabric routes | `_archive/fabric/README.md` Rollback lists `/planner/fabric/guest|canvas` | **OK (seed X04)** |
| `importGraphProof` fabric-legacy page nodes | `route-fabric-guest` / `route-fabric-canvas` paths to non-existent pages; comment claims routes “remain legacy fallback”; `fabricRetirementBlocked()` still true | **OK (seed X06; stronger than plan text)** |

### W-gate code surface (plan §1.5) — sample re-verify

| Gate | Plan snapshot | Live re-verify | Status |
|------|---------------|----------------|--------|
| **W1** | walls / door-window tools | `addOpen3dWall` in FeasibilityCanvas; `useDoorWindowPlacement.ts` present | **OK** |
| **W2** | InventoryPanel, placementAction, modularCabinetV0, furnitureBlock2D | All present under open3d | **OK** |
| **W3** | deleteSelection ~326; applySelectionDelete ~112; Del/Backspace ~83–86; pickFurniture | **L326**, **L112**, keyboard **L83–86**, `pickFurnitureAtPoint` in canvasPicking + FeasibilityCanvas | **OK (line-accurate)** |
| **W4** | Orbit default ON; workspace force props ~1012; OrbitControls ~171 | `orbitDefaults.ts` true; OOPlannerWorkspace **~1012**; ThreeViewerInner **171–176** construct | **OK** |
| **W5** | createAutoSaver + flush pagehide/visibility/unmount | `useOpen3dWorkspaceAutosave.ts` L33–74 + createAutoSaver from `@/features/planner/persistence/persistence` | **OK** |
| **W6** | formatAutosaveStatus local-only | L31–40 guest/member local strings; TopBar also hardcodes “Saved locally” (~232) | **OK** (+ note TopBar dual string surface) |
| **W7** | modular + scene nodes | modularCabinetV0, createSceneObjectFromNode, buildOpen3dSceneNodes present | **OK** |
| **W8** | CANVAS_TOOL_SHORTCUTS; Dimension M not D | canvasTool.ts L28–38: dimension `M`, door `D` | **OK** |
| Entity IDs | newEntityId / crypto UUID | `site/features/planner/lib/newEntityId.ts` = `crypto.randomUUID` only; FeasibilityCanvas imports it | **OK** |

### Tests / package / commands (plan §1.6–1.7)

| Plan claim | Repo reality | Status |
|------------|--------------|--------|
| Unit root `site/tests/unit/features/planner/open3d/` | Large suite present (hostWiringP01, keyboard, threeViewer, feasibility, saveReload, status labels, applySelectionDelete, poseContinuityW4, orbitControlsDefault, toolShortcutTruth, catalog/modular/workstation, etc.) | **OK** |
| `hostWiringP01.test.ts` dual entry + redirect + flag | 4 `it` blocks; matches plan expectation | **OK** |
| E2E open3d-world-standard-journey, w3, w4, save-honesty, systems-v0-batch-place | All present under `site/tests/e2e/` | **OK** |
| Related e2e admin-svg-publish-p01, sketch-to-plan-pipeline | Present | **OK** |
| `playwright-open3d-world-specs.json` | Present under `site/config/build/` | **OK** |
| Scripts `test:e2e:open3d-world`, `gate:open3d` | In `site/package.json` | **OK** |
| Package name `oando-site` | Confirmed | **OK** |
| `test:planner` = `vitest run planner` | Exists (broader optional capture) | **OK** |
| Specs in tree ≠ browser green | Correct; RESULTS-MAP requires `results/planner/` artifacts | **OK** |
| Parent persistence path for W5 greps | `site/features/planner/persistence` exists | **OK** |

### Claims corpus / phase authority

| Plan claim | Repo reality | Status |
|------------|--------------|--------|
| Phase card DONE / CP-01 PASS / smoke 27/27 | `Plans/phases/P01-product-truth/P01-product-truth.md` status table | **OK stale narrative** |
| RESULTS-MAP minimum INVENTORY + CONTRADICTIONS under `00-product-truth/` | Confirmed in `Plans/Research/RESULTS-MAP.md` | **OK** |
| Design “no furniture select/delete” | Still in design spec ~L21 | **OK (seed X07)** |
| 00-PENDING GATE PASS + product not finished | Live; also cites E: backup + missing local results | **OK dual-state** |
| Key-files matrix (Task 01 list) | All 22 paths **True** in this session | **OK** |
| Claim sources list | All listed honesty/docs paths **True** except WAVE (missing locally) | **OK** (WAVE = MISSING FILE branch) |

### Key-files matrix (executed this review)

All plan Task 01 key paths returned **True**, including hosts, open3d cores, archive fabric, next.config, hostWiringP01, guest/canvas/open3d pages.  
**False (expected):** `ayushdocs`, `Plans/trustdata`, `Plans/Research/checkpoints/CHECKPOINTS.md`, `results`, root `Idiots/…`.

---

## Findings

### Blocking

_None that invalidate the plan architecture._  
Inventory-only scope, evidence folder contract, and no-product-edit rule are sound. Execute after the High fixes below (or apply them inline without rewriting product).

### High

#### H1 — `rg` assumed; not on PATH on this machine

- **Claim:** Tasks 02–04 run `rg -n … | Set-Content …` for host wiring, W1–W8, fabric flag.
- **Verified:** `Get-Command rg` → **not available** in this PowerShell session.
- **Judgment:** As written, greps **hard-fail** before any CAPABILITY-MATRIX / ROUTES substance. This is an executor environment trap, not a product-truth conceptual error.
- **Action for implementer:**
  - Prefer `pnpm exec` / install ripgrep **or** replace with PowerShell `Select-String -Path … -Pattern … -Recurse` (or `git grep -n`) writing the same artifact filenames.
  - Do **not** skip greps and invent empty `wN-*-rg.txt` files (false-green).
  - Log tool used in `run.json` (`"grepTool": "select-string|rg|git-grep"`).

#### H2 — E: restore path / layout under-specified; pack is real but HEAD-stale

- **Claim:** Task 00 recovery: `Test-Path E:\OandO-backups\trustdata-2026-07-10` then copy `world-standard-wave/00-product-truth` if pack present.
- **Verified:**
  - Backup root **exists**.
  - Live layout: `E:\OandO-backups\trustdata-2026-07-10\results-world-standard-wave\00-product-truth\` (**34 files**, includes INVENTORY, CONTRADICTIONS, greps, smoke logs, run.json).
  - **Not** under `E:\…\results\planner\world-standard-wave\…`.
  - Sibling wave dirs present on E: (`02-browser-open3d-journey`, `03-select-delete`, `04-orbit-continuity`, `gate-e2e`, `WAVE.md`, `TRUTH-LOCK.md`, etc.).
  - Pack `HEAD.txt` records commit `e3905cf…` and dirty tree notes — **not** current `cb62c4e…`.
  - Historical INVENTORY claims browser PASS for W3 and journey packs; raised-bar files `BUYER-HARD-STOP.md` / `P02-FREEZE-LIST.md` **absent** from historical pack.
- **Judgment:** Plan correctly requires re-proof when local results missing, but recovery steps can **miss a full restore** or **copy-only 00** while PENDING claims depend on sibling folders. Treating restored INVENTORY browser PASS without HEAD re-verify is **false-green**.
- **Action for implementer:**
  1. Restore map:  
     `E:\OandO-backups\trustdata-2026-07-10\results-world-standard-wave\` →  
     `D:\OandO07072026\results\planner\world-standard-wave\`  
     (at least `00-product-truth`; prefer whole wave for browser-column honesty).
  2. Record restore in `run.json.recovery` with **actual source path**.
  3. Re-run key-files, hostWiring, capability smoke against **current HEAD**; rewrite matrix browser column only where restored sibling packs exist **and** are still honest vs code.
  4. Gap-fill raised bar (`BUYER-HARD-STOP.md`, `P02-FREEZE-LIST.md`) even if old pack is copied.
  5. Never claim CP-01 pass solely because E: had a green run.json from 2026-07-09.

#### H3 — Brainstorm / appendix path `Idiots/` is wrong on this checkout

- **Claim:** Inputs / Appendix A: `Idiots/P01-product-truth/REPORT.md`.
- **Verified:** Root `Idiots/` false; `archive/Idiots/P01-product-truth/REPORT.md` true. Content matches wave-1 program (idiotplanners2 README: Idiots not Idiots2).
- **Judgment:** Path hygiene only; plan content is grounded in the archive report’s raised bar (buyer hard stop, freeze list, false-green traps). Executor who `Test-Path Idiots` and stops is wrong.
- **Action for implementer:** Read `archive/Idiots/P01-product-truth/REPORT.md`. Do not open Idiots2 for this tree.

### Medium

#### M1 — open3d README route table is a live docs-overclaim not fully seeded

- **Claim:** Plan seeds guest comments, archive rollback, importGraphProof; README live 2D = Feasibility is “supported”.
- **Verified:** `site/features/planner/open3d/README.md` route table still says guest/canvas → `Open3dPlannerHost` (omits WorkspaceRoute + ProjectSetupGate) and `/planner/fabric/*` → archive fallback (not permanent redirect to open3d).
- **Judgment:** Material CLAIMS-REGISTER / CONTRADICTIONS row missing from plan seed list.
- **Action for implementer:** Add claim rows for README dual-entry omission + fabric URL myth. Do not “fix README” in P01 unless owner unlocks docs-only edits.

#### M2 — `importGraphProof` is stronger than “stale path list”

- **Claim:** Plan X06: fabric-legacy page nodes do not exist.
- **Verified:** Also `fabricRetirementBlocked()` returns true while redirects already killed pages; graph comment still markets “legacy fallbacks”.
- **Judgment:** Inventory must flag **retirement-gate logic** as false-blocked, not only missing paths.
- **Action for implementer:** CONTRADICTIONS row for `fabricRetirementBlocked` semantics; P02 freeze: do not thrash “Fabric still live because graph says so”.

#### M3 — Three / R3F wording ambiguity

- **Claim:** Plan freezes **imperative** ThreeViewerInner; research may say “Three + R3F”.
- **Verified:** README + NativeHost comments say “Three/r3f”; live 3D path is imperative `ThreeViewerInner` + lazy dynamic import of three/OrbitControls (no R3F Canvas product path in open3d 3d/).
- **Judgment:** Engine freeze is correct; claims corpus should record package-family wording vs implementation shape (brainstormer X07).
- **Action for implementer:** INVENTORY engine table: “implementation = imperative Three; do not mid-gate R3F rewrite.”

#### M4 — W6 honesty surface is dual (labels helper + TopBar hardcode)

- **Claim:** Plan centers `formatAutosaveStatus` as honesty authority.
- **Verified:** Workspace status strip uses `formatAutosaveStatus` (~909); TopBar also contains literal “Saved locally” (~232).
- **Judgment:** Not a contradiction if both stay local-only; inventory should note **two UI surfaces** so later cloud lie can’t land in only one.
- **Action for implementer:** CLAIMS / NOTE-OOPlannerWorkspace mention both.

#### M5 — Historical E: INVENTORY is more optimistic than plan’s default browser-missing rule

- **Claim:** Plan: browser column defaults `browser-missing` until artifacts under `results/planner/`.
- **Verified:** E: INVENTORY claims W3 browser PASS via `03-select-delete/`, journey packs, etc.
- **Judgment:** After restore of **full wave**, browser-missing can be upgraded **only** with path cites to restored packs + honesty that they may predate HEAD. Partial restore of `00-product-truth` alone must keep browser-missing for W proofs.
- **Action for implementer:** Follow plan’s stricter default unless siblings restored and spot-checked.

#### M6 — Task 00 “copy only 00-product-truth” vs PENDING / RESULTS-MAP multi-folder narrative

- **Claim:** Optional restore of only product-truth folder.
- **Verified:** 00-PENDING and E: wave assume multi-folder evidence spine; browser green for later gates lives outside 00.
- **Judgment:** For P01 alone, 00 is map minimum; for honest CAPABILITY-MATRIX browser column and “scoreboard vs missing results” contradictions, whole-wave restore is superior.
- **Action for implementer:** Prefer whole `results-world-standard-wave` → `results/planner/world-standard-wave` then re-verify 00 against HEAD.

#### M7 — Manual buyer script can become paper Pass

- **Claim:** Task 07 BUYER-HARD-STOP manual 15-minute observation table.
- **Verified:** Raised bar is good; risk is agents filling Pass without browser.
- **Judgment:** Accept unobserved / Fail default; never convert to unit-green.
- **Action for implementer:** If no real browser session, mark unobserved; keep browser-missing.

### Low

#### L1 — Appendix A still lists root `Idiots/…` and omits archive path

- Path-only; see H3.

#### L2 — Line anchors will drift

- Plan’s ~326 / ~1012 / ~171 are correct **today**. Executor must re-read after any edit; do not treat plan line numbers as eternal.

#### L3 — `test:planner` is broad

- `vitest run planner` matches more than open3d unit subset; plan correctly marks it optional. Prefer explicit smoke file list for CP-01.

#### L4 — Parallelism appendix optional

- Fine; merger ownership of INVENTORY/CONTRADICTIONS/run.json is mandatory either way.

#### L5 — Phase card still points at `Plans/trustdata/` and root `ayushdocs/`

- Plan already treats these as fossils; executor must not fail preconditions waiting for dead trees.

---

## What already exists (do not re-build)

| Area | Exists | Note |
|------|--------|------|
| Production open3d hybrid planner | Yes | FeasibilityCanvas 2D + Three 3D |
| Dual host entry | Yes | WorkspaceRoute (guest/canvas) vs direct Host (open3d) |
| Fabric permanent redirects | Yes | next.config L206–207 |
| Fabric furniture flag (default OFF) | Yes | exact `"1"` |
| Fabric full stage archive | Yes | `_archive/fabric/` — not live default 2D |
| Select/delete pure + wiring | Yes | applySelectionDelete + deleteSelection + keyboard + pick |
| Orbit default ON + workspace force props | Yes | orbitDefaults + getOpen3dViewerControlProps |
| Local IDB autosave + local labels | Yes | useOpen3dWorkspaceAutosave + formatAutosaveStatus |
| Modular / workstation catalog spines | Yes | code present; quality bar later |
| Shortcut authority map | Yes | CANVAS_TOOL_SHORTCUTS |
| Unit inventory lock | Yes | hostWiringP01 + large open3d unit suite |
| Playwright specs (in tree) | Yes | world-standard pack + W3/W4/save-honesty + systems |
| Package scripts for open3d world e2e | Yes | `test:e2e:open3d-world`, `gate:open3d` |
| Historical evidence pack on E: | Yes | full wave under `results-world-standard-wave/` |
| Phase / design / honesty docs | Yes | Plans/phases, RESULTS-MAP, design spec, Research/Others |

**Do not implement** select/delete, orbit, fabric cutover, mesh raise, or new Playwright product journeys in P01.

---

## What is residual / re-prove only

| Residual | Why |
|----------|-----|
| Local `results/` tree | Absent — CP-01 unproven here |
| HEAD-aligned INVENTORY + CONTRADICTIONS | Must re-create or restore+re-verify |
| Vitest capability smoke log on current HEAD | Required; historical E: logs are not current HEAD proof |
| Browser columns for W1–W8 | Missing locally; E: siblings may restore **historical** browser packs only after path+HEAD honesty |
| BUYER-HARD-STOP + P02-FREEZE-LIST | Raised bar not in historical 00 pack |
| importGraphProof / README / page comment / archive rollback honesty | Code/docs lies remain; inventory only |
| Design-spec “no select/delete” vs handlers | Code-present; buyer-usable still browser-gated |
| Scoreboard / PENDING GATE PASS language | Dual-state forever until product ship |
| CHECKPOINTS.md live ledger | Missing under Plans/Research; use CP-01-LEDGER or restore from E: Plans-trustdata |

---

## False-green / evidence risks

| Risk ID | Trap | Plan control | Residual risk after plan |
|---------|------|--------------|---------------------------|
| FG01 | Phase DONE / CP-01 PASS without artifacts | Task 00 re-open | Low if executor obeys |
| FG02 | Restore E: pack and stamp pass without smoke | Diff vs HEAD + smoke required | **Med** if agent skips re-verify |
| FG03 | unit-green without log | Task 05 Tee-Object + vitestSmoke ≠ pending | Low |
| FG04 | browser-green because e2e specs exist | Explicit browser-missing default | Low |
| FG05 | browser-green from old E: screenshots without sibling restore | Copy-only-00 leaves browser-missing | **Med** if matrix copies historical INVENTORY blindly |
| FG06 | `rg` fails → empty greps committed | Stop-if-fail culture | **High** until H1 fixed |
| FG07 | WAVE narrative as code | CLAIMS three-way orbit | Low (WAVE missing locally anyway) |
| FG08 | Edit product mid-inventory | §4.2 forbidden | Low |
| FG09 | Worktrees | Task 00 worktree list | Low (single worktree confirmed) |
| FG10 | Scoreboard PASS collapse | Dual-state INVENTORY footer | Med in human narration |
| FG11 | Manual buyer table invented Pass | Observation-only | Med |
| FG12 | Treat hostWiring green as full CP-01 | CP-01 needs full pack | Low if checklist followed |
| FG13 | `fabricRetirementBlocked` as “Fabric still required” | X06 seed | Med without M2 row |
| FG14 | Commit evidence under `site/results/` | AGENTS root results only | Low if plan paths used |

---

## Plan quality score (1–10)

**8.5 / 10**

| Dimension | Score | Note |
|-----------|-------|------|
| Repo-first honesty | 9 | Missing results/ayushdocs/trustdata correctly called |
| Path:line accuracy | 9.5 | W3/W4/W6 anchors match live lines |
| Scope discipline | 9 | Inventory-only; no product thrash |
| False-green controls | 9 | Strong catalog + dual-state |
| Executor operability (Windows) | 6 | `rg` + E: layout gaps |
| Raised bar vs brainstormer | 9 | BUYER-HARD-STOP, freeze, A+B+C hybrid |
| Recovery realism | 7 | Mentions E: but wrong nested layout |
| YAGNI | 9 | Does not invent features to “complete” truth |

Deduction is almost entirely **operational recovery/tooling**, not wrong product architecture.

---

## Recommended kill-order adjustments

Plan §2.4 kill order after CP-01 green:

> P02 engine lock → P03 W3 → P07 journey → P06 save → fill P04/P05/P08/P09 → P10

**Adjustments for THIS checkout:**

1. **Before P02:** Finish P01 pack on disk (restore E: whole wave **or** full re-run Tasks 00–08) + HEAD smoke + ready-for-review. Do not start P02 implementation on chat claims.
2. **Restore preference:** Prefer whole-wave restore from  
   `E:\OandO-backups\trustdata-2026-07-10\results-world-standard-wave\`  
   then **re-verify** 00 against current HEAD; do not treat 2026-07-09 INVENTORY browser PASS as eternal.
3. **P02 freeze content:** Lock Feasibility live 2D, Fabric dest+flag OFF default, fabric URLs = redirect, imperative Three, orbit product ON, local IDB honesty, degrees rotation, Approach A — as plan Task 07. Add: **importGraphProof fabric-legacy is not proof Fabric is live**.
4. **P03 still next for buyer-visible select/delete** even if unit + historical browser packs exist — re-prove under current HEAD if e2e residual claims disagree with 00-PENDING residual notes.
5. **Do not** reorder to Fabric-first or chrome-first.
6. **Do not** run Playwright world pack inside P01 for a green claim; list specs only (plan correct).

---

## Bottom line

**Verdict: APPROVE-WITH-FIXES.**

This idiotplanners2 P01 plan is a strong, repo-grounded inventory re-open plan. It correctly refuses to treat missing local `results/` as CP-01 forever, correctly freezes dual-host and Fabric-redirect truth, and correctly forbids product edits while mapping W1–W8 code surface. Pre-read line numbers and file existence claims largely **match live code**.

Execute with three non-negotiable implementer fixes:

1. **Grep without `rg`** (or install it) — never empty-file green.  
2. **Restore from real E: layout** `results-world-standard-wave/` → `results/planner/world-standard-wave/`, then re-smoke/re-diff vs current HEAD; gap-fill raised-bar artifacts.  
3. **Read brainstorm at** `archive/Idiots/P01-product-truth/REPORT.md`, not root `Idiots/`.

**Top 3 findings:**

1. **`rg` missing on PATH** — Task 02–04 greps fail as written (High).  
2. **E: backup layout mismatch + HEAD-stale full historical pack** — recovery under-specified; blind restore or skip both cause false-green (High).  
3. **Brainstorm path + open3d README / importGraphProof honesty depth** — path `Idiots/` wrong; README route table and `fabricRetirementBlocked` need explicit contradiction rows (High/Medium).

**This review is not CP-01 pass.** Land evidence under root `results/planner/world-standard-wave/00-product-truth/` only; then reviewer closes CP-01.

---

## Appendix — Commands / checks run this review

```text
Test-Path key files (plan Task 01 list + claims sources + absences)
list_dir open3d, app/planner, unit open3d, e2e
read guest/canvas/open3d pages, Host, WorkspaceRoute, NativeHost, hostWiringP01
grep next.config fabric redirects; open3d symbols (deleteSelection, OrbitControls, formatAutosaveStatus, …)
read importGraphProof, fabricFurnitureFlag, canvasTool, orbitDefaults, useOpen3dWorkspaceAutosave, archive fabric README
Test-Path E:\OandO-backups\trustdata-2026-07-10 + list results-world-standard-wave + 00-product-truth
git rev-parse HEAD; git worktree list; Get-Command rg
read plan full; archive/Idiots P01 REPORT (partial + structure); RESULTS-MAP; phase P01 header; 00-PENDING
```

**Reviewer did not:** edit IMPLEMENTATION-PLAN.md; edit `site/features/planner/open3d/**`; claim browser green; restore results into the workspace (review-only).
