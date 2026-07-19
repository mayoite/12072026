import "server-only";

import { tryLoad } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { resolveParametricFactoryE2eRoot } from "./parametricFactoryE2eRoot.server";
import {
  deskAssemblyFieldsFromDescriptor,
  deskAssemblyFieldsToDisplay,
} from "./deskAssemblyHydration";
import type { DeskAssemblyDisplay } from "./deskAssemblyAuthoringDefinition";

/** Server load for Product Studio ?edit=<slug>. */
export function loadDeskAssemblyDisplayForEdit(
  slug: string,
): DeskAssemblyDisplay | null {
  const runtime = resolveParametricFactoryE2eRoot();
  const loaded = tryLoad(slug, runtime ? { dir: runtime.descriptorDir } : undefined);
  if (!loaded.ok) return null;
  const fields = deskAssemblyFieldsFromDescriptor(loaded.value);
  if (!fields) return null;
  return deskAssemblyFieldsToDisplay(fields, "cm");
}
