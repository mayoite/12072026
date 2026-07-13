import { fetchCatalogCategoriesLive } from "../lib/catalog/catalogDrizzle";

async function main() {
  const cats = await fetchCatalogCategoriesLive();
  console.log(cats);
}
main();
