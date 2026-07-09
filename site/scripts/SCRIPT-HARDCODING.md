# Scripts should not assume an atomic clock (2026-07-09)

## Smell
Many older scripts treat the repo like a fixed machine:
- `http://localhost:3000` forever
- `D:\…`, `E:\15062026`, worktree paths
- Frozen mass counts / CI floors (`20/21`, `19924` stmts)
- Dead product trees (`tldraw`, `buddy-planner`) as if still live

That made coverage and probes look “precise” while being **wrong after the tree moved**.

## Rule
| Prefer | Avoid |
|--------|--------|
| `BASE_URL` / `PLAYWRIGHT_BASE_URL` / `PROBE_BASE_URL` | Bare `localhost:3000` only |
| `path` relative to `site/` / monorepo root | Hardcoded `D:\OandO…` |
| Live `coverage-final.json` totals | Frozen denominators |
| **Include-first allowlists** for gates | “Everything minus hope” |
| Env for machine-local backup roots | Committing personal drive maps |

Helper: `scripts/lib/scriptEnv.mjs` (`baseUrl()`, `siteRootFrom()`, …).

## OK to hardcode (policy, not mass)
- Gate **percent** targets in `coverage-policy.mjs` (chosen bars, not measured universe size)
- Default fallbacks when env unset (`http://localhost:3000` as default only)

## Inventory / backups
`sync-backup-to-15062026.ps1` and friends are **operator machine scripts** — treat as local recipes, not product truth.
