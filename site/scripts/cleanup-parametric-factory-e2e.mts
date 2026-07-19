import {
  cleanupParametricFactoryE2eRoot,
  resolveParametricFactoryE2eRoot,
} from "../features/admin/svg-editor/parametric/parametricFactoryE2eRoot.server";

const root = resolveParametricFactoryE2eRoot();
if (!root) throw new Error("Parametric factory E2E runtime is not configured");
cleanupParametricFactoryE2eRoot(root);
