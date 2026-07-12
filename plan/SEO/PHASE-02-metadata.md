# PHASE-02 — Per-page metadata

**Parallel:** yes · **Blocks on:** 01 (need the real route set) · **Proof:** audit table

---

## In plain words
Every page needs a title, a description, and social-share (OG) tags. This phase audits the
marketing and product templates so each page has correct, unique metadata — no missing or
duplicate titles.

## Why this matters
Titles and descriptions are what show up in search results and shared links. Missing or
duplicated ones directly cost clicks.

## What exists today (grounded in code)
- `metadata` / `generateMetadata` exports on marketing + product page templates.

## What "good" looks like
An audit table listing title / description / OG per template, with no missing or duplicate
titles across the real route set.

## Steps
1. For each template, record its title/description/OG.
2. Flag missing or duplicate titles.
3. Fix the gaps.

## Done when
Boxes in `plan/SEO/CHECKLIST.md` → PHASE-02.

## How to prove
Produce the metadata audit table across the PHASE-01 route set. Raw artifacts → `results/seo/phase-02/` (gitignored dump). Report → `agents-work/reports/seo-phase-02.md`.

## Guardrails
Metadata must match the real routes from PHASE-01 — not a guessed page list.

## Out of scope
Canonicals (PHASE-03) and JSON-LD (PHASE-05).
