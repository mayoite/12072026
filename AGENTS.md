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
- **Owner owns intent.** Goal change → stop and align. Else: execute freedom (code, tests, browser, commands, subagents).
- **Hard ask only:** purchase/seat · force-push/delete remote branch · destroy owner data · competitor-asset edge · new product area · **commit/push** (no commit without owner ask).

## 4. Git (standing)
- Repo root checkout only — **no worktrees**.
- Commit/push only when owner asks. Detail: Standard §6 · `OPERATIONS_RUNBOOK.md`.

## 5. Layout (hard)
- **`results/`** = tool **dump only** (write if needed). **Never read `results/` for PASS, status, or done.** Law = `plan/` + live code. Never write under `site/results/` or `site/test-results/`.
- **`PROTECTED/`** = owner private. **Ignore** — do not open, edit, or cite.
- **No `agents-review/`** — not law; do not recreate as SoT.
- **`site/` tracked tree** → product code only. `site/node_modules/` = gitignored workspace shim. **Never** `npm install` under `site/` or `site/tech-stack-generator/`.
- **Durable** → `plan/<Track>/` · `Agents/` · `ayushdocs/` (5 files) · `docs/` (HOW + Lockedfiles).
- **Install** → `pnpm` from repo root. **Firecrawl dead.** Research → repo-root **`websites/`** (gitignored).
- `pnpm run check:layout`.

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
| Execute | `plan/README.md` + `plan/<Track>/CHECKLIST.md` |
| Owner | `ayushdocs/` |
| Facts / commands | `Readme.md` · `START.md` |
| Blockers | `Failures.md` |
| Dump (not law) | `results/` |
| Owner private | `PROTECTED/` — ignore |

**Checks:** `check:agents-md` · `check:agents-folder` · `check:ayushdocs` · `check:active-docs` · `check:plans-purity`
