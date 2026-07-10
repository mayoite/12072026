# CHECKLIST-MASTER — P00–P11 flat board

Tick **only** when evidence paths exist on this machine (or explicit WAIVE with owner).  
Source plans: **`idiotplanners2/`**. Package: **`plans2/`**.

Kill order: **P00 → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11**

---

## P00 — Session zero (`00-START.md`)

- [ ] Main checkout `D:\OandO07072026` (no worktrees)
- [ ] HEAD + status recorded
- [ ] `results/` presence known (missing → re-prove posture)
- [ ] `idiotplanners1` missing acknowledged; source = `idiotplanners2`
- [ ] `pnpm run check:layout` OK
- [ ] Active phase = P01 (unless owner override)

**Evidence:** `results/planner/world-standard-wave/00-start/NOTES.md` (preferred)

---

## P01 — Product truth (baseline)

**Plan:** `idiotplanners2/P01-product-truth/IMPLEMENTATION-PLAN.md`  
**Folder:** `00-product-truth/`

- [ ] Evidence dir created
- [ ] `INVENTORY.md` with path:line cites
- [ ] `CONTRADICTIONS.md` (include X01 results missing if applicable)
- [ ] W1–W8 matrix no blanks (browser-missing OK)
- [ ] Vitest smoke log + `run.json` vitestSmoke ∈ ok|failed|skipped
- [ ] Dual-state: CP artifacts vs buyer product
- [ ] P02 freeze list ≤1 page
- [ ] **No** open3d feature product edits

---

## P02 — Engine lock

**Plan:** `idiotplanners2/P02-engine-lock/IMPLEMENTATION-PLAN.md`  
**Folder:** `01-engine-lock/`

- [ ] `NOTES.md` map minimum
- [ ] `ENGINE-LOCK-RECORD.md` (Fabric dest / Feasibility interim / Three+orbit / no hybrid / SKU / BOQ)
- [ ] Documents live `getOpen3dViewerControlProps()` (not stale omit-only)
- [ ] `PACKAGE-PIN.md` matches `site/package.json`
- [ ] Fabric flag unit re-run logged
- [ ] Orbit unit re-run logged
- [ ] `FLAG-INVENTORY.md` + `ENTRYPOINT-MAP.md`
- [ ] `ANTI-THRASH-AUDIT.md`
- [ ] Owner sign-off **or** written deferral
- [ ] No Fabric cutover / Konva / package upgrade claims

---

## P03 — W3 select / delete / undo

**Plan:** `idiotplanners2/P03-select-delete/IMPLEMENTATION-PLAN.md`  
**Folder:** `03-select-delete/`

- [ ] Unit pack exit 0 (pick, delete, keyboard, undo id/pose)
- [ ] Residual unit gaps closed if still red (canvas select, etc.)
- [ ] Browser pack green (Select → Delete → undo)
- [ ] Fabric flag OFF documented
- [ ] **Unit alone not claimed as W3**
- [ ] `run.json` + raw logs + PNGs when browser claimed

---

## P07 — W1–W2 browser journey

**Plan:** `idiotplanners2/P07-draw-place-journey/IMPLEMENTATION-PLAN.md`  
**Folder:** `02-browser-open3d-journey/`

- [ ] `getFurnitureCount` helper landed / used
- [ ] Journey serial ≥120s
- [ ] open3d primary + guest fallback; `routeUsed` recorded
- [ ] W1 walls Δ + Opening/objects Δ
- [ ] W2 ≥2 SKUs including **cabinet-v0**; not configurator-only
- [ ] Canvas PNG byteLength > 5000
- [ ] Screenshots 01–07 + playwright-run/run.json
- [ ] npm script `test:e2e:world-standard-w1w2` (or documented equivalent)
- [ ] Alias NOTES if `07-browser-journey/` used

---

## P06 — W5–W6 save honesty

**Plan:** `idiotplanners2/P06-save-honesty/IMPLEMENTATION-PLAN.md`  
**Folder:** `06-save-honesty/` (+ `save-reload/`)

- [ ] Help/copy no account over-claim (local-only default)
- [ ] Stable save testids / storage attributes
- [ ] Residual flush/`projectRef` debt closed or NOTES residual
- [ ] W5 hard reload **same entity ids** (not count-only)
- [ ] W6 dual surface labels honest
- [ ] Cloud Task 07 cancelled with NOTES **or** owner-unlocked green
- [ ] Artifacts under canonical folders

---

## P04 — W4 orbit continuity

**Plan:** `idiotplanners2/P04-orbit-continuity/IMPLEMENTATION-PLAN.md`  
**Folder:** `04-orbit-continuity/`

- [ ] Three-layer audit regeneratable
- [ ] Pose continuity units logged
- [ ] Orbit units logged (`orbitControlsDefault.test.tsx`)
- [ ] Browser left-drag + 2D↔3D **or** written deferral
- [ ] Degrees document honesty
- [ ] No R3F rewrite of open3d viewer

---

## P05 — W2 symbols / SVG honesty

**Plan:** `idiotplanners2/P05-symbols-svg/IMPLEMENTATION-PLAN.md`  
**Folder:** `05-symbols-svg/`

- [ ] cabinet-v0 Block2D vitest green + log
- [ ] ≥4 prims; front≠back; doorStyle variance
- [ ] `furnitureBlockUsesCenteredPath` false
- [ ] Honesty NOTES (Block2D ≠ publish SVG)
- [ ] Visual prim-JSON and/or PNG
- [ ] Fabric OFF for proof
- [ ] browser place journey deferred-to-P07 honesty

---

## P08 — W7 mesh quality

**Plan:** `idiotplanners2/P08-mesh-quality/IMPLEMENTATION-PLAN.md`  
**Folder:** `08-mesh-quality/`

- [ ] NOTES bar doc with numbers
- [ ] Primary + blast vitest logs
- [ ] Visual smoke PNGs + checklist
- [ ] toe → carcass → door matrix
- [ ] run.json
- [ ] Residual: no handles / not photoreal stated
- [ ] No designer static GLB

---

## P09 — W8 shortcuts / chrome

**Plan:** `idiotplanners2/P09-shortcuts-chrome/IMPLEMENTATION-PLAN.md`  
**Folder:** `09-shortcuts-chrome/`

- [ ] toolShortcutTruth / keyboard matrix green + log
- [ ] No second hard-coded letter table
- [ ] Rail Label (Key) includes Dimension (M), Wall (W), Select (V), Opening (O)
- [ ] Feasibility `aria-keyshortcuts` residual closed
- [ ] Hide-tools inventory or `chrome-hide-tools: none` NOTES
- [ ] Evidence pack complete

---

## P10 — Evidence handover

**Plan:** `idiotplanners2/P10-evidence-handover/IMPLEMENTATION-PLAN.md`  
**Folder:** `10-handover/`

- [ ] Mode locked (A / B / H4) with owner context
- [ ] Six files: README, W-GATES, MASTER-SYNC, HEAD, FAILURES-SNIP, BACKUP-LOG
- [ ] No site product edits under P10
- [ ] Mode B only if D: wave greens real
- [ ] GATE ≠ product language explicit

---

## P11 — Integration close-out

**Plan:** `plans2/P11-CHECKLIST.md`  
**Folder:** `11-world-standard-closeout/` (or `10-handover/p11/`)

- [ ] CROSSWALK re-read all gates
- [ ] Cross-cutting asserts
- [ ] Integration smoke logged
- [ ] Dual language
- [ ] Mode A or B exit criteria met honestly

---

## Quick status key

| Mark | Meaning |
|------|---------|
| `[ ]` | Not done / unproven |
| `[x]` | Proven with path this session |
| `WAIVE` | Owner written waive + residual risk |

**Never** mark `[x]` because a markdown phase header says PASS.
