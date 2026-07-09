# Agents/Agents-Plan.md

## 1. Authority
- **Constitution:** `../AGENTS.md` wins on every conflict.
- **Also read:** `../Readme.md`, live plan via `../Plans/README.md` → **`Plans/trustdata/`**.
- **Scoreboard / why:** `../ayushdocs/19-GOALS-SLICES.md`, `../ayushdocs/18-PRODUCT-CONTEXT.md`.

## 2. Discovery
- **No Guessing:** Verify live file paths. Do not assume.
- **Mismatch = Stop and report:** If repo conflicts with docs, fix docs or code — do not invent a third story.
- **Unclear product goal = Ask:** Once the goal is clear, take the implementation call (no prompt theater).

## 3. Plan Rules
- **Scope:** Smallest change that meets a **global quality bar**. Prefer quality over speed.
- **Format:** Exact canonical casing. Relative links only.
- **Content:** Exact files to modify. No implementation code in plans unless architectural.
- **Live plan only:** `Plans/trustdata/` (INDEX → phase → CHECKPOINTS → evidence). Archived plans under `archive/Plans/` are history, not authority.
- **Git & workspace:** Follow **User Standing Instructions** in `../AGENTS.md`:
  - Checkout **`D:\OandO07072026` only** — never worktrees.
  - **Commit as you go** after each landable slice.
  - **Push origin when right** (agent call) when the slice is committed and green enough not to strand remote.
  - **Mirror (`mayoite`)** on ~30–60 min real work (or sooner after a big land).
  - **No force-push** / remote branch delete without owner ask.
  - Hard stops only: purchase, force-push, destroy owner data, competitor assets, true goal change.

## 4. Verification
- **Evidence:** Name commands and `results/` paths up front.
- **Proof required:** No “done” without re-readable artifacts (tests, browser, NOTES).
- **Zero suppression:** Full console / logs retained.

## 5. Execution
- **Owner does not micromanage or prompt-engineer.** Agent owns implementation once intent is clear.
- **Skills / agents:** `/using-superpowers` on main + every subagent; any fit skill; default **8**, hard max **10**.
- **Formal plan approval** is not a gate for routine work under implementation unlock — trustdata phases + owner intent are enough.
- **Stop and ask** only on hard stops above or if the **product goal** changes.
- **Blockers:** Log `Failures.md`; do not defend bad output.
