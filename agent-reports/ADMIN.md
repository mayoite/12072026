# Admin — status

**Date:** 2026-07-17  
**Deploy auth:** **NOT PROVEN** on local (DEV_AUTH_BYPASS often on)  
**Map:** `plan/Admin/FEATURES.md` · `docs/architecture/07-ADMIN-UI-BENCHMARK.md`

## Scope
Catalog, SVG editor, plans list, themes, price-books, customer-queries ops, CRM demo hub

## Gates / probes
| Item | Result |
|------|--------|
| Admin nav → real pages | OK (inventory) |
| Live `/admin` without login | **200 under DEV_AUTH_BYPASS** — unauth gate unproven |
| `/api/admin/*` without login | **200 under bypass** |
| `/api/customer-queries/manage` | 401 even with bypass (custom auth) |
| Guest AI CSRF | Fixed: `requireCsrf` on ai-assist/advisor routes |
| Dead API folders | Removed empty `ai-generate`, `buddy-catalog` |
| `GET /api/health` | Added `{ok:true}` |
| Unit: AdminLayoutShell / dashboard | PASS (focused cluster) |
| Unit: `admin/crm/page` | FAIL (hub vs redirect test drift) last probe |

## SVG / catalog authority
- Live publish: **disk** (`inventory/descriptors`, `public/svg-catalog`)
- DB dual-write: optional / incomplete — see `Failures.md` DB-SVG

## Open next
1. Restart dev with **bypass off**; prove unauth → `/access`  
2. Fix `admin/crm/page.test.tsx` to match hub  
3. Browser smoke: SVG editor open + publish path (no claim without run)  
4. Customer-queries list shows planner-handoff rows after live send  

## Bar
Bypass-on probes are not production auth proof.
