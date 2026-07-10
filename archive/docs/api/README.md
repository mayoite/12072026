# API documentation

**Last updated:** 2026-06-29

## Contract source

There is no checked-in OpenAPI file. The live contract is:

| Source | Role |
|--------|------|
| [`ROUTE-INDEX.md`](ROUTE-INDEX.md) | Human-readable route/method inventory |
| `site/app/api/**/route.ts` | Handlers, auth, validation |
| `site/config/route-contract.json` | Route metadata used by tooling |

Regenerate or refresh `ROUTE-INDEX.md` when handlers change:

```powershell
pnpm --filter oando-site run docs:sync:routes
```

Included in `pnpm run docs:sync:all` (repo root). Until CI wires this, run the command in the same PR as route edits.

## Consumers

- **Agents / reviewers:** start at `ROUTE-INDEX.md`, then open the matching `route.ts`.
- **Clients:** use route handlers + shared types under `site/lib/api/`; do not assume a published OpenAPI URL.

## Related

- `AGENTS.md` — Drizzle for catalog/planner SQL; Supabase HTTP for auth only.
