# Planner — status

**Date:** 2026-07-17  
**Deploy:** **NOT READY**  
**Plans:** `plan/Planner/COMPLETION-CONTRACT.md` · `FINISH-PLAN.md` · `FEATURES.md`

## Loop
Draw/import → place furniture → Review BOQ → Send to Oando

## Gates
| Gate | Result |
|------|--------|
| layout / lint / typecheck | PASS (last re-verify) |
| Focused unit slices | PASS |
| Full `pnpm run test` | OPEN |
| Browser acceptance | OPEN |
| build / release:gate | OPEN |

## Landed (unit / code)
- Guest UUID entry; owner-scoped plan save/delete; guest GLB namespaced
- Room/dims/ortho; wall grips; opening drag; placement guides; underlay 2-pt calibrate
- Validation (overlap, outside-room, aisle, wall collision, opening clearance)
- ReviewQuote + branded PDF path (unit); handoff API + CSRF + idempotency
- Scene GLB: honest unsupported (no fake menu)

## Email / CRM
- Handoff → `customer_queries` when admin Supabase set
- Staff mail: Resend needs `RESEND_API_KEY` + `STAFF_NOTIFY_EMAIL` (**API key was MISSING** on last env check)
- Live email/browser handoff **not** proven

## Open next
1. Full unit suite re-run  
2. `RESEND_API_KEY` if staff mail needed  
3. Browser: guest → place → Review → Send  
4. Grip/opening/place/calibrate browser smoke  

## Bar
Unit ≠ browser. No deploy from unit-green alone.
