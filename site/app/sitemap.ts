import type { MetadataRoute } from "next";
import { getCatalog } from '@/lib/catalog/site/getProducts';
import { buildRequestedCategoryCatalog } from '@/lib/catalog/site/categories';
import {
  PLANNER_MARKETING_SITEMAP_PATHS,
  PUBLIC_INDEXABLE_STATIC_PATHS,
  SOLUTION_CATEGORY_SITEMAP_PATHS,
} from "@/features/site/data/routeClassification";
import { SITE_URL } from "@/lib/siteUrl";

const BASE_URL = SITE_URL.replace(/\/+$/, "");

function sitemapUrl(path: string): string {
  if (path === "/") return `${BASE_URL}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${normalized.replace(/\/+$/, "")}/`;
}

const STATIC_SITEMAP_PATHS = [
  ...PUBLIC_INDEXABLE_STATIC_PATHS,
  ...PLANNER_MARKETING_SITEMAP_PATHS,
  ...SOLUTION_CATEGORY_SITEMAP_PATHS,
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_SITEMAP_PATHS.map((path) => ({
    url: sitemapUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.startsWith("/planner") ? 0.8 : 0.7,
  }));

  try {
    const catalog = buildRequestedCategoryCatalog(await getCatalog());
    for (const category of catalog) {
      entries.push({
        url: sitemapUrl(`/products/${category.id}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });

      for (const series of category.series) {
        for (const product of series.products) {
          const slug = product.slug || product.id;
          entries.push({
            url: sitemapUrl(`/products/${category.id}/${slug}`),
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
          });
        }
      }
    }
  } catch {
    // Keep static sitemap if catalog fetch fails.
  }

  return entries;
}