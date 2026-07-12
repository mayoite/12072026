# PHASE-04 — robots / noindex

**Parallel:** yes · **Blocks on:** — · **Proof:** live headers

---

## In plain words
Some pages should never appear in Google — admin, auth, app routes. This phase writes the policy
for what's blocked and confirms the live site actually sends the right "don't index me" signals.

## Why this matters
Leaking admin/auth routes into search is a security and professionalism problem. This makes the
noindex rules explicit and verified, not assumed.

## What exists today (grounded in code)
- `app/(site)/robots.ts` + per-route headers.

## What "good" looks like
A short policy doc listing which route groups are noindex, plus live header checks proving
app/auth routes actually return noindex.

## Steps
1. Write the robots/noindex policy (which route groups, why).
2. Verify live headers on app/auth routes return noindex.
3. Reconcile against the SEO-01 allowlist.

## Done when
Boxes in `plan/SEO/CHECKLIST.md` → PHASE-04.

## How to prove
Capture live response headers for a sample of app/auth routes showing noindex. Raw artifacts → `results/seo/phase-04/` (gitignored dump). Report → `agents-work/reports/seo-phase-04.md`.

## Guardrails
Policy + live proof both required — a robots.ts file alone is not proof.

## Out of scope
Indexable-page metadata (PHASE-02).
