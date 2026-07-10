# P09 — Shortcuts & Blocking Chrome (W8) — Brainstormer REPORT

| Field | Value |
|-------|--------|
| **Agent** | Brainstormer 09/10 |
| **Repo** | `D:\OandO07072026` |
| **Phase** | P09 W8 — `Plans/phases/P09-shortcuts-chrome/` (+ `06-ui-shortcuts.md`) |
| **Gate** | **W8** — Tool / shortcut labels match keyboard handlers |
| **Checkpoint** | **CP-09** |
| **Evidence root (canonical)** | `results/planner/world-standard-wave/09-shortcuts-chrome/` |
| **Write scope** | `Idiots/P09-shortcuts-chrome/` only — **no product code** |
| **Date of live re-read** | 2026-07-10 |
| **Process** | `/using-superpowers` + brainstorming skill adapted for subagent brief (full design report, not interactive Q&A) |

---

## 0. One-screen verdict

**W8 is a truth contract, not a chrome polish epic.**

The product rule is simple and non-negotiable:

> For every tool id in the authority maps, **id → shortcut letter → live keydown → `setTool(id)` → visible label / badge / palette / `aria-keyshortcuts`** must tell the **same** story.

**Expert pass (UI/shortcuts):** **FIX** — not BLOCK, not SHIP until evidence under **`09-shortcuts-chrome/`** proves the full letter matrix and residual chrome honesty.

**Live code (2026-07-10 re-read) vs plan-time smoking gun:**

| Layer | Plan / expert narrative (2026-07-09) | Live repo (2026-07-10) |
|-------|--------------------------------------|-------------------------|
| Authority map `CANVAS_TOOL_SHORTCUTS` | D=door, M=dimension, N=window, T=text | **Unchanged — still product authority** |
| `useWorkspaceKeyboard` letter arming | **Second hard-coded table**: `d`→dimension; m/n/t unbound | **Fixed:** invert map once → `TOOL_BY_SHORTCUT_KEY`; D/M/N/T arm correctly |
| `toolFromShortcutKey` | Map-true (always was) | Still map-true; now shares the inverted table with keydown |
| Live keydown tests | Missing matrix | **Present:** `toolShortcutTruth.test.ts` + `open3dWorkspaceKeyboard.test.tsx` full map matrix |
| Rail strings | Already map-sourced | Still map-sourced |
| Palette tool shortcuts | Already map-sourced for `CanvasTool` subset | Still map-sourced |
| `FeasibilityCanvas` `aria-keyshortcuts` | Stale donor string | **Still stale** — hard-coded `V W D T H…`; omits R/O/M/P |
| Dual keyboard (`delegateKeyboard`) | Scope fence | Workspace path passes `delegateKeyboard`; local path still has zoom / residual `w` when not delegated |
| Evidence pack `09-shortcuts-chrome/` | Required for CP-09 | **Missing** — wave folder not present at re-read |
| Plan checkboxes Tasks 00–06 / CP-09 | Open | Still open in phase MD (do not claim CP-09 green from code alone) |

**Brutal honesty:** Handler map alignment may already be landed in source + unit tests. **That is not W8 ship.** W8 ships when **CP-09** has unfiltered logs under **`09-shortcuts-chrome/`**, `aria-keyshortcuts` is honest, hide-tools inventory is written, dual-keyboard note exists, and nobody can reintroduce a second letter table without RED tests. Plan narrative still describes the **historical lie** as “today” — residual work + evidence + aria are the real remaining surface.

**Forbidden “fix” forever:** rebinding **Dimension → D** (or map labels) to match a bad handler. Product truth is **D=door · M=dimension** (`Failures.md` PLAN-FAIL-0413 lineage + unit truth table).

---

## 1. What W8 actually is (product + gate)

### 1.1 Design-spec definition

From `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`:

| ID | Gate | Proof |
|----|------|--------|
| **W8** | Tool/shortcut labels match handlers | Unit + keyboard test |

Parent program: Approach **A** (product journey first). Phase 2A chrome is pulled in **only** where it **hides or blocks tools**. Full Approach **C** (premium chrome first) is rejected for this wave.

From `Plans/INDEX.md`:

| Gate | Meaning | Phase |
|------|---------|-------|
| **W8** | Tool labels match keyboard handlers | **P09** |

### 1.2 Phase goal (hard)

Make every tool **id → shortcut key → keyboard handler → visible label** tell the same truth, **and** fix **only** chrome defects that hide/block canvas tools.

**Not goals:** full RAC redesign, mobile polish epic, competitor keymap philosophy, expanding palette to every `PlannerTool`, Fabric cutover, mesh, orbit, save honesty, select/delete product behavior (other phases).

### 1.3 Why buyers care

A lying shortcut is worse than no shortcut:

1. Rail shows **Dimension (M)** → user presses **D** → wrong tool arms (historical) → trust collapses.
2. Map says **Door (D)** and palette “Door tool” → key does something else → power users quit.
3. Screen readers / a11y trees claim keys the product does not own → a11y theater.

W8 is **trust infrastructure** for every later “keyboard-first CAD-lite” claim.

---

## 2. Authority model — `CANVAS_TOOL_SHORTCUTS` is law

### 2.1 Single source of truth

**File:** `site/features/planner/open3d/editor/canvasTool.ts`

| Map / list | Role |
|------------|------|
| `CANVAS_TOOL_SHORTCUTS: Record<PlannerTool, string>` | **Authority** letter per tool id |
| `CANVAS_TOOL_LABELS: Record<PlannerTool, string>` | Visible / aria name stem |
| `CANVAS_TOOL_GUIDANCE: Record<PlannerTool, string>` | Status / guidance strip copy |
| `CANVAS_TOOLS: PlannerTool[]` | Rail **product** order (subset of all tools) |
| `CanvasTool` type | Legacy / palette subset: select · wall · door · window · text · pan |
| `PlannerTool` type | Full set = CanvasTool + room · opening · dimension · placement |
| `runtimeToolFor(tool)` | Maps planner tools to canvas runtime modes (opening→door runtime, dimension→text runtime, etc.) — **not** a shortcut map |

### 2.2 Full authority table (product truth — locked)

| Tool id | `CANVAS_TOOL_SHORTCUTS` | `CANVAS_TOOL_LABELS` | On `CANVAS_TOOLS` rail? | Palette `tool-*`? | Notes |
|---------|-------------------------|----------------------|-------------------------|-------------------|-------|
| select | **V** | Select | yes | yes | SketchUp-class select letter |
| pan | **H** | Pan | yes | yes | Hand / pan |
| room | **R** | Room | yes | **no** | Structure |
| wall | **W** | Wall | yes | yes | Structure |
| opening | **O** | Opening | yes | **no** | Product rail tool for wall openings |
| dimension | **M** | Dimension | yes | **no** | Measure — **not D** |
| placement | **P** | Place | yes | **no** | Catalog place |
| door | **D** | Door | **no** | yes | Legacy / palette; distinct from opening |
| window | **N** | Window | **no** | yes | Legacy / palette |
| text | **T** | Text | **no** | yes | Legacy / palette annotation |

**Uniqueness law:** every value in `Object.values(CANVAS_TOOL_SHORTCUTS)` is unique (no two tools share a letter). Enforced by unit test in `toolShortcutTruth.test.ts`.

### 2.3 Consumers that must read the map (never invent letters)

| Consumer | Path | Must use maps for |
|----------|------|-------------------|
| Letter arming | `useWorkspaceKeyboard.ts` | Invert map → `setTool` |
| Pure resolve | `toolFromShortcutKey` | Same invert |
| Rail UI | `CanvasToolRail.tsx` | `aria-label` / `title` / badge = `Label (Key)` |
| Guidance strip | `OOPlannerWorkspace.tsx` | active tool key + `CANVAS_TOOL_GUIDANCE` |
| Palette tool rows | `paletteCommands.ts` | `shortcut: CANVAS_TOOL_SHORTCUTS[tool]` for `CanvasTool` list |
| Canvas a11y | `FeasibilityCanvas.tsx` | `aria-keyshortcuts` derived, not donor-stale |
| Optional pure helper | preferred next to `canvasTool.ts` | `canvasKeyShortcutsAttribute()` |

### 2.4 Why “invert once” is the only correct architecture

Any second table of `if (key === "d") setTool("dimension")` will **drift**. The historical lie is the proof:

- Map tests can stay green (`toolFromShortcutKey("d") === "door"`).
- Live keydown still arms the wrong tool.
- Paper PASS while the buyer hits the wrong tool.

**Contract:** one invert:

```
TOOL_BY_SHORTCUT_KEY = Object.fromEntries(
  entries(CANVAS_TOOL_SHORTCUTS).map(([tool, letter]) => [letter.toLowerCase(), tool])
)
// keydown no-mod: setTool(TOOL_BY_SHORTCUT_KEY[key]) if defined
```

Live code already does this (module-level constant). **Regression bar:** never reintroduce per-letter tool `if`s for map letters.

### 2.5 Door vs Opening (product rule — do not “simplify”)

| Concept | Tool id | Key | Where user sees it |
|---------|---------|-----|--------------------|
| **Opening** (product rail) | `opening` | **O** | Left rail “Opening (O)” |
| **Door** (legacy / palette) | `door` | **D** | Palette “Door tool”, not a separate rail button today |
| **Window** (legacy / palette) | `window` | **N** | Palette |
| **Text** (legacy / palette) | `text` | **T** | Palette |

Runtime mapping (`runtimeToolFor("opening") → "door"`) is about **canvas interaction mode**, not keyboard letters. Keyboard must still set `opening` for **O** and `door` for **D**. Collapsing D and O into one key is a product redesign — **out of P09**.

---

## 3. Map vs handler — the D / M / N / T lie (deep)

### 3.1 Smoking gun (historical — plan + expert verified 2026-07-09)

**File:** `useWorkspaceKeyboard.ts` (then)

- Imported `CANVAS_TOOL_SHORTCUTS`.
- Used the import only for `toolFromShortcutKey` (or barely).
- Armed tools via a **second hard-coded** per-letter table.

| Key (no mod) | Handler did | Map claim | Verdict |
|--------------|-------------|-----------|---------|
| V | `setTool("select")` | select | OK |
| R | `setTool("room")` | room | OK |
| W | `setTool("wall")` | wall | OK |
| O | `setTool("opening")` | opening | OK |
| **D** | **`setTool("dimension")`** | **door** | **LIE** |
| **M** | **unbound** | **dimension** | **LIE** |
| P | `setTool("placement")` | placement | OK |
| H | `setTool("pan")` | pan | OK |
| **N** | **unbound** | **window** | **GAP** |
| **T** | **unbound** | **text** | **GAP** |

**User-visible failure mode:**

1. Rail badge: **Dimension (M)** — correct string from maps.
2. User presses **D** thinking of Dimension (CAD habit: D for dimension/distance) **or** trusts nothing and tries letters from badges.
3. Historical handler arms **dimension** on **D** → map says door → door never arms from key → dimension unreachable via **M**.
4. Window (**N**) and text (**T**) never arm from keyboard at all.

### 3.2 Why pure map tests were insufficient

| Suite (pre-matrix) | What it proved | What it missed |
|--------------------|----------------|----------------|
| `workspaceShell.test.tsx` `toolFromShortcutKey` | D→door, M→dimension via pure function | Live `window` keydown path |
| `donorParity.test.ts` | D→door, W→wall, V→select, H→pan via pure function | Live arming |
| `open3dWorkspaceKeyboard.test.tsx` (old) | palette, undo, editable, disabled | **No tool letter matrix** |

**Lesson (raised bar):** any claim “shortcuts work” requires **dispatching real `KeyboardEvent`s** through `useWorkspaceKeyboard` and asserting `setTool` args. Map unit alone = **paper green**.

### 3.3 Live state after invert (2026-07-10)

**File:** `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`

- Builds `TOOL_BY_SHORTCUT_KEY` once from `CANVAS_TOOL_SHORTCUTS`.
- Keydown precedence (summary):
  1. Editable target guard (`INPUT` / `TEXTAREA` / `SELECT` / contentEditable) → ignore
  2. Space → temporary pan (keydown/keyup pair)
  3. Mod+K → palette
  4. Tab (no shift/mod/alt) → toggle view
  5. Escape → cancel
  6. Enter → commit
  7. Delete / Backspace → deleteSelection
  8. Mod+Shift+Z / Mod+Y → redo; Mod+Z → undo
  9. No-mod letter → `TOOL_BY_SHORTCUT_KEY[key]` → `setTool`
- `toolFromShortcutKey` uses the **same** inverted record.

**Critical letters after fix:**

| Key | `setTool` | Status |
|-----|-----------|--------|
| d | door | Must stay |
| m | dimension | Must stay |
| n | window | Must stay |
| t | text | Must stay |
| o | opening | Must stay |

### 3.4 Forbidden reverse fixes (anti-patterns)

| Fake fix | Why it fails |
|----------|--------------|
| Change map Dimension → **D** | Contradicts Failures / donor tests / door letter; rail would claim Dimension (D) while door loses identity |
| Keep handler D→dimension and “document” it | Labels and palette still say Door (D) |
| Fix only D/M leave N/T unbound | Partial truth = still not W8 |
| Add third table “display shortcuts” | Drift multiplies |
| Disable keydown tests “flaky” | Hides the only class of bug that matter |

### 3.5 Precedence interactions (do not break while fixing letters)

| Action | Keys | Owner surface on open3d workspace |
|--------|------|-----------------------------------|
| Temporary pan | Space hold | `useWorkspaceKeyboard` → canvas pan |
| Undo / redo | Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z, Ctrl/Cmd+Y | workspace keyboard |
| Palette | Ctrl/Cmd+K | workspace keyboard |
| 2D/3D toggle | Tab | workspace keyboard |
| Delete selection | Delete, Backspace | workspace keyboard (P03 owns **semantics**; P09 must not strip preventDefault) |
| Cancel / commit | Escape, Enter | workspace keyboard |
| Zoom fit / in / out | `0` `+`/`=` `-` | **Canvas local** when `delegateKeyboard` is false; rail button “0” for fit |
| Draw-wall residual | `w` local when not delegated | canvas local path |

P09 must **preserve** non-tool branches while map-arming tools. Green on tools with broken Delete = **false W8 adjacent to false W3**.

---

## 4. Dual keyboard surfaces (scope fence + honesty)

### 4.1 Two listeners exist

| Surface | Location | When active | Owns |
|---------|----------|-------------|------|
| **Workspace keyboard** | `useWorkspaceKeyboard` in `OOPlannerWorkspace` | Always when workspace mounted + `enabled` | Tool letters, palette, undo/redo, Tab, Del, Esc, Enter, Space pan |
| **Canvas local keyboard** | `FeasibilityCanvas` `useEffect` keydown | When `delegateKeyboard === false` | Local: `w`→draw-wall, Escape cancel, Ctrl+Z undo, zoom `0/+/-`, Space tracking for pan gesture |

### 4.2 Production open3d path

`OOPlannerWorkspace` mounts `FeasibilityCanvas` with **`delegateKeyboard`** (true). Therefore:

- Tool arming ownership = **workspace hook**.
- Canvas local tool arming is **gated off** on the product path.
- Zoom keys (`0 + -`) on the **workspace path** are **not** owned by `useWorkspaceKeyboard`. Zoom-to-fit is exposed as a **rail button** (`onZoomReset` → “Zoom to fit (0)”). Canvas local zoom only runs when keyboard is **not** delegated.

### 4.3 What P09 must do about dual surfaces

| Action | In scope? |
|--------|-----------|
| Redesign dual system into one global keyboard module | **No** |
| Document which surface owns which keys in NOTES | **Yes** |
| If both fire and break W8 on a route | Minimal guard only; log dual-keyboard conflict |
| Claim `aria-keyshortcuts` includes zoom on workspace surface without a live owner | **No** — honesty rule |

### 4.4 Residual dual-surface risks

1. **Standalone / non-workspace embeds** of `FeasibilityCanvas` with default `delegateKeyboard=false` still have local `w` draw-wall and zoom — not the same contract as open3d shell.
2. **Space** is tracked on both surfaces for pan gesture state when local is active; workspace path uses workspace Space handlers.
3. **Ctrl+Z** on local canvas when not delegated duplicates undo — acceptable only when workspace does not also bind (not the open3d shell case).
4. **aria-keyshortcuts** currently lists zoom chords on the canvas element even when workspace delegates tool keys — the attribute is a **lie/stale composite** until derived carefully.

**P09 fence language (keep):** dual keyboard redesign is out. Log conflicts. Fix only if W8 product path breaks.

---

## 5. `aria-keyshortcuts` honesty

### 5.1 Current string (stale)

`FeasibilityCanvas.tsx` (live ~L915):

```text
aria-keyshortcuts="V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -"
```

### 5.2 Gap analysis vs authority + wired actions

| Token in string | In map? | Wired on workspace path? | Verdict |
|-----------------|---------|--------------------------|---------|
| V | yes (select) | yes (workspace) | OK if list is “available shortcuts” for region |
| W | yes (wall) | yes | OK |
| D | yes (door) | yes (after fix) | OK as letter; **historical** string meant donor “dimension” era — now correct letter, wrong completeness |
| T | yes (text) | yes (after fix) | Present |
| H | yes (pan) | yes | OK |
| Tab | non-tool | yes | OK |
| Escape | non-tool | yes | OK |
| Control+Z / Shift+Z / Y | non-tool | yes | OK |
| 0 + - | non-tool zoom | **Canvas local only if !delegateKeyboard**; rail has “0” for fit | **Ambiguous / often overclaimed on delegated path** |
| **R** | yes (room) | yes | **OMITTED — must add** |
| **O** | yes (opening) | yes | **OMITTED — must add** |
| **M** | yes (dimension) | yes | **OMITTED — must add** |
| **P** | yes (placement) | yes | **OMITTED — must add** |
| **N** | yes (window) | yes | **OMITTED — must add** |
| Control+K | palette | yes | **OMITTED — should include if surface advertises commands** |
| Space | temporary pan | yes | optional document; not currently listed |

### 5.3 Honesty rules (raised)

1. Include **every unique** value from `CANVAS_TOOL_SHORTCUTS`.
2. Include non-tool keys **only if a live handler on that surface owns them**.
3. Prefer pure helper next to authority maps, e.g. `canvasKeyShortcutsAttribute({ includeCanvasZoom: boolean })`, so the string cannot drift.
4. Unit-test helper: includes M, D, O, R, P, N, T, V, W, H; does not invent letters like `Q` for tools that do not exist.
5. Do **not** expand into full A1–A8 a11y sweep (nested main, heading hierarchy) under this task.

### 5.4 WCAG / a11y note (minimal)

`aria-keyshortcuts` is an ARIA attribute listing keyboard shortcuts for an element. Stale lists:

- Mislead assistive tech users.
- Fail internal honesty audits even when sighted users “learn” the real keys.
- Are worse than empty when they advertise dead keys or omit primary tools (Room, Opening, Dimension).

P09 fixes **honesty**, not full WCAG certification of the planner shell.

---

## 6. Rail chrome, palette, guidance (already mostly honest)

### 6.1 `CanvasToolRail` — regression surface, not the lie

**Live behavior:**

- Renders `CANVAS_TOOLS` order: select, pan, room, wall, opening, dimension, placement (+ optional zoom-to-fit).
- Each tool button: `aria-label={`${label} (${shortcut})`}`, `title` same, badge span with shortcut letter.
- Icons: Phosphor map by tool id (dimension = Ruler, opening = DoorOpen). Icon redesign **out of scope** unless icon is wired to the wrong id.
- At `width < 48rem`: rail becomes **horizontal** bottom strip; **shortcut badge CSS hidden** (`display: none` on `.shortcut`) but **aria-label still has the letter** — not a hide-tools defect.
- `@media print`: rail `display: none` — **allowed** (print-only).

**Tests:** `canvasToolRail.a11y.test.tsx` covers Select (V) and Opening (O). Truth suite asserts Select (V) string contract. Plan wants Dimension (M) / Wall (W) name asserts as regression guard.

### 6.2 Palette — subset honesty

`paletteCommands.ts`:

- Tool ids: `select | wall | door | window | text | pan` only.
- Shortcuts from map for that subset.
- Does **not** list room / opening / dimension / placement — **allowed** for P09.
- `runPaletteCommand("tool-door")` → `setTool("door")` must remain.

**Do not** rebuild palette UX to list every `PlannerTool` in this phase.

### 6.3 Guidance strip

`OOPlannerWorkspace` shows `CANVAS_TOOL_SHORTCUTS[activeTool]` and `CANVAS_TOOL_GUIDANCE[activeTool]`. After map-driven arming, active tool status must match the letter shown. Fix only if a local hard-code lies.

### 6.4 Command registry shortcuts (`feasibilityCommands`)

`registry.ts` still has action shortcuts like draw-wall **W**, cancel **Esc**, undo **Ctrl+Z**, zoom **+ / - / 0**. These are **action command** labels, not the tool authority map. Palette merges them as action rows. Consistency with map for **W** is intentional (wall). Do not fork a third tool map here.

---

## 7. Hide-tools-only chrome (Task 05 discipline)

### 7.1 Scope definition

| In | Out |
|----|-----|
| Rail unmounted / zero size at interactive viewports | Full TopBar redesign |
| `display:none` on rail at interactive breakpoints | Vaul drawers polish |
| Overlay steals all clicks from rail with no dismiss | Density system redesign |
| Focus trap that blocks tool keys after editable guard | Nested `main` / landmarks (unless rail leaves a11y tree) |
| Rail disabled with no alternate | Favorites naming, marketing chrome |

### 7.2 Inventory checklist (proof-first in NOTES — no CSS without a row)

| Check | How | Hide-tools? | Live read expectation (2026-07-10) |
|-------|-----|-------------|-------------------------------------|
| Tool rail mounted on `/planner/open3d` | DOM `nav[aria-label="Canvas tools"]` / `.pw-tool-rail` | If missing → blocker | Wired in workspace shell |
| Rail `display:none` / zero size at 1440 and 390 | CSS audit | Interactive hide = fix | Small viewport = horizontal reflow, **not** hide |
| Print hide | `@media print` | OK | Present — allowed |
| Overlay steals clicks | z-index / pointer-events | fix minimal | Need browser/NOTES proof — do not invent |
| Keyboard cannot arm because focus stuck | Tab order smoke | only true traps | Editable guard already skips inputs |
| Inventory double-name / nested main | a11y report | **Out** unless rail disappears | Known a11y debt — not P09 unless hide-tools |

### 7.3 Explicit non-hide patterns

- Horizontal reflow at `<48rem` with scrollable tools.
- Shortcut letter badge hidden on coarse/small while aria-label retains letter.
- Compact density smaller hit targets (still buttons).

### 7.4 Outcome modes

1. **Defect found** → minimal CSS/layout fix + log + commit.
2. **None found** → `chrome-hide-tools: none` in NOTES — **no invented churn**.

**Raised bar:** zero CSS edits without a NOTES proof row naming viewport, selector, and user impact.

---

## 8. Competitive keyboard discoverability (research → patterns only)

Ethics (binding): `D:\websites` is **inspiration only**. No competitor keys, chrome, assets, or brand into product. Build **O&O** map + O&O help sheet.

### 8.1 Homestyler — discoverability pattern, not a key table

Sources: `D:\websites\homestyler.com\report\INSPIRATION.md`, forum raws, SEO article.

| Signal | Usable? | O&O takeaway |
|--------|---------|--------------|
| Full public shortcut table | **No** — SEO article is fluff; no key table | Do not scrape for product truth |
| Help → **Shortcut Keys** category in editor | **Yes as pattern** | In-editor cheatsheet (`?` / Help) — **content original** |
| Confirmed keys in forum | B material brush; **1** plane view; WASD roam | Industry nav patterns only; **do not copy map** |
| Five-zone editor shell | Zone IA pattern | Align with existing shell; not P09 redesign |
| Keyboard SEO article | Near-zero | Discard as authority |

**W8 translation:** Homestyler wins “shortcuts” score for **discoverability** (Help category + view keys culture), **not** because O&O should use their letters. O&O wins W8 by **honesty**: whatever we show matches what we do.

### 8.2 Floorplanner — published matrix + `?` help

Source: `D:\websites\floorplanner.com\report\INSPIRATION.md` + editor manuals.

| Pattern | Example (theirs — do not ship) | O&O use |
|---------|--------------------------------|---------|
| Tool activation letters | w wall, r room, d dimension, m tape, t text | **Own** letters via `CANVAS_TOOL_SHORTCUTS` |
| Always-on grammar | Esc, Del, Space pan, undo | Already in workspace keyboard |
| Shortcut help key | `?` opens sidebar list | Post-W8 / P1 discoverability; not required to green W8 unit matrix |
| Mode-dependent conflicts | r = room **or** rotate | Document mode precedence; avoid silent dual meaning |

**Critical cross-note:** Floorplanner uses **D for dimension** and **M for tape**. O&O deliberately uses **M for dimension** and **D for door**. CAD users may press D for measure out of habit — **status/guidance + honest badges** teach O&O map. Rebinding to Floorplanner’s D=dimension is **forbidden** under W8 product lock.

### 8.3 Planner5D — chrome regions, not a public hotkey bible

Source: `D:\websites\planner5d.com\report\TOOLBARS.md`, INSPIRATION packs.

```
TOP BAR · LEFT tools · CENTER canvas · RIGHT catalog/props · BOTTOM status
```

| Pattern | O&O |
|---------|-----|
| Left structure tools + measure | Rail: select/pan/room/wall/opening/dimension/placement |
| 2D structure vs 3D decorate role split | Product path elsewhere (W4); P09 only ensures tools reachable |
| WASD in walkthrough UI strings | 3D nav later — not W8 tool letters |
| Toolbar mock under websites | Layout study only — **never** copy into `site/` |

**P09 chrome use of P5D research:** regions teach **where** tools live so hide-tools inventory knows what “unreachable rail” means. Not license to clone toolbar pixels.

### 8.4 RoomSketcher — mode grouping + sparse public hotkeys

Source: `D:\websites\roomsketcher.com\report\INSPIRATION.md`.

- Strong on **task modes** (Walls / Windows / Furniture) and measurement product.
- W8 note: hotkey examples sparse (e.g. Q flip door); no full map to copy.
- O&O: mode grouping inspiration for later chrome; W8 remains letter honesty.

### 8.5 Comparison pack scores (decision aid, not product truth)

From `D:\websites\research\2026-07-09-world-standard\comparison\02-toolbar\REPORT.md`:

| Product | Shortcuts score (public bar) |
|---------|------------------------------|
| Homestyler | 5 (discoverability) |
| Floorplanner | 5 (published matrix) |
| RoomSketcher | 4 |
| Planner5D | 3 |
| O&O live (research-time) | **2** — “shortcuts can mislead” |

O&O self report (`07-oando-self`): toolbar **2** — half-premium chrome; keyboard honesty historically bad.

**Raised W8 target (score language):** moving O&O shortcuts dimension from “misleading” to “honest + testable” is the **minimum** for W8 PASS. Discoverability sheet (`?`) is **P1 polish** after honesty.

### 8.6 SYNTHESIS / RESEARCH-MAP binding lines

From `Plans/Research/RESEARCH-MAP.md` and world-standard SYNTHESIS:

| Industry pattern | O&O translation | Phase |
|------------------|-----------------|-------|
| Keyboard discoverability (Homestyler-class idea) | **Our** shortcut map must match handlers | **P09 / W8** |
| Chrome layout (top/left/center/right/status) | Re-implemented; P09 only where labels/tools block W | P09 limited |
| Anti-copy | No competitor assets into site | Always |

Firecrawl is **dead** for active work — re-read reports only; no re-scrape for P09 execute.

---

## 9. Plan critique (P09 + suggestions + expert pass)

### 9.1 What the plan gets right (keep)

1. **Smoking gun diagnosis** of map-import vs second letter table — correct class of bug.
2. **Forbidden Dimension→D rebind** — correct product lock.
3. **Full letter gap** D lie + M/N/T unbound — not partial fix.
4. **Task order:** baseline → RED truth table → GREEN handlers → rail regression → aria/palette → hide-tools → evidence.
5. **Rail reframed as regression** (S3) — strings were not the liar.
6. **Dual keyboard fence** (S7) — prevents redesign thrash.
7. **Hide-tools proof-first** (S8).
8. **Palette subset stay** (S9).
9. **Evidence path final lock** → **`09-shortcuts-chrome/`** (FOLDER-LOCK after S1 thrash).
10. **TDD + live keydown matrix** — correct proof class.

### 9.2 Plan defects / thrash (fix honesty in NOTES when executing)

| Issue | Detail | Recommendation |
|-------|--------|----------------|
| **S1 evidence thrash** | Suggestions first said swap all `09-` → `08-` to match old RESULTS-MAP; FOLDER-LOCK later made **`09-`** canonical so mesh owns sole `08-mesh-quality/` | Execute **only** `09-shortcuts-chrome/`. Ignore retired `08-shortcuts-chrome/` name. |
| **Task 00.4 typo** | Done-when says “evidence path is **08-** not 09-” | Treat as **stale typo** — canonical is **09-** per RESULTS-MAP / FOLDER-LOCK / phase header. |
| **“Today” handler narrative** | Phase still describes second hard-coded table as live | Re-verify source at execute start; if invert already landed, Task 02 may be **verify-green** not rewrite — still produce logs. |
| **Task 00 “execution not started until unlock”** | W0 unlocked per phase header | Do not block on unlock re-ask. |
| **Suggestions path string** | Points at `Plans/trustdata/phases/...` | Actual live path is `Plans/phases/P09-shortcuts-chrome/`. |
| **Incomplete rail a11y tests vs plan 03.2** | Plan wants Dimension (M) / Wall (W); current a11y test covers Select + Opening | Extend tests as specified. |
| **No `canvasKeyShortcutsAttribute` yet** | Plan prefers pure helper | Still required for Task 04 honesty. |
| **Evidence directory missing** | CP-09 cannot pass without it | Task 00 must create and fill. |
| **Browser smoke optional** | Correct | Unit matrix is primary; browser is supplementary. |
| **Parallelism note** | Do not parallelize 02 with 03 until 02 green | Still valid if any letter still wrong. |

### 9.3 Expert pass alignment

`EXPERT-PASS.md` P0 #11:

> invert `CANVAS_TOOL_SHORTCUTS` once in keyboard handler (D=door, M=dimension, N/T bound); live keydown matrix tests; honest `aria-keyshortcuts`. Forbidden: rebind Dimension → D.

`06-ui-shortcuts.md` verdict: **FIX**. One-line contract:

> one map drives keyboard, rail, palette, aria; unit matrix proves every letter; chrome only if tools are unreachable.

This REPORT endorses that contract without expansion.

### 9.4 Suggestions S1–S10 scorecard

| ID | Intent | Status relative to plan |
|----|--------|-------------------------|
| S1 | Evidence path | **Superseded** by FOLDER-LOCK → use **09-** |
| S2 | Full letter gap | Applied — keep |
| S3 | Rail regression reframe | Applied — keep |
| S4 | Map-only arming + forbid label rebind | Applied — keep |
| S5 | aria honesty helper | Applied in plan — **code residual** |
| S6 | Test ownership truth + hook matrix | **Tests appear present** — still need evidence logs |
| S7 | Dual keyboard fence | Applied — keep |
| S8 | Hide-tools discipline | Applied — keep |
| S9 | Palette subset | Applied — keep |
| S10 | Scope freeze | Applied — keep |

---

## 10. Raised bar (above bare plan)

The phase is already strong. Raise these bars without expanding product scope:

### 10.1 Single invert at module scope (done if live code holds)

- Invert once at module load (not recompute every keydown) — live code does this.
- Export `toolFromShortcutKey` from same table — live code does this.
- **Add static assertion test:** `Object.keys(TOOL_BY_SHORTCUT_KEY).sort()` equals sorted lowercased map values — optional pure export or re-derive in test from maps only.

### 10.2 No second truth table in tests without map binding

`TOOL_SHORTCUT_TRUTH` in tests is a **contract mirror**. It must assert equality against `CANVAS_TOOL_SHORTCUTS` / `LABELS` (already does). Never invent keys only in the test array.

### 10.3 `aria-keyshortcuts` pure helper mandatory

Not optional polish. Stale hard-coded string is the **remaining map-class lie** on canvas chrome.

### 10.4 Dimension (M) rail accessible-name test mandatory

Plan 03.2 — ensure `/Dimension \(M\)/` exists; no control claims Dimension for D.

### 10.5 Evidence is part of the product gate

Code green + missing `09-shortcuts-chrome/` logs = **W8 not shippable**. P10 will refuse paper claims.

### 10.6 Discoverability is P1, honesty is P0

A `?` shortcut sheet is the Homestyler/Floorplanner pattern. **Do not block CP-09** on building the sheet. Document as **follow-on** in NOTES so P10 / post-wave polish know the gap.

### 10.7 CAD habit education without rebinding

Because Floorplanner/others use D for dimension, guidance for dimension tool should remain clear (“Pick two points…”) and badge **(M)** must stay visible on desktop. Do not rebind.

### 10.8 Zero `any` / zero silent test filters

Matches AGENTS.md. Preserve unfiltered vitest logs in evidence.

---

## 11. Approaches (2–3) + recommendation

### Approach A — **Map-driven single authority** (recommended)

**Shape:** Invert `CANVAS_TOOL_SHORTCUTS` once; delete per-letter tool arming; live keydown matrix; rail/palette regression; derive `aria-keyshortcuts`; hide-tools inventory only; evidence under `09-`.

| Pros | Cons |
|------|------|
| Matches expert pass + design W8 | Does not add discoverability sheet |
| Minimal code surface | Leaves dual keyboard architecture as-is |
| Prevents drift class of bug | Requires discipline not to “also polish chrome” |
| Aligns Failures D/M lock | — |

**Recommendation:** **Ship Approach A** as the only execute path for P09.

### Approach B — **Rebind map to historical handler (Dimension=D)**

Match bad muscle memory / Floorplanner-like D=dimension by changing maps and labels.

| Pros | Cons |
|------|------|
| Matches one CAD habit | **Violates product lock**, Failures, donor tests, door letter |
| “Feels familiar” to some | Door loses D; palette Door tool lies harder |
| — | Expert pass **forbidden** |

**Verdict:** **Reject.** Not a real approach — a false reverse.

### Approach C — **Unified global keyboard module + shortcut sheet + full 2A**

One `KeyboardController` owns canvas + workspace; modal help `?`; redesign dual surfaces; full chrome.

| Pros | Cons |
|------|------|
| Long-term clean architecture | Scope explosion vs Approach A week-1 |
| Discoverability win | Competes with spine phases for slots |
| — | Phase explicitly out-of-scopes dual redesign and full 2A |

**Verdict:** **Defer** post-W8 / post-wave. Steal **ideas** (help sheet) only after honesty green.

### Approach selection

| Criterion | Winner |
|-----------|--------|
| Matches locked product letters | A |
| Matches expert pass | A |
| Minimal blast radius | A |
| Competitive discoverability max | C (later) |
| Avoids false reverse | rejects B |

**Execute: Approach A only.**

---

## 12. Recommended design (Approach A — detail)

### 12.1 Architecture diagram (logical)

```
canvasTool.ts
  CANVAS_TOOL_SHORTCUTS  ──┐
  CANVAS_TOOL_LABELS     ──┼──► CanvasToolRail (aria/title/badge)
  CANVAS_TOOL_GUIDANCE   ──┤
  CANVAS_TOOLS order     ──┘
         │
         ▼
  invert once → TOOL_BY_SHORTCUT_KEY
         │
         ├── useWorkspaceKeyboard keydown → setTool(id)
         ├── toolFromShortcutKey(key) → id | null
         ├── paletteCommands tool-* shortcut fields
         └── canvasKeyShortcutsAttribute() → FeasibilityCanvas aria-keyshortcuts
```

### 12.2 Keydown precedence (must preserve)

1. Editable guard  
2. Space pan  
3. Mod chords (K palette, Z/Y undo redo)  
4. Tab view toggle  
5. Escape / Enter  
6. Delete / Backspace  
7. Single-letter tool map (no mod, no alt)

### 12.3 File touch allowlist (from phase)

| Path | Role |
|------|------|
| `…/editor/canvasTool.ts` | Authority + optional aria helper |
| `…/editor/useWorkspaceKeyboard.ts` | Map invert arming |
| `…/editor/CanvasToolRail.tsx` | Regression only |
| `…/canvas-feasibility/FeasibilityCanvas.tsx` | `aria-keyshortcuts` only |
| `…/lib/commands/paletteCommands.ts` | Shortcut parity asserts |
| CSS / shell | **Only if** hide-tools proven |
| Tests: `toolShortcutTruth.test.ts`, `open3dWorkspaceKeyboard.test.tsx`, rail a11y, donorParity, workspaceShell | RED/GREEN contract |

### 12.4 Out of scope freeze (repeat for agents)

- Full Approach C / Phase 2A polish  
- A11y A1–A8 unless hide-tools  
- Fabric cutover, mesh, orbit, save, select/delete product redesign  
- Rail tool-set redesign  
- Palette expansion to all PlannerTools  
- Dual keyboard redesign  
- Competitor keymap philosophy  
- Dimension→D rebind  

### 12.5 Residual execute checklist if handler already green

If live invert + tests already pass:

1. Still create `09-shortcuts-chrome/` and run **baseline + green** logs (00, 01 may be green not red — document honestly: “RED phase historical; GREEN at execute”).
2. Complete Task 04 aria helper + tests (still open on live string).
3. Complete Task 03 Dimension (M) rail name test if missing.
4. Complete Task 05 NOTES inventory.
5. Complete Task 06 CP-09 evidence package.
6. Do **not** weaken tests to match any remaining lie.
7. Commit only landable residual slices with honest messages.

If any letter still wrong on re-read: classic RED→GREEN Task 01–02.

---

## 13. Testing strategy (W8 proof class)

### 13.1 Contract table (must exist)

```ts
// Product truth — mirror maps, never invent
const TOOL_SHORTCUT_TRUTH = [
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

### 13.2 Required assertions

| Assert | Suite |
|--------|-------|
| Map key + label per row | `toolShortcutTruth.test.ts` |
| `toolFromShortcutKey` upper/lower | same |
| Unique letters | same |
| Live keydown → `setTool(id)` once per letter | same + hook suite |
| Editable / disabled negatives | both |
| D=door, M=dimension, N=window, T=text explicit | hook suite critical block |
| Rail accessible name Select (V), Opening (O), Dimension (M), Wall (W) | rail a11y / truth |
| Palette `tool-*` shortcut = map | donor / dedicated |
| aria helper includes all map letters | unit on helper |

### 13.3 What not to treat as W8 proof

- Screenshot of rail alone  
- Map-only pure tests without keydown  
- Filtered vitest output  
- “I pressed D in browser once” without log artifact  
- Passing full monorepo suite without the phase evidence folder  

### 13.4 Commands (from phase — for execute agents)

From `site/`:

```powershell
pnpm exec vitest run tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/donorParity.test.ts `
  --reporter=verbose 2>&1 | Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\06-final-vitest.log
```

Also include rail a11y test path when running final pack.

---

## 14. Evidence & CP-09 gate

### 14.1 Canonical paths

| Artifact | Path |
|----------|------|
| Evidence root | `results/planner/world-standard-wave/09-shortcuts-chrome/` |
| Baseline log | `00-baseline-vitest.log` |
| RED log (or honest GREEN-at-execute note) | `01-tool-shortcut-truth-red.log` |
| GREEN handler log | `02-tool-shortcut-truth-green.log` |
| Regression keyboard | `02-regression-keyboard.log` |
| Rail | `03-rail-labels.log` |
| Aria/palette | `04-aria-palette.log` |
| Hide-tools | `05-chrome-hide-tools.log` |
| Final | `06-final-vitest.log` |
| Notes | `NOTES.md` (no TBD) |
| Optional browser | `06-browser-d-m.png` + one-line note |

**Retired name:** `08-shortcuts-chrome/` — **do not use** (collides with mesh ownership of `08-*`).

### 14.2 CP-09 checklist (data, not memory)

| ID | Criterion |
|----|-----------|
| CP-09.1 | Unit table: id → key → `setTool(id)` for **every** authority tool incl. D/M/N/T |
| CP-09.2 | No hard-coded keyboard tool letter table diverges from map |
| CP-09.3 | Rail accessible names `Label (Key)` from maps (regression green) |
| CP-09.4 | `aria-keyshortcuts` / palette match maps (no invented tool letters) |
| CP-09.5 | Hide-tools fixed **or** documented none-found with proof |
| CP-09.6 | Evidence under `09-shortcuts-chrome/` unfiltered logs |
| CP-09.7 | Landable commits on main checkout; push only per owner/git rules |

**W8 PASS** only if CP-09.1–09.6 green from artifacts.

### 14.3 NOTES.md Results section (required fields)

- W8: PASS/FAIL  
- Table id → key → handler verified  
- Chrome hide-tools: none | list  
- Dual-keyboard note: none | conflict  
- Commits hashes  
- Residual failures → root `Failures.md`  

### 14.4 Handoff to P10

P09 contributes only:

- `09-shortcuts-chrome/` pack with **W8 PASS** (or honest FAIL)  
- Commit list for shortcut truth  
- Explicit browser smoke deferred note if skipped  

P10 must not invent alternate folder names.

---

## 15. Risk register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Fix by Dimension→D rebind | Med (pressure) | High — product lie | Forbidden; tests lock D/M |
| Partial N/T unbound left | Low if matrix enforced | Med | Full map matrix |
| Break Delete/undo while editing | Med | High (W3 adjacent) | Preserve non-tool branches; regression logs |
| Dual keyboard thrash redesign | Med (scope creep) | High time waste | Fence + log only |
| CSS churn without hide proof | Med | Noise / regressions | NOTES proof row required |
| Evidence under wrong `08-` folder | Med (history thrash) | P10 confusion | Canonical **09-** only |
| Claim W8 green from code without evidence | High | False ship | CP-09.6 hard gate |
| Competitor key philosophy debates | Low–Med | Scope delay | Our map owns truth |
| Paper green map tests only | High historically | Buyer-facing lie | Live keydown matrix |
| Aria string still stale after handler fix | **High residual** | a11y honesty fail | Task 04 mandatory |

---

## 16. Implementation order (execute agents)

```
00 baseline evidence dir + logs + NOTES smoking-gun / residual status
01 RED truth table (or honest “already green” capture)
02 GREEN handlers (or verify invert, no second table)
03 rail regression tests (Dimension M, Wall W)
04 aria helper + palette parity
05 hide-tools inventory proof-first
06 evidence pack + CP-09 mark from data
```

**Do not** start P10 claims from this brainstorm alone.

**Parallelism:** test authoring with baseline OK; do not polish rail CSS while letter matrix red.

---

## 17. Approaches for residual residual work (if handler already fixed)

| Residual | Approach | Priority |
|----------|----------|----------|
| Stale `aria-keyshortcuts` | Pure helper from map + wired non-tools | **P0** |
| Missing evidence pack | Task 00–06 logging only | **P0** |
| Missing Dimension (M) rail test | Extend RTL | **P1** (plan says must) |
| Hide-tools unknown | Inventory NOTES | **P1** |
| No `?` help sheet | Defer post-CP-09 | **P2** |
| Dual surface unify | Defer post-wave | **P2** |
| Palette full PlannerTool list | Owner product decision | **Out** |

---

## 18. Plan task-by-task critique (executable reading)

| Task | Intent | Critique / residual |
|------|--------|---------------------|
| **00** Setup | Evidence + baseline | Create **09-** path; fix mental model of 00.4 “08-” typo; re-read source for residual vs historical lie |
| **01** RED truth | Live matrix fails on D/M/N/T | If already green, capture green + note historical RED; do not delete tests |
| **02** GREEN handlers | Invert map | Verify no second table remains; commit only if code change needed |
| **03** Rail regression | Dimension (M) names | Strings already good; tests may still lag plan 03.2 |
| **04** Aria + palette | Derive shortcuts string | **Likely main remaining code** |
| **05** Hide-tools | Proof-first | Expect `none` unless browser shows trap; no CSS theater |
| **06** Evidence / CP-09 | Ship gate | Without this, W8 is not done |

---

## 19. Relationship to other phases

| Phase | Interaction with P09 |
|-------|----------------------|
| **P03 W3** | Delete/Backspace handlers must remain; P09 does not redefine delete semantics |
| **P04 orbit** | Tab toggles 2D/3D; do not break Tab while fixing letters |
| **P06 save** | Ctrl+S not currently workspace tool map; do not invent save shortcut theater in P09 |
| **P07 journey** | Browser journey may press tools; honest keys help journey stability |
| **P08 mesh** | Owns `08-mesh-quality/` only — no path collision with W8 |
| **P10 pack** | Consumes `09-shortcuts-chrome/` as W8 proof |

---

## 20. Final recommendations (brutal)

1. **Treat W8 as a contract test suite + evidence folder**, not a UI redesign.  
2. **Never rebind Dimension to D.**  
3. **Finish residual aria honesty** even if handlers already match maps.  
4. **Do not claim CP-09** until `results/planner/world-standard-wave/09-shortcuts-chrome/` exists with unfiltered logs and NOTES without TBD.  
5. **Hide-tools:** prove or write none — no CSS for sport.  
6. **Dual keyboard:** document, do not redesign.  
7. **Competitive research:** steal discoverability *patterns* later; never steal keys.  
8. **Approach A only** — reject B; defer C.  
9. **Update phase “today” narrative** during execute NOTES so future agents do not re-break a fixed handler “because the plan said it was wrong.”  
10. **Raised bar:** one map, one invert, live keydown matrix, pure aria helper, Dimension (M) rail assert, evidence under **09-**.

---

# Appendices

## Appendix A — Full non-tool keyboard surface (workspace)

| Key / chord | Handler | Notes |
|-------------|---------|-------|
| Space (down/up) | temporary pan begin/end | Not a tool letter |
| Ctrl/Cmd+K | openPalette | |
| Tab | toggleView | no Shift/mod/alt |
| Escape | cancel | also clears selection wiring in workspace cancel callback |
| Enter | commit | optional handler |
| Delete / Backspace | deleteSelection | preventDefault |
| Ctrl/Cmd+Z | undo | |
| Ctrl/Cmd+Shift+Z | redo | |
| Ctrl/Cmd+Y | redo | |

## Appendix B — Full tool letter matrix (product)

| Letter | Tool id | Label | Rail | Palette |
|--------|---------|-------|------|---------|
| V | select | Select | yes | yes |
| H | pan | Pan | yes | yes |
| R | room | Room | yes | no |
| W | wall | Wall | yes | yes |
| O | opening | Opening | yes | no |
| M | dimension | Dimension | yes | no |
| P | placement | Place | yes | no |
| D | door | Door | no | yes |
| N | window | Window | no | yes |
| T | text | Text | no | yes |

## Appendix C — Historical vs live handler matrix

| Key | Historical handler | Live (2026-07-10) | Map |
|-----|--------------------|-------------------|-----|
| d | dimension (**LIE**) | door | door |
| m | unbound (**LIE**) | dimension | dimension |
| n | unbound (**GAP**) | window | window |
| t | unbound (**GAP**) | text | text |
| v/r/w/o/p/h | correct | correct | correct |

## Appendix D — File inventory (P09-relevant)

### Phase docs
- `Plans/phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md`
- `Plans/phases/P09-shortcuts-chrome/06-ui-shortcuts.md`
- `Plans/phases/P09-shortcuts-chrome/P09-suggestions.md`
- `Plans/phases/P09-shortcuts-chrome/README.md`
- `Plans/phases/EXPERT-PASS.md` (row UI/shortcuts + P0 #11)

### Product code
- `site/features/planner/open3d/editor/canvasTool.ts`
- `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`
- `site/features/planner/open3d/editor/CanvasToolRail.tsx`
- `site/features/planner/open3d/editor/canvas-tool-rail.module.css`
- `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`
- `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`
- `site/features/planner/open3d/lib/commands/paletteCommands.ts`
- `site/features/planner/open3d/lib/commands/registry.ts`

### Tests
- `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts`
- `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx`
- `site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx`
- `site/tests/unit/features/planner/open3d/donorParity.test.ts`
- `site/tests/unit/features/planner/open3d/workspaceShell.test.tsx` (toolFromShortcutKey section)

### Research / competitive
- `Plans/Research/RESEARCH-MAP.md`
- `Plans/Research/RESULTS-MAP.md`
- `D:\websites\README.md`
- `D:\websites\homestyler.com\report\INSPIRATION.md`
- `D:\websites\homestyler.com\raw\homestyler.com-article-floorplanner-mastering-keyboard-shortcuts-in-interior-design-software.md` (fluff)
- `D:\websites\homestyler.com\raw\homestyler.com-forum-view-1560174293289902081.md`
- `D:\websites\floorplanner.com\report\INSPIRATION.md`
- `D:\websites\planner5d.com\report\TOOLBARS.md`
- `D:\websites\roomsketcher.com\report\INSPIRATION.md`
- `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\02-toolbar\REPORT.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md`

### Design / failures
- `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` (§ W8)
- `Failures.md` (PLAN-FAIL-0413 D→door, M→dimension lineage)

## Appendix E — Competitive discoverability matrix (patterns only)

| Competitor | Public key table? | In-app help? | O&O steal |
|------------|-------------------|--------------|-----------|
| Homestyler | No full table in scrapes | Help → Shortcuts category | **Cheatsheet pattern** |
| Floorplanner | Yes (manual) | `?` sidebar | **Help key pattern** + always-on Esc/Del/Space |
| Planner5D | Sparse (WASD walkthrough) | Support site | **Chrome regions** for hide-tools thinking |
| RoomSketcher | Sparse | Mode UI | **Task grouping** later |
| O&O target | Own map | Optional later `?` | **Honesty first (W8)** |

## Appendix F — Chrome regions (P5D-inspired, O&O-native)

```
┌─────────────────────────────────────────────────────────────┐
│ TOP: project · save honesty · 2D|3D · export · help/?       │
├──────┬──────────────────────────────────────────┬───────────┤
│ RAIL │              CANVAS                       │ CONTEXT  │
│ tools│     Feasibility / plan                    │ inventory│
│ +keys│                                           │ or props │
├──────┴──────────────────────────────────────────┴───────────┤
│ STATUS / guidance: active tool · shortcut · snap · undo     │
└─────────────────────────────────────────────────────────────┘
```

P09 only guarantees: rail reachable, keys honest, aria not lying. Full premium chrome is Approach C / post-wave.

## Appendix G — Glossary

| Term | Meaning |
|------|---------|
| **W8** | World gate: labels match handlers |
| **CP-09** | Checkpoint checklist for P09 |
| **Authority map** | `CANVAS_TOOL_SHORTCUTS` / `LABELS` |
| **Smoking gun** | Map imported but letter arming hard-coded elsewhere |
| **Live keydown matrix** | Dispatch KeyboardEvents; assert `setTool` |
| **Hide-tools** | Chrome that prevents reaching tools |
| **Dual keyboard** | Workspace hook + FeasibilityCanvas local listeners |
| **delegateKeyboard** | When true, canvas local tool keys off |
| **Paper green** | Tests pass without proving buyer-facing path |
| **False reverse** | “Fix” that rebinds map to bad handler |

## Appendix H — What this brainstormer did **not** do

- No product code changes  
- No commits  
- No vitest execution (re-read source + tests only)  
- No re-scrape / Firecrawl  
- No browser DevTools session  
- No files outside `Idiots/P09-shortcuts-chrome/`  

## Appendix I — Self-review (brainstorming skill)

| Check | Result |
|-------|--------|
| Placeholders / TBD | **None** in this report |
| Internal consistency | Handler live-fix vs plan historical lie called out explicitly |
| Scope | W8 + hide-tools only; Approach A recommended |
| Ambiguity | Canonical evidence path locked to **09-**; Dimension letter locked to **M** |
| Approaches | A recommend, B reject, C defer |
| Design presented | Architecture + precedence + residual checklist |

## Appendix J — One-page execute brief (for implementer)

1. Re-read `canvasTool.ts` + `useWorkspaceKeyboard.ts`.  
2. Confirm invert still sole letter source.  
3. Create `results/planner/world-standard-wave/09-shortcuts-chrome/`.  
4. Run truth + keyboard + donor + rail tests → unfiltered logs.  
5. Implement pure `aria-keyshortcuts` helper; replace hard-coded string.  
6. Add Dimension (M) / Wall (W) rail name tests if missing.  
7. NOTES hide-tools inventory; CSS only with proof.  
8. Dual-keyboard note.  
9. Mark CP-09 from artifacts only.  
10. Never Dimension→D.

---

**End of REPORT.**  
**Deliverable path:** `D:\OandO07072026\Idiots\P09-shortcuts-chrome\REPORT.md`  
**Next owner:** execute agent for P09 Tasks 00–06 under phase plan + this raised bar — still **no** Approach B/C scope.
