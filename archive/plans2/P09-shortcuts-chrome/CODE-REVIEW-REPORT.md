# P09 Shortcuts Chrome (idiotplanners2)

**Date:** 2026-07-10  
**Scope:** Code review only — no product code, no plan edits  
**Plan:** `plans2/P09-shortcuts-chrome/IMPLEMENTATION-PLAN.md`  
**HEAD (review machine):** `cb62c4eb5fff3a0c3e1ea099809b4e7d77d74ecc`  
**Tree:** `main...origin/main`; dirty (unrelated Plans/Others moves + untracked `plans2/`); **`results/` absent**

---

## Verdict

**FAIL — W8 NOT SHIP / CP-09 NOT PASS**

Handler path is largely map-driven and unit contracts for live keydown exist in source. That is **not** W8 ship. Residual product honesty (stale `aria-keyshortcuts`), incomplete rail a11y asserts, zero evidence under `results/planner/world-standard-wave/09-shortcuts-chrome/`, and no CP NOTES mean **CP-09.1–09.6 cannot be green from data**.

**Rule applied:** `results/` missing = unproven. Code green in the repo is not a substitute for the phase evidence pack.

---

## Executive summary

P09 (W8) is a **truth contract**: tool id → shortcut letter → live keydown → `setTool(id)` → visible label / badge / palette / `aria-keyshortcuts` must agree.

| Layer | Plan expectation | Repo 2026-07-10 | Gate impact |
|-------|------------------|-----------------|-------------|
| Authority maps | Locked letters (D=door, M=dimension, …) | Present in `canvasTool.ts` | OK |
| Keyboard arming | Single invert of map | Present (`TOOL_BY_SHORTCUT_KEY`) | OK (code) |
| Live keydown tests | Full 10-letter matrix | Present in `toolShortcutTruth` + hook suite | OK (code); **unproven without logs** |
| Rail `Label (Key)` | Map-sourced + Dimension (M) / Wall (W) asserts | Map-sourced; tests only Select (V) + Opening (O) | **Residual** |
| `aria-keyshortcuts` | Map-driven helper, all letters | **Hard-coded stale** omits R/O/M/P/N; no Control+K | **Blocking residual** |
| Palette tool-* | Map-sourced subset | Map-sourced; donorParity still passes handlers (ignored) | Soft residual |
| Hide-tools NOTES | none-found or fix | CSS read = reflow only; **no NOTES** | **Unproven** |
| Evidence `09-` | Unfiltered logs + NOTES + run.json | **`results/` tree missing** | **Hard fail CP-09.6** |

Historical smoking gun (D→dimension second table; M/N/T unbound) is **closed in live code** and should be treated as **regression law**, not current handler bug. Claiming “handlers fixed ⇒ W8 PASS” is the primary false-green for this phase.

---

## Repo truth table

| Claim (from plan / would-be ship) | Live path | Verified | Status |
|-----------------------------------|-----------|----------|--------|
| `CANVAS_TOOL_SHORTCUTS` product map | `site/features/planner/open3d/editor/canvasTool.ts` L28–39 | Read | **Present** — V/R/W/O/M/P/D/N/T/H |
| Labels + guidance + `CANVAS_TOOLS` rail order | same file L41–77 | Read | **Present** |
| `canvasKeyShortcutsAttribute()` helper | plan Task 04 create | Grep: **zero** product exports | **Missing** |
| Invert `TOOL_BY_SHORTCUT_KEY` | `useWorkspaceKeyboard.ts` L7–12 | Read | **Present** — map-driven |
| Second hard-coded tool letter table | useWorkspaceKeyboard letter arm | Read L107–114 | **Absent** (good) |
| Letter arm → `setTool(tool)` | same | Read | **Present** |
| Non-tool precedence (Space, Tab, Esc, Enter, Del, undo/redo, Ctrl+K) | same L52–105 | Read | **Present** |
| Live keydown full matrix tests | `toolShortcutTruth.test.ts` | Read | **Present** (10 tools + D/M/N/T) |
| Hook suite D/M/N/T + full map | `open3dWorkspaceKeyboard.test.tsx` L121–149 | Read | **Present** |
| Mod-chord negative (Ctrl/Cmd letter not arm) | plan Task 01 optional/mandatory matrix | Grep in open3d unit tests | **Missing** |
| Rail map-sourced aria/title/badge | `CanvasToolRail.tsx` L41–57 | Read | **Present** |
| Rail a11y Select (V), Opening (O) | `canvasToolRail.a11y.test.tsx` | Read | **Present** |
| Rail a11y Dimension (M), Wall (W) | plan Task 03 | Read: only 2 tests | **Missing** |
| Status strip map-sourced | `OOPlannerWorkspace.tsx` ~L875 | Grep | **Present** |
| `delegateKeyboard` on open3d path | OOPlannerWorkspace L934/963; FeasibilityCanvas early return | Read | **Present** |
| Canvas local keys when !delegate | FeasibilityCanvas L434–448 | Read | **Present** (w/Esc/undo/zoom) |
| Stale `aria-keyshortcuts` | FeasibilityCanvas L915 | Read | **Stale** — `"V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -"` |
| Omitted map letters in aria | same | Diff vs map | **R O M P N omitted** |
| Control+K in aria | same | Diff | **Omitted** |
| Palette shortcuts from map | `paletteCommands.ts` L26–32 | Read | **Present** (subset) |
| Palette tool-dimension row | plan allows absence | Read TOOL_IDS | **None** (allowed) |
| `buildPaletteCommands()` zero-arg | paletteCommands L28 | Read | **Yes** |
| donorParity still `buildPaletteCommands(handlers)` | donorParity.test.ts L28 | Read | **Yes** (extra arg ignored) |
| donorParity full tool-* = map loop | plan Task 04 | Read | **Missing** (only wall/Tab samples) |
| workspaceShell D→door M→dimension | workspaceShell.test.tsx | Grep | **Present**; **N/T not in resolver sample** |
| Hide-tools CSS interactive | `canvas-tool-rail.module.css` | Read | **No interactive hide** — `<48rem` reflow + badge hide; print hide only |
| Evidence `results/planner/world-standard-wave/09-shortcuts-chrome/` | plan Task 00/06 | `Test-Path results` | **MISSING entire `results/`** |
| Vitest unfiltered logs 00–06 | evidence folder | — | **None** |
| NOTES.md / run.json / CP table filled | evidence folder | — | **None** |
| Forbidden alias `08-shortcuts-chrome/` | results | — | N/A (no results tree at all) |
| Global `KeyboardShortcuts.tsx` modal | out of W8 gate | Not required for PASS | Out of scope residual |
| Fabric `useKeyboardShortcuts.ts` | not open3d W8 | Not thrash | Out of scope |

### Authority map (live, unchanged)

| id | key | label | Rail | Palette |
|----|-----|-------|------|---------|
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

---

## Findings

### Blocking (B)

**B1 — Evidence tree completely absent (CP-09.6 hard fail)**  
- **Fact:** `results/` does not exist on this checkout; therefore no `results/planner/world-standard-wave/09-shortcuts-chrome/` logs, NOTES, or `run.json`.  
- **Gate:** Plan: “Code green + missing evidence = W8 not shippable.” RESULTS-MAP anti-claim applies.  
- **Impact:** CP-09.1–09.5 cannot be closed from **data** even if code later passes local vitest. P10 must refuse paper W8.

**B2 — Stale hard-coded `aria-keyshortcuts` (Task 04 residual not landed)**  
- **Path:** `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` L915  
- **Value:** `V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -`  
- **Lies / omissions:** omits map letters **R, O, M, P, N**; omits **Control+K**; lists zoom `0 + -` even on delegated workspace path (open3d passes `delegateKeyboard`, so canvas local zoom keys do not run).  
- **Missing:** `canvasKeyShortcutsAttribute()` not in `canvasTool.ts` (plan mandatory; grep empty).  
- **Impact:** AT surface disagrees with keyboard map → W8 honesty fail independent of handler invert.

### High (H)

**H1 — Rail a11y regression incomplete (Dimension M / Wall W)**  
- **Path:** `site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx`  
- **Has:** Select (V), Opening (O)  
- **Missing (plan Task 03 / CP-09.3):** Dimension (M) when active; Wall (W); anti-claim Dimension (D); Door not on rail.  
- **Product code:** `CanvasToolRail.tsx` already builds `` `${label} (${shortcut})` `` from maps — so this is **test gap / regression surface**, not a proven string lie. Still required for CP-09.3 “from data.”

**H2 — CP-09.1–09.5 cannot be marked green without unfiltered run artifacts**  
- Live keydown suites exist in source and *look* complete, but no `00-baseline-vitest.log` / `06-final-vitest.log` / NOTES truth table. Review did **not** re-run vitest into evidence (review-only).  
- Any ship claim that cites “tests exist” without Tee-Object logs is paper.

**H3 — Hide-tools / dual-keyboard ownership not proven in NOTES (CP-09.5)**  
- CSS read supports `chrome-hide-tools: none` at interactive breakpoints (reflow only; print hide allowed).  
- Without Task 05 log + NOTES row, CP-09.5 stays unproven. Browser smoke optional; unit/CSS proof still required as NOTES.

### Medium (M)

**M1 — `TOOL_SHORTCUT_TRUTH` is a second table bound by assertion, but can drift if map grows without test row**  
- Pattern is acceptable if every map key is asserted; suite loops truth → map, not map → truth exhaustively for “no extra keys.” Risk low while `Record<PlannerTool, string>` forces both maps complete. Prefer keep binding; never invent letters only in tests.

**M2 — Mod-held letter negative missing from truth suite**  
- Plan sample includes “does not arm tools when Ctrl/Cmd is held.” Live hook has `!mod` guard; test not present in `toolShortcutTruth.test.ts`. Regression hole for undo/palette interaction class.

**M3 — donorParity palette parity incomplete + arity dirt**  
- `buildPaletteCommands(handlers)` still called; works because JS ignores extra args — false cleanliness.  
- No loop asserting every `tool-*` shortcut equals `CANVAS_TOOL_SHORTCUTS[toolId]`; no explicit “no tool-dimension” lock.

**M4 — workspaceShell resolver sample incomplete for N/T**  
- Asserts V/R/W/O/D/M/P/H; does not list window (N) or text (T). Full coverage lives in other suites — residual hole if someone treats shell suite as sole resolver proof.

**M5 — Zoom tokens on aria while `delegateKeyboard` true**  
- Overlaps B2. Even after helper lands, must use `includeCanvasZoom: !delegateKeyboard` or equivalent honesty.

### Low (L)

**L1 — Global `site/lib/ui/KeyboardShortcuts.tsx` hard-coded SHORTCUTS**  
- Out of P09 CP gate (plan explicit). Optional NOTES honesty only; do not expand W8 scope.

**L2 — Fabric-era / archive keyboard paths**  
- `useKeyboardShortcuts.ts`, fabric archive rails — not open3d W8 surface. Do not thrash.

**L3 — `press()` in hook suite omits `cancelable: true`**  
- `open3dWorkspaceKeyboard.test.tsx` L31 vs truth suite which sets cancelable. Delete/Backspace tests do set cancelable. Minor consistency.

**L4 — Dirty tree / untracked idiotplanners2**  
- Review HEAD is not a clean land snapshot; does not change code facts but weakens “landable commits on main” CP-09.7 narrative until phase work commits.

---

## Already exists (do not re-implement for sport)

| Asset | Path | Note |
|-------|------|------|
| Authority maps + labels + guidance + rail order | `canvasTool.ts` | Locked product letters |
| Map invert + letter arming | `useWorkspaceKeyboard.ts` | Historical second-table bug class **fixed** |
| `toolFromShortcutKey` | same | Used by shell/donor |
| Full W8 keydown matrix | `toolShortcutTruth.test.ts` | All 10 + editable/disabled |
| Hook critical + full map loop | `open3dWorkspaceKeyboard.test.tsx` | D/M/N/T + every map entry |
| Non-tool keyboard suite | same | Ctrl+K, undo/redo, Del, Esc, disabled, editable |
| Rail chrome from maps | `CanvasToolRail.tsx` | aria-label / title / badge |
| Rail a11y partial | `canvasToolRail.a11y.test.tsx` | Select + Opening only |
| Palette map shortcuts | `paletteCommands.ts` | Subset TOOL_IDS |
| Status strip map | `OOPlannerWorkspace.tsx` | shortcut · guidance |
| Dual keyboard fence | workspace `delegateKeyboard` + canvas early return | Do not redesign |
| CSS reflow not hide | `canvas-tool-rail.module.css` | badge hide small; print hide allowed |
| Resolver samples | `workspaceShell` / `donorParity` | Partial vs full matrix |

**Executor posture (plan binding):** verify-only on handlers if matrix green; residual = **aria helper + evidence pack + rail name asserts + hide-tools NOTES**. Do not re-invert the map for sport. Do not rebind Dimension→D.

---

## Residual work (execute path)

Ordered for ship honesty (not ceremony):

1. **Task 00** — Create `results/planner/world-standard-wave/09-shortcuts-chrome/`; NOTES with real HEAD; baseline vitest Tee-Object log; historical vs live residual honesty.  
2. **Task 01–02 verify** — Run truth + keyboard suites; fill NOTES truth table; no rewrite if invert holds.  
3. **Task 03** — Add Dimension (M) + Wall (W) (+ no Dimension (D) / no Door rail) to `canvasToolRail.a11y.test.tsx`.  
4. **Task 04** — Implement `canvasKeyShortcutsAttribute`; wire FeasibilityCanvas; aria tests; palette map loop + arity clean.  
5. **Task 05** — CSS/inventory NOTES; `chrome-hide-tools: none` if still true; no CSS churn without proof row.  
6. **Task 06** — Final unfiltered vitest; `run.json`; CP-09.1–09.6 marked from artifacts only; no TBD.

**Forbidden:** Dimension→D rebind; inventing `08-shortcuts-chrome/`; dual-keyboard redesign; full `?` help sheet as CP blocker; claiming W8 from plan checkboxes alone.

---

## False-green traps (active on this checkout)

| Trap | Why it looks green | Status here |
|------|--------------------|-------------|
| Map + keydown tests exist ⇒ W8 PASS | Missing evidence folder | **Active** |
| Historical smoking gun fixed ⇒ residual closed | Aria still stale; rail asserts partial | **Active** |
| “Shortcuts OK” from keymap file unread | No `09-` artifacts | **Active** |
| Partial rail a11y (Select/Opening) | Dimension/Wall unguarded | **Active** |
| Hard-coded aria lists *some* tools | Omits R/O/M/P/N; wrong zoom honesty | **Active** |
| donorParity builds palette with shortcuts | No full tool-* = map loop; arity dirt | **Active** |
| CSS looks fine in read | Hide-tools not NOTES-proven | **Active** |
| Filtered/monorepo pass without phase logs | No logs at all | **Active** |
| Dimension→D “user habit fix” | Forbidden product lie | Guarded by maps + tests if left alone |
| Wrong folder `08-` | Not created — still don’t | N/A yet |

---

## Score

| Gate / criterion | Score | Notes |
|------------------|------:|-------|
| CP-09.1 Live keydown matrix (code contract) | 8/10 | Suites present; **0/10 as proven** without log |
| CP-09.2 Single map authority (no second table) | 9/10 | Invert live; no D→dimension branch |
| CP-09.3 Rail Label (Key) incl. Dimension M | 5/10 | Product OK; tests incomplete |
| CP-09.4 aria + palette honesty | 3/10 | Palette mostly OK; aria stale |
| CP-09.5 Hide-tools | 4/10 | CSS suggests none; unproven in NOTES |
| CP-09.6 Evidence pack | **0/10** | `results/` missing |
| Overall W8 ship readiness | **2/10** | Residual honesty + evidence dominate |
| Overall code alignment (handlers/maps) | **7/10** | Strong invert + tests; residual aria/tests |

**W8 binary:** **FAIL** (not PASS).

---

## Kill-order

If something must ship next for P09, do **not** open mesh/orbit/save/help-sheet. Kill order:

1. **Evidence scaffold + baseline logs** (proves or falsifies matrix on machine of record)  
2. **`canvasKeyShortcutsAttribute` + FeasibilityCanvas wire** (kills AT/map divergence)  
3. **Rail Dimension (M) / Wall (W) asserts** (locks CP-09.3)  
4. **Palette parity loop + arity clean** (cheap honesty)  
5. **Hide-tools NOTES row** (`none` if true — no CSS theater)  
6. **Final vitest pack + run.json + CP table**  
7. Only then consider optional browser D-vs-M smoke  

Anything that rebinds Dimension→D, redesigns dual keyboard, or claims PASS without `09-shortcuts-chrome/` artifacts is a **kill** (reject).

---

## Bottom line

**Handlers and authority maps already tell the same story in product code; W8 still fails because honesty surfaces and phase evidence do not.** Stale canvas `aria-keyshortcuts`, incomplete rail a11y regression, and a missing `results/` tree make CP-09 a hard **FAIL**. Do not re-implement the invert. Land residual Tasks 00/03–06 with unfiltered logs under **`results/planner/world-standard-wave/09-shortcuts-chrome/` only**, then re-score from disk.

---

## Review metadata

| Item | Value |
|------|-------|
| Review type | idiotplanners2 plan-vs-repo (receiving-code-review posture: verify, no product edit) |
| Plan path | `D:\OandO07072026\plans2/P09-shortcuts-chrome\IMPLEMENTATION-PLAN.md` |
| Report path | `D:\OandO07072026\plans2/P09-shortcuts-chrome\CODE-REVIEW-REPORT.md` |
| Vitest re-run this review | **No** (review-only; evidence absence already blocks green claim) |
| Product files modified | **None** |
| Plan files modified | **None** |
