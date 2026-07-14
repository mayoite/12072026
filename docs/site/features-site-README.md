# Site feature module

Public marketing product behavior. Routes in `app/(site)/`; presentation in `components/`.

## What lives here

| Path | Role |
|------|------|
| **`data/`** | Marketing copy, navigation, SEO, route classification, local catalog index |
| **`assistant/`** | Chat widget (UnifiedAssistant, AdvancedBot) |
| **`advisor/`** | Catalog advisor types and helpers for site bot + `/api/ai-advisor` |

## What stays outside

| Path | Role |
|------|------|
| `i18n/` | Locale config + message JSON (`next-intl`) |
| `components/home/`, `components/site/` | Presentational sections and chrome |
| `lib/catalog/site/` | Product listing facade |
| `lib/i18n/` | `htmlLang` and related helpers |

Homepage copy may sync into `i18n/messages/en.json`.  
Sync: `pnpm --filter oando-site run i18n:sync:marketing`.

## Imports

```ts
import { HOMEPAGE_HERO_CONTENT } from "@/features/site/data/homepage";
import { UnifiedAssistant } from "@/features/site/assistant/UnifiedAssistant";
import type { AdvisorResult } from "@/features/site/advisor/aiAdvisor";
```

Detail: `CONTENTS.md`.
