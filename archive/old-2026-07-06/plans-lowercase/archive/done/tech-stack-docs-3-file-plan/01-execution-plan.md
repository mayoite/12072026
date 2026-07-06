# Tech Stack Docs — Execution Plan

**Last updated:** 2026-06-29

**Status:** Phase 1 mostly done · Phase 2 guards/gate done · exit proofs + audit open

**Resume:** Live acceptance proofs or audit row closes (your OK per row).

---

## Commands

```powershell
pnpm run docs:sync:tech-stack
pnpm run docs:check:tech-stack
pnpm run docs:test:tech-stack
pnpm run docs:typecheck:tech-stack
pnpm run docs:build:tech-stack
pnpm run docs:gate:tech-stack
# Phase 2 step 5 — permission required:
pnpm run release:gate
```

---

# Phase 1 — 100% accuracy + site→UI auto-update `[~]`

### 1–3 + Batches 1–2 `[x]` — 2026-06-29

- Dual emit, parity, four route domains, **12/12 SPA routes** wired to `generated-data/`.
- Hand fact arrays removed from all `src/pages/*.tsx`.

**Verified:** sync + check (+ test when run).

### Phase 1 exit

**Auto-update**
- [x] 12/12 routes wired
- [ ] Live acceptance: dep bump → TechStack version changes (manual proof)
- [ ] Live acceptance: new API route → ApiDesign table changes (manual proof)

**Accuracy**
- [x] Markdown + parity green
- [x] SPA wired (metadata 12/12)
- [x] `docs:build:tech-stack` exit-tested (via `docs:gate:tech-stack` 2026-06-29)

**Audit (D)** — your OK per row
- [ ] Audit files + `Failures.md` updated

---

# Phase 2 — Guards + coverage, then gate `[~]`

| # | Work | Proof | Status |
|---|------|-------|--------|
| 1 | `hardcoding-guard.mjs` + `uiOnly-allowlist.json` | hand fact → fail | `[x]` 2026-06-29 |
| 2 | `fake-test-audit.mjs` | trivial test → fail | `[x]` 2026-06-29 |
| 3 | Coverage in gate (≥95% lines src) | `test:coverage` | `[x]` 98.96% lines, 90.51% branches |
| 4 | `docs:gate:tech-stack` | full gate green | `[x]` 2026-06-29 |
| 5 | `release:gate` docs step | your permission | `[ ]` |
