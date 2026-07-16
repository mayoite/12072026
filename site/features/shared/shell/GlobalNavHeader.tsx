"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Member-suite navigation header (dashboard, portal).
 * Admin console uses AdminLayoutShell — not this header.
 */
export function GlobalNavHeader() {
  const pathname = usePathname();

  const isPortal = pathname?.startsWith("/portal");
  const isDashboard =
    !isPortal &&
    (pathname === "/oando-planner/dashboard" ||
      pathname === "/oando-planner/dashboard/" ||
      pathname === "/dashboard" ||
      pathname === "/dashboard/");

  return (
    <header
      className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b px-4 backdrop-blur-md sm:px-6"
      style={{
        borderColor: "var(--border-soft)",
        background: "var(--surface-glass-strong)",
      }}
    >
      <Link
        href="/dashboard"
        className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
        aria-label="One&Only workspace - Go to dashboard"
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{
            background: "var(--color-primary)",
          }}
        >
          <span className="text-[0.625rem] font-bold tracking-tight text-white">
            O&amp;O
          </span>
        </div>
        <span
          className="hidden text-[0.9375rem] font-semibold tracking-tight sm:inline"
          style={{ color: "var(--text-strong)" }}
        >
          One&amp;Only Suite
        </span>
      </Link>

      <div className="flex-1" />

      <nav className="flex items-center gap-1" aria-label="Main navigation">
        {[
          { label: "Dashboard", href: "/dashboard", active: isDashboard },
          {
            label: "Choose Product",
            href: "/choose-product",
            active: pathname?.startsWith("/choose-product") ?? false,
          },
          { label: "Portal", href: "/portal", active: isPortal },
          {
            label: "Planner",
            href: "/planner/canvas",
            active: pathname?.startsWith("/planner/canvas") ?? false,
          },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={link.active ? "page" : undefined}
            className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-[0.8125rem] transition-colors"
            style={{
              color: link.active ? "var(--color-primary)" : "var(--text-body)",
              fontWeight: link.active ? 600 : 400,
              background: link.active ? "var(--surface-soft)" : "transparent",
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
