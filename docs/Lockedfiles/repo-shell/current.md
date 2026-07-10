# Repo shell — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** Per [`Plans/global-standard-revision/README.md`](../../../Plans/global-standard-revision/README.md), Phase **1A** and **1B** are **not accepted** — this file describes on-disk repo layout only.

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | On disk today | Paths |
|--------|---------------|-------|
| Monorepo | Root proxies into `site/` and `tech-stack-generator/` | `pnpm-workspace.yaml`, root `package.json`, `site/package.json` |
| Deploy | Vercel project `oando-platform`; Root Directory = `site` | `site/vercel.json` (`buildCommand`: `cd .. && pnpm run build`) |
| Env | Repo-root `.env.local` loaded by scripts | `.env.example`, `site/scripts/loadEnvLocal.cjs` |
| Evidence | Test/lint output under `results/<module>/…` | `results/`, `testing-handbook.md` |
| Governance | Conduct + gates at root; product plan in `Plans/` | `AGENTS.md`, `Failures.md`, `Plans/P-track/START.md` |

## Packages (on disk)

| Package | Pin | Role in this domain |
|---------|-----|---------------------|
| `pnpm` | `11.9.0` | Workspace package manager (`packageManager` field) |
| Node | `>=24.0.0` | `engines` in root `package.json` |
| `turbo` | `latest` | `release:gate` orchestration at root |
| `oando-site` | `site/package.json` | Main app — all runtime deps live here |
| `oando-tech-stack-docs` | `site/tech-stack-generator/package.json` | Sibling workspace package |

---

## Summary

The repo is a thin pnpm workspace wrapper around the real app in `site/`, plus a separate tech-stack doc generator. Tooling, evidence paths, and deploy config are documented but session handover can lag live git state. Vercel monorepo setup (root install, build via workspace) is the critical operational invariant.

## Strengths

Clean separation: no application logic at repo root. Standardized test evidence under `results/` with handbook enforcement. Single env file at root consumed consistently by Next, Playwright, and scripts. `vercel.json` in `site/` matches documented one-app deploy model.

## Weaknesses

Two handovers (root governance vs `Plans/` product) can disagree on status. CI and Vercel greenness must be verified live, not from docs. Overlapping `plans/` and archived plan trees on disk create path confusion for agents. Tech-stack CI has been a known weak signal on main.
