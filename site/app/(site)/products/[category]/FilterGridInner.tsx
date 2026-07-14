"use client";

import type { CompatCategory as Category } from "@/features/catalog/getProducts";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Funnel as Filter, MagnifyingGlass as SearchIcon, FadersHorizontal as SlidersHorizontal, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CompareDock } from "@/components/products/CompareDock";
import { CATEGORY_ROUTE_COPY } from "@/lib/site-data/routeCopy";
import {
  DEFAULT_FILTERS,
  buildFilterParams,
  buildFilterUrl,
  countActiveFilters,
  parseFiltersFromSearchParams,
  type ActiveFilters,
} from "@/features/catalog/filters";
import { trackSiteCtaClick } from "@/lib/analytics/siteEvents";
import { useProductCompare } from "@/lib/store/productCompare";

import {
  AccordionSection,
  ActiveChips,
  CheckList,
  ProductCard,
  SustainabilityButtons,
  Toggle,
} from "./FilterGrid.components";
import {
  buildFallbackFacets,
  type FilterResponse,
  flattenCategoryProducts,
  getProductRouteKey,
  useDebouncedValue,
} from "./FilterGrid.helpers";

const FILTER_GRID_COPY = {
  ...CATEGORY_ROUTE_COPY,
  searchLabel: "Search",
  searchPlaceholder: "Search products, materials, or series",
  clearSearchLabel: "Clear search",
  resultsSummary: CATEGORY_ROUTE_COPY.resultsSummaryLabel,
  closeFiltersLabel: "Close filters",
  filtersLabel: "Filters",
} as const;

export function AdvancedFilterGridInner({
  category,
  categoryId,
}: {
  category: Category;
  categoryId: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const compareItems = useProductCompare((state) => state.items);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(() => searchParams.get("q") ?? "");
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerOpenButtonRef = useRef<HTMLButtonElement>(null);
  const wasDrawerOpenRef = useRef(false);

  const filters = useMemo(
    () => parseFiltersFromSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );
  const isSeriesEnabled = categoryId !== "seating";
  const effectiveFilters = useMemo(
    () => (isSeriesEnabled ? filters : { ...filters, series: "all" }),
    [filters, isSeriesEnabled],
  );
  const debouncedSearch = useDebouncedValue(searchInput, 250);

  const updateFilters = useCallback(
    (next: Partial<ActiveFilters>, options?: { replace?: boolean }) => {
      const currentFilters = parseFiltersFromSearchParams(
        new URLSearchParams(searchParams.toString()),
      );
      const updated = { ...currentFilters, ...next } as ActiveFilters;
      const nextUrl = buildFilterUrl(pathname, updated);
      if (typeof window !== "undefined") {
        window.history.replaceState(window.history.state, "", nextUrl);
      }
      if (options?.replace) {
        router.replace(nextUrl, { scroll: false });
        return;
      }
      router.push(nextUrl, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    if (debouncedSearch === filters.query) return;
    updateFilters({ query: debouncedSearch }, { replace: true });
  }, [debouncedSearch, filters.query, updateFilters]);

  useEffect(() => {
    if (isSeriesEnabled || filters.series === "all") return;
    updateFilters({ series: "all" }, { replace: true });
  }, [filters.series, isSeriesEnabled, updateFilters]);

  const fallbackProducts = useMemo(() => flattenCategoryProducts(category), [category]);
  const fallbackFacets = useMemo(
    () => buildFallbackFacets(categoryId, fallbackProducts),
    [categoryId, fallbackProducts],
  );

  const filterQueryString = useMemo(
    () => buildFilterParams(effectiveFilters).toString(),
    [effectiveFilters],
  );
  const hasFilterQuery = filterQueryString.length > 0;
  const compareQuery = useMemo(
    () => compareItems.map((item) => item.productUrlKey).filter(Boolean).join(","),
    [compareItems],
  );

  const apiQueryString = useMemo(() => {
    const params = new URLSearchParams(filterQueryString);
    params.set("category", categoryId);
    return params.toString();
  }, [categoryId, filterQueryString]);

  const { data, isLoading, isFetching, error } = useQuery<FilterResponse>({
    queryKey: ["category-products", categoryId, apiQueryString],
    queryFn: async () => {
      const response = await fetch(`/api/products/filter/?${apiQueryString}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Filter request failed: ${response.status}`);
      return (await response.json()) as FilterResponse;
    },
    placeholderData: (previous) => previous,
    staleTime: 30_000,
    gcTime: 300_000,
  });

  const shouldUseFallbackData = !hasFilterQuery || Boolean(data) || Boolean(error);
  const filteredProducts = useMemo(
    () => shouldUseFallbackData ? (data?.products ?? fallbackProducts) : [],
    [data?.products, fallbackProducts, shouldUseFallbackData],
  );
  const navigableProducts = useMemo(
    () => filteredProducts.filter((product) => getProductRouteKey(product).length > 0),
    [filteredProducts],
  );
  const options = shouldUseFallbackData ? (data?.facets ?? fallbackFacets) : fallbackFacets;
  const allProducts = shouldUseFallbackData
    ? (data?.meta.catalogTotal ?? fallbackProducts.length)
    : fallbackProducts.length;
  const isInitialFilteredLoad = isLoading && hasFilterQuery && !data && !error;

  const showFeatureFilters =
    options.featureAvailability.hasHeadrest ||
    options.featureAvailability.isHeightAdjustable ||
    options.featureAvailability.bifmaCertified ||
    options.featureAvailability.isStackable;

  const toggleArray = useCallback(
    (key: "subcategory" | "priceRange" | "material", value: string) => {
      const current = filters[key] as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      updateFilters({ [key]: next });
    },
    [filters, updateFilters],
  );

  const removeChip = useCallback(
    (key: string, value?: string | number) => {
      if (key === "subcategory" || key === "priceRange" || key === "material") {
        const current = filters[key] as string[];
        updateFilters({ [key]: current.filter((v) => v !== value) });
      } else if (
        key === "hasHeadrest" ||
        key === "isHeightAdjustable" ||
        key === "bifmaCertified" ||
        key === "isStackable"
      ) {
        updateFilters({ [key]: false });
      } else if (key === "series") {
        updateFilters({ series: "all" });
      } else if (key === "query") {
        setSearchInput("");
        updateFilters({ query: "" }, { replace: true });
      } else if (key === "ecoMin") {
        updateFilters({ ecoMin: null });
      }
    },
    [filters, updateFilters],
  );

  const clearAll = useCallback(() => {
    setSearchInput("");
    updateFilters(DEFAULT_FILTERS, { replace: true });
  }, [updateFilters]);

  const activeCount = countActiveFilters(effectiveFilters);
  const compareHref = compareQuery
    ? `/compare?items=${encodeURIComponent(compareQuery)}`
    : "/compare";
  const compareLabel =
    compareItems.length > 0
      ? FILTER_GRID_COPY.compareActiveLabel.replace("{count}", String(compareItems.length))
      : FILTER_GRID_COPY.compareIdleLabel;
  const compareLabelMobile =
    compareItems.length > 0
      ? FILTER_GRID_COPY.compareActiveLabelShort.replace("{count}", String(compareItems.length))
      : FILTER_GRID_COPY.compareIdleLabelShort;
  const shouldUseContentVisibility = navigableProducts.length >= 20;
  const gridIntrinsicBlockSizePx = Math.max(3200, navigableProducts.length * 420);

  useEffect(() => {
    if (!drawerOpen) {
      if (wasDrawerOpenRef.current) drawerOpenButtonRef.current?.focus();
      wasDrawerOpenRef.current = false;
      return;
    }

    wasDrawerOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      if (!drawerRef.current) return;
      const firstFocusable = drawerRef.current.querySelector<HTMLElement>(
        "button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      firstFocusable?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (!drawerRef.current) return;
      if (event.key === "Escape") {
        setDrawerOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  const sidebar = (
    <aside className="space-y-0">
      <ActiveChips
        filters={effectiveFilters}
        onRemove={removeChip}
        onClearAll={clearAll}
        total={activeCount}
      />

      <AccordionSection title={FILTER_GRID_COPY.searchLabel}>
        <div className="relative">
          <label htmlFor="category-filter-search" className="sr-only">
            {FILTER_GRID_COPY.searchLabel}
          </label>
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" aria-hidden="true" />
          <input
            id="category-filter-search"
            name="category-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={FILTER_GRID_COPY.searchPlaceholder}
            className="input-search pl-9 pr-10"
            autoComplete="off"
          />
          {searchInput ? (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              aria-label={FILTER_GRID_COPY.clearSearchLabel}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-heading"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </AccordionSection>

      {isSeriesEnabled ? (
        <AccordionSection title="Series" count={options.series.length} defaultOpen>
          <label htmlFor="category-filter-series" className="sr-only">
            Filter by series
          </label>
          <select
            id="category-filter-series"
            className="select-filter"
            value={filters.series}
            onChange={(event) => updateFilters({ series: event.target.value })}
          >
            <option value="all">All series</option>
            {options.series.map((series) => (
              <option key={series} value={series}>
                {series}
              </option>
            ))}
          </select>
        </AccordionSection>
      ) : null}

      <AccordionSection title="Subcategory" count={options.subcategory.length}>
        <CheckList
          options={options.subcategory}
          selected={filters.subcategory}
          onToggle={(value) => toggleArray("subcategory", value)}
        />
      </AccordionSection>

      <AccordionSection title="Price" count={options.priceRange.length}>
        <CheckList
          options={options.priceRange}
          selected={filters.priceRange}
          onToggle={(value) => toggleArray("priceRange", value)}
        />
      </AccordionSection>

      <AccordionSection title="Material" count={options.material.length}>
        <CheckList
          options={options.material}
          selected={filters.material}
          onToggle={(value) => toggleArray("material", value)}
        />
      </AccordionSection>

      {showFeatureFilters ? (
        <AccordionSection title="Features">
          <div className="space-y-2">
            {options.featureAvailability.hasHeadrest ? (
              <Toggle
                label="With headrest"
                checked={filters.hasHeadrest}
                onChange={(value) => updateFilters({ hasHeadrest: value })}
              />
            ) : null}
            {options.featureAvailability.isHeightAdjustable ? (
              <Toggle
                label="Height adjustable"
                checked={filters.isHeightAdjustable}
                onChange={(value) => updateFilters({ isHeightAdjustable: value })}
              />
            ) : null}
            {options.featureAvailability.bifmaCertified ? (
              <Toggle
                label="BIFMA certified"
                checked={filters.bifmaCertified}
                onChange={(value) => updateFilters({ bifmaCertified: value })}
              />
            ) : null}
            {options.featureAvailability.isStackable ? (
              <Toggle
                label="Stackable"
                checked={filters.isStackable}
                onChange={(value) => updateFilters({ isStackable: value })}
              />
            ) : null}
          </div>
        </AccordionSection>
      ) : null}

      <AccordionSection title="Sustainability">
        <SustainabilityButtons
          selected={filters.ecoMin}
          onSelect={(value) => updateFilters({ ecoMin: value })}
        />
      </AccordionSection>
    </aside>
  );

  return (
    <section className="catalog-lane home-shell-xl pb-10 pt-2 md:pb-12 md:pt-6">
      <header className="catalog-page-header mb-6 max-w-3xl border-b border-theme-soft pb-5 md:mb-10 md:pb-8">
        <Link
          href="/products"
          className="typ-label text-body inline-flex items-center gap-1.5 transition-colors hover:text-primary"
        >
          Products
        </Link>
        <h1 className="home-heading mt-4 md:mt-5">{category.name}</h1>
        {category.description ? (
          <p className="page-copy text-body mt-3 max-w-prose md:mt-5">{category.description}</p>
        ) : null}
      </header>

      <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16.5rem_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <div className="scheme-panel scheme-border sticky top-24 rounded-2xl border shadow-theme-panel">
            {sidebar}
          </div>
        </div>

        <div className="min-w-0 space-y-4 md:space-y-5">
          <div className="catalog-toolbar flex flex-col gap-3 border-b border-theme-soft pb-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="typ-label text-body">
              {FILTER_GRID_COPY.resultsSummary
                .replace("{shown}", String(navigableProducts.length))
                .replace("{total}", String(allProducts))}
            </p>
            <div className="catalog-toolbar__actions grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
              <button
                ref={drawerOpenButtonRef}
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="btn-outline w-full sm:w-auto lg:hidden"
                aria-expanded={drawerOpen}
                aria-controls="category-filter-drawer"
              >
                <SlidersHorizontal className="h-4 w-4 shrink-0" />
                Filters
                {activeCount > 0 ? (
                  <span className="ml-1 filter-ui-count">
                    {activeCount}
                  </span>
                ) : null}
              </button>

              <Link
                href={compareHref}
                className="btn-outline w-full sm:w-auto"
                onClick={() =>
                  trackSiteCtaClick({
                    href: compareHref,
                    pathname,
                    surface: "category-grid",
                    label: "open-compare",
                  })}
              >
                <Filter className="h-4 w-4 shrink-0" />
                <span className="sm:hidden">{compareLabelMobile}</span>
                <span className="hidden sm:inline">{compareLabel}</span>
              </Link>
            </div>
          </div>

          {isInitialFilteredLoad ? (
            <div className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 min-[520px]:gap-4 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] animate-pulse rounded-lg border border-theme-soft bg-muted sm:aspect-[4/5]"
                />
              ))}
            </div>
          ) : navigableProducts.length === 0 && error ? (
            <div
              role="alert"
              className="scheme-panel scheme-border rounded-2xl border px-6 py-10 text-center"
            >
              <h2 className="home-heading text-balance">{CATEGORY_ROUTE_COPY.errorTitle}</h2>
              <p className="page-copy text-body mt-4 max-w-lg mx-auto">
                {CATEGORY_ROUTE_COPY.errorDescription}
              </p>
            </div>
          ) : navigableProducts.length === 0 && activeCount > 0 ? (
            <div className="scheme-panel scheme-border rounded-2xl border px-6 py-10 text-center">
              <h2 className="home-heading text-balance">{CATEGORY_ROUTE_COPY.emptyTitle}</h2>
              <p className="page-copy text-body mt-4 max-w-lg mx-auto">
                {CATEGORY_ROUTE_COPY.emptyDescription}
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="btn-outline mt-5"
              >
                {CATEGORY_ROUTE_COPY.clearFiltersCta}
              </button>
            </div>
          ) : navigableProducts.length === 0 ? (
            <div className="scheme-panel scheme-border rounded-2xl border px-6 py-10 text-center">
              <h2 className="home-heading text-balance">{CATEGORY_ROUTE_COPY.emptyCategoryTitle}</h2>
              <p className="page-copy text-body mt-4 max-w-lg mx-auto">
                {CATEGORY_ROUTE_COPY.emptyCategoryDescription}
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 min-[520px]:gap-4 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4"
              style={
                shouldUseContentVisibility
                  ? {
                      contentVisibility: "auto",
                      containIntrinsicBlockSize: `${gridIntrinsicBlockSizePx}px`,
                    }
                  : undefined
              }
            >
              {navigableProducts.map((product) => (
                <ProductCard
                  key={getProductRouteKey(product)}
                  product={product}
                  categoryId={categoryId}
                  categoryName={category.name}
                  contextQueryString={filterQueryString}
                />
              ))}
            </div>
          )}

          {isFetching && !isInitialFilteredLoad ? (
            <p className="text-xs text-muted">
              Updating results...
            </p>
          ) : null}
        </div>
      </div>

      {drawerOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-scrim lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div
            id="category-filter-drawer"
            ref={drawerRef}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-hidden bg-panel shadow-theme-float lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={FILTER_GRID_COPY.filtersLabel}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-theme-soft px-4 py-4">
              <p className="typ-label text-strong">{FILTER_GRID_COPY.filtersLabel}</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-full border border-soft p-2 text-muted hover:text-heading"
                aria-label={FILTER_GRID_COPY.closeFiltersLabel}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">{sidebar}</div>

            <div className="shrink-0 border-t border-soft bg-panel px-4 py-4">
              <div className="flex gap-3">
                {activeCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      clearAll();
                      setDrawerOpen(false);
                    }}
                    className="flex-1 h-11 border border-muted text-sm text-strong rounded-sm hover:bg-soft transition-colors"
                  >
                    Clear all
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 h-11 rounded-sm bg-inverse text-sm font-normal text-inverse transition-colors hover:bg-inverse-soft"
                >
                  {CATEGORY_ROUTE_COPY.drawerResultsCta.replace(
                    "{count}",
                    String(navigableProducts.length),
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <CompareDock />
    </section>
  );
}
