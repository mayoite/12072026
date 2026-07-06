# Tech Stack Documentation Generation Design

**Status:** Approved.  
**Scope:** Monorepo-root generation, standalone Vite documentation renderer, structured generated Markdown, copied site CSS, and generated static output.

## Objective

Generate human-readable technical documentation from canonical monorepo sources with:

- 100% provenance coverage for emitted factual fields
- exact normalized field-level source matching
- no manually maintained factual content
- a standalone Vite documentation site using a build-time copy of the main site CSS
- deterministic generated output under `Documents/`

This does not claim that generated interpretation is universally true. Unsupported interpretation and narrative are omitted rather than guessed.

## Ownership

- `tech-stack-generator/scripts/`: cross-package orchestration, extraction, normalization, Markdown generation, CSS synchronization, manifests, and drift checks
- `site/`: canonical application facts and canonical site CSS
- `tech-stack-generator/`: standalone Vite renderer consuming generated data and copied CSS
- `tech-stack-generator/src/generated-css/`: refreshed copy of canonical site CSS
- `Documents/tech-stack-generated/`: final standalone Vite build
- `Documents/markdown/`: structured generated Markdown
- `Documents/data/`: normalized generated facts and search/page data

Neither `site/scripts/` nor `tech-stack-generator/scripts/` owns cross-package generation.

## Data Flow

1. Root generation reads canonical sources across the monorepo.
2. Extractors produce normalized factual records.
3. Every factual field records its source path, source kind, and source pointer.
4. One normalized model generates JSON, Markdown, pages, search data, and provenance records.
5. Root generation copies current canonical site CSS into `tech-stack-generator/src/generated-css/`.
6. The Vite app imports generated local data and copied local CSS only.
7. Vite builds the standalone site into `Documents/tech-stack-generated/`.
8. Manifests and hashes prove which sources produced each generated artifact.

The built documentation site has no runtime dependency on `site/`.

## Generated Output

```text
Documents/
  .generated-root
  _manifest.json
  _sources.json
  _accuracy.json
  data/
  markdown/
    overview/index.md
    architecture/index.md
    architecture/repository-structure.md
    dependencies/index.md
    commands/index.md
    routes-and-api/routes.md
    routes-and-api/api.md
    environment/index.md
    database/index.md
    testing/index.md
    testing/coverage.md
    build-and-deploy/index.md
    features/index.md
    governance/provenance.md
    governance/unsupported.md
  tech-stack-generated/
```

Everything under `Documents/` is generated. If an unknown file appears, generation fails and reports it without deleting it.

## CSS Synchronization

- Every documentation build attempts to refresh `tech-stack-generator/src/generated-css/` from canonical CSS under `site/`.
- The Vite renderer imports only the copied CSS.
- The generated CSS snapshot includes source hashes in provenance metadata.
- If canonical site CSS is unavailable but a previously validated copied snapshot exists, generation warns and uses that snapshot.
- If both canonical site CSS and the copied snapshot are unavailable, generation fails.
- Generated static output remains functional if the original `site/` CSS is unavailable after build.

## Accuracy Contract

“100% accuracy” means:

- every emitted factual field has provenance;
- every emitted factual value exactly matches its normalized canonical source value;
- no unsupported factual narrative is emitted;
- generated Markdown, search, page data, and UI use the same normalized model.

Human-readable formatting may transform presentation but cannot change factual values.

`_accuracy.json` is the release proof. Generation succeeds only when:

- `totalFactualFields === fieldsWithProvenance`
- `totalFactualFields === exactSourceMatches`
- `mismatches.length === 0`
- every generated Markdown factual value references a normalized fact identifier
- every Markdown document ends with a generated source section

## Safety And Determinism

- Generate into staging before changing final output.
- Validate schemas, provenance, paths, and hashes before replacement.
- Replace only files owned by the previous manifest.
- Never silently delete unknown files.
- Use UTF-8, LF, stable key ordering, stable array ordering, POSIX relative paths, and final newlines.
- Never emit timestamps, drive letters, machine-specific absolute paths, or unstable ordering.
- Two unchanged generation runs must produce byte-identical output.

## Error Handling

- Missing canonical factual source: fail.
- Conflicting canonical sources: fail and report all conflicting paths.
- Unsupported claim: omit and record it.
- Unknown file under `Documents/`: fail without deletion.
- Missing canonical CSS with valid copied snapshot: warn and continue.
- Missing canonical CSS and copied snapshot: fail.
- Stale generated artifact or provenance mismatch: fail drift check.
- Reappearance of legacy root output: fail.
- Every failed or skipped generation, check, test, build, or coverage step is logged in `plans/wip/tech-stack-docs/FAILURES.md` and mirrored when material in root `Failures.md`.

## Testing And Coverage

Required behavioral tests cover:

- canonical-source extraction and precedence
- malformed and conflicting sources
- exact field-level provenance comparison
- deterministic two-run output
- structured Markdown generation
- generated search and renderer behavior
- CSS refresh, source hashing, and fallback snapshot
- unknown-file protection
- staging and manifest-owned replacement
- legacy-output rejection
- AST hardcoding detection
- fake-test and coverage-padding detection

Coverage policy for production generator and renderer code:

- below 80% in statements, branches, functions, or lines: fail
- 80% through 94.99%: pass with warning and remain incomplete
- 95% or higher for all four metrics: pass without warning and qualify for completion

Generated files, declarations, tests, and configuration-only files do not count toward production coverage.

## Constraints

- The Vite documentation app remains separate.
- Cross-package generation is owned at monorepo root.
- No factual hardcoding is allowed in pages, search, data modules, Markdown, or tests.
- UI labels, ordering, layout, accessibility text, and styles require an explicit non-factual allowlist.
- Tests and builds require explicit user permission.
- Commits, pushes, publishing, migrations, and destructive changes require explicit user permission.
