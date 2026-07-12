# PHASE-02 — Site chrome parity

**Parallel:** yes · **Blocks on:** — · **Proof:** live browser + screenshots

---

## In plain words
The "chrome" is the shared header, navigation, and footer across the marketing site and the
planner entry. This phase makes sure it's consistent and works everywhere — same nav, same
theme behavior, nothing cut off — on both desktop and phone.

## Why this matters
Inconsistent chrome makes the product feel stitched-together. It's the first impression on the
marketing pages and the bridge into the planner.

## What exists today (grounded in code)
- `app/(site)/layout.tsx` — the marketing shell.
- `features/planner/components/PlannerMarketingChrome.tsx` — planner-entry chrome.
- Prior state: a "PASS slice" whose evidence pack went missing — re-prove, don't redesign.

## What "good" looks like
Header, nav, footer, and theme toggle are present and consistent across marketing + planner
entry, at desktop and 375×812, with light/dark parity and no clipped chrome.

## Steps
1. Verify nav + theme controls are reachable at every breakpoint.
2. Confirm light/dark parity across the chrome.
3. Confirm no clipped or overflowing chrome on mobile.

## Done when
Boxes in `plan/Site/CHECKLIST.md` → PHASE-02.

## How to prove
Walk the marketing pages + planner entry at desktop and 375×812 in both themes; screenshot.
Live run is the proof; Raw artifacts → `results/site/phase-02/` (gitignored dump). Report → `agents-work/reports/site-phase-02.md`.

## Guardrails
- Re-prove the existing slice — this is not a full redesign.
- No claim of "site complete."

## Out of scope
New marketing pages/content and SEO metadata (SEO track).
