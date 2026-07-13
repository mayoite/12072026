# Tech Docs Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use `test-driven-development` for every behavior change and `verification-before-completion` before claiming completion. Execute from the root checkout. Do not create a worktree, commit, or push.

**Goal:** Rename and upgrade the existing Vite documentation generator into a live repository-intelligence app whose deterministic outputs live only under `generated-documents/`.

**Architecture:** `tech-docs-generator/` remains the handwritten Vite source package and continues consuming the shared CSS contract from `site/app/css/`. Its extractors create source-backed data and Markdown under `generated-documents/data/` and `generated-documents/docs/`; Vite builds into staging and publishes the deployable app transactionally to `generated-documents/site/`. Development mode watches explicit allowed repository roots, regenerates through one serialized coordinator, and reloads the Vite client without scanning reference, private, generated, result, dependency, or build roots.

**Tech Stack:** Node.js 24, pnpm workspace, Vite 6, React 19, TypeScript 6, Vitest, Testing Library, ts-morph, Fuse.js, Mermaid, Framer Motion, and `@xyflow/react` for the interactive graph.

---

## Non-negotiable contracts

- Source package: `tech-docs-generator/`.
- Package name: `oando-tech-docs`.
- Generated root: `generated-documents/`.
- Renderer data: `generated-documents/data/`.
- Generated Markdown/JSON: `generated-documents/docs/`.
- Deployable Vite build: `generated-documents/site/`.
- Vite base: `./`; the app uses `HashRouter` so deep links work without host rewrite rules.
- Shared CSS remains sourced from `site/app/css/` through one generator stylesheet.
- Generated facts must retain source path, source pointer, and source hash.
- The UI must not invent scores, coverage, ownership, freshness, or status.
- Tests and generation must not read or write `archive/`, `websites/`, `.archive/`, `.websites/`, or `PROTECTED/`.
- Focused tests and checks use temporary roots and never mutate canonical generated output.
- Every generator test lives under `tech-docs-generator/tests/`; do not create generator tests in root `tests/`, `site/tests/`, or another package.
- The generator uses the workspace root's hoisted `node_modules/`; never create `tech-docs-generator/node_modules/`, a nested lockfile, or a separate installation.
- A generator failure blocks only its dependent generator task or tech-docs CI job. It does not block unrelated Site, Admin, Planner, or Security work.
- Only explicit `generate`, `build`, and live-development commands may publish generated output.
- Data, docs, and site publication must stage, validate, and swap; a failed run preserves the last valid output.

## File map

### Rename and modify

- Rename `tech-stack-generator/` to `tech-docs-generator/`.
- Modify root `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `.gitignore`, `.secretlintrc.json`, `AGENTS.md`, `Readme.md`, and `START.md`.
- Modify `.github/workflows/tech-stack-docs.yml` and `scripts/check-repo-layout.mjs`.
- Modify generator `package.json`, `vite.config.ts`, `vitest.config.ts`, `src/App.tsx`, `src/index.css`, `src/data/navigation.ts`, `scripts/filesystem.mjs`, `scripts/model.mjs`, `scripts/generate.mjs`, `scripts/emit-renderer-data.mjs`, `scripts/renderer-data.mjs`, `scripts/check.mjs`, and `scripts/gate.mjs`.

### Create

- `tech-docs-generator/src/styles/index.css` — the single CSS entrypoint importing approved shared site CSS.
- `tech-docs-generator/scripts/output-contract.mjs` — canonical source/output names and excluded roots.
- `tech-docs-generator/scripts/output-contract.d.mts` — TypeScript declarations for Vite/tests importing the Node contract.
- `tech-docs-generator/scripts/publish-generated-tree.mjs` — marker validation and rollback-safe staged publication.
- `tech-docs-generator/scripts/generate-all.mjs` — build one model, stage docs/data, validate parity, and optionally publish.
- `tech-docs-generator/scripts/publish-all.mjs` — coordinated docs/data/site swap with rollback.
- `tech-docs-generator/scripts/live-regeneration.ts` — typed serialized, debounced regeneration coordinator.
- `tech-docs-generator/scripts/vite-plugin-repo-live.ts` — typed Vite watcher integration.
- `tech-docs-generator/scripts/extract-repo-graph.mjs` — source-backed nodes and edges.
- `tech-docs-generator/scripts/extract-runner-selection.mjs` — Vitest/Playwright runner selection evidence.
- `tech-docs-generator/src/data/repoGraph.ts` — typed generated graph loader.
- `tech-docs-generator/src/hooks/useExplorerState.ts` — URL-backed query/filter/selection state.
- `tech-docs-generator/src/search/search-index.ts` — pure searchable record index.
- `tech-docs-generator/src/workers/search.worker.ts` — off-main-thread Fuse search.
- `tech-docs-generator/src/hooks/useRepositorySearch.ts` — worker lifecycle and fallback.
- `tech-docs-generator/src/components/explorer/ExplorerShell.tsx` — common explorer layout.
- `tech-docs-generator/src/components/explorer/SourceEvidence.tsx` — source path, pointer, and hash display.
- `tech-docs-generator/src/pages/SystemMap.tsx` — architecture relationship explorer.
- `tech-docs-generator/src/pages/Impact.tsx` — inbound/outbound change-impact explorer.
- `tech-docs-generator/src/pages/TestMap.tsx` — production-to-test mapping and verified gaps.
- `tech-docs-generator/tests/generator/publication.test.ts` — transactional publication and rollback.
- `tech-docs-generator/tests/changes-page.test.tsx` — snapshot comparison interactions.
- Focused tests beside the existing generator test suites.

## Task 1: Lock the rename and output contract with isolated failing tests

**Files:**
- Modify: `tech-stack-generator/tests/package.test.ts`
- Create: `tech-stack-generator/tests/generator/output-contract.test.ts`

- [x] Remove `techStack` and generated-JSON imports from `tests/package.test.ts`; package/config tests must read source text only.
- [x] Add source-text expectations for the approved package, workspace, Vite, filesystem, and renderer paths before changing production code:

```ts
expect(workspaceText).toContain('tech-docs-generator')
expect(packageJson.name).toBe('oando-tech-docs')
expect(viteText).toContain("base: './'")
expect(viteText).toContain("'../.tmp/generated-documents/site'")
expect(getDocumentsRoot(repoRoot)).toBe(path.join(repoRoot, 'generated-documents', 'docs'))
expect(rendererText).toContain("'generated-documents', 'data'")
```

- [x] Run `pnpm --filter oando-site-workflow-docs exec vitest run tests/generator/output-contract.test.ts tests/package.test.ts`.
- [x] Verify RED: failures must name the old package/output paths, not syntax or fixture errors.

## Task 2: Perform the atomic package rename

**Files:**
- Rename: `tech-stack-generator/` to `tech-docs-generator/`
- Create: `tech-docs-generator/scripts/output-contract.mjs`
- Create: `tech-docs-generator/scripts/output-contract.d.mts`
- Modify: root workspace/configuration files listed in the file map
- Modify: all live path strings found by `rg -l "tech-stack-generator|tech-stack-generated|tech-stack-docs|\.tech-stack-generated"`

- [x] Move the directory only after Task 1 has produced the expected failures.
- [x] Rename the package to `oando-tech-docs`.
- [x] Create `scripts/output-contract.mjs` plus `scripts/output-contract.d.mts`; make filesystem, renderer, Vite, model, checks, and extractors consume its names and exclusions.
- [x] Point Vite at staging with `base: './'` so the Task 1 contract reaches GREEN; transactional publication is completed in Task 3 before any build runs.
- [x] Replace root scripts with this stable surface:

```json
{
  "tech-docs:dev": "pnpm --filter oando-tech-docs dev",
  "tech-docs:generate": "pnpm --filter oando-tech-docs generate",
  "tech-docs:check": "pnpm --filter oando-tech-docs check",
  "tech-docs:typecheck": "pnpm --filter oando-tech-docs typecheck",
  "tech-docs:test": "pnpm --filter oando-tech-docs test",
  "tech-docs:build": "pnpm --filter oando-tech-docs build",
  "tech-docs:gate": "pnpm --filter oando-tech-docs gate"
}
```

- [x] Inventory references with the safe exclusions from Task 9. Classify each match; change only live package/output contracts, not historical evidence.
- [x] Update workspace, CI, cleanup scripts, layout guards, secretlint paths, generator README, all extractors/checkers, source data imports, tests, user docs, generated facts, and lockfile references in the same change.
- [x] Validate the old generated roots using their markers/manifests. Migrate or remove only generator-owned files. An unknown-file conflict blocks only generator migration; continue unrelated repository work.
- [x] From the root run `pnpm install --lockfile-only --ignore-scripts`; verify only the workspace importer rename and required metadata changed.
- [x] Confirm dependency resolution uses root `node_modules/` and that neither `tech-docs-generator/node_modules/` nor a nested lockfile exists.
- [x] Run `pnpm --filter oando-tech-docs exec vitest run tests/generator/output-contract.test.ts tests/package.test.ts`.
- [x] Verify GREEN.

## Task 3: Enforce source isolation and transactional output

**Files:**
- Modify: `tech-docs-generator/scripts/output-contract.mjs`
- Create: `tech-docs-generator/scripts/publish-generated-tree.mjs`
- Create: `tech-docs-generator/scripts/generate-all.mjs`
- Create: `tech-docs-generator/scripts/publish-all.mjs`
- Modify: `tech-docs-generator/scripts/filesystem.mjs`
- Modify: `tech-docs-generator/scripts/generate.mjs`
- Modify: `tech-docs-generator/scripts/emit-renderer-data.mjs`
- Modify: `tech-docs-generator/vite.config.ts`
- Modify: generator filesystem/generation tests
- Create: `tech-docs-generator/tests/generator/publication.test.ts`

- [ ] First write failing tests through existing `generateDocs` and `emitRendererData` exports for every output surface: unknown-file refusal, failed-copy rollback, successful swap, and byte-identical preservation of the previous valid tree. Extract the publisher only after these tests fail behaviorally.
- [ ] Add a failing source-policy test proving neither dotted nor undotted reference roots can become facts, descriptors, watcher events, inventory inputs, or output targets.
- [ ] Define the contract once:

```js
export const SOURCE_PACKAGE_DIR = 'tech-docs-generator'
export const GENERATED_ROOT_DIR = 'generated-documents'
export const GENERATED_DATA_DIR = 'data'
export const GENERATED_DOCS_DIR = 'docs'
export const GENERATED_SITE_DIR = 'site'
export const EXCLUDED_REPOSITORY_ROOTS = [
  'archive', 'websites', '.archive', '.websites', 'PROTECTED',
  GENERATED_ROOT_DIR, 'results', 'node_modules', '.git', '.next', '.tmp',
]
```

- [ ] Make all path helpers consume these constants. Normalize absolute event paths relative to canonical `repoRoot`; reject paths outside it before checking the first segment.
- [ ] Remove `loadClaimInventory`, archive-backed coverage thresholds, archive inventory writes, and tests asserting archived plan facts. Derive policy only from live configs or emit an explicit unsupported gap.
- [ ] Make `generate-all.mjs` build the model once, stage docs/data, validate parity and manifests, then publish both as one transaction unless `--stage-only` is supplied.
- [ ] Stage `data/`, `docs/`, and `site/` under `.tmp/generated-documents/`. Validate marker, manifest, hashes, declared removals, and unknown files before publication.
- [ ] Make `publish-all.mjs` accept an explicit surface list, rename each selected canonical surface to backup, move staging to canonical, then remove backups. On any error, roll every selected surface back. `generate` selects docs/data; `build` selects docs/data/site.
- [ ] Preserve separate generated-root markers and manifests for `data/`, `docs/`, and `site/`.
- [ ] Change Vite to build into `../.tmp/generated-documents/site`, use `emptyOutDir: true` only for staging, and set `base: './'`. A build publishes all three staged surfaces only after Vite and every manifest validation succeed.
- [ ] Add tests for unknown files inside `data/`, `docs/`, and `site/`, plus an unknown sibling under `generated-documents/`.
- [ ] Run `pnpm --filter oando-tech-docs exec vitest run tests/generator/filesystem.test.ts tests/generator/generation.test.ts tests/generator/publication.test.ts tests/generator/output-contract.test.ts tests/generator/source-policy.test.ts` and verify GREEN.

## Task 4: Make generation and build one reproducible command

**Files:**
- Modify: `tech-docs-generator/package.json`
- Modify: `tech-docs-generator/scripts/check.mjs`
- Modify: `tech-docs-generator/scripts/gate.mjs`
- Modify: `tech-docs-generator/scripts/check-coverage.mjs`
- Modify: `tech-docs-generator/scripts/generate-coverage-report.mjs`
- Modify: `tech-docs-generator/vitest.config.ts`
- Modify: `.github/workflows/tech-stack-docs.yml`
- Modify: relevant package and generation tests

- [ ] Add a failing package test requiring these package scripts:

```json
{
  "dev": "vite",
  "generate": "node scripts/generate-all.mjs",
  "test": "vitest run",
  "test:coverage": "vitest run --coverage",
  "build": "node scripts/generate-all.mjs --stage-only && vite build && node scripts/publish-all.mjs",
  "check": "node scripts/check.mjs",
  "gate": "node scripts/gate.mjs"
}
```

- [ ] Configure Vitest coverage output at root `results/tooling/tech-docs/coverage/`; preserve the existing hardcoding, fake-test, theme-alignment, and 95% coverage checks.
- [ ] Keep `dev` regeneration inside the Vite plugin from Task 5; do not introduce a second watcher process.
- [ ] Make `check` generate all surfaces into a fresh temporary root, validate them, compare hashes/parity with canonical output, and never write canonical output.
- [ ] Make `gate.mjs` run in this order: generate; read-only check; hardcoding audit; fake-test audit; theme alignment; coverage plus `check-coverage.mjs`; typecheck; plain Vitest; build.
- [ ] Remove CI `paths` filters so changes to any allowed extractor input cannot leave deployed intelligence stale.
- [ ] Make CI run `pnpm run tech-docs:gate` and upload `generated-documents/site/` only after the gate passes.
- [ ] Run `pnpm run tech-docs:generate` twice and compare manifest hashes. They must remain identical when source is unchanged.

## Task 5: Add live Vite regeneration without races

**Files:**
- Create: `tech-docs-generator/scripts/live-regeneration.ts`
- Create: `tech-docs-generator/scripts/vite-plugin-repo-live.ts`
- Create: `tech-docs-generator/tests/generator/live-regeneration.test.ts`
- Modify: `tech-docs-generator/vite.config.ts`

- [ ] First add a failing assertion against the existing Vite config requiring a plugin named `oando-repo-live`; verify RED, then add the minimal plugin registration. After that module exists, write failing coordinator tests for initial generation, debounce coalescing, active-run serialization, absolute-path containment, exclusions, and recovery:

```ts
function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  const promise = new Promise<T>((done) => { resolve = done })
  return { promise, resolve }
}

it('debounces a pre-run burst into one run', async () => {
  const runs: string[] = []
  const coordinator = createRegenerationCoordinator(async () => {
    runs.push('run')
    await Promise.resolve()
  })
  coordinator.request(path.join(repoRoot, 'site/app/(site)/page.tsx'))
  coordinator.request(path.join(repoRoot, 'site/app/api/products/route.ts'))
  await coordinator.idle()
  expect(runs).toHaveLength(1)
})

it('queues exactly one follow-up while a run is active', async () => {
  const first = deferred<void>()
  const started = deferred<void>()
  const runs: number[] = []
  const coordinator = createRegenerationCoordinator(async ({ runNumber }) => {
    runs.push(runNumber)
    if (runNumber === 1) {
      started.resolve()
      await first.promise
    }
  })
  coordinator.request(path.join(repoRoot, 'site/package.json'))
  await started.promise
  coordinator.request(path.join(repoRoot, 'package.json'))
  first.resolve()
  await coordinator.idle()
  expect(runs).toEqual([1, 2])
})
```

- [ ] Implement a coordinator with one active run, one dirty flag, a 150 ms debounce, and only the operational `request()`, `idle()`, and `close()` surface.
- [ ] In `configureServer`, call `server.watcher.add()` for explicit allowed roots. Convert every watcher event to a real path relative to `repoRoot`; reject outside-root paths, escaped symlinks, and excluded first segments.
- [ ] Complete one staged generation before declaring the dev server ready. On later allowed changes, stage and transactionally publish docs/data, then send `server.ws.send({ type: 'full-reload' })`.
- [ ] Surface failures in the Vite console and browser overlay. Transactional publication must keep the previous valid output intact.
- [ ] Use a temporary fixture repository for watcher integration. Never modify a canonical source file to test live reload.
- [ ] Run `pnpm --filter oando-tech-docs exec vitest run tests/generator/live-regeneration.test.ts` and verify GREEN.

## Task 6: Generate a truthful repository relationship graph

**Files:**
- Create: `tech-docs-generator/scripts/extract-repo-graph.mjs`
- Create: `tech-docs-generator/scripts/extract-runner-selection.mjs`
- Create: `tech-docs-generator/tests/generator/repo-graph.test.ts`
- Modify: `tech-docs-generator/scripts/model.mjs`
- Modify: `tech-docs-generator/scripts/renderer-data.mjs`
- Modify: `tech-docs-generator/scripts/schema.mjs`

- [ ] First write failing fixture assertions through the existing `buildGeneratorModel()` and renderer payload APIs, requiring graph and runner-selection output. Verify assertion failures, then add the minimal model fields. Add focused extractor cases only after the extractor surface exists.
- [ ] Define graph records with evidence:

```ts
type RepoNode = {
  id: string
  kind: 'file' | 'route' | 'api' | 'feature' | 'package' | 'test' | 'workflow'
  label: string
  sourcePath: string
  sourcePointer: string
  sourceHash: string
  sourceLine?: number
}

type RepoEdge = {
  id: string
  kind: 'imports' | 'owns' | 'tests' | 'invokes' | 'depends-on'
  from: string
  to: string
  sourcePath: string
  sourcePointer: string
  sourceHash: string
  sourceLine?: number
}
```

- [ ] Build import/re-export edges from TypeScript/JavaScript source using ts-morph. Treat Next route files, package manifests, workflow files, and test files as explicit roots.
- [ ] Resolve aliases from the real TypeScript configuration. Record unresolved or computed imports as gaps; never guess their targets.
- [ ] Create route, API, feature, package, test, and workflow nodes only from existing extractor evidence.
- [ ] Extract runner-selection evidence from workspace/package scripts plus Vitest include/exclude and Playwright `testDir`, `testMatch`, and `testIgnore`. Record `selected-by` evidence independently from import edges.
- [ ] Write `repo-graph.json` and `runner-selection.json`; add both to schema, renderer parity, search, and source coverage checks.
- [ ] Label import-backed test relations as `direct-import-link`, runner reachability as `selected-by-runner`, and absence as `no-direct-link` or `not-selected`. Never translate these into “covered” or “untested.”
- [ ] Assert no graph node or source descriptor starts with an excluded root.
- [ ] Run `pnpm --filter oando-tech-docs exec vitest run tests/generator/repo-graph.test.ts tests/generator/schema.test.ts tests/generator/source-policy.test.ts` and verify GREEN.

## Task 7: Replace brochure navigation with repository explorers

**Files:**
- Create the explorer files listed in the file map
- Modify: `tech-docs-generator/src/App.tsx`
- Modify: `tech-docs-generator/src/data/navigation.ts`
- Create: `tech-docs-generator/src/styles/index.css`
- Modify: `tech-docs-generator/src/index.css`
- Create: `tech-docs-generator/tests/system-map.test.tsx`
- Create: `tech-docs-generator/tests/impact-explorer.test.tsx`
- Create: `tech-docs-generator/tests/test-map.test.tsx`
- Create: `tech-docs-generator/tests/search-worker.test.ts`
- Modify: `tech-docs-generator/tests/setup.ts`
- Modify: `tech-docs-generator/src/pages/TechStack.tsx`
- Modify: `tech-docs-generator/src/pages/ApiDesign.tsx`

- [ ] First write failing interaction assertions through the existing App, Tech Stack, API Design, and search surfaces: require hash routing, new navigation entries, URL restoration, Worker construction, dependency filters, and route/API filters. Add component-level graph/impact/test-map cases only after the route components exist.
- [ ] Move the current shared CSS imports into `src/styles/index.css` and change their depth from `../../site/` to `../../../site/`. Import `@xyflow/react/dist/style.css` after the Tailwind/site imports, as required by React Flow. Add a resolution/build test for every imported stylesheet.
- [ ] Replace `BrowserRouter` with `HashRouter`. Test a nested deployment URL and reload of `#/system-map?selected=...` without server rewrite support.
- [ ] Add routes `/system-map`, `/impact`, and `/test-map` while preserving existing factual pages.
- [ ] Keep explorer state in URL parameters:

```ts
type ExplorerState = {
  query: string
  kinds: string[]
  selected: string | null
  direction: 'inbound' | 'outbound' | 'both'
}
```

- [ ] Build the Fuse index in `search-index.ts`; run queries in `search.worker.ts`; use the same pure search function as a fallback when Worker construction fails.
- [ ] Test that changing search/filter/selection updates the hash query and that reloading restores the same view.
- [ ] Add `@xyflow/react` from the root with `pnpm add --filter oando-tech-docs @xyflow/react`; use it for the System Map with an accessible synchronized result list and details panel.
- [ ] Run dependency changes only through the filtered root command; never install from inside `tech-docs-generator/`.
- [ ] Import React Flow's stylesheet after the shared Tailwind CSS, give its parent an explicit responsive height, and add deterministic `ResizeObserver`/layout shims only in `tests/setup.ts`.
- [ ] System Map must filter nodes and edges, expose keyboard-selectable results, and show evidence for the selected item.
- [ ] Impact must traverse only verified graph edges and call the result “structural impact”; unresolved edges remain unknown.
- [ ] Test Map must show direct import links, runner selection, no-direct-link files, and not-selected tests as separate evidence-backed sets. It must not claim coverage unless a real coverage artifact supplies it.
- [ ] Upgrade Tech Stack with importer/category/version filters and source evidence. Upgrade API Design with method/path/relationship filters; auth state is shown only when an extractor supplies direct evidence, otherwise `unknown`.
- [ ] Use reduced-motion media queries and disable graph transition animation when requested.
- [ ] Component tests must use in-memory graph/search fixtures; they must not require or rewrite canonical `generated-documents/`.
- [ ] Run `pnpm --filter oando-tech-docs exec vitest run tests/system-map.test.tsx tests/impact-explorer.test.tsx tests/test-map.test.tsx tests/search-worker.test.ts tests/generated-tables.test.tsx` and verify GREEN.

## Task 8: Add snapshot identity and change comparison

**Files:**
- Create: `tech-docs-generator/scripts/snapshot.mjs`
- Create: `tech-docs-generator/tests/generator/snapshot.test.ts`
- Modify: renderer generation and UI navigation
- Create: `tech-docs-generator/src/pages/Changes.tsx`

- [ ] First write failing assertions through existing model and renderer APIs requiring snapshot identity and `baseline: null`. After the snapshot surface exists, add focused failing cases for identical snapshots, changed node/edge hashes, removal, traversal, absolute paths, forbidden roots, and symlink escape.
- [ ] Derive `snapshotId` from canonical source descriptors and graph content. Do not use wall-clock time in the hash.
- [ ] Accept only a relative baseline filename resolved beneath `generated-documents/baselines/`. Reject absolute paths, traversal, separators in filenames, escaped symlinks, and any path outside the canonical baseline root. Baselines are comparison inputs, never source facts.
- [ ] When no baseline is supplied, report `baseline: null`; never call all current records “added”.
- [ ] Emit added, removed, and changed node/edge IDs with before/after source hashes.
- [ ] Add `/changes` with filters for kind and change type, source evidence, and deep links to explorer selections.
- [ ] Run `pnpm --filter oando-tech-docs exec vitest run tests/generator/snapshot.test.ts tests/changes-page.test.tsx` and verify GREEN.

## Task 9: Remove stale names and enforce the boundary

**Files:**
- Modify: `scripts/check-repo-layout.mjs`
- Modify: generator checks and all live documentation/configuration references

- [ ] Make the layout check fail if `tech-stack-generator/`, `tech-stack-generated/`, `.tech-stack-generated/`, or `tech-stack-docs/` exists after migration.
- [ ] Search live files while excluding generated output and forbidden/reference roots:

```powershell
rg -n --hidden -g '!node_modules/**' -g '!.git/**' -g '!archive/**' -g '!websites/**' -g '!.archive/**' -g '!.websites/**' -g '!PROTECTED/**' -g '!results/**' -g '!generated-documents/**' -g '!plan/Site/TECH-DOCS-GENERATOR.md' 'tech-stack-generator|tech-stack-generated|tech-stack-docs|\.tech-stack-generated' .
```

- [ ] Expected: no matches.
- [ ] Verify root scripts, CI, package filters, ignore rules, layout guards, and user instructions use the new names.

## Task 10: Full verification

- [ ] Run `pnpm run tech-docs:check` — expected exit 0.
- [ ] Run `pnpm run tech-docs:typecheck` — expected exit 0.
- [ ] Run `pnpm run tech-docs:test` — expected exit 0 with no skipped or silent tests.
- [ ] Run `pnpm run tech-docs:build` — expected exit 0 and files under `generated-documents/site/`.
- [ ] Run `pnpm run tech-docs:generate` twice and verify stable manifest and snapshot hashes.
- [ ] Start `pnpm run tech-docs:dev`; use the temporary watcher integration fixture to verify exactly one successful regeneration plus browser refresh without editing canonical source.
- [ ] Verify excluded-root fixtures cause no regeneration and produce no source descriptors.
- [ ] Browser-check desktop and mobile navigation, URL restoration, keyboard traversal, reduced motion, search, System Map, Impact, Test Map, Changes, and source evidence.
- [ ] Run `pnpm run check:layout` — expected exit 0.
- [ ] Run `git diff --check` — expected exit 0.
- [ ] Re-run the stale-name search from Task 9.

## Completion criteria

- The source package and generated root have distinct, unambiguous names.
- One root command starts the live Vite app.
- One root command produces deterministic data, docs, and a deployable site.
- No generated output appears outside `generated-documents/`.
- Shared site CSS remains the styling source without runtime coupling.
- Live regeneration is serialized and excludes forbidden/reference roots.
- Explorer claims are traceable to source evidence.
- The complete focused and full generator verification suite passes freshly.
