"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Drawer } from "vaul";
import { CaretDown, MagnifyingGlass, Sparkle, X } from "@phosphor-icons/react";
import { OneAndOnlyLogo } from "@/components/ui/Logo";
import { PlannerLaunchLink } from "@/components/ui/PlannerLaunchLink";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { type GroupedCategory } from "@/lib/navigation";
import { SITE_NAV_LINKS, SITE_CTA_LINKS } from "@/features/site/data/navigation";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { isPlannerEntryHref } from "@/lib/analytics/plannerEntry";
import { trackSiteSearchSubmitted } from "@/lib/analytics/siteEvents";
import { cn } from "@/lib/utils";

interface NavSearchResult {
  id: string;
  title: string;
  href: string;
  type: "product" | "category" | "page";
  source: "ai" | "local";
}

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

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
  groupedCategories: GroupedCategory[];
}

const drawerSearchClass = "shell-glass-panel flex min-h-11 items-center gap-2 rounded-lg px-3 py-2.5";
const drawerGroupLabelClass = "shell-search-kind px-3 pb-1 pt-2";
const drawerLinkClass = "shell-list-link flex min-h-12 items-center rounded-xl px-3 font-normal text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [font-size:var(--type-body-size)]";
const drawerSubtleLinkClass = "shell-list-link flex min-h-11 items-center justify-between rounded-lg px-3 text-base text-body focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
const drawerSubcategoryLinkClass = "shell-list-link flex min-h-11 items-center justify-between rounded-md px-2 py-1.5 text-sm text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
const drawerCallLinkClass =
  "shell-call-link mb-3 inline-flex min-h-11 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
const drawerSearchNoteClass = "shell-search-meta";
const drawerCountClass = "shell-search-meta";

export function MobileNavDrawer({ open, onClose, closeButtonRef, groupedCategories }: MobileNavDrawerProps) {
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [accordion, setAccordion] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NavSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  useLayoutEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      Promise.resolve().then(() => {
        setSearchQuery("");
        setSearchResults([]);
        setSearchLoading(false);
        setShowSearchPanel(false);
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled]), input, [tabindex]:not([tabindex='-1'])",
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const query = searchQuery.trim();
 
    if (query.length < 2) {
      Promise.resolve().then(() => {
        setSearchResults([]);
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
          body: JSON.stringify({ query, limit: 8, context: "mobile" }),
          signal: controller.signal,
        });

        const payload = (await response.json()) as {
          results?: NavSearchResult[];
        };

        if (!response.ok) {
          setSearchResults([]);
          return;
        }
        setSearchResults(Array.isArray(payload.results) ? payload.results : []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 260);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [open, searchQuery]);

  const handleClose = () => {
    onClose();
  };

  const focusHamburger = () => {
    closeButtonRef.current?.focus({ preventScroll: true });
  };

  const onSearchResultClick = () => {
    setShowSearchPanel(false);
    setSearchQuery("");
    handleClose();
  };

  const submitSearch = async () => {
    const query = searchQuery.trim();
    const destination = await resolveSearchDestination(query, "mobile", searchResults);
    trackSiteSearchSubmitted({
      pathname: window.location.pathname,
      surface: "mobile",
      queryLength: query.length,
      destination,
    });
    router.push(destination);
    setShowSearchPanel(false);
    setSearchQuery("");
    handleClose();
  };

  const searchStatusAnnouncement = !searchQuery.trim()
    ? "Search products. Type at least two characters."
    : searchLoading
      ? "Searching products."
      : searchResults.length > 0
        ? `${searchResults.length} search result${searchResults.length === 1 ? "" : "s"} available.`
        : "No search results. Type at least two characters.";

  return (
    <Drawer.Root
      direction="right"
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" />
        <Drawer.Content
          ref={drawerRef}
          id="mobile-nav-drawer"
          aria-label="Mobile navigation"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            closeBtnRef.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            focusHamburger();
          }}
          className="fixed inset-y-0 right-0 z-[70] flex w-[92vw] max-w-md flex-col overflow-hidden bg-panel text-strong focus:outline-none"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-soft px-5 py-4">
            <OneAndOnlyLogo className="h-8" variant="orange" />
            <button
              ref={closeBtnRef}
              type="button"
              onClick={handleClose}
              aria-label="Close navigation"
              className="shell-icon-button inline-flex h-11 w-11 text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile primary navigation">
          <div className="mb-4">
            <form
              className={drawerSearchClass}
              role="search"
              aria-label="Mobile product search"
              onSubmit={(event) => {
                event.preventDefault();
                void submitSearch();
              }}
            >
              <MagnifyingGlass size={16} weight="bold" className="text-muted" aria-hidden="true" />
              <label htmlFor="mobile-nav-search" className="sr-only">
                Search products
              </label>
              <input
                id="mobile-nav-search"
                name="search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setShowSearchPanel(true)}
                placeholder="Search products..."
                className="w-full bg-transparent text-sm text-strong outline-none placeholder:text-subtle"
                autoComplete="off"
                aria-label="Search products"
                aria-describedby="mobile-nav-search-status"
              />
              <Sparkle size={16} weight="duotone" className="text-accent1" aria-hidden="true" />
              <button type="submit" className="sr-only">
                Submit mobile search
              </button>
            </form>
            <p id="mobile-nav-search-status" className="sr-only" role="status" aria-live="polite">
              {searchStatusAnnouncement}
            </p>

            {(showSearchPanel || searchQuery.trim().length >= 2) && (
              <div
                id="mobile-nav-search-panel"
                className="shell-floating-panel-soft mt-2 rounded-2xl p-3"
              >
                <p className={drawerSearchNoteClass}>
                  {searchLoading
                    ? "Searching"
                    : searchResults.length > 0
                      ? "Results"
                      : "No results"}
                </p>
                {searchLoading ? (
                  <p className="text-sm text-muted">Searching...</p>
                ) : searchResults.length > 0 ? (
                  <ul className="space-y-1">
                    {searchResults.map((result) => (
                      <li key={result.id}>
                        <Link
                          href={result.href}
                          onClick={onSearchResultClick}
                          className="shell-list-link flex items-center justify-between rounded-lg bg-panel px-3 py-2 text-sm text-body"
                        >
                          <span>{result.title}</span>
                          <span className={drawerCountClass}>
                            {result.type}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">
                    Type at least 2 characters to search.
                  </p>
                )}
              </div>
            )}
          </div>

          <ul className="space-y-1">
            {SITE_NAV_LINKS.map((link) => {
              if ("hasMega" in link && link.hasMega) {
                const isOpen = Boolean(accordion.products);
                return (
                  <li key={link.label}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls="mobile-nav-products-panel"
                      onClick={() =>
                        setAccordion((prev) => ({ ...prev, products: !prev.products }))
                      }
                      className={`${drawerLinkClass} w-full justify-between`}
                    >
                      {link.label}
                      <CaretDown
                        size={16}
                        weight="bold"
                        aria-hidden="true"
                        className={cn(
                          "text-subtle transition-transform",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>

                    {isOpen && (
                      <div
                        id="mobile-nav-products-panel"
                        className="mt-1 space-y-2 rounded-xl border border-soft bg-hover p-2 site-header-flyout animate-in fade-in duration-300"
                      >
                        <Link
                          href="/products"
                          onClick={handleClose}
                          className={`${drawerSubtleLinkClass} text-primary`}
                        >
                          All Products
                        </Link>

                        {groupedCategories.map((group) => (
                          <div key={group.groupId}>
                            <p className={drawerGroupLabelClass}>{group.groupLabel}</p>
                            <ul className="space-y-1">
                              {group.items.map((item) => (
                                <li key={item.id}>
                                  {item.name.trim().toLowerCase() !== group.groupLabel.trim().toLowerCase() && (
                                    <Link
                                      href={item.href}
                                      onClick={handleClose}
                                      className={drawerSubtleLinkClass}
                                    >
                                      {item.name}
                                    </Link>
                                  )}

                                  {Array.isArray(item.subcategories) &&
                                    item.subcategories.length > 0 && (
                                    <ul className="mt-1 space-y-0.5">
                                      {item.subcategories.map((subcategory) => (
                                        <li key={`${item.id}-${subcategory.id}`}>
                                          <Link
                                            href={subcategory.href}
                                            onClick={handleClose}
                                            className={drawerSubcategoryLinkClass}
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
                        ))}
                      </div>
                    )}
                  </li>
                );
              }

              if (isPlannerEntryHref(link.href)) {
                return (
                  <li key={link.label}>
                    <PlannerLaunchLink
                      href={link.href}
                      surface="mobile-nav"
                      label={link.label}
                      className={drawerLinkClass}
                      onClick={handleClose}
                    >
                      {link.label}
                    </PlannerLaunchLink>
                  </li>
                );
              }

              return (
                <li key={link.label}>
                  <TrackedLink
                    href={link.href}
                    label={link.label}
                    surface="mobile-nav"
                    className={drawerLinkClass}
                    onClick={handleClose}
                  >
                    {link.label}
                  </TrackedLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-soft bg-panel px-5 py-4">
          <TrackedLink
            href="tel:+919835630940"
            label="Call +91 98356 30940"
            surface="mobile-nav"
            className={drawerCallLinkClass}
            aria-label="Call +91 98356 30940"
            onClick={handleClose}
          >
            Call +91 98356 30940
          </TrackedLink>
          <div className="mb-3">
            <p className="typ-label mb-2 text-muted">Language</p>
            <LanguageSwitcher variant="header" className="w-full [&>select]:max-w-none [&>select]:w-full" />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SITE_CTA_LINKS.map((cta) => (
              <TrackedLink
                key={cta.label}
                href={cta.href}
                label={cta.label}
                surface="mobile-nav-cta"
                onClick={handleClose}
                className={cn(
                  cta.variant === "primary" ? "btn-primary" : "btn-outline",
                  "min-h-11 w-full justify-center",
                )}
              >
                {cta.label}
              </TrackedLink>
            ))}
          </div>
        </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
