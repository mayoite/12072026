# Area F — Stray Cleanup

## `site/nul`

Untracked file `site/nul` — accidental Windows `> nul` redirect artifact (created when a command redirected stdout to `nul` without quoting on PowerShell). Not a real source file.

**Action:** `Delete site/nul`.

- Verify `site/nul` is untracked
- Delete `site/nul` — **already absent** (verified 2026-07-01: `Test-Path site/nul` → false; not in `git ls-files --others`)

Archive-over-delete per AGENTS.md, but this is a zero-content artifact with no value — delete is appropriate.

## Post-delete check

- `git status --short -- site/nul` → empty. No lint/typecheck impact.
