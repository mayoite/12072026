# C — Extreme critic (parametric factory)

**Date:** 2026-07-18  
**Role:** C · FAIL soft work · no product edits  
**Scope:** parametric form + `locked/chrome` + `locked/svg` + form-section unit tests  
**Verdict: PASS**

Re-read after ~4 min window. Peers present: B, U, T, R. Not incomplete.

---

## Hard FAIL checklist (any one = FAIL)

| # | Condition | Result | Evidence |
|---|-----------|--------|----------|
| 1 | Graph paper still on form stage (cascade) | **CLEAR** | Base grid lives on `.admin-svg-engine-shell__stage` in `svg-editor-shell.css` (loads **after** chrome). Form kill is **after** that rule: compound `.admin-svg-engine-shell__stage.admin-parametric-stage` / `[data-stage-engine="form-maker"]` sets shorthand `background: var(--color-surface-raised, …)` — full reset of gradient layers. Same solid reinforce in `studio-chrome.css`. Import order (`admin/index.css`): chrome → svg → … → shell last. Dock scrollable stage uses `panelFill` (solid), not `panelFillStage` (grid). Freehand grid intentionally retained. |
| 2 | Hex hardcodes in chrome CSS they added | **CLEAR** | Grep `#hex` / `rgb(` / `rgba(` under `locked/chrome/**` → **0**. `studio-chrome.css` tokens + `color-mix(... var(...) ...)`. `svg-preview.css` `--svg-*` only. Pre-existing `#b91c1c` fallbacks in **admin** shell elsewhere are not new chrome craft. |
| 3 | Chrome CSS outside `locked/chrome` | **CLEAR** | Form craft BEM (`.admin-parametric-form*`) in `locked/chrome/studio-chrome.css`. Paint in `locked/svg/svg-preview.css`. **No** `.css` / module under `features/admin/svg-editor/parametric/`. Shell form-stage override in `locked/admin/svg-editor-shell.css` is **required cascade ownership** (shell owns base stage grid; shell must kill it for form). Not “chrome dumped in features.” |
| 4 | No new/updated unit tests for form sections | **CLEAR** | `LinearDeskParametricForm.test.tsx` updated this tandem. **6/6 green** (re-run 2026-07-18, critic). Asserts legends **Units · Size · Pedestals · Identity**, one Publish, Details read-only, live multipath Maker SVG, publish args, `aria-invalid` + blocked preview. |
| 5 | Engineer slogans still in UI | **CLEAR** | No `form + Maker`, no `Engine:…`, no status-engine testid, no “Publish to disk.” Copy is product language: Configure desk, Pedestal layout, Two/No pedestals, Gap under top, Plan preview, Ready to publish. `data-stage-engine="form-maker"` is DOM contract, not chrome prose. Code comments with “Maker” are not UI. |
| 6 | Dual publish buttons | **CLEAR** | Single `data-testid="linear-desk-publish"` top-bar submit. Tests: `getAllByTestId` length 1 + one `button` named `/^Publish$/i`. No details-rail Publish. No `linear-desk-publish-top`. |

**No hard FAIL hit.**

---

## Craft real? (not theater)

| Surface | Judgment |
|---------|----------|
| Form structure | Four fieldsets, human labels, hide pedestal dims when none (`hasPedestals`) |
| Stage surface | Solid panel cascade-proof (chrome + shell) |
| Controls | Unit segment focus-within, field focus ring, invalid ring, select chevron via tokens |
| Preview | Framed plate in `locked/svg`; multipath ids `desk-top` / `pedestal-l` / `pedestal-r` from **live** `renderLinearDeskSvg` (not grey stub) |
| Publish honesty | One CTA; success via `formatLinearDeskPublishSuccess` (slug + SKU) |
| Density | Section cards, 2-col grid, max-width form column — not empty CAD costume |

This is product form craft, not a legend strip + dual CTA costume.

---

## Tests real?

### Form UI (required)

```text
pnpm --filter oando-site exec vitest run \
  tests/unit/features/admin/svg-editor/parametric/LinearDeskParametricForm.test.tsx
→ 6 passed, exit 0
```

| Case | Real? |
|------|-------|
| Section legends Units/Size/Pedestals/Identity | Yes |
| One Publish / no details editors | Yes |
| Ready status | Yes (`/Ready/i` — soft matcher, still true for “Draft ready”) |
| Live multipath preview | Yes (Maker not stubbed) |
| Publish payload 1600 + guest slug/SKU | Yes |
| Invalid width blocks publish + preview | Yes |

### Model / publish (supporting, already there)

`linearDeskFormModel` covers mm↔cm + width identity sync. Publish id-reuse tests exist. Good.

### Soft (not hard FAIL — still called out)

1. **T left matchers loose:** dock titles `Summary|Details`; success only requires slug + `/Published/i` (does not pin SKU). Soft TDD. Suite still proves structure + multipath + one Publish.
2. **No form-component test** for pedestal hide when “No pedestals,” or unit radio → display convert (model tests cover convert; form hide is U-only). Residual coverage gap, not “no section tests.”
3. **Full parametric folder re-run:** 31 pass / **1 fail** — `proofSlugLoad.test.ts` expects artifact `published` and got `missing` (disk SVG absent for sample proof slug). **Not a form-section failure.** Stale/env proof artifact. Do not launder form PASS into C3 disk PASS.
4. **C did not browser-shot** this gate. Code + unit only. T4 / parent still own live `localhost:3000` visual if reopened.

---

## Peer state (incomplete?)

| Peer | Present | Notes |
|------|---------|-------|
| B brainstorm | Yes | Section map + copy + CSS bans — U largely implemented |
| U UI | Yes | Form + chrome + shell cascade + svg paint |
| T TDD | Yes | Form tests extended; claimed 32 green — **now** proofSlugLoad red |
| R review | Yes | PASS on hex/path/cascade; aligned with C on hard rules |

Not incomplete. Others finished.

---

## What would still FAIL if re-opened tomorrow

- Graph paper returns if someone deletes shell form-stage block and only leaves weak chrome rule  
- Second Publish sneaks into Details  
- “Engine: form → Maker…” copy returns  
- Form tests deleted or hollowed to mount-only  
- New hex in `locked/chrome`  

None of those are true **now**.

---

## Bottom line

**PASS.** Hard fail list: all CLEAR. Craft is real. Form-section unit tests are real and green (6/6).  

Not a trophy: T matchers are slightly soft; full parametric suite has an unrelated proof-disk red; browser not re-proved by C. Those are residuals, not hard fails.

**Parent:** merge only if parent still wants browser C3 separately — C does not claim disk publish or guest place.
