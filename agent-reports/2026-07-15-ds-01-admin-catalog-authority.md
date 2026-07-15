# DS-01 — Admin catalog & SVG authority

**Status:** Options design only. Not implemented.  
**UI verified this session:** **No.** Evidence is code + checklists + `Failures.md` + `07-ADMIN-UI-BENCHMARK.md` (prior session measurements). Live routes were not opened here.  
**Problem cluster:** Disk is released SVG truth; DB dual-write is stub; lifecycle/audit on files; Admin list admits “Products DB not live”; list UX is long tables + bulk JSON dominance.

---

## Goal

Make Admin publish trusted inventory once, with one authority, so Planner and Site never disagree on identity, dimensions, lifecycle, or symbol.

---

## Option A — Full DB-SVG cutover (target contract)

**What:** Implement `docs/architecture/08-DATABASE-SVG-CONTRACT.md` as live authority: immutable revisions + artifacts (R2) + product pointer + audit in **one transaction**; Planner/Admin read DB bytes only; disk becomes migration input.

| Pros | Cons |
|---|---|
| Matches owner-accepted architecture | Largest scope; blocks on schema, storage, backup, security |
| Ends split authority permanently | Migration dry-run + parity (`DB-SVG-17/18`) required before cutover |
| Enables durable lifecycle/audit | High risk if rushed without isolated DB tests |

**Best when:** You need production multi-env catalog truth soon.  
**Effort:** High · **Risk:** High until dry-run/parity green · **Unblocks:** Planner DB-SVG-10…16, Site released-only catalog

### Solution shape

1. Schema + Drizzle write path for `block_descriptors`, `published_svg_revisions`, `svg_artifacts`, product pointer.  
2. Replace stub dual-write with real definition snapshot + content hashes.  
3. Publish = upload artifacts → commit metadata+pointer+audit atomically → fail preserves prior public product.  
4. List/editor UI source badge becomes “Products DB”; disk path retires behind feature flag then dies.  
5. Migration tooling: inventory, conflicts, rejects, footprints, hashes; parity gate before removing disk.

---

## Option B — Honest disk authority + real dual-write later

**What:** Keep disk as **documented** live authority for N sprints. Fix stub dual-write to write real payloads additively (best-effort, never overrides disk). Harden list/lifecycle UX and file audit until cutover.

| Pros | Cons |
|---|---|
| Shipable Admin quality without DB cutover | Split authority remains; Vercel multi-instance disk is fragile |
| Reduces false confidence (“DB is live”) | Lifecycle still gitignored `results/admin/catalog-ops/` |
| Faster list/UI wins | Must rework consumers again at cutover |

**Best when:** Owner prioritizes operator UX and publish safety on disk first.  
**Effort:** Medium · **Risk:** Medium (ops/disk drift) · **Unblocks:** Admin list/benchmarks without claiming DB

### Solution shape

1. Kill stub `{slug}-r1` dual-write or hard-disable it until real; never log success as authority.  
2. UI copy + API responses state disk authority only.  
3. List: demote bulk JSON; operator columns (identity, SKU, family, lifecycle, symbol, last change); a11y names.  
4. Lifecycle file store: locked schema, backup script, never claim DB.  
5. Separate epic for Option A cutover with explicit gate.

---

## Option C — Hybrid: DB pointer + disk bytes (bridge)

**What:** Products DB stores product + `published_svg_revision_id` + metadata; artifact bytes still on disk/CDN path until R2 is ready. List and Planner resolve via pointer → disk key.

| Pros | Cons |
|---|---|
| Partial DB identity without full storage cutover | Still two systems; pointer/bytes can desync |
| Smaller than full R2 immutability | Easy to stall forever in “bridge” |
| Enables retire/restore against a DB lifecycle row | Not the accepted end-state contract |

**Best when:** Need product pointer + audit in DB this month, storage later.  
**Effort:** Medium–High · **Risk:** Medium–High (desync) · **Unblocks:** Lifecycle queries, partial Planner identity

### Solution shape

1. DB: draft row + revision metadata + pointer; bytes path remains `public/svg-catalog/{key}`.  
2. Publish transaction: pointer + metadata; disk write in same server flow with rollback on either failure.  
3. Planner `svg-blocks` loads by pointer then disk key; no silent “latest file wins.”  
4. Parity job compares pointer checksums to disk files.  
5. Explicit end-date to migrate bytes to R2 (Option A remainder).

---

## Recommendation

**Prefer Option A** as the only end-state. Use **Option B for the next 1–2 execution slices** only if DB/storage/backup is not owner-ready this week: stop lying about dual-write, fix Admin list UX, keep Failures honest. Avoid long-lived Option C unless owner accepts a dated bridge with a kill-switch.

---

## UI debt tied to this DS (unverified live)

| Surface | Claimed gap (docs/code) | Needs live proof |
|---|---|---|
| `/admin/svg-editor` list | Bulk JSON dominant; disk badge; long table | Screenshot + keyboard pass |
| `/admin/catalog` | ~60 rows; phone ~6.8k px; icon-only actions | Fresh 1440 / 390 viewports |
| `/admin/price-books` | Raw minor units; equal-risk action weight | Fresh governance journey |

---

## Key decisions (when owner picks)

1. Authority: disk vs DB vs hybrid.  
2. Whether dual-write may remain best-effort after list UX work.  
3. Whether Admin list ship can close without DB-SVG-01…05.

## Open questions

1. Is Products DB + R2 available for isolated non-release tests this sprint?  
2. Cutover owner and rollback owner?  
3. Is file-based lifecycle acceptable for any production deploy?

## PR plan (after option pick)

| PR | Depends | Content |
|---|---|---|
| A0 | — | Honest authority flags + remove stub dual-write success claims |
| A1 | A0 | List UX: filters, a11y names, demote bulk JSON (disk path) |
| A2 | owner DB | Schema + immutable revision write (or pointer-only if C) |
| A3 | A2 | Planner read path switch + parity tooling |
| A4 | A3 | Cutover + disk demotion + Failures cleanup |

---

*Agent report. Not checklist PASS. Not UI verification.*
