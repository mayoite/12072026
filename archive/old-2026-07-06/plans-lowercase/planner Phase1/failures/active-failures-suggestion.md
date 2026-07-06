# active-failures-suggestion.md

**Prepared by:** agent 7/8 (domain: end-of-Failures.md cleanup)
**Date:** 2026-07-04
**Purpose:** Short suggestion for cleaned active/deferred/summary (per task). **Do NOT edit Failures.md directly** — coordinator will apply. This proposes making Failures.md current-focused after moving historicals.

**Context (evidence first):** 
- Old PLAN-FAIL-001..014 listed as "Resolved This Session" (moved to resolved-failures.md; part-*.md archived post-merge).
- PLAN-FAIL-015..018 still sit under "### Active Failures" in Failures.md but:
  - per plannnerplan/FAILURESPLAN.md "Resolution history": 
    - 015/016 — Resolved 2026-07-04 via BlockDescriptor Zod schema (Phase 02)
    - 017 — Resolved 2026-07-04 via Zod date generation in BlockDescriptor schema
    - 018 — Owned by Phase 03 (fixtures now present per 0402 + generator restore in Failures top)
- Deferred PLAN-FAIL-003/004 still listed but cross-ref in FAILURESPLAN as "Deferred behind Phase 06 host stability; explicit skip list in Phase 06/05".
- Summary count ("14 failures resolved, 4 active, 2 deferred") is stale vs FAILURESPLAN table + history (uses 04xx IDs now; old numbering superseded).
- Archive Reference points to non-existent `plannnerplan/FAILURES-HISTORY.md` and `plannnerplan/FAILURES-CURRENT.md` (confirmed via list_dir + grep; only FAILURESPLAN.md exists and serves this role).
- Phase logs (kept in main) also contain stale "Failure"/"Follow-up" from 07-03 staging work; current phases 03/08 are "Planned" status.

---

## Proposed Cleaned Summary (suggestion — replace the old one in Failures.md)

### Summary

See `plannnerplan/FAILURESPLAN.md` (active table + Resolution history) as source-of-truth for planner PLAN-FAILs (04xx IDs post-renumber). Old 001-014 resolved (archived in resolved-failures.md; part files archived). 015-018 resolved 2026-07-04 (schema/Zod/fixtures). 003/004 remain Deferred (Phase 05 canvas/engine gate). Non-existent FAILURES-HISTORY/CURRENT.md references removed/updated. Historical phase logs (03/03A/08) retained for trim review or moved to plans/archive/. Current gate policy + recent-day unresolved only in this file.

(14+ old resolved; current active per FAILURESPLAN; evidence in results/ + plan files per testing-handbook.md.)

---

## Proposed Cleaned Active Failures (suggestion — replace the list)

### Active Failures

None from the prior 015-018 numbering (all resolved per FAILURESPLAN.md Resolution history 2026-07-04 and Phase 02/03 work: BlockDescriptor schema, generatedAt handling, fixtures). 

See current open items in `plannnerplan/FAILURESPLAN.md` "Active failure IDs" table (e.g. 0403,0404,0405,0408,0411,0412,0414-0417,0419,0420 and cross-phase). 

Gate policy: read plannnerplan/QUALITY-GATES.md + FAILURESPLAN.md before any release:gate or heavy test. Failures.md now limited to session gate notes + links.

(If any 04xx remain unresolved after latest, list the minimal current ones here with owner + cross-ref only. Do not duplicate full history.)

---

## Proposed Cleaned Deferred/Blocked (suggestion)

### Deferred/Blocked

- `PLAN-FAIL-003` — Playwright verification (Phase 01B, R1). Status: Deferred. Reason: no canvas engine - requires Phase 05. (See plannnerplan/phases/05-*.md + FAILURESPLAN.)
- `PLAN-FAIL-004` — Phase 03A targeted checks (Phase 03A, R2). Status: Deferred. Reason: requires canvas engine from Phase 05. (See plannnerplan/phases/ + FAILURESPLAN cross-phase blockers.)

All other prior deferred addressed or superseded. Full list in plannnerplan/FAILURESPLAN.md.

---

## Proposed Archive Reference update (suggestion)

### Archive Reference

Full history and resolution evidence: `plannnerplan/FAILURESPLAN.md` (Resolution history section + active table notes)
Current active failures: `plannnerplan/FAILURESPLAN.md` (see "Active failure IDs")
Historical resolved (pre-04xx): `resolved-failures-part-07.md` (agent 7/8 extraction)
Old phase work logs: retained in this Failures.md (or trim to plans/archive/ per coordinator)

---

## Recommendations to fix the rest of Failures.md (trim, dedup, make current-focused)

1. **After extraction of Resolved This Session + Alias log:** delete only those two chunks (exact markers in resolved-failures-part-07.md). Leave Summary/Active/Deferred/Archive + 3 Phase sections for in-place edit.

2. **Replace Summary + Active + Deferred + Archive** with the cleaned versions above (or coordinator variant). This removes stale counts, old IDs, dead links.

3. **Trim/dedup the kept phase logs (03/03A, 03A Working Copy, Phase 08):**
   - They are 07-03 era logs of staging/OOPlanner work with explicit "Failure" + "Follow-up" + "Blocker".
   - Current reality (per live read of phases/*.md + FAILURESPLAN): Phase 03/08 = "Planned"; many items advanced/resolved under 04xx + BP cites + schema work.
   - Options (min necessary):
     a) Add a "Historical (pre-2026-07-04)" header + note "superseded; see FAILURESPLAN Resolution history and current phases/*.md" then keep condensed 1-2 bullets each, or
     b) Move the entire 3 phase sections + the stray "- Scope: open3d-next-staging TypeScript..." bullet (under Phase 08) into a new `resolved-failures-part-07-phases.md` or plans/archive/ (but task limited this agent to not move them; coordinator action).
   - Remove any duplicate mentions of resolved items (e.g. PLAN-FAIL-0402 etc already in top 2026-07-04 entries + FAILURESPLAN).
   - Fix the orphan bullet under Phase 08 (it appears to be a continuation of an earlier scope without header — grep showed it attaches to typecheck follow-up from Phase 03 era).

4. **Overall Failures.md structure post-clean (recommendation):**
   - Keep top 2026-07-04 entries (recent resolutions + sub-agent logs like AuditorAgent blocksResolver etc that are still relevant).
   - One short "Current Gate Notes" or link to FAILURESPLAN + QUALITY-GATES + testing-handbook.
   - Minimal "Active/Deferred this session" only for items not in the plan file.
   - Archive refs updated.
   - Remove or mark "stale numbering" for any remaining 00x/01x PLAN-FAILs.
   - Ensure every entry has: scope, evidence paths (results/...), skips declared, owner, removal condition (per AGENTS + testing-handbook).

5. **Cross-file consistency (do these too):**
   - Update any top-of-file or other sections that still cite the old "14 resolved, 4 active..." or point to non-existent HISTORY/CURRENT.
   - In FAILURESPLAN.md, the note "See `plannnerplan/FAILURES-HISTORY.md`" can be updated to self or this extraction.
   - Verify no other files (e.g. HANDOVER.md, critic/*.md, phases) hardcode the stale active list (grep done here showed most already point to FAILURESPLAN).
   - After trim: re-grep Failures.md for "PLAN-FAIL-01[5-8]" and "FAILURES-HISTORY" to confirm removal.

6. **Evidence integrity during fix:** Any coordinator edit must preserve (or move to archive) the full text of removed historicals. Record the edit in results/ or a new entry at top of Failures.md with "cleanup per agent 7/8 part-07". Do not suppress old logs.

7. **Why this cleanup:** Failures.md has accumulated session logs + old numbering + dead refs. Per AGENTS "minimum necessary", "honesty (skipped = say skipped)", "evidence first", and "make current-focused". FAILURESPLAN.md is the active governance ledger now.

**Full quote of current Active/Deferred (exact, to preserve for coordinator before any fix):**

### Active Failures

- `PLAN-FAIL-015` — Schema validation for safeRead (Phase 03, R2). Owner: Catalog agent.
- `PLAN-FAIL-016` — Placement ID collision risk (Phase 03, R2). Owner: Catalog agent.
- `PLAN-FAIL-017` — generatedAt hardcoded to 0 (Phase 03A, R2). Owner: SVG agent.
- `PLAN-FAIL-018` — Missing tests: fixture gallery, 10K perf, batch placement, dimension filter (Phase 03A, R2). Owner: Test agent.

### Deferred/Blocked

- `PLAN-FAIL-003` — Playwright verification (Phase 01B, R1). Status: Deferred. Reason: no canvas engine - requires Phase 05.
- `PLAN-FAIL-004` — Phase 03A targeted checks (Phase 03A, R2). Status: Deferred. Reason: requires canvas engine from Phase 05.

### Archive Reference (current)

Full history and resolution evidence: `plannnerplan/FAILURES-HISTORY.md`
Current active failures: `plannnerplan/FAILURES-CURRENT.md`

(Quote captured 2026-07-04 from live read_file + grep.)

**Summary quote (current, for cleaned replacement context):**

### Summary

14 failures resolved, 4 active, 2 deferred. See `plannnerplan/FAILURES-HISTORY.md` for resolution details.

---

**What was written:**
- resolved-failures-part-07.md (extracted chunks + markers + evidence)
- active-failures-suggestion.md (this file; cleaned proposals + full quotes + recs)

**Skips / policy:** 
- No changes to Failures.md or any source (task + AGENTS).
- No test/build runs (blocked + not required for this doc-cleanup task; used file evidence instead).
- Did not touch other agents' sections (e.g. the AuditorAgent blocksResolver log stays in main Failures).
- No inference beyond listed domain.

**AGENTS compliance:** Re-read required docs first + on steps; evidence first (live reads/greps/list before classification); minimum necessary files/edits; honesty (full quotes, declared resolved vs kept, non-existent files called out); scope strict (no phase logs moved); report details what/why/skips; no secrets.

**Risks/next (sensible):** Coordinator should apply suggestions + trim phases soon to prevent drift. After, run docs:check if exists, and note the cleanup in top of Failures.md + FAILURESPLAN.md. Verify with fresh grep/read that active lists now match FAILURESPLAN. If any 015-018 logic still open in code, surface as new 04xx entry instead of restoring old numbers.

**Confidence:** 85 (exact extracts high; classification of "purely completed" for Alias supported by self-contained "Done" + benchmark doc; phase non-move conservative per wording).
