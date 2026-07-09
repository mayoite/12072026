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
```powershell
cd D:\OandO07072026\site
pnpm run dev                    # uses .env.development.local bypass
pnpm run test:e2e:p0-admin-svg  # needs PLAYWRIGHT_BASE_URL if using existing dev
# or:
$env:PLAYWRIGHT_BASE_URL='http://localhost:3000'
$env:DEV_AUTH_BYPASS='1'
pnpm exec playwright test -c config/build/playwright.config.ts tests/e2e/admin-svg-publish-p01.spec.ts
```

### Rules
- One P0 at a time  
- Resolve blockers (don’t leave “pending forever”)  
- Playwright images = proof  
- Figma only if you want design system work — **not required for P0**
