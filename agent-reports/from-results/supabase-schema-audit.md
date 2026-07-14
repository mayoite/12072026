# Supabase Schema Audit

- Generated at: 2026-07-14T08:04:01.590Z
- Supabase host: catalog.example.supabase.co

## Table Probes
- categories: present, rows=1
- products: present, rows=2
- product_specs: present, rows=0
- product_images: present, rows=0
- product_slug_aliases: present, rows=1
- business_stats_current: present, rows=1
- catalog_categories: present, rows=0
- catalog_products: present, rows=0
- catalog_product_specs: present, rows=0
- catalog_product_images: present, rows=0
- catalog_product_slug_aliases: present, rows=0

## Runtime Query Checks
- Products list: ok (ok)
- Categories list: ok (ok)
- Product specs: ok (ok)
- Product images: ok (ok)
- Alias table: ok (ok)
- Business stats: ok (ok)

## Data Quality Summary
- products: 2
- categories: 1
- blank slugs: 1
- duplicate slugs: 0
- missing category IDs: 0
- missing subcategory slug/id: 1
- missing alt text: 1
- missing primary image: 1
- duplicate normalized name keys by category: 0
- alias rows: 1
- blank alias rows: 0
- self alias rows: 0
- missing business stats rows: 0
- active business stats rows: 1
