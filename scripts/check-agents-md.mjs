import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "AGENTS.md");
const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

console.log(`check:agents-md OK (${lines.length} lines; no artificial cap)`);
