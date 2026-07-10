# Workflow (owner)

Seven steps. Agent *how* lives in `AGENTS.md` → `Agents/` — not here.

1. **Pick one** — `00-PENDING.md` + `19-GOALS-SLICES.md` + `Plans/P-track/BOARD.md`
2. **Implement** — one phase; agents do heavy work
3. **Verify** — real tests; proof under `results/`
4. **Review** — `Plans/P-track/CODE-REVIEWS.md` if needed
5. **Evidence** — screenshots/logs in `results/` only
6. **Commit** — push when green (see `AGENTS.md`)
7. **Update** — this folder + `HONEST-STATUS` if truth changed

```powershell
pnpm dev          # from repo root
pnpm gate
```

More commands: `START.md`
