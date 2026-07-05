# 01 — Execution Contract (Do This First)

Status: Proposed replacement for scattered authority docs
Supersedes (for execution purposes only): conflicting operational lines in START.md, HANDOVER.md, PACKAGES.md where they disagree with this file
Does not replace: PACKAGES.md pins, implementation-decisions.md architecture calls — this file sequences them, it does not override technical decisions

## Why this file exists

Right now authority is split across AGENTS.md, PACKAGES.md, implementation-decisions.md,
REVISION-2026-07-05.md, START.md, PHASE-1.md, PHASE-2.md, HANDOVER.md, and 16 Lockedfiles
module pairs. That is too many places for an agent or a human to check before making a change.

This file is the single place that says: what is true right now, what is being worked on right
now, and what order work happens in. Everything else becomes reference material.

## Rule

Before touching planner code, read only:
1. This file (01-EXECUTION-CONTRACT.md)
2. The numbered plan file for the task you are doing (02 through 09 below)
3. PACKAGES.md only if you are adding/removing a dependency

Do not re-derive priorities from HANDOVER.md, START.md, or Lockedfiles during execution.
Those get regenerated FROM this contract, not the other way round.

## Current single source of truth (2026-07-05)

- SVG pipeline: Option A locked (Puck admin -> Zod -> server compiler -> DOMPurify/SVGO -> resvg/Sharp -> disk + R2)
- 2D engine: Fabric. 3D engine: Three/r3f. No second canvas engine.
- Active route: /planner/open3d only. /planner/guest and /planner/canvas are frozen.
- Admin composition: Puck + Zod. No second page builder.

## Execution order (see numbered files)

02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 09

Do not start a later-numbered file's work before the previous file's exit criteria are met,
unless explicitly marked [PARALLEL-OK] in that file.

## Ownership

Every numbered plan file below has exactly one owner and one exit date field.
No file may be marked done without evidence under results/<module>/<phase>/<cmd>/.
