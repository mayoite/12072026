# PHASE-01 — API headers + CSP

**Parallel:** yes · **Blocks on:** — · **Proof:** captured live headers

---

## In plain words
A CSP (Content-Security-Policy) is a browser rulebook that limits what a page can load/run — the
main defense against injected scripts. This phase reviews and documents the CSP and security
headers the app actually sends, for both API and app routes, without secretly weakening them to
make something pass.

## Why this matters
A missing or over-permissive CSP is how XSS attacks land. Documenting the real headers turns
"we think it's fine" into "here's exactly what we send."

## What exists today (grounded in code)
- `config/build/next.config.js` — where headers/CSP are configured.
- `proxy.ts` — request boundary.

## What "good" looks like
A captured record of the CSP + security headers for `/api/*` and app routes, each directive
explained, with no theatrical weakening.

## Steps
1. Capture live headers for `/api/*` and representative app routes.
2. Document each CSP directive and why it's there.
3. Flag any over-permissive directive for tightening.

## Done when
Boxes in `plan/Security/CHECKLIST.md` → PHASE-01.

## How to prove
Capture the live response headers; record the reviewed CSP. Raw artifacts → `results/security/phase-01/` (gitignored dump). Report → `agents-work/reports/security-phase-01.md`.

## Guardrails
Never weaken CSP just to pass a check — tighten, don't loosen.

## Out of scope
CSRF (PHASE-02) and auth (PHASE-03).
