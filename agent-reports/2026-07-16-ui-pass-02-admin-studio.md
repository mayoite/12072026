# UI Pass 2 — Admin SVG edit studio shell

## Changed
- TopBar: one primary **Publish**; **Approve for buyers** secondary; **Reset draft** demoted; operator state (released / buyers / unsaved)
- Feedback under topbar; success alert; publish progress keep-open copy
- Status band: draft · validation · footprint · ready/blocked
- Preview rail + Product details + optional 3D; revision restore language
- `publishActionMessages` / publish gates: no schema/pipeline jargon
- Shell CSS: 1440 rails; sticky topbar + ≥44px taps at 390; primary full-width on phone
- Unit tests for edit-shell + ADM-SHELL + publish messages

## Verified
- Vitest edit-shell + ADM-SHELL + publish messages + EditView: **64/64** green
- ESLint on `features` (package lint): clean
- `pnpm run check:layout`: OK

## OPEN (no browser PASS)
- Live `/admin/svg-editor/[slug]` draw → preview → publish at 1440×900
- Phone review stack / sticky chrome at 390×844
- Keyboard focus order through publish path
