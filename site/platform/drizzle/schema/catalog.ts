import { boolean, date, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/** Products Supabase — marketing catalog (canonical table name). */
export const catalogProducts = pgTable("catalog_products", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  category: text("category"),
  category_id: text("category_id"),
  performance_tier: text("performance_tier"),
  flagship_image: text("flagship_image"),
  description: text("description"),
  scene_images: text("scene_images").array(),
  variants: jsonb("variants"),
  detailed_info: jsonb("detailed_info"),
  metadata: jsonb("metadata"),
  specs: jsonb("specs"),
  series_id: text("series_id"),
  series_name: text("series_name"),
  created_at: timestamp("created_at", { withTimezone: true }),
  images: jsonb("images"),
  alt_text: text("alt_text"),
  model_3d: text("3d_model"),
  canonical_category_id: text("canonical_category_id"),
  canonical_series_id: text("canonical_series_id"),
  canonical_slug_v2: text("canonical_slug_v2"),
  canonical_subcategory_id: text("canonical_subcategory_id"),
  canonical_subcategory_label: text("canonical_subcategory_label"),
  normalized_name_key: text("normalized_name_key"),
});

export const catalogCategories = pgTable("catalog_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  canonical_id: text("canonical_id"),
});

export const catalogProductSpecs = pgTable("catalog_product_specs", {
  product_id: uuid("product_id").primaryKey(),
  specs: jsonb("specs").notNull(),
  source: text("source"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

export const catalogProductImages = pgTable("catalog_product_images", {
  id: uuid("id").primaryKey(),
  product_id: uuid("product_id").notNull(),
  image_url: text("image_url").notNull(),
  image_kind: text("image_kind"),
  variant_id: text("variant_id"),
  sort_order: integer("sort_order"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

export const catalogProductSlugAliases = pgTable("catalog_product_slug_aliases", {
  id: uuid("id").primaryKey(),
  alias_slug: text("alias_slug").notNull(),
  canonical_slug: text("canonical_slug").notNull(),
  reason: text("reason"),
  is_active: boolean("is_active"),
  created_at: timestamp("created_at", { withTimezone: true }),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

export const businessStatsCurrent = pgTable("business_stats_current", {
  id: uuid("id").primaryKey(),
  is_active: boolean("is_active").notNull(),
  projects_delivered: integer("projects_delivered").notNull(),
  client_organisations: integer("client_organisations").notNull(),
  sectors_served: integer("sectors_served").notNull(),
  locations_served: integer("locations_served").notNull(),
  years_experience: integer("years_experience").notNull(),
  as_of_date: date("as_of_date").notNull(),
  source_note: text("source_note"),
  updated_at: timestamp("updated_at", { withTimezone: true }),
  updated_by: text("updated_by"),
});
