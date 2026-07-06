# 08 — Automate Lockedfiles Instead of Hand-Editing (Ongoing)

Owner: ______________
Target exit date: ______________
Depends on: 02-07 stabilizing (less churn = safer to automate against)

## Problem

docs/Lockedfiles/<module>/current.md and proposed.md pairs exist for 16 domains, all currently
hand-maintained. At this scale, hand-maintained snapshots drift from actual code within days.

## Work items (in order)

1. Pick 2-3 pilot modules (recommend: planner, dependencies-engines, tests — highest churn).
2. Write a generator script that produces current.md from: package.json contents, route file
   listing, and existing test file listing — no manual prose beyond a short human-written summary.
3. Keep proposed.md as hand-authored (it expresses intent, which cannot be derived from disk).
4. Add a CI check: current.md must match a fresh generation, or CI fails and blocks merge.
5. Roll out to remaining 13 modules once the pilot generator is stable.
6. Update docs/Lockedfiles/INDEX.md to note which modules are auto-generated vs hand-authored.

## Exit criteria

- Pilot modules' current.md is generated, not hand-edited, and CI-enforced to stay in sync.
- INDEX.md clearly marks generated vs manual files.
- No current.md in the pilot set has been hand-edited in the last full sprint.
