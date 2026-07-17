/**
 * Step 1 dual-write publish proof (owner env).
 *
 * 1. Upserts planner_managed_products row linked to a disk descriptor slug
 * 2. Publishes that descriptor with dual-write deps (DB + R2)
 * 3. Prints revision_id, pointer, artifact rows for Step 2 verification
 *
 * Usage (repo root):
 *   pnpm --filter oando-site exec tsx scripts/db_dual_write_publish_proof.ts
 *   pnpm --filter oando-site exec tsx scripts/db_dual_write_publish_proof.ts --slug=desk-linear-1600-001
 *
 * Does NOT set SVG_RELEASE_AUTHORITY=db.
 */
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import Module from "node:module";
import postgres from "postgres";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

/** Allow tsx CLI to load server-only Admin dual-write modules (not for Next client). */
const originalLoad = (Module as unknown as { _load: typeof Module.prototype.require })._load;
(Module as unknown as { _load: typeof Module.prototype.require })._load = function (
  request: string,
  parent: NodeModule,
  isMain: boolean,
) {
  if (request === "server-only") {
    return {};
  }
  return originalLoad(request, parent, isMain);
};

function argSlug(): string {
  const flag = process.argv.find((a) => a.startsWith("--slug="));
  if (flag) return flag.slice("--slug=".length).trim();
  return "desk-linear-1200-001";
}

async function main(): Promise<void> {
  const slug = argSlug();
  const productsUrl = process.env.PRODUCTS_DATABASE_URL?.trim();
  if (!productsUrl) {
    console.error("Missing PRODUCTS_DATABASE_URL");
    process.exit(1);
  }

  // Scripts run with cwd = site package (pnpm --filter oando-site exec).
  const packageRoot = process.cwd();
  const descriptorPath = path.join(
    packageRoot,
    "inventory",
    "descriptors",
    `${slug}.json`,
  );
  if (!existsSync(descriptorPath)) {
    console.error(`Descriptor missing: ${descriptorPath}`);
    process.exit(1);
  }

  const sql = postgres(productsUrl, { prepare: false, max: 1 });

  try {
    // Link managed product so pointer can be set (DB-SVG-05 full proof).
    const productSlug = `managed-${slug}`;
    const desc = JSON.parse(readFileSync(descriptorPath, "utf8")) as {
      slug: string;
      sku?: string;
      geometry?: { widthMm?: number; depthMm?: number; heightMm?: number };
    };
    const w = desc.geometry?.widthMm ?? 1200;
    const d = desc.geometry?.depthMm ?? 600;
    const h = desc.geometry?.heightMm ?? 750;

    await sql`
      insert into public.planner_managed_products (
        slug, planner_source_slug, name, description, category,
        category_id, category_name, series_id, series_name,
        price, flagship_image, images, specs, metadata, active
      ) values (
        ${productSlug},
        ${slug},
        ${`Proof link: ${slug}`},
        ${"Dual-write cutover proof product — links managed row to disk plan SVG slug."},
        ${"desk"},
        ${"oando-workstations"},
        ${"Workstations"},
        ${"plan-svg-proof"},
        ${"Plan SVG proof"},
        ${0},
        ${`/svg-catalog/${slug}.svg`},
        ${[`/svg-catalog/${slug}.svg`]}::text[],
        ${sql.json({ widthMm: w, depthMm: d, heightMm: h })},
        ${sql.json({ proof: "db_dual_write_publish_proof.ts" })},
        true
      )
      on conflict (slug) do update set
        planner_source_slug = excluded.planner_source_slug,
        name = excluded.name,
        flagship_image = excluded.flagship_image,
        images = excluded.images,
        specs = excluded.specs,
        metadata = excluded.metadata,
        active = true,
        updated_at = now()
    `;
    console.log(`Upserted managed product ${productSlug} → planner_source_slug=${slug}`);

    const { resolveSvgPublishDualWriteDeps } = await import(
      "../features/admin/svg-editor/publish/resolveSvgPublishDualWrite"
    );
    const dual = await resolveSvgPublishDualWriteDeps({ forceR2Probe: true });
    console.log("dual-write mode:", dual.mode);
    if (dual.mode !== "enabled" || !dual.dbRepository || !dual.artifactStore) {
      console.error(
        "Dual-write not enabled — cannot prove Step 1. Fix DB/R2/schema first.",
      );
      process.exit(1);
    }

    const { publishDescriptorWithPipeline } = await import(
      "../features/admin/svg-editor/publish/publishDescriptorWithPipeline"
    );

    const payload = JSON.parse(readFileSync(descriptorPath, "utf8"));
    const result = await publishDescriptorWithPipeline(payload, {
      dbRepository: dual.dbRepository,
      artifactStore: dual.artifactStore,
      actorId: "db-dual-write-publish-proof",
      reason: "Step 1 dual-write cutover proof (owner script)",
      // Force non-idempotent path if already published: still OK if idempotent pointer update
      readReleasedSnapshot: () => null,
    });

    if (!result.success) {
      console.error("Publish FAILED:", result.error);
      process.exit(1);
    }

    console.log(
      "Publish OK",
      result.idempotent ? "(idempotent pointer/revision)" : "(full write)",
    );

    const revisions = await sql`
      SELECT revision_id, slug, published_at
      FROM public.svg_revisions
      WHERE slug = ${slug}
      ORDER BY published_at DESC
      LIMIT 3
    `;
    console.log("svg_revisions:", revisions);

    const latest = revisions[0] as { revision_id: string } | undefined;
    if (latest?.revision_id) {
      const arts = await sql`
        SELECT kind, storage_key, left(checksum, 12) AS checksum_prefix
        FROM public.svg_revision_artifacts
        WHERE revision_id = ${latest.revision_id}
      `;
      console.log("artifacts:", arts);
    }

    const pointer = await sql`
      SELECT slug, planner_source_slug, published_svg_revision_id
      FROM public.planner_managed_products
      WHERE planner_source_slug = ${slug}
    `;
    console.log("product pointer:", pointer);

    const revId =
      (pointer[0] as { published_svg_revision_id?: string } | undefined)
        ?.published_svg_revision_id ?? latest?.revision_id;

    if (!revId) {
      console.error("FAIL: no revision id / pointer after publish");
      process.exit(1);
    }

    console.log("\n=== STEP 1 PASS ===");
    console.log(`revision_id=${revId}`);
    console.log(`slug=${slug}`);
    console.log("\n=== STEP 2 checks (run next) ===");
    console.log(`GET /api/planner/catalog/svg/${revId}`);
    console.log(`Expect svg-blocks previewImageUrl contains that revision id`);
    console.log(
      JSON.stringify({
        step1: "pass",
        slug,
        revisionId: revId,
        productSlug,
        apiPath: `/api/planner/catalog/svg/${revId}`,
      }),
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
