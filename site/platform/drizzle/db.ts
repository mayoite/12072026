/** @deprecated Prefer `@/platform/drizzle/adminDb` or `productsDb`. */
export { adminDb as db, getAdminDb } from "./adminDb";
export { productsDb, getProductsDb } from "./productsDb";
export {
  isProductsDatabaseConfigured,
  isPlannerDatabaseUrlConfigured,
  resolveProductsDatabaseUrl,
  resolvePlannerDatabaseUrl,
} from "./databaseUrls";
