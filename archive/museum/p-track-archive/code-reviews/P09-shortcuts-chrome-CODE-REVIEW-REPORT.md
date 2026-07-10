# P09 Shortcuts Chrome — CODE REVIEW REPORT

| Field | Value |
|-------|--------|
| **Phase** | P09 Shortcuts Chrome (W8 / CP-09) |
| **Date** | 2026-07-10 |
| **Reviewer** | Review agent (repo-first, plan-vs-live) |
| **Mode** | Read-only · no implement · no plan edits |
| **Plan** | `plans1/P09-shortcuts-chrome/IMPLEMENTATION-PLAN.md` |
| **Brainstormer** | `archive/Idiots2/P09-shortcuts-chrome/REPORT.md` (live path; plan cites `Idiots2/…`) |
| **Checkout** | `D:\OandO07072026` main only |

## Verdict

**APPROVE WITH FIXES — residual-only execute**

Ship Task 00 baseline + Task 04 aria helper + Task 03 rail regression extensions + Task 05 hide-tools NOTES + Task 06 evidence. **Do not** re-implement map invert (Task 02 product code is already green). **Do not** claim W8 PASS until `results/planner/world-standard-wave/09-shortcuts-chrome/` exists with unfiltered logs.

---

## Executive summary

Live open3d W8 **core chain is already honest**:

```
tool id → CANVAS_TOOL_SHORTCUTS letter → TOOL_BY_SHORTCUT_KEY invert → keydown setTool(id) → rail Label (Key)
```

Re-proved 2026-07-10 by reading `canvasTool.ts`, `useWorkspaceKeyboard.ts`, `CanvasToolRail.tsx`, and by running:

```
toolShortcutTruth.test.ts
open3dWorkspaceKeyboard.test.tsx
canvasToolRail.a11y.test.tsx
donorParity.test.ts
```

**Result: 4 files, 22 tests, all PASS.** Live keydown matrix includes D→door, M→dimension, N→window, T→text for every map letter.

Historical expert smoking gun (second hard-coded letter table: D→dimension, M unbound) is **gone** from product keyboard. Phase card `Plans/phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md` still describes that lie as “today” — **stale**. Implementation plan correctly treats it as **regression law**, not current bug.

**Residual honesty (not optional for CP-09.4 / CP-09.6):**

1. `FeasibilityCanvas` hard-codes `aria-keyshortcuts="V W D T H Tab …"` — omits R/O/M/P/N; no `canvasKeyShortcutsAttribute` exists.
2. Rail a11y suite only asserts Select (V) and Opening (O) — Dimension (M) / Wall (W) not locked.
3. `donorParity` palette path is shallow (arity drift `buildPaletteCommands(handlers)`; no full palette tool-* map loop; no M/N/T resolver asserts).
4. Evidence tree `results/planner/…/09-shortcuts-chrome/` **absent** on this checkout (`results/` does not exist).
5. Thin owner notes claim **W8 GATE PASS** without re-provable `09-` artifacts → classic false-green.

Plan quality is high: repo-first, skip-if-green branches, forbidden Dimension→D, folder lock `09-` only, false-green catalog, dual-keyboard fence. Execute residual; do not thrash already-green invert.

---

## Repo truth table

| Claim / surface | Live path | Live state 2026-07-10 | Plan accuracy |
|-----------------|-----------|------------------------|---------------|
| Authority maps | `site/features/planner/open3d/editor/canvasTool.ts` | V/R/W/O/**M**/P/**D**/N/T/H unique; labels match product contract | Correct |
| Handler arming | `…/useWorkspaceKeyboard.ts` | Invert-only `TOOL_BY_SHORTCUT_KEY`; no D→dimension branch | Correct (“already map-driven”) |
| `toolFromShortcutKey` | same file | Map invert resolver | Correct |
| Live keydown matrix | `toolShortcutTruth.test.ts` + `open3dWorkspaceKeyboard.test.tsx` | Full 10-letter + critical D/M/N/T; **PASS** | Correct (Task 01/02 skip path) |
| Rail chrome | `CanvasToolRail.tsx` | `aria-label` / `title` / badge from maps; DRAW_TOOLS order matches rail product set | Correct |
| Rail a11y tests | `canvasToolRail.a11y.test.tsx` | Select (V), Opening (O) only | Correct residual (Task 03) |
| Guidance strip | `OOPlannerWorkspace.tsx` | `CANVAS_TOOL_SHORTCUTS[activeTool] · CANVAS_TOOL_GUIDANCE[activeTool]` | Correct |
| `delegateKeyboard` | `OOPlannerWorkspace` → `FeasibilityCanvas` | `true` on open3d path; canvas local keys early-return | Correct |
| Canvas local keys | `FeasibilityCanvas.tsx` | When `!delegateKeyboard`: W, Esc, undo, zoom 0/+/- | Correct fence |
| `aria-keyshortcuts` | `FeasibilityCanvas.tsx` L915 | Hard-coded `V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -` | Correct residual (Task 04) |
| `canvasKeyShortcutsAttribute` | — | **Missing** (grep zero) | Correct |
| Palette | `paletteCommands.ts` | Zero-arg `buildPaletteCommands()`; tool shortcuts from maps; CanvasTool subset | Correct |
| Palette tests | `donorParity.test.ts` | Calls `buildPaletteCommands(handlers)` (ignored arg); partial keys only | Correct residual |
| Hide-tools CSS | `canvas-tool-rail.module.css` | `<48rem` reflow + badge hide; print hide rail; **no interactive tool hide** | Correct (likely none) |
| Evidence `09-` | `results/planner/world-standard-wave/09-shortcuts-chrome/` | **Absent** (`results/` missing) | Correct |
| Fabric keyboard | `hooks/useKeyboardShortcuts.ts`, `_archive/fabric/*` | Archive / non-open3d | Correct out-of-scope |
| Global `?` modal | `site/lib/ui/KeyboardShortcuts.tsx` | Hard-coded Z/F/S etc.; **not** mounted on open3d path in this read | Correct out-of-W8 (NOTES honesty only) |
| Phase card handler lie | `Plans/phases/P09-…/P09-shortcuts-chrome.md` | Still claims D→dimension today | Stale vs live; plan supersedes for execute |
| Brainstormer path | plan cites `Idiots2/P09-…` | Live: `archive/Idiots2/P09-shortcuts-chrome/REPORT.md` | Path drift (M) |
| Thin W8 PASS notes | `Plans/Research/Others/00-PENDING.md`, `19-GOALS-SLICES.md` | Claim W8 PASS | False-green without folder |

### Product letter contract (live = plan)

| id | key | label | Rail | Palette subset |
|----|-----|-------|------|----------------|
| select | V | Select | yes | yes |
| pan | H | Pan | yes | yes |
| room | R | Room | yes | no |
| wall | W | Wall | yes | yes |
| opening | O | Opening | yes | no |
| dimension | **M** | Dimension | yes | no |
| placement | P | Place | yes | no |
| door | **D** | Door | no | yes |
| window | N | Window | no | yes |
| text | T | Text | no | yes |

### Vitest re-proof (this review)

| Suite | Result |
|-------|--------|
| `open3dWorkspaceKeyboard.test.tsx` | 8/8 PASS |
| `toolShortcutTruth.test.ts` | 8/8 PASS |
| `donorParity.test.ts` | 4/4 PASS |
| `canvasToolRail.a11y.test.tsx` | 2/2 PASS |
| **Total** | **22/22 PASS** (~10.4s) |

---

## Findings

### Blocking (B)

| ID | Finding | Evidence | Plan handle |
|----|---------|----------|-------------|
| **B1** | **CP-09.6 / W8 PASS blocked:** no evidence under `results/planner/world-standard-wave/09-shortcuts-chrome/` | `results/` missing on checkout | Task 00 + Task 06 |
| **B2** | **CP-09.4 residual:** canvas `aria-keyshortcuts` is donor-shaped partial truth (class D) | L915 hard-code; omits R/O/M/P/N | Task 04 required before W8 PASS |

No blocking product-handler lie remains (historical smoking gun cleared).

### High (H)

| ID | Finding | Evidence | Plan handle |
|----|---------|----------|-------------|
| **H1** | Thin “W8 GATE PASS” in owner/research notes without re-provable `09-` artifacts | `Plans/Research/Others/00-PENDING.md`, `19-GOALS-SLICES.md` | Plan §1.8 / false-green catalog — re-prove |
| **H2** | Phase execute card still documents live D→dimension / M unbound | `Plans/phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md` §“Handler truth today” | Implementation plan already corrects; **executors must follow idiotplanners plan + repo**, not stale phase prose |
| **H3** | Rail Label (Key) for Dimension (M) / Wall (W) not regression-locked | `canvasToolRail.a11y.test.tsx` only Select + Opening | Task 03 |
| **H4** | Palette honesty shallow | `donorParity` ignores zero-arg API; no full tool-* vs map loop | Task 04 palette asserts |

### Medium (M)

| ID | Finding | Evidence | Plan handle |
|----|---------|----------|-------------|
| **M1** | Brainstormer path: plan says `Idiots2/…`; live is `archive/Idiots2/…` | filesystem | Read archive path; content still valid |
| **M2** | Aria helper default includes zoom `0 + -` while open3d mounts with `delegateKeyboard` (local zoom path inactive) | `OOPlannerWorkspace` `delegateKeyboard` + helper options | Document trade-off; consider `includeCanvasZoom` policy when delegated — plan defaults true “document ownership” (partial honesty class adjacent) |
| **M3** | Aria includes `Control+K` which workspace owns, not canvas local keydown | workspace hook | Acceptable if NOTES states “workspace-wired chords listed on canvas surface”; not second letter table |
| **M4** | `useWorkspaceKeyboard({ … })` receives **inline object every render** → effect deps `[enabled, handlers]` rebind listeners each render | `OOPlannerWorkspace.tsx` ~746–771 | Out of P09 letter truth; optional later stability; plan rewrite preserves same deps pattern |
| **M5** | Task 01 plan snippet includes mod+letter guard test; live `toolShortcutTruth` lacks that case | plan §Task 01 vs test file | Optional add; hook suite covers Ctrl+K/undo; letter arm has `!mod` in code |
| **M6** | Global `KeyboardShortcuts.tsx` invents Z/F/S and other non-map keys | `site/lib/ui/KeyboardShortcuts.tsx` | Correctly out of W8; residual product discoverability risk if ever mounted on open3d |
| **M7** | Opening/door/window share `DoorOpen` icon; text/dimension share `Ruler` | `CanvasToolRail.tsx` icons | Not W8 letter lie; do not thrash in P09 |

### Low (L)

| ID | Finding | Evidence | Plan handle |
|----|---------|----------|-------------|
| **L1** | `runtimeToolFor` maps opening→door, dimension→text for canvas draw mode | `canvasTool.ts` | Plan correctly: W8 = letter → `setTool(PlannerTool id)`, not runtime alias |
| **L2** | Fabric-era tests/rails still exist under archive / old integration paths | `_archive/fabric`, some e2e names | Out of scope |
| **L3** | Plan is long (~full file paste Task 02) despite skip-if-green | IMPLEMENTATION-PLAN size | Useful when RED; executor must obey branch rule |
| **L4** | `feasibilityCommands` action shortcut “W” for draw-wall coexists with tool letter W | `registry.ts` | Separate action surface; plan “do not thrash” |

---

## Already exists (do not re-implement for sport)

| Asset | Status |
|-------|--------|
| `CANVAS_TOOL_SHORTCUTS` / `LABELS` / `GUIDANCE` / `CANVAS_TOOLS` | Product law present |
| Map invert + letter arming in `useWorkspaceKeyboard` | Present; matches plan Step 02 target |
| Full live keydown matrix tests | Present + **GREEN** |
| Hook suite critical D/M/N/T + full map loop | Present + **GREEN** |
| Rail map-sourced `Label (Key)` + badge | Present |
| Palette tool shortcuts from maps | Present |
| Status strip shortcut + guidance | Present |
| `delegateKeyboard` ownership fence | Present |
| Forbidden Dimension→D rebind | Enforced by truth tests |

---

## Residual (executor must close for CP-09)

| # | Work | CP |
|---|------|-----|
| 1 | Create `results/planner/world-standard-wave/09-shortcuts-chrome/` + NOTES + baseline vitest logs | 09.6 |
| 2 | Implement `canvasKeyShortcutsAttribute()`; wire FeasibilityCanvas; tests | 09.4 |
| 3 | Extend rail a11y: Dimension (M), Wall (W), anti Dimension (D) | 09.3 regression |
| 4 | Harden donorParity palette tool-* map asserts; zero-arg call | 09.4 |
| 5 | Hide-tools inventory → `chrome-hide-tools: none` (expected) or minimal fix | 09.5 |
| 6 | Final logs + `run.json` + CP checklist from **data** | 09.1–09.6 |
| 7 | Task 02: **skip product edit** if baseline GREEN (expected) | 09.2 already met in code |

---

## False-green catalog (live risks)

| Trap | Status on this checkout |
|------|-------------------------|
| `toolFromShortcutKey` green alone | Mitigated — live keydown matrix exists and PASSes |
| Thin W8 GATE PASS notes | **Active risk** — re-prove under `09-` |
| Evidence under `08-shortcuts-chrome` | Not present; keep forbidden |
| Map-only without keydown | Mitigated |
| Dimension (D) “fix” | Forbidden; tests would fail map contract |
| Filtered vitest / paper PASS | No evidence folder yet → cannot claim PASS |
| `buildPaletteCommands(handlers)` arity | **Still present**; suite still passes (weak) |
| Global KeyboardShortcuts as W8 proof | Not open3d-mounted; do not use |
| Claiming W8 PASS before aria fix | **Would be false** — aria still stale |
| Phase card “handler lies today” as truth | **False** if read as live; treat as historical |

---

## Score

| Dimension | Score (0–10) | Note |
|-----------|--------------|------|
| Plan vs live honesty | **9.0** | Correctly separates historical law vs residual |
| Scope discipline | **9.0** | No 2A redesign; dual-keyboard fence; no Dimension→D |
| Task branching (skip if green) | **9.0** | Task 00/02 well designed |
| Residual completeness (aria/evidence) | **8.5** | Right residuals; zoom-when-delegated nuance M2 |
| Test strategy | **8.5** | Live keydown mandatory; rail/palette gaps planned |
| Path / input hygiene | **7.5** | Idiots2 → archive; phase card stale |
| **Overall plan ship-readiness** | **8.5** | APPROVE residual execute |
| **W8 product completeness (now)** | **7.0** | Core green; aria + evidence block PASS |
| **CP-09 readiness (now)** | **4.0** | No `09-` pack; CP-09.4 open |

---

## Kill-order (executor)

1. **Task 00** — evidence dir + NOTES + baseline vitest tee (expect GREEN matrix).
2. **Task 02 branch** — document skip; re-run green log only (no invert rewrite).
3. **Task 04** — `canvasKeyShortcutsAttribute` + FeasibilityCanvas wire + palette asserts (**primary product residual**).
4. **Task 03** — rail Dimension (M) / Wall (W) / anti Dimension (D).
5. **Task 05** — CSS/shell inventory → likely `chrome-hide-tools: none`.
6. **Task 06** — final unfiltered pack + `run.json` + CP-09.1–09.6 from data.
7. **Stop-if** — Dimension→D temptation; inventing RED; CSS without hide proof; evidence under `08-`.

---

## Bottom line

**Repo wins:** open3d keyboard arming already inverts `CANVAS_TOOL_SHORTCUTS`. D=door, M=dimension, N=window, T=text are live and tested. Rail and palette subset are map-sourced. Historical dual-table smoking gun is regression law, not current handler bug.

**Plan wins:** residual-only posture, evidence folder law, aria honesty task, hide-tools proof-first, false-green catalog, forbidden rebind.

**Not green for W8 PASS yet:** stale canvas `aria-keyshortcuts`, incomplete rail/palette regression depth, and **zero** `09-shortcuts-chrome` evidence on disk. Owner thin “GATE PASS” claims are not acceptable proof.

**Executor mandate:** residual honesty + evidence only. Do not thrash green invert. Do not redesign chrome. Do not claim W8 until CP-09.1–09.6 are data-green under `results/planner/world-standard-wave/09-shortcuts-chrome/`.

---

## Review artifacts

| Item | Path / note |
|------|-------------|
| Report | `D:\OandO07072026\plans1/P09-shortcuts-chrome\CODE-REVIEW-REPORT.md` |
| Plan reviewed | `…\IMPLEMENTATION-PLAN.md` |
| Brainstormer | `D:\OandO07072026\archive\Idiots2\P09-shortcuts-chrome\REPORT.md` |
| Vitest re-proof | 22/22 PASS (2026-07-10, review agent) |
