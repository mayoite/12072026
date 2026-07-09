# P10 — Evidence pack + handover + E: backup

> **For agentic workers:** REQUIRED SUB-SKILL: `/using-superpowers`. Also load `verification-before-completion` and `Agents/Agents-docs.md` before claiming done.  
> **Gate:** **CP-10**. Do not mark the trustdata program complete until every checkbox in this file is green with paths.

**Goal:** Produce a single final evidence pack that proves W0–W8 from data, sync MASTER checklist, back up the working tree and results to `E:`, commit landable docs/evidence slices locally, and hand over without a push unless the owner asks.

**Architecture:** Proof lives under `results/planner/world-standard-wave/`; checklists under `Plans/trustdata/checklists/`; this phase is documentation + verification + backup only — no product feature work unless a gate fails and owner reopens an earlier phase.

**Tech stack:** PowerShell on Windows; git on `D:\OandO07072026` main checkout only; Playwright/Vitest artifacts already produced by P03–P09; robocopy / Copy-Item for E: backup.

---

## Preconditions (hard stop if false)

- [ ] Approach A/B/C recorded in `Plans/trustdata/00-START.md` (default A if owner silent after unlock).
- [ ] CP-00 through CP-09 recorded green or owner-waived with reason in `Plans/trustdata/checkpoints/CHECKPOINTS.md`.
- [ ] W1–W8 each have a concrete evidence path under `results/planner/world-standard-wave/` (see RESULTS-MAP.md).
- [ ] Working tree is the main checkout: `D:\OandO07072026` — **no worktrees**.
- [ ] Superpowers / skills used for every non-trivial verification step this phase.

## Final evidence pack (create if missing)

Target root:

```
D:\OandO07072026\results\planner\world-standard-wave\10-handover\
```

Required files (all concrete; write them during this phase):

| File | Contents |
|------|----------|
| `10-handover/README.md` | Pack index: date, git HEAD short SHA, approach A/B/C, agent count used, link to each W gate folder |
| `10-handover/W-GATES.md` | Table W0–W8 → pass/fail → primary evidence path → secondary path |
| `10-handover/MASTER-SYNC.md` | Snapshot of checkbox counts from MASTER-CHECKLIST.md (total / done / open) |
| `10-handover/HEAD.txt` | Output of `git rev-parse HEAD` and `git status -sb` (no secrets) |
| `10-handover/FAILURES-SNIP.md` | Open blockers only, copied from `Failures.md` with file:line style pointers |
| `10-handover/BACKUP-LOG.md` | E: destination path, start/end time, robocopy exit code, size summary |

### W-gate evidence binding (must match RESULTS-MAP)

| Gate | Primary folder (must exist) | Pass artifact minimum |
|------|----------------------------|------------------------|
| W0 | `00-start/` or pack notes in `10-handover/W-GATES.md` | Approach pick + engine checkboxes recorded |
| W1 | `02-browser-open3d-journey/` | Playwright run.json + wall/door screenshots |
| W2 | `02-browser-open3d-journey/` + `05-symbols-svg/` | Place ≥2 items + cabinet-v0; Block2D unit/PNG symbol proof |
| W3 | `03-select-delete/` | Unit + Playwright select/delete/undo |
| W4 | `04-orbit-continuity/` | 2D↔3D pose + orbit ON + console clean log |
| W5 | `06-save-honesty/save-reload/` (or `06-save-honesty/` if single folder holds both) | Hard reload same wall + furniture ids |
| W6 | `06-save-honesty/` | UI copy truth (local vs cloud) + test/code note |
| W7 | `08-mesh-quality/` | NOTES + visual smoke cabinet-v0 readable parts |
| W8 | `08-shortcuts-chrome/` | Unit/keyboard map labels match handlers |

If a primary folder is empty or missing run.json / screenshots / NOTES as required, **CP-10 fails**. Reopen the owning phase (P03–P09); do not invent pass claims.

## MASTER checklist sync

Owner file: `Plans/trustdata/checklists/MASTER-CHECKLIST.md`

Steps:

1. Open MASTER-CHECKLIST.md.
2. For every W0–W8 row, set checkbox only when the evidence path in W-GATES.md exists and was re-read this session.
3. Mark ethics rows from live `00-START.md` and `checklists/AGENT-RULES.md` compliance (inspiration-only research; no competitor assets in `site/`).
4. Mark agent-ops rows: superpowers used, concurrent ≤10, no worktrees, commit cadence followed, push not done unless owner asked.
5. Mark backup row only after BACKUP-LOG.md shows successful E: copy.
6. Write the checkbox tallies into `10-handover/MASTER-SYNC.md`.

**Rule:** MASTER-CHECKLIST is the single owner truth. Phase files and WAVE.md are supporting; they do not override MASTER after sync.

## Local commit cadence (this phase)

Standing rule from `AGENTS.md` / `00-START.md`:

| When | Action |
|------|--------|
| After evidence pack files land | One local commit: `trustdata(P10): evidence pack 10-handover` |
| After MASTER checklist sync | One local commit: `trustdata(P10): MASTER checklist sync W0-W8` |
| After E: backup succeeds | One local commit: `trustdata(P10): backup log + CP-10 notes` (log only in-repo; do not commit secrets) |
| After handover README complete | One local commit: `trustdata(P10): handover complete CP-10` |

Commit rules:

- [ ] Commit on main checkout only (`D:\OandO07072026`).
- [ ] Message states phase + what landed (no empty “WIP” mega-commits for days of work).
- [ ] Do **not** `git push` / force-push / delete remote branches.
- [ ] Do **not** create git worktrees.
- [ ] Do not commit `.env`, keys, cookies, or E: full binary dumps into git unless owner explicitly asks.

## Push policy

- **Default:** no push.
- **Push only when** the owner writes an explicit ask in the **current** conversation (e.g. “push this” / “push to origin”).
- If owner asks push: confirm branch name and remote; never force without a second explicit ask.
- Record push decision in `10-handover/README.md` as `push: not requested | requested and done | requested and blocked`.

## E: drive backup procedure

**Purpose:** Survive disk loss of `D:` with planner truth + evidence + plan pack.

### Destinations (create dated folder)

```
E:\OandO-backups\trustdata-YYYY-MM-DD\
```

Example for 2026-07-09:

```
E:\OandO-backups\trustdata-2026-07-09\
```

### What to copy (minimum set)

| Source | Destination under dated folder | Notes |
|--------|--------------------------------|-------|
| `D:\OandO07072026\Plans\trustdata\` | `Plans\trustdata\` | Full plan pack |
| `D:\OandO07072026\results\planner\world-standard-wave\` | `results\planner\world-standard-wave\` | All W evidence |
| `D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md` | `docs\superpowers\specs\` | Design authority |
| `D:\OandO07072026\Failures.md` | `Failures.md` | Open blockers |
| `D:\OandO07072026\ayushdocs\08-EVIDENCE-INDEX.md` | `ayushdocs\` | Cross-index if present |
| `D:\websites\research\2026-07-09-world-standard\` | `websites-research\2026-07-09-world-standard\` | Ideas-only research (optional but recommended) |

### Optional larger snapshot (owner may request)

| Source | Destination | Notes |
|--------|-------------|-------|
| Entire `D:\OandO07072026` excluding `node_modules`, `.next`, large `public` GLB caches if owner says skip | `repo-snapshot\` | Use robocopy `/XD node_modules .next` |
| `D:\websites\` competitor packs | `websites-full\` | Inspiration only; do not merge into product |

### PowerShell procedure (run from elevated-enough user with E: mounted)

```powershell
$date = Get-Date -Format 'yyyy-MM-dd'
$dest = "E:\OandO-backups\trustdata-$date"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# Minimum set
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

### Backup acceptance

- [ ] `E:` drive is mounted and writable before start.
- [ ] `$dest` exists and contains `Plans\trustdata\INDEX.md`.
- [ ] `$dest\results\planner\world-standard-wave\10-handover\README.md` exists after pack write + copy (or copy after pack).
- [ ] Write `10-handover/BACKUP-LOG.md` with: date, `$dest`, robocopy/Copy-Item outcomes, approximate byte size (`Get-ChildItem -Recurse | Measure-Object -Property Length -Sum`).
- [ ] If E: missing or full: **stop CP-10**; log in `Failures.md`; do not claim handover complete.

## Honesty / anti-claims

- [ ] Do not claim “product works” from unit-green alone.
- [ ] Do not claim W gates green without screenshots / run.json / NOTES as listed.
- [ ] Do not treat ayushdocs P0-DONE notes as world-standard pass.
- [ ] Trust data (repo, tests, browser artifacts) — never put the owner on trial for character.

## Handover narrative (write into 10-handover/README.md)

Required sections:

1. **What is true now** — one paragraph, data-backed.
2. **W0–W8 status table** — pass/fail with paths.
3. **Open blockers** — from Failures.md only.
4. **Next phase outside trustdata** — Fabric full stage (Approach B) only after W1–W8 green; CRM/SSR still out of scope while any W is red.
5. **Git** — HEAD, commits made this phase, push status.
6. **Backup** — E: path and log pointer.

## CP-10 pass criteria (all required)

- [ ] `results/planner/world-standard-wave/10-handover/` complete with all six required files.
- [ ] MASTER-CHECKLIST.md synced; MASTER-SYNC.md tallies match.
- [ ] Every W1–W8 primary folder has required artifacts or explicit owner waiver in CHECKPOINTS.md.
- [ ] E: backup logged and verified.
- [ ] Local commits created for each landable slice above.
- [ ] No push unless owner asked; push status recorded.
- [ ] CHECKPOINTS.md row CP-10 marked pass with date and evidence path.

## Stop-if-fail

| Failure | Action |
|---------|--------|
| Any W1–W8 primary evidence missing | Reopen owning phase; CP-10 stays fail |
| MASTER checkboxes green without paths | Revert checkboxes; treat as integrity fail |
| E: not available | Log Failures.md; CP-10 fail; keep D: pack intact |
| Agent used worktree or pushed without ask | Stop; record in Failures.md; owner decision |
| Secrets found in pack | Remove; scrub; re-commit; do not copy secrets to E: |

## Skills for this phase

| Skill / handbook | Use |
|------------------|-----|
| `/using-superpowers` | Always |
| `verification-before-completion` | Before any “done” claim |
| `Agents/Agents-docs.md` | Doc structure and honesty |
| `Agents/Agents-failure.md` | Failures.md logging |
| `testing-handbook.md` | Zero suppression of test output already captured |

## Done when

CP-10 pass criteria all checked, MASTER-CHECKLIST backup + ethics + agent rows green, and `10-handover/README.md` is the single link owners can open to see truth.
