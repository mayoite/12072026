# DS-04 — Platform, security proof & engineering truth

**Status:** Options design only. Not implemented.  
**UI verified this session:** **No.** Evidence is Security checklist, `Failures.md`, engines lockfile, auth bypass behavior.  
**Problem cluster:** DEV_AUTH_BYPASS voids Admin auth claims; coverage floor unproven; no CI catalog hash gate; security matrix open; rate limits not distributed; Chrome MCP a11y path blocked; results/ noise mistaken for PASS; dual runtime (Webpack vs Turbopack).

---

## Goal

Make “green” mean production-shaped truth: auth, isolation, release provenance, and environment honesty—so product tracks cannot claim done from unit-only or bypass-on runs.

---

## Option A — Proof pipeline first (gates before features)

**What:** Harden gates: production-like Admin smoke without bypass; canonical catalog hash CI; security control matrix MVP; coverage remeasure with honest floors; forbid treating `results/` as PASS; document Webpack as release truth.

| Pros | Cons |
|---|---|
| Stops false completion culture | Slows feature velocity short term |
| Cheap relative to full ASVS | Does not implement missing product features |
| Unblocks trust in every other DS | Needs owner discipline on checklist ticks |

**Best when:** Agents and humans over-claim done.  
**Effort:** Medium · **Risk:** Low · **Unblocks:** Honest Admin/Planner/Site status

### Solution shape

1. `admin-smoke` job: `build && start`, `DEV_AUTH_BYPASS` unset, assert `/access/?next=`.  
2. CI hash of `inventory/descriptors/**` + fail if tests write outside tmp.  
3. Coverage: re-run Admin (and later Planner) full-tree; publish summary artifact; no ≥80% claim without file.  
4. `SEC-INV-01` matrix stub: routes/actions/tables minimum columns.  
5. Scripts: `check:failures` already exists—fail PR if BLOCK items claimed closed without evidence.  
6. Docs: one line in Readme — results ≠ PASS.

---

## Option B — Security minimum for commercial paths

**What:** Focus Security on CSRF, object auth, rate-limit fail-closed for expensive routes, SVG sanitize corpus, share-token rules, handoff auth—without full ASVS L2 yet.

| Pros | Cons |
|---|---|
| Protects money/data paths | Leaves many SEC-* open |
| Aligns with Send-to-Oando readiness | Needs product endpoints to exist |
| Clear negative tests | Distributed rate-limit backend may be new infra |

**Best when:** Handoff/pricing is about to go live.  
**Effort:** High · **Risk:** Medium · **Unblocks:** Planner Phase 4 security acceptance

### Solution shape

1. Matrix rows for Admin publish, price-book action, Planner handoff, share review.  
2. CSRF on every cookie mutation; replay tests.  
3. Rate limit: Redis/Upstash or fail closed for AI/publish/handoff.  
4. SVG malicious corpus tests on compile/sanitize.  
5. Secrets scan + no service role in client bundles.  
6. Production CSP pass on Admin + Planner + Site sample routes.

---

## Option C — Tooling/runtime simplification

**What:** Reduce dual paths: one dev bundler story; Chrome stable for MCP or drop MCP a11y claims; single Playwright channel story; tech-docs out of critical `pnpm build` or isolated; clean gitignore for catalog-ops noise.

| Pros | Cons |
|---|---|
| Less agent confusion | Does not fix product gaps |
| Faster local verification | Tooling churn cost |
| Aligns a11y claims with real browser | May annoy existing Webpack habits |

**Best when:** Agents thrash on environment more than product.  
**Effort:** Medium · **Risk:** Low–Medium · **Unblocks:** Repeatable UI verification

### Solution shape

1. Document: release = Webpack build; Turbo only opt-in.  
2. Install/configure Chrome for DevTools MCP **or** mark Lighthouse MCP as N/A and use Playwright-only a11y.  
3. Playwright projects: admin/planner/site with stable `results/<track>/…` overwrite.  
4. Gitignore + restore rules for `results/admin/catalog-ops` and price-book audit noise.  
5. Optional: tech-docs gate separate from site release:gate.  
6. Script: `pnpm run verify:ui-smoke` one command for three shells.

---

## Recommendation

**Start Option A immediately** (no product risk). Layer **Option B** when handoff/pricing is scheduled. Use **Option C** only as much as needed to make A’s browser proofs runnable on this Windows host (Chrome or explicit Playwright-only policy).

---

## UI / env debt tied to this DS (unverified live)

| Item | Claimed gap | Needs live proof |
|---|---|---|
| Admin auth gate | Smoke skipped under bypass | Prod-like start, no bypass |
| Admin coverage | ~44% historical | Fresh coverage summary file |
| MCP Lighthouse | No Chrome stable | Install Chrome or drop claim |
| Catalog isolation | No CI hash gate | Red CI when canonical mutates |
| Rate limits | Not distributed | Staging load + fail-closed |

---

## Key decisions (when owner picks)

1. Coverage floor: keep 80% or lower with owner sign.  
2. A11y authority: Playwright axe vs Lighthouse MCP.  
3. Rate-limit backend choice for production.

## Open questions

1. Is Upstash/Redis already available on Vercel for this project?  
2. Who owns security matrix maintenance?  
3. Must tech-docs remain on the critical release path?

## PR plan (after option pick)

| PR | Depends | Content |
|---|---|---|
| T1 | — | Admin smoke without bypass in CI |
| T2 | — | Canonical catalog hash gate + tmp-only tests |
| T3 | — | Coverage summary artifact + honest floors |
| T4 | owner | Rate-limit backend + handoff CSRF suite |
| T5 | host | Chrome MCP or Playwright-only a11y policy |
| T6 | — | SEC inventory matrix MVP |

---

*Agent report. Not checklist PASS. Not UI verification.*
