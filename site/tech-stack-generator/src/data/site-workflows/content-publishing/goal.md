# Content Publishing — Goal

**Targets (measurable + best standards):**

- Clear seam: admin authors → descriptor + artifact → portal render (no direct DOM copy).
- Portal uses exactly the Puck Render contract (≤1 instance).
- Full 1B: admin compose parity with portal preview.
- Every publish produces evidence: run logs, golden match, screenshots in results/.
- Industry: deterministic outputs, versioned descriptors, audit trail.
- Tech-stack integration: workflows documented here drive site-workflows/content-publishing/ + generator.
- GS: anti-copy on published SVGs/previews; UI review + benchmark before acceptance (design spec §8,14).

**Verifiable:**
- Golden roundtrips + resolver tests pass.
- `test:planner-catalog` + portal e2e.
- Update Lockedfiles after 1B acceptance.
- Refer `docs/Lockedfiles/svg-pipeline/proposed.md`.
