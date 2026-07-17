# Active Blockers and Failures

- SVG inventory publication. Fresh localhost Admin Publish for `side-table-001` returned `500.storage: Immutable artifact upload failed. Unauthorized`; rollback kept the prior released symbol. `.env.local` has no S3 Access Key ID accepted by `resolveR2Credentials`. Next action: provide a valid bucket-scoped R2 S3 Access Key ID and re-run one isolated publication.
- Vercel SVG authoring persistence. Code inspection shows `publishDescriptorWithPipeline.ts` writes `public/svg-catalog/` and `inventory/descriptors/` before R2/Products DB, while lifecycle state is also filesystem-backed. Next action: complete `DB-SVG-01` through `DB-SVG-16` so DB plus immutable R2 artifacts are the release authority.
