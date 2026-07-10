# P09 — Shortcuts & Blocking Chrome (**W8**)

> **For agentic workers:** REQUIRED: `/using-superpowers` + **TDD** + **verification-before-completion**.  
> **No worktrees.** Main checkout `D:\OandO07072026` only. Commit each landable slice. Push only on owner ask.  
> **W0 UNLOCKED** — implement per phase + evidence. Do not re-ask owner unlock.  
> Checkboxes (`- [ ]`) track progress.

### Expert pass P0 (2026-07-09)

- **Handler = map (smoking gun):** `useWorkspaceKeyboard` imports `CANVAS_TOOL_SHORTCUTS` but arms tools via a **second hard-coded** letter table. Live: **D → dimension** (map = door), **M unbound** (map = dimension), **N/T unbound**. Invert map once; delete per-letter tool `if`s.
- **Product letters locked:** D=door · M=dimension · O=opening · N=window · T=text · V/R/W/P/H as map. All map letters must `setTool(id)`.
- **Live keydown matrix** — `toolShortcutTruth.test.ts` + keyboard RTL; `toolFromShortcutKey` alone is insufficient (map-true, handler-false today).
- **`aria-keyshortcuts` honesty** — derive from map + only **wired** non-tool keys (Feasibility string stale). Forbidden “fix”: rebind Dimension → **D**. Evidence: **`09-shortcuts-chrome/`** only.
- Authority: [EXPERT-PASS.md](../../reviews/EXPERT-PASS.md) · `06-ui-shortcuts.md`.

**Goal:** Make every tool **id → shortcut key → keyboard handler → visible label** tell the same truth (gate **W8**), and fix **only** Phase-2A chrome defects that **hide or block** canvas tools. No full chrome redesign.

**Architecture:** Single authority maps in `canvasTool.ts` (`CANVAS_TOOL_SHORTCUTS`, `CANVAS_TOOL_LABELS`) drive `useWorkspaceKeyboard`, `toolFromShortcutKey`, `CanvasToolRail` aria/title/shortcut badges, palette tool rows, and canvas `aria-keyshortcuts`. Handlers must not hard-code a divergent key table. Letter tools arm by **inverting the map once** (import is already present; today it is used only by `toolFromShortcutKey`).

**Tech stack:** Next.js site · Vitest · React Testing Library · Phosphor · existing open3d workspace (FeasibilityCanvas + OOPlannerWorkspace). No new packages.

**Parent:** [INDEX.md](../../INDEX.md) · [00-START.md](../../00-START.md) · design `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` (§2 **W8**, Approach A pulls 2A blockers that hide tools).  
**Suggestions applied:** [phases/P09-shortcuts-chrome/P09-suggestions.md](./P09-suggestions.md).

**Evidence root (canonical):** `results/planner/world-standard-wave/09-shortcuts-chrome/`  
(See [RESULTS-MAP.md](../../RESULTS-MAP.md), [CHECKPOINTS.md](../../checkpoints/CHECKPOINTS.md), [FOLDER-LOCK](../../reviews/FOLDER-LOCK-suggestions.md). Do **not** use `08-shortcuts-chrome/` — that retired name collides with mesh `08-mesh-quality/`.)

**Checkpoint:** **CP-09** (this file bottom + `checkpoints/CHECKPOINTS.md`).

---

## Scope (hard)

### In scope

| Slice | What |
|-------|------|
| **W8 truth table** | Unit map: every rail/palette tool id → key → `setTool(id)` (or documented non-tool action) |
| **Lying handlers** | Fix mismatches: **D** map=door / handler arms **dimension**; **M** map=dimension / **handler unbound**; also map letters **N** (window) and **T** (text) currently **unbound** |
| **Rail chrome** | Regression guard: `CanvasToolRail` label + shortcut badge + `aria-label` / `title` stay on authority maps (already map-sourced today — do not “fix” by inventing hard-codes) |
| **Keyboard** | `useWorkspaceKeyboard` implements authority map (no second secret letter table) |
| **Canvas a11y string** | `aria-keyshortcuts` includes all authority tool letters + only non-tool keys that are **actually wired** |
| **2A blockers that hide tools only** | CSS/layout/a11y that prevent reaching tools (rail covered, `display:none` at interactive breakpoints, focus trap, unlabeled control stealing keys with no escape). Proof-first in NOTES before any CSS edit. |

### Out of scope (do not expand)

- Full Approach **C** / Phase **2A** polish (RAC drawers, premium topbar redesign, mobile redesign)
- Full a11y sweep A1–A8 from `ayushdocs/06-A11Y-OPEN3D.md` (nested `main`, heading hierarchy, favorites naming) **unless** a finding **hides tools**
- Fabric cutover, mesh quality, select/delete product behavior (P03), orbit (P04), save honesty (P06)
- Redesigning which tools exist on the rail (keep current product set: select, pan, room, wall, opening, dimension, placement + zoom-to-fit)
- Expanding command palette to list every `PlannerTool` (palette may stay `CanvasTool` subset; shortcuts for that subset must not lie)
- Redesigning dual keyboard surfaces (`FeasibilityCanvas` local keys when `delegateKeyboard` is false) beyond logging if both fire and break W8
- Competitor UI copy; new shortcut philosophy “because SketchUp does X”
- Forbidden “fix”: rebinding **labels/map** so Dimension becomes **D** to match the bad handler

---

## Repo data truths (read before coding)

### Authority maps today

`site/features/planner/open3d/editor/canvasTool.ts`:

| Tool id | `CANVAS_TOOL_SHORTCUTS` | `CANVAS_TOOL_LABELS` | On rail? |
|---------|-------------------------|----------------------|----------|
| select | V | Select | yes |
| pan | H | Pan | yes |
| room | R | Room | yes |
| wall | W | Wall | yes |
| opening | O | Opening | yes |
| dimension | **M** | Dimension | yes |
| placement | P | Place | yes |
| door | **D** | Door | no (palette / legacy `CanvasTool`) |
| window | N | Window | no |
| text | T | Text | no |

### Handler truth today (the lie + gaps)

`site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`:

| Key | Handler does | Map / label claim | Verdict |
|-----|--------------|-------------------|---------|
| V | `setTool("select")` | select | OK |
| R | `setTool("room")` | room | OK |
| W | `setTool("wall")` | wall | OK |
| O | `setTool("opening")` | opening | OK |
| **D** | `setTool("dimension")` | door | **LIE** |
| **M** | unbound | dimension | **LIE** |
| **N** | unbound | window | **GAP** |
| **T** | unbound | text | **GAP** |
| P | `setTool("placement")` | placement | OK |
| H | `setTool("pan")` | pan | OK |
| Space | temporary pan | (gesture) | OK if documented |
| Delete/Backspace | `deleteSelection` | (action) | not a tool label; keep |
| Tab | toggleView | navigation | keep |
| Ctrl/Cmd+K | openPalette | navigation | keep |
| Ctrl/Cmd+Z / Y / Shift+Z | undo/redo | actions | keep |
| Escape / Enter | cancel / commit | actions | keep |

**Smoking gun:** `CANVAS_TOOL_SHORTCUTS` is imported in the hook file but letter arming is a **second hard-coded table**. Only `toolFromShortcutKey` reads the map → **D → door**, **M → dimension** (map-true, **mismatches** live keydown for D; M/N/T never reach `setTool`).

`CanvasToolRail` already renders `Label (Key)` from the maps (Dimension badge **M** is correct). User-visible W8 failure: press **D** while rail/status claim Dimension **(M)** / Door **(D)**.

Existing unit expectations (do not “fix” by weakening unless owner redefines the product map):

- `site/tests/unit/features/planner/open3d/workspaceShell.test.tsx` — D→door, M→dimension via `toolFromShortcutKey` only (not live keydown)
- `site/tests/unit/features/planner/open3d/donorParity.test.ts` — D→door, W→wall, V→select, H→pan via `toolFromShortcutKey`
- `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` — palette/undo/editable/disabled only; **no tool letter matrix yet** (must gain one)
- `Failures.md` PLAN-FAIL-0413 note: unique shortcuts **D→door, M→dimension**

### Stale chrome strings

- `FeasibilityCanvas.tsx` `aria-keyshortcuts="V W D T H Tab Escape …"` — omits R/O/M/P; implies old donor set; **must match authority tool letters after fix**
- Zoom keys `0 + -` are wired on **canvas local** keydown when `delegateKeyboard` is false — not on `useWorkspaceKeyboard`. Helper may include them only as **documented non-tool** keys that the canvas surface actually handles; do not invent extra chords.
- Rail shows Dimension **(M)** while keydown **D** arms dimension — handler lie, not a wrong rail string

### Product rule for door vs opening

Rail product tool is **opening** (O), not separate Door button. Legacy `door` / `window` / `text` remain in `PlannerTool` + palette `CanvasTool` list. After fix:

- **D** → `setTool("door")` (map truth; palette “Door tool”)
- **M** → `setTool("dimension")` (map truth; rail “Dimension (M)”)
- **O** → `setTool("opening")` (rail Opening)
- **N** → `setTool("window")`, **T** → `setTool("text")` (map truth; palette / legacy)
- Do **not** rebind D to dimension to “match handler”; rebind handler to match map + tests

### Dual keyboard surface (scope fence)

`FeasibilityCanvas` still has a local `keydown` path (`w` → draw-wall, Escape, undo, zoom `0/+/-`) gated by `delegateKeyboard`. **Do not redesign** this dual surface in P09. On `/planner/open3d` workspace path, tool arming ownership is `useWorkspaceKeyboard`. If both fire and break W8, record in NOTES and apply the **minimal** guard only (no chrome redesign).

---

## File map (touch only these unless a test forces a one-line import)

| Path | Role |
|------|------|
| `site/features/planner/open3d/editor/canvasTool.ts` | Authority: shortcuts + labels + `CANVAS_TOOLS` order; optional pure helper for `aria-keyshortcuts` |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Keydown → handlers; invert map for letter tools; keep `toolFromShortcutKey` |
| `site/features/planner/open3d/editor/CanvasToolRail.tsx` | Regression only: labels / aria / badges stay map-sourced |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | `aria-keyshortcuts` only (no canvas redesign; no dual-keyboard redesign) |
| `site/features/planner/open3d/lib/commands/paletteCommands.ts` | Palette shortcut strings from same maps (subset OK) |
| `site/features/planner/open3d/editor/canvas-tool-rail.module.css` | **Only if** NOTES proves a rule hides the rail at interactive viewports |
| `site/features/planner/open3d/editor/workspace.module.css` / `WorkspaceShell.tsx` | **Only if** shell layout covers or unmounts the rail |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | Add live letter matrix (at least D/M; prefer full map) |
| `site/tests/unit/features/planner/open3d/workspaceShell.test.tsx` | Keep map parity; add rail label assert if needed |
| `site/tests/unit/features/planner/open3d/donorParity.test.ts` | Keep / extend map parity |
| NEW (preferred): `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` | Single pure table + keydown contract (id ↔ key ↔ label ↔ `setTool`) |

---

## Tasks

### Task 00 — Setup / verification baseline

**Skill:** verification-before-completion  
**Files:** evidence folder only

- [ ] **00.1** Create evidence dir: `results/planner/world-standard-wave/09-shortcuts-chrome/`
- [ ] **00.2** From `site/`, run existing keyboard-related unit files and capture raw output (no filter, no silent pass):

```powershell
cd D:\OandO07072026\site
# Prefer repo evidence wrapper if present; else:
pnpm exec vitest run tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx tests/unit/features/planner/open3d/donorParity.test.ts tests/unit/features/planner/open3d/workspaceShell.test.tsx --reporter=verbose 2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\00-baseline-vitest.log
```

- [ ] **00.3** Write `09-shortcuts-chrome/NOTES.md` with: baseline pass/fail counts; paste of the D/M lie + N/T unbound from source line refs; smoking gun (map imported, letter table hard-coded); “execution not started” until unlock.
- [ ] **00.4** Confirm P03–P08 ownership: do not “fix” select/delete by changing Delete shortcut semantics in this phase.

**Done when:** baseline log exists; NOTES lists the known D/M contradiction and N/T gaps with file paths; evidence path is **08-** not 09-.

---

### Task 01 — Unit map: tool id → key → handler (RED first)

**Skill:** TDD  
**Files:**  
- `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` (create)  
- `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` (add letter matrix; at least D/M)  
- keep existing map tests green after later green phase

- [ ] **01.1** Define a pure expected table in the test (mirror authority, do not invent new keys):

```ts
// Expected product truth (W8)
const TOOL_SHORTCUT_TRUTH: Array<{ id: PlannerTool; key: string; label: string }> = [
  { id: "select", key: "V", label: "Select" },
  { id: "room", key: "R", label: "Room" },
  { id: "wall", key: "W", label: "Wall" },
  { id: "opening", key: "O", label: "Opening" },
  { id: "door", key: "D", label: "Door" },
  { id: "dimension", key: "M", label: "Dimension" },
  { id: "placement", key: "P", label: "Place" },
  { id: "pan", key: "H", label: "Pan" },
  { id: "window", key: "N", label: "Window" },
  { id: "text", key: "T", label: "Text" },
];
```

- [ ] **01.2** Assert `CANVAS_TOOL_SHORTCUTS[id] === key` and `CANVAS_TOOL_LABELS[id] === label` for every row.
- [ ] **01.3** Assert `toolFromShortcutKey(key)` and `toolFromShortcutKey(key.toLowerCase())` return `id` for every row.
- [ ] **01.4** Assert **unique** shortcut letters across `Object.values(CANVAS_TOOL_SHORTCUTS)` (no two tools share a key).
- [ ] **01.5** Handler matrix (RTL `renderHook` + `KeyboardEvent`): for **every** row, press `key` without modifiers → `setTool` called with that `id` **exactly once** per press. Especially: **D → door**, **M → dimension**, **N → window**, **T → text** (must **fail** on current code for D/M/N/T).
- [ ] **01.6** Negative: typing in `<input>` does not change tool; `enabled: false` does not bind.
- [ ] **01.7** Mirror minimum live asserts in `open3dWorkspaceKeyboard.test.tsx` so the hook suite alone catches D/M regression.
- [ ] **01.8** Run test → expect RED on D/M (and N/T) handler rows. Save log:

`results/planner/world-standard-wave/09-shortcuts-chrome/01-tool-shortcut-truth-red.log`

**Done when:** RED log proves D/M/N/T handler mismatch; table is the contract for Task 02.

---

### Task 02 — Align keyboard handlers to authority map (GREEN)

**Skill:** TDD · systematic-debugging  
**Files:** `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`

- [ ] **02.1** Remove the hard-coded per-letter `if (key === "d") setTool("dimension")` style tool arming for letters that exist in `CANVAS_TOOL_SHORTCUTS`.
- [ ] **02.2** Implement tool arming from the map only, e.g. invert shortcuts once:

```ts
// Pseudocode — match project style; no `any`
// Build Record<lowerKey, PlannerTool> from CANVAS_TOOL_SHORTCUTS
// On keydown (no mod): if map[key] → setTool(map[key]); preventDefault; return
```

- [ ] **02.3** Keep non-tool handlers with clear precedence: editable guard → Space pan → mod chords (Ctrl+K, undo/redo) → Tab → Delete/Backspace → Escape/Enter → then single-letter tool map. Do not drop Delete/undo while fixing tools.
- [ ] **02.4** Ensure **M** arms dimension, **D** arms door (not dimension), **N** window, **T** text; all other map letters still work.
- [ ] **02.5** Re-run Task 01 suite → GREEN. Log:

`results/planner/world-standard-wave/09-shortcuts-chrome/02-tool-shortcut-truth-green.log`

- [ ] **02.6** Re-run `open3dWorkspaceKeyboard.test.tsx`, `donorParity.test.ts`, keyboard sections of `workspaceShell.test.tsx` → GREEN. Append or separate log `02-regression-keyboard.log`.
- [ ] **02.7** Commit slice: `fix(planner): W8 keyboard handlers match CANVAS_TOOL_SHORTCUTS (D=door, M=dimension)`

**Done when:** green logs exist; no second hard-coded tool letter table remains in the hook.

---

### Task 03 — Rail labels / aria regression (rail chrome only)

**Skill:** TDD  
**Files:**  
- `site/features/planner/open3d/editor/CanvasToolRail.tsx`  
- `site/features/planner/open3d/editor/canvasTool.ts` (labels only if a string is wrong)  
- tests: extend `toolShortcutTruth.test.ts` or small RTL rail test

**Reframe:** Rail is **already** map-sourced (`aria-label={`${label} (${shortcut})`}`, badge from map). This task is a **regression guard**, not a claim that rail strings invent wrong letters.

- [ ] **03.1** Confirm rail uses `CANVAS_TOOL_LABELS` + `CANVAS_TOOL_SHORTCUTS` only. If any hard-coded label/shortcut exists, delete it.
- [ ] **03.2** Add unit test: render `CanvasToolRail` with `activeTool="dimension"` → button accessible name matches `/Dimension \(M\)/`; `activeTool="wall"` → `/Wall \(W\)/`. No button claims Door for M or Dimension for D.
- [ ] **03.3** Icon map: do **not** redesign icons. Only fix if an icon is wired to the wrong tool id (current `TOOL_ICONS.dimension = Ruler`, `opening = DoorOpen` is acceptable for this phase).
- [ ] **03.4** Guidance strip in `OOPlannerWorkspace` already uses `CANVAS_TOOL_GUIDANCE` + shortcut — spot-check after Task 02 that active tool status matches armed tool + map key. Fix only if a local hard-code lies.
- [ ] **03.5** Run rail + truth tests → GREEN. Log: `03-rail-labels.log`
- [ ] **03.6** Commit slice only if code changed: `fix(planner): W8 tool rail labels match shortcut authority`

**Done when:** no rail control shows a shortcut letter that does not arm that tool (true after Task 02 + this guard).

---

### Task 04 — Canvas `aria-keyshortcuts` + palette parity

**Skill:** TDD · a11y (minimal)  
**Files:**  
- `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`  
- `site/features/planner/open3d/lib/commands/paletteCommands.ts`  
- `site/features/planner/open3d/editor/canvasTool.ts` (optional pure helper)  
- tests as needed

- [ ] **04.1** Replace hard-coded `aria-keyshortcuts="V W D T H …"` with a value derived from authority + **actually wired** actions:
  - All unique values from `CANVAS_TOOL_SHORTCUTS` (must include M, D, O, R, P, N, T, …)
  - Workspace non-tool: `Tab Escape` + mod chords documented (`Control+Z Control+Shift+Z Control+Y`, and palette `Control+K` if exposed on the surface)
  - Canvas zoom `0 + -` only if this attribute remains on the canvas element that still owns those keys when not delegated
  - Prefer pure helper e.g. `canvasKeyShortcutsAttribute()` next to `canvasTool.ts` so the string cannot drift
  - **Do not** claim letters absent from map or unowned by any live handler
- [ ] **04.2** Unit-test the helper: includes `M` and `D` and `O` and `R` and `P` (and N/T); does not invent unknown tool letters.
- [ ] **04.3** Palette: every `tool-*` command `shortcut` field must equal `CANVAS_TOOL_SHORTCUTS[tool]`. `runPaletteCommand("tool-door")` → `setTool("door")` remains. Palette may stay on `CanvasTool` subset — **do not** rebuild palette UX to list opening/dimension/room.
- [ ] **04.4** Align `donorParity` / palette tests if signature drift exists (`buildPaletteCommands` arity) — minimal fix so suite reflects real exports; no feature creep.
- [ ] **04.5** Log: `04-aria-palette.log`
- [ ] **04.6** Commit slice: `fix(planner): W8 aria-keyshortcuts and palette shortcuts match maps`

**Done when:** AT-facing shortcut lists and palette rows cannot disagree with the keyboard map.

---

### Task 05 — 2A chrome blockers that **hide tools** only

**Skill:** a11y · systematic-debugging · chrome-devtools (if browser unlock)  
**Files:** only paths proven to hide tools

- [ ] **05.1** Inventory (read-only first) — document in NOTES.md whether tools are reachable:

| Check | How | Hide-tools? |
|-------|-----|-------------|
| Tool rail mounted on `/planner/open3d` | DOM `nav[aria-label="Canvas tools"]` / `.pw-tool-rail` | If missing → blocker |
| Rail `display:none` / zero size at 1440 and 390 widths | CSS audit `canvas-tool-rail.module.css` + shell | print-only hide OK; interactive hide = fix |
| Overlay steals all clicks from rail | z-index / backdrop | fix z-index or pointer-events only |
| Keyboard cannot arm tools because focus stuck in unlabeled field | Tab order smoke | fix **only** the trap that blocks tool keys after blur rules (editable guard already skips inputs) |
| Inventory double-name / nested main | a11y report | **Out** unless it removes tool rail from a11y tree |

- [ ] **05.2** Fix **only** confirmed hide/block issues. Examples of allowed fixes:
  - Rail unmounted behind `disabled` with no alternative → enable or provide equivalent control
  - CSS at `(width < 48rem)` that sets `.rail { display: none }` (today it **reflows horizontally** — that is **not** hide; do not break that)
  - Panel backdrop covering rail without dismiss control
- [ ] **05.3** Explicitly **do not**: rewrite TopBar, Vaul drawers, density system, full landmark tree, favorites labels, marketing chrome.
- [ ] **05.4** If zero hide-tools defects found, write that as data in NOTES (`chrome-hide-tools: none`) — do not invent CSS churn. **No CSS edit without a NOTES proof row.**
- [ ] **05.5** Log: `05-chrome-hide-tools.log` (test output and/or browser note)
- [ ] **05.6** Commit only if code changed: `fix(planner): unblock canvas tool chrome (W8/2A hide-tools only)`

**Done when:** NOTES states reachability at desktop + small viewport; either a minimal fix landed or explicit none-found.

---

### Task 06 — Evidence pack + CP-09 gate

**Skill:** verification-before-completion · executing-plans evidence hygiene  
**Files:** `results/planner/world-standard-wave/09-shortcuts-chrome/*`

- [ ] **06.1** Final Vitest run (full truth + keyboard + donor + rail):

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/toolShortcutTruth.test.ts tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx tests/unit/features/planner/open3d/donorParity.test.ts --reporter=verbose 2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\06-final-vitest.log
```

- [ ] **06.2** Optional browser smoke (only if dev server already owner-approved): press D vs M on `/planner/open3d`, screenshot active tool status; store `06-browser-d-m.png` + one-line note. Not a substitute for unit truth table.
- [ ] **06.3** Fill NOTES.md **Results** section:

  - W8: PASS/FAIL  
  - Table: id → key → handler verified (all map letters)  
  - Chrome hide-tools: none | list of fixes  
  - Dual-keyboard note: none | conflict observed  
  - Commits: hashes  
  - Failures logged to root `Failures.md` if any residual lie

- [ ] **06.4** Mark CP-09 below. Do not claim world-standard complete (that is P10).

**Done when:** CP-09 checklist complete; evidence paths real under **09-shortcuts-chrome/**; no “TBD” left in NOTES.

---

## Implementation order (agent)

```
00 baseline → 01 RED truth table → 02 GREEN handlers → 03 rail regression → 04 aria/palette → 05 hide-tools only → 06 evidence/CP-09
```

Parallelism: Task 01 test authoring can start while 00 baseline runs. Do not parallelize 02 with 03 until 02 is green (labels without handler truth re-lie to the user).

---

## Checkpoint **CP-09**

Hard stop — all must be true from **data**, not memory:

- [ ] **CP-09.1** Unit table proves tool id → key → `setTool(id)` for every authority tool (including **D=door**, **M=dimension**, **N=window**, **T=text**).
- [ ] **CP-09.2** No hard-coded keyboard tool letter table diverges from `CANVAS_TOOL_SHORTCUTS`.
- [ ] **CP-09.3** `CanvasToolRail` accessible names use `Label (Key)` from the same maps (regression-green).
- [ ] **CP-09.4** `aria-keyshortcuts` / palette shortcuts match the same maps (no invented tool letters).
- [ ] **CP-09.5** Hide-tools chrome: fixed or documented none-found (proof-first).
- [ ] **CP-09.6** Evidence under `results/planner/world-standard-wave/09-shortcuts-chrome/` with unfiltered logs.
- [ ] **CP-09.7** Landable commits on main checkout; push not done unless owner asked.

**W8 status after CP-09:** PASS only if CP-09.1–09.6 green.

---

## Risk / non-goals reminder

| Risk | Mitigation |
|------|------------|
| “Fix” by changing labels to match wrong handler (Dimension (D)) | Forbidden — map + Failures + tests own D/M |
| Scope creep into full 2A | Task 05 allowlist only; proof-first NOTES |
| Breaking Delete/undo while editing shortcuts | Preserve non-tool branches; regression logs in 02 |
| Palette lists door while rail shows opening | Both valid; keys D vs O must stay distinct |
| Partial fix (only D/M) leaves N/T unbound | Task 01 matrix covers **all** map letters |
| Dual keyboard (canvas local vs workspace) thrash | Scope fence: log only unless W8 broken |
| Wrong evidence folder `08-shortcuts-chrome/` | Canonical **09-shortcuts-chrome/** only (FOLDER-LOCK 2026-07-09) |

---

## Handoff to P10

P10 packs world-standard evidence. P09 contributes:

- `09-shortcuts-chrome/` logs + NOTES with **W8 PASS**
- Commit list for shortcut truth  
- Explicit note if browser smoke deferred to owner

Do not start P10 claims from this file alone.

---

## Expert revision note — 2026-07-09

**Source:** [phases/P09-shortcuts-chrome/P09-suggestions.md](./P09-suggestions.md)  
**Verification:** Live read of `canvasTool.ts` (`dimension: "M"`, `door: "D"`) vs `useWorkspaceKeyboard.ts` (`key === "d"` → `setTool("dimension")`; **m/n/t unbound**). Rail map-sourced; `aria-keyshortcuts` stale; evidence path conflict vs RESULTS-MAP.

**Top 5 applied (this revise):**

1. **S1 (superseded by FOLDER-LOCK)** — First pass aligned to then-RESULTS-MAP `08-shortcuts-chrome/`. **FOLDER-LOCK 2026-07-09** re-canonicalizes W8 → **`09-shortcuts-chrome/`** so mesh alone owns `08-mesh-quality/`. Do not re-apply old S1.
2. **S2** — Full letter gap: D lie + M/N/T unbound in truth table, Task 01.5, CP-09.1.
3. **S4** — Map-only letter arming; smoking gun called out; forbid rebinding labels to match bad handler.
4. **S3** — Task 03 reframed as rail **regression guard** (strings already correct).
5. **S5** — `aria-keyshortcuts` honesty: all map letters + only actually wired non-tool keys (incl. canvas zoom note).

**Also folded:** S6 test ownership (`toolShortcutTruth` + `open3dWorkspaceKeyboard` letter matrix); S7 dual-keyboard scope fence; S8 hide-tools proof-first / no CSS without NOTES; S9 palette subset stay; S10 out-of-scope freeze reinforced.

**Folder lock addendum:** [reviews/FOLDER-LOCK-suggestions.md](../../reviews/FOLDER-LOCK-suggestions.md) — evidence root **`09-shortcuts-chrome/`** only.

**W0 unlocked.** Phase may execute Tasks 00–06; historical “not done” lines below are pre-land planning notes if still present.
