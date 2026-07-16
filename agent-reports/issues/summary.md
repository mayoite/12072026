# Issues Summary

Date: 2026-07-16

This folder summarizes the issue-pack reports from the old root markdown set:

- `2026-07-15-issues-01-code.md`
- `2026-07-15-issues-02-planner.md`
- `2026-07-15-issues-03-admin.md`
- `2026-07-15-issues-04-site.md`
- `2026-07-15-issues-05-tech-stack.md`
- `2026-07-15-issues-INDEX.md`

## UI

The issue packs repeatedly say that UI is not browser-proven.
Where they talk about UI, they point to missing keyboard, mobile, and live-browser proof rather than final design success.
The UI pack is a set of gaps and benchmark targets, not a completion claim.

## Security

Security is the loudest theme across the issue packs.
The recurring problems are DB-SVG cutover, SVG XSS risk, auth bypass evidence, non-atomic publish, rate limits, and production proof gaps.
The tech-stack pack also warns about environment footguns and misleading success signals.

## File Structure

The issue packs are split by domain: cross-cutting code, Planner, Admin, Site, Tech Stack, and a UI pack index.
That structure makes the backlog easy to scan.
It also means the files are a ledger of open problems, not a design guide.

## Uses

Use these reports as the main open-issue backlog.
They are good for tracking blockers, explaining why a claim is still open, and tying work back to `Failures.md`.
They are also useful when you need a compact list of the most important unresolved product and platform problems.

## Risks

The biggest risk is treating the list as stale truth after code moves on.
The packs are broad, so they can feel more dramatic than the current state unless you recheck the live tree.
They should not be used as proof of current failure without fresh verification.

## Suggestions

Use this folder as the backlog index.
Keep the highest-risk items synced with `Failures.md`.
If a report has been stamped or superseded, re-read the live code before acting on it.

