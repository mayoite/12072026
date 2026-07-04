import { redirect } from "next/navigation";
import { DashboardClient } from "@/app/(site)/dashboard/DashboardClient";
import { SiteWorkspaceShell } from "@/components/home/layout";
import { getOptionalUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await getOptionalUser();

  if (!user) {
    redirect("/access?next=%2Fdashboard");
  }

  return (
    <SiteWorkspaceShell>
      <DashboardClient userEmail={user.email || "workspace user"} />
    </SiteWorkspaceShell>
  );
}
