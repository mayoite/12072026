# PHASE-06 — Dependency / secret scan CI

**Parallel:** yes · **Blocks on:** — · **Proof:** green scan run

---

## In plain words
This phase adds standing automated checks: one that scans dependencies for known
vulnerabilities, and one that stops secrets (API keys, passwords) from being committed to git.
Both run in CI so they catch problems automatically, forever.

## Why this matters
Vulnerable dependencies and leaked secrets are two of the most common ways projects get
compromised. Automating the checks means they don't rely on anyone remembering.

## What exists today (grounded in code)
- CI config (the scan gates don't exist yet — this phase adds them).

## What "good" looks like
A documented standing gate + one green scan run: dependency audit clean (or triaged), secret scan
finds nothing in git history or the working tree.

## Steps
1. Add a dependency vulnerability scan to CI.
2. Add a secret scan to CI.
3. Run once; triage findings; document the standing gate.

## Done when
Boxes in `plan/Security/CHECKLIST.md` → PHASE-06.

## How to prove
Capture one green (or fully-triaged) scan run. Raw artifacts → `results/security/phase-06/` (gitignored dump). Report → `agents-work/reports/security-phase-06.md`.

## Guardrails
No secrets in git — if the scan finds one, it's a FAILURES entry, not a waiver.

## Out of scope
Fixing individual flagged deps beyond triage (that's ongoing maintenance).
