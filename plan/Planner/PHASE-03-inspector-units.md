# PHASE-03 — Selection inspector + units

**Parallel:** yes · **Blocks on:** — · **Proof:** live browser + screenshots

---

## In plain words
When you click on something you've placed — a wall, a door, a desk — you should get a panel
on the right that shows its real numbers (position, size, rotation) and lets you edit them by
typing. Today that panel exists but is thin. This phase turns it into a real "inspector," and
makes it understand every unit a buyer might use: millimetres, centimetres, metres, inches,
and feet-and-inches.

## Why this matters
Placing furniture is only half a planner; **editing precisely** is the other half. A buyer who
can't type "make this desk 1400mm wide" doesn't have a real tool. Units matter because
commercial buyers work in mm but many people think in feet — both must be correct, and the
stored truth must never drift.

## What exists today (grounded in code)
- `editor/PropertiesPanel.tsx` — the right panel; currently shows a minimal set of fields.
- `project/model/units.ts` — already has `formatLengthInput` / `parseLengthInput` and the
  full unit set (`mm`, `cm`, `m`, `in`, `ft-in`). The conversion engine exists.
- Document actions — edits must go **through** these (so undo works), never by mutating the
  entity directly.

## What "good" looks like (benchmark: Planner 5D)
Select anything → a clean inspector with typed fields → change a number → the canvas updates
instantly → undo puts it back with a correct label. Switch to feet-and-inches and the display
converts while the stored millimetre value is untouched.

## Steps
1. Expand the inspector to show x / y / size / rotation / layer / lock, plus per-type fields
   (wall thickness, opening width, furniture options).
2. Route every edit through a document action so it becomes one named undo entry.
3. Honor the active display unit for both showing and parsing; keep mm as the stored authority.
4. Render honest empty (nothing selected), multi-select, and locked states.

## Done when
Acceptance boxes are in `plan/Planner/CHECKLIST.md` → PHASE-03.

## How to prove
Select an entity, type a new width, watch the canvas change, press undo and confirm the label
is correct. Switch the unit dropdown to ft-in, confirm the display converts and the saved
value (in mm) is unchanged. Live run is the proof; Raw artifacts → `results/planner/phase-03/` (gitignored dump). Report → `agents-work/reports/planner-phase-03.md`.

## Guardrails
- mm is always the stored authority; imperial is display-only.
- No direct entity mutation — edits go through actions so undo/redo stays honest.

## Out of scope
3D property editing and BOQ pricing fields (later phases / Admin pricing contract).
