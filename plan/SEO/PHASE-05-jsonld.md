# PHASE-05 — JSON-LD structured data

**Parallel:** yes · **Blocks on:** 02, 03 · **Proof:** validator

---

## In plain words
JSON-LD is hidden structured data that lets Google show rich results (product cards with price,
ratings, etc.). This phase adds valid Product and Organization structured data.

## Why this matters
Rich results stand out in search and can lift click-through. It builds on correct metadata and
canonicals, so it comes after those.

## What exists today (grounded in code)
- No structured-data emitters yet — this phase creates them.

## What "good" looks like
Valid Product and Organization JSON-LD on the right pages, passing a structured-data validator.

## Steps
1. Add Organization JSON-LD site-wide.
2. Add Product JSON-LD on product pages (price/availability from the pricing source).
3. Validate.

## Done when
Boxes in `plan/SEO/CHECKLIST.md` → PHASE-05.

## How to prove
Run a structured-data validator on sample pages; capture the pass. Raw artifacts → `results/seo/phase-05/` (gitignored dump). Report → `agents-work/reports/seo-phase-05.md`.

## Guardrails
JSON-LD must reflect real data (real price/availability), not placeholders.

## Out of scope
Anything requiring pages that don't exist yet (Site track first).
