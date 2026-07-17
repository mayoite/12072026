# DOCS-4 TechStack plan trio

Verdict: **PARTIAL** (docs complete; gates not PASS)

Evidence: live `package.json`, `pnpm-workspace.yaml`, workflows, `site/tsconfig.json`, `env.server.ts`, `.env.example`, engine import greps. No install/gate re-run claimed.

## Done
- Created `plan/TechStack/FEATURES.md` — engines, scripts, gates, env names, CI→path→gap
- Created `plan/TechStack/FINISH-PLAN.md` — T0–T8, TF-01…24, gate checklist
- Refreshed `plan/TechStack/COMPLETION-CONTRACT.md` — 1:1 phases + TF/TS map

## Hard facts (not PASS)
- Root pnpm **11.13.0** vs CI **11.9.0** → TF-02/TF-21 **FAIL**
- typecheck includes `.next/dev/types` → TF-07 OPEN
- SVG authority disk live (Failures.md) → TF-10 PARTIAL
- Fabric / Three / Excalidraw / next-intl imports live; no konva/paper/pixi

## Not done
- Fresh `pnpm run gate` / lint / typecheck / test / release:gate
- CI pin fix (product change — out of this docs slice)
- Lockedfiles pin-sync after CI align

## Next
1. Align CI pnpm to 11.13.0  
2. Record real gate exits  
3. T4 then T6
