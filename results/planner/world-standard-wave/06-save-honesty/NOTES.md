# W6 save honesty — unit land + W5 hard-reload (2026-07-09)

## Code
- createAutoSaver.flush + pending snapshot
- unmount/pagehide/visibility: flush then cancel
- flushPersist on explicit Save
- Labels: Saved locally / Saving locally (no bare Saved / server claim)

## Unit
planner-autosave + workspaceStatusLabels: 12/12 pass

## Browser hard-reload (W5)
**PASS** — see `save-reload/`
- Spec: `site/tests/e2e/open3d-save-honesty.spec.ts`
- 1 passed @ PLAYWRIGHT_BASE_URL=http://localhost:3000
- Screenshots 01–03 + `06-playwright-raw.log` + `06-browser-run.json`
- Assert: furniture count restored after hard reload (status bar `N furniture`)

## HEAD
see git after commit
