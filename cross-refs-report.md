# Cross-Refs Report — Failures.md References (Agent 8 / Global View)

**Date:** 2026-07-04  
**Agent Role:** 8/8 — cross-cutting + staging + master skeleton init (disjoint scope)  
**Method:** grep pattern "Failures\.md" (path null, repeated with/without glob *.md), grep "FAILURES", list_dir on root + plannnerplan + open3d-next-staging, full reads of key files. No terminal commands.  
**Purpose:** Identify all references for the split to resolved-failures*.md . Report what needs update (coordinator performs edits to main Failures.md and plannnerplan files per strict instructions).  
**Policy:** Archive-over-delete followed. No edits performed to root Failures.md or any plannnerplan/* .

## Complete List of References to "Failures.md" (or direct links)

Compiled from full grep results (md files + code; generated artifacts noted but ignored for updates). Format: `file:line — context snippet`

### Root Governance / Conduct Docs
- `AGENTS.md:26` — "- Before ship-ready claims or heavy test gates: read gate policy in `Failures.md`."
- `AGENTS.md:66` — "- **Log** — blockers and skips in `Failures.md`."
- `docs/Lockedfiles/ReadmeLocked.md:14` — "- **Gate policy, blockers, skips** — `Failures.md`"
- `docs/Lockedfiles/ReadmeLocked.md:28` — "- `Failures.md` — gate policy and blockers"
- `docs/Lockedfiles/AgentsLocked.md:28` — "- Before ship-ready claims or heavy test gates: read gate policy in `Failures.md`."
- `docs/Lockedfiles/AgentsLocked.md:65` — "- **Log** — blockers and skips in `Failures.md`."
- `Readme.md: (via Locked)` — indirect routing
- `START.md:3` — "**Open when running commands** · ... · gate policy `Failures.md`"
- `START.md:83` — "Read `Failures.md` gate policy first (`AGENTS.md` → Gates). Needs browser + env."
- `START.md:104` — "Read `Failures.md` gate policy first (`AGENTS.md` → Gates)."
- `START.md:165` — "`Readme.md` · `TESTING.md` · `Failures.md` · `OPERATIONS_RUNBOOK.md` · `.env.example`"
- `TESTING.md:6` — "**Open for test paths and layout** · ... · gate policy `Failures.md`"
- `TESTING.md:8` — "Playwright and `release:gate` → `AGENTS.md` (Gates) + `Failures.md`."
- `testing-handbook.md:122` — "- missing `Failures.md` or another required policy file is disclosed as a blocker."
- `docs/Lockedfiles/TestingLocked.md:6,8` — same as TESTING.md
- `docs/Lockedfiles/TestingHandbookLocked.md:122` — same blocker note
- `OPERATIONS_RUNBOOK.md:5` — "Gate policy → `Failures.md`."
- `OPERATIONS_RUNBOOK.md:13` — "1. Read `Failures.md` gate policy (`AGENTS.md` → Gates)."
- `DOC-MAP.md:19` — "- `Failures.md` — Gate policy, blockers, skips"
- `CONTENTS.md:27` — "- `Failures.md` — gate policy and blockers"
- `docs/CONTENTS.md:17` — "- Live ops log: Failures.md at repo root"

### Main Failures.md (self-referential + history)
- `Failures.md:86` — "... Log any blockers to Failures.md."
- `Failures.md:90` — same
- `Failures.md:227` — "root Failures.md entry added only for log..."
- `Failures.md:238` — "re-read ... + Failures.md ..."
- `Failures.md:257` — "No changes to root Failures.md historical sections..."
- `Failures.md:262` — "re-read key docs ( ... Failures.md) ..."
- `Failures.md:274` — "Re-read ... Failures.md ..."
- `Failures.md: (many dated sections reference prior entries and resolved tables)`
- **Critical stale refs (in root Failures.md ~lines 377-410):**
  - "14 failures resolved, 4 active, 2 deferred. See `plannnerplan/FAILURES-HISTORY.md` for resolution details."
  - "The following have been resolved and are documented in `plannnerplan/FAILURES-HISTORY.md`:"
  - "Full history and resolution evidence: `plannnerplan/FAILURES-HISTORY.md`"
  - "Current active failures: `plannnerplan/FAILURES-CURRENT.md`"
  (These files do not exist on disk — list_dir + grep confirmed. Pre-date current resolved-failures reorganization.)

### HANDOVER and Plans
- `HANDOVER.md:6` — "Full blocker list → [`Failures.md`](Failures.md)."
- `HANDOVER.md:66` — "see `Failures.md` resolved table"
- `HANDOVER.md:77` — "3. Log new blockers in `Failures.md` only."
- `plans/2026-07-04/HANDOVER.md:108` — "Other tests from Failures.md noted."
- `plans/2026-07-04/HANDOVER.md:109` — "Current blockers incorporated from Failures.md (2026-07-04)..."
- `plans/2026-07-04/open3d-test-error-follow-up.md:41` — "... or document a gate blocker in `Failures.md`."
- `plans/2026-07-04/idiothandver.md:204` — "- [Failures.md](/D:/oandO04072026/Failures.md)"
- `plans/2026-07-04/idiothandver.md:221` — "- no `Failures.md` logging for this specific incomplete UI slice"

### plannnerplan/ (governance — DO NOT EDIT HERE)
- `plannnerplan/FAILURESPLAN.md:24` — "**Note (2026-07-04 cleanup):** ... preserved in "Resolution history" below and Failures.md."
- `plannnerplan/FAILURESPLAN.md:63` — "... (confirmed in Failures.md Phase 03 restore entries)..."
- `plannnerplan/FAILURESPLAN.md:66` — "... (hostfxr.dll per Failures.md) ..."
- `plannnerplan/FAILURESPLAN.md:82` — "Current blockers from Failures.md (2026-07-04)..."
- `plannnerplan/FAILURESPLAN.md:107` — "... and Failures.md entries."
- `plannnerplan/phases/01-engine-lock-and-workspace-bootstrap.md:123` — "... (same as Phase 2a in Failures.md)..."
- (Many other phases/ and benchmarks/ in plannnerplan/ reference FAILURESPLAN.md and indirectly Failures.md via "see Failures.md" patterns in dated entries.)

### Critic / Audit / Design
- `critic/04-evidence-integrity.md:65` — "scoped (per Failures.md notes)..."
- `critic/09-detailed-plan.md:189` — "Host/shell limitations ... → Document in Failures.md + run on clean env / CI."
- `docs/superpowers/specs/2026-07-04-plannerplan-global-standard-revision-design.md:11` — "Current tests referenced from Failures.md..."
- `docs/superpowers/specs/...:24` — "... See also ... Failures.md."
- `docs/superpowers/specs/...:48` — "root docs (Readme.md, AGENTS.md, START.md, Failures.md, HANDOVER.md)..."
- `docs/audit/ui-ux-9-phase-plan.md:166` — "log blockers in `Failures.md`."
- `docs/database/RESTORE-RUNBOOK.md:119` — "5. Log result in `Failures.md`."
- `docs/database/RESTORE-RUNBOOK.md:183` — "Log blockers in repo-root `Failures.md`."
- `docs/architecture/SITE-MARKETING-UI-CONTRACT.md:159` — "**deferred** — dated entry in `Failures.md` |"

### Site / Tests / Scripts
- `site/tests/e2e/README.md:5` — "Commands and gate policy: `START.md` (Playwright), `Failures.md`, `AGENTS.md` (Gates)."
- `site/tests/e2e/README.md:18,57,172,195,200,225,245,249,263,265,269` — multiple: "See `Failures.md` UI backlog", "Log blockers and skips in `Failures.md`", "Add to the **UI / quality backlog** table in `Failures.md`", "Skip in code, no `Failures.md` entry", "Documented in `Failures.md`", "update Failures.md resolved/skipped", "`Failures.md` release gate row", etc.
- `site/app/css/core/site/bundles/README.md:64` — "Track progress in `Failures.md` → UI / quality backlog."
- `scripts/migrate-evidence.ps1:18` — hard-coded old path containing "plannnerplan\FAILURESPLAN.md" (related but not direct Failures.md)
- `site/tests/unit/planner-catalog-sku-contrast.test.ts:4,81` — comment: "History (Failures.md, 2026-06-25 ...)" + test name referencing Failures.md
- `site/tech-stack-generator/tests/generated-status-card.test.tsx:17,47` — test data with `sourcePath="Failures.md"`
- Generated: `site/tech-stack-docs/assets/...` (minified JS) — contains "Failures.md" strings (ignore; regenerated by tech-stack)

## References to FAILURES (broader, including PLAN-FAIL / FAILURESPLAN)
- Extensive in:
  - `Failures.md` (internal dated logs, PLAN-FAIL resolutions, 04xx series)
  - All `plannnerplan/FAILURESPLAN.md`, `plannnerplan/phases/*`, `plannnerplan/benchmarks/*`, `plannnerplan/HANDOVER.md`, `plannnerplan/IMPLEMENTATION-DECISIONS.md`, `plannnerplan/QUALITY-GATES.md`, `plannnerplan/critique/*`
  - `plans/2026-07-04/*` (HANDOVER, benchmark, critique, idiothandver)
  - `critic/*` (multiple files call out drift in HANDOVER/FAILURESPLAN)
  - `docs/superpowers/specs/2026-07-04-...-design.md`
  - `HANDOVER.md`
  - `scripts/migrate-evidence.ps1`
- Key patterns: "PLAN-FAIL-04xx", "FAILURESPLAN.md", "Resolution history", "Active failure IDs"
- Stale: references to plannnerplan/FAILURES-HISTORY.md and FAILURES-CURRENT.md appear **only** inside root Failures.md (not present on disk).

## Proposed Fixes / Updates for the Split (Coordinator Responsibility)
**DO NOT** apply these in Agent 8 scope. Report only. Coordinator to edit main Failures.md + plannnerplan/* + any others AFTER merging parts.

1. **Root Failures.md:**
   - Replace/remove the 4 stale plannnerplan/FAILURES-HISTORY.md + FAILURES-CURRENT.md references (lines ~377-410) with pointer to new `resolved-failures.md`.
   - Add dated 2026-07-04 entry under appropriate section: "Reorganization: resolved entries archived to resolved-failures.md + resolved-failures-part-*.md (8-agent parallel dispatch). Archive-over-delete followed per AGENTS.md. See resolved-failures.md. Staging mirror issues remain in open3d-next-staging/Failures.md."
   - Update "Summary" / "Resolved This Session" / "Archive Reference" sections to point at `resolved-failures.md` (and note part files if used).
   - Preserve all historical active/PLAN-FAIL content; do not prune current 041x items.

2. **plannnerplan/FAILURESPLAN.md (and phases/benchmarks referencing it):**
   - Update the "Note (2026-07-04 cleanup)" and any "preserved in ... and Failures.md" to also cite `resolved-failures.md`.
   - In "Resolution history" section: add cross-ref "See root resolved-failures.md for post-split archive."
   - If any PLAN-FAIL status tables list resolved, ensure links point to master resolved file.
   - Update any "Current blockers from Failures.md" to note the reorganization.
   - (Agent 8 did not touch; examples of needed: lines 24,63,66,82,107.)

3. **Other docs that should optionally point to resolved-failures.md (or keep as-is):**
   - HANDOVER.md, plans/*/HANDOVER.md, critic docs, design spec: may add "Historical resolutions now in resolved-failures.md; active in Failures.md."
   - But per "minimum necessary", only update if they claim to be the sole source of history.
   - site/tests/e2e/README.md and site/.../README.md: keep pointing to Failures.md (active UI backlog lives there); optionally note resolved archive.
   - No broad replace-all; targeted for history claims.

4. **plannnerplan references to history files:**
   - FAILURESPLAN.md internally uses "Resolution history" (ok) + Failures.md. Update note to include resolved-failures.md.
   - No plannnerplan/FAILURES-HISTORY.md exists — the root Failures.md refs are the only ones; clean those.

5. **Code / tests / scripts:**
   - `site/tests/unit/...test.ts` and tech-stack tests: historical comments only; leave or lightly update comment to "see Failures.md (active) + resolved-failures.md (archive)".
   - `scripts/migrate-evidence.ps1`: update path comment if used (old hardcode anyway).
   - Regenerated tech-stack: will pick up on next docs:sync if docs updated.

6. **New files created (this run):**
   - `resolved-failures.md` (master skeleton)
   - `resolved-failures-part-08.md` (staging slice)
   - `cross-refs-report.md` (this file)
   - Future: parts 01-07 from other agents; coordinator merges content under dated sections in master.

7. **No updates needed in:**
   - open3d-next-staging/Failures.md (left as-is)
   - AGENTS/START/Locked/Readme (they correctly point to active Failures.md gate policy)
   - Production code (no "Failures.md" strings in src except docs/tests)

## Other Files That May Need Update for Split (Identified)
- Root `Failures.md` (as above)
- `plannnerplan/FAILURESPLAN.md`
- `plannnerplan/phases/01-*.md` (if they hardcode old history)
- `plans/2026-07-04/HANDOVER.md`, `HANDOVER.md`
- `critic/` files (for consistency with evidence claims)
- Possibly `DOC-MAP.md`, `CONTENTS.md` if they want to list resolved-failures.md alongside Failures.md
- `site/tests/e2e/README.md` (backlog guidance)

## Verification Steps for Coordinator (use file tools)
- After edits: re-grep "Failures\.md" + "resolved-failures"
- Confirm no remaining plannnerplan/FAILURES-HISTORY.md links outside archive notes
- Read new resolved-failures.md + part-08
- Per AGENTS: log the reorganization action in root Failures.md
- Re-read AGENTS + Locked before any further

## AGENTS Compliance Notes
- All references discovered via required greps.
- No edits to forbidden files (main Failures.md, plannnerplan/*).
- 8th agent global view provided here for coordinator.
- Stale history refs surfaced (PLAN-FAIL era + old FAILURES-*.md).
- Evidence integrity: tool outputs (grep/read/list) are the proof.

Coordinator: use this report + part-08 + master skeleton to complete the parallel cleanup split.
