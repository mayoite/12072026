# Phase 9 — Gate Governance (Before Proof)

## Purpose

Wire audits into gate scripts; add fast CI path; **rehearsal** run allowed (expect red).

## `release:gate` (full)

```
lint → typecheck → test → test:audit:hollow → build
→ test:a11y → test:e2e:nav → test:planner-catalog → test:audit:gate-skips
→ test:coverage → test:coverage:site
```

Use full `test:audit:hollow` (no `--exclude-marketing`).

## `release:gate:fast` (interim PR job)

```
lint:secrets → lint → typecheck → test → test:audit:hollow --exclude-marketing
```

Add to `site/package.json`. Target &lt;5 min feedback.

## CI

- `.github/workflows/release-gate.yml` — full gate on nightly / release branch
- `release-gate-fast.yml` or job matrix — on every PR
- Upload `site/results/phase*.log` on failure

## Rehearsal

One full `release:gate` run before Phase 10 claiming green — log expected reds; save `phase09-gate-rehearsal.log`.

## Acceptance Checklist

- [x] `release:gate` includes `test:audit:*` (no `--exclude-marketing`).
- [ ] `release:gate:fast` in `site/package.json` **(required)**.
- [ ] `.github/workflows/release-gate.yml` (or `release-gate-fast.yml`) **(required)**.
- [~] Rehearsal log exists (`site/results/phase10-release-gate-*.log`) but gate **exit 1** — not green.
