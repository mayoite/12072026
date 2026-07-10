# Code review digest (owner)

**Source:** `results/planner/code-review-wave/REVIEW.md`  
**Review scope:** asset-engine wave (BASE `93bd27d` → HEAD at review `ba2e0aa`)  
**Harden follow-up on main:** `e9edc31` (`fix(planner): skill-wave harden — pipelineCore types, skipCompile, GLB policy`)  
**Date:** 2026-07-09 · **No worktrees** · Read-only review; fixes landed in a separate harden commit

---

## Assessment

### **Ready to proceed**

| Signal | Status |
|--------|--------|
| Critical defects blocking sequential work | **None** |
| Publish authority fail-closed | Met (code path) |
| Modular G5 binary + validate | Met (in-memory) |
| G8 viewer load | **Partial** and labeled partial — not a full cutover claim |
| Designer static GLB | Blocked on intended product paths |
| No handwritten `any` / no silent skipped suites on this surface | Met |

**Plain meaning:** You can keep building the next kill-path. Do **not** treat this as “product quality signed off.” Unit/CLI evidence is green; browser E2E and real GLB upload/load are still open (see [00-PENDING.md](./00-PENDING.md) and [04-HONEST-QUALITY.md](./04-HONEST-QUALITY.md)).

---

## Findings (plain language)

### Critical

**None.** Reviewer found no defect that violates the stated requirements or produces a silent wrong product path under documented assumptions.

---

### Important

| ID | Issue (plain language) | After review |
|----|------------------------|--------------|
| **I1** | GLB “generated” check used substring `.includes()` — a fake URL could put the marker only in query/hash and still pass | **Fixed** — path-only policy (see below) |
| **I2** | Publish ran normalize/compile twice; gate SVG was discarded, then S1–S3 ran again for disk write | **Fixed** — `skipCompile` + precompiled SVG (see below) |
| **I3** | Path-only stamp sets a planned `catalog-assets/generated/…` URL with no file bytes → G8 can 404 then fall back to procedural | **Still open** (product footgun until upload lands) |
| **I4** | README said G8 “planned” while code said “partial” | **Fixed** — README G8 row synced to **partial** |
| **I5** | Loaded GLB does not share modular scale/dimension path (no scale-to-fit) | **Still open** (honest G8 product gap) |

---

### Minor

| ID | Issue (plain language) | Status |
|----|------------------------|--------|
| **M1** | Stage failure may over-claim S3 if compile throws inside pipelineCore | Open (attribution only) |
| **M2** | G5 export JSON glTF branch is dead/confusing; validate should fail closed | Open (non-blocking) |
| **M3** | Stale comments (“G8 planned”, authority map omissions) | Partial (README done; some comments may remain) |
| **M4** | `themeTokens` cast without string-only filtering | Open |
| **M5** | Empty catch on GLB load failure (fail-soft by design; hard to debug) | Open (optional debug warn) |
| **M6** | Double export of authority constant | Harmless redundancy |

---

## What was fixed after review

Commit: **`e9edc31`** — skill-wave harden. Evidence: `results/planner/harden-wave/`, `results/planner/systematic-debug/`.

### 1. Path-only GLB policy (I1)

**File:** `site/features/planner/lib/glbAssetPolicy.ts`

- Strips query/hash before checking the marker (`urlPathnameOnly`).
- Allows only:
  - relative paths starting with `catalog-assets/generated/`
  - absolute URLs whose **pathname** contains `/catalog-assets/generated/`
  - `blob:` previews
- Rejects spoof where the marker appears only in `?…` or `#…`.

### 2. `skipCompile` on publish (I2)

**Files:**  
`publishDescriptorWithPipeline.ts`, `svgPipelineRunner.ts` (+ unit tests)

- Flow is now: **parse → `compileSvgForPublish` (S1–S3 gate) → `runSvgPipeline` with `skipCompile: true` + `precompiledSvg` (S4 write only) → persist**.
- Gate SVG bytes are the bytes written (no second full compile).
- Fail-closed if `skipCompile` is set without non-empty precompiled SVG.
- Tests: 13/13 in harden-wave for publish + pipeline runner.

### 3. `pipelineCore` types (publish authority blocker)

**File:** `site/scripts/generate-svg/pipelineCore.ts`  
**Evidence:** `results/planner/systematic-debug/run.json`

- Live publish imports this module via asset-engine; wrong polygon-clipping nesting types broke clean `tsc` and reflected a compensating double-wrap at runtime.
- Fixed nesting: `blockToPolygon` returns a true Polygon (`[ring]`); `applyBooleanOp` passes MultiPolygon shape correctly; dropped unsafe casts.
- **Not** an API redesign — type + nesting alignment only.

### Also in that harden pass

- README G8 status → **partial** (I4).
- Review artifact + a11y snapshot evidence under `results/planner/`.

---

## What is still open

### From this review (code/product gaps)

1. **I3** — Path-only stamp without upload (G8 404 thrash risk). Prefer binary stamp / upload-before-URL or a “ready” flag.
2. **I5** — G8 scale-to-fit / modular dimension alignment.
3. **Minor M1–M5** as listed above (non-blocking hygiene).

### Product kill-paths (not review Criticals, still not “done”)

| # | Item |
|---|------|
| **P0.1** | Admin SVG publish **browser** E2E (unit/CLI only today) |
| **P0.2** | G5 → storage → stamp → G8 **Chrome** load (binary in memory only) |
| **P0.3** | Open3d a11y: nested `main` + hydration `data-viewport` |

Full backlog: [00-PENDING.md](./00-PENDING.md). Honesty table: [04-HONEST-QUALITY.md](./04-HONEST-QUALITY.md).

---

## Evidence map (do not treat as owner prose)

| Artifact | What it shows |
|----------|----------------|
| `results/planner/code-review-wave/REVIEW.md` | Full review write-up |
| `results/planner/harden-wave/run.json` | skipCompile publish tests 13/13 |
| `results/planner/systematic-debug/run.json` | pipelineCore type fix root cause |
| `results/planner/verify-wave/run.json` | Broader wave: 62 tests + SVG smoke 4/4 |
| `results/planner/g8-viewer-glb/`, `g8-roundtrip/`, `modular-place-stamp/` | G8 partial + stamp unit evidence |

---

*Owner digest. Update when the next Important item lands or a kill-path closes.*
