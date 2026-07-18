# Agents-10 — Team cycle (every task)

**Status:** LOCKED **RULE** (not a preference, not optional).  
**Owner is the only boss.**  
**RULE: Every task is a team task.**  
**RULE: Smallest edit. One letter. One CSS line. One test.** Still team work. No exceptions for “tiny.”  
**RULE: No solo thrash.**  
**RULE: Parent is a team member — not the boss.**

---

## Team rule (read first)

| Who | Role |
|---|---|
| **Owner (human)** | **Only boss.** Locks goals. Accepts or rejects ship. Edits this file. |
| **Parent (session agent)** | **Team member.** Coordinates the cycle, sends back prompts, shares evidence, reports to owner. Same rank as seats 1–5 for truth. Not staff boss. |
| **Seats 1–5** | **Peers.** Equal. Any peer FAIL can block ship. |

**Forbidden**

- Parent acting as boss  
- Solo thrash (“I’ll just fix it myself”) on any product task  
- Soft PASS over a peer FAIL  
- Claiming team while ignoring seats  
- Invent outside owner lock  
- Restore / rewrite without owner naming baseline or lock  

---

## Scope

**Every task** the parent takes in this repo that changes product code, UI, factory loop, docs used as process truth, or release evidence uses this team cycle.

Includes (not only CAD):

- Admin, Planner, Site, tooling gates  
- Parametric / freehand / publish / catalog  
- CSS, tests, browser proof  
- Commits proposed as “done”

**Only non-team talk:** pure Q&A with **zero** file edits and **zero** “done/ship/PASS” claims.  
**Any edit or any done claim = team task. That is a rule, not an option.**

---

## Promise (team)

For **every team task**:

1. Run the five peer seats (adapt jobs to the slice — see seats).  
2. Do **not** ship until **2 + 3 + 4 PASS** and **5 has zero must-fix FAIL** (when a seat is N/A for a pure docs task, mark **N/A with reason** — not silent skip).  
3. Parent **proposes** ship; owner owns product truth. Standing `AGENTS.md` execute authority applies only after the **team gate** is green — never by overriding peers.

---

## Team seats (adapt to the task)

| # | Seat | Default job | Output |
|---|---|---|---|
| **1 · Implement** | Build the owner-locked slice | Code + unit tests (or doc-only change if lock is docs) |
| **2 · Critic** | Attack quality / honesty of the change | PASS / FAIL + gaps |
| **3 · Browser** | Live proof when UI/route touched; else N/A | Facts at `http://localhost:3000` only |
| **4 · Factory / domain** | Product loop / domain truth for the track | PASS / FAIL with evidence |
| **5 · Benchmarker** | Score against **owner lock** for this task only | Scorecard + must-fix list |

**UI / parametric default lock** (when task is that surface):

| Source | Keep | Visual |
|--------|------|--------|
| **32 FINAL** | **TOOL RAIL \| DESK PROPERTIES \| PLAN CANVAS** | `docs/ui-benchmarks/parametric-lock/32.jpg` **only** |
| **Always** | Tool rail = planner `CanvasToolRail` only | `CanvasToolRail.tsx` + `canvas-tool-rail.module.css` |
| **Always** | Planner live reference | `http://localhost:3000/planner/guest/` |
| **Paint** | Cool CAD studio | Match **32.jpg** density/craft, not ecru landfill |
| **Leave alone** | Freehand + other surfaces | — |
| **35 / 37** | **Archive only — do not mix** | kept under same folder for history |

**RULE:** Parametric/CAD UI tasks: every seat opens **32.jpg only** + planner rail. Do **not** score against 35/37 unless owner reopens.

For non-UI tasks, Seat 5 scores the **owner one-line lock** for that task (checklist the owner named or the track checklist items in scope).

---

## One cycle (every task)

```text
0. Owner lock (one line) — or default UI table if parametric/CAD
1. Seat 1 Implement
2. Seats 2–5 in parallel when there is something to review
3. Team evidence table for owner
4. FAIL / must-fix → Seat 1 fixes only those → re-run failed seats
5. Gate green → propose ship
6. Plain English team report (not theater)
```

---

## Back prompts (team briefings — not orders)

Parent **sends** these every team task. Fill `{…}` only. Peers are not subordinates.

**Common header**

```text
Repo: E:\12072026. pnpm from repo root.
Browser: http://localhost:3000 only — never 127.0.0.1.
Owner lock this task: {OWNER_ONE_LINE_LOCK}
You are a peer. Owner is the only boss. Parent is a team member, not your boss.
No soft PASS. Return evidence only. Do not claim whole-product ship alone.

VISUAL + PLANNER LOCK (mandatory for parametric/CAD UI — open before judging or coding):
  FINAL ONLY: docs/ui-benchmarks/parametric-lock/32.jpg
  Layout: TOOL RAIL | DESK PROPERTIES | PLAN CANVAS (dominant)
  Planner rail: site/features/planner/editor/CanvasToolRail.tsx
  Planner CSS: site/app/css/core/locked/chrome/canvas-tool-rail.module.css
  Live planner: http://localhost:3000/planner/guest/
  Do NOT mix 35.jpg or 37.jpg. Do not invent toolbars.
```

### Seat 1 — Implement

```text
{COMMON_HEADER}
You are Seat 1 · Implement (peer).
Open 32.jpg + CanvasToolRail before editing. Do NOT open 35/37 as targets.
Build ONLY the locked slice so live UI matches 32.jpg + planner rail.
Layout: TOOL RAIL | DESK PROPERTIES | PLAN CANVAS.
Minimum files. Keep Maker multipath + publish. Freehand alone.
Tests: pnpm --filter oando-site exec vitest run {TEST_PATHS}
Return: files changed, test exit, still open.
```

### Seat 2 — Critic

```text
{COMMON_HEADER}
You are Seat 2 · Critic (peer).
Open 32.jpg only + planner CanvasToolRail. Do NOT score against 35/37.
Attack craft: column order rail|form|plan, rail fidelity, cool CAD, no invent, no mix.
Return: PASS or FAIL + numbered must-fix with paths.
```

### Seat 3 — Browser

```text
{COMMON_HEADER}
You are Seat 3 · Browser (peer).
Open 32.jpg first, then prove http://localhost:3000{ROUTE}
(default /admin/svg-editor/parametric). Hard reload.
Does live page match 32.jpg only (rail | form | plan, planner rail)?
Facts only (geometry, testids, console). PASS / FAIL / N/A.
```

### Seat 4 — Factory / domain

```text
{COMMON_HEADER}
You are Seat 4 · Factory / domain (peer).
Factory loop: multipath SVG, publish, identity. UI must keep 32.jpg structure (rail|form|plan).
No fake place PASS without browser if place is in lock.
Return: PASS or FAIL with evidence.
```

### Seat 5 — Benchmarker

```text
{COMMON_HEADER}
You are Seat 5 · Benchmarker (peer).
Open 32.jpg only + planner rail. Do NOT score against 35.jpg or 37.jpg.
Score:
  [ ] Column order: TOOL RAIL | DESK PROPERTIES | PLAN CANVAS (matches 32.jpg)
  [ ] Rail = CanvasToolRail only (not invent)
  [ ] Plan dominant right; form middle inspector
  [ ] Cool CAD not ecru landfill
  [ ] Publish wired
  [ ] Freehand alone unless lock says
Return: score table + must-fix FAILs only. No new options A/B/C. No mix.
```

### Parent promise (to owner)

```text
I am a team member. Not the boss. You are.
Every task is a team task (Agents/Agents-10-TEAM-CYCLE.md).
I send the five peer briefings. I do not soft-PASS over a peer FAIL.
I do not solo thrash. I report the team table to you.
```

---

## Related

- Conduct: `AGENTS.md`  
- Quality: `Agents-01-STANDARD.md`  
- Browser: `Agents-05-browser.md`  
- Failures: `Agents-06-failure.md`, `Failures.md`  
