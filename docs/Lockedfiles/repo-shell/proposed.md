# Repo shell — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** [`plann/00-REVISION.md`](../../../plann/00-REVISION.md) — **1A / 1B acceptance pending evidence**

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | Policy | Paths | Docs |
|--------|--------|-------|------|
| Monorepo | Application code lives only under `site/` (not repo root) | `pnpm-workspace.yaml`, `site/package.json` | `CONTENTS.md`, `Readme.md` |
| Deploy | `site/vercel.json` runs workspace install from repo root, then `next build` in `site/` | `site/vercel.json` | `OPERATIONS_RUNBOOK.md` |
| Env | Minimum keys in `Readme.md`; validate with `validate-launch-env.mjs` | `.env.example`, `site/scripts/loadEnvLocal.cjs` | `Readme.md`, `START.md` |
| Evidence | All gate output under `results/<module>/<phase>/<cmd>/` | `results/` | `testing-handbook.md` |

## Packages (proposed per plan)

| Item | Policy |
|------|--------|
| Node | `>=24` — single engine line for CI and Vercel |
| pnpm | `11.9.0` — only package manager |
| Workspace | `site/` + `site/tech-stack-generator/` — no app deps at repo root |
| Lockfile | `pnpm-lock.yaml` at root — all installs from workspace root |

Dependency pins live in `site/package.json`; governance in `PACKAGES.md` + revision.
