import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const TEXT_EXTENSIONS = new Set([".css", ".html", ".js", ".json", ".map", ".mjs", ".svg"]);

async function collectFiles(root, directory = root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(root, absolute));
    else files.push(path.relative(root, absolute).replaceAll(path.sep, "/"));
  }
  return files.sort();
}

export async function assertPreparedRuntime(options = {}) {
  const runtimeRoot = options.runtimeRoot ?? path.join(path.dirname(fileURLToPath(import.meta.url)), "../public/vendor/svgedit");
  for (const relativePath of await collectFiles(runtimeRoot)) {
    if (!TEXT_EXTENSIONS.has(path.extname(relativePath))) continue;
    const source = await readFile(path.join(runtimeRoot, relativePath), "utf8");
    if (/(?:from\s*|import\s*)["']@\//.test(source)) {
      throw new Error(`Unresolved workspace import in prepared SVG-Edit runtime: ${relativePath}`);
    }
  }
}

export async function prepareSvgEditRuntime(options = {}) {
  const siteRoot = options.siteRoot ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const repoRoot = path.resolve(siteRoot, "..");
  const packageRoot = path.join(repoRoot, "node_modules/svgedit");
  const sourceRoot = path.join(packageRoot, "dist/editor");
  const runtimeRoot = path.join(siteRoot, "public/vendor/svgedit");
  await rm(runtimeRoot, { recursive: true, force: true });
  await mkdir(runtimeRoot, { recursive: true });
  await cp(sourceRoot, runtimeRoot, { recursive: true });
  await cp(path.join(packageRoot, "LICENSE-MIT.txt"), path.join(runtimeRoot, "LICENSE-MIT.txt"));
  await cp(path.join(packageRoot, "licenseInfo.json"), path.join(runtimeRoot, "licenseInfo.json"));
  await writeFile(path.join(runtimeRoot, ".gitignore"), "*\n!.gitignore\n", "utf8");
  await assertPreparedRuntime({ runtimeRoot });
  return { runtimeRoot, files: await collectFiles(runtimeRoot) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await prepareSvgEditRuntime();
}
