# CR-2 — Admin SVG editor UI / theme review

**Seat:** CR-2 (admin UI / theme)  
**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` only  
**Mode:** READ-ONLY — no product code edits  
**Scope:** `/admin/svg-editor` list + edit shells vs `docs/architecture/ADMIN-UI-CONTRACT.md` + `docs/architecture/MODULE-UI-CONTRACT.md` spirit  

**Surfaces reviewed (source):**

| Surface | Path |
|--------|------|
| List view | `site/features/planner/admin/svg-editor/AdminSvgEditorListView.tsx` |
| Edit view | `site/features/planner/admin/svg-editor/AdminSvgEditorEditView.tsx` |
| List RSC page | `site/app/admin/svg-editor/page.tsx` |
| Edit RSC page | `site/app/admin/svg-editor/[id]/page.tsx` |
| 3D islands (chrome) | `GlbExtruderPreview.tsx`, `ModelViewerPreview.tsx` |
| Admin shell | `site/app/admin/layout.tsx`, `AdminLayoutShell.tsx` |
| Admin CSS authority | `site/app/css/core/locked/admin/admin-pages.css` |
| Contracts | `docs/architecture/ADMIN-UI-CONTRACT.md`, `MODULE-UI-CONTRACT.md` |
| Lint gate | `site/scripts/lint-ui-contract.mjs` |

**Method:** Static code + CSS contract match (no live browser pass this seat). Compare TSX class vocabulary to locked admin primitives; scan for palette / hex / token / a11y residuals.

---

## Verdict

| Dimension | Result | Notes |
|-----------|--------|--------|
| **Overall CR-2** | **FAIL** (with salvageable shell) | Shell anatomy is real; primitive / palette / a11y bar not met |
| Page anatomy (`admin-page` header) | **PASS** | List + edit use contract shell |
| Admin layout bundle | **PASS** | `data-admin-layout` + `admin-pages.css` via admin layout |
| Primitives table (`admin-btn`, table wrap, badge) | **FAIL** | Marketing `btn-*`, orphan `admin-pill` / miswired table, invented BEM |
| Forbidden palette thrash | **FAIL** | Inline `#hex` + raw `red`/`#ccc` in 3D islands; inline style chrome |
| Theme-token residual | **PARTIAL PASS** | Descriptor schema + Puck preview reject `#hex`; **UI chrome** still thrashing hex |
| Icons (contract: Lucide admin) | **POLICY THRASH** | Phosphor in svg-editor (and whole admin); lint forbids Lucide under `features/planner/**` |
| Accessibility basics | **PARTIAL FAIL** | Good section labels / error `role="alert"`; unlabeled file input; no submit busy UI; success class dead |

**Ship honesty:** Backend publish path can be green without this UI contract being green. Do **not** paper-PASS “admin theme done.”

---

## 1. Page shells

### 1.1 Admin layout (good)

- `site/app/admin/layout.tsx` loads `@/app/css/core/locked/admin/index.css` and wraps children in `AdminLayoutShell`.
- Shell root: `data-admin-layout` on `.shell-admin-layout` — required by ADMIN-UI-CONTRACT “Bundle” and MODULE-UI-CONTRACT admin surface rule.
- Main landmark: `<main id="main-content">` — good baseline.

### 1.2 List RSC (`app/admin/svg-editor/page.tsx`)

- Thin loader → `AdminSvgEditorListView`. Correct path roots (`app/admin/**` + `features/planner/admin/**`).
- Imports `loadAll` from `features/planner/open3d/catalog/svg/...` — **cross-surface data import**. Contract forbids open3d **modules into admin views**; type/loader from open3d catalog is shared domain. Flag as **boundary smell** (not UI palette), not a hard chrome fail for this seat.

### 1.3 Edit RSC (`app/admin/svg-editor/[id]/page.tsx`)

- Loads descriptor / `new` default; binds `publishSvgEditorAction`; mounts `AdminSvgEditorEditView`.
- Extra bare `<div>` wrapper around the view — harmless noise.
- `new` default stamps `themeTokens: { currentColor: "currentColor" }` — correct semantic residual (no hex).

### 1.4 List + edit view anatomy (good skeleton)

Both views use:

```tsx
<div className="admin-page">
  <header className="admin-page__header">
    … eyebrow / title / copy …
  </header>
  …
</div>
```

Matches ADMIN-UI-CONTRACT “Page anatomy (required)” and reference CRM/themes pages.

| Shell piece | List | Edit |
|-------------|------|------|
| `admin-page` | yes | yes |
| `admin-page__header` / `__eyebrow` / `__title` / `__copy` | yes | yes |
| `admin-page__actions` | yes (New block) | n/a (header identity only — intentional per comment) |
| `admin-page__meta` | yes | yes |
| `admin-empty` | yes | n/a |
| `admin-puck-editor` | n/a | yes (has CSS) |
| `admin-alert--error` | n/a | yes (has CSS) |
| `admin-alert--success` | n/a | **used; CSS missing** |

---

## 2. Palette thrash (slate / hex / wrong dialect)

### 2.1 No raw Tailwind palette utilities in svg-editor views

`lint-ui-contract.mjs` forbids `slate|blue|zinc|gray|emerald|neutral|stone` palette classes under admin roots.

**ListView / EditView:** no `slate-*` / `gray-*` etc. in `className` strings.  
Semantic utilities used correctly where present: `text-muted` (allowed by ADMIN-UI-CONTRACT).

### 2.2 Wrong button dialect (HIGH)

Contract primitives:

| Required | Actual (ListView) |
|----------|-------------------|
| `admin-btn admin-btn--primary` | `btn-primary inline-flex gap-2 px-3 py-2 text-sm` |
| `admin-btn admin-btn--outline` | `btn-outline inline-flex gap-2 px-3 py-1.5 text-xs` |

`btn-primary` / `btn-outline` are **site marketing / global button utilities** (`app/css/core/components/buttons.css`), not admin primitives defined under `[data-admin-layout]`.

Theme editor (`ThemeEditor.tsx`) already uses `admin-btn admin-btn--*`. SVG editor did not follow the admin gold path — **dialect thrash**.

### 2.3 Orphan / invented admin BEM (HIGH — visual thrash residual)

Used in TSX but **no rules** in `admin-pages.css` (grep authority = locked admin CSS):

| Class used | Defined in `admin-pages.css`? | Impact |
|------------|-------------------------------|--------|
| `admin-pill` / `admin-pill--{variant}` | **No** | Variant chips unstyled |
| `admin-page__summary` | **No** | Summary grid unstyled |
| `admin-page__summary-card` / `--fixed|configurable|parametric` | **No** | Cards unstyled |
| `admin-page__summary-card-title/value/copy` | **No** | Typography unstyled |
| `admin-table__element` | **No** | Wrong attachment point |
| `admin-table__slug` / `__sku` | **No** | Link/SKU secondary style missing (closest real: `__primary` / `__secondary`) |
| `admin-page__back-link` | **No** | Back link unstyled |
| `admin-page__section` / `__section-title` | Only `details summary` partial | Weak section chrome |
| `admin-page__field-list` / `__field-row` | **No** | Field cartography unstyled |
| `admin-page__checksum` | **No** | Cosmetic only |
| `admin-alert--success` | **No** (only `--warn/--error/--info`) | Success banner has base border only |

### 2.4 Table primitive miswire (HIGH)

Contract + CSS:

```text
admin-table-wrap  →  overflow wrapper
admin-table       →  <table> itself
```

ListView actually does:

```tsx
<div className="admin-table">
  <table className="admin-table__element">
```

So table styles targeting `[data-admin-layout] .admin-table thead th` etc. attach to a **div**, not the table. Sticky header / row hover / padding **do not apply as designed**. This is residual “looks like admin table but isn’t.”

### 2.5 Inline style + hex chrome (HIGH) — 3D islands

ADMIN-UI-CONTRACT Forbidden:

> Inline hex / `style={{ color: '#...' }}` for chrome (allowlisted product previews only)

| File | Finding | Severity |
|------|---------|----------|
| `ModelViewerPreview.tsx` | `backgroundColor: "#f3f4f6"`, `color: "#6b7280"`, `color: "red"` | **HIGH** — gray hex = Tailwind gray-100/500 dialect smuggled as inline |
| `GlbExtruderPreview.tsx` | default `color = "#ffffff"` (mesh material — product-ish), UI: `border: "1px solid red"`, `#ccc`, `#000` spinner | **HIGH** for chrome; material hex **MEDIUM** (preview mesh) |
| `AdminSvgEditorEditView.tsx` | GLB section: multiple `style={{ padding, margin, fontSize }}` | **MEDIUM** — spacing thrash outside tokens/utilities |
| EditView | `className="… shell-workspace-card"` | **MEDIUM** — **cross-surface** class from `shell-workspace.css` (site/workspace), not admin panel |

**No `slate-*` class strings** in these files — thrash is **hex + inline + wrong surface class**, which `lint:ui` **does not catch** (lint only scans Tailwind palette class names, not hex in admin TSX).

### 2.6 Icons policy thrash (MEDIUM — system)

| Authority | Rule |
|-----------|------|
| ADMIN-UI-CONTRACT / MODULE-UI-CONTRACT | Lucide in admin; Phosphor in open3d |
| `lint-ui-contract.mjs` `checkNoLucideInPlanner` | Forbids `lucide-react` under **all** `features/planner/**` (includes admin) |
| Reality (svg-editor + AdminLayoutShell + adminNav) | **Phosphor everywhere** |

Svg-editor uses `@phosphor-icons/react` (`Plus`, `ArrowsClockwise`, `ArrowLeft`, `Sparkle`). Consistent with **current admin monorepo practice**, inconsistent with **written admin contract**. Not unique to svg-editor — do not “fix to Lucide” until contract vs lint is reconciled (lint would fail Lucide under planner admin).

---

## 3. Theme token crash residual

### 3.1 Data path (good — residual closed at schema)

- `BlockDescriptorThemeTokensSchema` (§02-CAT-07) rejects `#hex` values; keys must be `currentColor` or `--kebab`.
- Puck registry documents the same forbid; preview SVG uses `fill="currentColor"` / `stroke="currentColor"` only.
- Field cartography row surfaces `themeTokens` as **count of semantic references**, not raw hex dump — avoids re-display crash of illegal colors.

### 3.2 UI residual still open

| Residual | Where | Risk |
|----------|-------|------|
| Success alert class dead | `admin-alert--success` | Success looks like generic alert; easy to miss publish OK |
| Orphan summary / pill classes | List + edit summary | “Theme” of variant cards never applied — looks unfinished / broken layout |
| Hex in model-viewer chrome | ModelViewerPreview | Reintroduces gray scale outside token system (classic thrash vector) |
| Extruder error/loading hex borders | GlbExtruderPreview | Same; also uses literal `red` |
| No live theme-token editor chrome | Puck `themeTokens` field is opaque object field | Operators cannot easily verify token map in UI without cartography expand |
| `formState.submitting` never rendered | EditView | No busy / disabled chrome during publish — feels like hang or double-submit risk |

**Conclusion:** Descriptor **theme-token crash** (hex in tokens) is **gated at Zod**. **Admin chrome residual** still thrashing hex/inline and dead success styling — that is the CR-2 residual to burn down.

---

## 4. Accessibility basics

### 4.1 Strengths

| Control | Evidence |
|---------|----------|
| Section labeling | `aria-label` on variant balances, variant summary, field cartography, GLB section, Puck editor |
| Table caption | `<caption className="sr-only">` on list table |
| Column headers | `scope="col"`; empty actions col has `aria-label="Actions"` |
| Decorative icons | Several icons `aria-hidden` (RefreshCw, ArrowLeft, Sparkles) |
| Error semantics | `role="alert"` + `admin-alert--error` on publish failures |
| Success semantics | `role="status"` on success (class incomplete; role OK) |
| Empty state | Text empty state present |
| Model-viewer alt | Default `alt="A 3D model"`; prop overridable |
| Extruder headless root | `aria-hidden="true"` when idle |

### 4.2 Gaps (actionable)

| Issue | Severity | Detail |
|-------|----------|--------|
| SVG file input unlabeled | **HIGH** | EditView `<input type="file" accept=".svg" …>` has no `<label>`, `aria-label`, or visible name |
| “New block” Plus icon not `aria-hidden` | **LOW** | Adjacent text “New block” present; still noisy for some AT |
| `formState.submitting` not exposed | **MEDIUM** | No `aria-busy`, no live “Publishing…” status, no disable of Puck publish during flight |
| Success vs error styling | **MEDIUM** | Error has CSS; success does not (`--success` missing) — status harder to perceive visually |
| `sr-only` dependency | **LOW/MED** | `sr-only` defined in planner locked CSS, not admin-pages; relies on global/Tailwind availability. If absent in admin bundle, caption may not hide |
| Extruder error UI | **MEDIUM** | Error text in plain `<p>` inside styled div; no `role="alert"` |
| ModelViewer error | **MEDIUM** | Text only, no `role="alert"` |
| Edit summary hierarchy | **LOW** | Variant summary uses `<p className="…-title">` not heading; list cards correctly use `<h2>` |
| Puck a11y | **OUT OF SEAT** | Vendor chrome; ensure publish errors still surface in admin alerts (they do for action/POST path) |

---

## 5. Contract checklist (svg-editor module)

From ADMIN-UI-CONTRACT “Checklist (new admin route)” + MODULE-UI-CONTRACT “New module checklist”:

| Check | Status |
|-------|--------|
| Route in `app/admin/`; view in `features/planner/admin/` | **PASS** |
| `admin-page` shell | **PASS** |
| Primitives from admin table (`admin-btn`, panel, table wrap, badge/alert) | **FAIL** — `btn-*`, wrong table, invented pill/summary |
| No raw Tailwind palette classes | **PASS** (class scan) |
| No inline hex for chrome | **FAIL** (ModelViewer / GlbExtruder / residual) |
| Icons: Lucide admin | **FAIL vs contract** / **PASS vs current monorepo + lint** |
| No open3d **UI** copy into admin | **PASS** (no open3d CSS modules); type/loader import smell |
| Bundle via admin layout only | **PASS** |
| `lint:ui` palette | **Likely PASS** for these files (hex not gated) |
| Puck styles match `admin-panel` chrome | **PARTIAL** — `admin-puck-editor` exists; GLB section uses `shell-workspace-card` |

---

## 6. File-by-file findings

### `AdminSvgEditorListView.tsx`

- Shell: **good**.
- Summary cards: invent BEM without CSS → unstyled thrash.
- Buttons: marketing `btn-primary` / `btn-outline` instead of `admin-btn--*`.
- Table: `admin-table` on wrapper + `admin-table__element` on table → CSS miss.
- Pills: `admin-pill--*` undefined; should be `admin-badge` (+ optional variant modifiers if added to CSS) or real summary tokens.
- A11y: solid table caption + scopes; empty state OK.
- Icons: Phosphor (policy thrash, not local bug).

### `AdminSvgEditorEditView.tsx`

- Shell + back link structure: **good intent**; `admin-page__back-link` unstyled.
- Alerts: error OK; success class dead.
- Field cartography in `<details>`: good minimize pattern; field list classes unstyled.
- GLB section: inline styles + `shell-workspace-card` cross-surface.
- File input: **no label**.
- Puck mount in `admin-puck-editor`: **matches locked CSS**.
- `submitting` state tracked but never rendered.
- Imports open3d **types** only for descriptor shape.

### Page shells

- List page: clean RSC.
- Edit page: clean RSC + server action bind; bare wrapper div only nit.

### `ModelViewerPreview.tsx` / `GlbExtruderPreview.tsx`

- Functional islands; **chrome palette thrash** is concentrated here.
- Prefer `admin-alert--error`, `text-muted`, `bg-soft` / CSS vars, or a thin `admin-preview` class under admin CSS — not `#f3f4f6` / `#6b7280`.

---

## 7. Priority fix order (recommendations only — no edits this seat)

1. **P0 — Wire real admin primitives on list**  
   - Buttons → `admin-btn admin-btn--primary|outline`  
   - Table → `admin-table-wrap` > `table.admin-table`  
   - Chips → `admin-badge` (or add real variant badges to `admin-pages.css` once, then use them)

2. **P0 — Kill dead classes or define them once**  
   Either delete invented BEM (`admin-pill`, `admin-page__summary*`, …) and use panel/grid/badge, **or** add a single locked CSS block under `admin-pages.css` (token vars only). Do not leave orphan class names.

3. **P0 — `admin-alert--success`**  
   Mirror `--error` pattern with `--color-success` so publish success is visible.

4. **P1 — Strip hex chrome from 3D islands**  
   Replace `#f3f4f6` / `#6b7280` / `#ccc` / literal `red` with semantic classes or `var(--*)`. Keep mesh material color as prop default only if product preview allowlist is explicit.

5. **P1 — Label SVG file input + expose `submitting`**  
   Visible label; `role="status"` / “Publishing…”; consider `aria-busy` on editor section.

6. **P1 — Drop `shell-workspace-card` from admin edit**  
   Use `admin-panel` (+ padding utilities / admin section) instead of workspace shell dialect.

7. **P2 — Icon policy reconciliation (program, not one file)**  
   Decide: change ADMIN-UI-CONTRACT + MODULE-UI-CONTRACT to Phosphor for admin **or** carve lint exception / move admin out of `features/planner` Lucide ban. Svg-editor should not be a one-off Lucide island while shell is Phosphor.

8. **P2 — Theme-token field UX**  
   When polish lands: show token key→value pairs (semantic only) in cartography or Puck helper, not only a count.

9. **P3 — `lint:ui` gap**  
   Consider extending lint to flag `#[0-9a-fA-F]{3,8}` and `style={{` color props under `features/planner/admin/**` (chrome), or admin will keep reintroducing hex that palette-class lint misses.

---

## 8. What is already good (do not thrash)

- Correct `admin-page` header anatomy on both views.
- Admin layout `data-admin-layout` + locked admin CSS import path.
- Error alert primitive + `role="alert"` on publish failure.
- Puck container class `admin-puck-editor` with real CSS (REC-01 minimize note).
- Descriptor + registry **forbid hex theme tokens** — data path is the right anti-crash gate.
- Preview geometry uses `currentColor`, not donor hex.
- Semantic `text-muted` usage is contract-legal.
- List empty state uses real `admin-empty`.

---

## 9. Evidence index

| Evidence | Location |
|----------|----------|
| Admin primitives authority | `site/app/css/core/locked/admin/admin-pages.css` (`.admin-btn*`, `.admin-table*`, `.admin-alert--*`, `.admin-puck-editor`) |
| Contracts | `docs/architecture/ADMIN-UI-CONTRACT.md`, `MODULE-UI-CONTRACT.md` |
| List thrash classes | `AdminSvgEditorListView.tsx` L78–180 (`btn-primary`, `admin-pill`, `admin-table` on div) |
| Edit thrash | `AdminSvgEditorEditView.tsx` L307–372 (success alert, inline styles, file input, shell-workspace-card) |
| Hex chrome | `ModelViewerPreview.tsx` L81–109; `GlbExtruderPreview.tsx` L30, L120–129 |
| Theme token schema | `site/features/planner/open3d/catalog/svg/svgTypes.ts` §02-CAT-07 / HEX_LITERAL_REGEX |
| Lint gap | `site/scripts/lint-ui-contract.mjs` — admin palette class only; no admin hex scan |

---

## 10. One-line CR-2 summary

**Admin svg-editor has the right page shell and token-safe descriptor path, but fails ADMIN/MODULE UI spirit on primitives (btn/table/pill), dead success/summary CSS, hex inline chrome in 3D islands, unlabeled file input, and invisible submit state — treat theme polish as open work, not shipped.**

---

*End CR-2 — no product code changed. Artifact only under `results/planner/admin-svg-working/`.*
