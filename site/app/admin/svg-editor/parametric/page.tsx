import { redirect } from "next/navigation";

import { ADMIN_PRODUCT_STUDIO_NEW_HREF } from "@/features/admin/svg-editor/parametric/deskAssemblyFactoryIdentity";

/**
 * Legacy parametric door — one Product Studio page only.
 * Keep route so old bookmarks/E2E land on the same page.
 */
export default function AdminParametricProductFactoryRedirectPage() {
  redirect(ADMIN_PRODUCT_STUDIO_NEW_HREF);
}
