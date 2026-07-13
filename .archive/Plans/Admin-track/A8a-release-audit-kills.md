# A8a — Release / audit / rollback · kill addendum

**Addendum to:** [A8-release-audit-rollback.md](./A8-release-audit-rollback.md).  
**Status:** OPEN · **Depends:** A5–A7 surfaces that produce releasable artifacts. A1–A3 SVG publish is foundation, **not** full A8.  
**Evidence:** `results/admin/release-audit-rollback/`

Original A8 acceptance is the complete bar. Kills only. **Not done** until original + owner happy.

## Kill order

| ID | Slice | Green when (slice) | Unlocks |
|----|--------|--------------------|---------|
| **A8.0** | Inventory today’s publish/revision paths | Map SVG publish + descriptor archive vs A8 outcome | A8.1 |
| **A8.1** | Human-readable diff for one artifact type (SVG/descriptor) | Reviewer sees field/asset diff before activate | A8.2 |
| **A8.2** | Reject with required reason + audit trail | Reject stored; visible on trail | A8.3 |
| **A8.3** | Atomic activate for declared set | Mid-fail activates **none**; before/after proof | A8.4 |
| **A8.4** | Rollback to prior revision | Active restored; new audit event; history kept | A8.5 |
| **A8.5** | Multi-artifact + impact preview | Cross-deps named; plan/quote impact preview before activate | A8 full |

## Not done by

A1 Publish button alone · PARTIAL “we have revisions on disk.”

## Reopen rule

PARTIAL release governance → **OPEN** until A8 acceptance + owner OK.
