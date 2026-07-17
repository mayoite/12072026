# Planner Agent 3 — Handoff + BOQ + Validation (2026-07-17)

## Scope
P8 validation · P9 BOQ bridges · P10 handoff/Resend. No catalog/draw/plan edits.

## Env (SET/MISSING only)
| Name | Status |
|------|--------|
| `NEXT_ADMIN_SUPABASE_URL` | SET |
| `SUPABASE_ADMIN_SERVICE_ROLE_KEY` | SET |
| `RESEND_API_KEY` | SET |
| `STAFF_NOTIFY_EMAIL` | SET |
| `EMAIL_FROM` | SET |

CRM client for handoff: **`NEXT_ADMIN_SUPABASE_URL` + `SUPABASE_ADMIN_SERVICE_ROLE_KEY`** via `createSupabaseAuthAdminClient`. Not products `SUPABASE_*`.

## Live probes (`results/planner/agent3-handoff-env-probe.txt`)
- `customer_queries` head select: **OK** (planner-handoff rows = 0)
- Resend domains API: **200 OK**
- No live handoff insert or email send performed

## Code truth
- **P8:** `runFloorValidation` = overlap + wall-collision + room-boundary + aisle-clearance + opening-obstruction. Review gates on errors.
- **P9:** `projectFurnitureBoq` → `furnitureBoqBridge` → quote cart / PDF / handoff. Demo-list honesty labels. Hash excludes clock.
- **P10:** `POST /api/planner/handoff` → `customer_queries` (source `planner-handoff`) + optional Resend. 501 if CRM env missing. Idempotency user-scoped + legacy replay. CSRF + rate limit + member auth.

## Unit (fresh)
**74 passed** across handoff route, notify, bridges, branded PDF, BOQ, validation, ReviewQuotePanel.

Hardened tests: no email/phone 400, confirmDemoPricing 400, `staffNotified` true/false, Resend throw + partial env skip, handoff payload compactness.

## Still open (honest)
- Browser matrix: Review send, PDF download, live CRM row after real member session
- Plan ticks for wall/opening lag code (implemented; plan not edited)
- Catalog/validation revision pin; immutable commercial revision
- Unit ≠ deploy proof

## Result
**UNIT PASS · CRM/Resend config PASS · BROWSER OPEN · NOT DEPLOY-READY alone**
