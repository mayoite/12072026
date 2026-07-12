# PHASE-02 — Catalog lifecycle + bulk ops

**Parallel:** yes · **Blocks on:** 01 (needs a trustworthy publish path) · **Proof:** live browser

---

## In plain words
A catalog manager needs to handle **many** items, not one at a time — import a spreadsheet of
products, see which are live/draft/retired, edit one without breaking its identity, and retire
old ones. Today the admin can publish a single symbol but there's no bulk lifecycle around it.

## Why this matters
A furniture catalog is hundreds of items. Without bulk import and clear item states, the admin
is a toy. This is what turns "publish one SVG" into "run a real catalog."

## What exists today (grounded in code)
- `admin/AdminCatalogPageView.tsx`, `admin/AdminCatalogListView.tsx` — the catalog list UI.
- `admin/adminCatalogClient.ts` — client calls for catalog operations.
- Publish path from PHASE-01 (`publishDescriptorWithPipeline.ts`).

## What "good" looks like
Upload a CSV of items → they import all-or-nothing (no half-imports) → each shows a clear state
(live / draft / retired) → editing one preserves its slug identity → retiring hides it from
buyers without deleting history.

## Steps
1. Add a bulk import (CSV or similar) that is atomic: it all succeeds or it all rolls back with
   a clear error.
2. Show per-item lifecycle state in the list, with actions to publish / retire.
3. Ensure edit preserves slug identity (no accidental new-item duplication).

## Done when
Boxes in `plan/Admin/CHECKLIST.md` → PHASE-02.

## How to prove
Import a small CSV (one row deliberately bad) → confirm the whole batch rolls back with a
readable error. Fix it, re-import, confirm all items live with correct states. Live run is the
proof; Raw artifacts → `results/admin/phase-02/` (gitignored dump). Report → `agents-work/reports/admin-phase-02.md`.

## Guardrails
- Atomic import — never leave the catalog half-updated.
- Edits keep slug identity; retire ≠ delete (keep history).

## Out of scope
Pricing (PHASE-05) and workstation families (PHASE-04) — this is generic catalog items.
