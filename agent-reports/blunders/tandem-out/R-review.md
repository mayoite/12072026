# R — Code review / rules audit (parametric factory tandem)

**Date:** 2026-07-18  
**Role:** R — CSS path, hex, cascade, boundary, tests (no product ship call)  
**Scope:** U working tree on parametric factory UI  
**Verdict: PASS**

Parent may merge **from R’s gate only** if C also PASS. This is not browser DoD, not T4.

---

## Audit method

- `git status` / `git diff` on U-touched CSS + form
- Grep: `#hex` / `rgb(` / `rgba(` under `locked/chrome`, form-related locked CSS, parametric
- Grep: style modules under `features/admin/svg-editor/parametric`
- Read cascade: `locked/admin/index.css` import order + stage rules
- Read / run multipath + publish unit tests
- Confirm `theme.css` not dirty / not thrashed this tandem

**U-touched (relevant):**

| Path | Role |
|------|------|
| `site/app/css/core/locked/chrome/studio-chrome.css` | form craft density |
| `site/app/css/core/locked/chrome/admin-svg-dock.module.css` | dock tokens |
| `site/app/css/core/locked/admin/svg-editor-shell.css` | stage cascade kill for form |
| `site/app/css/core/locked/svg/svg-preview.css` | preview plate paint |
| `site/features/admin/svg-editor/parametric/LinearDeskParametricForm.tsx` | form structure |
| `site/tests/unit/.../parametric/*.test.ts(x)` | T + U tests |

---

## Rule 1 — New `#hex` / `rgb(` in locked/chrome or form-related CSS U touched

**PASS**

| Surface | Result |
|---------|--------|
| `locked/chrome/**` (full tree) | **0** `#hex` / `rgb(` / `rgba(` |
| Added lines in U CSS diff | **0** new hex/rgb |
| `studio-chrome.css` | tokens + `color-mix(... var(--*) ...)` only |
| `svg-preview.css` | `--svg-*` / surface tokens only |
| `admin-svg-dock.module.css` | **removed** hex fallbacks (`#fff`, `#1e3a5f`) |

**Not FAIL (pre-existing, not U-introduced):**

| File:line | Snippet | Note |
|-----------|---------|------|
| `site/app/css/core/locked/admin/svg-editor-shell.css:199` | `var(--color-error, #b91c1c)` | pre-existing fallback |
| `site/app/css/core/locked/admin/svg-editor-shell.css:202` | same | pre-existing |
| `site/app/css/core/locked/admin/svg-editor-shell.css:207` | same | pre-existing |

U’s **new** form-stage block in that file (`:382–388`) is tokens only. Do not re-litigate old fallbacks as this tandem’s hex crime.

**TSX:** no `style={{...}}`, no inline hex in `LinearDeskParametricForm.tsx`.

---

## Rule 2 — New style modules under `features/admin/svg-editor/parametric`

**PASS**

- `Get-ChildItem` under `parametric/`: **no** `.css` / `.module.css` / `.scss`
- No `import` of CSS from parametric TS/TSX
- Chrome lives in `locked/chrome/`; paint in `locked/svg/` — correct home

---

## Rule 3 — Graph paper still winning on form-maker stage

**PASS** (cascade fixed in code; R did not screenshot)

### Why it used to lose

Base stage paints graph paper:

```362:376:site/app/css/core/locked/admin/svg-editor-shell.css
/* ── Canvas stage (freehand / sketch) — graph paper OK ── */
.admin-svg-engine-shell__stage {
  ...
  background:
    linear-gradient(...),
    linear-gradient(90deg, ...),
    var(--surface-muted);
  background-size: 24px 24px;
}
```

`locked/admin/index.css` loads **chrome first, shell last**:

```7:13:site/app/css/core/locked/admin/index.css
@import "../chrome/index.css";
@import "../svg/index.css";
...
@import "./svg-editor-shell.css";
```

Without a **higher-specificity** kill after the base rule, graph paper won over chrome’s solid stage. That was the real bug. Fixed.

### Kill rules (both present)

| Location | Selectors | Effect |
|----------|-----------|--------|
| `studio-chrome.css:61–72` | `.admin-svg-engine-shell__stage.admin-parametric-stage`, `[data-stage-engine="form-maker"]`, `.admin-parametric-stage` | `background-image: none` + solid `background-color` |
| `svg-editor-shell.css:382–388` | same stage dual-class / attribute (loads **after** chrome) | same kill — cascade-proof |

Specificity: base `(0,1,0)` vs kill `(0,2,0)`. Kill wins.

### Markup wiring

`LinearDeskParametricForm.tsx:123–126` stage slot:

- classes: `admin-svg-engine-shell__stage` + `admin-parametric-stage`
- attr: `data-stage-engine="form-maker"`

Both kill selectors match. Freehand keeps graph paper (`data-stage-engine="excalidraw"` only, no parametric class).

**Soft note (not FAIL):** solid stage is declared twice (chrome + shell). Redundant on purpose for load-order. Acceptable. Do not “clean up” the shell kill without re-proving cascade.

**R limit:** no live DOM computed-style proof. T4 owns eyes. Code says graph paper does **not** win.

---

## Rule 4 — Tests exist and mention multipath / publish

**PASS** (fresh run this session)

### Command (R re-ran)

```powershell
pnpm --filter oando-site exec vitest run `
  tests/unit/features/admin/svg-editor/parametric/LinearDeskParametricForm.test.tsx `
  tests/unit/features/admin/svg-editor/parametric/publishLinearDeskAction.test.ts `
  tests/unit/features/admin/svg-editor/parametric/linearDeskPublishDescriptor.test.ts
```

| Metric | Value |
|--------|--------|
| Exit | **0** |
| Files | 3 passed |
| Tests | **12 passed** |

### Multipath / publish mention map

| File | Multipath | Publish | Status |
|------|-----------|---------|--------|
| `LinearDeskParametricForm.test.tsx` | live Maker asserts `desk-top`, `pedestal-l`, `pedestal-r`; no grey stub | `linear-desk-publish` → action args widthMm 1600 + slug/sku | green |
| `publishLinearDeskAction.test.ts` | Maker SVG path in action contract | guest slug, live lifecycle, id reuse on republish | green |
| `linearDeskPublishDescriptor.test.ts` | — | mint / republish identity | green |
| `publishLinearDeskIsolatedPath.test.ts` | “Maker multipath SVG” in describe/it | pipeline write under temp roots | present (not re-run here; T reported suite green) |
| `linearDeskFormModel.test.ts` | multipath SVG / Maker part ids | — | present |

**Brutal truth on tests:** Dockview host is stubbed (correct). Maker is **not** stubbed for preview multipath — that is the honesty bar TANDEM-ENFORCE demanded. Unit green ≠ browser C3 publish. That is T4’s job.

---

## Rule 5 — `theme.css` thrash

**PASS**

| Check | Result |
|-------|--------|
| `git diff HEAD -- site/app/css/core/theme.css` | **empty** |
| Working tree `theme.css` | **clean** |
| Commits this tandem window on `theme.css` | **none** observed |

U stayed in `locked/chrome` + `locked/svg` + shell stage kill. No base theme thrash.

Historical `theme.css` edits (`85cc83dc`, `53a00406`) are **prior** studio-token work, not this tandem’s dirty tree. Not charged here.

---

## Boundary checklist (enforce table)

| Rule | Result |
|------|--------|
| CSS chrome → `locked/chrome/` | PASS — studio-chrome + dock module |
| CSS SVG paint → `locked/svg/` | PASS — svg-preview only |
| Banned: chrome in `features/**` | PASS — none |
| Banned: co-located form module | PASS — none |
| Banned: thrash `theme.css` | PASS |
| No new hardcode hex in product UI CSS | PASS |
| Graph paper freehand only | PASS (code) |
| Name-mirror tests for form + publish + multipath | PASS |

---

## Nits (not gate FAILs)

1. **Comment drift** — `LinearDeskParametricForm.tsx:27` still says `Preview | Form | Details` while titles use **Summary**. Docs lie; code is fine.
2. **Pre-existing shell hex fallbacks** (`#b91c1c`) — clean later if owner wants zero-fallback purity; not this merge’s crime.
3. **Excalidraw hex** in `elementFactory.ts` / `gridSnapping.ts` / `ExcalidrawClient.tsx` — authoring stroke colors for freehand, **not** form chrome, **not** U touch. Out of rule 1 scope.
4. **Canonical proof descriptors** in untracked `inventory/` + `svg-catalog/` (`oando-param-proof-*`) — process smell for catalog isolation; not R CSS gate. Parent should not treat untracked catalog dirt as R PASS evidence.

---

## Scorecard

| # | Rule | Verdict |
|---|------|---------|
| 1 | New hex/rgb in chrome / form CSS U touched | **PASS** |
| 2 | New style modules under parametric | **PASS** |
| 3 | Graph paper wins form-maker stage | **PASS** (code kill present) |
| 4 | Tests multipath / publish | **PASS** (12/12 green, this run) |
| 5 | theme.css thrash | **PASS** |

# **R = PASS**

No product code edits from R. Report only.

---

## Files reviewed (absolute)

- `E:\12072026\site\app\css\core\locked\chrome\studio-chrome.css`
- `E:\12072026\site\app\css\core\locked\chrome\admin-svg-dock.module.css`
- `E:\12072026\site\app\css\core\locked\chrome\index.css`
- `E:\12072026\site\app\css\core\locked\admin\svg-editor-shell.css`
- `E:\12072026\site\app\css\core\locked\admin\index.css`
- `E:\12072026\site\app\css\core\locked\svg\svg-preview.css`
- `E:\12072026\site\features\admin\svg-editor\parametric\LinearDeskParametricForm.tsx`
- `E:\12072026\site\tests\unit\features\admin\svg-editor\parametric\LinearDeskParametricForm.test.tsx`
- `E:\12072026\site\tests\unit\features\admin\svg-editor\parametric\publishLinearDeskAction.test.ts`
- `E:\12072026\site\tests\unit\features\admin\svg-editor\parametric\linearDeskPublishDescriptor.test.ts`
- `E:\12072026\agent-reports\blunders\TANDEM-ENFORCE.md`
- `E:\12072026\agent-reports\blunders\TANDEM-PROTOCOL.md`
