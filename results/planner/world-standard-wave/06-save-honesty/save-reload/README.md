# save-reload/ — W5 hard-reload evidence slot

**Status: empty of browser artifacts (no PNGs).**

This directory is the **required landing path** for P06 W5 save → hard-reload proof.  
Directory existence alone is **not** evidence and is **not** CP-06 / W5 PASS.

## Do not invent

- No fake / placeholder PNG binaries
- No paper “PASS” screenshots
- No claiming restore identity from unit tests alone

## Expected when W5 lands (agent A7 / Task 06)

Typical path-backed set (names may match E2E writer; content must be real browser captures):

| Artifact | Role |
|----------|------|
| `01-before-save.png` (or equivalent) | Pre-save workspace |
| `02-saved-local.png` | After local save / flush ack |
| `03-after-hard-reload.png` | After hard reload — same plan |
| `06-browser-run.json` (or playwright run JSON) | Command, exit, HEAD, assert summary |
| Optional seed notes | Known wall/furniture UUIDs asserted |

## Gate language (W5)

Hard reload must prove **same wall id(s) + furniture id(s)** — **not** furniture count only.

Count-only green on `open3d-save-honesty.spec.ts` is a **false-green trap** (see parent `CODE-REVIEW-LIVE.md`).

## Pointers

| Doc | Path |
|-----|------|
| Live residual review | `../CODE-REVIEW-LIVE.md` |
| Pack NOTES + Task 07 cancel | `../NOTES.md` |
| Baseline unit expectations | `../00-baseline-run.json` |
| Execute plan | `plans1/P06-save-honesty/IMPLEMENTATION-PLAN.md` |

**Owner of this folder content:** residual E2E / browser workstream (A7), not A8 scaffold.
