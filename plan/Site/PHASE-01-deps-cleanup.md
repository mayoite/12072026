# PHASE-01 — Dependency cleanup

**Parallel:** yes · **Blocks on:** owner decision (declared gate) · **Proof:** typecheck + install

---

## In plain words
The project pulls in npm packages it may not use. Unused dependencies slow installs, bloat the
build, and are a security surface. This phase removes the ones that are genuinely unused — but
only after the owner says go, because cutting a dependency someone quietly relies on breaks the
build.

## Why this matters
Smaller, honest dependency list = faster builds, fewer vulnerabilities, less confusion. But it's
owner-gated precisely because a wrong cut is disruptive.

## What exists today (grounded in code)
- `site/package.json` + `pnpm-lock.yaml`.
- **Verified finding:** `@fancyapps/ui` has **zero imports** in `site/` source — safe to cut.
- Other candidates must be grep-verified unused before removal.

## What "good" looks like
Each removed package is proven unused (no imports), removed, and the app still typechecks and
installs cleanly — with the command output recorded.

## Steps
1. Get the owner's explicit "execute" for the cut list (starting with `@fancyapps/ui`).
2. For each candidate: grep-confirm zero imports → remove from `package.json`.
3. `pnpm install` + typecheck; confirm green.

## Done when
Boxes in `plan/Site/CHECKLIST.md` → PHASE-01.

## How to prove
Show the grep proving each dep unused, then the clean `pnpm install` + typecheck output.
Raw artifacts → `results/site/phase-01/` (gitignored dump). Report → `agents-work/reports/site-phase-01.md`.

## Guardrails
- **No silent cuts** — owner says "execute" first.
- One dep at a time verified; never bulk-delete on assumption.

## Out of scope
Upgrading versions or swapping libraries — this is removal of the unused only.
