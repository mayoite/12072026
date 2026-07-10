# Do you need all `results/` — or delete old?

**Short answer:** you do **not** need every historical folder forever. Keep a **thin keep-set**; prune or archive the rest.

## Keep (do not delete)

| Keep | Why |
|------|-----|
| `ayushdocs/` | Owner docs (not under results, but permanent) |
| `results/planner/p0-1-admin-svg-publish/` | P0.1 browser proof + PNGs |
| `results/planner/p0-2-*/` + latest `tests-*` | Current hard-path proof |
| `results/planner/code-review-wave/` | Review baseline |
| `results/planner/a11y-open3d/` | A11y baseline until P0.3 re-run |
| `results/planner/SESSION-RECAP.md` | Handoff |

## Safe to delete or archive (old / noisy)

| Can prune | Why |
|-----------|-----|
| Duplicate wave logs (`wave-superpowers`, `verify-wave`, old `hard-path` raw if superseded) | Replaced by newer runs |
| `results/tests/` vitest dump junk | Often recreated; gitignore-ish |
| `_tsc-wave.txt`, one-off noise | Temporary |
| Very old `phase-1a` / `phase-1b` if fully superseded and still in git history | Recover via git |

## Policy (simple)

1. **Git history already stores old evidence** after commit — deleting a folder from working tree does not erase the past commit.
2. Prefer: `archive/results/` move instead of hard delete if nervous.
3. After each P0 kill-path: keep **that** folder; drop intermediate agent dumps.

## Tech-stack scripts (your question)

These **three names stay** (root `package.json` — unchanged):

```json
"dev:tech-stack": "pnpm --filter oando-site-workflow-docs dev",
"build:tech-stack": "pnpm --filter oando-site-workflow-docs build",
"preview:tech-stack": "pnpm --filter oando-site-workflow-docs preview"
```

Owner menu (`p0`, `gate`) does **not** rename them. Full list of daily scripts: [14-SCRIPTS-MENU.md](./14-SCRIPTS-MENU.md).
