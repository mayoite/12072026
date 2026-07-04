import { redirect } from "next/navigation";

/** Legacy `/admin/buddy-catalog` → unified planner catalog admin. */
export default function BuddyCatalogLegacyRedirect() {
  redirect("/admin/planner-catalog");
}
