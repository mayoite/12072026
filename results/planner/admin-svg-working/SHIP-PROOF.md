# Admin SVG publish — ship proof
- Date: 2026-07-10
- HEAD before commit: see git
- p0:svg fixtures: 4/4 OK
- unit admin svg-editor: 69/69 earlier; publish+runner re-run below green
- playwright admin-svg-publish-p01: 2/2 PASS (list + API publish side-table)
- DEV_AUTH_BYPASS=1 PLAYWRIGHT_BASE_URL=http://localhost:3000
- Fixes: API uses publishDescriptorWithPipeline; pipeline root prefers full source tree; polygon-clipping load robust under Next
