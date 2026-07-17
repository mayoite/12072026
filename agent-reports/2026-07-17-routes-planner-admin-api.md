# Route exploration — Planner · Admin · API

**Verdict:** OPEN for deploy auth gates (DEV_AUTH_BYPASS on)  
**Evidence:** live `localhost:3000` + `site/app/{planner,admin,api}` + `proxy.ts` + `next.config.js` redirects

## Highlights

| Surface | Finding |
|---------|---------|
| Guest | Bare `/planner/guest/` → **307** `?id=<uuidv7>`; invalid id **404** |
| Canvas | Page-level member gate; **proxy does not** protect `/planner/canvas` (contract says protected) |
| Admin | Nav links map to real pages; bypass → **200** without login |
| Handoff | POST under bypass: **400** bad body; GET **405** |
| Plans API | GET **200** under bypass (not 401) — expected off-bypass only |
| Health | **No `/api/health`** |
| Manage queries | **401** even with bypass (custom auth) |

## FAIL / OPEN for deploy

1. **FAIL env** — Bypass on: unauth admin/API gates not proved. Re-run with bypass off.  
2. **OPEN** — No health route.  
3. **OPEN** — `route-contract` vs `proxy` mismatch on canvas.  
4. **OPEN** — Guest AI routes without CSRF (inconsistent with planner sketch CSRF).  
5. **OPEN** — Empty `api/admin/svg-editor/ai-generate` (no route.ts).  
6. **OPEN** — Public `business-stats` payload safety.

## E2e gaps

Unauth admin redirect (bypass off), fabric/open3d redirect chain, guest deep links, plans ownership, handoff CSRF, prod `dev/*` 404.

## Not done

No code fixes. Full matrix in agent transcript; this file is the short index.
