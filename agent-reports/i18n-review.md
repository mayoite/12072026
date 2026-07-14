# site/i18n review

Date: 2026-07-14  
Scope: `site/i18n/` (read-only at write time). Cross-checked scripts, next-intl wiring, consumers, and tests under `site/tests/unit/lib/i18n/` and `site/tests/unit/i18n/`.

## Verification stamp (2026-07-14 recheck)

| Claim | Live status |
|-------|-------------|
| `workspace` only in `en` | **STILL OPEN** — en=yes; hi/de/es/fr=no |
| hi missing news/legal | **STILL OPEN** (wave1-by-design; product risk remains) |
| unit/i18n mirror exists | **YES** — config/routing/messages/request/manifest/pending tests present |
| request.ts untested | **FIXED** — `tests/unit/i18n/request.test.ts` exists |

Critical product i18n gaps remain; test harness for i18n folder is present.

## Inventory

| Path | Role |
|------|------|
| `site/i18n/config.ts` | Locale list + default |
| `site/i18n/routing.ts` | next-intl `defineRouting` (`localePrefix: "never"`) |
| `site/i18n/request.ts` | `getRequestConfig`: cookie → Accept-Language → default; loads `messages/{locale}.json` |
| `site/i18n/messages/{en,hi,fr,de,es}.json` | Runtime message bundles |
| `site/i18n/marketing-parity-manifest.json` | Parity contract (namespaces, locales, consumer paths) |
| `site/i18n/pending-translations/{de,es,fr}.{pending,translated}.json` | Deferred-locale translation workflow artifacts |

Related (outside folder, reviewed for coupling only):

- `site/lib/i18n/htmlLang.ts`, `site/lib/i18n/navigation.ts`
- `site/scripts/check-i18n-key-parity.mjs` and `i18n:sync:*` / `i18n:translate:*` scripts
- `site/proxy.ts` (intl middleware import; deliberately bypassed)
- `site/next.config.js` (`createNextIntlPlugin("./i18n/request.ts")`)
- `site/components/site/LanguageSwitcher.tsx`

## Strengths

1. **Folder is mostly pure i18n.** No features/admin/planner product logic inside `site/i18n/`. Only locale config, next-intl request/routing, message JSON, parity manifest, and translation staging.
2. **Five locales registered consistently.** `config.ts` = `en`, `hi`, `fr`, `de`, `es`; each has a `messages/*.json` file; `routing.ts` mirrors config.
3. **Prefixless marketing locale model is intentional and documented.** `localePrefix: "never"` matches SEO alternates in `features/site/data/seo.ts` and cookie-based switching in `LanguageSwitcher`.
4. **Request locale negotiation is constrained.** `NEXT_LOCALE` and Accept-Language language tags are checked against the `locales` array before dynamic import. Path injection risk is low.
5. **Parity tooling exists and is wired.** `check:i18n:parity` runs inside `check:site-ui`. Manifest scopes hi (wave1) vs deferred (full marketing). Vitest covers the script and static contracts under `tests/unit/lib/i18n/` and `tests/unit/i18n/`.
6. **Pending-translation workflow is real.** Export/apply/sync/translate scripts under `site/scripts/` operate on deferred locales; `*.pending.json` / `*.translated.json` are structured flat path→string maps.
7. **No secrets in JSON.** Public contact emails/phones (`sales@oando.co.in`, imprint lines) only. No API keys, tokens, or private credentials in `messages/` or `pending-translations/`.
8. **Plugin wiring is correct.** `next.config.js` points next-intl at `./i18n/request.ts`. Root layout uses `NextIntlClientProvider` with locale/messages from `getSiteLayoutContext()`.

## Issues

### Critical

1. **`workspace` namespace is English-only; `/access` always loads it.**  
   `app/(site)/access/page.tsx` calls `getTranslations("workspace")`. That namespace exists only in `en.json`. `de` / `es` / `fr` / `hi` omit it. Manifest parity also ignores `workspace`. Non-English cookie users hitting `/access` risk missing-message runtime failure (next-intl default).

2. **`hi` is wave1-scoped while several live consumers need non-wave1 namespaces.**  
   Live pages call `getTranslations("news")` and `getTranslations("legal")` (`news`, `privacy`, `terms`, `imprint`, `refund-and-return-policy`). `hi.json` has only: `common`, `home`, `planner`, `about`, `contact`, `products`, `solutions`. A Hindi session on those routes has no namespace. Gate still passes because parity intentionally limits hi to wave1.

### Important

3. **Parity is marketing-namespace only; non-marketing bundles drift.**  
   `common`, `planner`, and `workspace` are outside `allMarketingNamespaces`. Example: `en.planner.export.*` exists; `de` / `hi` (and likely `es` / `fr`) planner trees lack the full `export` subtree and leave session strings in English. Key parity cannot catch this.

4. **Incomplete consumer migration; dual copy systems.**  
   Wave1/i18n consumers (about, contact, products, solutions, legal, news, CategoryGrid) use next-intl. Homepage and several routes still use `features/site/data/routeCopy` / hardcoded marketing (gallery, downloads, compare, home sections). Large `home.*` trees in message files are mostly **not consumed** by homepage components. Messages and product UI can diverge without failing parity.

5. **`proxy.ts` creates intl middleware then hard-disables it.**  
   ```ts
   const intlMiddleware = createIntlMiddleware(routing);
   // ...
   const intlResponse = undefined; // Bypassed: locales resolved in request.ts ...
   ```  
   Dead import/instance; matcher still lists `/(hi|fr|de|es)/:path*` as if prefix mode were live. Locale is only from `request.ts` cookie/header path. Works with `localePrefix: "never"`, but the proxy comment/matcher/import are misleading and untested for real intl response behavior.

6. **Pending apply/export not in package.json.**  
   Scripts exist (`export-pending-translations.mjs`, `apply-pending-translations.mjs`) but no `i18n:export:pending` / `i18n:apply:pending` npm scripts. Operators must know bare node paths. Risk of stale `pending-translations/*` (files still contain paths, icons, brand tokens that current SKIP_VALUE logic would often exclude).

7. **Locale lists duplicated outside config.**  
   `LanguageSwitcher` hardcodes `LANGUAGE_NAMES` for en/hi/fr/de/es instead of importing `locales` from `@/i18n/config`. Adding a locale requires a second edit. Switcher labels are English-fixed (“Select Language”), not localized.

8. **Test layout split + stale mock.**  
   Contracts live under both `tests/unit/lib/i18n/` and `tests/unit/i18n/` (overlap on config/routing/parity). `navigation.test.ts` mocks routing as `["en","hi"]` only—does not assert full five-locale product config. No focused tests for `request.ts` locale resolution or missing-namespace consumers (`workspace`, `news` under `hi`).

### Minor

9. **`@/lib/i18n/navigation` appears unused in product code.** Only the unit test imports it. App components use `next/navigation` and `@/lib/navigation`. Dead export surface unless prefix routing returns.

10. **HTML lang tags force `*-IN` for all locales.** `getHtmlLang` maps `fr`→`fr-IN`, `de`→`de-IN`, `es`→`es-IN`. Intentional India market bias, but may be wrong for real French/German/Spanish users.

11. **Cookie flags on locale switcher.** `NEXT_LOCALE=...; path=/; max-age=...; SameSite=Lax` with no `Secure`. Low risk for a non-auth preference cookie; still inconsistent with stricter cookie practices.

12. **Residual English and untranslatable noise in deferred bundles / pending files.** Brand names, image paths, icon tokens, Eco-Score badges still sit in pending/translated maps. Not a security issue; noise for translators and apply merges.

13. **Root `package.json` has no i18n scripts.** All live under `site/package.json` (`oando-site`). Fine if filters are always used; easy to miss from repo root.

## Review checklist detail

### 1. Structure purity

**Mostly clean.** `site/i18n/` holds i18n runtime + message data + parity/workflow JSON only.  
Helpers correctly live in `site/lib/i18n/`.  
Leakage is **indirect**: marketing copy still half-lives in `features/site/data/routeCopy.ts` while parallel trees exist in `messages/`. That is product dual-source, not folder contamination.

### 2. Locale completeness (en / de / es / fr / hi)

| Locale | File | Marketing scope | Notes |
|--------|------|-----------------|-------|
| en | yes | full + common/planner/workspace | Source of truth |
| hi | yes | wave1 only (5 NS) + common/planner | Missing news/legal/… consumers |
| de/es/fr | yes | all marketing NS + common/planner | Missing `workspace`; planner incomplete vs en |
| All five | registered in config/routing | | Language switcher offers all five |

### 3. Key parity risks; pending-translations workflow

- Parity script compares only manifest namespaces; hi is intentionally partial.
- Value parity (still English) is not a hard fail; deferred hero-sample test only checks a few keys left English.
- Pending workflow: export compares leaf equality to English; apply merges `*.translated.json` back. Deferred only; no `hi.pending.json` (expected).
- Package scripts omit export/apply entrypoints; pending artifacts look partly stale relative to SKIP rules.

### 4. Security

**PASS for secrets.** Public commercial contact data only. Dynamic message import is locale-allowlisted. No credential material in this tree.

### 5. Dead files / unused exports

| Item | Assessment |
|------|------------|
| `lib/i18n/navigation` product usage | Effectively unused |
| `createIntlMiddleware` / `intlMiddleware` in proxy | Dead after hard bypass |
| Large `home.*` message trees | Largely unused by homepage UI |
| `pending-translations/*` | Workflow state, not dead; apply path underused in package.json |
| Message files themselves | Live for next-intl |

### 6. Scripts coupling

From `site/package.json`:

- `i18n:sync:marketing` → `sync-marketing-i18n-messages.mjs`
- `i18n:sync:hi-wave1` → `sync-hi-wave1-messages.mjs`
- `i18n:sync:deferred-locales` → `sync-deferred-locale-messages.mjs`
- `i18n:translate:deferred-locales` → `translate-deferred-marketing-flat.mjs`
- `check:i18n:parity` → `check-i18n-key-parity.mjs` (also in `check:site-ui`)

Gap: export/apply pending scripts not named in package.json. Manifest `i18nConsumerPaths` couples copy-source check to a fixed file list—good for wave1, incomplete for full site.

### 7. next-intl wiring

| Piece | Status |
|-------|--------|
| Plugin → `i18n/request.ts` | Correct |
| `routing` locales/default/`localePrefix: never` | Correct for cookie model |
| Cookie + Accept-Language in request | Correct; primary resolution path |
| Middleware intl | Created then set to `undefined`—bypassed by design |
| Layout provider | Correct via `getSiteLayoutContext` |
| SEO hreflang under never-prefix | Correct (same URL all languages) |

### 8. Drift vs tests

Tests live outside `i18n/` (correct):

- `site/tests/unit/lib/i18n/{config,navigation,parity}.test.ts`
- `site/tests/unit/i18n/{config,routing,messages,marketing-parity-manifest,pending-translations}.test.ts` (newer pack; overlaps lib suite)

Drift:

- Tests encode wave1 gaps as intentional; they do **not** fail Critical consumer gaps (`workspace`, hi+`news`/`legal`).
- Navigation mock still two-locale.
- No request.ts resolution tests.
- No runtime assertion that every `getTranslations("…")` namespace exists in every shipped locale.

## Assessment

**Overall: usable scaffold, incomplete product i18n.**

The tree is structured correctly for next-intl with prefixless cookies, has a real parity gate for *declared* marketing scope, and is clean of secrets. That is solid foundation work.

It is **not** production-complete multilingual:

- Registered locales include users who will hit missing namespaces (`workspace` everywhere but en; `news`/`legal` under hi).
- Parity gate green ≠ safe locale runtime.
- Homepage and several marketing routes still ignore message catalogs.
- Proxy “i18n layer” is commentary plus dead middleware.

**Recommendation priority (do not implement in this review):**

1. Ship `workspace` (and any other live `getTranslations` namespaces) into every locale file, or gate locale switcher until bundles are complete.
2. Either expand hi to all live consumer namespaces or refuse hi on routes without keys.
3. Extend parity (or a separate check) to every namespace referenced by app/components code, not only the marketing manifest.
4. Wire export/apply pending into package.json; refresh pending artifacts; drop dead proxy intl wiring or actually call it.
5. Collapse dual test packs and drop unused `lib/i18n/navigation` if prefix routing stays off.

**Verdict:** Structure and security are good. Completeness and runtime safety under non-`en` locales are not. Treat Critical items as release blockers for any claim that de/es/fr/hi are fully supported.
