import { writeFileSync } from "node:fs";
import path from "node:path";

const root = process.argv[4];
if (!root) throw new Error("workspace root argument is required");

writeFileSync(path.join(root, "worker-started"), "started\n", "utf8");
setTimeout(() => {
  writeFileSync(path.join(root, "worker-survived"), "survived\n", "utf8");
}, 1_500);
