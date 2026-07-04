import Image from "next/image";
import Link from "next/link";
import { CompareColumnActions } from "@/components/products/CompareColumnActions";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { HomeMarketingLayout } from "@/components/home/layout";
import { getProducts, type Product } from "@/features/catalog/getProducts";
import {
  getCatalogCategoryLabel,
  normalizeRequestedCategoryId,
} from "@/features/catalog/categories";
import {
  filterMeaningfulDimensionText,
  filterMeaningfulMaterialList,
} from "@/lib/displayText";
import { normalizeAssetPath } from "@/lib/assetPaths";
import { COMPARE_ROUTE_COPY } from "@/lib/site-data/routeCopy";
import { COMPARE_PAGE_METADATA } from "@/lib/site-data/routeMetadata";

export const metadata = COMPARE_PAGE_METADATA;

type CompareItem = {
  productUrlKey: string;
  product: Product;
  categoryId: string;
};

function toText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function toList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean);
}

function parseItemKeys(rawItems: string | string[] | undefined): string[] {
  const joined = Array.isArray(rawItems) ? rawItems.join(",") : rawItems || "";
  return Array.from(
    new Set(
      joined
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ).slice(0, 4);
}

function resolveCategoryId(product: Product): string {
  return normalizeRequestedCategoryId(product.category_id) || "products";
}

async function resolveCompareItems(keys: string[]): Promise<CompareItem[]> {
  if (keys.length === 0) return [];

  const requestedKeys = new Set(keys.map((key) => key.toLowerCase()));
  const products = await getProducts();
  const productsBySlug = new Map(
    products
      .map((product) => [String(product.slug || "").trim().toLowerCase(), product] as const)
      .filter(([slug]) => requestedKeys.has(slug)),
  );

  return keys
    .map((key) => {
      const product = productsBySlug.get(key.toLowerCase());
      if (!product) return null;
      const categoryId = resolveCategoryId(product);
      return { productUrlKey: key, product, categoryId } satisfies CompareItem;
    })
    .filter((item): item is CompareItem => Boolean(item));
}

function specValue(item: CompareItem, key: string): string {
  const metadata =
    item.product.metadata && typeof item.product.metadata === "object"
      ? (item.product.metadata as Record<string, unknown>)
      : {};
  const specs =
    item.product.specs && typeof item.product.specs === "object" && !Array.isArray(item.product.specs)
      ? (item.product.specs as Record<string, unknown>)
      : {};

  if (key === "category") {
    return getCatalogCategoryLabel(item.categoryId, item.categoryId);
  }
  if (key === "series") {
    return item.product.series_name || "";
  }
  if (key === "dimensions") {
    return filterMeaningfulDimensionText(
      toText(specs.dimensions) || toText(specs.dimension) || "",
    );
  }
  if (key === "materials") {
    const specMaterials = filterMeaningfulMaterialList(toList(specs.materials));
    const metadataMaterials = filterMeaningfulMaterialList(
      Array.isArray(metadata.material) ? metadata.material.map((m) => String(m)) : [],
    );
    const materials = specMaterials.length > 0 ? specMaterials : metadataMaterials;
    return materials.length > 0 ? materials.slice(0, 3).join(", ") : "";
  }
  if (key === "warranty") {
    const warrantyYears =
      typeof metadata.warrantyYears === "number" ? metadata.warrantyYears : null;
    return warrantyYears ? `${warrantyYears}-Year warranty` : "";
  }
  if (key === "certification") {
    const certifications = toList(specs.certifications);
    if (certifications.length > 0) return certifications.slice(0, 3).join(", ");
    return metadata.bifmaCertified ? "BIFMA certified" : "";
  }
  if (key === "sustainability") {
    const score =
      typeof metadata.sustainabilityScore === "number"
        ? metadata.sustainabilityScore
        : typeof specs.sustainability_score === "number"
          ? specs.sustainability_score
          : null;
    return typeof score === "number" ? `Eco score ${score}/10` : "";
  }
  if (key === "features") {
    const features = toList(specs.features);
    return features.length > 0 ? features.slice(0, 3).join(", ") : "";
  }
  return "-";
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const keys = parseItemKeys(resolvedSearchParams.items);
  const items = await resolveCompareItems(keys);

  const allCompareRows = [
    { key: "category", label: "Category" },
    { key: "series", label: "Series" },
    { key: "dimensions", label: "Dimensions" },
    { key: "materials", label: "Materials" },
    { key: "warranty", label: "Warranty" },
    { key: "certification", label: "Certification" },
    { key: "sustainability", label: "Sustainability" },
    { key: "features", label: "Key features" },
  ] as const;

  const compareRows = allCompareRows.filter((row) =>
    row.key === "category" ||
    items.some((item) => specValue(item, row.key).trim().length > 0),
  );
  const firstItem = items[0];
  const backLabel = firstItem
    ? getCatalogCategoryLabel(firstItem.categoryId, firstItem.categoryId)
    : null;
  const backHref = firstItem ? `/products/${firstItem.categoryId}` : "/products";

  return (
    <HomeMarketingLayout>
      <div className="bg-[var(--surface-page)] pt-16">
        <section className="border-b border-[var(--border-soft)]">
          <div className="home-shell-xl grid gap-10 py-12 md:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <Link
                href={backHref}
                className="typ-body-sm mb-8 inline-flex items-center gap-1.5 text-muted transition-colors hover:text-strong"
              >
                ← Back to {backLabel ?? "Products"}
              </Link>
              <p className="typ-label text-[var(--color-bronze-500)]">
                {COMPARE_ROUTE_COPY.kicker}
              </p>
              <h1 className="home-heading mt-4 max-w-4xl !text-[clamp(2.35rem,5vw,4.25rem)]">
                Compare selected <span className="text-accent-italic">workspace options.</span>
              </h1>
              <p className="page-copy mt-6 max-w-3xl text-body">
                {COMPARE_ROUTE_COPY.description}
              </p>
            </div>

            <aside className="border border-[var(--border-soft)] bg-[var(--surface-inverse)] p-7 text-[var(--text-inverse)]">
              <p className="typ-label text-[var(--color-bronze-300)]">Selection status</p>
              <p className="mt-5 font-[family-name:var(--font-display)] text-5xl">
                {items.length}/4
              </p>
              <p className="page-copy-sm mt-3 text-[var(--text-inverse-body)]">
                {items.length > 0
                  ? COMPARE_ROUTE_COPY.mobileHint
                  : "Add products from category or product detail pages to build this workspace review."}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <TrackedLink href="/products" label={COMPARE_ROUTE_COPY.browseCta} surface="compare-page" className="btn-outline">
                  {COMPARE_ROUTE_COPY.browseCta}
                </TrackedLink>
                <TrackedLink href="/contact?intent=quote&source=compare" label={COMPARE_ROUTE_COPY.primaryCta} surface="compare-page" className="btn-primary">
                  {COMPARE_ROUTE_COPY.primaryCta}
                </TrackedLink>
              </div>
            </aside>
          </div>
        </section>

        <section className="py-12 md:py-18">
          <div className="home-shell-xl">
            {items.length > 0 ? (
              <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="typ-label text-[var(--color-bronze-500)]">Specification review</p>
                  <h2 className="home-heading mt-3">Read the shortlist side by side.</h2>
                </div>
                <span className="border border-[var(--border-soft)] px-4 py-2 text-sm text-body">
                  {COMPARE_ROUTE_COPY.countLabel.replace("{count}", String(items.length))}
                </span>
              </div>
            ) : null}

        {items.length === 0 ? (
          <div className="grid gap-8 border border-[var(--border-soft)] bg-[var(--surface-soft)] p-7 md:grid-cols-[0.9fr_1.1fr] md:p-10">
            <div>
              <p className="typ-label text-[var(--color-bronze-500)]">Empty shortlist</p>
              <h2 className="home-heading mt-3">{COMPARE_ROUTE_COPY.emptyTitle}</h2>
              <p className="page-copy-sm mt-5 max-w-2xl text-body">
                {COMPARE_ROUTE_COPY.emptyDescription}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <TrackedLink href="/products" label={COMPARE_ROUTE_COPY.emptyPrimaryCta} surface="compare-page-empty" className="btn-outline">
                  {COMPARE_ROUTE_COPY.emptyPrimaryCta}
                </TrackedLink>
                <TrackedLink href="/downloads" label={COMPARE_ROUTE_COPY.emptySecondaryCta} surface="compare-page-empty" className="btn-outline">
                  {COMPARE_ROUTE_COPY.emptySecondaryCta}
                </TrackedLink>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {["Select up to 4 products", "Review material and warranty signals", "Request quote with context"].map((item, index) => (
                <div key={item} className="border-t border-[var(--border-soft)] pt-4">
                  <span className="text-[var(--color-bronze-500)]">0{index + 1}</span>
                  <p className="page-copy-sm mt-3 text-body">{item}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto border border-[var(--border-soft)]">
            <table className="min-w-[47.5rem] w-full border-collapse bg-[var(--surface-page)]">
              <thead>
                <tr>
                  <th className="typ-cta w-56 border-b border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-4 text-left text-strong">
                    Specification
                  </th>
                  {items.map((item) => {
                    const image =
                      normalizeAssetPath(item.product.images?.[0]) ||
                      normalizeAssetPath(item.product.flagship_image) ||
                      "/images/fallback/category.svg";
                    const productHref = `/products/${item.categoryId}/${item.product.slug}`;
                    return (
                      <th
                        key={item.product.id}
                        className="border-b border-l border-[var(--border-soft)] px-4 py-4 text-left align-top"
                      >
                        <Link href={productHref} className="block">
                          <div className="relative mb-3 aspect-[4/3] overflow-hidden border border-[var(--border-soft)] bg-[var(--surface-soft)]">
                            <Image
                              src={image}
                              alt={item.product.name}
                              fill
                              sizes="(max-width: 1024px) 100vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                          <p className="typ-cta text-heading">{item.product.name}</p>
                        </Link>
                        <CompareColumnActions
                          productId={item.product.slug || item.product.id}
                          productName={item.product.name}
                          productHref={productHref}
                          image={image}
                          viewLabel={COMPARE_ROUTE_COPY.viewProductCta}
                          addLabel={COMPARE_ROUTE_COPY.addToQuoteCta}
                        />
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.key}>
                    <td className="typ-cta border-t border-[var(--border-soft)] bg-[var(--surface-soft)] px-4 py-3 text-strong">
                      {row.label}
                    </td>
                    {items.map((item) => (
                      <td
                        key={`${item.product.id}-${row.key}`}
                        className="typ-body-sm border-l border-t border-[var(--border-soft)] px-4 py-3 text-body"
                      >
                        {specValue(item, row.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
          </div>
        </section>
      </div>
    </HomeMarketingLayout>
  );
}
