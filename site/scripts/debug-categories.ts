import { fetchCatalogCategoriesLive } from "../lib/catalog/catalogDrizzle";

export async function debugCategories(
  deps: {
    fetchCategories?: typeof fetchCatalogCategoriesLive;
    log?: typeof console.log;
  } = {},
): Promise<unknown> {
  const fetchCategories = deps.fetchCategories ?? fetchCatalogCategoriesLive;
  const log = deps.log ?? console.log;
  const cats = await fetchCategories();
  log(cats);
  return cats;
}

export async function main(): Promise<void> {
  await debugCategories();
}

function isMain(): boolean {
  const entry = (process.argv[1] ?? "").replace(/\\/g, "/");
  return entry.endsWith("debug-categories.ts") || entry.endsWith("debug-categories.js");
}

if (isMain()) {
  void main();
}
