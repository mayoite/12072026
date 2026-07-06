# 04 — Evidence and Gate Enforcement (P0 for trust)

Owner: ______________
Target exit date: ______________
Depends on: 02 complete (needs a real workflow to generate evidence against)
[PARALLEL-OK with 03]

## Problem

Several "completed" items in HANDOVER.md have stale or missing evidence (e.g. prior
results/site/planner-phase-1/* paths not verified on disk). Acceptance has been partly narrative.

## Work items (in order)

1. Write a small evidence-wrapper script (if one does not already exist) that captures exit code,
   stdout, stderr, and timestamp for every gate command into
   results/<module>/<phase>/<cmd>/<cmd>-run.json and <cmd>-raw.log.
2. Re-run and re-capture evidence for: typecheck, lint, full test suite, planner-catalog E2E,
   a11y, and build — from one single unchanged git revision.
3. Delete or clearly mark as STALE any evidence folder not produced by this fresh run.
4. Add a CI or pre-merge check that a claimed "gate passed" comment/PR label requires a matching
   evidence folder to exist and match the current commit SHA.
5. Update Failures.md / resolved-failures.md only from this fresh evidence, not from memory.

## Exit criteria

- One clean revision has full evidence for typecheck, lint, unit+integration tests, a11y, and build.
- No stale evidence path referenced in HANDOVER.md or Failures.md.
- A hard rule exists (documented + enforced) that no gate may be marked passed without an
  evidence folder tied to the current commit SHA.
