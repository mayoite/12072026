/**
 * Critic-driven: re-publish oando-linear-desk-1600 as Maker multipath + dual-write.
 * Run: pnpm --filter oando-site exec tsx scripts/critic-multipath-republish.ts
 */
import { createRequire } from "node:module";
import Module from "node:module";

const require = createRequire(import.meta.url);
require("./loadEnvLocal.cjs").loadEnvLocal();

const originalLoad = (
  Module as unknown as { _load: typeof Module.prototype.require }
)._load;
(Module as unknown as { _load: typeof Module.prototype.require })._load =
  function (request: string, parent: NodeModule, isMain: boolean) {
    if (request === "server-only") return {};
    return originalLoad(request, parent, isMain);
  };

async function main(): Promise<void> {
  const { compileLinearDeskSvg } = await import(
    "../features/admin/svg-editor/parametric/compileLinearDeskSvg"
  );
  const { buildLinearDeskPublishDescriptor } = await import(
    "../features/admin/svg-editor/parametric/linearDeskPublishDescriptor"
  );
  const { ensureGuestVisibleSlug } = await import(
    "../features/admin/svg-editor/parametric/linearDeskGuestIdentity"
  );
  const { tryLoad } = await import(
    "../features/planner/catalog/svg/svgBlockDescriptorLoader"
  );
  const { resolveSvgPublishDualWriteDeps } = await import(
    "../features/admin/svg-editor/publish/resolveSvgPublishDualWrite"
  );
  const { publishDescriptorWithPipeline } = await import(
    "../features/admin/svg-editor/publish/publishDescriptorWithPipeline"
  );
  const { setCatalogLifecycle } = await import(
    "../features/admin/svg-editor/lifecycle/catalogLifecycle"
  );
  const { normalizeDescriptorForPipeline } = await import(
    "../features/planner/asset-engine/svg/normalizeDescriptorForPipeline"
  );

  const raw = {
    type: "linear-desk",
    widthMm: 1600,
    depthMm: 800,
    heightMm: 750,
    topThicknessMm: 40,
    pedestalWidthMm: 400,
    pedestalInsetMm: 50,
    pedestalTopGapMm: 0,
    pedestalBackInsetMm: 0,
    pedestalCount: 2,
    modesty: false,
    seriesId: "linear",
    name: "Linear Desk 1600",
    sku: "OANDO-LINEAR-DSK-1600",
    slug: "oando-linear-desk-1600",
  };

  const compiled = compileLinearDeskSvg(raw);
  if (!compiled.ok) {
    console.error("compile fail", compiled.error);
    process.exit(1);
  }
  const { fields, svg } = compiled;
  console.log(
    JSON.stringify({
      multipath: {
        deskTop: svg.includes("desk-top"),
        pedestalL: svg.includes("pedestal-l"),
        pedestalR: svg.includes("pedestal-r"),
        len: svg.length,
      },
    }),
  );
  if (
    !svg.includes("desk-top") ||
    !svg.includes("pedestal-l") ||
    !svg.includes("pedestal-r")
  ) {
    console.error("Maker output missing multipath ids");
    process.exit(1);
  }

  const guestSlug = ensureGuestVisibleSlug(fields.slug, fields.widthMm);
  const loaded = tryLoad(guestSlug);
  const existing =
    loaded.ok && typeof loaded.value.id === "string"
      ? {
          id: loaded.value.id,
          ...(typeof loaded.value.generatedAt === "number"
            ? { generatedAt: loaded.value.generatedAt }
            : {}),
        }
      : null;

  const descriptor = buildLinearDeskPublishDescriptor(fields, existing);
  const dual = await resolveSvgPublishDualWriteDeps({ forceR2Probe: true });
  console.log("dual-write mode:", dual.mode);
  if (dual.mode !== "enabled" || !dual.dbRepository || !dual.artifactStore) {
    console.error("dual-write not enabled");
    process.exit(1);
  }

  const result = await publishDescriptorWithPipeline(descriptor, {
    compileSvg: async (desc) => ({
      ok: true as const,
      stages: ["parametric-draw", "sanitise"],
      normalized: normalizeDescriptorForPipeline(desc),
      svg,
    }),
    dbRepository: dual.dbRepository,
    artifactStore: dual.artifactStore,
    actorId: "critic-multipath-republish",
    reason: "critic-perfect-c4 multipath re-publish",
    readReleasedSnapshot: () => null,
  });

  if (!result.success) {
    console.error("publish fail", result.error);
    process.exit(1);
  }

  setCatalogLifecycle(result.descriptor.slug, "live");
  console.log(
    JSON.stringify({
      ok: true,
      slug: result.descriptor.slug,
      sku: result.descriptor.sku,
    }),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
