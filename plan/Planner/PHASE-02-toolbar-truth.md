# PHASE-02 — Toolbar truth

**Parallel:** yes · **Blocks on:** — · **Proof:** live browser + screenshots

---

## In plain words
The planner's top bar and side rail have buttons that either do nothing or lie. The clearest
example: the **Prefs → "Toggle grid"** and **"Toggle snap"** menu items are wired to nothing —
you click them and the canvas doesn't change. There are also drawing tools on the rail
(`room`, `dimension`, `text`) that look like real tools but silently do nothing when used.
This phase makes every visible control either work or honestly say it's not ready yet.

## Why this matters
A toolbar that lies is worse than a missing feature — it destroys trust in the whole product.
Every later phase builds on this chrome, so if the controls can't be believed, nothing above
them can be either. This is cheap to fix and high in trust payoff.

## What exists today (grounded in code)
- `editor/TopBar.tsx` — the Prefs menu's `onAction` (~line 437) only handles `"density"`;
  the `"grid"` and `"snap"` menu items fall through to nothing.
- `store/plannerUIStore.ts` — already has `toggleGrid()` and `showGrid`. The wiring target
  exists; it's just not connected.
- `project/store/workspacePreferences.ts` — already has `gridEnabled` / `snapEnabled` for
  persistence.
- `editor/canvasTool.ts` — the single source of truth for every tool's shortcut, label, rail
  group, and whether it's `live` or `deferred`.
- `editor/CanvasToolRail.tsx` — renders the rail; already marks deferred tools with a dot.

## What "good" looks like
Every button on the top bar and rail produces a visible, correct result — or is clearly set
apart as "coming soon." No control is a silent no-op.

## Steps
1. Wire Prefs → **Toggle grid** to `plannerUIStore.toggleGrid()` and persist via
   `workspacePreferences.gridEnabled`.
2. Wire Prefs → **Toggle snap** the same way to `snapEnabled`.
3. For deferred rail tools (`room`, `dimension`, `text`): either promote to live (dimension
   is handled in PHASE-04) or move them off the primary rail into a labelled "coming soon"
   group so they aren't equal peers with working tools.
4. Click through every export/import menu item and confirm each resolves to a real action.

## Done when
Acceptance boxes are in the one track checklist: `plan/Planner/CHECKLIST.md` →
PHASE-02. Tick them there, not here.

## How to prove
Run the app, open the Prefs menu, toggle grid and snap, watch the canvas change, reload and
confirm the setting stuck. Then click every other top-bar/rail control and confirm none is
dead. The live run is the proof; screenshots land in `results/planner/phase-02/` (a dump).

## Guardrails
- `canvasTool.ts` stays the **single** source of truth — don't scatter tool config into the
  rail or the top bar.
- Don't fake a deferred tool into looking live; honesty over polish.

## Out of scope
Making the deferred drawing tools actually draw geometry (that's PHASE-04 for `dimension`;
`room`/`text` stay deferred until their own phase).
