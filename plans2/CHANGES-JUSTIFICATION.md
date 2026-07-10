# CHANGES-JUSTIFICATION — plans2 vs raw idiotplanners2

**Purpose:** Justify every material synthesis change between the ten per-phase `plans2/**/IMPLEMENTATION-PLAN.md` files and this **master executable package** under `plans2/`.

**Source resolution:** Historical. Live execute = **`plans1/START-HERE.md`**. This package = Idiots wave reference only.

**CODE-REVIEW-REPORT.md:** **Present** under `plans2/P0X-*/` (all 10 phases). Older “missing” claim was **stale** — do not re-assert it.

**Repo snapshot used:** 2026-07-10 · HEAD `cb62c4e…` (re-read at execute) · **`results/` MISSING**.

---

## Executive themes

### Why re-prove, not rewrite

idiotplanners2 plans consistently document **product code already landed** for open3d W surfaces (select/delete, orbit helper, multi-prim Block2D, toe mesh, map-driven shortcuts, local autosave skeleton). What is **missing** is the **file-of-record** under `results/planner/world-standard-wave/`. Rewriting green product would thrash Approach A and invent RED.

**plans2 rule:** Default Mode A = **verify → residual fix → deposit evidence**. Mode B = repair only on real regression. Mode C greenfield = only if code actually missing.

### Why path corrections

Phase cards and older notes still mention `Plans/trustdata/`, root `ayushdocs/`, `CHECKPOINTS.md`, and retired evidence folder names. Live tree uses `Plans/phases/`, `Plans/Research/`, `Plans/Research/Others/`, and RESULTS-MAP **FINAL folder lock**. plans2 uses **only live paths**.

### Why 00-START and P11 exist

idiotplanners2 has P01–P10 only. Execution needs:

- **00-START** — session zero, prereqs, first commands, stop rules (RESULTS-MAP also lists CP-00 / `00-start/`).
- **P11** — integration / world-standard **close-out after residuals** so “all CPs green on paper” cannot replace a final cross-gate re-read + buyer smoke + dual language (GATE ≠ product).

### Why kill-order merges / drops

Kill order is **not reinvented**. It is the Approach A spine already in:

- `Plans/INDEX.md` / `Plans/README.md`
- idiotplanners2 P01 § kill-after-CP-01 and each phase adjacency

plans2 **does not** reorder spine. It **adds** P00 and P11 bookends and forbids parallel thrash across phases.

### Why evidence Mode A/B honesty

P10 idiotplanners2 already defines Mode A FAIL-honest vs Mode B PASS vs H4 hybrid. With **`results/` absent**, Mode B is **blocked**. plans2 elevates that honesty to package level so every phase refuses paper PASS.

---

## Change table

| Change | From (plan claim / raw shape) | To (this package) | Justification | Source |
|--------|-------------------------------|-------------------|---------------|--------|
| **Source tree** | Owner message “idiotplanners1” | Use **`plans2/`** only | Folder missing on disk; sibling trees mapped | Owner mission + disk list_dir |
| **Exclude plans1/** | Could confuse with Idiots2 plans | Explicit non-authority for plans2 | Other agent / plans1 lane; different brainstormer wave | plans2/README; mission |
| **No code reviews** | Might expect CODE-REVIEW-REPORT per phase | State **absent**; plan from plans + repo | No review files under idiotplanners2 | Disk list_dir |
| **Brainstormer path** | Plans cite `Idiots/…` | Prefer **`archive/Idiots/…`** if root missing | Root Idiots moved to archive | archive/Idiots present |
| **Re-prove all gates** | Phase headers DONE/PASS 2026-07-09 | Treat as **stale** until artifacts land | Entire `results/` missing | idiotplanners2 all phases §Repo reality; this session |
| **Residual-first tasks** | Some tasks still written as full TDD greenfield | Master tasks = **residual + re-prove**; deep code in idiotplanners2 | Avoid thrash of landed code | P03 Mode A; P04–P05–P08–P09 postures |
| **Kill order bookends** | P01…P10 only | **P00 → P01…P10 → P11** | Session zero + final integration | RESULTS-MAP CP-00; owner P11 requirement |
| **00-START card** | Scattered Task 00s per plan | One **executable** start card | Single session bootstrap | Owner deliverable; RESULTS-MAP `00-start/` |
| **P11 checklist** | Not in idiotplanners2 | New integration gate after residuals | Prevent “P10 pack done = ship” | Owner mission; GATE≠product (P10) |
| **Evidence folder P11** | — | Optional `11-world-standard-closeout/` | Separate close-out from P10 pack ceremony | plans2 addition; NOTES pointer OK |
| **Canonical evidence paths** | Occasional aliases / historical names in older prose | **RESULTS-MAP only** (00-product-truth, 01-engine-lock, 02-browser…, 09-shortcuts) | Folder lock supersedes retired names | RESULTS-MAP FINAL |
| **trustdata paths** | Still in some phase cards | **Ignore**; use Plans/phases + Research | Tree cleaned 2026-07-10 | Plans/INDEX; P01/P10 plans |
| **ayushdocs** | Cited as claims corpus | Use `Plans/Research/Others/*` when ayushdocs missing | Relocated honesty docs | P01 plan §1.1 |
| **Orbit wiring prose** | Some docs: “omit enableControls” | Document **`getOpen3dViewerControlProps()` spread** | Live code stronger lock | P02/P04 plans + orbitDefaults.ts |
| **Document rotation** | Early notes: radians everywhere | **Degrees in document; radians in nodes** | Live units contract | P04 plan; units.ts |
| **applySelectionDelete API** | Appendix return-pair draft | Live **project-only** return | Repo wins; no signature thrash | P03 plan |
| **P05 empty-box** | Expert 2-prim baseline | Multi-prim **already shipped**; re-prove | Do not re-apply storage fill | P05 plan |
| **P08 toe** | Honesty baseline “no toe” | Toe present; **evidence-first closeout** | Stale expert prose | P08 plan |
| **P07 journey** | Partial guest/configurator spec | **Rewrite bar** (open3d primary, cabinet-v0, Opening Δ) | Spec exists but fails CP-07 honesty | P07 plan gap matrix |
| **P06 residual list** | Flush exists | Still fix help lies, testids, projectRef, id W5 | Real product debt remains | P06 §1.2 |
| **P09 residual** | Map invert shipped | aria-keyshortcuts + rail Dimension/Wall + evidence | Historical smoking gun mostly fixed | P09 plan |
| **P10 default mode** | Mode B aspirational | Default **Mode A** or H4 if owner restores | Mode B blocked without D: results | P10 plan §0.2 |
| **Fabric during proofs** | Flag optional | **OFF required** for W2/W3 symbol/select proofs | Flag ON draws plain Rects | P03/P05 |
| **Configurator place** | Used in some e2e as success | **Forbidden as sole CP-07 green** | Manufacturer bar | P07 plan |
| **Unit-alone W3** | Tempting | **Unit alone = FAIL** | Design + P03 hard rule | P03 Done when |
| **plans2 vs Plans/** | Could replace phase cards | Phase cards remain **product how**; plans2 = **execute synthesis** | Do not invent second program plan tree as authority over INDEX | AGENTS master plan alignment |
| **No product code in package write** | — | Planning-only land | Mission constraint | Owner |
| **Do not touch plans1/** | — | Hard fence | Other agent | Owner |
| **HEAD honesty** | Plans say re-read at execute | Package records `cb62c4e` + dirty; executor re-reads | Epistemic law | This session git log |
| **Package pins** | Lists in P02 | Re-confirm from `site/package.json` at execute | fabric `7.4.0`; three/r3f carets | P02 + live package.json |
| **CHECKLIST-MASTER** | Not in idiotplanners2 | Flat P00–P11 board | Operator convenience | Owner preferred extras |
| **REFERENCES** | Scattered absolute paths | One map | Reduce path thrash | Owner preferred extras |
| **Cross-cutting false-green catalog** | Per-phase catalogs | Master catalog in EXECUTABLE-PLAN | Shared traps (paper PASS, site/results, Fabric ON) | Synthesis |
| **Commit sequence** | Per-phase | Master sequence by kill order | Avoid stranded remote mid-spine | AGENTS git rules |
| **Idiots2 reports** | Available in archive | **Not** authority | idiotplanners2 wave = Idiots only | idiotplanners2 README |
| **Global-standard modules** | Successor plan exists | **Out of residual wave** until P11 | Avoid multi-epic thrash | P10 appendix; AGENTS one phase |
| **E: backup** | Cited in P10 | Optional restore source; never silent claim green | Historical ≠ re-proven on HEAD | P10 |

---

## Non-changes (YAGNI)

| Kept as-is | Why not change |
|------------|----------------|
| Approach **A** (Feasibility interim, Fabric dest later) | Design + all plans locked |
| W1–W8 gate definitions | Design spec authority |
| Serial kill spine P01→P02→P03→P07→P06→fill→P10 | INDEX + plans agree |
| No Konva hybrid | Engine lock |
| BOQ/quote > photoreal | Engine + mesh residual honesty |
| Furniture rotation **degrees** in document | Live model |
| Evidence only under root `results/` | AGENTS layout |
| No competitor copy | Ethics |
| P02 default zero product implementation | Evidence freeze phase |
| P10 no site feature code | Pack-only phase |
| Fabric exact pin `7.4.0` | Package lock |
| Dimension shortcut **M** (not D) | W8 product law |
| cabinet-v0 as W2/W7 hero SKU | Design + plans |

---

## Per-phase posture summary (synthesis, not thrash)

| Phase | idiotplanners2 posture | plans2 master task posture |
|-------|------------------------|----------------------------|
| P01 | Inventory only; re-create pack | Same — evidence + matrix; no open3d feature edits |
| P02 | Evidence freeze; unit re-run | Same |
| P03 | Mode A residual + browser mandatory | Same — unit alone FAIL |
| P04 | Verify + evidence; code landed | Same |
| P05 | Re-prove multi-prim; honesty NOTES | Same |
| P06 | Residual close (real code debt) | Same — top residual list in master |
| P07 | Rewrite journey to bar | Same — real test residual |
| P08 | Evidence-first mesh closeout | Same |
| P09 | Re-prove + aria residual | Same |
| P10 | Mode A / H4 / Mode B | Same; default Mode A if results missing |
| — | — | **+ P00, P11** |

---

## Honesty about what plans2 is not

- Not a replacement for `plans2` deep TDD steps (those remain the long form).
- Not a claim that product is buyer-shippable after pack files exist.
- Not a second monorepo plan authority that overrides owner messages or `AGENTS.md`.
- Not a license to skip reading the active phase’s IMPLEMENTATION-PLAN when coding.

---

## Self-check of this justification

- [x] Source resolution idiotplanners1→2 stated  
- [x] Missing code reviews stated  
- [x] Re-prove vs rewrite justified  
- [x] Path corrections justified  
- [x] P00 + P11 justified  
- [x] Kill-order bookends justified (spine not reordered)  
- [x] Mode A/B evidence honesty elevated  
- [x] Non-changes listed (YAGNI)  
- [x] Table: Change | From | To | Justification | Source  
