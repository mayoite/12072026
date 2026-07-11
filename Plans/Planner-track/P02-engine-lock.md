# P02 — Engine lock

**Status:** OPEN / REPROVE — not complete. Old `01-engine-lock/` packs are clues only.

**Gate:** CP-02 — lock 2D/3D stack in writing so later phases do not thrash engines.  
**Evidence:** `results/planner/world-standard-wave/01-engine-lock/` only (never `02-engine-lock/`).  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · binding: [CONSTRAINTS](./CONSTRAINTS.md) · [BOARD](./BOARD.md)

**Goal:** Confirm locked stack once; ship W1–W8 on that path. No mid-wave engine vote.

**Approach A:** FeasibilityCanvas + document model first. Fabric.js v7 = **destination** 2D (not abandoned). Three + orbit ON = planner 3D. **No** Konva+Fabric hybrid.

---

## Locked stack (do not re-debate in P03+)

| Layer | Choice | Live today |
|-------|--------|------------|
| 2D destination | Fabric.js v7 full stage | Furniture overlay flag OFF — `canvas-fabric-stage/` |
| 2D interim | FeasibilityCanvas | Sole interactive 2D on open3d |
| 3D planner | Three + R3F path + OrbitControls default ON | `Lazy3DViewer` / `ThreeViewerInner` |
| 3D admin preview | `@google/model-viewer` | Admin SVG only — not planner workspace |
| Hybrid ban | One interactive 2D engine | Fail → Konva **full** only if Fabric proven unworkable |

```
Document (UUID, mm)
  → 2D dest: Fabric · 2D interim: Feasibility · 3D: Three+orbit
  → Persist: IDB first (P06) · Catalog/mesh later phases
```

**Pins:** from `site/package.json` only — no upgrades in P02. Record in `PACKAGE-PIN.md`.

**Licenses:** `@fancyapps/ui` unused? clear or remove (ask before buy). `gsap` used → `ayushdocs/17-LICENSES-CLEARED.md` row.

---

## Anti-thrash

- Do **not** re-open engines in P03+.
- Do **not** invent second interactive 2D mid-wave.
- Success metric: quote/BOQ path > photoreal thrash.
- Research under `D:\websites\…` = inspiration only — no competitor assets in `site/`.

---

## Evidence checklist (unchecked)

- [ ] `ENGINE-LOCK-RECORD.md` — stack + Approach A + folder lock
- [ ] `FLAG-INVENTORY.md` — `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` etc. (code truth)
- [ ] `ENTRYPOINT-MAP.md` — Feasibility / Fabric stage / Lazy3D / hosts
- [ ] `PACKAGE-PIN.md` — exact versions from package.json
- [ ] `OWNER-SIGNOFF.md` or written deferral (no silent green)
- [ ] `ANTI-THRASH-AUDIT.md` — no second 2D; CONSTRAINTS match tree or drift noted
- [ ] Fabric/flag unit re-run logged (no product engine swap)
- [ ] CONSTRAINTS.md matches live tree or drift recorded

**Out of scope:** W3 select/delete · W4 browser pack · Fabric walls cutover · package upgrades · photoreal · multiplayer.

**Next:** [P03](./P03-select-delete.md) only after CP-02 fresh proof or owner WAIVE.
