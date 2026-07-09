# Root scripts sweep archive — 2026-07-09

Moved from repo-root `scripts/` (hardcoded obsolete paths / worktrees).

| Script | Why |
|--------|-----|
| `verify-parser.ps1` | Hardcoded `D:\worktrees\bench-456\...` (worktrees forbidden; path dead) |
| `diag-filter.ps1` | Hardcoded `D:\worktrees\phase-06` one-off diagnostic |
| `migrate-evidence.ps1` | Hardcoded `D:\OOFPLWeb` + `E:\oofpl-test-evidence` (prior product tree) |

Still live at repo root: `check-sharp.js`, `run-evidence-cmd.ps1`, `run-site-tests.ps1`, `scan-forbidden.ps1` (parameterized).

See also: `archive/site/scripts/2026-07-09-scripts-sweep/`.
