# blocksResolver.test.ts — Additions, Coverage & Review (2026-07-04)

**Context**: Work to increase coverage on `site/features/planner/open3d/catalog/svg/blocksResolver.ts` after initial Phase 02 test. 4 sub-agents (Synth, Error, AliasMountID, Auditor) + follow-up additions performed parallel targeted test growth.

**Files**:
- Implementation: `site/features/planner/open3d/catalog/svg/blocksResolver.ts`
- Tests: `site/tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts`
- This doc: `plannnerplan/benchmarks/blocksResolver-test-additions-2026-07-04.md`

## Condensed Summary / Diff of New Tests

### Original baseline (pre-agents)
- Basic explicit (id/dims, aliases, 3 blocks, unknown fields, resolveBlockRows wrapper, simple priority, basic clamps)
- Basic synth (no blocks, variant, oversize clamp, empty [], non-array, primary mount, invalid mount)
- Basic error (malformed -> [], assert noBlocks, invalidShape width=0/neg/missing, sole kinds, default block-N ids)
- ~20 its total

### Added by 4 sub-agents (condensed list of new `it()` titles)
**Explicit path (AliasMountID + Auditor focus on aliases, mounting, placeInside, non-zero vb)**
- "width priority: width > widthMm (primary first; alias only when primary <=0)"
- "depth priority combos: depth > height > depthMm > heightMm (firstPositive)"
- "normaliseMounting accepts wall and ceiling planes with full offsets"
- "normaliseMounting supplies zero offset when offset key missing or partial"
- "normaliseMounting returns undefined for invalid plane or non-object mounting"
- "explicit blocks + viewBox with non-zero origin: placeInside uses width/height for clamp, origin echoed, boundaries exact"
- "resolveBlockRows on empty (all-malformed explicit) returns [] — exercises full public resolveBlockRows surface on empty path"

**Synthesised path (Synth + AliasMountID + Auditor: ~12 new)**
- "synthesised block has undefined mounting when descriptor mounting key is absent (vs present)"
- "synthesised uses first mounting plane when descriptor lists multiple"
- "resolveBlockRows on descriptor without blocks returns the single synthesised row"
- "synthesised block anchors x/y at relative 0 even for viewBox with non-zero origin"
- "synthesised row clamps zero geometry (widthMm/depthMm=0) while viewBox positive"
- "synthesised row clamps negative geometry values (via clampPositive) to zero-dim block"
- "synthesised row produces zero-dim block when viewBox width/height zero despite positive geometry"
- "synthesised uses geometry dims when strictly smaller than viewBox (no min clamp)"
- "synthesised clamps non-finite geometry (Infinity/NaN) to zero"
- "synthesised via freezeFreshDescriptor + resolveBlockRows yields anchored synth row (different viewBox origin)"
- "synthesised mounting covers ceiling explicitly via descriptor array"

**Error paths (ErrorAgent + Auditor: index accuracy, combos, kinds)**
- "assertResolvedNonEmpty throws BlockResolverError('noBlocks') when called on empty result from resolveBlocks..."
- "assertResolvedNonEmpty on hand-crafted empty (synthesised-empty result shape) yields noBlocks with default empty fieldPath"
- "width=0 combined with negative depth in same block throws invalidShape (combination case) with fieldPath for index 0"
- "multiple bad blocks: reports first bad block index (blocks.0) even when later blocks are also invalid"
- "invalidShape fieldPath accurate at index 2 (and higher)"
- "edge: all blocks malformed in different non-positive ways throws invalidShape on the first..."
- "only the expected kinds (noBlocks via assert, invalidShape via resolve) are ever thrown; no other kinds surface"

**Default ID (AliasMountID + Auditor)**
- "mixed explicit + omitted ids in larger (5-entry) array assigns sequential defaults only to omitted slots"
- "empty string id + whitespace-only id: only empty falls back; whitespace (length>0) is kept verbatim"
- "non-string ids of different types all fall back to default (number, object, boolean, null, array, undefined)"
- "resolveBlockRows on mixed-id explicit input returns correct defaulted ids (covers resolveBlockRows + default logic)"

**Also added by Auditor**
- Coverage smoke note at EOF documenting exercised public surface + every internal helper/branch.

**Follow-up additions (this session — more placeInside + mounting)**
- "placeInside with viewBox width/height = 0 clamps everything to 0"
- "placeInside keeps exact boundary value and clamps large positive"
- "placeInside treats non-finite input as 0 (via numberOrZero upstream)"
- "synthesised pickPrimaryMounting returns undefined when first entry in mounting array fails plane parse"
- "normaliseMounting keeps negative numeric offsets but coerces non-numbers to 0"

**Rough count**: + ~30 new `it()` blocks focused on previously thin branches (priority order, mounting variants, placeInside clamps on explicit path, synth zero/neg/nonfinite/offset-origin, precise error fieldPath + multi-bad, ID whitespace/non-string/mixed arrays, resolveBlockRows on edge shapes).

No `any`, no bypasses, full use of existing fixtures (`parseFresh*`, `attachBlocks`, `freezeFreshDescriptor`, `resolveBlockRows`).

## Current Coverage Status (Static + Agent Mapping)

See the CSV-style tables in prior chat turns. After all additions:

- All public exports exercised (resolveBlocks, resolveBlockRows, assertResolvedNonEmpty, BlockResolverError + kinds, interfaces).
- All internal helpers/branches hit:
  - normaliseExplicitBlock (guards, firstPositive all orders, id logic, normaliseMounting full, placeInside full, clamp)
  - synthesisedBlockFromGeometry + Math.min + clamp + pickPrimaryMounting (absent, multi, bad first)
  - numberOrZero, firstPositive, clampPositive, placeInside, normaliseMounting
- Error kinds with accurate fieldPath and index reporting.
- ViewBox non-zero origin on both paths.
- resolveBlockRows(empty + non-empty).

Estimated: **near 100%** statements/branches for this small module.

Remaining theoretical thin spots (for real v8 report):
- Extremely rare non-finite after upstream guards.
- ViewBox with negative dimensions (schema prevents in real use).

## Skill Prompts for Coverage Review

### Prompt for `review` skill (or reviewer sub-agent)
```
Run a strict coverage + code review subagent pass on these two files only:

- Implementation: site/features/planner/open3d/catalog/svg/blocksResolver.ts (full source)
- Tests: site/tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts (current state)

Tasks:
1. Enumerate EVERY public export and internal helper function/branch (resolveBlocks paths, normaliseExplicitBlock, synthesisedBlockFromGeometry, pickPrimaryMounting, normaliseMounting, numberOrZero, firstPositive, clampPositive, placeInside, assertResolvedNonEmpty, error kinds).
2. For each, map exactly which test(s) cover which branches (reference the added tests by title).
3. Identify any remaining uncovered lines or low-coverage branches. Output as CSV table:
   file,line,code_snippet,branch,tests_covering,status,notes
4. Confirm: zero `any`/`as any`, no @ts-*, type safety (only fixture-boundary casts), style match to existing tests, use of fixtures.
5. Check that resolveBlockRows and assert are exercised on empty + success paths.
6. Suggest 2-3 highest-value additional cases if any real gaps remain.
7. End with overall % estimate and "ready for real `test:coverage` run" verdict.

Use live file reads. Be evidence-first. Output CSV + bullet summary. Do not run tests yourself unless using proper evidence wrapper.
```

### Prompt for `check-work` / `verification-before-completion`
```
Use check-work / verification-before-completion on the recent changes to blocksResolver.test.ts.

Focus areas:
- Did the new tests (the ~30+ added in this pass) meaningfully increase coverage of blocksResolver.ts?
- Run or simulate the specific test + planner coverage. Capture artifacts under results/ per handbook.
- Produce or analyze the CSV from results/coverage-reports/planner/coverage-report.csv filtered to blocksResolver.
- List skipped/uncovered lines in CSV.
- Verify no `any`, no unused vars introduced, no test bypasses.
- Confirm all new tests pass and the smoke note at bottom of test file is accurate.
- Final verdict before claiming "coverage improved".
```

### For `review` with global standard angle
Add: "Score against Global Standard (anti-copy not relevant here; focus on test quality, boundary coverage, evidence of exhaustive paths per DESIGN-BENCHMARK-PROTOCOL and QUALITY-GATES)."

## Additional Cases Added (this pass)

See the code inserted in the test file (search_replace). Rationale:

**placeInside (explicit only)**:
- viewBox 0: Math path + clamp to 0 on both axes.
- exact boundary + large positive: == kept, > clamped (complements existing).
- non-finite (NaN/Inf): shows upstream numberOrZero + placeInside finite guard.

**Mounting / pickPrimary**:
- Bad-first array for synth pickPrimaryMounting (parse on [0] fails → undef even if later valid).
- Negative offsets kept as-is (code does `typeof number ? val : 0`).
- Non-number (string) offset coerced to 0.

These hit remaining edges in `placeInside`, `normaliseMounting`, `pickPrimaryMounting`.

## How to Verify / Generate Real Coverage

```powershell
# Targeted
pnpm --filter oando-site exec vitest run "tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts"

# Full evidence + reports (CSV will be generated)
./scripts/run-evidence-cmd.ps1 -Name "blocksResolver-final" -Module "site" -Phase "additions-$(Get-Date -Format 'yyyyMMdd-HHmmss')" `
  -Command 'pnpm --filter oando-site run test:coverage' -Cwd .

# Inspect
Import-Csv results/coverage-reports/planner/coverage-report.csv | Where-Object file -like '*blocksResolver*' | Format-Table
```

After real run, update this MD with actual skipped lines % from the CSV.

## Next Steps
- Run the evidence commands above.
- Invoke the skill prompts above via review / check-work.
- If gaps remain in the real v8 report, add targeted cases here.
- Cross-link in IMPLEMENTATION-DECISIONS.md / HANDOVER if this closes a coverage item for Phase 02.

All work follows AGENTS.md (minimum necessary, type safety, evidence mindset, re-read docs before edits).
