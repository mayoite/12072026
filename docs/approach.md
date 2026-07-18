# Approach — how to operate this repo

**Audience:** owner + parent agent.  
**Purpose:** stop thrash. Ship the product loop.  
**Not** a checklist substitute. Execution stays in `plan/<Track>/`. Process floor stays in `Agents.md` + `Agents/`.

---

## What is worth operating

Only work that moves this loop:

```text
fields → Maker multipath SVG → publish
  → guest place → BOQ name/SKU
```

Desk first. Exact config. Disk SVG authority until parent-seen place proof, then `SVG_RELEASE_AUTHORITY=db`.

Everything else is optional until that loop is green in a **browser** on `http://localhost:3000` only.

---

## What is not worth operating

| Activity | Why it wastes the week |
|----------|-------------------------|
| Multi-agent review farms without a ship goal | Essays, not craft |
| Soft PASS (dock loads, unit green, screenshot of empty grid) | Lies about done |
| CSS / package maps without form/publish/place change | Chrome theater |
| Param-proof / random disk pollution as “tests” | Soft, non-isolated, clutter |
| Failures.md filled with PASS history | Failures = **active only** |
| Parallel goal thrash (“world-class + C3 + a11y + cutover”) | Last message wins; nothing finishes |
| “Approve all agent suggestions” | No prioritization |

If the week ends without publish→place→BOQ evidence, **the week failed** — regardless of commits about tokens or reports.

---

## One-week operating model

### 1. Lock one DoD (write once, do not thrash)

Example:

> **C3:** 160 cm → multipath preview → Publish → `svg-catalog/{slug}.svg` + descriptor. Console 0.  
> **C4:** Guest sees slug → place multipath @ 1280 and 390 → BOQ name + SKU.

Change DoD mYour work is to alignn all mds as per the repid-week only if blocked by a real bug, not by mood.

### 2. Max team shape

| Role | Count | Job |
|------|------:|-----|
| Parent | 1 | Decides PASS/FAIL, merges, enforces rules |
| Implement | 1–2 | Code + CSS in correct homes |
| TDD | 0–1 | Name-mirror tests with the slice |
| Critic | 0–1 | Hard FAIL soft work; no product call |

No brainstorm/report farms unless the owner says **plan only**.

### 3. Hard gates (must run)

| Gate | When |
|------|------|
| Focused vitest for touched paths | Every implement slice |
| `pnpm run check:layout` | Before “done” |
| Hardcoding audit on touched UI CSS/TSX | After UI CSS/TSX changes |
| Browser on changed route | Any UI claim |
| `check:layout` + no force-push | Always |

Hardcoding tools (use them; do not reinvent):

- `node site/scripts/audit-hardcoded-detail.mjs`
- `node site/scripts/audit-tsx-hardcoded.mjs`

CSS rules: `Agents/Agents-09-css.md`, `docs/architecture/04-CSS-SOLUTION.md`.

| Kind | Home |
|------|------|
| Shared tool/dock chrome | `site/app/css/core/locked/chrome/` |
| SVG paint / plan preview | `site/app/css/core/locked/svg/` |
| Admin shell pages | `site/app/css/core/locked/admin/` |
| Site marketing | `site/app/css/core/locked/site/` |
| Tokens | `theme.css` — do not thrash for experiments |

No new hex/rgb in product UI when a token exists. No second global styling tree. No co-located chrome CSS for shared docks.

### 4. Evidence rules

| Claim | Required evidence |
|-------|-------------------|
| Logic | Focused vitest exit 0, named files |
| UI | Fresh browser on localhost:3000, console/errors noted |
| C3 | Publish + disk paths for that slug, same session |
| C4 | Place multipath + BOQ name/SKU, 1280 and 390 |
| Cutover | Parent-seen place proof, then env flip |

**Never PASS from:** `results/` alone, `agent-reports/`, old ticks, unit standing in for browser.

### 5. Failures.md

- Active blockers only.  
- No PASS entries.  
- Remove row when fixed with evidence.  
- Owner blockers = NONE (full authority).

### 6. Catalog discipline

- Tests **never** mutate committed descriptors / released catalog as the test oracle.  
- No `oando-param-proof-*` (or similar) left on disk as “suite food.”  
- Temp fixtures + cleanup. Isolated publish tests only.

### 7. Git

- Prefer one clear commit per verified slice.  
- Full authority: commit/push verified work (per `Agents.md`).  
- Never force-push. Never wipe owner catalog by accident; restore immediately if mass delete appears.

---

## Priority order (default)

1. **C3 browser** — real publish.  
2. **C4 load rule + place + BOQ.**  
3. **Only then** chrome polish residual, DB flip, new furniture types, a11y deep pass.

UI craft on parametric form is allowed **only** if it unblocks operators for C3 or is the single locked weekly DoD. It does not replace C3/C4.

---

## Owner anti-patterns (honest)

| Pattern | Replace with |
|---------|----------------|
| Many goals in one session | One DoD sentence |
| Approve all agent ideas | Parent ranks; most deferred |
| Agents as status theater | Agents implement or prove one gate |
| Soft language (“almost”, “partially ready”) | OPEN / FAIL / PASS with evidence |
| Process docs when factory is red | Close factory first |

---

## Parent agent contract

1. Re-read `Agents.md` each task.  
2. User wins. Brutal truth.  
3. Subagents dig; **parent only** marks ship/PASS/cutover.  
4. Block only the exact dependent item.  
5. `pnpm` from repo root. Browser `localhost:3000` only.  
6. Run `pnpm run check:layout` before completion claims.

---

## One line

**Operate the factory loop with hard evidence. Everything else waits.**
