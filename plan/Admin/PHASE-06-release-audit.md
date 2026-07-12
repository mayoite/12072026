# PHASE-06 — Release, audit, rollback

**Parallel:** yes · **Blocks on:** 01 · **Proof:** live browser

---

## In plain words
When the admin publishes or changes a symbol, there needs to be a safety net: a record of who
changed what, an approval step, and a way to roll back to a previous version if something breaks
— without ever destroying the old version. Today symbols publish, and revision snapshots exist
on disk, but there's no approve/rollback workflow around them.

## Why this matters
A live catalog that real buyers see can't be edited without governance — a bad publish
shouldn't be a one-way door. This is the "don't lose work, don't ship mistakes" layer.

## What exists today (grounded in code)
- Descriptor revision snapshots already accumulate on disk (e.g. `side-table-001.N.json` —
  ~18 revisions), so history is being kept; there's just no UI/workflow to use it.
- Publish path from PHASE-01.

## What "good" looks like
Publish → approve → (if needed) roll back to a prior revision → an audit log shows the trail. No
revision is ever deleted.

## Steps
1. Surface the revision history per symbol in the admin.
2. Add an approve step before a publish goes live, and a rollback-to-revision action.
3. Record an audit trail (who / when / what) for publishes and rollbacks.

## Done when
Boxes in `plan/Admin/CHECKLIST.md` → PHASE-06.

## How to prove
Publish a change, approve it, then roll back to the prior revision and confirm the live bytes
revert while the newer revision is still on disk. Confirm the audit log entry. Live run is the
proof; Raw artifacts → `results/admin/phase-06/` (gitignored dump). Report → `agents-work/reports/admin-phase-06.md`.

## Guardrails
- No revision is ever deleted — rollback restores, it doesn't erase forward history.
- Approval is required before a change is buyer-visible.

## Out of scope
Multi-user roles/permissions beyond the existing admin auth (that's the Security track).
