# 08 CDN And Assets

Goal: prove asset source of truth.

## Modules

- CDN.
- Assets.
- Catalog references.
- SVG public output.

## Allowed Scope

1. `site/public/cdn`
2. `site/scripts/*asset*`
3. CDN docs
4. Reference scanners

## Hard No-Go Scope

1. Uploads without approval.
2. Deletions without approval.
3. Secret changes.

## Initial Checks

```powershell
rg -n "asset-cdn|R2|cdn|svg-catalog|public/cdn" site docs Readme.md START.md
```

## Asset Manifest Standard

Maintain an immutable asset view:

| Field | Required |
| --- | --- |
| Asset id | Stable id or path |
| Local source | Local path or absent |
| Cloud source | R2/key/path or absent |
| DB reference | Table/column or absent |
| Cache policy | Public, private, immutable, or unknown |
| Owner | Catalog, planner, SVG, marketing, or admin |
| Delete policy | Explicit approval required |

R2 is object storage.

Do not treat it as source control.

Uploads and deletes require explicit approval.

## Exit Evidence

1. Local asset source.
2. Cloud asset source.
3. DB path ownership.
4. Broken reference list.
5. Cache behavior note.
6. Upload/delete policy decision.

## Stop Conditions

1. Cloud credentials are needed.
2. Upload or deletion is required.
3. DB paths disagree with local paths.
4. Asset manifest cannot identify ownership.
