# APPROVED SCOPE: Tier A

# Excalidraw MIT Packages — Design Spec

**Date:** 2026-07-12  
**Source plan:** `agents-work/2026-07-12-excalidraw-packages-remedy-plan.md`  
**Law:** `AGENTS.md` · `Plans/Planner-track/CONSTRAINTS.md` · P02 engine lock · P09 shortcuts/chrome

**Purpose:** Specify how to adopt Excalidraw MIT **leaf packages** for planner annotations (dimension + text) while preserving Fabric as the sole interactive plan host.

---

## 1. Problem statement

Planner document model already includes `PlannerAnnotation` and `PlannerTextAnnotation` with CRUD actions in `useRoomElements.ts` / `pureActions.ts`, but **`PlannerFabricStage` does not paint annotations** today. P09 lists dimension (M) and text (T) as **deferred** tools — honest labeling, not live handlers.

Buyer bar (SmartDraw discipline): dimensions and text must become **live-tier** (label = shortcut = handler) without importing Excalidraw.com chrome or a second canvas engine.

---

## 2. Tier recommendation

### Summary decision: **Tier A now → Tier B before P16 → Tier C owner-gated never on plan route**

| Tier | Packages | Verdict | When |
|------|----------|---------|------|
| **A** | `roughjs@4.6.4` · `@excalidraw/math@0.18.1` · `@excalidraw/common@0.18.1` | **Adopt** | Immediately after owner scope gate; parallel-safe with P07 if no `PlannerFabricStage` edits |
| **B** | `@excalidraw/element@0.18.1` | **Adopt** | After Tier A E2E green; required for P16 export bridge |
| **C** | `@excalidraw/excalidraw@0.18.1` | **Defer** | Separate non-plan route or export modal only; owner explicit waiver |

### Tier A — adopt first (recommended default scope)

**Role:** Hand-drawn stroke rendering and 2D geometry helpers **behind Fabric adapters**.

| Package | Pin | Est. gzip delta | Role |
|---------|-----|-----------------|------|
| `roughjs` | `4.6.4` exact | ~15–25 KB | RoughGenerator → Fabric.Path groups for dimension lines |
| `@excalidraw/math` | `0.18.1` | Small | Vector normalize, dot product, segment math in `annotationGeometry.ts` |
| `@excalidraw/common` | `0.18.1` | Small | Transitive constants for math/element alignment |

**Why first:** Smallest bundle; zero UI framework import; no `jotai` / `radix-ui` collision with RAC toolbar policy.

### Tier B — adopt after Tier A proof

**Role:** Bounds, hit-test patterns, `PlannerAnnotation` → exportable primitives for P16 share/quote handoff.

**Trigger:** Tier A unit + E2E PASS + P09 23/23 after M/T promotion.

**Not a plan host:** Export functions only; no editor mount in workspace shell.

### Tier C — owner gate only (default: do not install)

**Role:** Full whiteboard embed for sketch export or admin markup island.

**Blockers:**

- Brings `jotai`, Radix UI, SCSS, font CDN — duplicates RAC toolbar patterns if embedded in `/planner/guest` or `/planner/canvas`.
- Bundle jump (hundreds of KB client) without buyer P11–P13 value.
- Violates “no competitor UI theft” spirit if Excalidraw chrome appears as O&A plan surface.

**If owner chooses C:** Mandatory isolation on `/planner/sketch/` or modal — never `data-testid="planner-fabric-stage"` sibling.

### Explicitly skip (YAGNI)

`@excalidraw/mermaid-to-excalidraw` · `@excalidraw/laser-pointer` · `@excalidraw/random-username` · `perfect-freehand` (until P13+ free-draw scope).

---

## 3. Fabric adapter architecture

### Invariant

> **Document authority unchanged.** Pointer events for M/T flow: `canvasTool.ts` → `PlannerFabricStage` handlers → `pureActions` — identical to wall tool. No parallel Excalidraw pointer stack.

### Component diagram

```
PlannerProject (mm, UUID v7)
  └── floor.annotations[] + floor.textAnnotations[]
           │
           ▼
annotationFabricObjects.ts  ── rebuild on project/floor/transform change
           │
           ├── annotationGeometry.ts  (@excalidraw/math — pure, no Fabric)
           └── roughAnnotationAdapter.ts  (roughjs → path d strings)
                       │
                       ▼
              PlannerFabricStage
                       │
                       └── fabric.Canvas (sole interactive host)
```

### Module responsibilities

| Module | Imports allowed | Responsibility |
|--------|-----------------|----------------|
| `annotationGeometry.ts` | `@excalidraw/math` only | mm ↔ canvas px; offset dimension parallel to segment; text anchor + rotation |
| `roughAnnotationAdapter.ts` | `roughjs`, types from project model | `PlannerAnnotation` → `{ lines: string[]; labelBox? }`; deterministic seed from `annotation.id` |
| `annotationFabricObjects.ts` | `fabric`, adapters above | Build/remove Fabric groups tagged `data-planner-kind="annotation"` |
| `PlannerFabricStage.tsx` | above + existing rebuild | Single rebuild pass with walls/furniture; respect `layerVisibility.annotations` |
| `export/excalidrawAnnotationExport.ts` (Tier B) | `@excalidraw/element` | `plannerAnnotationsToExcalidrawElements(floor)` — JSON fragment for P16 |

### Tool promotion (P09 honesty)

When Tier A wiring is complete:

```typescript
// canvasTool.ts — CANVAS_TOOL_REQUIREMENT
dimension: "live",
text: "live",
```

Guidance strings must drop “deferred” wording same commit as handler wiring.

### Interaction flows

**Dimension (M):** arm tool → pointer down (start) → move (rough preview path) → pointer up (commit if segment ≥ min length) → `addAnnotation` via `pureActions`.

**Text (T):** arm tool → pointer down (anchor) → inline editor / modal → `addTextAnnotation`.

**Save continuity (P06):** E2E must assert same annotation ids after reload.

---

## 4. Bundle and license risks

### Bundle risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Tier A client chunk growth | Low | Pin exact versions; record `pnpm run build` chunk delta in `11-annotations-excalidraw/VERDICT.md` |
| Tier B transitive weight | Medium | Install only after Tier A green; tree-shake export-only imports |
| Tier C full editor | High | Default off; separate route code-split |
| Fabric + Rough double paint | Medium | Single rebuild owner; remove stale annotation groups before repaint |
| SSR / Next 16 import issues | Low | Keep roughjs in client-boundary modules only (`"use client"` chain) |

**Owner budget:** No hard KB gate in repo today — first Tier A install must record baseline vs post-install client bundle in VERDICT; owner sets ceiling after first measurement.

### License risks

| Item | Status | Action |
|------|--------|--------|
| Excalidraw npm packages | MIT (verify via `pnpm view <pkg> license`) | Record in `docs/Lockedfiles/03-dependencies-engines-current.md` **before** install |
| Attribution | Required | Create `site/public/licenses/excalidraw-MIT.txt` |
| Plagiarism / UI copy | Policy risk if Tier C on plan route | Library-only default; no Excalidraw.com chrome on plan workspace |

---

## 5. What NOT to do

| Forbidden | Why | Detection |
|-----------|-----|-----------|
| **Full `@excalidraw/excalidraw` embed on `/planner/guest` or `/planner/canvas`** | Second plan UX; RAC conflict; engine lock breach | Visual + `hostWiringP01` + two canvases in DOM |
| **Replace Fabric with Excalidraw as plan engine** | P02 CONSTRAINTS | Requires engine-lock revision + owner signoff |
| **Load `/svg-catalog/*.svg` into annotation layer** | Conflates P05 publish path with plan draw | Network + P05 regression tests |
| **Install Tier C for “math only”** | Bundle bloat | `package.json` audit |
| **Promote M/T to live without Fabric paint** | P09 false-green (theater) | Rail says live, canvas blank |
| **Bidirectional live sync plan ↔ Excalidraw sketch** | Scope explosion | Tier C v1 one-way import only |
| **Unit-only PASS** | AGENTS no paper moon | Task 6 E2E + PNG required |
| **Commit without owner** | AGENTS hard gate | No git write |

---

## 6. Sequencing vs Planner track

| Relative to | Rule |
|-------------|------|
| **P07 (open card)** | Excalidraw **does not block** P07; do not wire annotation pointer handlers while P07 wall/place fixes are in flight |
| **P07 PASS** | Safe to merge `PlannerFabricStage` annotation rebuild + M/T promotion |
| **P06** | Already models annotations in save payload — continuity test is mandatory |
| **P09** | Promoting M/T must keep 23/23 vitest green |
| **P16** | Tier B export bridge lands here |
| **Parallel** | Tier A `pnpm add` + pure unit tests can run during P07 baseline if baseline is green; if P07 red, defer all Fabric edits |

**Suggested Planner artifact:** `P09b-annotations-excalidraw.md` slice card (not CP renumber).

---

## 7. Testing and evidence bar

| Layer | Command | PASS bar |
|-------|---------|----------|
| License preflight | `pnpm view roughjs license` (+ math, common) | `MIT` each |
| Geometry unit | `vitest annotationGeometry.test.ts` | all cases pass |
| Adapter unit | `vitest roughAnnotationAdapter.test.ts` | deterministic paths per id; theme stroke |
| Engine lock | `vitest hostWiringP01.test.ts` | 4/4 sole Fabric host |
| P09 honesty | `vitest toolShortcutTruth + canvasToolRail.a11y + canvasToolPaletteAuthority` | 23/23 |
| P06 continuity | reload step in `open3d-annotations-m-t.spec.ts` | same annotation ids |
| E2E | `playwright open3d-annotations-m-t.spec.ts` | `annotations.length` Δ ≥ 1 · `textAnnotations.length` Δ ≥ 1 · PNGs |
| Build | `pnpm --filter oando-site run build` | exit 0 |

**Evidence folder:** `results/planner/world-standard-wave/11-annotations-excalidraw/` — `SCOPE.md` (tier choice) · `HEAD.txt` · `VERDICT.md` · PNGs.

---

## 8. Owner decisions needed

| # | Decision | Options | Default |
|---|----------|---------|---------|
| **EX-1** | Tier scope | **A** only · **A+B** · **C** full embed | **A only** |
| **EX-2** | Visual roughness | Low (professional dimension) · medium · high hand-drawn | **Low** — owner design review |
| **EX-3** | M/T promotion timing | After P07 PASS · parallel with P07 (only if P07 baseline green) | **After P07 PASS** |
| **EX-4** | Text entry UX | Inline Fabric Textbox · modal · RAC dialog | Inline Textbox first |
| **EX-5** | Install + commit permission | Owner explicit | No install until EX-1 recorded in `SCOPE.md` |

---

## 9. Success criteria

1. **Tier A installed** with license rows in Lockedfiles + `excalidraw-MIT.txt` on disk.
2. **Annotations visible** on Fabric canvas when layer enabled; zero second interactive host.
3. **M/T live-tier** with P09 23/23 green and guidance strings honest.
4. **Save/reload** preserves annotation ids (P06 bar).
5. **E2E PNG evidence** in `11-annotations-excalidraw/`.
6. **Tier B** (if EX-1 = A+B) produces export JSON fragment with unit-tested bounds — no editor mount.
7. **Tier C not present** on plan routes unless owner EX-1 = C with isolated route proof.

---

## 10. Self-review

| Check | Result |
|-------|--------|
| Tier A/B/C recommendation explicit | ✅ A now, B before P16, C deferred |
| Fabric adapter architecture documented | ✅ §3 |
| Bundle + license risks | ✅ §4 |
| What NOT to do (incl. full embed on plan route) | ✅ §5 |
| Fabric sole preserved | ✅ invariants |
| Owner decisions without TBD | ✅ EX-1…EX-5 |
| Success criteria measurable | ✅ §9 |
| Aligns with CONSTRAINTS deferred tools | ✅ |
| No implementation code in spec | ✅ |
| No TBD placeholders | ✅ |

---

## 11. Handoff

**Owner gate first:** Record tier choice in `results/planner/world-standard-wave/11-annotations-excalidraw/SCOPE.md`.

**Execution plan:** `agents-work/2026-07-12-excalidraw-packages-remedy-plan.md`

**Dependency:** All-stages remedy design recommends fenced parallel — Excalidraw Tier A deps-only during P07 only if P07 baseline does not require `PlannerFabricStage` wall fixes.