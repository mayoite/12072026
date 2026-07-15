import type { ReactNode } from "react";
import type { Metadata } from "next";
import "@/app/(site)/globals.css";
import "@/app/css/core/locked/admin/index.css";
import AdminLayoutShell from "@/features/admin/AdminLayoutShell";
import { requireAuthUser } from "@/lib/auth/session";

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
    <AdminLayoutShell>
      <main id="main-content">{children}</main>
    </AdminLayoutShell>
  );
}
