"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CaretDown, List, MagnifyingGlass, Sparkle, X } from "@phosphor-icons/react";
import { OneAndOnlyLogo } from "@/components/ui/Logo";
import { PlannerLaunchLink } from "@/components/ui/PlannerLaunchLink";
import {
  NAV_CATEGORY_GROUP_ORDER,
  NAV_CATEGORY_GROUPS,
  groupCategories,
  type GroupedCategory,
} from "@/lib/navigation";
import { SITE_HEADER_MORE_LINKS, SITE_HEADER_PRIMARY_LINKS } from "@/features/site/data/navigation";

/** Frozen at module load so SSR and client hydration always see the same nav order. */
const HEADER_PRIMARY_LINKS = [...SITE_HEADER_PRIMARY_LINKS];
const HEADER_MORE_LINKS = [...SITE_HEADER_MORE_LINKS];
import { MobileNavDrawer } from "@/components/site/MobileNavDrawer";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { isPlannerEntryHref } from "@/lib/analytics/plannerEntry";
import { trackSiteSearchSubmitted } from "@/lib/analytics/siteEvents";
import { cn } from "@/lib/utils";

function prettify(id: string): string {
  return id
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

const FALLBACK_CATEGORY_GROUPS: GroupedCategory[] = NAV_CATEGORY_GROUP_ORDER.map((groupId) => ({
  groupId,
  groupLabel: NAV_CATEGORY_GROUPS[groupId].label,
  items: NAV_CATEGORY_GROUPS[groupId].ids.map((id) => ({
    id,
    name: prettify(id),
    count: undefined,
    href: `/products/${id}`,
  })),
}));

interface NavSearchResult {
  id: string;
  title: string;
  href: string;
  type: "product" | "category" | "page";
  source: "ai" | "local";
}

type NavSearchMode = "ai" | "local" | "static-fallback";

async function resolveSearchDestination(
  query: string,
  context: "header" | "mobile",
  currentResults: NavSearchResult[],
) {
  if (currentResults[0]?.href) {
    return currentResults[0].href;
  }

  if (query.length < 2) {
    return "/products";
  }

  try {
    const response = await fetch(
      `/api/nav-search/?q=${encodeURIComponent(query)}&limit=1&context=${context}`,
    );
    if (!response.ok) {
      return "/products";
    }
    const payload = (await response.json()) as { results?: NavSearchResult[] };
    return payload.results?.[0]?.href || "/products";
  } catch {
    return "/products";
  }
}

const siteHeaderBaseClass =
  "fixed top-0 left-0 z-50 w-full border-b border-soft transition-shadow [background-color:var(--surface-glass-strong)] [transition-duration:var(--motion-fast)] [transition-timing-function:var(--ease-standard)]";
const siteHeaderScrolledClass = "[box-shadow:var(--shadow-panel)]";
const headerSearchShellClass = "shell-glass-panel shell-search-shell";
const headerSearchPanelClass = "shell-glass-panel shell-search-panel";
const headerSearchMetaClass = "shell-search-meta mb-2 flex items-center justify-between";
const headerSearchBadgeClass = "shell-search-badge px-2 py-0.5";
const headerSearchKindClass = "shell-search-kind";
const OTHERS_SUBCATEGORY_NAMES = new Set(["Cafe chairs", "Cafe Tables"]);
const OTHERS_SUBCATEGORY_ORDER = ["Cafe Tables", "Cafe chairs"] as const;

function megaMenuParentMatchesGroup(itemName: string, groupLabel: string) {
  return itemName.trim().toLowerCase() === groupLabel.trim().toLowerCase();
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>(
    FALLBACK_CATEGORY_GROUPS,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NavSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchSource, setSearchSource] = useState<NavSearchMode | null>(null);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const megaCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearMegaCloseTimer = () => {
    if (megaCloseTimerRef.current) {
      clearTimeout(megaCloseTimerRef.current);
      megaCloseTimerRef.current = null;
    }
  };

  const closeMegaMenu = () => {
    clearMegaCloseTimer();
    setActiveMega(null);
    setMoreOpen(false);
  };

  const openMegaMenu = (label: string) => {
    clearMegaCloseTimer();
    setMoreOpen(false);
    setActiveMega(label);
  };

  const openMoreMenu = () => {
    clearMegaCloseTimer();
    setActiveMega(null);
    setMoreOpen(true);
  };

  const scheduleMegaClose = () => {
    clearMegaCloseTimer();
    megaCloseTimerRef.current = setTimeout(() => {
      setActiveMega(null);
      setMoreOpen(false);
      megaCloseTimerRef.current = null;
    }, 320);
  };

  const isMegaPointerTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    return (
      target.closest("[data-mega-zone]") !== null ||
      target.closest("#products-mega-menu") !== null ||
      target.closest("#header-more-menu") !== null
    );
  };

  // Fetch real product categories for mega menu
  useEffect(() => {
    fetch("/api/nav-categories/")
      .then((res) => res.json())
      .then((payload: { groups?: GroupedCategory[]; categories?: Array<{ id: string; name: string; count?: number }> }) => {
        if (Array.isArray(payload.groups) && payload.groups.length > 0) {
          setGroupedCategories(payload.groups);
          return;
        }
        if (Array.isArray(payload.categories) && payload.categories.length > 0) {
          setGroupedCategories(groupCategories(payload.categories));
          return;
        }
      })
      .catch(() => {});
  }, []);

  // Scroll shadow — do not close mega menu on scroll (users need time to reach the panel)
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => () => clearMegaCloseTimer(), []);

  // Close mobile drawer once desktop primary nav is visible (xl = 80rem / 1280px)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1280) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Esc closes mega / more / search panels
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMega(null);
        setMoreOpen(false);
        setShowSearchPanel(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!searchPanelRef.current) return;
      if (!searchPanelRef.current.contains(event.target as Node)) {
        setShowSearchPanel(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      setShowSearchPanel(false);
      setActiveMega(null);
      setMoreOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    const query = searchQuery.trim();
 
    if (query.length < 2) {
      Promise.resolve().then(() => {
        setSearchResults([]);
        setSearchSource(null);
        setSearchLoading(false);
      });
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch("/api/nav-search/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, limit: 8, context: "header" }),
          signal: controller.signal,
        });
        const payload = (await response.json()) as {
          results?: NavSearchResult[];
          fallbackUsed?: boolean;
          rankingMode?: NavSearchMode;
        };

        if (!response.ok) {
          setSearchResults([]);
          setSearchSource(null);
          return;
        }

        const results = Array.isArray(payload.results) ? payload.results : [];
        setSearchResults(results);
        setSearchSource(payload.rankingMode || null);
      } catch {
        setSearchResults([]);
        setSearchSource(null);
      } finally {
        setSearchLoading(false);
      }
    }, 260);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const searchSectionTitle = !searchQuery.trim()
    ? "Quick links"
    : searchLoading
      ? "Searching"
      : searchResults.length > 0
        ? "Results"
        : "No results";

  const searchStatusAnnouncement = !searchQuery.trim()
    ? "Search products. Type at least two characters."
    : searchLoading
      ? "Searching products."
      : searchResults.length > 0
        ? `${searchResults.length} search result${searchResults.length === 1 ? "" : "s"} available.`
        : "No search results.";

  const onSearchResultClick = () => {
    setShowSearchPanel(false);
    setSearchQuery("");
  };

  const submitSearch = async () => {
    const query = searchQuery.trim();
    const destination = await resolveSearchDestination(query, "header", searchResults);
    trackSiteSearchSubmitted({
      pathname: pathname || "",
      surface: "header",
      queryLength: query.length,
      destination,
    });
    router.push(destination);
    setShowSearchPanel(false);
    setSearchQuery("");
  };

  const megaMenuGroups = useMemo(
    () =>
      groupedCategories.map((group) => ({
        ...group,
        items: group.items.map((item) => ({
          ...item,
          subcategories: Array.isArray(item.subcategories)
            ? item.subcategories.filter(
                (subcategory) => !OTHERS_SUBCATEGORY_NAMES.has(subcategory.name),
              )
            : [],
        })),
      })),
    [groupedCategories],
  );

  const megaMenuOthers = useMemo(() => {
    const extracted = new Map<
      string,
      { id: string; name: string; href: string; count?: number }
    >();

    for (const group of groupedCategories) {
      for (const item of group.items) {
        if (!Array.isArray(item.subcategories)) continue;
        for (const subcategory of item.subcategories) {
          if (!OTHERS_SUBCATEGORY_NAMES.has(subcategory.name)) continue;
          extracted.set(subcategory.name, {
            id: subcategory.id,
            name: subcategory.name,
            href: subcategory.href,
            count: subcategory.count,
          });
        }
      }
    }

    const values = Array.from(extracted.values());
    values.sort((a, b) => {
      const aIndex = OTHERS_SUBCATEGORY_ORDER.indexOf(
        a.name as (typeof OTHERS_SUBCATEGORY_ORDER)[number],
      );
      const bIndex = OTHERS_SUBCATEGORY_ORDER.indexOf(
        b.name as (typeof OTHERS_SUBCATEGORY_ORDER)[number],
      );
      const ai = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
      const bi = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
      return ai - bi;
    });

    return values;
  }, [groupedCategories]);

  return (
    <>
      <header className={cn(siteHeaderBaseClass, scrolled ? siteHeaderScrolledClass : "shadow-none")} suppressHydrationWarning>
        <div className="shell-container-wide min-w-0" suppressHydrationWarning>
          <div className="flex h-16 min-w-0 items-center justify-between gap-2 sm:gap-3">

            {/* Logo */}
            <Link
              href="/"
              aria-label="One&Only - home"
              className="inline-flex h-full min-w-0 shrink-0 items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <OneAndOnlyLogo className="h-7.5 max-w-[9.5rem] md:h-8.5 md:max-w-none xl:h-9" variant="orange" />
            </Link>

            {/* Center nav — desktop only */}
            <nav
              className="site-header__desktop-nav"
              aria-label="Primary navigation"
              suppressHydrationWarning
            >
              {HEADER_PRIMARY_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                const hasMega = "hasMega" in link && link.hasMega;

                if (hasMega) {
                  return (
                    <div
                      key={link.label}
                      data-mega-zone
                      className="relative flex h-full items-stretch"
                      onMouseEnter={() => openMegaMenu(link.label)}
                      onMouseLeave={(event) => {
                        if (isMegaPointerTarget(event.relatedTarget)) return;
                        scheduleMegaClose();
                      }}
                    >
                      <button
                        type="button"
                        data-mega-trigger
                        aria-expanded={activeMega === link.label}
                        aria-controls="products-mega-menu"
                        aria-haspopup="true"
                        onFocus={() => openMegaMenu(link.label)}
                        className={cn(
                          "typ-nav shell-nav-link shell-nav-link--desktop relative inline-flex items-center gap-1 whitespace-nowrap px-1.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 2xl:px-2.5",
                          isActive
                            ? "shell-nav-link-current"
                            : activeMega === link.label
                              ? "text-primary"
                              : "",
                        )}
                      >
                        {link.label}
                        <CaretDown
                          size={14}
                          weight="bold"
                          aria-hidden="true"
                          className={cn(
                            "transition-transform duration-300 ease-out",
                            activeMega === link.label && "rotate-180",
                          )}
                        />
                      </button>
                    </div>
                  );
                }

                const navClassName = cn(
                  "typ-nav shell-nav-link shell-nav-link--desktop relative whitespace-nowrap px-1.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 2xl:px-2.5",
                  isActive ? "shell-nav-link-current" : "",
                );

                if (isPlannerEntryHref(link.href)) {
                  return (
                    <PlannerLaunchLink
                      key={link.label}
                      href={link.href}
                      surface="header-nav"
                      label={link.label}
                      onMouseEnter={closeMegaMenu}
                      className={navClassName}
                    >
                      {link.label}
                    </PlannerLaunchLink>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onMouseEnter={closeMegaMenu}
                    className={navClassName}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {HEADER_MORE_LINKS.length > 0 ? (
                <div
                  data-mega-zone
                  className="relative flex h-full items-stretch"
                  onMouseEnter={openMoreMenu}
                  onMouseLeave={(event) => {
                    if (isMegaPointerTarget(event.relatedTarget)) return;
                    scheduleMegaClose();
                  }}
                >
                  <button
                    type="button"
                    data-mega-trigger
                    aria-expanded={moreOpen}
                    aria-controls="header-more-menu"
                    aria-haspopup="menu"
                    onFocus={openMoreMenu}
                    className={cn(
                      "typ-nav shell-nav-link shell-nav-link--desktop relative inline-flex items-center gap-1 whitespace-nowrap px-1.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 2xl:px-2.5",
                      moreOpen ||
                        HEADER_MORE_LINKS.some(
                          (link) =>
                            pathname === link.href || pathname.startsWith(`${link.href}/`),
                        )
                        ? "shell-nav-link-current"
                        : "",
                    )}
                  >
                    More
                    <CaretDown
                      size={14}
                      weight="bold"
                      aria-hidden="true"
                      className={cn(
                        "transition-transform duration-300 ease-out",
                        moreOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {moreOpen ? (
                    <div
                      id="header-more-menu"
                      role="menu"
                      aria-label="More site pages"
                      className="absolute left-0 top-full z-50 mt-0 min-w-[12rem] rounded-b-xl border border-soft bg-panel py-2 shadow-theme-soft animate-in fade-in slide-in-from-top-1 duration-200"
                      onMouseEnter={openMoreMenu}
                      onMouseLeave={(event) => {
                        if (isMegaPointerTarget(event.relatedTarget)) return;
                        scheduleMegaClose();
                      }}
                    >
                      {HEADER_MORE_LINKS.map((link) => {
                        const isActive =
                          pathname === link.href || pathname.startsWith(`${link.href}/`);
                        return (
                          <Link
                            key={link.label}
                            href={link.href}
                            role="menuitem"
                            onClick={() => setMoreOpen(false)}
                            className={cn(
                              "shell-list-link block whitespace-nowrap px-4 py-2.5 typ-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                              isActive ? "shell-nav-link-current text-primary" : "text-strong",
                            )}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </nav>

            {/* Right CTAs */}
            <div className="flex h-full min-w-0 shrink-0 items-center gap-1 sm:gap-1.5">
              <div
                ref={searchPanelRef}
                className="site-header__search relative min-w-0"
                onMouseEnter={closeMegaMenu}
              >
                <form
                  className={headerSearchShellClass}
                  role="search"
                  aria-label="Site product search"
                  suppressHydrationWarning
                  onSubmit={(event) => {
                    event.preventDefault();
                    void submitSearch();
                  }}
                >
                  <label htmlFor="site-header-search" className="sr-only">
                    Search products
                  </label>
                  <MagnifyingGlass size={16} weight="bold" className="text-muted" aria-hidden="true" />
                  <input
                    id="site-header-search"
                    name="search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onFocus={() => setShowSearchPanel(true)}
                    placeholder="Search products..."
                    className="w-28 bg-transparent typ-body text-strong outline-none placeholder:text-subtle xl:w-36 2xl:w-44"
                    autoComplete="off"
                    aria-label="Search products"
                    aria-describedby="site-header-search-status"
                    aria-controls={showSearchPanel ? "site-header-search-panel" : undefined}
                  />
                  <Sparkle size={16} weight="duotone" className="text-contrast-accent" aria-hidden="true" />
                  <button type="submit" className="sr-only">
                    Submit header search
                  </button>
                </form>
                <p id="site-header-search-status" className="sr-only" role="status" aria-live="polite">
                  {searchStatusAnnouncement}
                </p>

                  {showSearchPanel && (
                    <div
                      id="site-header-search-panel"
                      className={`${headerSearchPanelClass} site-header-flyout animate-in fade-in slide-in-from-top-2 duration-300`}
                    >
                      <div className={headerSearchMetaClass}>
                        <span>{searchSectionTitle}</span>
                        {searchSource && (
                          <span className={headerSearchBadgeClass}>
                            {searchSource === "ai"
                              ? "AI ranked"
                              : searchSource === "static-fallback"
                                ? "Static fallback"
                                : "Local search"}
                          </span>
                        )}
                      </div>
                      {searchLoading ? (
                        <p className="py-6 typ-body text-muted">Searching...</p>
                      ) : searchResults.length > 0 ? (
                        <ul className="space-y-1">
                          {searchResults.map((result) => (
                            <li key={result.id}>
                              <Link
                                href={result.href}
                                onClick={onSearchResultClick}
                                className="shell-list-link flex items-center justify-between rounded-xl px-3 py-2.5 typ-body"
                              >
                                <span>{result.title}</span>
                                <span className={headerSearchKindClass}>
                                  {result.type}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="space-y-1 py-2">
                          <Link
                            href="/products"
                            onClick={onSearchResultClick}
                            className="shell-list-link flex items-center justify-between rounded-xl px-3 py-2 typ-body"
                          >
                            All Products
                          </Link>
                          <Link
                            href="/solutions"
                            onClick={onSearchResultClick}
                            className="shell-list-link flex items-center justify-between rounded-xl px-3 py-2 typ-body"
                          >
                            Solutions
                          </Link>
                          <Link
                            href="/portfolio"
                            onClick={onSearchResultClick}
                            className="shell-list-link flex items-center justify-between rounded-xl px-3 py-2 typ-body"
                          >
                            Portfolio
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Site-wide i18n: en · hi · fr · de · es (NEXT_LOCALE cookie) */}
              <LanguageSwitcher variant="header" className="min-w-0" />

              {/* Hamburger — mobile only; toggles clear open/close affordance */}
              <button
                ref={hamburgerRef}
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-drawer"
                aria-haspopup="dialog"
                onMouseDown={(event) => {
                  if (!mobileOpen) {
                    event.preventDefault();
                  }
                }}
                onClick={() => {
                  if (mobileOpen) {
                    setMobileOpen(false);
                    return;
                  }
                  flushSync(() => {
                    setMobileOpen(true);
                  });
                }}
                className="site-header__hamburger shell-icon-button inline-flex h-11 w-11 min-h-11 min-w-11 shrink-0 items-center justify-center touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {mobileOpen ? (
                  <X size={20} weight="bold" aria-hidden="true" />
                ) : (
                  <List size={20} weight="bold" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Products mega menu */}
          {activeMega === "Products" && (
            <div
              id="products-mega-menu"
              onMouseEnter={() => openMegaMenu("Products")}
              onMouseLeave={(event) => {
                if (isMegaPointerTarget(event.relatedTarget)) return;
                scheduleMegaClose();
              }}
              className="mega-menu-panel site-header-flyout hidden lg:block border-t border-soft bg-panel shadow-theme-soft animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="shell-container-wide py-5">
                <div className={cn("grid gap-x-3 gap-y-4", megaMenuOthers.length > 0 ? "grid-cols-7" : "grid-cols-6")}>
                  {megaMenuGroups.map((group) => {
                    const primaryItem = group.items[0];
                    const hideParentRow = primaryItem
                      ? megaMenuParentMatchesGroup(primaryItem.name, group.groupLabel)
                      : false;

                    return (
                    <div
                      key={group.groupId}
                      className="min-w-0"
                    >
                      <Link
                        href={primaryItem?.href || `/products/${group.groupId}`}
                        onClick={() => setActiveMega(null)}
                        className="typ-overline mb-2 inline-flex text-strong transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        {group.groupLabel}
                      </Link>
                      <ul className="space-y-1">
                        {group.items.map((item) => (
                          <li key={item.id}>
                            {!megaMenuParentMatchesGroup(item.name, group.groupLabel) && (
                              <Link
                                href={item.href}
                                onClick={() => setActiveMega(null)}
                                className="shell-list-link shell-list-link--mega block rounded-lg px-1.5 py-1 text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                {item.name}
                              </Link>
                            )}

                            {Array.isArray(item.subcategories) &&
                              item.subcategories.length > 0 && (
                              <ul className={cn("space-y-0.5", hideParentRow ? "" : "mt-1")}>
                                {item.subcategories.map((subcategory) => (
                                  <li key={`${item.id}-${subcategory.id}`}>
                                    <Link
                                      href={subcategory.href}
                                      onClick={() => setActiveMega(null)}
                                      className="shell-list-link shell-list-link--mega-sub block rounded-md px-1.5 py-0.5 text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    >
                                      {subcategory.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    );
                  })}

                  {megaMenuOthers.length > 0 && (
                    <div className="min-w-0">
                      <Link
                        href="/products"
                        onClick={() => setActiveMega(null)}
                        className="typ-overline inline-flex mb-2 text-strong transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Others
                      </Link>
                      <ul className="space-y-1">
                        {megaMenuOthers.map((subcategory) => (
                          <li key={subcategory.name}>
                            <Link
                              href={subcategory.href}
                              onClick={() => setActiveMega(null)}
                              className="shell-list-link shell-list-link--mega block rounded-lg px-1.5 py-1 text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              {subcategory.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </div>
                <div className="mt-3 border-t border-soft pt-2.5">
                  <Link
                    href="/products"
                    onClick={() => setActiveMega(null)}
                    className="inline-flex items-center rounded-lg px-3 py-2 typ-body font-semibold text-primary hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    All Products &gt;
                  </Link>
                </div>
              </div>
            </div>
          )}
      </header>

      {/* Mobile drawer — rendered outside header to avoid z-index conflicts */}
      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        closeButtonRef={hamburgerRef}
        groupedCategories={groupedCategories}
      />
    </>
  );
}
