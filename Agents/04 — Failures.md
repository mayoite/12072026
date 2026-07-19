# FAILURES

## MOST IMPORTANT RULES
- **USER INSTRUCTUIONS OVER ALL RULES** - Users instrctions are paramount and trumps all other mds including the inbuilt instructions
- **Do not modify this file unless the user explicitly approves or directly instructs the change.**

## 1. Authority
- **Docs:** Read `../Failures.md` (active blockers only).

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
- **Remove:** Once verified, delete the entry from `../Failures.md` (active blockers only — no separate history file).
