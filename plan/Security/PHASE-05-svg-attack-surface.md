# PHASE-05 — SVG publish attack surface

**Parallel:** yes · **Blocks on:** — (couples Admin PHASE-01 — same publish path) · **Proof:** input matrix

---

## In plain words
The admin studio lets someone publish an SVG. SVGs can carry malicious content (scripts, external
references). This phase makes the publish path sanitize input and fail closed — reject anything
dangerous rather than passing it through.

## Why this matters
A published SVG is served to buyers. A malicious one could run scripts in their browsers. This is
the upload-security layer for the catalog.

## What exists today (grounded in code)
- `admin/svg-editor/svgArtifactCompiler.server.ts` (Resvg) + the publish pipeline.
- Couples to Admin PHASE-01 (same authoring/publish path being improved).

## What "good" looks like
A matrix of malicious/edge inputs (embedded script, external `href`, huge payloads) each rejected
or sanitized; valid symbols still publish. Publish is never treated as plan-draw.

## Steps
1. Build an input matrix of dangerous SVG patterns.
2. Confirm each is sanitized or rejected (fail closed).
3. Confirm valid symbols still publish cleanly.

## Done when
Boxes in `plan/Security/CHECKLIST.md` → PHASE-05.

## How to prove
Run the input matrix; capture reject/sanitize per case. Raw artifacts → `results/security/phase-05/` (gitignored dump). Report → `agents-work/reports/security-phase-05.md`.

## Guardrails
Fail closed — when in doubt, reject. Publish ≠ plan-draw.

## Out of scope
Authoring quality/layering (Admin PHASE-01) — this is the security half of the same path.
