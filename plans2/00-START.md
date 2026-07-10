# 00-START — Session zero (executable start card)

> **For agentic workers:** `/using-superpowers` first. Work only in `D:\OandO07072026` (no worktrees).  
> **Package:** `plans2/` synthesized from **`plans2/`** (idiotplanners1 missing).  
> **Do not** mark any W gate PASS from this card alone.

---

## Purpose

Bootstrap an execute session so residual P01–P11 work starts with:

1. Honest HEAD / dirty-tree truth  
2. Confirmed missing/present evidence  
3. Legal evidence directories  
4. First smoke commands  
5. Clear stop rules and kill order  

---

## Prerequisites

| Requirement | Check |
|-------------|--------|
| Main checkout only | `pwd` / workspace = `D:\OandO07072026` — **never** worktrees |
| Package manager | **pnpm** from repo root (`pnpm-workspace.yaml`) |
| Node deps | `pnpm install` if needed |
| Env | Repo-root `.env.local` from `.env.example` when browser/dev needed |
| Evidence root | **Only** `D:\OandO07072026\results\` — never `site/results/` |
| Skills | `/using-superpowers` + TDD / verification / chrome-devtools as phase needs |
| Source plans | `plans2/` sole residual authority (not `plans1/`, not missing `idiotplanners1/`) |

---

## Already shipped vs residual (repo wins — 2026-07-10)

### Shipped in product code (do not greenfield rewrite)

| Area | Live home | Notes |
|------|-----------|--------|
| open3d workspace | `site/features/planner/open3d/` | Feasibility 2D + Three orbit 3D + inventory + keyboard |
| Hosts | guest/canvas via `Open3dPlannerWorkspaceRoute`; pilot `/planner/open3d` | Dual entry |
| Select / delete / undo | pick + `applySelectionDelete` + keyboard | Mostly landed; gaps in tests/e2e evidence |
| Orbit three-layer | `orbitDefaults` + workspace spread + unit/e2e specs | Code present; evidence missing |
| Block2D cabinet-v0 multi-prim | `furnitureBlock2D.ts` + unit suite | Code past empty-box; evidence missing |
| Mesh toe/carcass/door | `modularCabinetV0.ts` | L2 multi-part present; evidence missing |
| Map-driven shortcuts | `canvasTool.ts` invert + toolShortcutTruth | Residual aria/hide-tools |
| Autosave local IDB | `useOpen3dWorkspaceAutosave` | Residual honesty + id W5 |
| Journey / W3 / W4 / save e2e specs | `site/tests/e2e/open3d-*.spec.ts` | Partial bars; must re-run + harden |

### Residual / unproven (this package)

| Class | Status |
|-------|--------|
| Entire `results/` tree | **MISSING** → re-prove all CP artifacts |
| P01 inventory pack | Must recreate `00-product-truth/` |
| P02 lock pack | Must recreate `01-engine-lock/` |
| P03 unit gaps + browser pack | Mode A close gaps + re-prove |
| P07 journey rewrite to CP-07 bar | Spec exists but **wrong bar** (configurator / guest-only) |
| P06 help lies + id assert + projectRef flush | Real product residual |
| P04/P05/P08/P09 | Primarily **verify + evidence** (+ small residuals) |
| P10 handover | Mode A FAIL-honest **or** H4 restore from E: then Mode B |
| P11 final gate | New close-out after residuals |

**Paper PASS ban:** Phase cards / scoreboards saying DONE without live `results/…` paths = **unproven**.

---

## First commands (session zero)

```powershell
cd D:\OandO07072026

# 1) Identity honesty
git rev-parse HEAD
git status -sb
git log -1 --oneline

# 2) Evidence reality
Test-Path .\results
Test-Path .\results\planner\world-standard-wave

# 3) Source tree present
Test-Path .\plans2/README.md
Test-Path .\idiotplanners1   # expect False

# 4) Layout guard (evidence never under site/)
pnpm run check:layout

# 5) Optional install / env
# pnpm install
# copy .env.example .env.local   # if missing

# 6) Dev server when browser work starts
# pnpm run dev   # http://localhost:3000  · guest /planner/guest/  · pilot /planner/open3d
```

### Capability smoke (does not green any W gate)

```powershell
cd D:\OandO07072026
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d/hostWiringP01.test.ts --reporter=verbose
```

Expected: exit 0 **or** honest red log — never silent skip. Capture log under evidence only **after** creating phase folder (P01 Task 00).

---

## Evidence scaffold (create when executing — empty folders ≠ PASS)

Canonical wave root:

```
D:\OandO07072026\results\planner\world-standard-wave\
```

Create **only when depositing real artifacts** for the active phase (or P10 Mode A pack). Prefer:

```powershell
$wave = "D:\OandO07072026\results\planner\world-standard-wave"
$dirs = @(
  "00-start",
  "00-product-truth",
  "01-engine-lock",
  "02-browser-open3d-journey",
  "03-select-delete",
  "04-orbit-continuity",
  "05-symbols-svg",
  "06-save-honesty\save-reload",
  "08-mesh-quality",
  "09-shortcuts-chrome",
  "10-handover"
)
foreach ($d in $dirs) {
  New-Item -ItemType Directory -Force -Path (Join-Path $wave $d) | Out-Null
}
```

**Forbidden primary names:** `01-product-truth/`, `02-engine-lock/`, `08-shortcuts-chrome/`, `07-mesh-quality/` — see RESULTS-MAP.

Optional session-zero note:

```
results/planner/world-standard-wave/00-start/NOTES.md
```

Contents: Approach **A**, date, agent, HEAD, “results wiped → full re-prove”.

---

## Order of work (binding)

```
00-START (this card)
 → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11
```

| Phase | Gate | Evidence folder |
|-------|------|-----------------|
| P01 | Baseline inventory | `00-product-truth/` |
| P02 | Engine lock | `01-engine-lock/` |
| P03 | **W3** | `03-select-delete/` |
| P07 | **W1–W2** browser | `02-browser-open3d-journey/` |
| P06 | **W5–W6** | `06-save-honesty/` (+ `save-reload/`) |
| P04 | **W4** | `04-orbit-continuity/` |
| P05 | **W2** symbols | `05-symbols-svg/` |
| P08 | **W7** | `08-mesh-quality/` |
| P09 | **W8** | `09-shortcuts-chrome/` |
| P10 | Pack | `10-handover/` |
| P11 | Integration close-out | `11-world-standard-closeout/` **or** extend `10-handover/` with P11 section (see P11-CHECKLIST) |

Deep how: `plans2/EXECUTABLE-PLAN.md` + `plans2/P0X-…/IMPLEMENTATION-PLAN.md`.

---

## Stop rules

| Condition | Action |
|-----------|--------|
| Goal changes (new product area, Fabric full cutover as wave goal) | **Stop** — align with owner |
| Unit green alone used to claim W3 / W1–W2 / W5 browser | **FAIL** — get browser pack |
| Evidence written under `site/results/` | **FAIL** — relocate to root `results/` |
| Fabric flag `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1` during W proofs | **FAIL** for those gates |
| Phase “PASS” claimed without map-minimum files | **FAIL** — paper green |
| P10 agent edits `site/` product for gates | **FAIL** — reopen owning phase |
| Mode B CP-10 PASS with missing D: wave folders | **FAIL** — Mode A or restore first |
| Purchase / new paid seat | **Stop** — owner buys |
| Force-push / delete remote branches | **Stop** — owner only |
| Competitor assets into `site/` | **Stop** — ethics |

---

## Owner decisions (ask if Mode B / cloud / restore)

| ID | Decision | Default if silent |
|----|----------|-------------------|
| D1 | Restore wave from `E:\OandO-backups\trustdata-2026-07-10\` to D: `results/`? | **No auto-overwrite** — either pure re-prove on D: **or** explicit restore then re-prove tip |
| D2 | P10 Mode A FAIL-honest pack now vs wait for all greens? | Mode A allowed anytime for honesty; Mode B only when greens live |
| D3 | P06 Task 07 cloud wire? | **Cancel** — local-only honesty |
| D4 | P04 Playwright deferral if unit green? | Prefer browser green; deferral only with **written** NOTES + owner OK |
| D5 | Fabric full-stage cutover in this wave? | **No** — destination after W gates |
| D6 | Global-standard modules vs finish W residual? | Finish residual spine first (this package) |

---

## Session-zero checkbox checklist

- [ ] Workspace is `D:\OandO07072026` (not a worktree)
- [ ] `git rev-parse HEAD` + `git status -sb` recorded (session NOTES or first phase HEAD.txt)
- [ ] Confirmed `idiotplanners1` absent; working from **`plans2`** + `plans2`
- [ ] Confirmed `results/` present or **MISSING** (if missing → re-prove posture)
- [ ] Read `plans2/README.md` kill order
- [ ] Read `Plans/Research/RESULTS-MAP.md` folder lock (skim)
- [ ] `pnpm run check:layout` exit 0
- [ ] Optional: `hostWiringP01` vitest smoke attempted (log retained later under P01)
- [ ] Active phase chosen = **P01** unless owner overrides
- [ ] Open `plans2/P01-product-truth/IMPLEMENTATION-PLAN.md` + `EXECUTABLE-PLAN.md` Task group P01
- [ ] No product commits planned under wrong phase label
- [ ] Ethics: no `D:\websites` paste into product

---

## Quick links

| Doc | Path |
|-----|------|
| Master plan | `plans2/EXECUTABLE-PLAN.md` |
| P11 gate | `plans2/P11-CHECKLIST.md` |
| Justification | `plans2/CHANGES-JUSTIFICATION.md` |
| Flat board | `plans2/CHECKLIST-MASTER.md` |
| Paths | `plans2/REFERENCES.md` |
| Program index | `Plans/INDEX.md` |
| Commands | `START.md` |
| Failures | `Failures.md` |
