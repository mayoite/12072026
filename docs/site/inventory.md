# Live disk inventory

**SVG descriptor JSON** (authoring authority on disk) lives in `descriptors/`.

| Layout | Meaning |
|--------|---------|
| `{slug}.json` | Legacy single file (still supported) |
| `{slug}.latest.json` | Pointer to current version |
| `{slug}.{n}.json` | Version `n` of the descriptor |

There is **no** separate `descriptors/_archive/` directory. Older versions are co-located as numbered files.

Compiled SVG output: `public/svg-catalog/` (HTTP-served).

## Path resolution

Use `resolveBlockDescriptorsDir()` in `lib/paths/sitePackageRoot.ts`.

Do **not** use a `block-descriptors/` folder — that path was removed; it is not a load root.

## Related runtime

| Concern | Location |
|---------|----------|
| Lifecycle / audit logs | repo-root `results/admin/catalog-ops/` (gitignored) |
| Admin authoring UI | `features/admin/svg-editor/` |
| Loader | `features/planner/project/catalog/svg/svgBlockDescriptorLoader.ts` |
| Target DB authority | `docs/architecture/08-DATABASE-SVG-CONTRACT.md` |

## Tests

Never mutate files under `descriptors/` in unit tests. Use `os.tmpdir()` fixtures.
Loader contracts: `tests/unit/features/planner/catalog-api/blockDescriptorLoader.test.ts`,  
`tests/unit/lib/paths/blockDescriptorsDir.test.ts`.
