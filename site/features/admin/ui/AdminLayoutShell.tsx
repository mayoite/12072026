"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowSquareOut as ExternalLink,
  List as Menu,
  X,
} from "@phosphor-icons/react";
import { OneAndOnlyLogo } from "@/components/ui/Logo";
import {
  ADMIN_NAV_GROUPS,
  ADMIN_NAV_ITEMS,
  resolveAdminNavItem,
} from "./adminNav";

const isSvgEditorFocusRoute = (pathname: string) =>
  pathname.startsWith("/admin/svg-editor/");

/** True only for the best (longest) matching nav href — avoids /admin/crm lighting up under /admin/crm/projects. */
function isActivePath(pathname: string, href: string, allHrefs: readonly string[]): boolean {
  const path =
    pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const normalize = (h: string) =>
    h.endsWith("/") && h.length > 1 ? h.slice(0, -1) : h;

  let best: string | null = null;
  for (const candidate of allHrefs) {
    const c = normalize(candidate);
    if (c === "/admin") {
      if (path === "/admin") best = c;
      continue;
    }
    if (path === c || path.startsWith(`${c}/`)) {
      if (!best || c.length > best.length) best = c;
    }
  }
  return best === normalize(href);
}

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const editorFocusMode = isSvgEditorFocusRoute(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const currentNav = resolveAdminNavItem(pathname);
  const allNavHrefs = ADMIN_NAV_ITEMS.map((item) => item.href);

  const toggleGroup = useCallback((title: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    mobileToggleRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const firstLink = sidebarRef.current?.querySelector<HTMLElement>("a[href], button");
    firstLink?.focus({ preventScroll: true });
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen || !sidebarRef.current) return;

    const sidebar = sidebarRef.current;
    const focusable = () =>
      Array.from(
        sidebar.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => !node.hasAttribute("disabled") && node.tabIndex !== -1);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobile();
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = focusable();
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMobile]);

  return (
    <div className="shell-admin-layout" data-admin-layout>
      <a
        href="#main-content"
        className="admin-btn admin-btn--primary fixed start-4 top-4 z-[60] -translate-y-24 focus:translate-y-0"
      >
        Skip to main content
      </a>
      {!editorFocusMode && (
        <header className="shell-admin-header shell-admin-header--brand">
          <div className="shell-admin-bar shell-admin-bar--brand">
            <div className="shell-admin-bar__group">
              <button
                ref={mobileToggleRef}
                type="button"
                className="shell-admin-mobile-toggle md:hidden"
                onClick={() => setMobileOpen((open) => !open)}
                aria-expanded={mobileOpen}
                aria-controls="admin-mobile-sidebar"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <Link
                href="/admin"
                className="shell-admin-brand"
                onClick={closeMobile}
                aria-label="One&Only Admin home"
              >
                <OneAndOnlyLogo
                  variant="mark"
                  className="shell-admin-brand__mark h-8 w-8 md:hidden"
                />
                <OneAndOnlyLogo
                  variant="white"
                  className="shell-admin-brand__wordmark hidden h-7 w-auto md:flex"
                />
                <span className="shell-admin-brand__badge">Console</span>
              </Link>
              {currentNav ? (
                <p className="shell-admin-context" aria-live="polite">
                  <span className="shell-admin-context__label">Now</span>
                  <span className="shell-admin-context__title">{currentNav.label}</span>
                </p>
              ) : null}
            </div>
            <div className="shell-admin-bar__actions">
              <Link href="/" className="shell-admin-header-link" aria-label="View site">
                <span className="shell-admin-header-link__label">View site</span>
                <ArrowUpRight size={14} aria-hidden />
              </Link>
              <Link
                href="/planner/guest"
                className="shell-admin-header-cta"
                aria-label="Open planner"
              >
                <span className="shell-admin-header-cta__label">Open planner</span>
                <ExternalLink size={14} aria-hidden />
              </Link>
            </div>
          </div>
        </header>
      )}

      <div className="shell-admin-frame">
        {!editorFocusMode || mobileOpen ? (
          <aside
            ref={sidebarRef}
            id="admin-mobile-sidebar"
            className={`shell-admin-sidebar ${mobileOpen ? "shell-admin-sidebar--open" : ""}`}
            role={mobileOpen ? "dialog" : undefined}
            aria-modal={mobileOpen ? true : undefined}
            aria-label={mobileOpen ? "Admin navigation menu" : "Admin navigation"}
          >
            <div className="shell-admin-sidebar__scroll">
            <nav className="shell-admin-sidebar__nav" aria-label="Admin sections">
              {ADMIN_NAV_GROUPS.map((group) => {
                const collapsed = Boolean(collapsedGroups[group.title]);
                const groupHasActive = group.items.some((item) =>
                  isActivePath(pathname, item.href, allNavHrefs),
                );
                const panelId = `admin-nav-group-${group.title.replace(/\s+/g, "-").toLowerCase()}`;
                return (
                  <div
                    key={group.title}
                    className={`shell-admin-nav-group${groupHasActive ? " shell-admin-nav-group--active" : ""}${collapsed ? " shell-admin-nav-group--collapsed" : ""}`}
                  >
                    <button
                      type="button"
                      className="shell-admin-nav-group__toggle"
                      onClick={() => toggleGroup(group.title)}
                      aria-expanded={!collapsed}
                      aria-controls={panelId}
                    >
                      <span className="shell-admin-nav-group__title">{group.title}</span>
                      <span className="shell-admin-nav-group__chevron" aria-hidden>
                        {collapsed ? "+" : "−"}
                      </span>
                    </button>
                    <div
                      id={panelId}
                      className="shell-admin-nav-group__items"
                      hidden={collapsed}
                    >
                      {group.items.map((item) => {
                        const active = isActivePath(pathname, item.href, allNavHrefs);
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            title={item.description}
                            onClick={closeMobile}
                            className={`shell-admin-nav-link${active ? " shell-admin-nav-link--active" : ""}`}
                            aria-current={active ? "page" : undefined}
                            aria-label={item.label}
                          >
                            <span className="shell-admin-nav-link__icon" aria-hidden>
                              <Icon size={16} />
                            </span>
                            <span className="shell-admin-nav-link__text" aria-hidden>
                              <span className="shell-admin-nav-link__label">{item.label}</span>
                              <span className="shell-admin-nav-link__hint">
                                {item.description}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
            <footer className="shell-admin-sidebar__footer">
              <p className="shell-admin-sidebar__footnote">One&amp;Only Admin</p>
              {currentNav ? (
                <p className="shell-admin-sidebar__current" title={currentNav.description}>
                  {currentNav.label}
                </p>
              ) : null}
            </footer>
          </aside>
        ) : null}

        {mobileOpen ? (
          <button
            type="button"
            className="shell-admin-sidebar-backdrop md:hidden"
            aria-label="Close navigation"
            onClick={closeMobile}
          />
        ) : null}

        <div
          className="shell-admin-main"
          inert={mobileOpen ? true : undefined}
          aria-hidden={mobileOpen ? true : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
