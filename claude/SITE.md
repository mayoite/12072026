# SITE.md — one plan

**HEAD:** `7807198d` · **Surface:** `site/app/(site)/` marketing + shell.
**Replaces:** Site BOARD + S1 + S2.

## Honest state
Marketing is a **slice**, not "complete." Two real items only.

### Stream S1 — Dependency cleanup (owner-gated)
**Engines:** `site/package.json`, `pnpm-lock.yaml`.
**Finding (verified):** `@fancyapps/ui` has **zero imports** in `site/` source — safe to cut. Owner sign-off still required before removing (declared gate).
**Checklist:** confirm each candidate dep unused (grep) → remove → `pnpm install` + typecheck green → record command output.
**Guardrail:** no silent cuts; owner says "execute" first.
**Blocks on:** owner decision.

### Stream S2 — Site chrome parity
**Engines:** `app/(site)/layout.tsx`, marketing components, `PlannerMarketingChrome.tsx`.
**State:** was "PASS slice," now REPROVE — the evidence pack path went missing; re-prove, don't redesign.
**Benchmark:** header/nav/footer/theme parity across marketing + planner entry, desktop + 375×812.
**Checklist:** nav + theme reachable every breakpoint; no clipped chrome; light/dark parity; live screenshots.
**Blocks on:** nothing.

## Status
| Stream | State | Blocks on |
|--------|-------|-----------|
| S1 | OPEN (owner gate; fancyapps safe to cut) | owner |
| S2 | REPROVE (re-prove chrome slice) | — |

**Not claimed:** site is not "complete." New surfaces = new streams, not "S2 residual."
