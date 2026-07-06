# CONSOLIDATED (see resolved-failures.md)

This part file was an intermediate slice from agent 1/8 during 8-agent parallel dispatch.
Content merged into resolved-failures.md on 2026-07-04.
Safe to delete this file.

Original moved sections are in the main resolved-failures.md under ## 2026-07-04.

### Phase 0–2 quality remediation (partial)

- Scope: Phase 0 complete (WorkspaceShell dead hook removed, `platform/supabase/adminServer.ts`, `GET /api/admin/themes`, ThemeEditor API-only). Phase 1 complete (platform owns Supabase server/client/env; lib re-exports deprecated; `adminDb` replaces `drizzle/db`; rateLimit uses `createAdminServiceClient`). Phase 2 partial (`lib/tracking/userHistoryRepository.ts`; tracking/recommendations/ai-advisor deduped).
- Verified: code changes applied only.
- Skipped: typecheck, vitest, git commit (shell broken: `hostfxr.dll` HRESULT 0x80070005). Phases 2a envelopes, 3–6 not started (Drizzle schemas/migrations, archive aliases, PlannerProjectPort, gates).

### Planner route naming correction

- Scope: planner route/docs truth for `site/features/planner/open3d/` versus `site/features/planner/_archive/fabric/`.
- Root cause: repo comments and READMEs described the live `/planner/guest` and `/planner/canvas` stack as "native Open3D", while the actual implementation is a hybrid route: Fabric-backed 2-D canvas inside the `open3d/` tree plus Three/r3f 3-D view.
- Correction: updated route comments and planner READMEs to distinguish the live hybrid planner from the legacy top-level Fabric fallback routes under `/planner/fabric/*`.
- Verified: documentation/comments now align with the live host chain in `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx`, `site/features/planner/open3d/ui/Open3dNativeHost.tsx`, and `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`.
- Skipped: runtime route swap, typecheck, build, Playwright, and broader planner UI validation.

### Phase 04 admin SVG persistence restore

- Scope: `site/features/planner/admin/svg-editor/persistBlockDescriptor.ts` and focused admin/catalog SVG tests.
- Root cause: the writer rejected explicit temp-directory overrides and exposed a `listBlockDescriptors` signature mismatch, so the restored admin persistence tests never reached the atomic-write path.
- Correction: allow explicit override directories for isolated test writes and accept the loader options shape in `listBlockDescriptors`.
- Verified: `pnpm --dir site exec vitest run tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts tests/unit/features/planner/open3d/catalog/blockDescriptor.test.ts tests/unit/features/planner/open3d/catalog/blockDescriptorLoader.test.ts tests/unit/admin/svg-editor/persistBlockDescriptor.test.ts tests/unit/admin/svg-editor/puckBlockRegistry.test.ts tests/unit/admin/svg-editor/svgPipelineRunner.test.ts` exit 0; 6 files, 116 tests passed.
- Skipped: typecheck, build, Playwright, and broader planner suites outside the restored admin/catalog SVG slice.

### Phase 03 generator restore smoke

- Scope: `site/scripts/generate-svg.mjs` and `site/package.json` wiring.
- Verified: `pnpm --filter oando-site run scripts:generate-svg` reaches the CLI usage path through `tsx` and loads the restored script without a runtime import failure.
- Skipped: fixture-driven execution (`--fixture chaise|side-table|sectional|missing-geometry`) to avoid writing generated SVG outputs outside the owned restore slice.

### Phase 03 asset restore

- Scope: restore the Phase 03 generate-svg fixture/golden baseline only.
- Verified: restored `site/scripts/generate-svg/_fixtures/{chaise,side-table,sectional,missing-geometry}.json`, `site/scripts/generate-svg/__goldens__/{chaise,side-table,sectional}-golden.svg`, and `site/public/svg-catalog/{chaise-lounge-001,side-table-001,sectional-sofa-001,missing-geom-fallback-001}.svg`.
- Skipped: generator execution, tests, lint, typecheck, build, Playwright, and any non-asset files outside the owned Phase 03 asset set.

### Phase 03 sanitizer test harness

- Scope: dedicated sanitizer coverage file under `site/scripts/generate-svg/`.
- Verified: `pnpm --dir site exec node --import tsx --test scripts/generate-svg/sanitize.test.mjs` exit 0.
- Skipped: `npm run test -- site/scripts/generate-svg/sanitize.test.mjs` because the repo Vitest config excludes `scripts/**`; the direct Node test harness was the reliable path for this owned file.

### Native Open3D not deployable — live routes restored to Fabric

- Scope: `/planner/guest`, `/planner/canvas` briefly wired to native `Open3dPlannerWorkspaceRoute` (2026-07-04).
- Decision: Operator confirmed active native pilot is **not deployable**; months of work on Open3D path remains pilot-only until external Phase 05 gates pass (browser workflow, benchmark audit, coverage floor, member/guest persistence).
- Correction: restored live guest/canvas to `PlannerWorkspaceRoute` (Fabric). Native stack unchanged at `/planner/open3d` and `site/features/planner/open3d/`.
- Verified: route + import-graph tests updated; typecheck pending this slice.
- Skipped: claiming native production-ready; deploy promotion; Fabric retirement.

### Native guest autosave (IndexedDB) — 2026-07-04 continued

- Scope: `open3dSession.ts`, `useOpen3dWorkspaceAutosave.ts`, `OOPlannerWorkspace` hydration gate + `replaceProject`.
- Verified: `pnpm --filter oando-site run typecheck` exit 0; `vitest run tests/unit/features/planner/open3d` — 34 files, 1001 tests exit 0.
- Skipped: external browser audit (browse MCP ENOENT on this host); IndexedDB round-trip manual proof; live route swap.
