"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowSquareOut as ExternalLink, List as Menu, X } from "@phosphor-icons/react";
import { OneAndOnlyLogo } from "@/components/ui/Logo";
import { ADMIN_NAV_GROUPS } from "./adminNav";

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin" || pathname === "/admin/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

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
            <Link href="/admin" className="shell-admin-brand" onClick={closeMobile}>
              <OneAndOnlyLogo variant="white" className="h-7 w-auto" />
              <span className="shell-admin-brand__badge">Admin</span>
            </Link>
          </div>
          <div className="shell-admin-bar__actions">
            <Link href="/" className="shell-admin-header-link" aria-label="View site">
              <span className="shell-admin-header-link__label">View site</span>
              <ArrowUpRight size={14} aria-hidden />
            </Link>
            <Link href="/planner/guest" className="shell-admin-header-cta" aria-label="Open planner">
              <span className="shell-admin-header-cta__label">Open planner</span>
              <ExternalLink size={14} aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <div className="shell-admin-frame">
        <aside
          ref={sidebarRef}
          id="admin-mobile-sidebar"
          className={`shell-admin-sidebar ${mobileOpen ? "shell-admin-sidebar--open" : ""}`}
          role={mobileOpen ? "dialog" : undefined}
          aria-modal={mobileOpen ? true : undefined}
          aria-label={mobileOpen ? "Admin navigation menu" : "Admin navigation"}
        >
          <nav className="shell-admin-sidebar__nav">
            {ADMIN_NAV_GROUPS.map((group) => (
              <div key={group.title} className="shell-admin-nav-group">
                <p className="shell-admin-nav-group__title">{group.title}</p>
                {group.items.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={item.description}
                      onClick={closeMobile}
                      className={`shell-admin-nav-link${active ? " shell-admin-nav-link--active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="shell-admin-nav-link__icon" aria-hidden>
                        <Icon size={16} />
                      </span>
                      <span className="shell-admin-nav-link__label">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          <footer className="shell-admin-sidebar__footer">
            <p className="shell-admin-sidebar__footnote">O&amp;O workspace platform</p>
          </footer>
        </aside>

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
