# Area E - Release Gate to Green + Status

## Pipeline

`site/package.json` `release:gate`:
```
test:audit:hollow && test:audit:gate-skips && test:audit:eslint-disable &&
lint && typecheck && test && build && test:a11y && test:e2e:nav &&
test:planner-catalog && test:coverage && test:coverage:site
```

Run #7 passed through audits, lint, typecheck, Vitest, build, a11y, nav E2E -> failed at `test:planner-catalog`. Coverage steps not yet reached.

## Steps

- [x] `pnpm --filter oando-site test:planner-catalog` green (4 planner specs) - verified 2026-07-01, 40/40 pass.
- [ ] Full `pnpm run release:gate` from `test:planner-catalog` onward -> reach `test:coverage` + `test:coverage:site`.
- [ ] If coverage fails: address thresholds / `catalogDrizzle` coverage gaps.

## On full green

- [ ] Mark release-gate phases **07-10** done in `plans/release-gate-quality-10-file-plan/`.
- [ ] Update `Failures.md` with what ran / what was skipped (target: nothing skipped).
- [ ] Write `site/results/phase10-release-gate.json` (run metadata, exit 0).
- [ ] Update `site/results/cross-pack-handshakes.json` if any handshake closes.

## Honesty gates (AGENTS.md)

- [ ] State what ran, what policy blocked, what was skipped.
- [ ] Pass/fail claims need proof (live check first, then status docs).
- [ ] No fabricated runs.
