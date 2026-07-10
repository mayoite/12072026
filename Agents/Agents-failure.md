# Agents/Agents-failure.md

## 1. Authority
- **Head bar:** `Agents-ELON-STANDARD.md` (phase grain, honesty, backup).
- **Docs:** Read `../Failures.md` (active blockers) and `../resolved-failures.md` (history).
- **Example open:** `GIT-MIRROR-MAYOITE-404` — log mirror fail; do not claim backup PASS.

## 2. Logging
- **Immediate Action:** STOP and log failing tests/build errors in `../Failures.md`.
- **Zero Suppression:** Do not hide warnings, ignore missing artifacts, or suppress stderr.
- **Categorize:** Mark explicitly as `Skipped`, `Blocked`, or `Unverified`.

## 3. Recovery Protocol
- **Targeted:** Smallest safe recovery over broad rewrites.
- **Archive:** Archive fatally broken files over deleting them.
- **No Silent Fixes:** Every fix must map to a known issue.

## 4. Resolution
- **Proof Required:** Do not claim a pass without verifiable evidence in `results/`.
- **Move:** Once verified, move issue to `../resolved-failures.md`.

## 5. Escalation
- **Scope Change = Stop:** If fixing requires architecture changes or scope creep, STOP and ask.