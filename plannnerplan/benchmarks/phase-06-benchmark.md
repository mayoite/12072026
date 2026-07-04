# Reference Execution Benchmark Phase 06 — Uploads, AI, Export, And 3D — 2026-07-03

Status: advisory only. Immutable after creation under `DESIGN-BENCHMARK-PROTOCOL.md`. Becomes binding only when incorporated into a numbered phase file, `IMPLEMENTATION-DECISIONS.md`, or `QUALITY-GATES.md`.

Access date for all URLs: 2026-07-03.

## Products Reviewed

- Floorplanner: export formats, async export API, tiered output
- RoomSketcher: AI convert, upload limits, background rendering
- Vectorworks 2026: export preflight and format options
- Figma: per-format export settings and accessibility announcements
- Planner 5D: AI recognition, 2D/3D workflow, long-running jobs

## Benchmark Takeaways

- Upload limits must be explicit before submission.
- AI recognition needs scale calibration before processing.
- AI output should be previewed before commit.
- Heavy export and AI jobs must run in the background with progress and cancel support.
- Export settings should be format-specific, not one generic dialog.
- 3D should load on demand, not as an always-on renderer.
- Missing 3D assets need graceful fallback behavior.
- Canvas-based upload/export/AI state changes need explicit accessibility announcements.
- API keys and provider details stay server-side.

## Binding Changes For Phase 06

1. Validate upload type, file size, and dimensions in the UI before upload starts.

2. Allow only one active recognition job per session unless an explicit queueing design is approved.

3. Require scale calibration before AI recognition submission.

4. Use preview → confirm → commit for AI-generated plan results.
   Cancel at preview must leave no saved mutation.

5. Run large exports and AI jobs as background jobs with:
   job token, progress, cancel path, completion state, and durable evidence.

6. Auto-flush stale computed state before export.
   Do not silently export outdated geometry or metadata.

7. Expose per-format export options:
   SVG, PNG, PDF, and DXF each get their own relevant advanced settings.

8. Load 3D lazily on explicit mode switch and preserve the 2D working state when returning.

9. Show placeholder geometry or labeled fallback when a 3D asset is missing or fails to load.

10. Announce non-visual job state through accessibility primitives:
    export started, progress, complete, cancelled, AI submitted, AI ready, and import errors.

11. Keep AI, export, and render credentials server-side only.

12. Use deterministic output naming:
    `[project-name]-[floor]-[format]` with optional user suffix.

## Rejected Patterns

- Do not copy a pricing model into the technical design.
- Do not copy a full CAD-grade export dialog when a smaller planner-focused dialog is enough.
- Do not block the UI for long exports.
- Do not accept unsupported source images just because users can upload them.
- Do not expose provider names, model names, or API keys in client-visible output.
- Do not treat RoomSketcher or Planner 5D job duration as a target; copy the workflow pattern, not the slowness.

## Accepted Inspirations

- mandatory scale reference before AI recognition
- preview-before-commit for AI output
- format-specific export settings
- export preflight before file generation
- background jobs with progress and cancel
- explicit accessibility announcements for non-visual job state
- 3D as a lazy destination mode

Use these as workflow principles only.
