# Site feature — folder map

## `data/` — marketing copy and routing metadata

| File / area | Role |
|-------------|------|
| `homepage.ts`, `marketing.ts`, `routeCopy.ts` | Page copy (synced to `i18n/messages/` where applicable) |
| `navigation.ts`, `routeMetadata.ts`, `routeClassification.ts` | Nav trees, SEO, indexable routes |
| `seo.ts`, `brand.ts`, `contact.ts` | Metadata builders, brand constants |
| `localCatalogIndex.json` | Offline catalog index for SSG fallbacks |
| Other `data/*` | Suite, proof, support, hero, fallbacks |

## `assistant/` — site chat

| File | Role |
|------|------|
| `UnifiedAssistant.tsx` | Main assistant surface |
| `AdvancedBot.tsx` | Advanced bot UI |
| `DynamicBotWrapper.tsx` | Lazy-load wrapper for RouteChrome |

## `advisor/` — catalog advisor contract

| File | Role |
|------|------|
| `aiAdvisor.ts` | Types and helpers for site bot + `/api/ai-advisor` |

Not planner workspace AI (`features/planner/ai/`).

## Tests

Name-mirror under `tests/unit/features/site/` (`data/`, `advisor/`, `assistant/`).

Locales: `site/i18n/` + `tests/unit/i18n/`.
