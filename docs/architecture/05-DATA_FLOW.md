# Product data flow

## Catalog publication

1. Admin edits a draft product and SVG scene.
2. Server validation checks identity, dimensions, structure, and safety.
3. The publish compiler produces deterministic SVG bytes.
4. The server uploads immutable content-addressed artifact bytes.
5. One Products DB transaction inserts metadata, updates the same-product pointer, and records audit.
6. Planner loads the released database catalog through a server API.
7. Planner imports the exact SVG revision and renders it first.
8. `Block2D` is used only while loading or when SVG is unavailable.

A failed compile, upload, or transaction leaves the previous publication intact.

An uploaded object is not released until the database pointer commits.

## Customer planning

1. The customer opens a guest or member Planner route.
2. One normalized document drives the canvas, 3D view, save, and export.
3. Placed products retain catalog identity and selected options.
4. Save failure never displays success.
5. Reload restores the same normalized document.

## BOQ handoff

1. Planner reads placed catalog-backed products.
2. It groups stable product and option identities.
3. It generates matching branded JSON, CSV, and PDF outputs.
4. The customer reviews the BOQ.
5. The customer submits it to an Oando-controlled destination.
6. Submission stores project revision, BOQ hash, consent, and status.
7. Retry uses an idempotency key.

Commercial pricing is excluded until an approved price authority exists.

## Storage authority

The Products database is the released product and SVG authority.

It owns release identity and pointer state.

Immutable object storage owns artifact bytes.

Admin draft data remains private.

Planner pins product and SVG revision identity.

Static files are migration inputs or isolated fixtures only.

The R2 snapshot is a degraded-read layer only.

The exact contract is `08-DATABASE-SVG-CONTRACT.md`.
