# PARTIALS inventory — O&O open3d / world-standard wave

**Date:** 2026-07-09  
**Checkout:** `D:\OandO07072026` (main only; no worktrees)  
**HEAD at write:** `37f4f63` (`feat(open3d): P04 pose continuity unit + guest client node:fs fix`)  
**Method:** Evidence from NOTES + logs only. Plan checkboxes not trusted. Product code not edited.

## Sources (read)

### world-standard-wave NOTES
- `results/planner/world-standard-wave/00-product-truth/NOTES.md`
- `results/planner/world-standard-wave/00-start/NOTES.md`
- `results/planner/world-standard-wave/01-engine-lock/NOTES.md`
- `results/planner/world-standard-wave/02-browser-open3d-journey/NOTES.md` (+ `playwright-raw.log`, `run.json`)
- `results/planner/world-standard-wave/03-select-delete/NOTES.md` (+ `unit-vitest.log`, `playwright-raw.log`)
- `results/planner/world-standard-wave/04-orbit-continuity/NOTES.md` (+ `pose-continuity-vitest-raw.log`, `playwright-raw.log`)
- `results/planner/world-standard-wave/05-symbols-svg/04-svg-honesty/NOTES.md`
- `results/planner/world-standard-wave/06-save-honesty/NOTES.md` + `save-reload/NOTES.md` (+ e2e log)
- `results/planner/world-standard-wave/07-systems-v0/NOTES.md` (+ mesh/batch/configurator artifacts)
- `results/planner/world-standard-wave/08-mesh-quality/NOTES.md` (+ vitest + visual smoke)
- `results/planner/world-standard-wave/09-shortcuts-chrome/NOTES.md`
- `results/planner/world-standard-wave/screenshots-2026-07-09/NOTES.md`

### recent slice NOTES
- `results/planner/rotation-degrees-radians/NOTES.md` (+ `vitest-raw.log` 22/22)
- `results/planner/export-honesty/NOTES.md` (+ `vitest-raw.log` 4/4)
- `results/planner/wall-delete-cascade/NOTES.md` (+ `vitest-raw.log` 5/5)
- `results/planner/opening-select/NOTES.md` (+ `vitest-raw.log` 23/23)
- `results/planner/workstation-boq-priced/NOTES.md` (+ `vitest-raw.log` 5/5)
- `results/planner/plans-structure/NOTES.md` (plans tree hygiene only)

### git log -15 --oneline (at write)

```
37f4f63 feat(open3d): P04 pose continuity unit + guest client node:fs fix
a400701 feat(open3d): select doors and windows on plan canvas
2f29259 docs: real tests over coverage numbers — purpose not percent
df2f656 docs: phase tests required even if small (~10% ok, zero not)
0b371e9 docs: tests are part of each phase/slice — not deferred
d8e646e fix(open3d): cascade door/window delete when wall is removed
62a14e3 fix(open3d): honest export menu — drop PDF/PNG until real
2c4c0d7 docs: mirror mayoite every ~45 min of work
dbc5500 chore: enforce repo layout with check:layout on gates
7bc9bb8 docs: Agents-testing paths match root-only results layout
6eb4013 chore(layout): enforce root results and tech-stack paths; purge site dumps
5f097d5 feat(open3d): systems v0 BOQ list prices INR + GST; plans tree hygiene
b4ffb14 docs(plans): structure live tree + fix dead plan path references
2ce6f90 fix(open3d): convert furniture rotation degrees to scene radians
c426a88 docs: mark parallel-for-context as owner-explicit (was already in 19)
```

---

## Surface inventory

Format per row: **Landed** | **Partial residual** | **Evidence path** | **Suggested next single slice**

### 1. W3 select / delete (furniture)

| Field | Content |
|-------|---------|
| **Landed** | Pure multi-id delete + keyboard Delete/Backspace preventDefault + Esc clear; browser place → Select → Delete → Ctrl+Z green. |
| **Partial residual** | Next-full-build still blocked by `/contact` createContext (pre-existing; e2e used turbopack dev). W3 unit pack pre-dates wall-cascade case (cascade is separate slice). No claim that every entity type is browser-proven here — furniture path only. |
| **Evidence path** | `results/planner/world-standard-wave/03-select-delete/` (`NOTES.md`, `unit-vitest.log` 30/30, `playwright-raw.log` 1 passed, shots 01–04) |
| **Suggested next single slice** | None required for furniture W3 bar; fold non-furniture select into openings browser proof (below). |

### 2. Openings select (doors / windows)

| Field | Content |
|-------|---------|
| **Landed** | `pickOpeningAtPoint`; select order furniture → opening → wall → room; unit door/window nearest + miss. Commit `a400701`. |
| **Partial residual** | **Unit-only.** No dedicated Playwright e2e that click-selects a door/window, deletes it, or edits properties in browser. Prior product gap (openings not pickable) is closed in pure/canvas wiring evidence only. |
| **Evidence path** | `results/planner/opening-select/` (`NOTES.md`, `vitest-raw.log` 23/23 `canvasPicking`) |
| **Suggested next single slice** | One browser spec: place wall + door → Select hit on opening → status/properties show door → Delete removes opening only. |

### 3. Wall cascade (delete wall → doors/windows)

| Field | Content |
|-------|---------|
| **Landed** | `applySelectionDelete` + `deleteEntityFromProject` filter doors/windows by `wallId` (no orphans). Commit `d8e646e`. Unit case green. |
| **Partial residual** | **Unit-only.** No browser proof that UI/keyboard wall delete clears openings on that wall. |
| **Evidence path** | `results/planner/wall-delete-cascade/` (`NOTES.md`, `vitest-raw.log` 5/5 including cascade case) |
| **Suggested next single slice** | One browser or integration path: wall with door → delete wall → assert 0 doors/windows for that wallId. |

### 4. W4 orbit / continuity (2D ↔ 3D pose)

| Field | Content |
|-------|---------|
| **Landed** | Orbit defaults (prior); **document ↔ scene pose continuity unit green** (`poseContinuityW4.test.ts`); document rotation degrees vs scene radians asserted; guest `/planner` **node:fs / NodeIO client 500 fixed** (webpack fallbacks + server-only GLB validate). Rotation fix: furniture degrees → scene radians (`2ce6f90`, `rotation-degrees-radians`). |
| **Partial residual** | **Browser e2e not green.** `open3d-w4-orbit-continuity.spec.ts` **failed**: place furniture count stayed 0 (`expect > 0`, 25s poll). NOTES explicitly stop without thrashing weak e2e. Optional left-drag orbit not required for land. |
| **Evidence path** | `results/planner/world-standard-wave/04-orbit-continuity/` (`NOTES.md`, `pose-continuity-vitest-raw.log` 1 passed, `playwright-raw.log` 1 failed); related: `results/planner/rotation-degrees-radians/` |
| **Suggested next single slice** | Stabilize W4 Playwright only: reuse proven systems-v0 / W3 place helpers → assert furniture +1 → 3D `data-orbit-enabled` → 2D same count. Do not reopen unit pose math. |

### 5. W1–W2 journey (guest → wall → place → 2D/3D)

| Field | Content |
|-------|---------|
| **Landed** | Browser green: guest enter → draw wall (delta) → place ≥2 catalog → 2D/3D radios; open3d native chrome only (no fabric step-bar). |
| **Partial residual** | One-run journey proof, not a full regression matrix. Marketing `/products` + `/contact` still HTTP 500 under turbopack (orthogonal; see screenshots NOTES). Product-truth note that README route table is slightly stale remains. |
| **Evidence path** | `results/planner/world-standard-wave/02-browser-open3d-journey/` (`NOTES.md`, `playwright-raw.log` 1 passed, `run.json` status browser-green, shots 01–06); screenshots pack: `screenshots-2026-07-09/NOTES.md` |
| **Suggested next single slice** | Keep journey non-reg when changing place helpers; do not expand journey scope until W4 browser residual closed. |

### 6. W5–W6 save (local honesty + hard reload)

| Field | Content |
|-------|---------|
| **Landed** | Autosave flush on unmount/pagehide/visibility + explicit Save; labels “Saved locally” / “Draft saved locally” (no bare server claim); hard-reload restores furniture count (IDB). Unit 12/12 + browser 1/1. |
| **Partial residual** | **Local-first only** — not cloud/member save as default open3d path (00-product-truth non-claim). Guest title often remains “Untitled plan”; W5 signal is furniture count, not title. |
| **Evidence path** | `results/planner/world-standard-wave/06-save-honesty/` + `save-reload/` (`NOTES.md`, `06-playwright-raw.log` 1 passed, shots 01–03) |
| **Suggested next single slice** | Only if owner wants: member/cloud save honesty bar as a separate gate — not a silent extension of W6. |

### 7. Systems v0 configurator / batch

| Field | Content |
|-------|---------|
| **Landed** | Rules + catalog matrix + place path; free configurator panel + Place; Place 2/4/10 batch; place/select/delete e2e; multi-part `workstation-v0` mesh plan (role boxes); Block2D workstation symbols. Multiple browser greens (configurator, place, batch, mesh-batch shots, place-delete). |
| **Partial residual** | Still **boxy multiparts** (no legs/handles/photoreal). Free height deferred. Client multi-tenant catalogs not done. Fabric cutover not done. 00-product-truth still says workstation geometry “box until modular mesh” — **stale** relative to 07 mesh land (treat 07 NOTES as newer code truth). |
| **Evidence path** | `results/planner/world-standard-wave/07-systems-v0/` (`NOTES.md`, `vitest-mesh-v0-raw.log` 34/34, configurator/batch/place PNGs + run.jsons) |
| **Suggested next single slice** | Owner-pick: free height control **or** one visual-smoke PNG pack for workstation-v0 (not both). Avoid photoreal thrash. |

### 8. BOQ priced (workstation v0)

| Field | Content |
|-------|---------|
| **Landed** | List unit prices INR + GST 18%; subtotal/gst/total; export JSON + quote cart names; unit 5/5. Commit `5f097d5`. |
| **Partial residual** | **Demo list schedule** only — not multi-tenant ERP / live catalog prices (NOTES honest section). Optional BOQ panel UI still “optional next” in 07 NOTES. |
| **Evidence path** | `results/planner/workstation-boq-priced/` (`NOTES.md`, `vitest-raw.log` 5/5) |
| **Suggested next single slice** | Thin BOQ panel UI showing priced lines for current project (still demo schedule) — only if owner prioritizes quote UX over W4 residual. |

### 9. Export honesty

| Field | Content |
|-------|---------|
| **Landed** | TopBar Export: JSON · SVG · BOQ · quote cart only; PDF/PNG removed from menu; preflight READY = json/svg; pdf/png/dxf → unsupported + honest message. Commit `62a14e3`. Unit 4/4. |
| **Partial residual** | PDF/PNG/DXF still unsupported by design until real exporters exist. No browser e2e of export menu in this slice (unit preflight only). |
| **Evidence path** | `results/planner/export-honesty/` (`NOTES.md`, `vitest-raw.log` 4/4) |
| **Suggested next single slice** | When shipping a real format: implement one exporter + flip READY only for that format (no menu theater). |

### 10. Layout enforcement

| Field | Content |
|-------|---------|
| **Landed** | Root `check:layout` (`scripts/check-repo-layout.mjs`) wired into root `gate` / `gate:full` and site release gates; root-only `results/` + tech-stack path hygiene; purge of site dumps. Commits `6eb4013`, `dbc5500`. Agents-testing paths aligned (`7bc9bb8`). Plans live tree hygiene (`b4ffb14`, `plans-structure`). |
| **Partial residual** | No dedicated `results/planner/*/NOTES.md` pack that re-runs `pnpm run check:layout` with a saved log in world-standard-wave (evidence is git + package.json wiring). Layout gate does not fix marketing route 500s. |
| **Evidence path** | git `dbc5500` / `6eb4013`; root `package.json` scripts `check:layout`, `gate`; `results/planner/plans-structure/NOTES.md` |
| **Suggested next single slice** | Optional: drop one `check:layout` raw log under `results/planner/layout-gate/` when next gate is run — do not invent new layout rules mid-wave. |

### 11. Mesh (cabinet-v0 bar + workstation multiparts)

| Field | Content |
|-------|---------|
| **Landed** | **Cabinet-v0 W7 bar:** named parts `toe` / `carcass` / door parts; locked geometry constants; part plan === mesh; unit pack 48/48; headless SVG→PNG visual smoke. **Workstation-v0:** multi-part role Group (desk/return/pedestal/panel/overhead), browser 3D batch shot. |
| **Partial residual** | Explicitly **not photoreal**: no handles/hinges/AO; simple materials; toe is recessed box not full plinth assembly; smoke is plan-projected SVG not WebGL beauty. Workstation residual same family (boxy multiparts). Success metric remains BOQ/quote > photoreal (01-engine-lock / 08 NOTES). |
| **Evidence path** | `results/planner/world-standard-wave/08-mesh-quality/`; workstation mesh section of `07-systems-v0/NOTES.md` + `42-workstation-mesh-3d.png` |
| **Suggested next single slice** | Do **not** start photoreal materials next. If mesh work continues: one readability upgrade (e.g. cabinet handle tick **or** workstation leg posts) with unit name locks — only after W4 browser residual. |

### Related landed (not a named surface above, for honesty)

| Surface | Status | Evidence |
|---------|--------|----------|
| Engine lock (Feasibility interim, Fabric destination OFF, Three orbit ON) | Written freeze; Fabric not cut over (expected) | `01-engine-lock/NOTES.md` |
| Shortcuts map-driven keydown (D/M/N/T truth) | PASS unit matrix | `09-shortcuts-chrome/NOTES.md` |
| SVG path honesty (publish vs canvas Block2D) | Smoke batch 4/4; open3d plan ≠ svg-catalog authority | `05-symbols-svg/04-svg-honesty/NOTES.md` |

---

## Partial residual rank (highest value first)

1. **W4 browser orbit/continuity e2e** — only serial wave gate with explicit red Playwright after unit land. Blocks honest “2D↔3D continuity product-ready” claim.  
2. **Openings select browser proof** — unit closed a real pick gap; buyer path still unproven in e2e.  
3. **Wall delete cascade browser proof** — pure fix is small and high-confidence; still no UI path evidence.  
4. **BOQ panel UI / multi-tenant prices** — priced pure path exists; demo schedule only.  
5. **Mesh photoreal / free height / Fabric cutover** — intentionally deferred; lower value than continuity per program metric.

---

## Stop line

**Do not start new phase until residual W4 browser orbit/continuity e2e (place → 3D orbit attr → 2D furniture count restore) is closed.**

Rationale: unit pose continuity and guest loadability already shipped (`37f4f63`); the open red log is browser place/count flakiness, not missing math. Starting a new phase while W4 browser remains red re-opens the wave’s continuity claim without evidence.
