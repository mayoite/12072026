import type { ReactNode } from "react";
import type { Metadata } from "next";
import "@/app/(site)/globals.css";
import "@/app/css/core/locked/admin/index.css";
import AdminLayoutShell from "@/features/admin/ui/AdminLayoutShell";
import { requireAuthUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: {
    default: "Admin | One&Only",
    template: "%s | One&Only Admin",
  },
  description: "One&Only admin console — planner, catalog, CRM, and operations.",
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/icon.png" }],
  },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuthUser("/admin", "admin");

  return (
    <AdminLayoutShell>
      <main id="main-content" tabIndex={-1}>{children}</main>
    </AdminLayoutShell>
  );
}
