# RESULTS-CHECK — world-standard-wave dumps

**When:** 2026-07-12  
**Scope:** read-only honesty pass on `results/planner/world-standard-wave/*`  
**Law:** dumps ≠ PASS. Plans + live code = law. This file is agents-work only (not `results/`).

---

## Summary table

| Gate / folder | Present? | Key artifacts | JSON status | Red flags |
|---------------|----------|---------------|-------------|-----------|
| **W3** `03-select-delete/` | **YES** | NOTES · HEAD `2c2e9f2b…` · vitest-unit.json · identity-proof.json · diag.json · **4 PNGs** · probe JS · **no** `browser-run.json` | vitest: `success:true` **113/113** · identity-proof: place4→delete3→undo4, `idSetRestored:true` | NOTES claim browser PASS without `browser-run.json` (uses identity-proof instead — OK as alt proof if e2e wrote it). `diag.json` shows hostRect `y=-639` (layout-bug intermediate probe; not final journey proof). Dump claims ≠ CP-03 Plans law. |
| **W4** `04-orbit-continuity/` | **YES** (full pack) | NOTES · HEAD `2c2e9f2b…` · browser-run.json · vitest-unit.json · **3 PNGs** | browser: `status:"browser-green"`, `idSetStable:true`, `orbitEnabled:true` · vitest: `success:true` **9/9** | NOTES assert CP-04 **PASS** — dump-only; law is Plans. Honest residual listed: no live Three mesh/userData assert in browser. |
| **W1/W2** `02-browser-open3d-journey/` | **YES** (full pack) | NOTES · HEAD `2c2e9f2b…` · playwright-run.json · playwright-raw.log · CODE-REVIEW-WALL · **7 journey PNGs** + probes | `result:"pass"`, gates W1/W2 pass, walls 4→5, furniture 0→2 | Solid browser dump. Symbol quality deferred to P05 in proof. |
| **W1/W2 alias** `07-browser-journey/` | **YES** (thin alias) | NOTES · playwright-run.json only · **0 PNGs** | same `result:"pass"` + `canonicalEvidence` → `02-browser-open3d-journey/` | Alias only — not independent proof. Missing HEAD/PNGs here by design. |
| **P05** `05-symbols-svg/` | **MISSING** | — | — | **No folder.** Board next-open is P05; zero dump evidence. |
| **P06** `06-save-honesty/` | **PARTIAL** | Only `save-reload/`: **3 PNGs** + `06-browser-run.json` · **no** root NOTES · **no** HEAD · **no** vitest | browser: `result:"pass"`, gate W5, walls/furniture id match true, timestamp `2026-07-12T14:48:18.875Z` | **Mid/incomplete pack:** browser sub-dump only. No NOTES, HEAD, unit layer, W6 if required. Slice A/B may still be writing root files — treat as **partial, not closed**. |
| **P08** `08-mesh-quality/` | **YES** (unit pack) | NOTES · HEAD `2c2e9f2b…` · vitest-unit.json · **0 PNGs** · **no** browser-run | vitest: `success:true` **29/29** | NOTES honest: unit bar only; visual smoke residual; no ship claim from units alone. |
| **P09** `09-shortcuts-chrome/` | **YES** (unit pack) | NOTES · HEAD `2c2e9f2b…` · vitest-unit.json · **0 PNGs** · **no** browser-run | vitest: `success:true` **23/23** | NOTES: unit = W8 close bar this session; optional browser residual. No empty PASS theater. |
| **P01** `00-product-truth/` | **YES** | NOTES · HEAD **`9d0d3cda…`** (stale) · run.json · INVENTORY · orphan-cleanup HEAD `2c2e9f…` | run.json phase P01, vitestSmoke ok | **Stale HEAD** vs live wave `2c2e9f…`. Inventory may lag layout. |
| **P02** `01-engine-lock/` | **YES** | NOTES · HEAD `2c2e9f…` · vitest-p02 · lock md pack · 1 PNG · OWNER-SIGNOFF-STATUS OPEN | vitest: **19/19** `success:true` | Owner signoff still OPEN — unit ≠ CP-02 PASS. |
| **aux** `chrome-smoke-a11y/` | **YES** | NOTES · HEAD · LH reports · many PNGs/snapshots | shell smoke; NOTES: **not** W1–W8 product PASS | Good honesty. Pre-restart 500 documented. |
| **aux** `agent-jobs/` | **YES** | reviews · OUTCOME · superpowers-wave VERIFY | — | **STALE meta:** VERIFY/OUTCOME claim 03–09 folders **missing** — written before later dumps. Do not use as current inventory. |
| **aux** `08-agent-swarm-chrome/` | **EMPTY** | — | — | Empty dir only; not a mesh or swarm proof. |
| **P10+** `10-handover/` etc. | **MISSING** | — | — | Not started in this tree. |

---

## Per-folder detail (requested gates)

### 1. W3 — `03-select-delete/`
- **Present.** Date in NOTES: 2026-07-12.
- Artifacts: NOTES, HEAD (`2c2e9f2b…`), vitest-unit.json (113 pass), identity-proof.json (id set place/delete/undo), diag.json, 4 PNGs, probe scripts.
- **Missing:** `browser-run.json` (named proof is identity-proof + PNGs).
- NOTES: unit green + browser PASS claim for `open3d-w3-select-delete.spec.ts`. Hard rule in NOTES: dump ≠ law.

### 2. W4 — `04-orbit-continuity/`
- **Present, complete-looking.** NOTES, HEAD, browser-run, vitest, 3 PNGs.
- browser-run: `browser-green`, id set stable 2D→3D→2D, orbit on.
- Red flag soft: NOTES say “CP-04 PASS” (agent-delegated) — still dump language, not Plans law.

### 3. W1/W2 — `02-browser-open3d-journey/` + `07-browser-journey/`
- **02:** full evidence (7 PNGs + playwright-run pass).
- **07:** thin alias pointing canonical evidence at 02.
- Dump evidence for journey: **yes** (under 02).

### 4. P05 — `05-symbols-svg/`
- **Missing entirely.** No mid-write fragments found under world-standard-wave.
- Not “partial” — **dump-missing**.

### 5. P06 — `06-save-honesty/`
- **Partial.** Only `save-reload/` with 3 PNGs + `06-browser-run.json` claiming `result:"pass"` (W5 id match).
- No root NOTES/HEAD/vitest. **May still be mid-write by Slice A/B** — do not treat as closed pack.
- Superpowers VERIFY is outdated (said NO; folder now exists partially).

### 6. P08 — `08-mesh-quality/`
- **Present (unit).** vitest 29/29, NOTES residual honesty OK.
- No browser PNGs / run.json — matches stated unit bar.

### 7. P09 — `09-shortcuts-chrome/`
- **Present (unit).** vitest 23/23, NOTES residual honesty OK.
- No browser layer in dump.

### 8. Other glance
- `00` stale HEAD; `01` owner OPEN; chrome-smoke honest non-gate; agent-jobs meta **stale**; empty `08-agent-swarm-chrome/`.

---

## Dump evidence vs dump-missing (bottom line)

| Gate | Dump evidence? |
|------|----------------|
| W1/W2 (P07) | **YES** — strong (`02-…`; `07-…` alias) |
| W3 (P03) | **YES** — strong-ish (PNGs + identity-proof + unit; no browser-run.json) |
| W4 (P04) | **YES** — strong (browser-run + PNGs + unit) |
| P05 symbols | **MISSING** |
| P06 save | **PARTIAL** (browser W5 subfolder only; root incomplete / possible mid-write) |
| P08 mesh | **YES unit-only** (no visual dump) |
| P09 shortcuts | **YES unit-only** (no browser dump) |
| P01 truth | **YES but stale HEAD** |
| P02 engine | **YES unit/artifacts; owner OPEN** |

**Gates with dump evidence:** W1/W2, W3, W4, P08 (unit), P09 (unit), P01 (stale), P02 (owner open).  
**Dump-missing:** **P05** completely.  
**Partial / mid-write risk:** **P06** (browser JSON+PNGs only).  
**Do not trust:** `agent-jobs/superpowers-wave/02-VERIFY-PLAN-STAGES.md` and swarm OUTCOME “folders missing” lines — superseded by later dumps.

**Reminder:** Even green dumps do not move Plans PASS. Re-check BOARD/CHECKPOINTS separately if status must change.
