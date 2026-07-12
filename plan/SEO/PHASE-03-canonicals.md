# PHASE-03 — Product / category canonicals

**Parallel:** yes · **Blocks on:** 01 · **Proof:** rule check

---

## In plain words
A "canonical" tells search engines which URL is the real one when several URLs show the same
content (e.g. product with different query params). This phase makes sure every product and
category page declares exactly one correct canonical.

## Why this matters
Without canonicals, search engines split ranking across duplicate URLs or index the wrong one.

## What exists today (grounded in code)
- Canonical rules vs `productStaticParams` / the slug policy.

## What "good" looks like
One canonical per product/category, matching the slug policy; params/variants point at the
canonical.

## Steps
1. Define the canonical rule per product/category.
2. Verify it matches `productStaticParams` / slug policy.
3. Confirm variant/param URLs canonicalize correctly.

## Done when
Boxes in `plan/SEO/CHECKLIST.md` → PHASE-03.

## How to prove
Show canonical output for a sample of product/category URLs matching the slug policy. Raw artifacts → `results/seo/phase-03/` (gitignored dump). Report → `agents-work/reports/seo-phase-03.md`.

## Guardrails
Canonical must follow the real slug policy, not an ad-hoc rule.

## Out of scope
Metadata text (PHASE-02).
