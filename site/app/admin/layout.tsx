import type { ReactNode } from "react";
import type { Metadata } from "next";
import "@/app/(site)/globals.css";
import "@/app/css/core/locked/admin/index.css";
import AdminLayoutShell from "@/features/planner/admin/AdminLayoutShell";
import { CsrfBootstrap } from "@/components/security/CsrfBootstrap";
import { requireAuthUser } from "@/lib/auth/session";
import { ciscoSans, helveticaNeue } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Admin | One&Only",
  description: "O&O platform admin console — planner, catalog, and operations.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuthUser("/admin", "admin");

  return (
    <html lang="en-IN" className={`${ciscoSans.variable} ${helveticaNeue.variable}`}>
      <body className="scheme-page antialiased selection:bg-primary selection:text-inverse">
        <CsrfBootstrap />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[9999] focus:bg-panel focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Skip to main content
        </a>
        <AdminLayoutShell>
          <main id="main-content">{children}</main>
        </AdminLayoutShell>
      </body>
    </html>
  );
}
