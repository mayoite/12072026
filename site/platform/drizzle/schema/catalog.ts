import { boolean, date, integer, jsonb, pgTable, text, timestamp, uuid, index, uniqueIndex } from "drizzle-orm/pg-core";

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

/** Products Supabase — parametric catalog consumed by Planner. */
export const configuratorProducts = pgTable("configurator_products", {
  id: uuid("id").primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  family: text("family"),
  brand_name: text("brand_name"),
  sizing_type: text("sizing_type")
    .$type<"parametric" | "discrete" | "fixed">()
    .notNull(),
  workstation: jsonb("workstation"),
  size_options: jsonb("size_options").notNull(),
  default_footprint: jsonb("default_footprint"),
  derived_rules: jsonb("derived_rules"),
  materials: text("materials").array().notNull(),
  thumbnail_url: text("thumbnail_url"),
  model_3d_url: text("model_3d_url"),
  description: text("description"),
  active: boolean("active").notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull(),
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

// ─── Products DB (SVG revisions + artifacts) ────────────────────────────

/** Immutable SVG revision published via the pipeline. */
export const svgRevisions = pgTable(
  "svg_revisions",
  {
    revisionId: text("revision_id").primaryKey(),
    schemaVersion: integer("schema_version").notNull(),
    definitionTypeId: text("definition_type_id").notNull(),
    definitionVersion: integer("definition_version").notNull(),
    compilerVersion: text("compiler_version"),
    sourceRevision: integer("source_revision"),
    artifactChecksums: jsonb("artifact_checksums"),
    validation: jsonb("validation"),
    actorId: text("actor_id").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
    reason: text("reason"),
    slug: text("slug").notNull(),
    version: integer("version").notNull(),
    definition: jsonb("definition").notNull(),
    releasedProduct: jsonb("released_product"),
  },
  (table) => [
    index("svg_revisions_slug_idx").on(table.slug),
    uniqueIndex("svg_revisions_slug_version_idx").on(table.slug, table.version),
  ],
);

/** Artifact records (descriptor JSON + compiled SVG + generated PNG/thumbnail). */
export const svgRevisionArtifacts = pgTable(
  "svg_revision_artifacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    revisionId: text("revision_id")
      .notNull()
      .references(() => svgRevisions.revisionId, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    checksum: text("checksum").notNull(),
    storageKey: text("storage_key").notNull(),
    width: integer("width"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("svg_revision_artifacts_revision_id_idx").on(table.revisionId),
  ],
);

/** Live block descriptor (latest released descriptor per slug). */
export const blockDescriptors = pgTable(
  "block_descriptors",
  {
    slug: text("slug").primaryKey(),
    currentVersion: integer("current_version").notNull(),
    currentChecksum: text("current_checksum"),
    descriptor: jsonb("descriptor").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    updatedBy: text("updated_by"),
  },
);
