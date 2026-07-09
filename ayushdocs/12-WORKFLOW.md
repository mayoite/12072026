# Owner workflow (simple)

Replaces reading long 05 / 07 / 08 / 09 docs every time. Use this loop.

```
┌─────────────┐
│ 1. Pick ONE │  →  ayushdocs/00-PENDING.md  (next open P0 only)
│    kill-path│
└──────┬──────┘
       ▼
┌─────────────┐
│ 2. Implement│  →  TDD if new logic; superpowers ≤8 agents; no worktrees
└──────┬──────┘
       ▼
┌─────────────┐
│ 3. Verify   │  →  unit + Playwright (screenshots under results/planner/<slice>/)
└──────┬──────┘
       ▼
┌─────────────┐
│ 4. Review   │  →  ayushdocs/05 + 10 (or agent code-review)
└──────┬──────┘
       ▼
┌─────────────┐
│ 5. Evidence │  →  results/planner/<slice>/  (index: 08-EVIDENCE-INDEX.md)
└──────┬──────┘
       ▼
┌─────────────┐
│ 6. Commit   │  →  main + push baseline
└──────┬──────┘
       ▼
┌─────────────┐
│ 7. Update   │  →  00-PENDING (mark done) + short note in 01-RECAP if big
└─────────────┘
```

### Map to older docs
| Old | Role now |
|-----|----------|
| 05 CODE-REVIEW | Step 4 detail |
| 07 AGENT-PROCESS | Step 2 detail (how agents work) |
| 08 EVIDENCE-INDEX | Step 5 map |
| 09 VERIFY-SNAPSHOT | Last unit snapshot (optional check) |

### Commands cheat sheet
See **[14-SCRIPTS-MENU.md](./14-SCRIPTS-MENU.md)** for the short owner list.

```powershell
cd D:\OandO07072026
pnpm dev          # site next dev
pnpm p0           # unit + svg smoke
pnpm p0:admin-svg # Playwright admin publish (with PLAYWRIGHT_BASE_URL if reusing dev)
pnpm gate         # fast lint/typecheck/unit
```

### Rules
- One P0 at a time  
- Resolve blockers (don’t leave “pending forever”)  
- Playwright images = proof  
- Figma only if you want design system work — **not required for P0**
