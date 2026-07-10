# Owner workflow (simple)

Replaces reading long 05 / 07 / 08 / 09 docs every time. Use this loop.  
**Head bar:** [`Agents/Agents-ELON-STANDARD.md`](../Agents/Agents-ELON-STANDARD.md) · pointer [20-ELON-STANDARD.md](./20-ELON-STANDARD.md) · **recap:** [SESSION-RECAP.md](./SESSION-RECAP.md)

```
┌─────────────┐
│ 1. Pick ONE │  →  ayushdocs/00-PENDING.md + 19-GOALS-SLICES.md
│    kill-path│
└──────┬──────┘
       ▼
┌─────────────┐
│ 2. Implement│  →  Agents-ELON-STANDARD: phase task list · multi-hour
│             │     package-isolated parallel; TDD; no worktrees; ≤8 (max 10)
└──────┬──────┘
       ▼
┌─────────────┐
│ 3. Verify   │  →  verification-before-completion + check-work
│             │     unit + Playwright under results/planner/<slice>/
└──────┬──────┘
       ▼
┌─────────────┐
│ 4. Review   │  →  requesting-code-review + code-review (ayushdocs/05 detail)
└──────┬──────┘
       ▼
┌─────────────┐
│ 5. Evidence │  →  results/planner/<slice>/  (index: 08-EVIDENCE-INDEX.md)
└──────┬──────┘
       ▼
┌─────────────┐
│ 6. Commit   │  →  main · push origin when green · mayoite ~45m / big land
└──────┬──────┘
       ▼
┌─────────────┐
│ 7. Update   │  →  00-PENDING + SESSION-RECAP + 01-RECAP if big
└─────────────┘
```

**Backup:** git = Elon §5; DB/R2 = `OPERATIONS_RUNBOOK.md`. **Firecrawl:** dead.

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
