import { readFileSync, writeFileSync } from "node:fs";

import { persistBlockDescriptor } from "@/features/admin/svg-editor/persistBlockDescriptor";
import { publishDescriptorWithPipeline } from "@/features/admin/svg-editor/publishDescriptorWithPipeline";
import { runSvgPipeline } from "@/features/admin/svg-editor/svgPipelineRunner";

async function main(): Promise<void> {
  const [inputPath, resultPath, projectRoot, descriptorDir] = process.argv.slice(2);

  if (!inputPath || !resultPath || !projectRoot || !descriptorDir) {
    throw new Error("isolated publish worker requires input, result, root, and descriptor paths");
  }

  const input: unknown = JSON.parse(readFileSync(inputPath, "utf8"));
  const result = await publishDescriptorWithPipeline(input, {
    runPipeline: (descriptor, options) =>
      runSvgPipeline(descriptor, { ...options, projectRoot }),
    persist: (descriptor) =>
      persistBlockDescriptor(descriptor, { dir: descriptorDir }),
  });

  writeFileSync(resultPath, `${JSON.stringify(result)}\n`, "utf8");

  if (!result.success) {
    process.exitCode = 2;
  }
}

void main();
