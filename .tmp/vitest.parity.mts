import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  resolve: { alias: { "@": path.resolve("E:/12072026/site") } },
  test: {
    include: ["E:/12072026/site/tests/unit/features/planner/3d/parity.test.ts"],
    exclude: ["**/node_modules/**"],
    environment: "node",
  },
});
