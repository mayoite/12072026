# Worker instruction standard (owner-enforced)

Weak instructions produced weak work. Use this for every product UI/function worker.

## Required output (fail the worker if missing)

1. **Before/after** for every change: what was wrong (benchmark or user-visible), what changed, why it meets the bar.
2. **Files owned** — hard exclusive list. No drive-by.
3. **Fresh evidence same session:** commands + exit codes. Unit alone never claims browser/UI PASS.
4. **At least one of:**
   - Playwright/e2e or Chrome DevTools on the changed route at **desktop 1440** and **phone 390**, OR
   - Explicit **OPEN** with the exact remaining browser proof and why unit is insufficient.
5. **Brutal residual OPEN** — no fake PASS.
6. **No “class-only density” as the whole deliverable** unless the ticket is explicitly CSS-only.

## Quality bar (UI)

Read the track benchmark first:

- Site: `docs/architecture/09-SITE-UI-BENCHMARK.md`
- Planner: `docs/architecture/06-UI-BENCHMARK.md`
- Admin: `docs/architecture/07-ADMIN-UI-BENCHMARK.md`

Minimum for “UI module done” (unit may support, not replace):

| Surface | Must address |
|---------|----------------|
| Phone | 44px primary controls, no horizontal overflow, usable primary task without desktop-only chrome |
| Hierarchy | One primary action per region; advanced secondary/collapsed |
| Honesty | No fake status, empty, or authority copy |
| Journey | Entry → main task shorter or clearer than before (measure steps or screens) |

## Forbidden worker patterns

- “Unit PASS, browser OPEN” as the entire outcome for a UI ticket.
- Renaming labels only when the layout is the problem.
- Touching 20 files with 2px padding changes.
- Claiming module done without running the named test path for owned files.
- Inventing PASS from plan ticks or old reports.

## Deploy rule

Parent only: one module commit → push → wait for Vercel status on that SHA before declaring deploy. Do not squash unrelated modules into one commit.

## Prompt skeleton (copy into spawn)

```
Repo E:\12072026. MODULE <id>: <title>

OWN (exclusive write — nothing else):
- <paths>

READ FIRST:
- <benchmark path>
- <relevant FEATURES/FINISH-PLAN open items>

BAR (all required):
1. Fix user-visible problems listed under DELIVERABLES, not cosmetics only.
2. Run unit tests for OWN paths; report exit codes.
3. Browser or DevTools: 1440 and 390 on <routes> OR document exact OPEN with screenshot path under results/ if you capture.
4. Before/after table in final report.
5. No commit. No PROTECTED. No any.

DELIVERABLES (must all be done or FAIL the module):
- <specific measurable items>

FAIL the module if you only add classes without changing hierarchy, empty states, or phone composition.
```
