# PHASE-01 — Sitemap ↔ live routes

**Parallel:** yes · **Blocks on:** — (do first — gates 02/03) · **Proof:** route diff

---

## In plain words
A sitemap is the list of pages you tell Google about. Right now the generated sitemap and the
site's actual pages don't match — some real pages are missing, some listed pages shouldn't be
indexed. This phase produces an honest diff and classifies every gap.

## Why this matters
If the sitemap is wrong, search engines index the wrong things (or miss pages entirely). Every
other SEO phase depends on first knowing the true set of indexable routes.

## What exists today (grounded in code)
- `app/(site)/sitemap.ts` — generates the sitemap.
- A `STATIC_PATHS` / `productStaticParams` set that diverges from live routes (the root bug).

## What "good" looks like
A diff table: every public route classified as **index** (should be in sitemap), **noindex**
(deliberately excluded, allowlisted), or **bug** (mismatch to fix). No unexplained gaps.

## Steps
1. Enumerate the real indexable public routes.
2. Diff against the sitemap output.
3. Classify each gap: index | noindex | bug; allowlist the noindex ones.

## Done when
Boxes in `plan/SEO/CHECKLIST.md` → PHASE-01.

## How to prove
Produce the route-vs-sitemap diff with every gap classified. Raw artifacts → `results/seo/phase-01/` (gitignored dump). Report → `agents-work/reports/seo-phase-01.md`.

## Guardrails
- No SEO-02 until this is green — you must know the real route set first.

## Out of scope
Fixing per-page metadata (PHASE-02) — this phase just establishes the true route set.
