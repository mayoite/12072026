# INDEX + 00-START — expert review suggestions

**Reviewer role:** planning expert (tech lead + PM)  
**Date:** 2026-07-09  
**Plans reviewed:**  
- `Plans/trustdata/INDEX.md`  
- `Plans/trustdata/00-START.md`  
**Method:** full read of both files + alignment check against CHECKPOINTS, RESULTS-MAP, MASTER-CHECKLIST, AGENT-RULES, design spec (Approach A / W1–W8), and phase reviews P01–P10. **No product code.**

**Constraints for this revision wave:**  
Approach **A** default · unlock gate explicit · phase order matches CP graph · superpowers **8 default / 10 hard max** agents · plan docs only.

---

## Strengths (short)

- Correct program root: everything under `Plans/trustdata/`; evidence under `results/planner/world-standard-wave/`.
- Default approach **A** (product journey first) already named; B/C as owner override only.
- Ethics, no worktrees, commit-as-we-go, push-on-ask, trust-data rule present.
- Phase list P01–P10 maps 1:1 to phase files and roughly to CP-00–CP-10.
- INDEX authority order is sound: Owner > trustdata folder > design spec > Plan A > ayushdocs.
- Superpowers required banner present on both files.

---

## Gaps / risks / contradictions

### Unlock gate underspecified (P0)

| Issue | Risk |
|-------|------|
| INDEX one-liner “Do not execute implementation until owner unlocks after workflow briefing” | Agents may still edit `site/` during “plan polish,” or treat phase inventory greps as green light for feature work. |
| 00-START CP-00 checklist only 3 bullets | CHECKPOINTS CP-00 requires **5** criteria: INDEX+00 read, approach recorded, ethics ack, unlock **or** plan-only, no worktree. Incomplete list → false CP-00 pass. |
| No modes table (`plan-only` vs `implementation unlock`) | Unclear whether P01 inventory (read-only + results write) is allowed without full unlock. |
| No evidence path for unlock | RESULTS-MAP requires `00-start/NOTES.md` with approach + date; neither file tells agents to write it. |
| ayushdocs `00-PENDING` still says W0 **NEEDS OWNER PICK** | INDEX claims default A; without recorded checkbox + NOTES, status docs and plan disagree. |

### Approach A not operationalized (P0)

| Issue | Risk |
|-------|------|
| A is “default” but owner checkboxes all open with equal weight | Agents re-debate B/C mid-stream. |
| No one-line **binding** of Approach A consequences | Missing: ship W1–W8 on Feasibility+document model first; Fabric full stage **after** green; 2A only when it blocks W gates. |
| Engine checkboxes live only in 00-START | INDEX does not say engines are locked under CP-02 / Approach A interim path. |
| No north star on either file | Agents optimize chrome or photoreal (Approach C / photoreal thrash) against design spec. |

### Phase order incomplete vs CHECKPOINTS (P0)

| Issue | Risk |
|-------|------|
| Linear P01→P10 table only | CHECKPOINTS allow **parallelism after CP-02** for W3/W4/W5–W6/W7/W8 streams; linear table implies serial only. |
| No feed graph into P07 | Agents may run full browser journey claims while CP-03/CP-05 red. |
| Gate IDs on phases correct but no W1–W8 definition summary | Agents open design spec late; wrong proof standards. |
| P07 folder `02-browser-…` vs phase number 07 | INDEX does not warn; RESULTS-MAP already documents exception — agents invent `07-browser-journey/` without pointer. |
| Dual `08-*` folders (mesh vs shortcuts) | INDEX phase table lists P08/P09 only by name; no canonical evidence folder column. **Post-review owner/governance fix (same day):** W8 = **`09-shortcuts-chrome/`**; W7 stays `08-mesh-quality/`. Applied in INDEX/00-START revision. |

### Superpowers / concurrency thin (P1)

| Issue | Risk |
|-------|------|
| “Up to 8 (max 10)” one line | No stream ownership table; no required subagent prompt block; no “parallel only after CP-02”. |
| 00-START: “Tests do not block other streams if parallelized” | Misread as “skip tests” vs “run tests in a sibling agent”. Conflicts with zero-suppression / evidence-first. |
| No link to `checklists/AGENT-RULES.md` stream table | Duplicate thrash vs single contract. |
| INDEX does not mention reviews/ folder | Expert suggestions ignored after phase rewrites. |

### Cross-doc sync holes (P1)

| Issue | Risk |
|-------|------|
| Failures.md path never absolute | Agents log nowhere or invent paths. |
| MASTER-CHECKLIST W0 items not mirrored in 00-START closeout | Owner checklist and start gate diverge. |
| No “out of scope while W red” | CRM/SSR/photoreal creep during journey work. |
| Standing rules omit `no any`, zero suppression, write-to-disk | Subagents load only 00-START and miss AGENT-RULES. |
| Related links omit `archive/Plans/07072026/01-execution/core/` detail and `testing-handbook.md` | Verification strategy undefined at program entry. |

### Path / process spot-check (2026-07-09)

**Exist and authority-aligned:**

- `Plans/trustdata/INDEX.md`, `00-START.md`
- `checkpoints/CHECKPOINTS.md` CP-00…CP-10
- `RESULTS-MAP.md` folder map including `00-start/`
- `checklists/MASTER-CHECKLIST.md` W0 + agent ops
- `checklists/AGENT-RULES.md` streams 1–8, prompt block
- Design spec Approach A + W1–W8
- `results/planner/world-standard-wave/WAVE.md` (pre-plan debt; not W pass)

**Not yet recorded (expected until CP-00 closes):**

- Owner approach checkbox tick in 00-START
- `results/planner/world-standard-wave/00-start/NOTES.md`
- CHECKPOINTS CP-00 status still `OPEN`

---

## Must-fix (P0)

1. **Unlock modes table** in both INDEX (summary) and 00-START (authoritative):  
   - `plan-only` — plan/review/results inventory only; **no product code** under `site/features/planner/**` (and no product behavior changes).  
   - `implementation unlock` — owner text allows phase product work per phase file.  
   - Default approach **A** if owner silent **after** unlock; silent ≠ unlock.
2. **CP-00 full criteria** in 00-START matching CHECKPOINTS (5 criteria + ethics + no worktree + NOTES evidence path).
3. **Approach A binding banner** on INDEX and 00-START: Product Journey First = W1–W8 on Feasibility + document model; Fabric destination retained for post-W migration; blocking 2A only.
4. **Phase order + dependency graph** aligned with CHECKPOINTS: serial CP-00→CP-01→CP-02; then parallel streams; CP-07 needs CP-03 + CP-05 (and honesty feed); CP-10 last.
5. **Evidence folder column** on phase table (canonical RESULTS-MAP names; call out P07 → `02-browser-open3d-journey/`, dual `08-*`).
6. **W1–W8 one-screen summary** (proof standard one line each) so agents do not treat P0 spine as world bar.
7. **Concurrency section:** default 8 / hard max 10; parallel **after CP-02**; tests run in parallel agents **without skipping**; link AGENT-RULES prompt block + stream table.

## Should-fix (P1)

1. North star quote (from design spec) on INDEX + 00-START.  
2. Out-of-scope list while any W red.  
3. Absolute Failures.md path: `D:\OandO07072026\Failures.md`.  
4. Standing rules expanded: no `any`, zero suppression, write-to-disk, commit message shape.  
5. INDEX doc table: add MASTER, AGENT-RULES, RESULTS-MAP (already partly), reviews/, Failures.  
6. Clarify engine checkboxes: tick at CP-02 / owner engine sign-off; mirror into `00-start/` or engine-lock NOTES.  
7. Explicit “plan revision commits allowed; product commits only after unlock.”  
8. Point ayushdocs honesty: W0 default A in trustdata; owner still records pick for CP-00 close.  
9. Related design/spec path + testing-handbook.  
10. Revision stamp **2026-07-09** on both files after apply.

## Nice-to-have (P2)

1. Mermaid or ASCII dependency diagram (same as CHECKPOINTS).  
2. One-page “first agent session” runbook (read order).  
3. Link RESEARCH-MAP ethics one-liner under ethics table.

---

## Suggested apply order (this revision)

1. P0 unlock modes + CP-00 criteria → **00-START**  
2. P0 Approach A banner + north star → both  
3. P0 phase order / dependency / evidence folders → both  
4. P0 W1–W8 summary → INDEX (short) + 00-START (table)  
5. P0 concurrency / superpowers 8–10 → both + AGENT-RULES link  
6. P1 standing rules, Failures.md, out-of-scope, doc index  
7. Revision stamp + “applied from reviews/INDEX-00-suggestions.md”

---

## Out of scope (do not do in this revision)

- Product implementation under `site/`.  
- Ticking owner Approach/engine boxes without owner text (leave checkboxes for owner).  
- Changing phase file order IDs (P01–P10 stay).  
- Rewriting all phase files (P01–P10) here — only INDEX + 00-START.  
- Closing CP-00 as PASS (needs owner unlock/plan-only statement).  
- Worktrees, push, package upgrades.

---

## Disposition (after revision apply)

| ID | Priority | Applied to INDEX? | Applied to 00-START? |
|----|----------|-------------------|----------------------|
| P0-1 Unlock modes | P0 | Yes | Yes |
| P0-2 CP-00 full criteria | P0 | Summary | Yes (authoritative) |
| P0-3 Approach A banner | P0 | Yes | Yes |
| P0-4 Phase dependency graph | P0 | Yes | Yes |
| P0-5 Evidence folder column | P0 | Yes | Yes |
| P0-6 W1–W8 summary | P0 | Yes | Yes |
| P0-7 Concurrency 8–10 | P0 | Yes | Yes |
| P1-1 North star | P1 | Yes | Yes |
| P1-2 Out of scope | P1 | Yes | Yes |
| P1-3 Failures.md path | P1 | Yes | Yes |
| P1-4 Standing rules expand | P1 | Yes | Yes |
| P1-5 Doc table complete | P1 | Yes | Yes |
| P1-6 Engine tick timing | P1 | Yes | Yes |
| P1-7 Plan vs product commits | P1 | Yes | Yes |
| P1-10 Revision stamp | P1 | Yes | Yes |

---

## Next step after this file

1. Revise `INDEX.md` and `00-START.md` per disposition (this wave). **Done 2026-07-09.**  
2. Align evidence folders with **FOLDER-LOCK** (same day): P01=`00-product-truth/`, W8=`09-shortcuts-chrome/` — applied in INDEX/00-START.  
3. Owner: record Approach A (or B/C), unlock or “plan only”, optional engine ticks at CP-02.  
4. Agent: write `results/planner/world-standard-wave/00-start/NOTES.md` when CP-00 runs.  
5. Do **not** start product code until implementation unlock.
