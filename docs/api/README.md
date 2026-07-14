# API reference

Live handlers in `site/app/api/**/route.ts` are authoritative.

| Source | Role |
|---|---|
| `site/app/api/**/route.ts` | Runtime behavior, auth, validation |
| `site/config/route-contract.json` | Tooling metadata |
| `ROUTE-INDEX.md` | Generated inventory — refresh after route changes |

```powershell
pnpm --filter oando-site run docs:sync:routes
```

No published OpenAPI yet. Add only when request/response schemas are stable.

## SVG catalog routes (live vs planned)

| Route | Status | Authority |
|---|---|---|
| Planner SVG-block handlers (e.g. `svg-blocks`) | **Live** | Disk — `loadBuyerVisibleDescriptors()` |
| `GET /api/planner/catalog/svg/[revisionId]` | **Not live** | Target: exact DB revision bytes — do not list in `ROUTE-INDEX.md` until implemented |

Contract: [08-DATABASE-SVG-CONTRACT.md](../architecture/08-DATABASE-SVG-CONTRACT.md).
