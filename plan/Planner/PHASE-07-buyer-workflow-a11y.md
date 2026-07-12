# PHASE-07 — Buyer workflow + accessibility proof

**Parallel:** integration — runs continuously as 01–06 land · **Blocks on:** consumes 01–06 ·
**Proof:** live browser trace + screenshots

---

## In plain words
This is the "does the whole thing work for a real person" phase. It walks the full buyer journey
**keyboard-only** in **both themes**, runs accessibility checks, and locks in **workspace chrome
truth** — zero console errors and a repeatable height/overflow audit (not a one-off screenshot).

## Why this matters
Individual phases can pass while seams fail. Console errors and layout regressions are what
buyers see as "broken." This phase catches integration gaps and makes prior read-only audits
into standing proof.

## What exists today (grounded in code)
- Live routes `/planner` and `/planner/guest`.
- `editor/CommandPalette.tsx` — keyboard spine.
- Prior manual checks reported chrome GREEN and 0 console errors — not yet a repeatable test.
- Missing notes to restore under `agents-work/`: `CANVAS-NOTES.md`, `TOOLBAR-NOTES.md`,
  `LAYOUT-OVERFLOW.md`, `SVG-CATALOG-HONESTY-NOTES.md`.

## The buyer story (benchmark: Planner 5D step count)
land → empty state → draw room → place SVG furniture → edit in inspector → switch 3D → save →
export BOQ.

## Steps
1. Walk the full story keyboard-only; fix unreachable/unfocused controls.
2. Run in both themes after PHASE-11 mount; fix surfaces that don't switch (chrome, Fabric, Three, focus states).
3. **Console proof:** zero errors on guest workspace load.
4. **Standing check:** add a repeatable browser check for height/overflow/console (regression guard).
5. Restore chrome/SVG honesty notes under `agents-work/`.
6. Run axe / lighthouse on the live route; clear findings.

## Done when
Boxes in `plan/Planner/CHECKLIST.md` → PHASE-07.

## How to prove
Keyboard-only run in both themes; repeatable chrome/console check green; a11y tools clean.

Raw artifacts → `results/planner/phase-07/`. Report → `agents-work/reports/planner-phase-07.md`.

## Guardrails
- Integration only — reports problems back to 01–06; does not freeze them.
- A green one-off audit does not close this phase; the repeatable check must exist.

## Out of scope
- Breakpoint height chain primary proof — Planner P05 (P07 confirms zero console during journey).
- Marketing site chrome — Site P02.