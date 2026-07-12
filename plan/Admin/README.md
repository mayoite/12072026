# Admin track

**HEAD:** `7807198d` · **Module:** `site/features/planner/admin/` · **Engine:** SVG.js (authoring) — never Fabric here.

Phases are **independent files**, executable in parallel by their own agent. `blocks-on` names the only real dependency.

- **Checklist:** one per track — [CHECKLIST.md](./CHECKLIST.md) (the single tickable "done").
- **Failures:** root — [../FAILURES.md](../FAILURES.md) (real execution red only).
- **Proof:** a live run gates each tick; `results/` is a dump, never the authority.

## Phases
| File | Owns | Parallel? | Blocks on |
|------|------|-----------|-----------|
| [PHASE-01-authoring-quality.md](./PHASE-01-authoring-quality.md) | Symbols stop being flat stubs | yes | — |
| [PHASE-02-catalog-lifecycle.md](./PHASE-02-catalog-lifecycle.md) | Bulk import / item states | yes | 01 |
| [PHASE-03-studio-tools.md](./PHASE-03-studio-tools.md) | Node inspector, history, drafts | yes | 01 |
| [PHASE-04-workstation-family.md](./PHASE-04-workstation-family.md) | Workstation system authoring (contract) | yes | 01,02 |
| [PHASE-05-pricing-boq.md](./PHASE-05-pricing-boq.md) | Price books (contract) | yes | — |
| [PHASE-06-release-audit.md](./PHASE-06-release-audit.md) | Approve / rollback / audit | yes | 01 |
| [PHASE-07-studio-disk-proof.md](./PHASE-07-studio-disk-proof.md) | Scene → publish bytes on disk | yes | — |

## Owner locks
- SVG authoring = **SVG.js, in admin only**. What you draw *is* the artifact — clean bytes. Fabric's `toSVG()` is banned here (lossy). `svgPackageBoundaries.test.ts` stays green.
- Admin does **not** block Planner: the two meet at **contracts** (published SVG, price-book JSON, workstation-family JSON). Each side builds against a fixture and integrates at the seam.

## Cross-phase notes
Publish multipath tasks (`publishMultipath.test.ts`, pipeline multipath, `stages.ts` S7) live in
PHASE-01. Catalog SVG owner lock → [HYGIENE.md §D](../HYGIENE.md).

**PHASE-07** closes scene → publish disk proof. Code landed; product green requires draw → live
compile → Publish → bytes in `public/svg-catalog/{slug}.svg`. Kill list until P07 green: minimap,
pen/path, multi-select, templates, command palette.

## Already DONE (verified in code — do not reopen)
- Admin SVG publish E2E (`admin-svg-publish-p01.spec.ts`), pipeline census (5 live / 5 published / 0 orphans), production auth (`devAuthBypass.ts` false-in-prod).
- Scene→blocks bridge (unit). **Not** studio disk product green — that is PHASE-07.

## Contracts this track owns (Planner consumes)
| Contract | File / shape | Planner consumer |
|----------|--------------|------------------|
| Symbol SVG | `public/svg-catalog/{slug}.svg` + `BlockDescriptor` | Planner PHASE-01 |
| Price book | price-book JSON | Planner BOQ / P15 |
| Workstation family | family JSON | Planner P12 configurator |
