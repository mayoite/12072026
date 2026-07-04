import type { ReactNode } from "react";

import { requireAuthUser } from "@/lib/auth/session";

/** Legacy `/crm/*` URLs — admin session required, then redirect into `/admin/crm/*`. */
export default async function CrmLegacyLayout({ children }: { children: ReactNode }) {
  await requireAuthUser("/admin/crm/projects", "admin");
  return children;
}
