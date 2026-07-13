# API reference

The live handlers are authoritative.

| Source | Role |
|---|---|
| `site/app/api/**/route.ts` | Runtime behavior, auth, and validation. |
| `site/config/route-contract.json` | Tooling metadata. |
| `ROUTE-INDEX.md` | Generated human inventory. |

Refresh the inventory after route changes:

```powershell
pnpm --filter oando-site run docs:sync:routes
```

The repository has no published OpenAPI contract yet.

Add one only after live request and response schemas are stable.

## Planned SVG route

The route index lists live handlers only.

The current SVG-block route still reads disk-backed descriptors.

Target `GET /api/planner/catalog/svg/[revisionId]` is not live.

Do not add it to `ROUTE-INDEX.md` until implementation exists.

It will return exact sanitized bytes for one committed revision.

See [Database SVG contract](../architecture/08-DATABASE-SVG-CONTRACT.md).
