import { AdminPriceBookPageView } from "@/features/planner/admin/pricing/AdminPriceBookPageView";
import { ensureDefaultPriceBookSeeded } from "@/features/planner/admin/pricing/priceBookAdmin.server";

export const metadata = {
  title: "Price books | Oando Admin",
};

export const dynamic = "force-dynamic";

export default function AdminPriceBooksPage() {
  ensureDefaultPriceBookSeeded();
  return <AdminPriceBookPageView />;
}