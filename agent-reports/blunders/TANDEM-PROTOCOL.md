# Tandem protocol — parametric factory UI (parent-run)

**Date:** 2026-07-18  
**Why:** Solo Grok thrash failed. Owner requires 3–4 agents in tandem or leaves for Claude.  
**Not PASS proof.**

## Shared goal (ONE)

Make **Admin parametric** (`/admin/svg-editor/parametric/`) look and behave like a **calm order factory**, not engineer scaffolding — then prove load + basic publish path.

### Visual DoD (must all be true)

1. No graph-paper under form fields (solid/panel surface).  
2. No decorative Dock legend / fake always-on Dock toggle.  
3. **One** primary Publish control (not top + details duplicate).  
4. Identity: edit once (form); Details = read-only mirror.  
5. Kill engineer slogans in chrome (“form + Maker”, long Engine:… prose) — short human labels only.  
6. Preview labeled, multipath desk readable; not empty theater.  
7. Density: fields usable without drowning in empty grid.  
8. Tokens only — no new hex in chrome. CSS under `locked/chrome` (chrome) / `locked/svg` (paint).

### Factory DoD (same tandem window if UI unblocks)

9. Browser: width 160 cm → preview OK → Publish → disk artifact for slug (C3 bar).  
10. Console 0 on that journey.

### Non-goals

Site marketing polish, Planner redesign, DB cutover, multi-type furniture, Aria-all-fields, freehand lifecycle pills.

## Roles (4 agents)

| ID | Role | Owns | Must not |
|----|------|------|----------|
| **T1** | UI structure | `LinearDeskParametricForm.tsx`, dock host titles/slots, kill legend/fake toggle/double publish | Fabric, Planner shell rewrite |
| **T2** | CSS density | `locked/chrome/studio-chrome.css`, admin-svg-dock tokens, form stage surface | theme.css thrash, hex sprawl |
| **T3** | Product honesty | Identity single-entry, publish CTA wiring, stable slug/SKU in success copy; id reuse on republish if touched | Chrome vanity |
| **T4** | Browser gate | localhost:3000 only, screenshots + FAIL/PASS vs DoD, console 0 | Claiming PASS without screenshots |

## Tandem rules

1. **Same goal.** No side quests.  
2. **T1 + T2 + T3 implement in parallel** on non-overlapping files when possible; if conflict, T1 owns TSX, T2 owns CSS, T3 owns publish/identity only.  
3. **T4 runs after** T1–T3 report “ready for look.”  
4. **Parent merges** — if T4 FAIL, T1–T3 fix once, T4 recheck.  
5. **No new blunder essay farms.** One short note each in `agent-reports/blunders/tandem-*.md`.  
6. **pnpm from repo root.** No worktrees. No PROTECTED/.  
7. **Commit only if parent asks** after T4 PASS.

## Kill if

- Any agent starts Site home / Planner rebuild / DB flip  
- Any agent marks factory PASS without T4 evidence  
- More than one rework loop without visual improvement  

## Success line for owner

“Parametric screen looks like a product form, one publish, readable desk preview — and C3 publish proved same session.”
