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
