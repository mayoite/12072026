# Design: Final residual (post 8.5 ROI + DB pointer)

**Date:** 2026-07-18  
**Status:** Owner-requested final brainstorm + execute in same turn.  
**Branch:** `main` (prior owner push/execute consent).

## Context (now)

Shipped: Help, SVG underlay, guest chrome diet, inventory simplify, BOQ review lines, guest setup skip, site continuity, maker Y fix, 20 plan SVGs, DB pointer column applied, dual-write schema soft-skip.

**Score:** ~7.5–8 product path. Not 8.5.  
**Failures.md:** DB-SVG cutover still OPEN (dual-write publish not proven; do not flip `SVG_RELEASE_AUTHORITY=db`).

## Goal (this wave only)

Close **code-side residuals** that improve honesty, proof, and dual-write readiness without claiming cutover or inventing commercial prices.

## Non-goals

- Brand-true 30 marketing SKUs  
- Full price-book commercial authority  
- Flip `SVG_RELEASE_AUTHORITY=db`  
- Cloud autosave  
- Worktrees  

## Approaches considered

| # | Approach | Pros | Cons |
|---|---|---|---|
| A | Only docs/Failures update | Safe | No product lift |
| B | **Prove dual-write readiness + harden gates + guest e2e smoke + dual-write UI honesty** | Unblocks cutover path; measurable | Needs env for live probe |
| C | Full cutover flip | One-shot | Unsafe without proven publish |

**Recommendation: B.**

## Design (B)

### D1 — Dual-write readiness probe script
- Script: resolve dual-write deps live (mode, R2, schema).  
- Exit 0 when `enabled`; non-zero with honest reason otherwise.  
- No publish. No flip.

### D2 — Dual-write mode messaging in Admin
- When dual-write resolves, surface mode string in Admin SVG list/source meta (disk authority + dual-write mode).  
- Never claim DB is release authority under disk default.

### D3 — Guest browser smoke (Playwright)
- One guest journey: open guest → first-use or canvas → Help or underlay control present → no console fatal.  
- Isolated; skip if no server. Prefer existing playwright config.

### D4 — Dual-write unit: schema missing + enabled path
- Already partial; ensure `skipped_schema_missing` covered end-to-end in unit; db authority block message covered.

### D5 — Failures.md + agent-report honesty
- Document pointer applied; list exact remaining cutover steps.

## Success criteria

1. `db:verify` pointer + dual-write resolve mode printable.  
2. Admin UI does not lie about authority.  
3. Guest e2e smoke exists or documents skip reason.  
4. Unit green; check:layout OK.  
5. No `SVG_RELEASE_AUTHORITY=db` flip.

## Risk

Live R2/DB probes may fail in CI without secrets — scripts must fail soft with clear codes, not crash app boot.
