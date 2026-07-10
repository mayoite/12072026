# P09 — Shortcuts & Blocking Chrome (W8) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** Make every tool **id → shortcut letter → live keydown handler → visible label / aria / badge / palette string** tell the same truth (gate **W8** / **CP-09**), close residual stale `aria-keyshortcuts`, inventory hide-tools chrome without redesign, and land unfiltered evidence under `results/planner/world-standard-wave/09-shortcuts-chrome/`.

**Architecture:** Single authority maps in `site/features/planner/open3d/editor/canvasTool.ts` (`CANVAS_TOOL_SHORTCUTS`, `CANVAS_TOOL_LABELS`, `CANVAS_TOOL_GUIDANCE`, `CANVAS_TOOLS`) drive rail chrome, palette tool rows, status guidance, a pure `canvasKeyShortcutsAttribute()` helper, and letter arming. Live keyboard arming **must** invert the map once into `TOOL_BY_SHORTCUT_KEY` (already present on disk as of 2026-07-10 re-read — **verify, do not re-implement for sport**). Non-tool always-ons (Space pan, Tab, Esc, Enter, Delete/Backspace, Ctrl/Cmd+K, undo/redo) stay in `useWorkspaceKeyboard` with clear precedence. Dual surface: open3d path uses `delegateKeyboard` so workspace owns tool letters; FeasibilityCanvas local keys remain zoom/escape when not delegated — **no dual redesign**.

**Tech Stack:** Next.js site · Vitest · React Testing Library · Phosphor icons · open3d workspace (`OOPlannerWorkspace` + `FeasibilityCanvas` + `CanvasToolRail`). **No new packages.**

**Inputs consumed:**
- Repo read: 2026-07-10 — live `canvasTool.ts`, `useWorkspaceKeyboard.ts`, rail/palette/aria surfaces, unit suites; `results/planner/` **absent** on this checkout
- Brainstormer: **`Idiots/P09-shortcuts-chrome/REPORT.md` only** (NEVER `Idiots2/`)
- Phase plan: `Plans/phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md` + `06-ui-shortcuts.md` + `P09-suggestions.md`
- Expert: `Plans/phases/EXPERT-PASS.md` P0 #11 + `06-ui-shortcuts.md` verdict FIX
- Design gate: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §2 **W8**
- Evidence map: `Plans/Research/RESULTS-MAP.md` (FOLDER-LOCK: **`09-shortcuts-chrome/`** only)

**Done when:**
1. Live keydown matrix proves every map letter → `setTool(id)` (D=door, M=dimension, N=window, T=text included).
2. No second hard-coded tool letter table diverges from `CANVAS_TOOL_SHORTCUTS`.
3. Rail accessible names use `Label (Key)` from the same maps (Select (V), Opening (O), Dimension (M), Wall (W) at minimum).
4. `aria-keyshortcuts` + palette tool-* shortcuts match maps (no invented tool letters; no omitted map letters).
5. Hide-tools: fixed **or** documented `chrome-hide-tools: none` with NOTES proof rows.
6. Evidence under `results/planner/world-standard-wave/09-shortcuts-chrome/` with unfiltered logs + NOTES without TBD.
7. CP-09.1–09.6 green from **data**, not memory. **W8 PASS only then.**

**Evidence folder (canonical):** `results/planner/world-standard-wave/09-shortcuts-chrome/`  
**Forbidden alias:** `08-shortcuts-chrome/` (mesh owns sole primary `08-mesh-quality/`).

**Execution posture (binding):** Historical expert smoking gun (D→dimension second table; M/N/T unbound) is **product law / regression class**. Live code on 2026-07-10 already inverts the map and ships `toolShortcutTruth.test.ts` + hook matrix. Executor **re-proves** + closes residual honesty (**aria** + **evidence** + **hide-tools NOTES** + rail Dimension/Wall name asserts). Do **not** claim W8 PASS without `09-` artifacts.

**Approach locked:** **A only** — map-driven single authority. Reject B (Dimension→D rebind). Defer C (unified keyboard + help sheet + full 2A).

---

## 1. Repo reality

### 1.1 What actually exists (live paths)

| Path | Role | Live state (2026-07-10 planner re-read) |
|------|------|----------------------------------------|
| `site/features/planner/open3d/editor/canvasTool.ts` | Authority maps + labels + guidance + `CANVAS_TOOLS` order + `runtimeToolFor` | Present; product letters locked |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Keydown → handlers; invert map; `toolFromShortcutKey` | **Map-driven already** (`TOOL_BY_SHORTCUT_KEY`; letter arming from map only) |
| `site/features/planner/open3d/editor/CanvasToolRail.tsx` | Rail chrome Label (Key) | Map-sourced aria/title/badge |
| `site/features/planner/open3d/editor/canvas-tool-rail.module.css` | Rail layout | `<48rem` horizontal reflow; print hide; badge hide on small — **not tool hide** |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Canvas + local keys + `aria-keyshortcuts` | **Stale aria** hard-coded `V W D T H…`; local keys gated by `delegateKeyboard` |
| `site/features/planner/open3d/lib/commands/paletteCommands.ts` | Palette subset | Map-sourced tool shortcuts for `CanvasTool` subset; `buildPaletteCommands()` zero-arg |
| `site/features/planner/open3d/lib/commands/registry.ts` | Feasibility action shortcuts (W, Esc, Ctrl+Z, zoom) | Separate action surface; do not thrash into a third tool map |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Wires `useWorkspaceKeyboard`; `delegateKeyboard`; guidance strip | Open3d path owns tool arming |
| `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` | Full W8 matrix | **Exists** with live keydown all letters |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | Hook suite + letter matrix mirror | **Exists** (D/M/N/T + full map loop) |
| `site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx` | Rail Select (V), Opening (O) | **Partial** — extend Dimension (M) / Wall (W) |
| `site/tests/unit/features/planner/open3d/donorParity.test.ts` | Palette + `toolFromShortcutKey` | Present; calls `buildPaletteCommands(handlers)` (extra arg ignored) |
| `site/tests/unit/features/planner/open3d/workspaceShell.test.tsx` | `toolFromShortcutKey` parity | Present (map resolver only — not live keydown) |
| `site/lib/ui/KeyboardShortcuts.tsx` | Global `?` modal with **hard-coded** SHORTCUTS | **Out of P09 product rail truth** as CP gate; lists Z/F/S etc. that open3d map does not own — NOTES honesty optional only |
| `site/features/planner/hooks/useKeyboardShortcuts.ts` | Fabric-era select/pan/room | **Not** open3d W8 surface — do not thrash |
| `results/planner/world-standard-wave/` | Evidence tree | **Absent** on this checkout → CP-09.6 not re-proven |

### 1.2 Authority map (product contract — do not invent)

From live `site/features/planner/open3d/editor/canvasTool.ts`:

```typescript
export const CANVAS_TOOL_SHORTCUTS: Record<PlannerTool, string> = {
  select: "V",
  room: "R",
  wall: "W",
  opening: "O",
  dimension: "M",
  placement: "P",
  door: "D",
  window: "N",
  text: "T",
  pan: "H",
};

export const CANVAS_TOOL_LABELS: Record<PlannerTool, string> = {
  select: "Select",
  room: "Room",
  wall: "Wall",
  opening: "Opening",
  dimension: "Dimension",
  placement: "Place",
  door: "Door",
  window: "Window",
  text: "Text",
  pan: "Pan",
};

export const CANVAS_TOOLS: PlannerTool[] = [
  "select",
  "pan",
  "room",
  "wall",
  "opening",
  "dimension",
  "placement",
];
```

| Tool id | Shortcut | Label | On rail (`CANVAS_TOOLS`)? | On palette subset (`CanvasTool`)? |
|---------|----------|-------|---------------------------|-----------------------------------|
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

**Unique letters:** `V R W O M P D N T H` — ten tools, ten letters.  
**Forbidden “fix”:** rebind Dimension → **D** to match any historical bad handler (Failures PLAN-FAIL-0413 lineage + expert pass).

### 1.3 Live handler truth (repo wins over stale expert prose)

Expert pass / phase card (2026-07-09) described the **historical** smoking gun:

| Key | Historical handler | Map claim |
|-----|-------------------|-----------|
| D | `setTool("dimension")` | door |
| M | unbound | dimension |
| N | unbound | window |
| T | unbound | text |

**Live `useWorkspaceKeyboard.ts` (2026-07-10):**

```typescript
const TOOL_BY_SHORTCUT_KEY: Record<string, PlannerTool> = Object.fromEntries(
  (Object.entries(CANVAS_TOOL_SHORTCUTS) as Array<[PlannerTool, string]>).map(
    ([tool, shortcut]) => [shortcut.toLowerCase(), tool],
  ),
) as Record<string, PlannerTool>;

// on keydown, after always-ons:
if (!mod && !event.altKey) {
  const tool = TOOL_BY_SHORTCUT_KEY[key];
  if (tool !== undefined) {
    event.preventDefault();
    handlers.setTool(tool);
  }
}

export function toolFromShortcutKey(key: string): PlannerTool | null {
  return TOOL_BY_SHORTCUT_KEY[key.toLowerCase()] ?? null;
}
```

**Contradiction rule:** Repo wins. Plan treats historical smoking gun as **regression law**, not current bug claim. NOTES must say “historical class” vs “live residual.”

### 1.4 Keydown precedence (must preserve)

From live `useWorkspaceKeyboard.ts`:

1. Editable target guard (`INPUT` / `TEXTAREA` / `SELECT` / contentEditable) → ignore
2. Space → temporary pan (keydown/keyup pair via `beginTemporaryPan` / `endTemporaryPan`)
3. Mod+K → openPalette
4. Tab (no shift/mod/alt) → toggleView
5. Escape → cancel
6. Enter → commit
7. Delete / Backspace → deleteSelection
8. Mod+Shift+Z / Mod+Y → redo; Mod+Z → undo
9. No-mod letter → `TOOL_BY_SHORTCUT_KEY[key]` → `setTool`

| Key / chord | Handler | Surface on open3d workspace |
|-------------|---------|------------------------------|
| Space (hold) | beginTemporaryPan / endTemporaryPan | workspace |
| Tab | toggleView | workspace |
| Escape | cancel | workspace |
| Enter | commit | workspace |
| Delete / Backspace | deleteSelection | workspace (P03 owns **semantics**; P09 must not strip preventDefault) |
| Ctrl/Cmd+K | openPalette | workspace |
| Ctrl/Cmd+Z | undo | workspace |
| Ctrl/Cmd+Shift+Z / Y | redo | workspace |
| 0 + - | zoom | canvas local when `!delegateKeyboard`; rail button “0” for fit |

### 1.5 Dual keyboard fence (open3d)

`OOPlannerWorkspace` mounts:

```tsx
useWorkspaceKeyboard({
  setTool,
  toggleView,
  openPalette: () => setPaletteOpen(true),
  undo: runUndo,
  redo: runRedo,
  deleteSelection,
  cancel: () => { /* clear placement + canvas cancel + clear selection */ },
  commit: () => { canvasRef.current?.commit?.(); },
  beginTemporaryPan: () => { /* set pan on canvas + state */ },
  endTemporaryPan: () => { /* restore armedToolRef */ },
});
// …
<FeasibilityCanvas … delegateKeyboard … />
```

When `delegateKeyboard === true`, FeasibilityCanvas local keydown **returns early** after Space tracking (still sets `spacePressedRef`). Tool arming ownership = workspace hook.

Local path when `delegateKeyboard === false` (standalone / proof embeds only):

- `w` → draw-wall command
- Escape → cancel
- Ctrl/Cmd+Z → undo
- `0` / `+`/`=` / `-` → zoom

**Do not redesign dual surface in this phase.** Document ownership in NOTES. Minimal guard only if both fire and break W8 on product path.

### 1.6 Stale `aria-keyshortcuts` (primary residual code fix)

Live hard-coded on canvas element (`FeasibilityCanvas.tsx` ~L915):

```
aria-keyshortcuts="V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -"
```

| Token | In map? | Wired on workspace path? | Verdict |
|-------|---------|--------------------------|---------|
| V W D T H | yes | yes | Present |
| Tab Escape Control+Z… | non-tool | yes | Present |
| 0 + - | zoom | canvas local only if !delegate; rail has “0” | Ambiguous on delegated path |
| **R O M P N** | yes | yes | **OMITTED — must add** |
| Control+K | palette | yes | **OMITTED — should include** |

**No helper exists yet:** grep shows zero `canvasKeyShortcutsAttribute` — Task 04 creates it next to authority maps.

### 1.7 Rail chrome (already map-sourced — regression surface)

`CanvasToolRail.tsx`:

```tsx
const label = CANVAS_TOOL_LABELS[tool];
const shortcut = CANVAS_TOOL_SHORTCUTS[tool];
// …
aria-label={`${label} (${shortcut})`}
title={`${label} (${shortcut})`}
<span className={styles.shortcut}>{shortcut}</span>
```

Rail tools: select, pan + DRAW_TOOLS = room, wall, opening, dimension, placement + optional zoom-to-fit (0).

CSS (`canvas-tool-rail.module.css`):

- `@media (width < 48rem)`: horizontal reflow; `.shortcut { display: none }` — **aria-label retains letter** — not hide-tools
- `@media print`: `.rail { display: none }` — **allowed**

Tests: Select (V) + Opening (O) only. Plan requires Dimension (M) + Wall (W).

### 1.8 Palette subset honesty

`paletteCommands.ts` TOOL_IDS:

```typescript
const TOOL_IDS: CanvasTool[] = ["select", "wall", "door", "window", "text", "pan"];
// shortcut: CANVAS_TOOL_SHORTCUTS[tool]
```

- Does **not** list room / opening / dimension / placement — **allowed** for P09
- `runPaletteCommand("tool-door")` → `setTool("door")` must remain
- `buildPaletteCommands(): PaletteCommand[]` takes **no** handlers
- `donorParity.test.ts` still calls `buildPaletteCommands(handlers)` — extra arg ignored in JS; clean when touching palette tests

### 1.9 Guidance strip (map-sourced)

`OOPlannerWorkspace` status:

```tsx
{CANVAS_TOOL_SHORTCUTS[activeTool]} · {CANVAS_TOOL_GUIDANCE[activeTool]}
```

After map-driven arming, active tool status must match letter. Fix only if a local hard-code lies (none found on re-read).

### 1.10 Evidence / thin-note honesty

- `results/planner/` tree **missing** on this checkout.
- RESULTS-MAP anti-claim: “Shortcuts OK” requires `09-shortcuts-chrome/` artifacts, not “keymap file exists unread.”
- Code green + missing evidence = **W8 not shippable**. P10 will refuse paper claims.

### 1.11 Out of scope (hard)

- Full Approach C / Phase 2A polish (RAC drawers, premium topbar, mobile redesign)
- Full a11y A1–A8 unless finding **hides tools**
- Fabric cutover, mesh (P08), select/delete product semantics (P03), orbit (P04), save honesty (P06)
- Rail tool-set redesign; palette expansion to every `PlannerTool`
- Dual-keyboard architecture rewrite
- Competitor keymap philosophy (Floorplanner D=dimension)
- Forbidden Dimension→D rebind
- Global `site/lib/ui/KeyboardShortcuts.tsx` marketing modal rewrite as P09 scope (optional NOTES honesty only)
- `?` help sheet as CP-09 blocker (Homestyler/Floorplanner discoverability pattern — **P1 after honesty**)
- New npm packages; Firecrawl re-scrape
- Worktrees

### 1.12 Related archive noise (do not touch for W8)

| Path | Note |
|------|------|
| `site/features/planner/hooks/useKeyboardShortcuts.ts` | Fabric-era select/pan/room only |
| `site/features/planner/_archive/fabric/editor/*` | Archive (tool rail shortcuts, step bindings) |
| `site/tests/e2e/planner-chrome.spec.ts` | Floating dock removed; not W8 letter matrix |
| `site/features/planner/shared/components/editor/Toolbar.tsx` | Shared toolbar defs — not open3d rail authority |

### 1.13 HEAD honesty

Executor must run at start:

```powershell
cd D:\OandO07072026
git rev-parse HEAD
git status -sb
```

Record real SHA + dirty flag in NOTES. This plan does not hard-code a SHA (tree may move before execute).

---

## 2. Brainstormer synthesis (`Idiots/P09-shortcuts-chrome/REPORT.md`)

> **Input authority for this plan wave:** `Idiots/` only. Do not open or cite `Idiots2/` as input for this document.

### 2.1 One-screen verdict (from REPORT §0)

**W8 is a truth contract, not a chrome polish epic.**

> For every tool id in the authority maps, **id → shortcut letter → live keydown → `setTool(id)` → visible label / badge / palette / `aria-keyshortcuts`** must tell the **same** story.

| Layer | Plan/expert 2026-07-09 | Live 2026-07-10 (REPORT + this plan re-read) |
|-------|------------------------|-----------------------------------------------|
| Map | D=door, M=dimension, N/T | Unchanged — authority |
| Handler letter arming | Second table D→dimension | **Fixed** — invert once |
| Live keydown tests | Missing | **Present** |
| Rail strings | Map-sourced | Map-sourced |
| Palette | Map-sourced subset | Map-sourced subset |
| `aria-keyshortcuts` | Stale | **Still stale** |
| Evidence `09-` | Required | **Missing** |

**Brutal honesty:** Handler alignment is not W8 ship. Residual = aria + evidence + hide-tools NOTES + Dimension (M) rail assert.

### 2.2 What W8 is (product + gate)

From design spec: **W8** = Tool/shortcut labels match handlers · proof = unit + keyboard test.  
From `Plans/INDEX.md`: W8 owned by **P09**.  
Approach **A** (product journey first). Phase 2A chrome only where it **hides or blocks tools**.

**Buyer failure modes:**

1. Rail **Dimension (M)** → press **D** → wrong tool (historical) → trust collapses  
2. Palette Door (D) → key does something else → power users quit  
3. Screen readers claim keys product does not own / omit primary tools → a11y theater  

### 2.3 Industry JTBD / patterns (ideas only — no copy)

From REPORT §8 (research under `D:\websites` — **inspiration only**):

| Source | Pattern adopted as O&O form | Rejected |
|--------|----------------------------|----------|
| Homestyler | Help→Shortcuts **discoverability** idea; five-zone shell concept | Brand, icons, SEO fluff key tables, WASD as tool letters |
| Floorplanner | Published matrix discipline; Space pan; Esc/Delete/Undo grammar; `?` help pattern | **D=dimension, M=tape** letters; manual prose as product copy |
| Planner5D | Chrome **regions** for hide-tools thinking | Smart Wizard / toolbar pixel clone |
| RoomSketcher | Task mode grouping later | Invent full map from thin pack |
| World-standard comparison toolbar | Labels truth W8; O&O research score ~2 historically | Pixel clone of winners |

**O&O letters locked (not competitor):** D=door · M=dimension · O=opening · N=window · T=text · V/R/W/P/H as map.

**CAD habit note:** Floorplanner users may press D for dimension. O&O teaches via badge **(M)** + guidance — **never** rebind.

Firecrawl is **dead** for active work — re-read reports only; no re-scrape.

### 2.4 Approaches (chosen)

| ID | Approach | Verdict |
|----|----------|---------|
| **A** | Map invert + truth tests + residual aria/evidence/hide-tools | **SHIP for W8** (REPORT + phase locked) |
| B | Rebind Dimension→D to match historical handler / Floorplanner habit | **Forbidden** |
| C | Unified global keyboard + `?` sheet + full 2A | **Defer** post-W8 |

**Execute: Approach A only.**

### 2.5 Failure modes → plan tasks

| Failure class (REPORT) | How plan blocks |
|------------------------|-----------------|
| Dual source of truth (map vs keydown) | Invert-only arming + live keydown matrix |
| Partial matrix (only D/M) | Full 10-letter table |
| Forbidden Dimension→D | Explicit stop in tasks + CP |
| Paper PASS without evidence | Task 00/06 + CP-09.6 |
| aria omit (class residual) | Task 04 pure helper |
| Hide-tools CSS churn | Task 05 proof-first |
| Wrong folder `08-` | Canonical `09-` only |
| Re-implement invert when done | Task 00 honesty branch |
| Break Delete/undo | Non-tool regression tests |
| Dual surface thrash | Scope fence + NOTES |
| Map-only green without keydown | Forbidden as W8 proof class |
| `TOOL_SHORTCUT_TRUTH` invents keys | Must assert equality vs maps |

### 2.6 Raised bar (stronger than process PASS — REPORT §10)

1. Single invert at module scope (done if live holds)  
2. No second truth table in tests without map binding  
3. `aria-keyshortcuts` pure helper **mandatory** (not optional polish)  
4. Dimension (M) rail accessible-name test **mandatory**  
5. Evidence is part of the product gate  
6. Discoverability (`?`) is P1; honesty is P0  
7. CAD habit education without rebinding  
8. Zero `any` / zero silent test filters  

### 2.7 Plan critique folded (REPORT §9)

| Issue | Resolution in this plan |
|-------|-------------------------|
| S1 evidence thrash 08 vs 09 | **09- only** |
| Task 00.4 phase typo “08- not 09-” | Treat as stale typo — canonical **09-** |
| “Today” handler narrative stale | NOTES historical vs live residual |
| Incomplete rail a11y vs plan 03.2 | Task 03 extends Dimension/Wall |
| No canvasKeyShortcutsAttribute | Task 04 creates |
| Evidence missing | Task 00 creates + Task 06 packs |
| W0 unlock re-ask | Do not block — W0 unlocked |

### 2.8 Open questions resolved

| Question | Resolution |
|----------|------------|
| Evidence 08 vs 09? | **09- only** (FOLDER-LOCK) |
| Re-implement invert? | **No** if already map-driven — verify + residual |
| Expand palette to opening/dimension/room? | **No** |
| `?` Help sheet required for W8? | **No** — P1 after truth |
| Zoom keys on aria when delegated? | Parameterize helper (`includeCanvasZoom`); default honest for surface |
| Global KeyboardShortcuts modal? | Out of W8 gate; optional NOTES honesty |
| Door vs Opening collapse? | **Out** — D and O stay distinct |

---

## 3. Ethics / non-copy

- Research under `D:\websites` and `Plans/Research` = **ideas / JTBD / patterns only**.
- No competitor icons, chrome pixels, JS, GLB, marketing copy, or help prose into product.
- Firecrawl is **dead** for routine work.
- Do not market “works like Homestyler shortcuts.”
- O&O product strings remain original (`CANVAS_TOOL_GUIDANCE`, labels).
- Cleared paid packages only if already in product — **no new packages** for P09.

---

## 4. File map

### Create

| Path | Why |
|------|-----|
| `results/planner/world-standard-wave/09-shortcuts-chrome/` | Evidence root |
| `results/planner/world-standard-wave/09-shortcuts-chrome/NOTES.md` | Honesty + CP results |
| `results/planner/world-standard-wave/09-shortcuts-chrome/*.log` | Unfiltered Vitest |
| `results/planner/world-standard-wave/09-shortcuts-chrome/run.json` | RESULTS-MAP minimum |
| (optional) `06-browser-d-m.png` | Browser smoke |

### Modify (likely residual)

| Path | Change |
|------|--------|
| `site/features/planner/open3d/editor/canvasTool.ts` | Add pure `canvasKeyShortcutsAttribute()` helper |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Wire helper into `aria-keyshortcuts` |
| `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` | Aria helper asserts; keep matrix; optional mod-chord negative |
| `site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx` | Dimension (M), Wall (W) regression |
| `site/tests/unit/features/planner/open3d/donorParity.test.ts` | Palette shortcut assert + arity clean |

### Modify only if proven broken

| Path | When |
|------|------|
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Only if Task 00 baseline shows live matrix RED |
| `site/features/planner/open3d/editor/CanvasToolRail.tsx` | Only if hard-coded label/shortcut found |
| `site/features/planner/open3d/lib/commands/paletteCommands.ts` | Only if tool-* shortcut ≠ map |
| `site/features/planner/open3d/editor/canvas-tool-rail.module.css` | Only if hide-tools at interactive viewport |
| `site/features/planner/open3d/editor/workspace.module.css` / `WorkspaceShell.tsx` | Only if shell covers/unmounts rail |

### Do not create/modify

- `Idiots2/` (never for this plan wave)
- Fabric archive keyboards
- Full Help sheet product unless residual P1 after CP-09 (not required for W8)
- Competitor scrapes under `D:\websites`

---

## 5. Architecture & data flow

### 5.1 Single source diagram

```
canvasTool.ts
  CANVAS_TOOL_SHORTCUTS  ──┐
  CANVAS_TOOL_LABELS     ──┼──→ CanvasToolRail (aria/title/badge)
  CANVAS_TOOL_GUIDANCE   ──┤
  CANVAS_TOOLS order     ──┤
                           ├──→ OOPlannerWorkspace status strip
                           ├──→ paletteCommands TOOL_IDS subset
                           ├──→ canvasKeyShortcutsAttribute() → FeasibilityCanvas aria
                           └──→ invert once → TOOL_BY_SHORTCUT_KEY
                                    ├── useWorkspaceKeyboard letter arm
                                    └── toolFromShortcutKey
```

### 5.2 Runtime vs shortcut truth

`runtimeToolFor` maps:

| PlannerTool | CanvasRuntimeTool |
|-------------|-------------------|
| room | wall |
| opening | door |
| dimension | text |
| placement | select |
| (others) | self |

W8 requires letter → `setTool(PlannerTool id)`, **not** letter → runtime alias.  
Do not “simplify” O→door or M→text for keyboard purposes.

### 5.3 Door vs opening vs dimension

| Tool | Job | Letter | Surface |
|------|-----|--------|---------|
| opening | Generic wall void (product rail) | O | Rail primary |
| door | Door-specific (legacy CanvasTool) | D | Palette |
| dimension | Measure annotate | M | Rail |
| window | Window (legacy) | N | Palette |
| text | Annotation (legacy) | T | Palette |

Both D and O valid; must stay distinct. Collapsing is a product redesign — **out of P09**.

### 5.4 Discoverability stack (Homestyler-class idea, O&O form)

| Layer | Form | P09? |
|-------|------|------|
| L1 | Rail badge + `Label (Key)` | Yes — regression |
| L2 | Status strip shortcut + guidance | Present — spot check |
| L3 | Palette Ctrl+K shortcut fields | Subset honest |
| L4 | Help/`?` full sheet | After truth (not blocking CP if matrix+aria green) |
| L5 | canvas `aria-keyshortcuts` | Task 04 residual **mandatory** |

### 5.5 Wiring path (open3d)

```
User keydown
  → useWorkspaceKeyboard (window listener)
  → setTool(id) in OOPlannerWorkspace
  → setActiveTool + canvasRef.setTool
  → CanvasToolRail data-active
  → status strip shows CANVAS_TOOL_SHORTCUTS[activeTool] + GUIDANCE
```

---

## 6. Task list

### Task 00: Setup / baseline verification

**Files:**
- Create: `results/planner/world-standard-wave/09-shortcuts-chrome/`
- Create: `results/planner/world-standard-wave/09-shortcuts-chrome/NOTES.md`
- Create: `results/planner/world-standard-wave/09-shortcuts-chrome/00-baseline-vitest.log`
- Read only: `useWorkspaceKeyboard.ts`, `canvasTool.ts`, `FeasibilityCanvas.tsx` (~aria line)

- [ ] **Step 1: Create evidence directory**

```powershell
$root = "D:\OandO07072026\results\planner\world-standard-wave"
New-Item -ItemType Directory -Force -Path (Join-Path $root "09-shortcuts-chrome") | Out-Null
Test-Path (Join-Path $root "09-shortcuts-chrome")
# Must be True. Must NOT create 08-shortcuts-chrome.
```

Expected: directory exists; **not** named `08-shortcuts-chrome`.

- [ ] **Step 2: Record HEAD honesty into NOTES stub**

```powershell
cd D:\OandO07072026
git rev-parse HEAD
git status -sb
```

Write `NOTES.md` header (fill real values):

```markdown
# 09-shortcuts-chrome NOTES

## Meta
- date: YYYY-MM-DD
- HEAD: <sha>
- dirty: yes/no
- agent: executor
- machine: <host>
- brainstormer input: Idiots/P09-shortcuts-chrome/REPORT.md
- plan: plans2/P09-shortcuts-chrome/IMPLEMENTATION-PLAN.md

## Baseline (Task 00)
- vitest files run: (pending)
- pass/fail counts: (pending)
- log path: 00-baseline-vitest.log

## Historical smoking gun (law — not necessarily live bug)
- Second hard-coded letter table class (expert 2026-07-09): D→dimension; M/N/T unbound
- Product law: D=door · M=dimension · O=opening · N=window · T=text · V/R/W/P/H as map
- Forbidden: Dimension→D rebind
- Single source: CANVAS_TOOL_SHORTCUTS

## Live residual honesty (this run)
- Handler map-driven?: (fill after Step 3)
- second letter table present?: (fill)
- toolShortcutTruth present?: yes
- aria-keyshortcuts value: (paste)
- evidence folder created: yes
- residual work: aria helper · evidence pack · Dimension(M) rail assert · hide-tools NOTES
```

- [ ] **Step 3: Code-review smoking gun vs live (no edit)**

Open `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`.

Confirm presence of invert:

```typescript
const TOOL_BY_SHORTCUT_KEY: Record<string, PlannerTool> = Object.fromEntries(
  (Object.entries(CANVAS_TOOL_SHORTCUTS) as Array<[PlannerTool, string]>).map(
    ([tool, shortcut]) => [shortcut.toLowerCase(), tool],
  ),
) as Record<string, PlannerTool>;
```

Confirm **absence** of hard-coded branches like:

```typescript
// FORBIDDEN residual pattern — must not remain:
if (key === "d") handlers.setTool("dimension");
if (key === "m") handlers.setTool("dimension"); // wrong if D already dimension
```

Paste into NOTES:

- `handler map-driven: yes|no` + approximate line refs  
- `second letter table present: yes|no`

Open `FeasibilityCanvas.tsx` and paste exact `aria-keyshortcuts="…"` value into NOTES.

- [ ] **Step 4: Run baseline Vitest (unfiltered)**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/donorParity.test.ts `
  tests/unit/features/planner/open3d/workspaceShell.test.tsx `
  tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\00-baseline-vitest.log
```

Expected (if live code matches planner read): **PASS** on truth + keyboard letter matrix; donor/shell may PASS; rail a11y PASS for Select/Opening.

| Baseline result | Branch |
|-----------------|--------|
| Matrix **FAIL** | Document failing assertions; Task 02 repair path (classic RED→GREEN) |
| Matrix **PASS** | Document “already green — residual = aria + evidence + hide-tools + rail name gaps” — **do not invent fake RED** |

- [ ] **Step 5: Ownership fence note**

In NOTES:

```markdown
## Ownership fence
- Delete/Backspace semantics: P03 — P09 must not rebind meaning
- Orbit / Tab view: P04 — do not thrash Tab semantics beyond toggleView wiring
- Save honesty: P06 — do not invent Ctrl+S theater
- Mesh: P08 — owns 08-mesh-quality only
- Dual keyboard redesign: out
- Discoverability ? sheet: P1 after CP-09 honesty
```

- [ ] **Step 6: Commit evidence scaffold only if repo tracks results**

If `results/` is gitignored, do **not** force-add. Local files still required for CP-09.6 on machine of record. If tracked:

```bash
git add results/planner/world-standard-wave/09-shortcuts-chrome/NOTES.md
git commit -m "docs(planner): P09 W8 evidence scaffold 09-shortcuts-chrome"
```

**Done when:** baseline log exists; NOTES lists historical law + live residual; path is **09-**.

---

### Task 01: Unit map truth table (RED-first honesty)

**Files:**
- Test: `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` (exists — extend only if gaps)
- Test: `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` (mirror already present)

**Branching rule:**

| Baseline result | Action |
|-----------------|--------|
| Matrix RED | Proceed classic RED→GREEN Task 02 |
| Matrix GREEN | Skip inventing failing tests; still ensure full contract present; log as green-as-baseline |

- [ ] **Step 1: Confirm full truth table contract in test**

Ensure the following contract exists (if file already matches, leave content; if missing rows/cases, bring to this standard):

```typescript
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CANVAS_TOOL_LABELS,
  CANVAS_TOOL_SHORTCUTS,
  type PlannerTool,
} from "@/features/planner/open3d/editor/canvasTool";
import {
  toolFromShortcutKey,
  useWorkspaceKeyboard,
  type WorkspaceKeyboardHandlers,
} from "@/features/planner/open3d/editor/useWorkspaceKeyboard";

/** W8 product truth — must match authority maps; do not invent keys. */
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

function makeHandlers(overrides: Partial<WorkspaceKeyboardHandlers> = {}): WorkspaceKeyboardHandlers {
  return {
    setTool: vi.fn(),
    toggleView: vi.fn(),
    openPalette: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    cancel: vi.fn(),
    commit: vi.fn(),
    beginTemporaryPan: vi.fn(),
    endTemporaryPan: vi.fn(),
    deleteSelection: vi.fn(),
    ...overrides,
  };
}

function press(init: KeyboardEventInit) {
  act(() => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init }),
    );
  });
}

afterEach(() => {
  cleanup();
});

describe("tool shortcut truth (W8)", () => {
  it("authority maps match the product truth table for every tool id", () => {
    for (const row of TOOL_SHORTCUT_TRUTH) {
      expect(CANVAS_TOOL_SHORTCUTS[row.id]).toBe(row.key);
      expect(CANVAS_TOOL_LABELS[row.id]).toBe(row.label);
    }
  });

  it("toolFromShortcutKey resolves upper and lower case for every map letter", () => {
    for (const row of TOOL_SHORTCUT_TRUTH) {
      expect(toolFromShortcutKey(row.key)).toBe(row.id);
      expect(toolFromShortcutKey(row.key.toLowerCase())).toBe(row.id);
    }
  });

  it("shortcut letters are unique across CANVAS_TOOL_SHORTCUTS", () => {
    const letters = Object.values(CANVAS_TOOL_SHORTCUTS).map((k) => k.toUpperCase());
    expect(new Set(letters).size).toBe(letters.length);
  });

  it("live keydown arms setTool(id) for every map letter (D=door, M=dimension, N=window, T=text)", () => {
    for (const row of TOOL_SHORTCUT_TRUTH) {
      const handlers = makeHandlers();
      const { unmount } = renderHook(() => useWorkspaceKeyboard(handlers));

      press({ key: row.key.toLowerCase() });

      expect(handlers.setTool).toHaveBeenCalledTimes(1);
      expect(handlers.setTool).toHaveBeenCalledWith(row.id);

      unmount();
    }
  });

  it("does not arm tools while typing in an editable field", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));

    const input = document.createElement("input");
    document.body.appendChild(input);
    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "d", cancelable: true }),
      );
    });
    expect(handlers.setTool).not.toHaveBeenCalled();
    input.remove();
  });

  it("does not arm tools when keyboard is disabled", () => {
    const handlers = makeHandlers({ enabled: false });
    renderHook(() => useWorkspaceKeyboard(handlers));

    press({ key: "m" });
    press({ key: "d" });
    expect(handlers.setTool).not.toHaveBeenCalled();
  });

  it("Opening tool uses O in CANVAS_TOOL_SHORTCUTS and resolves via toolFromShortcutKey", () => {
    expect(CANVAS_TOOL_SHORTCUTS.opening).toBe("O");
    expect(toolFromShortcutKey("O")).toBe("opening");
    expect(toolFromShortcutKey("o")).toBe("opening");

    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));
    press({ key: "o" });
    expect(handlers.setTool).toHaveBeenCalledTimes(1);
    expect(handlers.setTool).toHaveBeenCalledWith("opening");
  });

  it("Select tool label + shortcut form the accessible name contract Select (V)", () => {
    expect(CANVAS_TOOL_LABELS.select).toBe("Select");
    expect(CANVAS_TOOL_SHORTCUTS.select).toBe("V");
    expect(`${CANVAS_TOOL_LABELS.select} (${CANVAS_TOOL_SHORTCUTS.select})`).toBe("Select (V)");
  });

  it("does not arm tools when Ctrl/Cmd is held (mod chords are not tool arming)", () => {
    const handlers = makeHandlers();
    renderHook(() => useWorkspaceKeyboard(handlers));
    press({ key: "d", ctrlKey: true });
    press({ key: "m", metaKey: true });
    expect(handlers.setTool).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Confirm hook suite mirror (minimum D/M/N/T + full map)**

`open3dWorkspaceKeyboard.test.tsx` must retain:

```typescript
  it("arms tools from CANVAS_TOOL_SHORTCUTS on live keydown (D=door, M=dimension, N=window, T=text)", () => {
    const critical: Array<{ key: string; id: PlannerTool }> = [
      { key: "d", id: "door" },
      { key: "m", id: "dimension" },
      { key: "n", id: "window" },
      { key: "t", id: "text" },
    ];

    for (const { key, id } of critical) {
      expect(CANVAS_TOOL_SHORTCUTS[id].toLowerCase()).toBe(key);
      const handlers = makeHandlers();
      const { unmount } = renderHook(() => useWorkspaceKeyboard(handlers));
      press({ key });
      expect(handlers.setTool).toHaveBeenCalledTimes(1);
      expect(handlers.setTool).toHaveBeenCalledWith(id);
      unmount();
    }

    for (const [id, shortcut] of Object.entries(CANVAS_TOOL_SHORTCUTS) as Array<
      [PlannerTool, string]
    >) {
      const handlers = makeHandlers();
      const { unmount } = renderHook(() => useWorkspaceKeyboard(handlers));
      press({ key: shortcut.toLowerCase() });
      expect(handlers.setTool).toHaveBeenCalledWith(id);
      unmount();
    }
  });
```

Also retain existing non-tool cases: Ctrl+K palette, undo/redo, editable ignore, disabled, Delete/Backspace, Escape, Opening O case-insensitive.

- [ ] **Step 3: Run truth suite**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\01-tool-shortcut-truth.log
```

Expected:
- **GREEN path (likely):** all PASS — note in NOTES “historical RED phase closed; GREEN at execute”
- **RED path:** D/M/N/T handler mismatches — proceed Task 02 implementation

- [ ] **Step 4: Fill truth table results skeleton in NOTES**

```markdown
## Truth table results (Task 01)
| id | key | map OK | resolver OK | keydown setTool OK | label OK |
| select | V | | | | |
| room | R | | | | |
| wall | W | | | | |
| opening | O | | | | |
| door | D | | | | |
| dimension | M | | | | |
| placement | P | | | | |
| pan | H | | | | |
| window | N | | | | |
| text | T | | | | |
```

- [ ] **Step 5: Commit only if test file changed**

```bash
git add site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx
git commit -m "test(planner): W8 tool shortcut truth matrix contract (live keydown)"
```

**Done when:** full contract present; log captured; NOTES table started; no invented keys only in tests.

---

### Task 02: Align keyboard handlers to authority map (GREEN / verify)

**Files:**
- Modify only if RED: `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`
- Test: suites from Task 01

**Branching:**

| Condition | Action |
|-----------|--------|
| Baseline + Task 01 GREEN + invert present | **Verify-only** — no rewrite for sport; still produce green log |
| RED or second letter table found | Implement invert + delete hard-coded tool ifs |

- [ ] **Step 1 (RED path only): Write minimal map-driven implementation**

Replace any per-letter tool arming with the full file shape (preserve non-tool branches):

```typescript
"use client";

import { useEffect, useRef } from "react";
import type { PlannerTool } from "./canvasTool";
import { CANVAS_TOOL_SHORTCUTS } from "./canvasTool";

/** Lowercase letter → tool, inverted once from the authority map (W8 single source). */
const TOOL_BY_SHORTCUT_KEY: Record<string, PlannerTool> = Object.fromEntries(
  (Object.entries(CANVAS_TOOL_SHORTCUTS) as Array<[PlannerTool, string]>).map(
    ([tool, shortcut]) => [shortcut.toLowerCase(), tool],
  ),
) as Record<string, PlannerTool>;

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT"
    || tag === "TEXTAREA"
    || tag === "SELECT"
    || target.isContentEditable
  );
}

export interface WorkspaceKeyboardHandlers {
  setTool: (tool: PlannerTool) => void;
  toggleView: () => void;
  openPalette: () => void;
  undo: () => void;
  redo: () => void;
  cancel: () => void;
  commit?: () => void;
  beginTemporaryPan?: () => void;
  endTemporaryPan?: () => void;
  deleteSelection?: () => void;
  enabled?: boolean;
}

export function useWorkspaceKeyboard(handlers: WorkspaceKeyboardHandlers): void {
  const { enabled = true } = handlers;
  const spacePanActive = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const mod = event.ctrlKey || event.metaKey;

      if (event.code === "Space" && !mod && !event.repeat) {
        event.preventDefault();
        spacePanActive.current = true;
        handlers.beginTemporaryPan?.();
        return;
      }

      if (mod && key === "k") {
        event.preventDefault();
        handlers.openPalette();
        return;
      }

      if (event.key === "Tab" && !event.shiftKey && !mod && !event.altKey) {
        event.preventDefault();
        handlers.toggleView();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        handlers.cancel();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        handlers.commit?.();
        return;
      }

      if ((event.key === "Delete" || event.key === "Backspace") && !mod) {
        event.preventDefault();
        handlers.deleteSelection?.();
        return;
      }

      if (mod && key === "z" && event.shiftKey) {
        event.preventDefault();
        handlers.redo();
        return;
      }

      if (mod && key === "y") {
        event.preventDefault();
        handlers.redo();
        return;
      }

      if (mod && key === "z" && !event.shiftKey) {
        event.preventDefault();
        handlers.undo();
        return;
      }

      // Letter tool arming: authority map only (no second hard-coded table)
      if (!mod && !event.altKey) {
        const tool = TOOL_BY_SHORTCUT_KEY[key];
        if (tool !== undefined) {
          event.preventDefault();
          handlers.setTool(tool);
        }
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== "Space" || !spacePanActive.current) return;
      event.preventDefault();
      spacePanActive.current = false;
      handlers.endTemporaryPan?.();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [enabled, handlers]);
}

export function toolFromShortcutKey(key: string): PlannerTool | null {
  return TOOL_BY_SHORTCUT_KEY[key.toLowerCase()] ?? null;
}
```

- [ ] **Step 2: Ensure critical letters**

After implement or verify:

| Key | Must call |
|-----|-----------|
| d | `setTool("door")` |
| m | `setTool("dimension")` |
| n | `setTool("window")` |
| t | `setTool("text")` |
| o | `setTool("opening")` |

**Never** `setTool("dimension")` for `d`.

- [ ] **Step 3: Non-tool regression still green**

Run full keyboard suite; expect Delete, Escape, Ctrl+Z, Ctrl+K still call correct handlers.

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/donorParity.test.ts `
  tests/unit/features/planner/open3d/workspaceShell.test.tsx `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\02-tool-shortcut-truth-green.log
```

Expected: all PASS. Copy or append:

```powershell
Copy-Item `
  ..\results\planner\world-standard-wave\09-shortcuts-chrome\02-tool-shortcut-truth-green.log `
  ..\results\planner\world-standard-wave\09-shortcuts-chrome\02-regression-keyboard.log
```

- [ ] **Step 4: NOTES handler section**

```markdown
## Handlers (Task 02)
- map-driven: yes
- second letter table: no
- D→door, M→dimension, N→window, T→text: verified
- path: verify-only | code-change
- log: 02-tool-shortcut-truth-green.log
```

- [ ] **Step 5: Commit only if code changed**

```bash
git add site/features/planner/open3d/editor/useWorkspaceKeyboard.ts
git commit -m "fix(planner): W8 keyboard handlers match CANVAS_TOOL_SHORTCUTS (D=door, M=dimension)"
```

If verify-only and no code change: **do not** empty commit. Note “no code change” in NOTES.

**Done when:** green logs exist; no second hard-coded tool letter table remains.

---

### Task 03: Rail labels / aria regression (Dimension M, Wall W)

**Files:**
- Test: `site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx`
- Read: `CanvasToolRail.tsx` (modify only if hard-code found)

**Reframe:** Rail is already map-sourced. This task is a **regression guard**, not a claim that rail strings invent wrong letters.

- [ ] **Step 1: Write failing (or new) Dimension + Wall asserts**

Append to `canvasToolRail.a11y.test.tsx` (keep existing Select + Opening tests):

```typescript
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CanvasToolRail } from "@/features/planner/open3d/editor/CanvasToolRail";
import {
  CANVAS_TOOL_LABELS,
  CANVAS_TOOL_SHORTCUTS,
} from "@/features/planner/open3d/editor/canvasTool";

afterEach(() => {
  cleanup();
});

describe("CanvasToolRail a11y + shortcut surface", () => {
  it("exposes Select with accessible name Select (V) from label + shortcut maps", () => {
    const onToolChange = vi.fn();
    render(<CanvasToolRail activeTool="wall" onToolChange={onToolChange} />);

    const selectName = `${CANVAS_TOOL_LABELS.select} (${CANVAS_TOOL_SHORTCUTS.select})`;
    expect(selectName).toBe("Select (V)");

    const selectBtn = screen.getByRole("button", { name: selectName });
    expect(selectBtn).toHaveAttribute("aria-pressed", "false");
    expect(selectBtn).toHaveAttribute("title", selectName);

    fireEvent.click(selectBtn);
    expect(onToolChange).toHaveBeenCalledTimes(1);
    expect(onToolChange).toHaveBeenCalledWith("select");
  });

  it("exposes Opening with accessible name Opening (O) and marks active tool pressed", () => {
    const onToolChange = vi.fn();
    render(<CanvasToolRail activeTool="opening" onToolChange={onToolChange} />);

    expect(CANVAS_TOOL_SHORTCUTS.opening).toBe("O");
    const openingName = `${CANVAS_TOOL_LABELS.opening} (${CANVAS_TOOL_SHORTCUTS.opening})`;
    expect(openingName).toBe("Opening (O)");

    const openingBtn = screen.getByRole("button", { name: openingName });
    expect(openingBtn).toHaveAttribute("aria-pressed", "true");
    expect(openingBtn).toHaveAttribute("title", openingName);

    const rail = screen.getByRole("navigation", { name: "Canvas tools" });
    expect(within(rail).getByRole("button", { name: openingName })).toBe(openingBtn);
  });

  it("exposes Dimension with accessible name Dimension (M) when active", () => {
    const onToolChange = vi.fn();
    render(<CanvasToolRail activeTool="dimension" onToolChange={onToolChange} />);

    expect(CANVAS_TOOL_SHORTCUTS.dimension).toBe("M");
    expect(CANVAS_TOOL_SHORTCUTS.door).toBe("D");

    const dimensionName = `${CANVAS_TOOL_LABELS.dimension} (${CANVAS_TOOL_SHORTCUTS.dimension})`;
    expect(dimensionName).toBe("Dimension (M)");

    const dimensionBtn = screen.getByRole("button", { name: dimensionName });
    expect(dimensionBtn).toHaveAttribute("aria-pressed", "true");
    expect(dimensionBtn).toHaveAttribute("title", dimensionName);

    // Must not claim Dimension under D
    expect(screen.queryByRole("button", { name: /Dimension \(D\)/i })).toBeNull();
  });

  it("exposes Wall with accessible name Wall (W)", () => {
    const onToolChange = vi.fn();
    render(<CanvasToolRail activeTool="select" onToolChange={onToolChange} />);

    const wallName = `${CANVAS_TOOL_LABELS.wall} (${CANVAS_TOOL_SHORTCUTS.wall})`;
    expect(wallName).toBe("Wall (W)");

    const wallBtn = screen.getByRole("button", { name: wallName });
    expect(wallBtn).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(wallBtn);
    expect(onToolChange).toHaveBeenCalledWith("wall");
  });

  it("does not expose a Door rail button (door is palette/legacy, not rail product tool)", () => {
    render(<CanvasToolRail activeTool="select" onToolChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /Door \(D\)/i })).toBeNull();
  });
});
```

- [ ] **Step 2: Run rail tests**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\03-rail-labels.log
```

Expected: PASS if rail remains map-sourced. If FAIL because hard-coded strings: fix rail to use maps only (minimal).

- [ ] **Step 3: Spot-check guidance strip code path (read-only unless lie)**

Confirm `OOPlannerWorkspace` uses:

```tsx
{CANVAS_TOOL_SHORTCUTS[activeTool]} · {CANVAS_TOOL_GUIDANCE[activeTool]}
```

If a hard-coded letter appears for active tool, replace with map. Do not redesign status chrome.

- [ ] **Step 4: Commit**

```bash
git add site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx
# + CanvasToolRail.tsx only if changed
git commit -m "test(planner): W8 rail accessible names Dimension (M) and Wall (W)"
```

**Done when:** no rail control shows a shortcut letter that does not arm that tool (true after Task 02 + this guard); Dimension (M) assert exists.

---

### Task 04: Canvas `aria-keyshortcuts` + palette parity

**Files:**
- Modify: `site/features/planner/open3d/editor/canvasTool.ts` (add pure helper)
- Modify: `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` (wire attribute)
- Test: extend `toolShortcutTruth.test.ts` or new co-located asserts
- Test: `donorParity.test.ts` palette shortcut parity + arity clean
- Touch `paletteCommands.ts` only if tool-* shortcut ≠ map

This is the **primary residual product-code task** when handlers are already green.

- [ ] **Step 1: Write failing tests for helper + attribute honesty**

Add to `toolShortcutTruth.test.ts` (or create `canvasKeyShortcutsAttribute.test.ts` if preferred — same folder):

```typescript
import {
  CANVAS_TOOL_SHORTCUTS,
  canvasKeyShortcutsAttribute,
} from "@/features/planner/open3d/editor/canvasTool";

describe("canvasKeyShortcutsAttribute (W8 aria honesty)", () => {
  it("includes every unique authority tool letter", () => {
    const attr = canvasKeyShortcutsAttribute({ includeCanvasZoom: false });
    const tokens = new Set(attr.split(/\s+/).filter(Boolean));
    for (const letter of Object.values(CANVAS_TOOL_SHORTCUTS)) {
      expect(tokens.has(letter)).toBe(true);
    }
    // Explicit critical letters often omitted historically
    for (const required of ["R", "O", "M", "P", "N", "D", "T", "V", "W", "H"]) {
      expect(tokens.has(required)).toBe(true);
    }
  });

  it("includes wired non-tool workspace keys", () => {
    const attr = canvasKeyShortcutsAttribute({ includeCanvasZoom: false });
    for (const required of [
      "Tab",
      "Escape",
      "Control+Z",
      "Control+Shift+Z",
      "Control+Y",
      "Control+K",
    ]) {
      expect(attr.split(/\s+/)).toContain(required);
    }
  });

  it("includes canvas zoom tokens only when includeCanvasZoom is true", () => {
    const without = canvasKeyShortcutsAttribute({ includeCanvasZoom: false });
    const withZoom = canvasKeyShortcutsAttribute({ includeCanvasZoom: true });
    expect(without.split(/\s+/)).not.toContain("0");
    expect(withZoom.split(/\s+/)).toEqual(expect.arrayContaining(["0", "+", "-"]));
  });

  it("does not invent unknown tool letters", () => {
    const attr = canvasKeyShortcutsAttribute({ includeCanvasZoom: true });
    const tokens = attr.split(/\s+/);
    const toolLetters = new Set(Object.values(CANVAS_TOOL_SHORTCUTS));
    const allowedNonTool = new Set([
      "Tab",
      "Escape",
      "Control+Z",
      "Control+Shift+Z",
      "Control+Y",
      "Control+K",
      "0",
      "+",
      "-",
    ]);
    for (const token of tokens) {
      const ok = toolLetters.has(token) || allowedNonTool.has(token);
      expect(ok).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run helper tests — expect FAIL (helper missing)**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/toolShortcutTruth.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\04-aria-helper-red.log
```

Expected: FAIL — `canvasKeyShortcutsAttribute` is not exported / not a function.

- [ ] **Step 3: Implement pure helper in `canvasTool.ts`**

Append (no `any`; keep existing maps unchanged):

```typescript
export interface CanvasKeyShortcutsOptions {
  /**
   * When true, include canvas-local zoom tokens `0 + -`.
   * On open3d workspace path, keyboard is delegated — zoom keys are NOT owned by
   * useWorkspaceKeyboard; rail exposes zoom-to-fit as a button labeled (0).
   * Prefer false for delegated workspace honesty; true for standalone canvas surface.
   */
  includeCanvasZoom?: boolean;
}

/**
 * Builds an honest aria-keyshortcuts string from authority maps + wired non-tool keys.
 * Must not invent tool letters absent from CANVAS_TOOL_SHORTCUTS.
 */
export function canvasKeyShortcutsAttribute(
  options: CanvasKeyShortcutsOptions = {},
): string {
  const { includeCanvasZoom = false } = options;

  const toolLetters = Array.from(
    new Set(Object.values(CANVAS_TOOL_SHORTCUTS)),
  ).sort((a, b) => a.localeCompare(b));

  const nonTool: string[] = [
    "Tab",
    "Escape",
    "Control+Z",
    "Control+Shift+Z",
    "Control+Y",
    "Control+K",
  ];

  if (includeCanvasZoom) {
    nonTool.push("0", "+", "-");
  }

  return [...toolLetters, ...nonTool].join(" ");
}
```

- [ ] **Step 4: Wire FeasibilityCanvas**

Replace hard-coded attribute:

```tsx
// imports at top of FeasibilityCanvas.tsx — add:
import {
  // existing imports from canvasTool if any
  canvasKeyShortcutsAttribute,
} from "@/features/planner/open3d/editor/canvasTool";

// on the <canvas> element:
aria-keyshortcuts={canvasKeyShortcutsAttribute({
  // Standalone / proof path still owns local zoom keys when !delegateKeyboard.
  // When parent delegates keyboard (open3d workspace), omit zoom tokens from aria
  // so the attribute does not claim canvas-owned keys the element no longer handles.
  includeCanvasZoom: !delegateKeyboard,
})}
```

Exact import path must match existing import style in that file (relative `../editor/canvasTool` is also fine if that is the local convention).

- [ ] **Step 5: Palette parity asserts in donorParity**

Update `donorParity.test.ts` palette section:

```typescript
import {
  buildPaletteCommands,
  filterPaletteCommands,
  runPaletteCommand,
} from "@/features/planner/open3d/lib/commands/paletteCommands";
import { CANVAS_TOOL_SHORTCUTS } from "@/features/planner/open3d/editor/canvasTool";
import { toolFromShortcutKey } from "@/features/planner/open3d/editor/useWorkspaceKeyboard";
// ... other imports unchanged

describe("donor parity — command palette", () => {
  it("builds searchable palette commands with donor tool shortcuts", () => {
    const handlers = {
      setTool: vi.fn(),
      toggleView: vi.fn(),
      openPalette: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      cancel: vi.fn(),
      zoomReset: vi.fn(),
    };
    // buildPaletteCommands takes zero args — do not pass handlers
    const commands = buildPaletteCommands();
    expect(commands.some((command) => command.id === "tool-wall" && command.shortcut === "W")).toBe(
      true,
    );
    expect(commands.some((command) => command.id === "nav-toggle-view" && command.shortcut === "Tab")).toBe(
      true,
    );
    expect(filterPaletteCommands(commands, "wall").some((command) => command.id === "tool-wall")).toBe(
      true,
    );

    // W8: every tool-* shortcut equals authority map for that tool id
    for (const command of commands) {
      if (!command.id.startsWith("tool-")) continue;
      const toolId = command.id.slice("tool-".length) as keyof typeof CANVAS_TOOL_SHORTCUTS;
      expect(command.shortcut).toBe(CANVAS_TOOL_SHORTCUTS[toolId]);
    }

    // Explicit door / dimension product lock: door is D; dimension is not a palette tool row
    expect(commands.some((c) => c.id === "tool-door" && c.shortcut === "D")).toBe(true);
    expect(commands.some((c) => c.id === "tool-dimension")).toBe(false);

    void handlers; // handlers used only for runPaletteCommand below — keep structure clear
  });

  it("dispatches palette actions through handlers", () => {
    const handlers = {
      setTool: vi.fn(),
      toggleView: vi.fn(),
      openPalette: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      cancel: vi.fn(),
      zoomReset: vi.fn(),
    };
    expect(runPaletteCommand("tool-door", handlers)).toBe(true);
    expect(handlers.setTool).toHaveBeenCalledWith("door");
    expect(runPaletteCommand("nav-toggle-view", handlers)).toBe(true);
    expect(handlers.toggleView).toHaveBeenCalled();
  });
});
```

If `void handlers` is too awkward, split the map-parity loop into its own `it` that does not construct unused handlers.

- [ ] **Step 6: Run aria + palette suite — expect PASS**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  tests/unit/features/planner/open3d/donorParity.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\04-aria-palette.log
```

Expected: PASS; attribute includes R O M P N; no invented letters.

- [ ] **Step 7: Commit**

```bash
git add `
  site/features/planner/open3d/editor/canvasTool.ts `
  site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx `
  site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  site/tests/unit/features/planner/open3d/donorParity.test.ts
git commit -m "fix(planner): W8 aria-keyshortcuts and palette shortcuts match maps"
```

**Done when:** AT-facing shortcut lists and palette rows cannot disagree with the keyboard map; hard-coded stale string gone.

---

### Task 05: 2A chrome blockers that hide tools only

**Files:** only paths proven to hide tools (likely none)

- [ ] **Step 1: Read-only inventory — fill NOTES table**

| Check | How | Hide-tools? | Live expectation (2026-07-10) | Result this run |
|-------|-----|-------------|-------------------------------|-----------------|
| Tool rail mounted on `/planner/open3d` | DOM `nav[aria-label="Canvas tools"]` / `.pw-tool-rail` | If missing → blocker | Wired in workspace shell | |
| Rail `display:none` / zero size at 1440 and 390 | CSS audit `canvas-tool-rail.module.css` | Interactive hide = fix | Small = horizontal reflow, **not** hide | |
| Print hide | `@media print` | OK | Present — allowed | |
| Overlay steals clicks from rail | z-index / pointer-events | fix minimal | Need proof — do not invent | |
| Focus trap blocks tool keys after blur rules | Tab order smoke | only true traps | Editable guard already skips inputs | |
| Inventory double-name / nested main | a11y report | **Out** unless rail leaves a11y tree | Known debt — not P09 unless hide | |

CSS facts already known from read:

```css
/* canvas-tool-rail.module.css */
@media (width < 48rem) {
  .rail { /* horizontal reflow, overflow-x auto — NOT display:none */ }
  .shortcut { display: none; } /* badge only; aria-label keeps letter */
}
@media print {
  .rail { display: none; } /* allowed */
}
```

- [ ] **Step 2: Browser optional proof (only if dev server already approved)**

If `/planner/open3d` can be opened:

1. Confirm rail visible at ~1440 width  
2. Confirm tools reachable at ~390 width (horizontal strip)  
3. Press M vs D; note active tool status  
4. Screenshot optional  

If browser not available: document “browser deferred” — unit matrix remains primary W8 proof.

- [ ] **Step 3: Fix only confirmed hide/block issues**

Allowed examples:

- Rail unmounted behind `disabled` with no alternative → enable or provide equivalent  
- CSS at interactive breakpoint that sets `.rail { display: none }` → remove/reflow  
- Panel backdrop covering rail without dismiss → z-index / pointer-events minimal  

**Forbidden:** rewrite TopBar, Vaul drawers, density system, full landmark tree, favorites labels, marketing chrome.

- [ ] **Step 4: Outcome modes**

1. **Defect found** → minimal CSS/layout fix + log + commit  
2. **None found** → `chrome-hide-tools: none` in NOTES — **no invented churn**

**Raised bar:** zero CSS edits without a NOTES proof row naming viewport, selector, and user impact.

- [ ] **Step 5: Write log**

Create `05-chrome-hide-tools.log` as plain text NOTES extract or browser notes:

```text
chrome-hide-tools: none
checks:
- rail CSS interactive hide: none (reflow only at <48rem)
- print hide: allowed
- overlay steal: none observed / not tested browser
- dual-keyboard: workspace owns tools when delegateKeyboard
```

- [ ] **Step 6: Commit only if code changed**

```bash
git add site/features/planner/open3d/editor/canvas-tool-rail.module.css
git commit -m "fix(planner): unblock canvas tool chrome (W8/2A hide-tools only)"
```

**Done when:** NOTES states reachability at desktop + small viewport; either minimal fix landed or explicit none-found.

---

### Task 06: Evidence pack + CP-09 gate

**Files:** `results/planner/world-standard-wave/09-shortcuts-chrome/*`

- [ ] **Step 1: Final Vitest run (full truth + keyboard + donor + rail)**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/donorParity.test.ts `
  tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx `
  tests/unit/features/planner/open3d/workspaceShell.test.tsx `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\06-final-vitest.log
```

Expected: all PASS. Capture pass counts in NOTES.

- [ ] **Step 2: Optional browser smoke**

Only if dev server owner-approved:

- Press D vs M on `/planner/open3d`  
- Store `06-browser-d-m.png` + one-line note  
- Not a substitute for unit truth table  

- [ ] **Step 3: Write `run.json`**

```json
{
  "gate": "W8",
  "phase": "P09-shortcuts-chrome",
  "checkpoint": "CP-09",
  "evidenceRoot": "results/planner/world-standard-wave/09-shortcuts-chrome",
  "date": "YYYY-MM-DD",
  "head": "<sha>",
  "status": "PASS",
  "proofClass": [
    "unit-map-parity",
    "live-keydown-matrix",
    "rail-accessible-names",
    "aria-keyshortcuts-helper",
    "palette-subset-parity"
  ],
  "logs": [
    "00-baseline-vitest.log",
    "01-tool-shortcut-truth.log",
    "02-tool-shortcut-truth-green.log",
    "03-rail-labels.log",
    "04-aria-palette.log",
    "05-chrome-hide-tools.log",
    "06-final-vitest.log"
  ],
  "forbidden": {
    "dimensionReboundToD": false,
    "evidenceAlias08Shortcuts": false
  }
}
```

- [ ] **Step 4: Fill NOTES Results section (no TBD)**

```markdown
## Results (Task 06 / CP-09)

### W8
- status: PASS | FAIL
- reason: <one paragraph>

### Table id → key → handler verified
(all 10 rows filled from Task 01)

### Chrome hide-tools
- chrome-hide-tools: none | list of fixes

### Dual-keyboard
- note: none | conflict observed
- ownership: workspace (delegateKeyboard) owns tool letters on /planner/open3d

### Aria
- hard-coded stale string removed: yes
- helper: canvasKeyShortcutsAttribute
- includeCanvasZoom when delegated: false

### Discoverability residual (not blocking)
- ? help sheet: deferred P1

### Commits
- hashes: <list>

### Failures residual
- none | logged to Failures.md as <id>
```

- [ ] **Step 5: CP-09 checklist mark from data**

| ID | Criterion | Status |
|----|-----------|--------|
| CP-09.1 | Unit table: id → key → `setTool(id)` for every authority tool incl. D/M/N/T | |
| CP-09.2 | No hard-coded keyboard tool letter table diverges from map | |
| CP-09.3 | Rail accessible names `Label (Key)` from maps (incl. Dimension M) | |
| CP-09.4 | `aria-keyshortcuts` / palette match maps | |
| CP-09.5 | Hide-tools fixed or documented none-found with proof | |
| CP-09.6 | Evidence under `09-shortcuts-chrome/` unfiltered logs | |
| CP-09.7 | Landable commits on main checkout | |

**W8 PASS only if CP-09.1–09.6 green from artifacts.**

- [ ] **Step 6: Final commit for evidence docs if tracked**

```bash
git add results/planner/world-standard-wave/09-shortcuts-chrome/
git commit -m "docs(planner): P09 W8 CP-09 evidence pack 09-shortcuts-chrome"
```

**Done when:** CP-09 complete; evidence paths real under **09-shortcuts-chrome/**; no TBD in NOTES; do not claim world-standard complete (that is P10).

---

## 7. Test matrix

| Case | Suite | Command | Expected |
|------|-------|---------|----------|
| Map key + label per row | `toolShortcutTruth` | vitest that file | PASS all 10 ids |
| `toolFromShortcutKey` upper/lower | same | same | PASS |
| Unique letters | same | same | PASS |
| Live keydown → setTool once | same + hook suite | same | PASS D/M/N/T + full |
| Editable / disabled negatives | both | same | no setTool |
| Mod-held letter not arming | truth suite | same | no setTool |
| Delete / Escape / Ctrl+K / undo | `open3dWorkspaceKeyboard` | same | handlers called |
| Rail Select (V), Opening (O) | `canvasToolRail.a11y` | same | accessible names |
| Rail Dimension (M), Wall (W) | same after Task 03 | same | names + no Dimension (D) |
| Palette tool-* = map | `donorParity` | same | shortcuts match |
| runPaletteCommand tool-door | same | same | setTool("door") |
| aria helper all map letters | truth / helper tests | same | R O M P N present |
| aria no invented letters | same | same | PASS |
| workspaceShell resolver | `workspaceShell` | same | D→door M→dimension |

**Not W8 proof:**

- Screenshot of rail alone  
- Map-only pure tests without keydown  
- Filtered vitest output  
- “I pressed D in browser once” without log artifact  
- Passing full monorepo suite without the phase evidence folder  
- `site/lib/ui/KeyboardShortcuts.tsx` modal contents  

---

## 8. False-green catalog

| Trap | Why it looks green | How plan blocks |
|------|--------------------|-----------------|
| Map tests green, handler wrong | Historical class | Live keydown matrix |
| Partial D/M only | N/T still unbound | Full 10-letter table |
| Dimension→D rebind “fix” | Bad habit match | Forbidden; tests lock D/M |
| Evidence missing, code green | Paper ship | CP-09.6 hard gate |
| aria omits R/O/M/P | Handlers OK | Task 04 helper mandatory |
| Zoom listed on delegated path | Looks complete | `includeCanvasZoom: !delegateKeyboard` |
| CSS churn “polish” as W8 | Busy work | Task 05 proof-first |
| Wrong folder `08-shortcuts-chrome` | Name thrash | Canonical **09-** only |
| donorParity `buildPaletteCommands(handlers)` | Accidental pass | Clean arity |
| Global KeyboardShortcuts modal lists Z/F | Looks like shortcuts “done” | Out of W8 gate; optional NOTES |
| Fabric `useKeyboardShortcuts` green | Different surface | Out of open3d W8 |
| Filtered vitest / skipped tests | Silent pass | Unfiltered Tee-Object logs |
| Claim W8 from phase MD checkboxes | Ceremony | Artifacts only |

---

## 9. Stop-if-fail / CP criteria

**Stop and fix before claiming CP-09:**

1. Any map letter does not `setTool(id)` on live keydown  
2. Second hard-coded tool letter table reintroduced  
3. Dimension rebound to D  
4. Aria helper invents letters or still omits map letters  
5. Delete/undo regressions while editing shortcuts  
6. Evidence under wrong folder  
7. Silent/filtered test output  

**CP-09 W8 PASS:** CP-09.1–09.6 all true from disk under `09-shortcuts-chrome/`.

---

## 10. Commit sequence

| Order | Message | When |
|-------|---------|------|
| 1 | `docs(planner): P09 W8 evidence scaffold 09-shortcuts-chrome` | Task 00 if tracked |
| 2 | `test(planner): W8 tool shortcut truth matrix contract (live keydown)` | Task 01 if tests changed |
| 3 | `fix(planner): W8 keyboard handlers match CANVAS_TOOL_SHORTCUTS (D=door, M=dimension)` | Task 02 if code changed |
| 4 | `test(planner): W8 rail accessible names Dimension (M) and Wall (W)` | Task 03 |
| 5 | `fix(planner): W8 aria-keyshortcuts and palette shortcuts match maps` | Task 04 |
| 6 | `fix(planner): unblock canvas tool chrome (W8/2A hide-tools only)` | Task 05 if needed |
| 7 | `docs(planner): P09 W8 CP-09 evidence pack 09-shortcuts-chrome` | Task 06 |

Frequent small commits. No force-push. Push origin per AGENTS when landable green slice; mayoite ~45m if big land.

---

## 11. Risks & owner decisions

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Fix by Dimension→D rebind | Med | High product lie | Forbidden; tests |
| Partial N/T unbound left | Low if matrix | Med | Full map matrix |
| Break Delete/undo | Med | High (W3 adjacent) | Non-tool regression |
| Dual keyboard redesign thrash | Med | High time waste | Fence + log only |
| CSS without hide proof | Med | Noise | NOTES proof row |
| Evidence under `08-` | Med (history) | P10 confusion | **09- only** |
| Claim W8 without evidence | High | False ship | CP-09.6 |
| Aria still stale after handler fix | **High residual** | a11y honesty fail | Task 04 mandatory |
| Competitor key philosophy debates | Low–Med | Scope delay | Our map owns truth |
| Re-break fixed handler because plan said “lie today” | Med | Regression | NOTES historical vs live |
| Global modal lying about shortcuts | Low for CP | Trust | Optional NOTES; not expand scope |

**Owner decisions already locked:** Approach A; D=door M=dimension; evidence `09-`; no competitor copy; W0 unlocked.

**No open owner decisions required to execute residual Tasks 00/03–06.**

---

## 12. Self-review vs brainstormer + repo

### 12.1 Repo coverage

| Live residual / path | Task |
|----------------------|------|
| `useWorkspaceKeyboard` invert verify | 00, 02 |
| `canvasTool` maps + helper | 04 |
| `FeasibilityCanvas` aria | 04 |
| `CanvasToolRail` + a11y tests | 03 |
| `paletteCommands` / donorParity | 04 |
| CSS hide-tools | 05 |
| Evidence `09-` | 00, 06 |
| Full keydown matrix tests | 01 |

### 12.2 Brainstormer (`Idiots/P09`) coverage

| REPORT bar / failure | Task or WAIVE |
|----------------------|---------------|
| Map-driven invert | 02 verify |
| Live keydown matrix | 01 |
| Forbidden Dimension→D | all + CP |
| aria honesty helper | 04 |
| Rail Dimension (M) | 03 |
| Hide-tools proof-first | 05 |
| Evidence pack | 00, 06 |
| Dual keyboard fence | NOTES + §1.5 |
| Approach A only | architecture |
| Reject B | risks |
| Defer C / `?` sheet | out of scope + NOTES P1 |
| Competitive patterns ethics | §3 |
| Raised bar evidence = gate | CP-09.6 |

### 12.3 Placeholder scan

No TBD / “similar to Task N” / empty test stubs. Full code in steps. Residual branches explicit (verify-only vs implement).

### 12.4 Type consistency

- `PlannerTool` for full map; `CanvasTool` for palette subset  
- No `any`  
- `canvasKeyShortcutsAttribute(options?: CanvasKeyShortcutsOptions): string`  
- Handlers interface matches live `WorkspaceKeyboardHandlers`

### 12.5 Length honesty

Plan is extensive because residual + historical law + dual surface + evidence discipline require it. Residual **code** surface is small (aria helper + tests + evidence); residual **process** surface is large (CP-09, false-green traps). That is intentional — not scope creep into chrome redesign.

---

## 13. Implementation order (agent)

```
00 baseline evidence dir + logs + NOTES historical vs residual
01 truth table contract (RED or honest already-green)
02 handlers GREEN / verify invert
03 rail regression Dimension (M) / Wall (W)
04 aria helper + palette parity   ← main residual code if handlers green
05 hide-tools inventory proof-first
06 evidence pack + CP-09 mark from data
```

**Parallelism:** test authoring with baseline OK; do not polish rail CSS while letter matrix red; do not parallelize handler rewrite with “rebind labels” experiments.

**Do not start P10 claims from this plan alone.**

---

## 14. Handoff to P10

P09 contributes only:

- `09-shortcuts-chrome/` pack with **W8 PASS** (or honest FAIL)  
- Commit list for shortcut truth  
- Explicit browser smoke deferred note if skipped  
- Dual-keyboard ownership note  
- Discoverability `?` sheet as known P1 residual (not W8 fail)

P10 must not invent alternate folder names (`08-shortcuts-chrome` retired).

---

## Appendices

### Appendix A — Full non-tool keyboard surface (workspace)

| Key / chord | Handler | Notes |
|-------------|---------|-------|
| Space (down/up) | temporary pan begin/end | Not a tool letter |
| Ctrl/Cmd+K | openPalette | |
| Tab | toggleView | no Shift/mod/alt |
| Escape | cancel | workspace cancel also clears selection/placement |
| Enter | commit | optional handler |
| Delete / Backspace | deleteSelection | preventDefault |
| Ctrl/Cmd+Z | undo | |
| Ctrl/Cmd+Shift+Z | redo | |
| Ctrl/Cmd+Y | redo | |

### Appendix B — Full tool letter matrix (product)

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

### Appendix C — Historical vs live handler matrix

| Key | Historical handler (2026-07-09) | Live (2026-07-10) | Map |
|-----|--------------------------------|-------------------|-----|
| d | dimension (**LIE**) | door | door |
| m | unbound (**LIE**) | dimension | dimension |
| n | unbound (**GAP**) | window | window |
| t | unbound (**GAP**) | text | text |
| v/r/w/o/p/h | correct | correct | correct |

### Appendix D — File inventory (P09-relevant)

#### Phase docs
- `Plans/phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md`
- `Plans/phases/P09-shortcuts-chrome/06-ui-shortcuts.md`
- `Plans/phases/P09-shortcuts-chrome/P09-suggestions.md`
- `Plans/phases/P09-shortcuts-chrome/README.md`
- `Plans/phases/EXPERT-PASS.md` (UI/shortcuts + P0 #11)

#### Product code
- `site/features/planner/open3d/editor/canvasTool.ts`
- `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`
- `site/features/planner/open3d/editor/CanvasToolRail.tsx`
- `site/features/planner/open3d/editor/canvas-tool-rail.module.css`
- `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`
- `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`
- `site/features/planner/open3d/lib/commands/paletteCommands.ts`
- `site/features/planner/open3d/lib/commands/registry.ts`

#### Tests
- `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts`
- `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx`
- `site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx`
- `site/tests/unit/features/planner/open3d/donorParity.test.ts`
- `site/tests/unit/features/planner/open3d/workspaceShell.test.tsx` (toolFromShortcutKey section)

#### Research / competitive (ideas only)
- `Plans/Research/RESEARCH-MAP.md`
- `Plans/Research/RESULTS-MAP.md`
- `D:\websites\README.md`
- `D:\websites\homestyler.com\report\INSPIRATION.md`
- `D:\websites\floorplanner.com\report\INSPIRATION.md`
- `D:\websites\planner5d.com\report\TOOLBARS.md`
- `D:\websites\roomsketcher.com\report\INSPIRATION.md`
- `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\02-toolbar\REPORT.md`

#### Design / failures
- `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` (§ W8)
- `Failures.md` (PLAN-FAIL-0413 lineage)

#### Brainstormer (this plan wave)
- **`Idiots/P09-shortcuts-chrome/REPORT.md`** — sole brainstormer input

### Appendix E — Competitive discoverability matrix (patterns only)

| Competitor | Public key table? | In-app help? | O&O steal |
|------------|-------------------|--------------|-----------|
| Homestyler | No full table in scrapes | Help → Shortcuts category | **Cheatsheet pattern** later |
| Floorplanner | Yes (manual) | `?` sidebar | **Help key pattern** + always-on Esc/Del/Space |
| Planner5D | Sparse (WASD walkthrough) | Support site | **Chrome regions** for hide-tools thinking |
| RoomSketcher | Sparse | Mode UI | **Task grouping** later |
| O&O target | Own map | Optional later `?` | **Honesty first (W8)** |

### Appendix F — Chrome regions (P5D-inspired, O&O-native)

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

### Appendix G — Research → O&O translation table

| Industry pattern | O&O translation | Phase |
|------------------|-----------------|-------|
| Keyboard discoverability (Homestyler-class idea) | **Our** shortcut map must match handlers | **P09 / W8** |
| Published matrix (Floorplanner) | Unit truth table + live keydown | P09 |
| D=dimension CAD habit | Teach via (M) badge — **do not rebind** | P09 law |
| Chrome layout zones | Re-implemented; P09 only where tools block | P09 limited |
| `?` help sheet | After honesty green | Post-CP-09 P1 |
| Anti-copy | No competitor assets into site | Always |

### Appendix H — Evidence artifact checklist

| Artifact | Path under `09-shortcuts-chrome/` |
|----------|-----------------------------------|
| NOTES | `NOTES.md` |
| Baseline | `00-baseline-vitest.log` |
| Truth | `01-tool-shortcut-truth.log` |
| Green handlers | `02-tool-shortcut-truth-green.log` |
| Regression keyboard | `02-regression-keyboard.log` |
| Rail | `03-rail-labels.log` |
| Aria/palette | `04-aria-palette.log` (+ optional red helper log) |
| Hide-tools | `05-chrome-hide-tools.log` |
| Final | `06-final-vitest.log` |
| run.json | `run.json` |
| Optional browser | `06-browser-d-m.png` |

### Appendix I — Relationship to other phases

| Phase | Interaction with P09 |
|-------|----------------------|
| **P03 W3** | Delete/Backspace handlers must remain; P09 does not redefine delete semantics |
| **P04 orbit** | Tab toggles 2D/3D; do not break Tab while fixing letters |
| **P06 save** | Ctrl+S not currently workspace tool map; no save shortcut theater in P09 |
| **P07 journey** | Browser journey may press tools; honest keys help journey stability |
| **P08 mesh** | Owns `08-mesh-quality/` only — no path collision with W8 |
| **P10 pack** | Consumes `09-shortcuts-chrome/` as W8 proof |

### Appendix J — Glossary

| Term | Meaning |
|------|---------|
| **Authority map** | `CANVAS_TOOL_SHORTCUTS` / `LABELS` in `canvasTool.ts` |
| **Invert** | Build letter→tool once from map; never dual letter tables |
| **Live keydown matrix** | Dispatch real KeyboardEvents; assert `setTool` args |
| **W8** | Labels match handlers (design gate) |
| **CP-09** | Checkpoint for P09 |
| **Hide-tools** | Chrome that prevents reaching tools (not polish debt) |
| **delegateKeyboard** | Parent owns shortcuts; canvas local path gated off |
| **FOLDER-LOCK** | W8 evidence = `09-shortcuts-chrome/` only |

### Appendix K — Executor residual checklist (if handlers already green)

1. Create `09-shortcuts-chrome/` and run baseline + green logs (00, 01 may be green not red — document honestly).  
2. Complete Task 04 aria helper + tests (**still open** on live string).  
3. Complete Task 03 Dimension (M) / Wall (W) rail name tests.  
4. Complete Task 05 NOTES inventory.  
5. Complete Task 06 CP-09 evidence package.  
6. Do **not** weaken tests to match any remaining lie.  
7. Commit only landable residual slices with honest messages.  
8. If any letter still wrong on re-read: classic RED→GREEN Task 01–02.

### Appendix L — Signature catalog used in plan

```typescript
// canvasTool.ts
export type CanvasTool = "select" | "wall" | "door" | "window" | "text" | "pan";
export type PlannerTool =
  | CanvasTool
  | "room"
  | "opening"
  | "dimension"
  | "placement";
export const CANVAS_TOOL_SHORTCUTS: Record<PlannerTool, string>;
export const CANVAS_TOOL_LABELS: Record<PlannerTool, string>;
export const CANVAS_TOOL_GUIDANCE: Record<PlannerTool, string>;
export const CANVAS_TOOLS: PlannerTool[];
export function runtimeToolFor(tool: PlannerTool): CanvasRuntimeTool;
export function canvasKeyShortcutsAttribute(
  options?: CanvasKeyShortcutsOptions,
): string;

// useWorkspaceKeyboard.ts
export interface WorkspaceKeyboardHandlers {
  setTool: (tool: PlannerTool) => void;
  toggleView: () => void;
  openPalette: () => void;
  undo: () => void;
  redo: () => void;
  cancel: () => void;
  commit?: () => void;
  beginTemporaryPan?: () => void;
  endTemporaryPan?: () => void;
  deleteSelection?: () => void;
  enabled?: boolean;
}
export function useWorkspaceKeyboard(handlers: WorkspaceKeyboardHandlers): void;
export function toolFromShortcutKey(key: string): PlannerTool | null;

// paletteCommands.ts
export function buildPaletteCommands(): PaletteCommand[];
export function filterPaletteCommands(
  commands: readonly PaletteCommand[],
  query: string,
  limit?: number,
): PaletteCommand[];
export function runPaletteCommand(
  id: string,
  handlers: PaletteCommandHandlers,
): boolean;
```

---

## Execution handoff

Plan complete and saved to `plans2/P09-shortcuts-chrome/IMPLEMENTATION-PLAN.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — superpowers:subagent-driven-development  
2. **Inline Execution** — superpowers:executing-plans  

**Which approach?**
