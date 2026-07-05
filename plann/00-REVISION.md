# 00 — Plan revision (2026-07-05)

**Status:** Locked coordinator decisions  
**Supersedes:** Conflicting lines in `01-START.md` §5/§8 and `04-HANDOVER.md` package list (pre-revision)  
**Does not replace:** `PACKAGES.md`, `plans/01-phase1-execution/01-implementation-decisions.md` — aligns `plann/` to them

## Authority stack (after this revision)

1. User message + `AGENTS.md`
2. `PACKAGES.md` + `implementation-decisions.md` (pins, routes, Option A)
3. **`plann/00-REVISION.md`** (this file — product sequencing)
4. `plann/01-START.md`, `02-PHASE-1.md`, `03-PHASE-2.md`, `04-HANDOVER.md`
5. `docs/Lockedfiles/<module>/proposed.md` (snapshot; refresh after plan edits)

When `plann/` and `PACKAGES.md` conflict on SVG tooling, **PACKAGES.md wins**.

---

## Decision 1 — SVG pipeline (Option A)

**Call:** Lock **Option A** for Phase 1. No SVG.js in the production path.

```text
Puck admin fields → Zod (SvgBlockDefinitionV1 / BlockDescriptor)
  → server deterministic compiler (svgCompiler.server.ts)
  → DOMPurify allowlist + SVGO
  → resvg PNG + Sharp thumbnails
  → disk persist (block-descriptors/) + R2 thumbs
  → planner reads compiled SVG + customerEditable params only
```

| Item | Phase 1 | Notes |
|------|---------|--------|
| `@puckeditor/core` | Yes | Admin compose + portal `Render`; mount full `<Puck>` in 1B |
| `@svgdotjs/*` | **No** | Deferred Tier-2; not required for Option A; remove from `package.json` when unused |
| `@flatten-js/core`, `polygon-clipping`, `svgo`, `@resvg/resvg-js`, `sharp` | Yes | Server / script pipeline |
| `dompurify` | Yes | Server sanitizer (`svgServerSanitizer.ts`) |
| Dual compile (exec `generate-svg.mjs` + in-process) | **Unify in 1B** | One module authority; script becomes thin CLI |

Supabase immutable revisions: **Phase 08** (PLAN-FAIL-0409). Phase 1B may use disk JSON + revision interface tests until migration lands.

---

## Decision 2 — Phase 1 split (1A then 1B)

Phase 1 is **two acceptance tracks**. Do not block 1A on full SVG publication.

### Phase 1A — Open3D shell (pilot)

**Goal:** Professional `/planner/open3d` workspace worth piloting.

| Priority | Work |
|----------|------|
| P0 | Wire `PlannerCommand` for all document mutations |
| P0 | Selection contract + zundo scope |
| P1 | Phosphor-only planner chrome; remove emoji/unicode controls |
| P1 | Bottom command / status surface (REC-03) |
| P1 | Catalog search cap ≤24 (REC-02) |
| P1 | Command palette (`Ctrl/Cmd+K`) |
| P2 | CSS hardcoding audit; panels IA (inventory left; layers contextual) |

**1A acceptance:** room → opening → place → edit → undo/redo → save → reload on `/planner/open3d`; route containment; tokens; no page scroll; evidence under `results/`.

**Explicitly not 1A gates:** full Puck editor, Supabase revision table, guest/canvas promotion.

### Phase 1B — SVG production path

**Goal:** Prove admin → publish → planner catalog for three reference variants.

| Priority | Work |
|----------|------|
| P0 | Mount `<Puck>` on `/admin/svg-editor/[id]`; `onPublish` → API |
| P0 | Unify compile path behind API |
| P1 | Publish ≠ save; compile failure blocks publish |
| P1 | Bridge `SvgBlockDefinitionV1` → catalog consumer (`BlockDescriptor` adapter until single model) |
| P2 | Three reference blocks end-to-end (fixed, configurable door, parametric cabinet) |

**1B acceptance:** §8–10 reference block checklist + determinism/security tests + boundary audit.

---

## Decision 3 — Icons

| Surface | Call |
|---------|------|
| Planner (`/planner/open3d`, guest, canvas) | **Phosphor only** (`@phosphor-icons/react`) |
| Admin CMS (catalog, svg-editor, CRM chrome) | **Lucide allowed** — intentional; not a planner violation |

---

## Decision 4 — Routes and promotion

| Route | Call |
|-------|------|
| `/planner/open3d` | Sole Phase 1 promotion target |
| `/planner/guest`, `/planner/canvas` | Unchanged until **Phase 2** after 1A+1B accepted on one revision |
| `/admin/svg-editor`, `/portal/svg-catalog` | In scope for **1B** |

---

## Decision 5 — Dual descriptor models (honest)

| Model | Role until migration |
|-------|---------------------|
| `BlockDescriptor` (`svgTypes.ts`) | Open3D catalog loader consumer today |
| `SvgBlockDefinitionV1` (`svgBlockSchemas.ts`) | Admin/compiler authority for new work |
| Bridge | Publish adapter emits loader-compatible JSON in 1B; single-model migration is explicit follow-up |

---

## Decision 6 — What we are not doing now

- SVG.js visual authoring
- Guest/canvas shell promotion
- Full Supabase revision persistence
- Merging `AdminCatalogManager` and svg-editor
- Bulk edits to `plans/archive/` or more archive moves
- Treating `docs/Lockedfiles/<module>/proposed.md` as law before this revision propagates

---

## Execution order (for agents)

```text
1. This revision (done)
2. Patched plann/01-START.md, PHASE-1.md, HANDOVER.md
3. Refresh domain *-proposed.md from plann (optional same session)
4. Code: PlannerCommand (1A) → Puck mount + unified compile (1B)
5. Update HANDOVER.md with evidence after each checklist group
```

---

## Research alignment

Agrees with `RESEARCH-2026-07-05-synthesis.md` P0: SVG authority, `PlannerCommand`, bundle boundaries.  
Defers Phase 1 §8–10 as **1B**, not blocking **1A**.

---

*Locked 2026-07-05. Next revision only when evidence changes pins or acceptance scope.*
