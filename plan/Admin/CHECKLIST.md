# Admin checklist

Admin is the internal inventory authority.

All items require fresh verification.

## Isolation first

- [ ] Catalog tests use a temporary copy or temporary directory.
- [ ] Test cleanup runs in `finally` after success, failure, and timeout.
- [ ] Tests never write to `site/block-descriptors/` or `site/public/svg-catalog/`.
- [ ] Repeating the focused Admin tests leaves canonical catalog bytes unchanged.
- [ ] Browser tests use stable controls. No forced clicks hide UI defects.

This section blocks only tests that can mutate the catalog.

## Public catalog authority

- [ ] One versioned public catalog contract drives Admin and Planner.
- [ ] Product identity, dimensions, availability, SVG, and BOQ fields are explicit.
- [ ] Published files are immutable or revision-addressed.
- [ ] Draft, published, retired, and rollback states behave consistently.
- [ ] Invalid or incomplete inventory cannot publish.
- [ ] The contract has a documented cloud-storage migration seam.
- [ ] Repeated publication is deterministic and idempotent.

## Admin workflow

- [ ] Admin routes require the Admin role on page and API boundaries.
- [ ] Admin can create, edit, preview, publish, retire, and restore inventory.
- [ ] SVG authoring has selection, properties, layers, undo, redo, and recovery.
- [ ] Preview and published bytes use the same compiler authority.
- [ ] SVG publication is sanitized, bounded, deterministic, and atomic.
- [ ] Product families and options drive 2D, 3D, and BOQ identity together.
- [ ] Invalid option combinations fail with a clear reason.
- [ ] Audit records identify actor, action, product, revision, and time.
- [ ] Failure never displays a saved or published success state.

## Admin interface quality

- [ ] The catalog list supports search, filter, status, and clear actions.
- [ ] The editor exposes the current draft and published revision.
- [ ] Keyboard access covers every authoring and publishing action.
- [ ] Focus is visible and unobscured.
- [ ] Errors identify the field or operation that failed.
- [ ] The layout works at supported desktop widths without hidden controls.
- [ ] Loading, empty, error, and success states are distinct.

## Security and release checks

- [ ] CSRF protects state-changing browser requests.
- [ ] Upload and SVG inputs enforce type, size, structure, and safe names.
- [ ] Server authorization does not trust client role claims.
- [ ] Rate limits protect expensive or abusive endpoints.
- [ ] Secrets and private storage locations never reach client bundles.
- [ ] Dependency and secret scans run without suppressed findings.
- [ ] Focused unit, API, and browser checks pass from a clean catalog state.
- [ ] Typecheck and lint pass for changed Admin surfaces.

## Completion record

- [ ] Fresh commands and exit codes are recorded here.
- [ ] Remaining failures are active entries in `../../Failures.md`.
- [ ] No resolved failure remains in `../../Failures.md`.
