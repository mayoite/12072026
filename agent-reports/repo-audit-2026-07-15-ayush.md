# Repo Audit - 2026-07-15

## Scope

Read-only audit of the repository at `E:\12072026`, excluding `PROTECTED/`.

## Commands run

- `git status --short`
- `pnpm run check:layout`
- `pnpm run check:agents-md`
- `pnpm run check:agents-folder`
- `pnpm run check:active-docs`
- `pnpm run check:plans-purity`
- `pnpm run check:docs-purity`
- `pnpm run check:failures` (re-run; current pass)
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run tech-docs:check`
- `pnpm run tech-docs:typecheck`

Not completed:

- `pnpm run test` was attempted, but the tool session timed out after 300 seconds before the suite finished.

## Findings

### High: `site/` does not pass baseline lint or typecheck

This is the main repo health problem.

- `pnpm run lint` failed with `121 problems (109 errors, 12 warnings)`.
- `pnpm run typecheck` failed immediately in the active Admin/SVG-editor refactor area.

Concrete breakage:

- `site/features/admin/catalog/AdminCatalogManager.tsx:10-17` imports `./adminCatalogClient`, but the live file is `site/features/admin/api/adminCatalogClient.ts`.
- `site/features/admin/workstation/WorkstationFamilyAuthorFields.tsx:3-9` imports `../AdminFormFields`, but the live file is `site/features/admin/ui/AdminFormFields.tsx`.
- `site/features/admin/svg-editor/storage/drizzleSvgPersistence.server.ts:10-13` imports `../svgRevisionRepository.server`; `pnpm run typecheck` still reports that repository module unresolved from multiple callers, so the refactor is not in a type-safe state.
- `site/tests/unit/features/planner/cloud-store/index.test.ts:37` and `site/tests/unit/features/planner/lib/snapManager.test.ts:6` contain broken `` `n `` text inside assertions, which causes parser failure.
- `site/features/admin/svg-editor/editor/ExcalidrawClient.tsx:67,86,97-98` calls `Date.now()` inside `useMemo`, which currently fails React purity lint.
- `site/features/admin/svg-editor/editor/DimensionLabels.tsx:167-170` and `site/features/admin/svg-editor/views/AdminSvgEditorListView.tsx:202-207` synchronously call state setters from effects and currently fail the React Hooks lint rules.

Impact:

- The current workspace is not releasable.
- No meaningful higher-confidence browser or integration claim should be made until the refactor compiles cleanly again.

### High: `tech-docs-generator/` is out of sync with `generated-documents/` and does not typecheck

- `pnpm run tech-docs:check` failed in `tech-docs-generator/scripts/check.mjs:95-104`.
- The generator reports canonical drift in `generated-documents/`, including the manifest, `data/security.json`, `data/index.json`, `data/search.json`, `data/dependencies.json`, `data/api.json`, `_accuracy.json`, `data/pages.json`, and many more files.
- `pnpm run tech-docs:typecheck` failed in `tech-docs-generator/scripts/vite-plugin-repo-live.ts:19-25` because `server.ws.send(...)` no longer matches the Vite type overload being used.

Impact:

- The repo's generated docs surface is not trustworthy as a committed source of truth right now.
- The tech-docs workspace is also not in a shippable state.

### Medium: repo governance checks fail on plan purity

- `pnpm run check:plans-purity` failed.
- `plan/svgblunder/` exists even though `scripts/check-plans-purity.mjs` only allows `Admin`, `Planner`, `Site`, `Security`, and `Phase-2`.
- `plan/Site/CHECKLIST.md` contains checked boxes even though the repo rule says checklist files are status-only and the validator rejects `[x]`.

Concrete lines:

- `plan/Site/CHECKLIST.md:16-21`
- `plan/Site/CHECKLIST.md:33-34`
- `plan/Site/CHECKLIST.md:49`

Impact:

- The repo's own execution-state contract is broken.
- Automated plan hygiene currently fails before product code quality is even considered.

## Checks that passed

- `pnpm run check:layout`
- `pnpm run check:agents-md`
- `pnpm run check:agents-folder`
- `pnpm run check:active-docs`
- `pnpm run check:docs-purity`
- `pnpm run check:failures`

Note: an earlier `check:failures` run returned stale failure text, but a direct re-run on 2026-07-15 passed against the current `Failures.md`.

## Worktree context

`git status --short` shows a heavily dirty workspace:

- 36 modified
- 8 deleted
- 13 untracked

Most churn is concentrated in the Admin and SVG-editor refactor. This audit reflects that live in-progress state, not a clean branch.

## Recommended next moves

1. Restore a green `site/` baseline first: fix moved import paths, unresolved module references, and the syntactically broken planner tests.
2. Clean the SVG-editor/editor lint regressions before attempting broader test or release gates.
3. Decide whether `plan/svgblunder/` is real active plan data. If yes, update the repo policy and validator together. If no, remove or relocate it.
4. Regenerate and reconcile `generated-documents/`, then fix `tech-docs-generator/scripts/vite-plugin-repo-live.ts`.
