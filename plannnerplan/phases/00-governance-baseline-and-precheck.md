---
Title: "Phase 00 — Governance baseline & precheck"
Owner: Lead
Status: Planned
Created: 2026-07-04
Phase: 00
Depends on: —
Delivers to: Phase 01
---

# Phase 00 — Governance baseline & precheck

## Goal

Lock the governance baseline **before any code is written or installed**. This phase outputs a *machine-verifiable* baseline that Phase 01 (engine install) and subsequent phases build on, so any drift in governance is caught at the door instead of later when it's expensive to reverse.

This is the notional "Phase 00" referenced in execution plans. There is intentionally no equivalent in the legacy 6–10 numbering; this phase slots ahead of `01-engine-lock-and-workspace-bootstrap`.

## Scope

In scope:

1. Verify the 5 governance markdown files are present and untouched.
2. Verify `pnpm-lock.yaml` is committed and not regenerable from spec drift.
3. Verify forbidden patterns are absent from the working tree (`any`, `@ts-ignore`, `@ts-nocheck`, ESLint `disable` directives, pnpm `--no-frozen-lockfile` traces, Mantine imports, competitor trade-dress assets).
4. Verify R2 bucket `site-block-thumbs/` authority is recorded in `IMPLEMENTATION-DECISIONS.md`.
5. Verify `pnpm-workspace.yaml` and `turbo.json` reflect the locked package set.
6. Produce `benchmarks/phase-00-precheck.md` with exit-summary table.
7. Move `plannnerplan/` from git `D` (deleted in working tree, present in `HEAD`) to clean on `main`.
8. Commit the new plan package as a separate commit before Phase 01 starts.

Out of scope:

- Any `package.json` change, lockfile mutation, or `pnpm install`.
- Any `pnpm-workspace.yaml` member change.
- Any feature code, route, or admin/portal UI work.
- Phase 01 work (workspace dir, `pnpm install`, engine lockfile pin).

## Forbidden / Allowed

- Forbidden: `pnpm install`, `pnpm add`, `pnpm remove`, mutating `pnpm-lock.yaml`.
- Forbidden: editing `package.json`, `turbo.json`, `pnpm-workspace.yaml`, `.npmrc`.
- Allowed: read-only inspection, `git diff`, `git ls-files`, `grep`, `wc`, `dir`, `robocopy`, `cmd /c rmdir` for replacing `plannnerplan/`.
- Allowed: writing `benchmarks/phase-00-precheck.md` and a single commit carrying the new plan package.

## Deliverables

| # | Deliverable | Path | Status |
| - | ----------- | ---- | ------ |
| 1 | 5 governance files verified present | `plannnerplan/IMPLEMENTATION-DECISIONS.md`, `QUALITY-GATES.md`, `DESIGN-BENCHMARK-PROTOCOL.md`, `FAILURESPLAN.md`, `HANDOVER.md` | Planned |
| 2 | Lockfile static check | reported in `benchmarks/phase-00-precheck.md` | Planned |
| 3 | Forbidden-pattern static check | reported in `benchmarks/phase-00-precheck.md` | Planned |
| 4 | R2 bucket authority check (single owner=`IMPLEMENTATION-DECISIONS.md`) | reported in `benchmarks/phase-00-precheck.md` | Planned |
| 5 | Workspace + turbo alignment check | reported in `benchmarks/phase-00-precheck.md` | Planned |
| 6 | Precheck evidence file | `plannnerplan/benchmarks/phase-00-precheck.md` | Planned |
| 7 | Old plans removed | `plannnerplan/` no longer contains legacy 6–9 files; clean on `main` | Planned |
| 8 | New plan package committed (single commit before Phase 01) | one commit on `main` before Phase 01 worktree | Planned |

## Tests / Evidence Gates

- **§00-PRE-01** `pnpm-lock.yaml` is present, working-tree-mtime matches committed SHA, and is not in a dirty state (`git status` clean for that path). Score: pass/fail.
- **§00-PRE-02** Forbidden-pattern grep returns 0 hits across `site/`, `open3d-floorplan/`, `open3d-next-staging/`, `scripts/`, `docs/` for: `\bany\b` in `: any`/`as any`/`Record<string, any>` positions inside TS; `@ts-ignore`; `@ts-nocheck`; `eslint-disable`; `--no-frozen-lockfile`; `from 'mantine'`; competitor trade-dress strings. Score: hit count.
- **§00-PRE-03** R2 bucket string `'site-block-thumbs/'` appears in `IMPLEMENTATION-DECISIONS.md` exactly once and is absent from phase files (verified via `grep -l`). Score: pass/fail.
- **§00-PRE-04** All 10 new phase files exist under `plannnerplan/phases/` (00..10 mapped verbatim), and all 5 governance files exist at `plannnerplan/` root. Score: pass/fail.
- **§00-PRE-05** `pnpm-workspace.yaml` and `turbo.json` parses to valid YAML/JSON and enumerates a non-empty member-set. Score: pass/fail.
- **§00-PRE-06** Working tree shows `D … plannnerplan/` entries in unstaged (or staged) state — confirming deletion of legacy plans — and new package is staged/untracked; one commit lands the new package on `main`. Score: pass/fail.

Score table appended to `benchmarks/phase-00-precheck.md`. Phase 01 cannot begin until §00-PRE-01..§00-PRE-06 all pass.

## Rollback criteria

If §00-PRE-02 surfaces a forbidden pattern, do not proceed: log the path + line + pattern, add a `FAILURESPLAN` entry `FP-00XX` with status `Deferred/blocked`, and exit the phase with `Status: Deferred/blocked`.

If §00-PRE-03 surfaces scattered R2 bucket authority (the `'site-block-thumbs/'` string appearing in more than one markdown file or in any TS), exit and require a follow-up edit pass that consolidates authority before any Phase 01+ work.

If §00-PRE-06 surfaces a dirty working tree beyond the planned delete+copy, refuse to commit using `-a`; require explicit `git add plannnerplan/`.

## Decision Log

- D00-1 (Locked): `Phase 00` is treated as a *governance precheck* phase, **not** an implementation phase. It is the only phase that does not write runnable code.
- D00-2 (Locked): A single commit on `main` carries the new plan package; Phase 01 onward uses ephemeral worktrees branched off that commit.
- D00-3 (Locked): Phase 00 evidence file is `plannnerplan/benchmarks/phase-00-precheck.md` (parallel to `execution-2026-07-04.md`).
