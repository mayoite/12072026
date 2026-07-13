# GitHub 3-account inventory (2026-07-09)

## Live totals
| Account | Created | Live repos |
|---------|---------|------------|
| pglcarpets | 2026-07-06 | **1** |
| ayushonmicrosoft | 2026-02-11 | **11** |
| mayoite | **2025-10-02** | **8** |
| org oofpl | — | **0** |
| **Total live** | | **20** |

## Deleted full repos
GitHub API does **not** list deleted private repos for recovery.
Events feed only shows **branch** deletes, not "deleted entire repository".
Local origin `ayushonmicrosoft/0106` → **not found** on API (deleted or never remote under that name).
Cannot restore deleted repos via API from these tokens.

## Branch mass-deletes (not whole repo)
- 2026-07-08: pglcarpets/Codex07072026 — many orchestrator/restore branches deleted
- mayoite/oando-consolidated — many cursor/* and recovery/* branches deleted Jun 13

## Local-only salvage for "0106"
D:\0106-ayush.backupverstversion -delete.backupbestversion still has full tree + 2 commits.
