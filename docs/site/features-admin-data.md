# Admin local runtime data

Mutable files for dev and E2E. **Not** catalog or SVG descriptor authority.

| Path | Role |
|------|------|
| `price-books/*.json` | File-backed price book state |
| `price-books/_price-book-audit.jsonl` | Append-only audit log |

Seeds: `features/admin/pricing/fixtures/`.

SVG descriptors: `inventory/descriptors/` only.  
Lifecycle/audit for SVG: repo-root `results/admin/catalog-ops/`.

Production target for price books: `platform/drizzle` `price_books` tables.
