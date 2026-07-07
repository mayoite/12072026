# CONSOLIDATED (see resolved-failures.md)

This part file was an intermediate slice from agent 8/8.
Merged 2026-07-04. Safe to delete.

Date: 2026-07-04
Scope (disjoint): open3d-next-staging/Failures.md + global references search for "Failures.md" + "FAILURES" + init master resolved-failures.md + cross-refs-report + identify plannnerplan/other update needs (no edits performed to main Failures.md or any plannnerplan/* files).

## Staging Failures.md Analysis (open3d-next-staging/Failures.md)

Full content read:
```
# Failures / Skips / Follow-ups

- Blocker: `pnpm exec tsc --noEmit` still fails across the frozen Svelte mirror files under `src/lib/stores/`, `src/store/`, and `src/shared/`. The live Next entrypoints compile and the Vitest suite passes, but repo-wide TypeScript is not clean.
- Follow-up: `proof-chair.svg` still 404s in the dev server logs. The browser path works, but the missing asset should be restored if the asset-backed proof view remains part of the app.
- Follow-up: if the dev server is opened from `127.0.0.1`, Next dev reports a websocket origin mismatch; `localhost` is the stable browser target for Playwright checks here.
- Follow-up: `pnpm build` still fails type checking on the legacy Svelte mirror import in `src/lib/stores/project.ts` (`svelte/store` is not available in this Next-only workspace). The donor shell port itself renders and passes the targeted Vitest suite.
```

**Decision (per task instructions):** All 4 items appear to be *current* blockers/follow-ups (not resolved/closed). Per AGENTS.md Scope: `open3d-next-staging/` is a lab/archive mirror — not production. Production code lives in `site/features/planner/open3d/`.

- No items clearly closed.
- **No resolved items extracted/moved.**
- **Staging Failures.md left exactly as-is.** (No append, no note added, no edit performed to it.)
- If coordinator later deems any closed, they may move content to this part-08 or main resolved.

**Rationale:** Task explicitly: "its items look like current blockers/follow-ups (not resolved). Do not move unless clearly closed. Perhaps append a note or leave as-is (report decision)."

Chose: leave as-is (minimum necessary; no edit to staging file).

## Part-08 Contribution to Master

No resolved entries from staging slice. Staging mirror issues (TS on frozen Svelte, asset 404, websocket, build on legacy import) are tracked locally in `open3d-next-staging/Failures.md` and are out of scope for production gates (see AGENTS.md).

See root `resolved-failures.md` skeleton for global merge target.

## PLAN-FAIL / Active Items Discovered (Global View, Agent 8)

During cross-refs search (grep on entire repo):
- Root Failures.md and plannnerplan/FAILURESPLAN.md reference PLAN-FAIL-04xx series (0411 type safety any, 0412 typecheck debt, 0414-0420 Global Standard intensification etc.).
- Stale references in root Failures.md (lines ~377-410) to non-existent `plannnerplan/FAILURES-HISTORY.md` and `plannnerplan/FAILURES-CURRENT.md` (confirmed absent via list_dir + grep; these appear to be pre-2026-07-04 artifacts).
- plannnerplan/FAILURESPLAN.md contains internal "Resolution history" section and notes on pruning resolved (archive-over-delete followed there too).
- No active "resolved-failures.md" file existed prior to this init (grep confirmed 0 prior mentions outside this run).

No terminal commands executed. All via file tools (list_dir, read_file, grep, write for new only).

## Cross-refs Note

Full inventory + proposed fixes in `cross-refs-report.md` (this directory). Coordinator must perform any updates to main Failures.md or plannnerplan/* (explicitly not edited here per instructions).

## AGENTS.md Compliance (Agent 8 slice)

- Re-read AGENTS + Locked ReadmeLocked + Readme + START + testing-handbook first.
- Staging Failures read fully.
- Greps performed for "Failures\.md" (path=null) + "FAILURES".
- Smallest necessary: only created the 3 new files requested (master skeleton, part-08, cross-refs-report). No other files created.
- No edits to main Failures.md or plannnerplan files.
- No terminal / run / test / build commands (none required; policy per START/Failures would block anyway on host issues).
- Archive-over-delete: followed for reorganization (new resolved files, no deletes).
- Evidence: all tool outputs preserved in this context; live checks via read/grep.
- Skips logged here: no edits to staging, no moves, no plannnerplan changes, no main Failures changes, no command runs.
- 8th agent global/cross-cutting role: searched all, init'd master, reported refs for coordinator.

Next sensible: coordinator merges part-01..part-08 into resolved-failures.md; applies reference updates (see cross-refs-report); adds entry to root Failures.md per AGENTS "Log".
