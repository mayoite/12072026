# P09 — Shortcuts & Blocking Chrome (W8) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.
>
> **Plan skill:** writing-plans-repo-brainstorm (repo first → brainstormer reports → extensive plan, no length cap).

**Goal:** Prove continuous honesty **tool id → shortcut letter → live keydown handler → visible label / aria / badge / palette string** for every authority letter (gate **W8** / **CP-09**), fix residual stale `aria-keyshortcuts`, inventory hide-tools chrome without redesign, and land unfiltered evidence under `results/planner/world-standard-wave/09-shortcuts-chrome/`.

**Architecture:** Single authority maps in `site/features/planner/open3d/editor/canvasTool.ts` (`CANVAS_TOOL_SHORTCUTS`, `CANVAS_TOOL_LABELS`, `CANVAS_TOOL_GUIDANCE`) drive rail chrome, palette tool rows, status guidance, optional `aria-keyshortcuts` helper, and letter arming. Live keyboard arming must invert the map once into `TOOL_BY_SHORTCUT_KEY` (already present on disk — **verify, do not re-implement for sport**). Non-tool always-ons (Space pan, Tab, Esc, Enter, Delete/Backspace, Ctrl/Cmd+K, undo/redo) stay in `useWorkspaceKeyboard` with clear precedence. Dual surface: open3d path uses `delegateKeyboard` so workspace owns tool letters; FeasibilityCanvas local keys remain zoom/escape when not delegated — **no dual redesign**.

**Tech Stack:** Next.js site · Vitest · React Testing Library · Phosphor icons · open3d workspace (`OOPlannerWorkspace` + `FeasibilityCanvas` + `CanvasToolRail`). **No new packages.**

**Inputs consumed:**
- Repo read: 2026-07-10 — dirty tree honesty assumed; key paths listed in § Repo reality
- Brainstormer: `Idiots2/P09-shortcuts-chrome/REPORT.md` **only** (never `Idiots/`)
- Phase plan: `Plans/phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md` + `06-ui-shortcuts.md` + `P09-suggestions.md`
- Design gate: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` §2 **W8**
- Evidence map: `Plans/Research/RESULTS-MAP.md` (FOLDER-LOCK: **`09-shortcuts-chrome/`** only)

**Done when:**
1. Live keydown matrix proves every map letter → `setTool(id)` (D=door, M=dimension, N=window, T=text included).
2. No second hard-coded tool letter table diverges from `CANVAS_TOOL_SHORTCUTS`.
3. Rail accessible names use `Label (Key)` from the same maps.
4. `aria-keyshortcuts` + palette tool-* shortcuts match maps (no invented tool letters).
5. Hide-tools: fixed or documented `chrome-hide-tools: none` with NOTES proof rows.
6. Evidence under `results/planner/world-standard-wave/09-shortcuts-chrome/` with unfiltered logs.
7. CP-09.1–09.6 green from **data**, not memory. W8 PASS only then.

**Evidence folder (canonical):** `results/planner/world-standard-wave/09-shortcuts-chrome/`  
**Forbidden alias:** `08-shortcuts-chrome/` (mesh owns sole primary `08-mesh-quality/`).

**Execution posture (binding):** Historical expert smoking gun (D→dimension second table) is **product law / regression class**. Live code on 2026-07-10 already inverts the map and ships `toolShortcutTruth.test.ts`. Executor **re-proves** + closes residual honesty (aria + evidence + hide-tools NOTES). Do **not** claim W8 PASS without `09-` artifacts.

---

## 1. Repo reality

### 1.1 What actually exists (live paths)

| Path | Role | Live state (2026-07-10 planner read) |
|------|------|--------------------------------------|
| `site/features/planner/open3d/editor/canvasTool.ts` | Authority maps + labels + guidance + `CANVAS_TOOLS` order + `runtimeToolFor` | Present; product letters locked |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Keydown → handlers; invert map; `toolFromShortcutKey` | **Map-driven already** (`TOOL_BY_SHORTCUT_KEY` invert; letter arming from map only) |
| `site/features/planner/open3d/editor/CanvasToolRail.tsx` | Rail chrome Label (Key) | Map-sourced aria/title/badge |
| `site/features/planner/open3d/editor/canvas-tool-rail.module.css` | Rail layout | `<48rem` horizontal reflow; print hide; badge hide on small — **not tool hide** |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Canvas + local keys + `aria-keyshortcuts` | **Stale aria** hard-coded `V W D T H…`; local keys gated by `delegateKeyboard` |
| `site/features/planner/open3d/lib/commands/paletteCommands.ts` | Palette subset | Map-sourced tool shortcuts for CanvasTool subset |
| `site/features/planner/open3d/lib/commands/registry.ts` | Feasibility action shortcuts (W, Esc, Ctrl+Z, zoom) | Separate action surface; do not thrash |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Wires `useWorkspaceKeyboard`; `delegateKeyboard`; guidance strip | Open3d path owns tool arming |
| `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` | Full W8 matrix | **Exists** with live keydown all letters |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | Hook suite + letter matrix mirror | **Exists** (D/M/N/T + full map loop) |
| `site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx` | Rail Select (V), Opening (O) | Partial; extend Dimension (M) / Wall (W) |
| `site/tests/unit/features/planner/open3d/donorParity.test.ts` | Palette + toolFromShortcutKey | Present; `buildPaletteCommands(handlers)` arity drift note |
| `site/tests/unit/features/planner/open3d/workspaceShell.test.tsx` | `toolFromShortcutKey` parity | Present (map resolver only) |
| `site/lib/ui/KeyboardShortcuts.tsx` | Global `?` modal with **hard-coded** SHORTCUTS | **Out of P09 product rail truth** unless owner expands; lists Z/F/S that open3d map does not own — do **not** “fix W8” by editing this modal into competitor fashion; optional honesty note in NOTES only |
| `results/planner/world-standard-wave/` | Evidence tree | **Absent** on this checkout → CP-09.6 not re-proven |

### 1.2 Authority map (product contract — do not invent)

From live `canvasTool.ts`:

| Tool id | Shortcut | Label | On rail? | On palette subset? |
|---------|----------|-------|----------|--------------------|
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
**Forbidden “fix”:** rebind Dimension → **D** to match any historical bad handler.

### 1.3 Live handler truth (repo wins over stale expert prose)

Expert pass / phase card (2026-07-09) described:

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
```

**Contradiction rule:** Repo wins. Plan treats historical smoking gun as **regression law**, not current bug claim. NOTES must say “historical class” vs “live residual.”

### 1.4 Non-tool handlers (must preserve)

| Key / chord | Handler | Surface |
|-------------|---------|---------|
| Space (hold) | beginTemporaryPan / endTemporaryPan | workspace |
| Tab | toggleView | workspace |
| Escape | cancel | workspace (+ canvas if !delegate) |
| Enter | commit | workspace |
| Delete / Backspace | deleteSelection | workspace |
| Ctrl/Cmd+K | openPalette | workspace |
| Ctrl/Cmd+Z | undo | workspace |
| Ctrl/Cmd+Shift+Z / Y | redo | workspace |
| 0 + - | zoom | canvas local when `!delegateKeyboard` |

**Precedence (live):** editable guard → Space → mod+K → Tab → Escape → Enter → Delete/Backspace → undo/redo mods → letter map (`!mod && !alt`).

### 1.5 Dual keyboard fence (open3d)

`OOPlannerWorkspace` mounts:

```tsx
useWorkspaceKeyboard({ setTool, toggleView, openPalette, undo, redo, deleteSelection, cancel, commit, beginTemporaryPan, endTemporaryPan });
// …
<FeasibilityCanvas … delegateKeyboard … />
```

When `delegateKeyboard === true`, FeasibilityCanvas local keydown **returns early** (still tracks Space press ref for middle-button-class pan). Tool arming ownership = workspace hook. **Do not redesign dual surface in this phase.**

### 1.6 Stale `aria-keyshortcuts` (primary residual code fix)

Live hard-coded on canvas element:

```
V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -
```

**Omits** R, O, M, P, N (and completeness for full map). Class D partial-truth failure per brainstormer: map/handler/label can be OK while aria lies by omission.

**No helper exists yet:** grep shows zero `canvasKeyShortcutsAttribute` — Task 04 creates it.

### 1.7 Palette arity note

`buildPaletteCommands(): PaletteCommand[]` takes **no** handlers.  
`donorParity.test.ts` still calls `buildPaletteCommands(handlers)` — extra arg is ignored in JS; suite may still pass. Prefer align test to zero-arg call when touching palette tests (Task 04) without feature creep.

### 1.8 Evidence / thin-note honesty

- `results/planner/` tree **missing** on this checkout.
- Thin owner notes may claim W8 GATE PASS elsewhere — **re-prove**.
- RESULTS-MAP anti-claim: “Shortcuts OK” requires `09-shortcuts-chrome/` artifacts, not “keymap file exists unread.”

### 1.9 Out of scope (hard)

- Full Approach C / Phase 2A polish (RAC drawers, premium topbar, mobile redesign)
- Full a11y A1–A8 unless finding **hides tools**
- Fabric cutover, mesh (P08), select/delete product semantics (P03), orbit (P04), save honesty (P06)
- Rail tool-set redesign; palette expansion to every `PlannerTool`
- Dual-keyboard architecture rewrite
- Competitor keymap philosophy (Floorplanner D=dimension)
- Forbidden Dimension→D rebind
- Global `site/lib/ui/KeyboardShortcuts.tsx` marketing modal rewrite as P09 scope (optional NOTES honesty only)
- New npm packages; Firecrawl re-scrape

### 1.10 Related archive noise (do not touch for W8)

| Path | Note |
|------|------|
| `site/features/planner/hooks/useKeyboardShortcuts.ts` | Fabric-era select/pan/room only — not open3d W8 surface |
| `site/features/planner/_archive/fabric/editor/*` | Archive |
| `site/tests/e2e/planner-chrome.spec.ts` | Floating dock removed; not W8 letter matrix |

---

## 2. Brainstormer synthesis (`Idiots2/P09-shortcuts-chrome/REPORT.md`)

### 2.1 What W8 is

Continuous chain:

```
tool id → shortcut letter → live keydown handler → visible label / aria / badge / palette
```

Partial truth (map tests green, handler wrong) = **FAIL**. Live keydown is non-negotiable.

### 2.2 Industry JTBD / patterns (ideas only — no copy)

| Source | Pattern adopted as O&O form | Rejected |
|--------|----------------------------|----------|
| Homestyler | Help→Shortcuts **discoverability**; five-zone shell concept | Brand, icons, WASD on same plane as tool letters this phase, SEO fluff “key tables” |
| Floorplanner | Published matrix discipline; Space pan; Esc/Delete/Undo grammar | **D=dimension, M=tape** letters; mega-tabs; manual prose as product copy |
| RoomSketcher | Named hotkey matches action (Q flip as principle) | Blue toolbar identity; invent full map from thin pack |
| Planner5D | Chrome zones; tools reachable | Smart Wizard / AI chrome clone; app.js |
| World-standard 02-toolbar | Labels truth W8; no clone; O&O research score ~2 on shortcuts | Pixel clone of winners |

**O&O letters locked (not competitor):** D=door · M=dimension · O=opening · N=window · T=text · V/R/W/P/H as map.

### 2.3 Approaches (chosen)

| ID | Approach | Verdict |
|----|----------|---------|
| **A** | Map invert + truth tests + residual aria/evidence | **SHIP for W8** (phase locked) |
| B | Rebind Dimension→D to match historical handler | **Forbidden** |
| C | Full chrome redesign + sheet first | After A green; sheet is L4 discoverability |
| D | Competitor keymap clone | **Reject** |
| E | Remove unbound N/T from map | **Reject** — bind instead |
| F | Mode-dependent dual meanings | Out of P09 |

### 2.4 Failure modes → plan tasks

| Failure class | How plan blocks |
|---------------|-----------------|
| Dual source of truth (map vs keydown) | Invert-only arming + live keydown matrix |
| Partial matrix (only D/M) | Full 10-letter table |
| Forbidden Dimension→D | Explicit stop in tasks + CP |
| Paper PASS without evidence | Task 00/06 + CP-09.6 |
| aria omit | Task 04 helper |
| Hide-tools CSS churn | Task 05 proof-first |
| Wrong folder `08-` | Canonical `09-` only |
| Re-implement invert when done | Task 00 honesty branch |
| Break Delete/undo | Non-tool regression tests |
| Dual surface thrash | Scope fence + NOTES |

### 2.5 Raised bar (stronger than process PASS)

- W8 PASS requires **CP-09.1–09.6** from data under **`09-shortcuts-chrome/`**.
- Map-only green without live keydown = fail class B.
- aria omission = residual fail class D.
- Owner thin “GATE PASS” without folder = re-prove.

### 2.6 Open questions resolved in this plan

| Question | Resolution |
|----------|------------|
| Evidence 08 vs 09? | **09- only** (FOLDER-LOCK supersedes old S1) |
| Re-implement invert? | **No** if already map-driven — verify + residual |
| Expand palette to opening/dimension/room? | **No** |
| `?` Help sheet required for W8? | **No** — L4 after truth; optional later |
| Zoom keys on aria when delegated? | Include only if same surface still owns them; document in helper options |
| Global KeyboardShortcuts modal? | Out of W8 gate unless owner expands; NOTES honesty optional |

---

## 3. Ethics / non-copy

- Research under `D:\websites` and `Plans/Research` = **ideas / JTBD / patterns only**.
- No competitor icons, chrome pixels, JS, GLB, marketing copy, or help prose into product.
- Firecrawl is **dead** for routine work.
- Do not market “works like Homestyler shortcuts.”
- O&O product strings remain original (`CANVAS_TOOL_GUIDANCE`, labels).

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

### Modify (likely)

| Path | Change |
|------|--------|
| `site/features/planner/open3d/editor/canvasTool.ts` | Add pure `canvasKeyShortcutsAttribute()` helper |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Wire helper into `aria-keyshortcuts` |
| `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` | Extend for aria helper if co-located; keep matrix |
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

- `Idiots/` (never for this plan wave)
- Fabric archive keyboards
- Full Help sheet product unless residual P1 after CP-09 (not required for W8)

---

## 5. Architecture & data flow

### 5.1 Single source diagram

```
canvasTool.ts
  CANVAS_TOOL_SHORTCUTS  ──┐
  CANVAS_TOOL_LABELS     ──┼──→ CanvasToolRail (aria/title/badge)
  CANVAS_TOOL_GUIDANCE   ──┤
                           ├──→ OOPlannerWorkspace status strip
                           ├──→ paletteCommands TOOL_IDS subset
                           ├──→ canvasKeyShortcutsAttribute() → FeasibilityCanvas aria
                           └──→ invert once → TOOL_BY_SHORTCUT_KEY
                                    ├── useWorkspaceKeyboard letter arm
                                    └── toolFromShortcutKey
```

### 5.2 Runtime vs shortcut truth

`runtimeToolFor` maps room→wall, opening→door, dimension→text, placement→select for **canvas drawing mode**.  
W8 requires letter → `setTool(PlannerTool id)`, **not** letter → runtime alias. Do not “simplify” O→door.

### 5.3 Door vs opening vs dimension

| Tool | Job | Letter | Surface |
|------|-----|--------|---------|
| opening | Generic wall void | O | Rail primary |
| door | Door-specific (legacy CanvasTool) | D | Palette |
| dimension | Measure annotate | M | Rail |

Both D and O valid; must stay distinct.

### 5.4 Discoverability stack (Homestyler-class idea, O&O form)

| Layer | Form | P09? |
|-------|------|------|
| L1 | Rail badge + `Label (Key)` | Yes — regression |
| L2 | Status strip shortcut + guidance | Present — spot check |
| L3 | Palette Ctrl+K shortcut fields | Subset honest |
| L4 | Help/`?` full sheet | After truth (not blocking CP if matrix+aria green) |
| L5 | canvas `aria-keyshortcuts` | Task 04 residual |

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
- toolShortcutTruth present?: yes
- aria-keyshortcuts value: (paste)
- evidence folder created: yes
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
```

Paste into NOTES:

- `handler map-driven: yes|no` + line refs  
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

If matrix **FAIL**: document failing assertions; branch into Task 02 repair path (do not skip RED honesty).

If matrix **PASS**: document “already green — residual = aria + evidence + hide-tools” — **do not invent fake RED**.

- [ ] **Step 5: Ownership fence note**

In NOTES:

```markdown
## Ownership fence
- Delete/Backspace semantics: P03 — P09 must not rebind meaning
- Orbit: P04 — do not thrash
- Save honesty: P06
- Mesh: P08
- Dual keyboard redesign: out
```

- [ ] **Step 6: Commit evidence scaffold only if repo allows results in git**

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
| Matrix GREEN | Skip inventing failing tests; still ensure full contract present; log as `01-tool-shortcut-truth-green-as-baseline.log` |

- [ ] **Step 1: Confirm / write full truth table in test**

Ensure the following contract exists (full source — if file already matches, leave content; if missing rows, replace with this):

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

- [ ] **Step 2: Confirm hook suite mirror (minimum D/M + full map)**

`open3dWorkspaceKeyboard.test.tsx` must retain (or add if missing) the critical block:

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

- [ ] **Step 3: Run truth suite**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/toolShortcutTruth.test.ts tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\01-tool-shortcut-truth.log
```

Expected:
- **GREEN path (likely):** all PASS — rename/copy log note as already-green baseline residual.
- **RED path:** D/M/N/T handler mismatches — proceed Task 02 implementation.

- [ ] **Step 4: Fill truth table results skeleton in NOTES**

```markdown
## Truth table results (Task 01)
| id | key | map | resolver | keydown setTool | label |
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
git commit -m "test(planner): W8 tool shortcut truth matrix (id→key→keydown setTool)"
```

**Done when:** contract suite exists; log proves GREEN or honest RED for Task 02.

---

### Task 02: Align keyboard handlers to authority map (GREEN)

**Files:**
- Modify: `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` **only if RED**
- Test: truth + keyboard suites

- [ ] **Step 1: Branch decision**

If Task 01 GREEN and code review shows invert-only arming:  
→ **Skip implementation steps 2–4.** Document in NOTES: `Task 02: no product code; regression-only`.  
Still re-run green log as `02-tool-shortcut-truth-green.log`.

If RED: continue Step 2.

- [ ] **Step 2: Replace second letter table with invert (full implementation)**

Replace letter-arming section of `useWorkspaceKeyboard.ts` with this full file pattern (match project style; no `any`):

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

**Stop-if:** you feel tempted to set `dimension: "D"` in maps. That fails product law. Fix handler, not labels.

- [ ] **Step 3: Run truth suite GREEN**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/toolShortcutTruth.test.ts tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\02-tool-shortcut-truth-green.log
```

Expected: PASS all cases; D→door, M→dimension, N→window, T→text.

- [ ] **Step 4: Regression non-tool handlers**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\02-regression-keyboard.log
```

Expected: Ctrl+K, undo/redo, editable guard, disabled, Delete/Backspace, Escape still PASS.

- [ ] **Step 5: Commit (only if code changed)**

```bash
git add site/features/planner/open3d/editor/useWorkspaceKeyboard.ts
git commit -m "fix(planner): W8 keyboard handlers match CANVAS_TOOL_SHORTCUTS (D=door, M=dimension)"
```

**Done when:** green logs; no second hard-coded tool letter table; NOTES documents skip or fix.

---

### Task 03: Rail labels / aria regression

**Files:**
- Read: `CanvasToolRail.tsx` (already map-sourced)
- Modify tests: `canvasToolRail.a11y.test.tsx`
- Modify product only if hard-codes found

- [ ] **Step 1: Static confirm rail is map-sourced**

Live pattern must remain:

```tsx
const label = CANVAS_TOOL_LABELS[tool];
const shortcut = CANVAS_TOOL_SHORTCUTS[tool];
// …
aria-label={`${label} (${shortcut})`}
title={`${label} (${shortcut})`}
// …
<span className={styles.shortcut}>{shortcut}</span>
```

If any hard-coded `"Dimension (D)"` or badge `"D"` for dimension: delete hard-code; restore maps.

- [ ] **Step 2: Extend rail RTL — Dimension (M) + Wall (W)**

Append to `site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx`:

```tsx
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

  it("exposes Dimension with accessible name Dimension (M) not Dimension (D)", () => {
    const onToolChange = vi.fn();
    render(<CanvasToolRail activeTool="dimension" onToolChange={onToolChange} />);

    expect(CANVAS_TOOL_SHORTCUTS.dimension).toBe("M");
    expect(CANVAS_TOOL_SHORTCUTS.door).toBe("D");

    const dimensionName = `${CANVAS_TOOL_LABELS.dimension} (${CANVAS_TOOL_SHORTCUTS.dimension})`;
    expect(dimensionName).toBe("Dimension (M)");

    const dimensionBtn = screen.getByRole("button", { name: dimensionName });
    expect(dimensionBtn).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: "Dimension (D)" })).toBeNull();

    fireEvent.click(dimensionBtn);
    expect(onToolChange).toHaveBeenCalledWith("dimension");
  });

  it("exposes Wall with accessible name Wall (W)", () => {
    const onToolChange = vi.fn();
    render(<CanvasToolRail activeTool="wall" onToolChange={onToolChange} />);

    const wallName = `${CANVAS_TOOL_LABELS.wall} (${CANVAS_TOOL_SHORTCUTS.wall})`;
    expect(wallName).toBe("Wall (W)");
    const wallBtn = screen.getByRole("button", { name: wallName });
    expect(wallBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("does not claim Door for M or Dimension for D on rail surface", () => {
    render(<CanvasToolRail activeTool="select" onToolChange={vi.fn()} />);
    // Door is not a rail button; Dimension must be M
    expect(screen.queryByRole("button", { name: /Door \(M\)/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /Dimension \(D\)/i })).toBeNull();
    expect(screen.getByRole("button", { name: "Dimension (M)" })).toBeTruthy();
  });
});
```

- [ ] **Step 3: Spot-check guidance strip (read-only unless hard-code)**

In `OOPlannerWorkspace.tsx` status region:

```tsx
{CANVAS_TOOL_SHORTCUTS[activeTool]} · {CANVAS_TOOL_GUIDANCE[activeTool]}
```

Must not hard-code dimension letter. Fix only if lies.

- [ ] **Step 4: Run rail tests**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx tests/unit/features/planner/open3d/toolShortcutTruth.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\03-rail-labels.log
```

Expected: PASS; Dimension (M), Wall (W).

- [ ] **Step 5: Commit**

```bash
git add site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx
# + product files only if changed
git commit -m "test(planner): W8 rail Label (Key) regression Dimension (M) Wall (W)"
```

**Done when:** no rail control shows a shortcut letter that does not arm that tool.

---

### Task 04: Canvas `aria-keyshortcuts` + palette parity

**Files:**
- Modify: `site/features/planner/open3d/editor/canvasTool.ts` (helper)
- Modify: `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` (wire)
- Modify: `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` or new aria helper tests in same file
- Modify: `site/tests/unit/features/planner/open3d/donorParity.test.ts` (palette asserts)
- Touch `paletteCommands.ts` only if mismatch

- [ ] **Step 1: Write failing helper tests first**

Add to `toolShortcutTruth.test.ts` (or create `site/tests/unit/features/planner/open3d/canvasKeyShortcutsAttribute.test.ts`):

```typescript
import { describe, expect, it } from "vitest";

import {
  CANVAS_TOOL_SHORTCUTS,
  canvasKeyShortcutsAttribute,
} from "@/features/planner/open3d/editor/canvasTool";

describe("canvasKeyShortcutsAttribute (W8 aria honesty)", () => {
  it("includes every unique letter from CANVAS_TOOL_SHORTCUTS", () => {
    const attr = canvasKeyShortcutsAttribute();
    const tokens = new Set(attr.split(/\s+/).filter(Boolean));

    for (const letter of Object.values(CANVAS_TOOL_SHORTCUTS)) {
      expect(tokens.has(letter)).toBe(true);
    }

    // Explicit critical residual omissions from historical donor string
    for (const required of ["R", "O", "M", "P", "N", "D", "T", "V", "W", "H"] as const) {
      expect(tokens.has(required)).toBe(true);
    }
  });

  it("includes wired non-tool workspace chords by default", () => {
    const attr = canvasKeyShortcutsAttribute();
    for (const chord of [
      "Tab",
      "Escape",
      "Control+Z",
      "Control+Shift+Z",
      "Control+Y",
      "Control+K",
    ] as const) {
      expect(attr.split(/\s+/)).toContain(chord);
    }
  });

  it("includes zoom tokens only when includeCanvasZoom is true", () => {
    const withZoom = canvasKeyShortcutsAttribute({ includeCanvasZoom: true });
    const withoutZoom = canvasKeyShortcutsAttribute({ includeCanvasZoom: false });

    expect(withZoom.split(/\s+/)).toEqual(expect.arrayContaining(["0", "+", "-"]));
    expect(withoutZoom.split(/\s+/)).not.toContain("0");
  });

  it("does not invent competitor tool letters absent from product map", () => {
    const tokens = new Set(canvasKeyShortcutsAttribute().split(/\s+/));
    // Competitor-only letters not in O&O map as tools
    expect(tokens.has("B")).toBe(false); // Homestyler brush
    expect(tokens.has("Q")).toBe(false); // RoomSketcher flip — not product map
    expect(tokens.has("F")).toBe(false); // not in CANVAS_TOOL_SHORTCUTS
  });
});
```

- [ ] **Step 2: Run helper tests — expect FAIL (export missing)**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/toolShortcutTruth.test.ts --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\04-aria-helper-red.log
```

Expected: FAIL — `canvasKeyShortcutsAttribute` is not exported / not defined.

- [ ] **Step 3: Implement helper in `canvasTool.ts`**

Append to `site/features/planner/open3d/editor/canvasTool.ts` (keep existing exports intact):

```typescript
export interface CanvasKeyShortcutsOptions {
  /**
   * When true, append zoom keys owned by FeasibilityCanvas local keydown
   * when `delegateKeyboard` is false (0 / + / -).
   * Default true so the canvas element that still documents zoom stays honest.
   * Set false if attaching this attribute to a surface that never owns zoom.
   */
  includeCanvasZoom?: boolean;
  /** Include Control+K palette chord (workspace-owned). Default true. */
  includePaletteChord?: boolean;
}

/**
 * Build an honest aria-keyshortcuts string for the canvas surface.
 * Tool letters always come from CANVAS_TOOL_SHORTCUTS (authority map).
 * Non-tool tokens are only those that are actually wired in product keyboard surfaces.
 */
export function canvasKeyShortcutsAttribute(
  options: CanvasKeyShortcutsOptions = {},
): string {
  const {
    includeCanvasZoom = true,
    includePaletteChord = true,
  } = options;

  const toolLetters = Array.from(
    new Set(Object.values(CANVAS_TOOL_SHORTCUTS).map((letter) => letter.toUpperCase())),
  );

  // Stable product order preference: rail-ish then remaining map letters
  const preferredOrder = ["V", "R", "W", "O", "M", "P", "D", "N", "T", "H"];
  toolLetters.sort((a, b) => {
    const ia = preferredOrder.indexOf(a);
    const ib = preferredOrder.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  const nonTool: string[] = [
    "Tab",
    "Escape",
    "Control+Z",
    "Control+Shift+Z",
    "Control+Y",
  ];
  if (includePaletteChord) {
    nonTool.push("Control+K");
  }
  if (includeCanvasZoom) {
    nonTool.push("0", "+", "-");
  }

  return [...toolLetters, ...nonTool].join(" ");
}
```

- [ ] **Step 4: Wire FeasibilityCanvas**

In `FeasibilityCanvas.tsx` imports, add:

```typescript
import { canvasKeyShortcutsAttribute } from "@/features/planner/open3d/editor/canvasTool";
// OR relative import matching file style — match surrounding imports
```

Replace hard-coded attribute:

```tsx
// BEFORE (stale donor-shaped):
// aria-keyshortcuts="V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -"

// AFTER:
aria-keyshortcuts={canvasKeyShortcutsAttribute({
  // Canvas element documents zoom keys that live on local path when !delegateKeyboard.
  // Still list them so AT surface is not silent about 0/+/- ownership on this element.
  includeCanvasZoom: true,
  includePaletteChord: true,
})}
```

Do **not** redesign canvas pointer handlers, draw pipeline, or dual keyboard gate in this step.

- [ ] **Step 5: Palette honesty asserts**

Update `donorParity.test.ts` palette describe (full replacement of the two existing tests preferred for clarity):

```typescript
import { describe, expect, it, vi } from "vitest";

import {
  buildPaletteCommands,
  filterPaletteCommands,
  runPaletteCommand,
} from "@/features/planner/open3d/lib/commands/paletteCommands";
import { CANVAS_TOOL_SHORTCUTS } from "@/features/planner/open3d/editor/canvasTool";
import type { CanvasTool } from "@/features/planner/open3d/editor/canvasTool";
import { toolFromShortcutKey } from "@/features/planner/open3d/editor/useWorkspaceKeyboard";
// … keep other imports for layers describe …

describe("donor parity — command palette", () => {
  it("builds searchable palette commands with map-sourced tool shortcuts", () => {
    const handlers = {
      setTool: vi.fn(),
      toggleView: vi.fn(),
      openPalette: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      cancel: vi.fn(),
      zoomReset: vi.fn(),
    };
    // Live signature is zero-arg; handlers only used by runPaletteCommand
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

    const paletteTools: CanvasTool[] = ["select", "wall", "door", "window", "text", "pan"];
    for (const tool of paletteTools) {
      const row = commands.find((command) => command.id === `tool-${tool}`);
      expect(row, `missing tool-${tool}`).toBeTruthy();
      expect(row?.shortcut).toBe(CANVAS_TOOL_SHORTCUTS[tool]);
    }

    // Subset honesty: palette does not invent opening/dimension rows unless product expands
    expect(commands.some((c) => c.id === "tool-opening")).toBe(false);
    expect(commands.some((c) => c.id === "tool-dimension")).toBe(false);

    void handlers; // handlers reserved for dispatch test below
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

describe("donor parity — keyboard shortcuts", () => {
  it("maps donor shortcut keys to canvas tools", () => {
    expect(toolFromShortcutKey("v")).toBe("select");
    expect(toolFromShortcutKey("W")).toBe("wall");
    expect(toolFromShortcutKey("d")).toBe("door");
    expect(toolFromShortcutKey("h")).toBe("pan");
    expect(toolFromShortcutKey("m")).toBe("dimension");
    expect(toolFromShortcutKey("n")).toBe("window");
    expect(toolFromShortcutKey("t")).toBe("text");
  });
});
```

If `paletteCommands.ts` already map-sources shortcuts, product file stays untouched.

- [ ] **Step 6: Run aria + palette GREEN**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  tests/unit/features/planner/open3d/donorParity.test.ts `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\04-aria-palette.log
```

Expected: PASS; helper includes M/D/O/R/P/N; palette tool-* match map.

- [ ] **Step 7: Grep residual hard-coded donor aria**

```powershell
cd D:\OandO07072026\site
rg -n "aria-keyshortcuts=\"V W D T H" features/planner/open3d
```

Expected: **no matches**.

- [ ] **Step 8: Commit**

```bash
git add `
  site/features/planner/open3d/editor/canvasTool.ts `
  site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx `
  site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  site/tests/unit/features/planner/open3d/donorParity.test.ts
git commit -m "fix(planner): W8 aria-keyshortcuts and palette shortcuts match maps"
```

**Done when:** AT-facing shortcut lists and palette rows cannot disagree with the keyboard map.

---

### Task 05: 2A chrome blockers that hide tools only

**Files:**
- Read first: `canvas-tool-rail.module.css`, `CanvasToolRail.tsx`, `WorkspaceShell.tsx`, `OOPlannerWorkspace.tsx`
- Modify CSS/shell **only** if NOTES proves hide/block
- Log: `05-chrome-hide-tools.log` and NOTES rows

- [ ] **Step 1: Proof-first inventory (no CSS edit)**

Document in NOTES:

```markdown
## Chrome hide-tools inventory (Task 05)

| Check | How | Result | Hide-tools? |
|-------|-----|--------|-------------|
| Rail mounted | code path CanvasToolRail in OOPlannerWorkspace | | |
| Selectors | nav[aria-label="Canvas tools"] / .pw-tool-rail | | |
| display:none interactive | CSS audit | | |
| <48rem reflow | horizontal bottom rail | reflow | **No** |
| print hide | @media print display:none | OK | **No** |
| badge letter hide small | .shortcut display:none under 48rem | discoverability | **No** |
| overlay steal | z-index / backdrop | | |
| focus trap | Tab order smoke | | |
| nested main | a11y only | Out unless rail gone | |

### CSS facts (read)
- Default .rail: column, z-index 60, width --ws-rail-w
- @media (width < 48rem): row, order 2, overflow-x auto — tools remain
- @media print: rail display none — OK
```

Live CSS already audited by brainstormer: likely `chrome-hide-tools: none`.

- [ ] **Step 2: Optional unit mount check (no browser required)**

If desired, add a thin mount test only when rail unmount risk is real. Prefer reading `OOPlannerWorkspace` render of `CanvasToolRail` — no new test required if inventory proves mounted.

- [ ] **Step 3: Optional browser matrix (only if server already approved)**

| Viewport | Expect |
|----------|--------|
| 1440×900 | Left rail visible, tools clickable |
| 390×844 | Bottom scroller rail, tools clickable |
| Print | Rail may hide |

Selectors: `nav[aria-label="Canvas tools"]`, `.pw-tool-rail`.

- [ ] **Step 4: Fix only proven blockers**

Allowed examples:

- Interactive `display:none` on rail → remove/fix breakpoint  
- Backdrop covering rail without dismiss → z-index / pointer-events  
- Rail unmounted behind `disabled` with no alternative → enable or equivalent  

Forbidden:

- TopBar rewrite, Vaul drawers, density system, landmark tree, marketing chrome, invent polish

- [ ] **Step 5: Write log**

Create `05-chrome-hide-tools.log` with either:

```
chrome-hide-tools: none
proof: CSS audit 2026-…; <48rem reflow ≠ hide; print hide OK
```

or list of files changed + before/after.

- [ ] **Step 6: Commit only if product code changed**

```bash
git commit -m "fix(planner): unblock canvas tool chrome (W8/2A hide-tools only)"
```

**Done when:** NOTES states reachability; fix landed **or** explicit none-found.

---

### Task 06: Evidence pack + CP-09 gate

**Files:**
- `results/planner/world-standard-wave/09-shortcuts-chrome/*`
- Update NOTES Results
- Optional browser smoke

- [ ] **Step 1: Final Vitest pack**

```powershell
cd D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/donorParity.test.ts `
  tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx `
  --reporter=verbose 2>&1 |
  Tee-Object -FilePath ..\results\planner\world-standard-wave\09-shortcuts-chrome\06-final-vitest.log
```

Expected: all PASS; no filtered output.

- [ ] **Step 2: Write `run.json` (RESULTS-MAP minimum)**

```json
{
  "phase": "P09-shortcuts-chrome",
  "gate": "W8",
  "checkpoint": "CP-09",
  "evidenceRoot": "results/planner/world-standard-wave/09-shortcuts-chrome",
  "date": "YYYY-MM-DD",
  "head": "<sha>",
  "status": "PASS",
  "artifacts": [
    "00-baseline-vitest.log",
    "01-tool-shortcut-truth.log",
    "02-tool-shortcut-truth-green.log",
    "03-rail-labels.log",
    "04-aria-palette.log",
    "05-chrome-hide-tools.log",
    "06-final-vitest.log",
    "NOTES.md"
  ],
  "w8": {
    "mapDrivenHandlers": true,
    "liveKeydownMatrix": true,
    "railLabelKey": true,
    "ariaKeyshortcutsDerived": true,
    "paletteMapSourced": true,
    "hideTools": "none"
  }
}
```

Fill real status/artifacts; if FAIL, status must be FAIL.

- [ ] **Step 3: Optional browser smoke**

On `/planner/open3d`, focus not in input:

1. Press **D** → status/active tool door  
2. Press **M** → dimension  
3. Save `06-browser-d-m.png` if screenshot possible  

Not a substitute for unit matrix.

- [ ] **Step 4: Complete NOTES Results**

```markdown
## Results
- W8: PASS|FAIL
- Table: all 10 rows verified (map + resolver + keydown + label)
- Chrome hide-tools: none | list
- Dual-keyboard note: none | conflict
- aria final string: <paste>
- Commits: <hashes>
- Failures residual: none | Failures.md entry

## CP-09 checklist
- [ ] CP-09.1 Unit table id→key→setTool all tools (D/M/N/T)
- [ ] CP-09.2 No divergent hard-coded tool letter table
- [ ] CP-09.3 Rail Label (Key) maps
- [ ] CP-09.4 aria/palette match maps
- [ ] CP-09.5 Hide-tools fixed or none-found
- [ ] CP-09.6 Evidence under 09-shortcuts-chrome/ unfiltered
- [ ] CP-09.7 Landable commits (push only if owner asked)

## Handoff to P10
- Contribute 09- pack + W8 PASS only if CP green
- Do not claim world-standard complete from P09 alone
```

- [ ] **Step 5: Final greps (honesty)**

```powershell
cd D:\OandO07072026\site
# Second letter table pattern (should be empty of tool arming ifs)
rg -n 'setTool\(\"dimension\"\)' features/planner/open3d/editor/useWorkspaceKeyboard.ts
# Stale donor aria
rg -n 'aria-keyshortcuts="V W D T H' features/planner/open3d
# Wrong evidence path claims in NOTES
rg -n '08-shortcuts-chrome' ..\results\planner\world-standard-wave\09-shortcuts-chrome
```

Expected: no smoking-gun D→dimension hard-code; no stale aria string; NOTES does not direct artifacts to 08-.

- [ ] **Step 6: Commit docs if tracked**

```bash
git add results/planner/world-standard-wave/09-shortcuts-chrome/
git commit -m "docs(planner): CP-09 W8 evidence pack 09-shortcuts-chrome"
```

**Done when:** CP-09.1–09.6 data-green; W8 PASS only then.

---

## 7. Test matrix

| Suite | Owns | Command |
|-------|------|---------|
| `toolShortcutTruth.test.ts` | Full id↔key↔label↔keydown + aria helper | `pnpm exec vitest run tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` |
| `open3dWorkspaceKeyboard.test.tsx` | Hook always-ons + letter matrix mirror | `…/open3dWorkspaceKeyboard.test.tsx` |
| `canvasToolRail.a11y.test.tsx` | Rail Label (Key) | `…/canvasToolRail.a11y.test.tsx` |
| `donorParity.test.ts` | Palette + toolFromShortcutKey | `…/donorParity.test.ts` |
| `workspaceShell.test.tsx` | Shell map parity (optional re-run) | baseline only |

| Case | Expect |
|------|--------|
| Each map letter keydown | `setTool(id)` once |
| Upper/lower | same tool |
| Unique letters | set size = length |
| Editable input | no setTool |
| enabled false | no bind |
| mod+letter | no tool arm |
| Delete/Backspace | deleteSelection |
| Ctrl+Z / Shift+Z / Y | undo/redo |
| Ctrl+K | openPalette |
| Dimension name | Dimension (M) |
| Aria tokens | all map letters + wired non-tools |
| Palette tool-door | shortcut D; run → door |
| Competitor B/Q in aria | absent |

**Expected final pack:** all listed unit files PASS; logs unfiltered under `09-`.

---

## 8. False-green catalog

| Trap | Why false | Block |
|------|-----------|-------|
| `toolFromShortcutKey` green alone | Map-true, handler-false class | Live keydown matrix |
| Thin “GATE PASS” notes | No folder on disk | Task 00/06 recreate |
| Evidence under `08-shortcuts-chrome` | Folder lock collision with mesh | Canonical `09-` |
| Only D/M fixed | N/T unbound gaps | Full 10-letter table |
| Dimension (D) label “fix” | Product law fail | Forbidden |
| Filtered vitest | Silent pass | Tee-Object full output |
| CSS churn without hide proof | Ceremony | Task 05 allowlist |
| Claiming W8 PASS before aria | Residual class D | Task 04 required |
| Re-running only shell map tests | Misses keydown | Truth suite mandatory |
| `buildPaletteCommands(handlers)` green | Ignores arity; may hide subset asserts | Explicit tool-* map checks |
| Global `KeyboardShortcuts.tsx` green | Hard-coded Z/F/S not open3d map | Out of gate; do not use as W8 proof |
| Dual keyboard “works on my machine” | Both fire inconsistently | NOTES dual note; no redesign |

---

## 9. Stop-if-fail / CP criteria

### Stop-if-fail

| Condition | Action |
|-----------|--------|
| Tempted to rebind Dimension→D | **STOP** — fix handler/map invert only |
| Live matrix RED after invert | Debug systematically; do not weaken tests |
| Hide-tools unproven | Do not edit CSS |
| Dual keyboard conflict breaks W8 | Minimal guard only; log first |
| Owner redefines product letters | STOP and realign goal — map is product law |
| Evidence path drift to 08- | STOP — rewrite to 09- |

### CP-09 (hard stop — data only)

- [ ] **CP-09.1** Unit table proves id → key → `setTool(id)` for every authority tool including D/M/N/T  
- [ ] **CP-09.2** No hard-coded keyboard tool letter table diverges from `CANVAS_TOOL_SHORTCUTS`  
- [ ] **CP-09.3** `CanvasToolRail` accessible names `Label (Key)` from maps  
- [ ] **CP-09.4** `aria-keyshortcuts` / palette shortcuts match maps  
- [ ] **CP-09.5** Hide-tools fixed or documented none-found  
- [ ] **CP-09.6** Evidence under `results/planner/world-standard-wave/09-shortcuts-chrome/` unfiltered  
- [ ] **CP-09.7** Landable commits; push only if owner asked  

**W8 PASS only if CP-09.1–09.6 green.**

---

## 10. Commit sequence

| # | When | Message |
|---|------|---------|
| 1 | After Task 01 if tests changed | `test(planner): W8 tool shortcut truth matrix (id→key→keydown setTool)` |
| 2 | After Task 02 if hook changed | `fix(planner): W8 keyboard handlers match CANVAS_TOOL_SHORTCUTS (D=door, M=dimension)` |
| 3 | After Task 03 | `test(planner): W8 rail Label (Key) regression Dimension (M) Wall (W)` |
| 4 | After Task 04 | `fix(planner): W8 aria-keyshortcuts and palette shortcuts match maps` |
| 5 | After Task 05 if needed | `fix(planner): unblock canvas tool chrome (W8/2A hide-tools only)` |
| 6 | After Task 06 if results tracked | `docs(planner): CP-09 W8 evidence pack 09-shortcuts-chrome` |

Skip empty commits when a task is verify-only.

---

## 11. Risks & owner decisions

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Dimension→D “fix” | Med | High | Forbidden + tests |
| Paper PASS without 09- | High | High | CP-09.6 |
| Re-implement invert for sport | Med | Low | Task 00 branch |
| Scope creep 2A | High | Med | Task 05 allowlist |
| Break Delete/undo | Med | High | Regression suite |
| Dual keyboard thrash | Med | Med | Fence + NOTES |
| Competitor letter envy | Med | High | Product map locked |
| Two writers on keyboard package | Med | High | One writer rule |
| Global shortcuts modal lies | Med | Med | Out of W8; optional later honesty phase |
| WASD later collides W/D | Future | High | Mode fence when roam ships |

**Owner decisions already locked (do not re-ask):**

- Letters: D=door, M=dimension, …  
- Evidence: `09-shortcuts-chrome/`  
- Approach A journey first; Fabric later  
- W0 unlocked — implement  

**Still owner-only (out of this plan):** purchase, force-push, full Help sheet product prioritization, Fabric walls cutover timing.

---

## 12. Self-review vs brainstormer + repo

| Requirement | Covered? |
|-------------|----------|
| Repo-first keyboard maps/handlers | §1 full |
| Idiots2 REPORT only | §2; no Idiots/ |
| Historical smoking gun as law | §1.3, Task 00 |
| Live invert already present | Explicit residual posture |
| Live keydown matrix | Task 01 |
| Handler invert | Task 02 |
| Rail regression | Task 03 |
| Aria residual | Task 04 (primary code residual) |
| Palette subset | Task 04 |
| Hide-tools proof-first | Task 05 |
| Evidence 09- | Task 00/06 |
| Forbidden Dimension→D | Multiple stops |
| Ethics non-copy | §3 |
| No placeholders / full code | Tasks 01–04 code complete |
| False-green catalog | §8 |
| CP-09 | §9 |
| Approach A chosen | §2.3 |
| Dual keyboard fence | §1.5, Task 05/06 NOTES |
| P10 handoff | Task 06 NOTES |

**Gaps intentionally out:** L4 Help sheet product, global `KeyboardShortcuts.tsx` rewrite, WASD roam, Fabric archive cleanup.

---

## Appendix A — Full inverted map

| key | tool |
|-----|------|
| v | select |
| r | room |
| w | wall |
| o | opening |
| m | dimension |
| p | placement |
| d | door |
| n | window |
| t | text |
| h | pan |

---

## Appendix B — Accessible name contracts (rail)

| Tool | Name |
|------|------|
| select | Select (V) |
| pan | Pan (H) |
| room | Room (R) |
| wall | Wall (W) |
| opening | Opening (O) |
| dimension | Dimension (M) |
| placement | Place (P) |

---

## Appendix C — Palette subset contracts

| Command id | setTool | shortcut |
|------------|---------|----------|
| tool-select | select | V |
| tool-wall | wall | W |
| tool-door | door | D |
| tool-window | window | N |
| tool-text | text | T |
| tool-pan | pan | H |

---

## Appendix D — Research translation (ideas → O&O)

| Research signal | O&O form | P09 task |
|-----------------|----------|----------|
| Homestyler Help→Shortcuts | L4 sheet later; L1 rail now | 03 residual discoverability |
| Floorplanner published matrix | Our map + truth tests | 01–02 |
| Floorplanner D=dimension | **Reject** | law |
| RoomSketcher named hotkey honesty | Letter matches action | W8 definition |
| P5D zones | Rail reachable | 05 |
| Ctrl+K palette | Keep honest | 04 |
| Hover shortcut labels | Label (Key) | 03 |

---

## Appendix E — Evidence artifact checklist

```
results/planner/world-standard-wave/09-shortcuts-chrome/
  NOTES.md
  run.json
  00-baseline-vitest.log
  01-tool-shortcut-truth.log
  02-tool-shortcut-truth-green.log
  02-regression-keyboard.log          # optional separate
  03-rail-labels.log
  04-aria-helper-red.log              # TDD red proof
  04-aria-palette.log
  05-chrome-hide-tools.log
  06-final-vitest.log
  06-browser-d-m.png                  # optional
```

---

## Appendix F — Precedence flowchart (executor mental model)

```
keydown
  │
  ├─ editable? → return
  ├─ Space (no mod, no repeat)? → temp pan
  ├─ mod+K? → palette
  ├─ Tab? → toggleView
  ├─ Escape? → cancel
  ├─ Enter? → commit
  ├─ Delete|Backspace? → deleteSelection
  ├─ mod+Shift+Z | mod+Y? → redo
  ├─ mod+Z? → undo
  └─ !mod && !alt && letter in TOOL_BY_SHORTCUT_KEY?
        → setTool(tool)
```

---

## Appendix G — Acceptance scenarios (Gherkin)

### Dimension badge honesty

```
Given the tool rail is visible
And Dimension shows accessible name "Dimension (M)"
When the user presses key "m" with focus not in an input
Then setTool is called with "dimension"
And the guidance strip shows dimension guidance and letter M
```

### Door not dimension

```
Given the product map binds D to door
When the user presses key "d"
Then setTool is called with "door"
And setTool is never called with "dimension" for that press
```

### Aria completeness

```
Given the canvas exposes aria-keyshortcuts
Then the token list includes R O M P N D T V W H
And does not invent B or Q as tool letters
```

### Editable guard

```
Given focus is in an INPUT
When the user types "d"
Then setTool is not called
```

### Small viewport

```
Given viewport width is 390
Then the rail is still reachable (reflow OK)
And keyboard letters still arm tools
```

---

## Appendix H — Implementation order

```
00 baseline → 01 truth contract → 02 handlers (if RED) → 03 rail regression
→ 04 aria/palette (primary residual code) → 05 hide-tools inventory → 06 evidence/CP-09
```

Parallelism: Task 01 authoring can start while 00 baseline runs.  
Do **not** parallelize two writers on `useWorkspaceKeyboard` / `canvasTool`.  
Do **not** start P10 world-standard claims from this phase alone.

---

## Appendix I — Type catalog used in plan

```typescript
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
export function canvasKeyShortcutsAttribute(options?: CanvasKeyShortcutsOptions): string;

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

export function buildPaletteCommands(): PaletteCommand[];
export function runPaletteCommand(id: string, handlers: PaletteCommandHandlers): boolean;
```

---

## Appendix J — Phase path index

| Doc | Path |
|------|------|
| Execute card | `Plans/phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md` |
| Expert pass | `Plans/phases/P09-shortcuts-chrome/06-ui-shortcuts.md` |
| Suggestions | `Plans/phases/P09-shortcuts-chrome/P09-suggestions.md` |
| Brainstormer | `Idiots2/P09-shortcuts-chrome/REPORT.md` |
| This plan | `idiotplanners/P09-shortcuts-chrome/IMPLEMENTATION-PLAN.md` |
| Design W8 | `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` |
| RESULTS-MAP | `Plans/Research/RESULTS-MAP.md` |
| RESEARCH-MAP | `Plans/Research/RESEARCH-MAP.md` |

---

**End of plan.**
