# Product data flow

## Catalog publication

1. Admin edits a draft product and SVG scene.
2. Server validation checks identity, dimensions, structure, and safety.
3. The publish compiler produces deterministic SVG bytes.
4. Publication writes a versioned descriptor and public SVG atomically.
5. Planner loads the published catalog contract.
6. Planner renders the published SVG first.
7. `Block2D` is used only while loading or when SVG is unavailable.

A failed compile or write leaves the previous publication intact.

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

## Storage direction

Public static catalog files are the first authority.

The contract must permit later object or cloud storage without changing customer documents.
