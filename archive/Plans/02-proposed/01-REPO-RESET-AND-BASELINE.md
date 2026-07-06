# 01 — Repo Reset and Baseline

Status: Do first.
Owner: __________
Exit date: __________

## Goal

Re-establish one trustworthy baseline before any planner changes resume.

## Why

The repo has had drift between plans, handover, generated plan artifacts, and execution attempts. Before touching planner logic again, the baseline must be explicit and frozen.

## Tasks

1. Choose the exact baseline commit or working tree copy that is the restart point.
2. Commit it immediately with a message like `chore: freeze restart baseline before planner recovery`.
3. Add a `BASELINE-RECOVERY-2026-07-05.md` note at repo root with:
   - commit SHA,
   - what is intentionally included,
   - what work was discarded,
   - what must not be trusted from prior runs.
4. Delete or archive any generated plan files that are not being adopted.
5. Mark `plann/HANDOVER.md` top section as historical until re-derived from fresh evidence.

## Exit criteria

- One committed restart point exists.
- One human-readable recovery note exists.
- There is no ambiguity about what the repo baseline is.
