# Planner-track constraints

| Record | Path |
|--------|------|
| Engine lock evidence | `results/planner/world-standard-wave/01-engine-lock/` |
| Package pins | `site/package.json` only |
| Execute card | [P02](./P02-engine-lock.md) |

| Topic | Decision |
|-------|----------|
| Approach | **A** - product journey first |
| Live 2D | Fabric `PlannerCanvasStage` sole host (Feasibility archived) |
| Forbidden | Second interactive 2D / silent Feasibility restore / "prove on flag-OFF Feasibility" |
| Raise gaps | Port select / Block2D / draw onto Fabric - never roll host back |
| Licenses | [`docs/Lockedfiles/03-dependencies-engines-current.md`](../../docs/Lockedfiles/03-dependencies-engines-current.md) |

Override only via [START.md](./START.md). Re-prove [CHECKPOINTS](./CHECKPOINTS.md) on this tree - do not trust old PASS.
