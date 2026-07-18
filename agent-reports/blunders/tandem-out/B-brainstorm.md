# B — Brainstorm (structure + copy only)

**Role:** Brainstormer · **Scope:** Linear desk parametric factory · **No code.**  
**Bar:** TANDEM-ENFORCE + WORLD-CLASS-UI-BAR · Feel like configure → publish, not debug Maker.

## Current form (brief)

Four fieldsets already: **Units · Size · Pedestals · Identity**. Dock: Preview | Form | Summary. One topbar **Publish**. Width syncs identity. Preview = Maker SVG. Pain: engineer labels, cascade graph paper, thin tests.

## Exact section map

| Order | Section | Fields (one place each) | Notes |
|-------|---------|-------------------------|--------|
| 1 | **Units** | Display unit: mm \| cm (radio) | Converts all size numbers; mm stays truth for publish |
| 2 | **Size** | Width, Depth, Height, Top thickness | Desk top + overall; unit in label |
| 3 | **Pedestals** | Arrangement (Dual / None), Width, Side inset, Gap under top, Back inset, Modesty panel | Hide pedestal dims when None; no dual editors |
| 4 | **Identity** | Name, SKU, Series, Slug | Form owns edit; Summary rail read-only mirror only |

**Chrome (not sections):** title “Linear desk”; eyebrow “Configure desk”; slug under title; **one** Publish; Summary: Name / SKU / Slug / Size; Plan preview plate.

## Copy labels (human, not engineer)

| Bad (kill) | Good |
|------------|------|
| Engine / multipath / form+Maker / IR | — (never in chrome) |
| pedestalTopGap / backInset camelCase | Gap under top · Back inset |
| Width (same for desk + pedestal) | Pedestal: **Pedestal width** · **Side inset** |
| Dual pedestals / None | **Two pedestals** · **No pedestals** |
| Arrangement | **Pedestal layout** |
| seriesId | **Series** |
| Fix fields to see the plan | **Fix highlighted fields to show the plan.** |
| Published. Live for guests as {slug} | Keep plain; no “descriptor/revision” |
| Edits live in Form… | **Change sizes and name here. Publish puts the desk in inventory for guests.** |

Labels: `Width (cm)` style is fine. Short help under control only if validation fails. No eye/pencil/list legend.

## CSS must NOT do

| Ban | Why |
|-----|-----|
| New chrome in `features/**` or co-located form CSS | Chrome only: `site/app/css/core/locked/chrome/` |
| New SVG paint outside `…/locked/svg/` | Paint boundary |
| Thrash root `theme.css` for this form | Tokens only |
| Hex/rgb in product UI CSS | `var(--*)` only |
| Graph paper under **form** stage | Freehand only; form stage **solid** (cascade-proof) |
| Fake dual Publish / dual Identity editors styled as equal | Honesty bar |
| Cheap native inputs with no focus ring craft | Stripe/Linear density |

CSS **may**: solid panel surfaces, density, focus, framed preview plate, reduced-motion.

## Tests must cover (name-mirror)

Path: `site/tests/unit/features/admin/svg-editor/parametric/LinearDeskParametricForm.test.tsx` (+ publish/model if touched).

| Must assert | Not enough |
|-------------|------------|
| Four section legends: Units, Size, Pedestals, Identity | Dock “mounts” only |
| One Publish control (`linear-desk-publish`); no second equal CTA | Screenshot load |
| Identity editable only in Form; Details slug read-only mirror | Stub Maker grey |
| Unit mm↔cm converts display numbers | Soft PASS redefine |
| Width change syncs identity (slug/SKU path as product does) | |
| Pedestal top gap + back inset bound and affect parse | |
| Invalid form blocks publish + shows field errors / blocked preview | |
| Valid publish success message includes guest slug | Multipath live, not stub |
| Preview uses same Maker path as publish (no alternate pen) | Theater chrome tests |

**Coverage:** new/changed form paths; no skip. Critic/review fail soft delivery.

## Done when

Non-engineer: *real product to sell desks.* Sections as above · human labels · locked CSS only · tests green for structure + publish + multipath.
