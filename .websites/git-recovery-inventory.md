# Git / backup inventory (read-only)

Scanned: 2026-07-09  
Action: inspect only — no rewrite, no delete, no push.

## Executive summary

| Location | Commits | History span | Root | Remote |
|----------|---------|--------------|------|--------|
| D:\OandO07072026 | 97 | July 2026 only | 762af7a snapshot 2026-07-04 | pglcarpets/Codex07072026 |
| D:\oandO04072026 | 47 | July 2026 only | **same** 762af7a | ayushonmicrosoft/oandO04072026 |
| D:\codex07072026.backup-20260707-132108 | 47 | July 2026 | same family @ ccd8130 | Codex07072026 |
| D:\0106-ayush...bestversion | 2 | June 2026 only | Personal backup snapshot 2026-06-01 | ayushonmicrosoft/0106 |
| D:\OandOWebsite\OandoOwebsite | 2 | June 2026 | Initial import | mayoite/OandoOwebsite |
| D:\OOFPLWeb | 94 | June–July 2026 | Initial 2026-06-26 | ayushonmicrosoft/OOFPLWeb |

## Bottom line

**No 8-month git history found on this machine.**  
All major lines start with **Initial / snapshot / import** roots in **June–July 2026**.

That is consistent with history having been wiped or never migrated into these folders — **not** with "8 months still living in main."

## Shared root

OandO07072026 and oandO04072026 both root at:

`762af7a` — "Initial commit: oandO04072026 snapshot" of D:\new (04 Jul 2026).

## Do not delete

- D:\0106-ayush.backupverstversion -delete.backupbestversion (4353+ files)
- D:\OOFPLWeb
- D:\oandO04072026 (including restore-* branches)
- D:\codex07072026.backup-20260707-132108

## Missing

- D:\new (source of July snapshot message) — not present

## Next recovery steps (when you approve)

1. Read-only compare 0106 tree vs OandO07072026 (file inventory, not merge)
2. List restore-* branches on oandO04072026
3. Check GitHub for other repos under ayushonmicrosoft / pglcarpets / mayoite
4. Check Vercel project deploy history / old project names
