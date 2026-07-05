# CONSOLIDATED (see resolved-failures.md)

This part file was an intermediate slice from agent 7/8.
Merged 2026-07-04. Safe to delete.

**Extraction date:** 2026-07-04 (per task domain: end summary + phase logs sections)

**Scope followed (strict):** Only historical resolved "Resolved This Session" + purely completed phase log (AliasMountIDAgent sub-agent log, as it reports completed work per its own "Per AGENTS Done", no open blockers for its test-add scope, and confirmed in plannnerplan/benchmarks/blocksResolver-test-additions-2026-07-04.md). 

**NOT moved (per explicit instruction):** 
- ### Summary (current state; cleaned suggestion prepared separately)
- ### Active Failures (do not move the lists)
- ### Deferred/Blocked (do not move)
- ### Archive Reference
- ### Phase 03/03A Targeted Tests And Coverage (contains "Failure", "Follow-up", "Blocker" language + incomplete coverage notes)
- ### Phase 03A Working Copy Location Open (contains "Blocker", "Follow-up")
- ### Phase 08 Prep — Fallback Retained (contains "Skipped", stray continuation scope with "Failure", "Follow-up")

**What was moved vs kept:** See final report summary. Only qualifying resolved historical chunks extracted here. No other content.

---

### Resolved This Session

The following have been resolved and are documented in `plannnerplan/FAILURES-HISTORY.md`:

- `PLAN-FAIL-001` — Three.js type conflicts → Fixed: explicit type in useAssetLoader.ts
- `PLAN-FAIL-002` — pnpm test blocked → Fixed: @firebase/util policy in pnpm-workspace.yaml
- `PLAN-FAIL-006` — SVG hardcoded colors → Resolved: uses CSS var() references
- `PLAN-FAIL-007` — Height unit naming debt → Resolved: documented with threshold logic
- `PLAN-FAIL-008` — SVG icons currentColor → Resolved: stroke uses "currentColor"
- `PLAN-FAIL-009` — Dimension filter missing → Resolved: added to InventorySearchOptions
- `PLAN-FAIL-010` — Non-null assertions → Resolved: extracted to consts
- `PLAN-FAIL-011` — Unbounded SVG cache → Resolved: LRU at 2000 entries
- `PLAN-FAIL-012` — Search tokenization → Resolved: pre-tokenization on load()
- `PLAN-FAIL-013` — Order-dependent cache key → Resolved: deterministic key builder
- `PLAN-FAIL-014` — Regex per-call → Resolved: not found in staging code

---

### 2026-07-04 AliasMountIDAgent (Sub-agent) — dimension alias, mounting norm, default ID coverage

- Scope: high-signal unit test additions (only) to `site/tests/unit/features/planner/open3d/catalog/blocksResolver.test.ts` for `blocksResolver.ts` internals (normaliseExplicitBlock, firstPositive, numberOrZero, normaliseMounting, synthesised mounting, default ID).
- First actions completed: full read of blocksResolver.ts (target fns) + current test + policy docs (AGENTS/ReadmeLocked/Readme/START/Failures/testing-handbook/TESTING) + subdir list_dir + svgTypes for MountPlane.
- Tests appended (search_replace, fixture style preserved, no `any`, no extra files): 
  - explicit describe: all width vs widthMm priority + full depth/height/depthMm/heightMm firstPositive combos (incl. zero-fallback, alias-only).
  - explicit + synth: mounting (wall/ceiling/floating, missing offset, partial offset x/y, invalid plane/non-obj, num plane).
  - ID describe (at end): larger 5-entry mixed explicit+omitted; empty-string + whitespace-only ids (incl. \t\n); non-string of many types (num/bool/null/arr/obj/undef); resolveBlockRows mixed + defaults.
  - resolveBlockRows exercised on both paths.
- Post-edit verification: grep for all 10+ new it titles; read_file snippets confirm style/indent/fixture usage/anchors match surrounding.
- Skipped (per explicit task + AGENTS "minimum necessary", "run only when ... task requires", "no cmds unless", no test gate requested): no pnpm/vitest/run, no results/<...> artifacts written, no typecheck/build, no source changes, no Failures other edits beyond this log, no broader coverage claims.
- Evidence order (AGENTS Honesty): policies + source + test read first; live grep/read after every edit; no stale docs trusted over file state.
- Blockers logged: none for the edit scope; test execution evidence absent (intentionally, per scope — pre-existing 25/25 + other resolver mentions in Failures remain).
- Per AGENTS Done: matched ask exactly (reads + appends via search_replace + summarize), verified via tools, logged here, report follows.

---

## Exact removal markers (historical only — for coordinator use on Failures.md; do NOT apply blindly)

1. For "### Resolved This Session" chunk (historical resolved list):
   - Start marker (inclusive): `### Resolved This Session`
   - End marker (inclusive of trailing blank lines before next header): the last line of list item for PLAN-FAIL-014, up to but excluding the blank line + `### Active Failures`
   - Exact text block to remove (for archive-over-delete to this part-07):
```
### Resolved This Session

The following have been resolved and are documented in `plannnerplan/FAILURES-HISTORY.md`:

- `PLAN-FAIL-001` — Three.js type conflicts → Fixed: explicit type in useAssetLoader.ts
- `PLAN-FAIL-002` — pnpm test blocked → Fixed: @firebase/util policy in pnpm-workspace.yaml
- `PLAN-FAIL-006` — SVG hardcoded colors → Resolved: uses CSS var() references
- `PLAN-FAIL-007` — Height unit naming debt → Resolved: documented with threshold logic
- `PLAN-FAIL-008` — SVG icons currentColor → Resolved: stroke uses "currentColor"
- `PLAN-FAIL-009` — Dimension filter missing → Resolved: added to InventorySearchOptions
- `PLAN-FAIL-010` — Non-null assertions → Resolved: extracted to consts
- `PLAN-FAIL-011` — Unbounded SVG cache → Resolved: LRU at 2000 entries
- `PLAN-FAIL-012` — Search tokenization → Resolved: pre-tokenization on load()
- `PLAN-FAIL-013` — Order-dependent cache key → Resolved: deterministic key builder
- `PLAN-FAIL-014` — Regex per-call → Resolved: not found in staging code

```

2. For Alias sub-agent log (purely completed historical entry at EOF):
   - Start marker (inclusive): `### 2026-07-04 AliasMountIDAgent (Sub-agent) — dimension alias, mounting norm, default ID coverage`
   - End marker: the final line of the file.
   - Note: this log sits after the Phase 08 section (keep Phase 08 intact). Removing only the Alias header+bullets will leave the file cleanly ending after Phase 08 content.

**Do not remove** any part of Summary, Active, Deferred, Archive, or the three Phase ### sections (they stay in main Failures.md for coordinator fix-in-place / trim).

---

## Evidence used (first, per AGENTS Honesty + task)

- Re-read: AGENTS.md (full), docs/Lockedfiles/ReadmeLocked.md, Readme.md, START.md, testing-handbook.md.
- Full end of Failures.md: offset ~370 limit 100+ (multiple reads), offset 460 (end).
- Greps: for section headers, "Active Failures|Resolved This Session|Deferred/Blocked|Summary", PLAN-FAIL-00x, phase/Alias refs (multiple).
- Cross-evidence (no cmds beyond necessary file tools; terminal avoided post hostfxr note): 
  - list_dir plannnerplan/ + results/planner/
  - read plannnerplan/FAILURESPLAN.md (shows old 001-014 superseded; 015-018 noted Resolved in "Resolution history"; current actives are 04xx; no FAILURES-HISTORY.md or FAILURES-CURRENT.md exist).
  - read plannnerplan/phases/03-*.md and 08-*.md (Status: Planned; historical Failures logs predate).
  - read plannnerplan/benchmarks/blocksResolver-test-additions-2026-07-04.md (confirms AliasMountID work completed + listed).
  - grep cross for remaining gaps cited in Phase 03/03A log (e.g. placementAction etc) — current state in FAILURESPLAN/phase files shows partial advances but not "pure completion" of those old logs.
- No modification of Failures.md (verified; only new files written).
- No extra files, no scope creep.

**Skips:** 
- Did not move Phase logs (not purely completed).
- Did not move/ alter Active/Deferred/Summary/Archive in source.
- No terminal cmds for tests/build (per hostfxr known blocker in Failures + AGENTS "run only when policy allows and the task requires"; file reads/greps/list sufficient for "evidence first" + resolution classification here).
- Did not create docs/*.md (only the two required by task).
- No assumption on non-listed sections.

**Confidence:** High on extraction fidelity (exact quotes from reads); medium on "purely completed" classification for Alias (matches task example phrasing + self-report + benchmark doc) — phase logs clearly have unresolved language inside so kept.

**AGENTS.md followed:** Re-read on task; conduct only per overrides; minimum necessary (only qualifying chunks + 2 files); evidence first + live checks (reads/greps before decisions); honesty (skips declared, uncertainty on non-existents stated); no mod to Failures; report will include full quotes + what/why; scope strict to assigned domain list.

Part-07 file + suggestion file written. See active-failures-suggestion.md for proposed current-state clean.
