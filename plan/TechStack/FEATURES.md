# TechStack features

**Code map.** Status: `CHECKLIST.md`. Versions: lockfile + `docs/Lockedfiles/03-dependencies-engines-current.md`.

| Area | Path |
|------|------|
| Root install | `package.json` · `pnpm-workspace.yaml` · `scripts/guard-workspace-install.mjs` |
| Layout / purity | `scripts/check-repo-layout.mjs` · `check-plans-purity.mjs` · `check-failures.mjs` |
| Site package | `site/package.json` · Next 16 |
| Engines | Fabric · Three/R3F · Excalidraw · parametric `draw*` |
| Env | `.env.example` · `site/lib/env.server.ts` |
| CI | `.github/workflows/*` |
| Gates | `pnpm run gate` · `release:gate` · `check:layout` |
