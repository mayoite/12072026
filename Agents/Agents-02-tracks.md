# Agents/Agents-02-tracks.md

**One open ID per track.** Parallel **across** tracks OK.

| OK | Forbidden |
|----|-----------|
| S1 + A1 + P07 | P01 + P02 (same track) |
| SEC1 + P03 (diff packages) | S1 + S2 (same track) |

| Track | Prefix | Live paths (flat — no `phases/`) |
|-------|--------|----------------------------------|
| **Planner** | P01–P16 | `Plans/Planner-track/BOARD.md` · flat `PXX-*.md` cards |
| **Admin** | A1–A8 | `Plans/Admin-track/BOARD.md` · flat `AX-*.md` cards |
| **Site** | S1–S2 | `Plans/Site-track/BOARD.md` · `S1-deps-cleanup.md` · `S2-site-chrome.md` |
| **SEO** | SEO1… | `Plans/SEO-track/BOARD.md` only (no phase cards yet) |
| **Security** | SEC1… | `Plans/Security-track/BOARD.md` · `SEC-hardening.md` |

**Upgrade lock (Planner):** Fabric sole 2D (`open3d-fabric-stage`). Feasibility / `canvas-feasibility` does not / will not exist. Reject archive `planner-2d-canvas` proof.

Status → `Plans/` · evidence → `results/` only. Do not open `Plans/*/phases` or `Plans/*/modules` (removed).
