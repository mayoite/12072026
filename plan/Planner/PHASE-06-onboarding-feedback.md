# PHASE-06 — Onboarding + feedback honesty

**Parallel:** yes · **Blocks on:** — · **Proof:** live browser + screenshots

---

## In plain words
Two related things. First, when a brand-new buyer lands on a blank planner, they should
immediately know what to do — not stare at an empty canvas. Second, every status the app shows
("saving", "saved", "unsaved", errors) must be true. Today a guest can see language that hints
at cloud saving before anything was actually saved to the cloud — that's the kind of small lie
this phase removes.

## Why this matters
The first ten seconds decide whether someone keeps using the tool. And honest status is a
trust issue: if "Saved" can appear when nothing was saved, a buyer can lose work and blame the
product. Clear onboarding + truthful feedback is what makes it feel finished.

## What exists today (grounded in code)
- `ui/PlannerEmptyCanvas.tsx` — the blank-state component; needs a clearer next action.
- `ui/PlannerSkeleton.tsx` — the loading placeholder.
- `editor/workspaceStatusLabels.ts` + `ui/PlannerSaveIndicator.tsx` — the save-status pill
  and its label logic (guest vs member, local vs cloud).

## What "good" looks like
Landing on `/planner` with no dev flags shows a friendly empty state offering: start blank,
start from a starter room, or use a template. A guest's save language always says **local
draft**. Loading shows a skeleton; errors are visible and plain.

## Steps
1. Strengthen the empty state with an obvious first action and honest guest ("local draft")
   copy.
2. Show the skeleton while loading and a clear message on error.
3. Audit the save pill so a guest never sees "cloud" before a real cloud save succeeds; make
   dirty / saving / saved / error states each visible and correct.

## Done when
Acceptance boxes are in `plan/Planner/CHECKLIST.md` → PHASE-06.

## How to prove
Open `/planner` fresh (no dev flags), confirm the empty state guides you to a first wall or
placement in a few obvious steps. Trigger a save as guest and confirm the label says local.
Force a load error and confirm it's shown. Live run is the proof; Raw artifacts → `results/planner/phase-06/` (gitignored dump). Report → `agents-work/reports/planner-phase-06.md`.

## Guardrails
- Never show "cloud" language to a guest, or before a cloud save actually succeeds.
- No silent failures — every error state is visible.

## Out of scope
Full account/cloud-sync flows (member cloud save is its own work); tutorial/coach-marks.
