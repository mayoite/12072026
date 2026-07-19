"use server";

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { revalidatePath } from "next/cache";
import { resolveAuthContext } from "@/features/shared/api/withAuth";
import { DEV_BYPASS_USER } from "@/lib/auth/devAuthBypass";
import { publishDescriptorWithPipeline, type PublishDescriptorResult } from "@/features/admin/svg-editor/publish/publishDescriptorWithPipeline";
import { resolveSvgPublishDualWriteDeps } from "@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite";
import { resolvePublishedSvgPath } from "@/features/admin/svg-editor/publish/svgPipelineRunner";
import { setCatalogLifecycle } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import { persistBlockDescriptor } from "@/features/admin/svg-editor/storage/persistBlockDescriptor";
import { tryLoad } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { normalizeDescriptorForPipeline } from "@/features/planner/asset-engine/svg/normalizeDescriptorForPipeline";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import { compileParametricProductSvg } from "./compileParametricProductSvg";
import { PARAMETRIC_PUBLISH_REGISTRY } from "./parametricPublishRegistry.server";
import { resolveParametricFactoryE2eRoot } from "./parametricFactoryE2eRoot.server";

export async function publishParametricProductAction(raw: unknown): Promise<PublishDescriptorResult> {
  let actorId = DEV_BYPASS_USER.id;
  try { const auth = await resolveAuthContext("admin"); actorId = auth.user?.id ?? actorId; } catch { return { success: false, error: "Admin access required" }; }
  const compiled = compileParametricProductSvg(raw);
  if (!compiled.ok) return { success: false, error: compiled.error };
  const adapter = PARAMETRIC_PUBLISH_REGISTRY.require(compiled.type);
  const runtime = resolveParametricFactoryE2eRoot();
  const identity = adapter.buildDescriptor(compiled.fields, compiled.preview);
  const loaded = tryLoad(identity.slug, runtime ? { dir: runtime.descriptorDir } : undefined);
  const releasedSvgPath = runtime
    ? runtime.svgPath(identity.slug)
    : resolvePublishedSvgPath(identity.slug);
  if (loaded.ok && !existsSync(releasedSvgPath)) {
    return {
      success: false,
      error: "Existing descriptor has no released SVG. Repair the catalog artifact before republishing.",
    };
  }
  if (loaded.ok && readFileSync(releasedSvgPath, "utf8") !== compiled.svg) {
    return {
      success: false,
      error: "Slug already belongs to a different exact configuration. Change the SKU and slug before publishing.",
    };
  }
  const existing = loaded.ok ? { id: loaded.value.id, generatedAt: loaded.value.generatedAt } : null;
  const descriptor = adapter.buildDescriptor(compiled.fields, compiled.preview, existing);
  const compileSvg = async (desc: BlockDescriptor) => ({ ok: true as const, stages: ["parametric-draw", "sanitise"], normalized: normalizeDescriptorForPipeline(desc), svg: compiled.svg });
  const isolatedDeps = runtime ? {
    persist: (input: unknown) => persistBlockDescriptor(input, { dir: runtime.descriptorDir, writeArchive: false }),
    readReleasedSnapshot: () => null,
    runPipeline: async (desc: BlockDescriptor, options?: { precompiledSvg?: string }) => {
      const svgPath = runtime.svgPath(desc.slug);
      mkdirSync(runtime.svgDir, { recursive: true });
      const previous = existsSync(svgPath) ? readFileSync(svgPath) : null;
      writeFileSync(svgPath, options?.precompiledSvg ?? compiled.svg, "utf8");
      return { ok: true as const, exitCode: 0, stdout: "", stderr: "", fixturePath: runtime.descriptorPath(desc.slug), svgPath, durationMs: 0, rollback: () => { if (previous) writeFileSync(svgPath, previous); else rmSync(svgPath, { force: true }); }, commit: () => undefined, cleanup: () => undefined };
    },
  } : {};
  const dualWrite = runtime ? null : await resolveSvgPublishDualWriteDeps();
  const result = await publishDescriptorWithPipeline(descriptor, { compileSvg, actorId, reason: `parametric-${compiled.type}`, ...isolatedDeps, ...(dualWrite?.mode === "enabled" ? { dbRepository: dualWrite.dbRepository, artifactStore: dualWrite.artifactStore } : {}) });
  if (result.success) {
    setCatalogLifecycle(result.descriptor.slug, adapter.lifecycle, runtime?.lifecycleDir);
    revalidatePath("/admin/svg-editor");
    revalidatePath("/planner/guest");
  }
  return result;
}
