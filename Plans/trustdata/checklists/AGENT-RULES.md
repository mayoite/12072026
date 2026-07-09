# AGENT-RULES — trustdata (short)

**Constitution:** `AGENTS.md` (wins on conflict).  
**Plan:** `Plans/trustdata/INDEX.md` · **Licenses:** `ayushdocs/17-LICENSES-CLEARED.md`  
**Checkout:** `D:\OandO07072026` only · **Evidence:** `results/planner/world-standard-wave/`  
**Scoreboard:** `ayushdocs/19-GOALS-SLICES.md` · **Why:** `ayushdocs/18-PRODUCT-CONTEXT.md`

## Operating bar

- **Global standards only** — manufacturer-planner quality, not local demo shortcuts.
- **Quality over time** — prefer correct evidence and clean landings over thrash.
- Owner is present but **does not micromanage or prompt-engineer** — agent takes the call once intent is clear.

## Do

- Superpowers + **relevant** skills (not a skill laundry list for show).
- **One owner task → finish it.** Parallel agents **only inside that task** (default ≤8, hard max **10**). Write to disk; no worktrees.
- Commit as we go; **push origin when right**; **mirror ~30–60 min** (`mayoite`) — see `AGENTS.md`.
- Take operational calls; prove with tests/browser/`results/`.
- W3 needs **unit + browser** under `03-select-delete/` — no self-waive.
- Folder names: `RESULTS-MAP.md` only.

## Do not

- **Multi-task parallel** — do not run multiple W-gates / CPs / epics as concurrent workstreams. Kill order is **serial priority**, not concurrent multi-job.
- Prompt-novel / 400-line agent briefs — point at phase MD + this file.
- Plagiarism / unauthorized copy (need **explicit** website/license OK for development); keys outside `.env.local`.
- Claim W-gate green without evidence path.
- Force-push or delete remote branches without owner ask.

## Spawn (required)

Every subagent prompt **must** open with skill load, e.g.:

`/using-superpowers` + any fit skills (TDD, systematic-debugging, verification-before-completion, chrome-devtools, …)

Then short task body + MD pointers. **Do not** replace skills with a long custom “prompt novel.”

```
/using-superpowers [+ skill list]
Trustdata: AGENTS.md + Plans/trustdata/INDEX.md + phase file.
No worktrees. One owner task only — parallel agents only inside THIS task (max 10).
Licenses: ayushdocs/17-LICENSES-CLEARED.md (buy: owner only).
Evidence: results/planner/world-standard-wave/. Context: ayushdocs/18 + 19.
Global standard · quality over speed. Finish this task. Hard stops: buy / force-push / goal change / plagiarism.
TASK: <one clear ask — sub-slice of the same owner task>
```
