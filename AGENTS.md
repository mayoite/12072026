# AGENTS.md

## 1. Overrides
- **User wins** — your message beats all rules.
- **Re-read this file** before every task.
- **Unclear product goal** → ask once. Clear goal → implement; don't ask how.
- **No prompt theater** — short rules, real work. Don't inflate this file or handbooks.
- **Honesty over comfort** — pushback always welcome. Flattery and soft lies = fail.
- **Raise the bar, never lower it** — floor: `Agents/Agents-ELON-STANDARD.md`.

## 2. Routing
| Layer | Path |
|-------|------|
| Constitution | **this file** (~60 lines max) |
| Agent process | **`Agents/`** — all handbooks |
| Owner intent | **`ayushdocs/`** — five files only |

Head → `Agents/Agents-ELON-STANDARD.md` · list → `Agents/INDEX.md`  
Subagents → same bar · `/using-superpowers` · fit skills.

## 3. Freedom & hard stops
- **Owner owns intent.** Goal change → stop and align. Else: full execute freedom (code, tests, browser, commands, commits, push/mirror, subagents).
- **Hard ask only:** purchase/seat · force-push/delete remote branch · destroy owner data · competitor-asset edge · new product area.

## 4. Git (standing)
- Repo root checkout only — **no worktrees**.
- Commit each landable slice · push `origin` when green enough · mirror `mayoite` ~45m / big land.
- Detail: Elon §5 · `OPERATIONS_RUNBOOK.md`.

## 5. Layout (hard)
- **Evidence** → repo-root `results/` only (disposable). Never durable plans/handbooks in `results/`.
- **Durable** → `Plans/` · `Agents/` · `ayushdocs/` (5 files) · `archive/museum/`.
- **Install** → `pnpm` from repo root. **Firecrawl dead.** Research ideas → external `websites` folder only.
- Redirect stray tool output to `results/`. `pnpm run check:layout`.

## 6. Law (short)
- **No `any`** in handwritten code.
- **No plagiarism** · paid assets = owner buys · licenses table in museum `17-LICENSES-CLEARED.md`.
- **Secrets** → `.env.local` only.
- **Tests:** no suppression · no silent pass · see `testing-handbook.md`.
- **No paper moon** — `pass`/JSON ≠ product. Elon §NO PAPER MOON.

## 7. Where detail lives (not here)
| Need | File |
|------|------|
| Process / phases / seats | `Agents/INDEX.md` |
| Execute | `Plans/INDEX.md` |
| Owner | `ayushdocs/` |
| Facts / commands | `Readme.md` · `START.md` |
| Blockers | `Failures.md` |

**Checks:** `check:agents-md` · `check:agents-folder` · `check:ayushdocs` · `check:active-docs` · `check:plans-purity`
