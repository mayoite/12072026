# AGENTS.md

## 1. Overrides
- **User wins** — your message beats all rules.
- **Re-read this file** before every task.
- **Unclear product goal** → ask once. Clear goal → implement; don't ask how.
- **No prompt theater** — short rules, real work. Don't inflate this file or handbooks.
- **Honesty over comfort** — pushback always welcome. Flattery and soft lies = fail.
- **Raise the bar, never lower it** — floor: `Agents/Agents-01-STANDARD.md`.

## 2. Routing
| Layer | Path |
|-------|------|
| Constitution | **this file** (~60 lines max) |
| Agent process | **`Agents/`** — all handbooks |
| Owner intent | **`ayushdocs/`** — five files only |

Head → `Agents/Agents-01-STANDARD.md` · list → `Agents/INDEX.md`  
Subagents → same bar · `/using-superpowers` · fit skills.

## 3. Freedom & hard stops
- **Owner owns intent.** Goal change → stop and align. Else: full execute freedom (code, tests, browser, commands, commits, push/mirror, subagents).
- **Hard ask only:** purchase/seat · force-push/delete remote branch · destroy owner data · competitor-asset edge · new product area.

## 4. Git (standing)
- Repo root checkout only — **no worktrees**.
- Commit each landable slice · push `origin` when green enough · mirror `mayoite` ~45m / big land.
- Detail: Standard §6 · `OPERATIONS_RUNBOOK.md`.

## 5. Layout (hard)
- **Evidence** → repo-root `results/` only. Never `site/results/` or `site/test-results/`.
- **`site/` tracked tree** → product code only. `site/node_modules/` = gitignored pnpm workspace shim (expected after root install; not committed). **Never** `npm install` under `site/` or `site/tech-stack-generator/` — no nested `package-lock.json` or `site/tech-stack-generator/node_modules/`.
- **Durable** → flat `Plans/*-track/` · `Agents/` · `ayushdocs/` (5 files) · `docs/` (HOW + Lockedfiles overlays).
- **Install** → `pnpm` from repo root. **Firecrawl dead.** Research → repo-root **`websites/`** (gitignored; junction `D:\websites` → same). Never claim benchmarks missing without reading it.
- Redirect stray tool output to `results/`. `pnpm run check:layout`.

## 6. Law (short)
- **No `any`** in handwritten code.
- **No plagiarism** · paid assets = owner buys · licenses: `docs/Lockedfiles/03-dependencies-engines-current.md` (owner thin: `ayushdocs/`).
- **Secrets** → `.env.local` only.
- **Tests:** no suppression · no silent pass · see `testing-handbook.md`.
- **No paper moon** — `pass`/JSON ≠ product. Standard §3 NO PAPER MOON.

## 7. Where detail lives (not here)
| Need | File |
|------|------|
| Process / phases / seats | `Agents/INDEX.md` |
| Execute | `Plans/INDEX.md` |
| Owner | `ayushdocs/` |
| Facts / commands | `Readme.md` · `START.md` |
| Blockers | `Failures.md` |

**Checks:** `check:agents-md` · `check:agents-folder` · `check:ayushdocs` · `check:active-docs` · `check:plans-purity`
