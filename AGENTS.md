# AGENTS.md

## Rules

- The user wins.
- Re-read this file before each task.
- Do not lie. Say the brutal truth.
- Verify code. Never trust old ticks or reports.
- Keep sentences short.
- Clear goals are executed without ceremony.
- Goal changes require owner alignment.
- Quality floor: `Agents/Agents-01-STANDARD.md`.

## Owner standing decisions (do not re-litigate)

- **Full authority from owner.** Parent agent has **owner-level authority**. Zero owner blockers. Execute.
- **Evidence, then decide.** If the parent sees fresh evidence (command exit, code, browser), the parent **takes the call** — PASS / FAIL / ship / flip. Do not wait for owner rubber-stamp.
- **No subagent decisions.** Subagents may explore or draft. They must **not** decide status, cutover, PASS, or product calls. Parent only.
- **No artificial owner blockers.** Keys rotated. DB + R2 granted. See `Failures.md` — owner blockers = NONE.
- Do **not** re-explain disk vs `SVG_RELEASE_AUTHORITY` unless flipping cutover with evidence the parent has run.
- Owner dual-write meaning: **Supabase (Products DB) + R2** for live durable catalog.
- Code may still default disk until `SVG_RELEASE_AUTHORITY=db` — parent flips after **parent-seen** place proof.
- Commit verified slices. Push when the slice should land. Ask only if a secret is missing or the host truly cannot act.

## Product

- Admin manages trusted inventory (exact client configs, not “close enough”).
- Site informs visitors and sends customers to Planner.
- Planner places published symbols and produces branded BOQ.
- Security verifies data, permissions, integrations, releases.
- UI and a11y are acceptance concerns, not separate tracks.

### Daily order factory (Admin primary)

```text
fields + options → eng drawer (Maker) → multipath SVG → publish (disk now; DB+R2 when enabled)
  → guest place → BOQ name/SKU
```

- Library **as you go** (desk first; lockers/etc. when a real job needs a new drawer).
- Not magic. Not five designers per permutation.
- Do **not** rebuild Planner chrome (Fabric / Dockview / Aria).
- Freehand / AI-from-image = draft assist only; human locks mm + options before publish.
- Exact config closes orders. Nearest stock photo does not.

## Layout

- Execute: each track’s `plan/<Track>/CHECKLIST.md` + `FEATURES.md`.
- **Admin only:** also `IMPLEMENTATION-PLAN.md` + `REALITY-AND-STACK.md` (exactly four under `plan/Admin/`).
- Optional index: `docs/site/OUTSTANDING-ITEMS.md`.
- Product facts: `docs/`. Process: `Agents/`. Agent notes: `agent-reports/` (not PASS proof).
- Active blockers: `Failures.md` only — no fake owner holds.
- `results/` = tool output only. Never PASS proof. Never under `site/results/`.
- `site/` = product code. `websites/` / `archive/` reference only. `PROTECTED/` never open/edit/cite.

## Execution

- Test isolation first. Tests never mutate canonical catalog.
- Block only the exact dependent item. Continue unrelated work.
- `pnpm` from repo root. No install inside `site/` or `tech-docs-generator/`.
- No handwritten `any`. No plagiarism. Secrets only in `.env.local`.
- No suppressed tests. No worktrees.
- **Commits:** save finished slices so work is not lost. Prefer one clear commit when a slice is verified. Do not force-push or rewrite shared history.
- **Push / PR / deploy:** only when the owner asks.

## Start

- Process: `Agents/INDEX.md`.
- Execute: `plan/README.md`.
- Facts/ops: `Readme.md`.
- Licenses: `docs/Lockedfiles/03-dependencies-engines-current.md`.

Run `pnpm run check:layout` before completion.
