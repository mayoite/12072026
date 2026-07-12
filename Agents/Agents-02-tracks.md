# Agents/Agents-02-tracks.md

**One open phase per track.** Parallel **across** tracks OK.

| OK | Forbidden |
|----|-----------|
| Admin P01 + Planner P02 | Planner P01 + P02 (same track) |
| Security P01 + Site P01 (diff packages) | Site P01 + P02 (same track) |

| Track | Phases | Path |
|-------|--------|------|
| **Planner** | P01–P12 | `plan/Planner/` |
| **Admin** | P01–P07 | `plan/Admin/` |
| **Buyer** | P01–P05 | `plan/Buyer/` |
| **UI** | P01–P02 | `plan/UI/` |
| **Site** | P01–P02 | `plan/Site/` |
| **SEO** | P01–P05 | `plan/SEO/` |
| **Security** | P01–P06 | `plan/Security/` |

**Upgrade lock (Planner):** Fabric sole 2D (`planner-fabric-stage`). Feasibility / `canvas-feasibility` does not / will not exist.

Status → `plan/` · evidence → `results/` only · blockers → `Failures.md`.