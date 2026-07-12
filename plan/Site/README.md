# Site track

**HEAD:** `7807198d` · **Surface:** `site/app/(site)/` marketing + shell.
Phases are independent files. Checklist: [CHECKLIST.md](./CHECKLIST.md). Failures: [../FAILURES.md](../FAILURES.md). Proof = live run; `results/` = dump.

## Honest state
Marketing is a **slice**, not "complete." Two real phases.

## Phases
| File | Owns | Parallel? | Blocks on |
|------|------|-----------|-----------|
| [PHASE-01-deps-cleanup.md](./PHASE-01-deps-cleanup.md) | Remove unused dependencies | yes | owner gate |
| [PHASE-02-site-chrome.md](./PHASE-02-site-chrome.md) | Header/nav/footer/theme parity | yes | — |

## Guardrail
Do not claim "site complete." New marketing surfaces = new phases, not "chrome residual."
