# A6a — Workstation system authoring · kill addendum

**Addendum to:** [A6-workstation-system-authoring.md](./A6-workstation-system-authoring.md).  
**Status:** OPEN · **Depends:** A5 enough for lifecycle + A4 patterns ([BOARD](./BOARD.md)).  
**Evidence:** `results/admin/workstation-system-authoring/`

Original A6 green-whens remain the **card complete** bar. This orders kills only. **Not done** until original acceptance + owner happy.

## Kill order

| ID | Slice | Green when (slice) | Unlocks |
|----|--------|--------------------|---------|
| **A6.0** | Repo truth | Map any existing workstation/family/BOM code + storage; “nothing yet” is valid | A6.1 |
| **A6.1** | Family identity + size grid + seat counts (data only) | Persist one family definition; reload shows same fields | A6.2 |
| **A6.2** | Linear two-seat authoring (no-code UI) | Non-coder defines valid two-seat linear without JSON/code | A6.3 |
| **A6.3** | Compatibility rules block invalid save | Invalid module combo cannot save; plain-language reason names modules | A6.4 |
| **A6.4** | 2D + 3D + BOM from one version id | Change version id → all three move together (proof) | A6.5 |
| **A6.5** | L topology + Planner consume without code deploy | L config + Planner places released version by release id only | A6 full |

## Not done by

Hard-coded family in Planner · JSON drop · “PARTIAL rules engine.”

## Reopen rule

PARTIAL workstation work → **OPEN** until A6 acceptance + owner OK.
