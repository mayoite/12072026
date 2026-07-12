# Workflow (owner)

Seven steps. Agent *how* lives in `AGENTS.md` → `Agents/` — not here.

1. **Pick one** — `01-PENDING.md` + `04-GOALS-SLICES.md` + `plan/README.md`
2. **Implement** — one phase; agents do heavy work
3. **Verify** — real tests; proof under `results/`
4. **Review** — re-prove against live code + `results/`
5. **Evidence** — screenshots/logs in `results/` only
6. **Commit** — push when green (see `AGENTS.md`)
7. **Update** — this folder if truth changed

```powershell
pnpm dev
pnpm gate
```

More commands: `START.md`