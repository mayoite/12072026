# AGENTS.md

## Absolute Authority
- **User Wins:** The current user instruction always supersedes every rule, plan, handbook, and previous decision.
- **No Guessing:** If scope, goal, or instruction is unclear, stop and ask **exactly one focused question**.
- **Off-Limits:** Never edit any Agent Markdown files unless the user explicitly commands it. Never open, edit, or cite `PROTECTED/`.

## Repository Root Authorities
These four files own the facts:

- `AGENTS.md` — Agent conduct, workflow, and routing (this file)
- `Readme.md` — Repository layout, commands, product loop, catalog authority
- `Testing-handbook.md` — Testing policy and command reference
- `Failures.md` — Active blockers only (remove only after verified fix)

**Live code + fresh verification > plans, notes, and old reports.**

## Multi-Agent Workflow
- **Default:** Single agent mode.
- Activate **only** when user explicitly says “workflow”, “use 3 agents”, or “use agents”.
- Use exactly **one writer + two peer reviewers** (parent is one reviewer). One writer at a time.
- Revert immediately when user says “stop workflow”, “single agent”, or “remove agents”.

## Environment & Execution
- Dev environment is **Windows / PowerShell**.
- Secrets live **only** in root `.env.local`.
- Run `pnpm` **only from repository root**.
- Never run package installation inside `site/` or `tech-docs-generator/`.
- No handwritten `any` in code.
- No silent test skips or suppressed failures.
- Never create worktrees. Never force-push.

## Core Execution Rules
- Read relevant code before editing.
- Make the **smallest safe change**.
- Preserve all unrelated work.
- Never suppress console errors or warnings.

## Testing Workflow (Mandatory Rules)
- **Name-mirroring:** `site/<path>/File.ts` → `site/tests/unit/<path>/File.test.ts`
- **Evidence discipline:** Unit green ≠ browser proof. Old results prove nothing. Fresh command output is required.
- **Output location:** All artifacts go to root `results/<track>/`. Never under `site/results/` or `site/test-results/`.
- **Catalog safety:** Tests must **never** mutate canonical catalog files or released data. Use isolated fixtures + proper cleanup.
- **Browser rules:** Use **only** `http://localhost:3000`. UI claims require fresh Playwright evidence (console, failed requests, a11y, viewports). No forced clicks or raised timeouts.
- **Focused testing first:** Run smallest relevant check during work. Broad gates only when shipping or scope changed.
- **Layout gate:** Run `pnpm run check:layout` before claiming any task complete.
- **No silent skips:** All skips must be logged and justified.

## Product Guardrails & Architecture
- **Product Loop:** Admin publishes trusted inventory → Site informs visitors → Planner designs & creates branded BOQ.
- Keep `app/` routes thin. Push logic to `features/`.
- **Published SVG** is the primary planner symbol. `Block2D` is fallback only.
- Stable identity and millimetre units must be preserved.
- `site/` (Next.js 16 / React 19) is the **only product code**.
- Keep `app/` routes **thin**. Push logic to `features/`.

## Verification & Done Rules
Before claiming done:
1. Result exactly matches the request (zero bloat).
2. Work stayed inside approved scope.
3. Fresh terminal or browser evidence exists.
4. `pnpm run check:layout` passed.
5. Remaining blockers recorded in `Failures.md`.
6. Clear report: what changed, what ran, what failed/skipped, next action.

## Mandatory Handbook Routing
Read the owning handbook before editing any surface (all under `Agents/`):
- Standard → `Agents/01 — Standard.md`
- Testing → `Agents/02 — Testing.md` + `Testing-handbook.md`
- Browser → `Agents/03 — Browser.md`
- Failures → `Agents/04 — Failures.md`
- Documentation → `Agents/05 — Documentation.md`
- Architecture → `Agents/06 — Architecture.md`
- CSS → `Agents/07 — CSS.md`

## Final Rule
User instructions override everything.  
When in doubt, ask one focused question and wait.