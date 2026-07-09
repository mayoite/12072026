# P09 — Shortcuts & Blocking Chrome (**W8**)

> **For agentic workers:** REQUIRED: `/using-superpowers` + **TDD** + **verification-before-completion**.  
> **No worktrees.** Main checkout `D:\OandO07072026` only. Commit each landable slice. Push only on owner ask.  
> **Do not implement until owner unlocks execution** (plan-only until then).  
> Checkboxes (`- [ ]`) track progress.

**Goal:** Make every tool **id → shortcut key → keyboard handler → visible label** tell the same truth (gate **W8**), and fix **only** Phase-2A chrome defects that **hide or block** canvas tools. No full chrome redesign.

**Architecture:** Single authority maps in `canvasTool.ts` (`CANVAS_TOOL_SHORTCUTS`, `CANVAS_TOOL_LABELS`) drive `useWorkspaceKeyboard`, `toolFromShortcutKey`, `CanvasToolRail` aria/title/shortcut badges, palette tool rows, and canvas `aria-keyshortcuts`. Handlers must not hard-code a divergent key table.

**Tech stack:** Next.js site · Vitest · React Testing Library · Phosphor · existing open3d workspace (FeasibilityCanvas + OOPlannerWorkspace). No new packages.

**Parent:** [INDEX.md](../INDEX.md) · [00-START.md](../00-START.md) · design `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` (§2 **W8**, Approach A pulls 2A blockers that hide tools).

**Evidence root:** `results/planner/world-standard-wave/09-shortcuts-chrome/`

**Checkpoint:** **CP-09** (this file bottom + `checkpoints/CHECKPOINTS.md` when that file lands).

---

## Scope (hard)

### In scope

| Slice | What |
|-------|------|
| **W8 truth table** | Unit map: every rail/palette tool id → key → `setTool(id)` (or documented non-tool action) |
| **Lying labels** | Fix mismatches (canonical lie today: **D** labeled Door / mapped door, handler arms **dimension**; **M** mapped dimension, **handler unbound**) |
| **Rail chrome** | `CanvasToolRail` label + shortcut badge + `aria-label` / `title` match authority maps |
| **Keyboard** | `useWorkspaceKeyboard` implements authority map (no second secret table) |
| **Canvas a11y string** | `aria-keyshortcuts` matches the same keys users press |
| **2A blockers that hide tools only** | CSS/layout/a11y that prevent reaching tools (e.g. rail covered, `display:none` at interactive breakpoints, focus trap that never reaches tool rail, unlabeled control that steals keyboard without escape). |

### Out of scope (do not expand)

- Full Approach **C** / Phase **2A** polish (RAC drawers, premium topbar redesign, mobile redesign)
- Full a11y sweep A1–A8 from `ayushdocs/06-A11Y-OPEN3D.md` (nested `main`, heading hierarchy, favorites naming) **unless** a finding **hides tools**
- Fabric cutover, mesh quality, select/delete product behavior (P03), orbit (P04), save honesty (P06)
- Redesigning which tools exist on the rail (keep current product set: select, pan, room, wall, opening, dimension, placement + zoom-to-fit)
- Competitor UI copy; new shortcut philosophy “because SketchUp does X”

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

### Handler truth today (the lie)

`site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`:

| Key | Handler does | Map / label claim | Verdict |
|-----|--------------|-------------------|---------|
| V | `setTool("select")` | select | OK |
| R | `setTool("room")` | room | OK |
| W | `setTool("wall")` | wall | OK |
| O | `setTool("opening")` | opening | OK |
| **D** | `setTool("dimension")` | door **or** dimension (M) | **LIE** |
| **M** | unbound | dimension | **LIE** |
| P | `setTool("placement")` | placement | OK |
| H | `setTool("pan")` | pan | OK |
| Space | temporary pan | (gesture) | OK if documented |
| Delete/Backspace | `deleteSelection` | (action) | not a tool label; keep |
| Tab | toggleView | navigation | keep |
| Ctrl/Cmd+K | openPalette | navigation | keep |
| Ctrl/Cmd+Z / Y / Shift+Z | undo/redo | actions | keep |
| Escape / Enter | cancel / commit | actions | keep |

`toolFromShortcutKey` already reads `CANVAS_TOOL_SHORTCUTS` → **D → door**, **M → dimension** (matches map, **mismatches** live keydown handler).

Existing unit expectations (do not “fix” by weakening unless owner redefines the product map):

- `site/tests/unit/features/planner/open3d/workspaceShell.test.tsx` — D→door, M→dimension, O→opening, R→room, P→placement
- `site/tests/unit/features/planner/open3d/donorParity.test.ts` — D→door, W→wall, V→select, H→pan
- `Failures.md` PLAN-FAIL-0413 note: unique shortcuts **D→door, M→dimension**

### Stale chrome strings

- `FeasibilityCanvas.tsx` `aria-keyshortcuts="V W D T H Tab Escape …"` — omits R/O/M/P; implies old donor set; **must match authority after fix**
- Rail shows Dimension with badge **M** while keydown on **D** arms dimension — user-visible lie

### Product rule for door vs opening

Rail product tool is **opening** (O), not separate Door button. Legacy `door` / `window` / `text` remain in `PlannerTool` + palette `CanvasTool` list. After fix:

- **D** → `setTool("door")` (map truth; palette “Door tool”)
- **M** → `setTool("dimension")` (map truth; rail “Dimension (M)”)
- **O** → `setTool("opening")` (rail Opening)
- Do **not** rebind D to dimension to “match handler”; rebind handler to match map + tests

---

## File map (touch only these unless a test forces a one-line import)

| Path | Role |
|------|------|
| `site/features/planner/open3d/editor/canvasTool.ts` | Authority: shortcuts + labels + `CANVAS_TOOLS` order |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Keydown → handlers; `toolFromShortcutKey` |
| `site/features/planner/open3d/editor/CanvasToolRail.tsx` | Visible labels / aria / shortcut badges |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | `aria-keyshortcuts` only (no canvas redesign) |
| `site/features/planner/open3d/lib/commands/paletteCommands.ts` | Palette shortcut strings from same maps |
| `site/features/planner/open3d/editor/canvas-tool-rail.module.css` | **Only if** a rule hides the rail at interactive viewports |
| `site/features/planner/open3d/editor/workspace.module.css` / `WorkspaceShell.tsx` | **Only if** shell layout covers or unmounts the rail |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | Expand: tool id → key → handler |
| `site/tests/unit/features/planner/open3d/workspaceShell.test.tsx` | Keep map parity; add rail label assert if needed |
| `site/tests/unit/features/planner/open3d/donorParity.test.ts` | Keep / extend map parity |
| NEW (optional, preferred): `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` | Single pure table test (id ↔ key ↔ label) |

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

- [ ] **00.3** Write `09-shortcuts-chrome/NOTES.md` with: baseline pass/fail counts, paste of the D/M lie from source line refs, “execution not started” until unlock.
- [ ] **00.4** Confirm P03–P08 ownership: do not “fix” select/delete by changing Delete shortcut semantics in this phase.

**Done when:** baseline log exists; NOTES lists the known D/M contradiction with file paths.

---

### Task 01 — Unit map: tool id → key → handler (RED first)

**Skill:** TDD  
**Files:**  
- `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` (create)  
- keep existing tests green after later green phase

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
- [ ] **01.5** Handler matrix (RTL `renderHook` + `KeyboardEvent`): for each row, press `key` without modifiers → `setTool` called with that `id` **exactly once** per press. Especially: **D → door**, **M → dimension** (this must **fail** on current code).
- [ ] **01.6** Negative: typing in `<input>` does not change tool; `enabled: false` does not bind.
- [ ] **01.7** Run test → expect RED on D/M handler rows. Save log:

`results/planner/world-standard-wave/09-shortcuts-chrome/01-tool-shortcut-truth-red.log`

**Done when:** RED log proves D/M (or other) handler mismatch; table is the contract for Task 02.

---

### Task 02 — Align keyboard handlers to authority map (GREEN)

**Skill:** TDD · systematic-debugging  
**Files:** `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`

- [ ] **02.1** Remove the hard-coded per-letter `if (key === "d") setTool("dimension")` style tool arming for letters that exist in `CANVAS_TOOL_SHORTCUTS`.
- [ ] **02.2** Implement tool arming from the map, e.g. invert shortcuts once:

```ts
// Pseudocode — match project style; no `any`
// Build Record<lowerKey, PlannerTool> from CANVAS_TOOL_SHORTCUTS
// On keydown (no mod): if map[key] → setTool(map[key]); preventDefault; return
```

- [ ] **02.3** Keep non-tool handlers first or with clear precedence: editable guard → Space pan → mod chords (Ctrl+K, undo/redo) → Tab → Delete/Backspace → Escape/Enter → then single-letter tool map.
- [ ] **02.4** Ensure **M** arms dimension and **D** arms door (not dimension).
- [ ] **02.5** Re-run Task 01 suite → GREEN. Log:

`results/planner/world-standard-wave/09-shortcuts-chrome/02-tool-shortcut-truth-green.log`

- [ ] **02.6** Re-run `open3dWorkspaceKeyboard.test.tsx`, `donorParity.test.ts`, keyboard sections of `workspaceShell.test.tsx` → GREEN. Append or separate log `02-regression-keyboard.log`.
- [ ] **02.7** Commit slice: `fix(planner): W8 keyboard handlers match CANVAS_TOOL_SHORTCUTS (D=door, M=dimension)`

**Done when:** green logs exist; no second hard-coded tool table remains in the hook for letter tools.

---

### Task 03 — Fix lying rail labels / aria (rail chrome only)

**Skill:** TDD  
**Files:**  
- `site/features/planner/open3d/editor/CanvasToolRail.tsx`  
- `site/features/planner/open3d/editor/canvasTool.ts` (labels only if a string is wrong)  
- tests: extend `toolShortcutTruth.test.ts` or small RTL rail test

- [ ] **03.1** Confirm rail already uses `CANVAS_TOOL_LABELS` + `CANVAS_TOOL_SHORTCUTS` for `aria-label={`${label} (${shortcut})`}` and badge. If any hard-coded label/shortcut exists, delete it.
- [ ] **03.2** Add unit test: render `CanvasToolRail` with `activeTool="dimension"` → button accessible name matches `/Dimension \(M\)/`; `activeTool="wall"` → `/Wall \(W\)/`. No button claims Door for M or Dimension for D.
- [ ] **03.3** Icon map: do **not** redesign icons. Only fix if an icon is wired to the wrong tool id (current `TOOL_ICONS.dimension = Ruler`, `opening = DoorOpen` is acceptable for this phase).
- [ ] **03.4** Guidance strip in `OOPlannerWorkspace` already uses `CANVAS_TOOL_GUIDANCE` + shortcut — spot-check after Task 02 that active tool status does not print “Dimension · …” while badge says another key. Fix only if a local hard-code lies.
- [ ] **03.5** Run rail + truth tests → GREEN. Log: `03-rail-labels.log`
- [ ] **03.6** Commit slice: `fix(planner): W8 tool rail labels match shortcut authority`

**Done when:** no rail control shows a shortcut letter that does not arm that tool.

---

### Task 04 — Canvas `aria-keyshortcuts` + palette parity

**Skill:** TDD · a11y (minimal)  
**Files:**  
- `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`  
- `site/features/planner/open3d/lib/commands/paletteCommands.ts`  
- tests as needed

- [ ] **04.1** Replace hard-coded `aria-keyshortcuts="V W D T H …"` with a value derived from authority + documented actions, e.g. build from unique `CANVAS_TOOL_SHORTCUTS` values plus `Tab Escape Control+Z Control+Shift+Z Control+Y 0` (and Space if you document temporary pan). Prefer a small pure helper next to `canvasTool.ts` (e.g. `canvasKeyShortcutsAttribute()`) so string cannot drift.
- [ ] **04.2** Unit-test the helper: includes `M` and `D` and `O` and `R` and `P`; does not claim a letter absent from the map.
- [ ] **04.3** Palette: every `tool-*` command `shortcut` field must equal `CANVAS_TOOL_SHORTCUTS[tool]`. `runPaletteCommand("tool-door")` → `setTool("door")` remains. If palette still only lists `CanvasTool` subset, keep subset but shortcuts must not lie; do **not** rebuild the entire palette UX.
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
  - CSS at `(width < 48rem)` that sets `.rail { display: none }` (today it reflows horizontally — do not break that)
  - Panel backdrop covering rail without dismiss control
- [ ] **05.3** Explicitly **do not**: rewrite TopBar, Vaul drawers, density system, full landmark tree, favorites labels, marketing chrome.
- [ ] **05.4** If zero hide-tools defects found, write that as data in NOTES (`chrome-hide-tools: none`) — do not invent CSS churn.
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
  - Table: id → key → handler verified  
  - Chrome hide-tools: none | list of fixes  
  - Commits: hashes  
  - Failures logged to root `Failures.md` if any residual lie

- [ ] **06.4** Mark CP-09 below. Do not claim world-standard complete (that is P10).

**Done when:** CP-09 checklist complete; evidence paths real; no “TBD” left in NOTES.

---

## Implementation order (agent)

```
00 baseline → 01 RED truth table → 02 GREEN handlers → 03 rail labels → 04 aria/palette → 05 hide-tools only → 06 evidence/CP-09
```

Parallelism: Task 01 test authoring can start while 00 baseline runs. Do not parallelize 02 with 03 until 02 is green (labels without handler truth re-lie).

---

## Checkpoint **CP-09**

Hard stop — all must be true from **data**, not memory:

- [ ] **CP-09.1** Unit table proves tool id → key → `setTool(id)` for every authority tool (including **D=door**, **M=dimension**).
- [ ] **CP-09.2** No hard-coded keyboard tool table diverges from `CANVAS_TOOL_SHORTCUTS`.
- [ ] **CP-09.3** `CanvasToolRail` accessible names use `Label (Key)` from the same maps.
- [ ] **CP-09.4** `aria-keyshortcuts` / palette shortcuts match the same maps.
- [ ] **CP-09.5** Hide-tools chrome: fixed or documented none-found.
- [ ] **CP-09.6** Evidence under `results/planner/world-standard-wave/09-shortcuts-chrome/` with unfiltered logs.
- [ ] **CP-09.7** Landable commits on main checkout; push not done unless owner asked.

**W8 status after CP-09:** PASS only if CP-09.1–09.6 green.

---

## Risk / non-goals reminder

| Risk | Mitigation |
|------|------------|
| “Fix” by changing labels to match wrong handler (Dimension (D)) | Forbidden — map + Failures + tests own D/M |
| Scope creep into full 2A | Task 05 allowlist only |
| Breaking Delete/undo while editing shortcuts | Preserve non-tool branches; regression logs in 02 |
| Palette lists door while rail shows opening | Both valid; keys D vs O must stay distinct |

---

## Handoff to P10

P10 packs world-standard evidence. P09 contributes:

- `09-shortcuts-chrome/` logs + NOTES with **W8 PASS**
- Commit list for shortcut truth  
- Explicit note if browser smoke deferred to owner

Do not start P10 claims from this file alone.
