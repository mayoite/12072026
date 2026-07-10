# P10 — Evidence pack + handover + E: backup

> **For agentic workers:** REQUIRED SUB-SKILL: `/using-superpowers`. Also load `verification-before-completion` and `Agents/Agents-docs.md` before claiming done.  
> **Gate:** **CP-10**. Do not mark the trustdata program complete until every checkbox in this file is green with paths.  
> **Checkout:** `D:\OandO07072026` only · **no worktrees** · commit each landable slice · **push only on owner ask** in the current conversation.

**Goal:** Produce a single final evidence pack that proves **W0–W8** from data, sync **MASTER-CHECKLIST** (all 9 sections / 94 boxes), back up plan + evidence to `E:`, commit landable docs/evidence slices locally, and hand over without a push unless the owner asks.

**Architecture:** Proof lives under `results/planner/world-standard-wave/`; checklists under `Plans/trustdata/checklists/`; this phase is **documentation + verification + backup only**.

**Tech stack:** PowerShell on Windows; git on `D:\OandO07072026` main checkout only; Playwright/Vitest artifacts already produced by P03–P09; robocopy / Copy-Item for E: backup.

**Parent:** [INDEX.md](../../INDEX.md) · [00-START.md](../../00-START.md) · [RESULTS-MAP.md](../../RESULTS-MAP.md) · [checkpoints/CHECKPOINTS.md](../../checkpoints/CHECKPOINTS.md) · [checklists/MASTER-CHECKLIST.md](../../checklists/MASTER-CHECKLIST.md)

---

## Scope (hard)

### In scope

| Slice | What |
|-------|------|
| Evidence pack | Create/complete `10-handover/` six required files |
| W-gate binding | Re-read primary folders per RESULTS-MAP; write `W-GATES.md` |
| MASTER sync | Tick MASTER only when paths re-read this session; write `MASTER-SYNC.md` tallies |
| Git hygiene | Local commits per landable slice; `HEAD.txt`; push status recorded |
| E: backup | Dated folder under `E:\OandO-backups\`; `BACKUP-LOG.md` with per-call outcomes |
| CP-10 close | Mark CP-10 PASS only when all criteria below are true |

### Out of scope (do not expand)

- **No product code** — do not edit `site/`, tests under `site/`, or ship feature fixes under the P10 label.
- If any W1–W8 primary evidence is missing or red: **stop CP-10**, log `Failures.md`, **reopen the owning phase** (P03–P09 / CP-03–CP-09). Owner may WAIVE in CHECKPOINTS.md only.
- Fabric full stage, CRM/SSR, photoreal, multiplayer, competitor asset import.
- `git push` / force-push / remote branch delete without explicit owner ask.
- `git worktree add` or any second checkout.

---

## Preconditions (hard stop if false)

- [ ] Approach A/B/C recorded in `Plans/trustdata/00-START.md` (default **A** if owner silent after unlock).
- [ ] CP-00 through CP-09 recorded **PASS** or owner **WAIVE** (date + reason) in `Plans/trustdata/checkpoints/CHECKPOINTS.md`.
- [ ] **W0–W8** each have a concrete evidence path under `results/planner/world-standard-wave/` (see RESULTS-MAP.md) **or** an explicit owner WAIVE in CHECKPOINTS.md.
- [ ] Working tree is the main checkout: `D:\OandO07072026` — **no worktrees**.
- [ ] Superpowers / skills used for every non-trivial verification step this phase (`/using-superpowers`, `verification-before-completion`).
- [ ] `E:` is mounted and writable **before** claiming backup (if not, log Failures.md; pack on D: may still land; **CP-10 backup criterion stays FAIL**).

---

## Canonical evidence folders (RESULTS-MAP lock)

**Do not invent alternate folder names.** FINAL lock 2026-07-09 — see [FOLDER-LOCK-suggestions.md](../../reviews/FOLDER-LOCK-suggestions.md). **Sole primary `08-*`:** mesh. W8 is `09-*`.

| Gate | Canonical primary folder | Owning phase / CP |
|------|--------------------------|-------------------|
| W0 | `00-start/` | 00-START / CP-00 |
| Baseline (P01) | `00-product-truth/` | P01 / CP-01 |
| Engine (P02) | `01-engine-lock/` | P02 / CP-02 |
| W1 | `02-browser-open3d-journey/` | P07 / CP-07 |
| W2 place | `02-browser-open3d-journey/` | P07 / CP-07 |
| W2 symbols | `05-symbols-svg/` | P05 / CP-05 |
| W3 | `03-select-delete/` | P03 / CP-03 |
| W4 | `04-orbit-continuity/` | P04 / CP-04 |
| W5 | `06-save-honesty/save-reload/` or `06-save-honesty/` | P06 / CP-06 |
| W6 | `06-save-honesty/` | P06 / CP-06 |
| **W7 mesh** | **`08-mesh-quality/`** | **P08 / CP-08** |
| **W8 shortcuts** | **`09-shortcuts-chrome/`** | **P09 / CP-09** |
| Pack | `10-handover/` | P10 / CP-10 |

**Anti-drift:** W8 is **`09-shortcuts-chrome/`**, **not** `08-shortcuts-chrome/` (retired; collides with mesh). P01 is **`00-product-truth/`**, not `01-product-truth/`. If a draft uses a retired name, rehome artifacts or leave a `NOTES.md` pointer only.

Optional journey alias: `07-browser-journey/` → must point at `02-browser-open3d-journey/` via `NOTES.md` (RESULTS-MAP).

---

## Task 00 — Setup / skills / tree check

- [ ] Load `/using-superpowers`, `verification-before-completion`, `Agents/Agents-docs.md`.
- [ ] Confirm `pwd` / git root is `D:\OandO07072026` (not a worktree).
- [ ] Read INDEX, this file, CHECKPOINTS, RESULTS-MAP, MASTER-CHECKLIST.
- [ ] Ensure folder exists: `results/planner/world-standard-wave/10-handover/`.
- [ ] Spot-list primary gate folders (create nothing empty for show; missing gate folder = reopen owning phase).

---

## Task 01 — Final evidence pack (create if missing)

Target root:

```
D:\OandO07072026\results\planner\world-standard-wave\10-handover\
```

Required files (all concrete; write them during this phase):

| File | Contents |
|------|----------|
| `10-handover/README.md` | Pack index: date, git HEAD short SHA, approach A/B/C, agent count used, link to each W gate folder, push status, backup pointer |
| `10-handover/W-GATES.md` | Table W0–W8 → pass/fail/WAIVE → primary evidence path → secondary path |
| `10-handover/MASTER-SYNC.md` | Snapshot of checkbox counts from MASTER-CHECKLIST.md (per section + sum; total **94**) |
| `10-handover/HEAD.txt` | Output of `git rev-parse HEAD` and `git status -sb` (no secrets) |
| `10-handover/FAILURES-SNIP.md` | Open blockers only, copied from `Failures.md` with file:line style pointers |
| `10-handover/BACKUP-LOG.md` | E: destination path, start/end time, **per-source** robocopy/Copy-Item exit codes, size summary, B.6 spot-check |

### W-gate evidence binding (must match RESULTS-MAP)

| Gate | Primary folder (must exist) | Pass artifact minimum |
|------|----------------------------|------------------------|
| W0 | `00-start/` or pack notes in `10-handover/W-GATES.md` | Approach pick + engine checkboxes recorded |
| W1 | `02-browser-open3d-journey/` | Playwright `run.json` / `playwright-run.json` + wall/door screenshots |
| W2 | `02-browser-open3d-journey/` + `05-symbols-svg/` | Place ≥2 items + cabinet-v0; Block2D unit/PNG symbol proof |
| W3 | `03-select-delete/` | Unit + Playwright select/delete/undo |
| W4 | `04-orbit-continuity/` | 2D↔3D pose + orbit ON + console clean log |
| W5 | `06-save-honesty/save-reload/` (or `06-save-honesty/` if single folder holds both) | Hard reload same wall + furniture ids |
| W6 | `06-save-honesty/` | UI copy truth (local vs cloud) + test/code note |
| W7 | **`08-mesh-quality/`** | NOTES + visual smoke cabinet-v0 readable parts (toe / door / carcass) |
| W8 | **`09-shortcuts-chrome/`** | Unit/keyboard map labels match handlers |

If a primary folder is empty or missing `run.json` / screenshots / NOTES as required, **CP-10 fails**. Reopen the owning phase (P03–P09); do not invent pass claims; **do not fix product code under P10**.

- [ ] All six pack files drafted (BACKUP-LOG may be stub until Task 05).
- [ ] `W-GATES.md` paths re-read from disk this session.

---

## Task 02 — MASTER checklist sync (all sections)

Owner file: `Plans/trustdata/checklists/MASTER-CHECKLIST.md`

**Rule:** MASTER-CHECKLIST is the single owner truth. Phase files and WAVE.md are supporting; they do not override MASTER after sync.

Steps:

1. Open MASTER-CHECKLIST.md.
2. For every **W0** and **W1–W8** row, set checkbox only when the evidence path in `W-GATES.md` exists and was re-read this session (or WAIVE id noted).
3. Mark **Ethics (E.\*)** from live `00-START.md`, `RESEARCH-MAP.md`, and `checklists/AGENT-RULES.md` compliance (inspiration-only research; no competitor assets in `site/`; no secrets in pack).
4. Mark **Agent-ops (A.\*)**: superpowers used, concurrent ≤10, no worktrees, commit cadence followed, push not done unless owner asked.
5. Mark **Phase (P01–P10)** and **Testing (T.\*)** from RESULTS-MAP folder names + zero-suppression honesty.
6. Mark **Backup (B.\*)** only after Task 05 succeeds and `BACKUP-LOG.md` is complete.
7. Mark **Git/handover (G.\*)** and **Non-claims (N.\*)** from live HEAD, push status, and honesty rules.
8. Write per-section tallies into `10-handover/MASTER-SYNC.md` using MASTER’s tally table (sections 0–8; **Sum total = 94**).
9. Fill MASTER header: **Last sync** date + **Git HEAD at last sync**.

- [ ] MASTER boxes never green without paths.
- [ ] `MASTER-SYNC.md` tallies match MASTER after this session’s ticks.
- [ ] Open blockers only in `FAILURES-SNIP.md` / `Failures.md` — no silent skips.

---

## Task 03 — Local commit cadence (this phase)

Standing rule from `AGENTS.md` / `00-START.md` / MASTER A.7:

| When | Action |
|------|--------|
| After evidence pack core files land (README, W-GATES, HEAD, FAILURES-SNIP; MASTER-SYNC may still be partial) | One local commit: `trustdata(P10): evidence pack 10-handover` |
| After MASTER checklist sync (pre-backup tallies OK; B.* may still be open) | One local commit: `trustdata(P10): MASTER checklist sync W0-W8` |
| After E: backup succeeds + BACKUP-LOG written | One local commit: `trustdata(P10): backup log + CP-10 notes` (log only in-repo; do not commit secrets) |
| After handover README complete + CP-10 criteria satisfied | One local commit: `trustdata(P10): handover complete CP-10` |

Commit rules:

- [ ] Commit on main checkout only (`D:\OandO07072026`).
- [ ] Message states phase + what landed (no empty “WIP” mega-commits for days of work).
- [ ] Do **not** `git push` / force-push / delete remote branches.
- [ ] Do **not** create git worktrees.
- [ ] Do not commit `.env`, keys, cookies, or E: full binary dumps into git unless owner explicitly asks.
- [ ] Refresh `HEAD.txt` after the final P10 commit of the session (or note last SHA in README).

---

## Task 04 — Push policy

- **Default:** no push.
- **Push only when** the owner writes an explicit ask in the **current** conversation (e.g. “push this” / “push to origin”).
- If owner asks push: confirm branch name and remote; never force without a second explicit ask.
- Record push decision in `10-handover/README.md` as `push: not requested | requested and done | requested and blocked`.
- [ ] Push status recorded (G.3).

---

## Task 05 — E: drive backup procedure

**Purpose:** Survive disk loss of `D:` with planner truth + evidence + plan pack.

### Destinations (create dated folder)

```
E:\OandO-backups\trustdata-YYYY-MM-DD\
```

Example for 2026-07-09:

```
E:\OandO-backups\trustdata-2026-07-09\
```

### What to copy (minimum set = MASTER B.3)

| Source | Destination under dated folder | Notes |
|--------|--------------------------------|-------|
| `D:\OandO07072026\Plans\trustdata\` | `Plans\trustdata\` | Full plan pack |
| `D:\OandO07072026\results\planner\world-standard-wave\` | `results\planner\world-standard-wave\` | All W evidence + `10-handover/` |
| `D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md` | `docs\superpowers\specs\` | Design authority |
| `D:\OandO07072026\Failures.md` | `Failures.md` | Open blockers |
| `D:\OandO07072026\ayushdocs\08-EVIDENCE-INDEX.md` | `ayushdocs\` | Cross-index if present |
| `D:\websites\research\2026-07-09-world-standard\` | `websites-research\2026-07-09-world-standard\` | Ideas-only research (MASTER B.4 recommended) |

### Optional larger snapshot (owner may request)

| Source | Destination | Notes |
|--------|-------------|-------|
| Entire `D:\OandO07072026` excluding `node_modules`, `.next`, large `public` GLB caches if owner says skip | `repo-snapshot\` | Use robocopy `/XD node_modules .next` |
| `D:\websites\` competitor packs | `websites-full\` | Inspiration only; do not merge into product |

### PowerShell procedure (run from user with E: mounted)

```powershell
$date = Get-Date -Format 'yyyy-MM-dd'
$dest = "E:\OandO-backups\trustdata-$date"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# Minimum set — record each $LASTEXITCODE / robocopy code in BACKUP-LOG.md
robocopy "D:\OandO07072026\Plans\trustdata" "$dest\Plans\trustdata" /E /NFL /NDL /NJH /NJS /nc /ns /np
robocopy "D:\OandO07072026\results\planner\world-standard-wave" "$dest\results\planner\world-standard-wave" /E /NFL /NDL /NJH /NJS /nc /ns /np
New-Item -ItemType Directory -Force -Path "$dest\docs\superpowers\specs" | Out-Null
Copy-Item "D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md" "$dest\docs\superpowers\specs\" -Force
Copy-Item "D:\OandO07072026\Failures.md" "$dest\Failures.md" -Force
if (Test-Path "D:\OandO07072026\ayushdocs\08-EVIDENCE-INDEX.md") {
  New-Item -ItemType Directory -Force -Path "$dest\ayushdocs" | Out-Null
  Copy-Item "D:\OandO07072026\ayushdocs\08-EVIDENCE-INDEX.md" "$dest\ayushdocs\" -Force
}
if (Test-Path "D:\websites\research\2026-07-09-world-standard") {
  robocopy "D:\websites\research\2026-07-09-world-standard" "$dest\websites-research\2026-07-09-world-standard" /E /NFL /NDL /NJH /NJS /nc /ns /np
}

# Robocopy codes 0–7 = success with varying copy/extra semantics; ≥8 = fail
```

### BACKUP-LOG.md schema (required fields)

```markdown
# BACKUP-LOG
- Date:
- Dest: E:\OandO-backups\trustdata-YYYY-MM-DD\
- Start / End (local time):
- Per-source outcomes:
  - Plans\trustdata → robocopy exit:
  - results\planner\world-standard-wave → robocopy exit:
  - design spec → Copy-Item:
  - Failures.md → Copy-Item:
  - websites-research (if run) → robocopy exit:
- Approx total bytes: (Get-ChildItem -Recurse | Measure-Object Length -Sum)
- Spot-check B.6:
  - [ ] dest\Plans\trustdata\INDEX.md exists
  - [ ] dest\results\planner\world-standard-wave\10-handover\README.md exists
- Secrets excluded: yes/no
- Result: PASS | FAIL
```

### Backup acceptance (MASTER B.1–B.7)

- [ ] `E:` drive is mounted and writable before start (B.1).
- [ ] `$dest` exists as `E:\OandO-backups\trustdata-YYYY-MM-DD\` (B.2).
- [ ] Minimum set copied (B.3); recommended research copy noted (B.4).
- [ ] `$dest` contains `Plans\trustdata\INDEX.md` (B.6).
- [ ] `$dest\results\planner\world-standard-wave\10-handover\README.md` exists after pack write + copy (B.6) — prefer copy **after** pack is complete.
- [ ] Write `10-handover/BACKUP-LOG.md` with schema above (B.5).
- [ ] No secrets in backup (B.7).
- [ ] If E: missing or full: **stop CP-10 backup criterion**; log in `Failures.md`; do not claim handover complete; keep D: pack intact.

---

## Task 06 — Handover narrative + CP-10 close

### Honesty / anti-claims

- [ ] Do not claim “product works” from unit-green alone.
- [ ] Do not claim W gates green without screenshots / run.json / NOTES as listed.
- [ ] Do not treat ayushdocs P0-DONE notes as world-standard pass.
- [ ] Trust data (repo, tests, browser artifacts) — never put the owner on trial for character.
- [ ] Non-claims N.1–N.5 remain checked only while still true (MASTER §8).

### Handover narrative (write into 10-handover/README.md)

Required sections:

1. **What is true now** — one paragraph, data-backed.
2. **W0–W8 status table** — pass/fail/WAIVE with paths.
3. **Open blockers** — from Failures.md only.
4. **Next phase outside trustdata** — Fabric full stage (Approach B) only after W1–W8 green; CRM/SSR still out of scope while any W is red.
5. **Git** — HEAD, commits made this phase, push status.
6. **Backup** — E: path and log pointer.

### CP-10 pass criteria (all required)

- [ ] `results/planner/world-standard-wave/10-handover/` complete with all six required files.
- [ ] MASTER-CHECKLIST.md synced across sections 0–8; MASTER-SYNC.md tallies match (sum target 94 or WAIVE refs noted).
- [ ] Every W0–W8 primary folder has required artifacts **or** explicit owner WAIVE in CHECKPOINTS.md.
- [ ] E: backup logged and verified (B.1–B.7).
- [ ] Local commits created for each landable slice above.
- [ ] No push unless owner asked; push status recorded.
- [ ] CP-00–CP-09 all PASS or WAIVE before CP-10 PASS.
- [ ] CHECKPOINTS.md row **CP-10** marked pass with date and evidence path `results/planner/world-standard-wave/10-handover/`.
- [ ] No product code changes attributed to P10.

---

## Stop-if-fail

| Failure | Action |
|---------|--------|
| Any W1–W8 primary evidence missing | Reopen owning phase; CP-10 stays fail; **no site/ edits under P10** |
| MASTER checkboxes green without paths | Revert checkboxes; treat as integrity fail |
| E: not available | Log Failures.md; CP-10 backup criterion fail; keep D: pack intact |
| Agent used worktree or pushed without ask | Stop; record in Failures.md; owner decision |
| Secrets found in pack | Remove; scrub; re-commit; do not copy secrets to E: |
| Artifacts only under non-canonical folders (e.g. retired `08-shortcuts-chrome/` or `01-product-truth/`) | Rehome or pointer to RESULTS-MAP canonical path; else gate fail |

---

## Skills for this phase

| Skill / handbook | Use |
|------------------|-----|
| `/using-superpowers` | Always |
| `verification-before-completion` | Before any “done” claim |
| `Agents/Agents-docs.md` | Doc structure and honesty |
| `Agents/Agents-failure.md` | Failures.md logging |
| `testing-handbook.md` | Zero suppression of test output already captured |

---

## Done when

CP-10 pass criteria all checked, MASTER-CHECKLIST backup + ethics + agent + git + non-claim rows green (or WAIVE-referenced), and `10-handover/README.md` is the single link owners can open to see truth.

---

## Related

| Doc | Role |
|-----|------|
| [../../INDEX.md](../../INDEX.md) | Program index |
| [../../00-START.md](../../00-START.md) | Approach, ethics, phase order |
| [../../checkpoints/CHECKPOINTS.md](../../checkpoints/CHECKPOINTS.md) | CP-00–CP-10 hard stops |
| [../../RESULTS-MAP.md](../../RESULTS-MAP.md) | Canonical evidence folders |
| [../../checklists/MASTER-CHECKLIST.md](../../checklists/MASTER-CHECKLIST.md) | Owner single checklist (94) |
| [../../checklists/AGENT-RULES.md](../../checklists/AGENT-RULES.md) | Subagent contract |
| [../../phases/P10-evidence-handover/P10-suggestions.md](../../phases/P10-evidence-handover/P10-suggestions.md) | Consistency suggestions applied this revision |

---

## Expert revision note — 2026-07-09

**Role:** Planning expert (plan-doc only; no product code; no push).  
**Inputs:** INDEX · CHECKPOINTS · RESULTS-MAP · MASTER-CHECKLIST · `phases/P10-evidence-handover/P10-suggestions.md` · user constraints (CP-10, E: paths, commit cadence, push/mirror per AGENTS.md, mesh path `08-mesh-quality`, superpowers).

**Top changes applied:**

1. **Hard no-product-code scope** — P10 never edits `site/`; missing gates reopen owning phases.
2. **RESULTS-MAP folder lock** — W7 = `08-mesh-quality/` (sole `08-*`); W8 = `09-shortcuts-chrome/`; P01 = `00-product-truth/`; ban landing W8 under retired `08-shortcuts-chrome/`. See FOLDER-LOCK 2026-07-09.
3. **Full MASTER sync** — all 9 sections / 94-box tally, not only W rows.
4. **Task 00–06 runbook** — ordered setup → pack → MASTER → commits → push policy → E: backup → CP-10 close.
5. **BACKUP-LOG schema + B.1–B.7** — per-source robocopy codes, spot-check INDEX + handover README, secrets exclusion.

Also: W0 in preconditions; Related footer; push status G.3; Expert note date-stamped.
