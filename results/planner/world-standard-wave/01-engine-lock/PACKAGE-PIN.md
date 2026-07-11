# PACKAGE-PIN — P02 engine lock (live `site/package.json`)

**Phase:** P02 engine lock (evidence only — no package upgrades)  
**Evidence folder:** `results/planner/world-standard-wave/01-engine-lock/`  
**Source:** `site/package.json` (dependencies + devDependencies scanned)  
**Recorded at tip:** see `HEAD.txt` / `run.json` / `RUN-META.json`  
**Date:** 2026-07-11  

---

## Engine pins (authoritative freeze)

| Package | Spec in package.json | Notes |
|---------|----------------------|--------|
| `fabric` | **`7.4.0`** | Exact pin (no caret) — sole 2D host lib |
| `three` | `^0.185.1` | Planner 3D |
| `@react-three/fiber` | `^9.6.1` | R3F |
| `@react-three/drei` | `^10.7.7` | R3F helpers |

---

## Hybrid ban — Konva

| Package | Status |
|---------|--------|
| `konva` | **ABSENT** (not in dependencies or devDependencies) |
| `react-konva` | **ABSENT** (not in dependencies or devDependencies) |

No Konva path for planner 2D. One interactive 2D host only (Fabric).

---

## Related (not engine-lock core)

| Package | Spec | Status |
|---------|------|--------|
| `@google/model-viewer` | `^4.3.1` | Present (admin / preview path; noted in ENGINE-LOCK-RECORD) |

---

## Hygiene flags (present — do **not** remove without owner)

These are **not** part of the open3d engine freeze. Flagged for hygiene only; removal is out of scope for P02.

| Package | Spec | Flag |
|---------|------|------|
| `@fancyapps/ui` | `^6.1.14` | Present — hygiene flag |
| `gsap` | `^3.15.0` | Present — hygiene flag |
| `@gsap/react` | `^2.1.2` | Present (gsap React bindings) — hygiene flag |

**Action:** leave in place until owner decides. Do not prune as part of engine lock.

---

## Freeze policy (this file)

- **No package upgrades** under P02 evidence seats.
- Pin table above is a **snapshot of declared ranges**, not a demand to lock caret ranges to exact resolved versions unless owner asks.
- Re-pin when tip moves: re-read `site/package.json`, update this file + `run.json` packagePinsObserved, re-run unit freeze pack.
