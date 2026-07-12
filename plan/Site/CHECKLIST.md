# Site — CHECKLIST

One checklist for the track. Live run gates each tick; `results/` is a dump. Failures → `../FAILURES.md`.

## PHASE-01 — Dependency cleanup
- [ ] Owner said "execute" for the cut list
- [ ] Each removed dep grep-proven unused (starting `@fancyapps/ui`)
- [ ] `pnpm install` clean
- [ ] Typecheck green

## PHASE-02 — Site chrome parity
- [ ] Nav + theme reachable at desktop and 375×812
- [ ] Light/dark parity across chrome
- [ ] No clipped/overflowing chrome on mobile
- [ ] Screenshots captured (marketing + planner entry, both themes)
