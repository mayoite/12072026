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
  const indexPath = path.join(runtimeRoot, "index.html");
  const indexSource = await readFile(indexPath, "utf8");
  const exposedEditor = indexSource.replace(
    "const svgEditor = new Editor(document.getElementById('container'))",
    "const svgEditor = new Editor(document.getElementById('container'))\n  window.svgEditor = svgEditor",
  ).replace(
    "allowInitialUserOverride: true,",
    "allowInitialUserOverride: false,\n    noDefaultExtensions: true,\n    noStorageOnLoad: true,\n    avoidClientSide: true,\n    avoidClientSideOpen: true,\n    avoidClientSideDownload: true,",
  ).replace(
    "extensions: [],",
    "extensions: ['ext-connector', 'ext-eyedropper', 'ext-grid', 'ext-markers', 'ext-panning', 'ext-shapes', 'ext-polystar', 'ext-opensave', 'ext-layer_view'],",
  ).replace(
    "noDefaultExtensions: false,",
    "noDefaultExtensions: true,",
  ).replace("</body>", "<script type=\"module\" src=\"./host-bridge.js\"></script>\n</body>");
  await writeFile(indexPath, exposedEditor, "utf8");
  await writeFile(path.join(runtimeRoot, "host-bridge.js"), `
const VERSION = 1;
const send = (type, request, extra = {}) => parent.postMessage({
  version: VERSION, type: \`editor:\${type}\`, requestId: request.requestId,
  checksum: state.checksum, href: location.pathname, ...extra,
}, location.origin);
const state = { checksum: "" };
addEventListener("message", async (event) => {
  if (event.origin !== location.origin || event.source !== parent) return;
  const request = event.data;
  if (!request || request.version !== VERSION || typeof request.requestId !== "string") return;
  try {
    if (request.type === "host:load") {
      await window.svgEditor.loadFromString(request.svg, { noAlert: true });
      state.checksum = request.checksum;
      send("changed", request);
    } else if (request.type === "host:read") {
      send("document", request, { svg: window.svgEditor.svgCanvas.getSvgString() });
    } else if (request.type === "host:apply") {
      if (request.baseChecksum !== state.checksum) throw new Error("Stale checksum");
      await window.svgEditor.loadFromString(request.svg, { noAlert: true });
      state.checksum = request.checksum;
      send("changed", request);
    }
  } catch (error) {
    send("error", request, { message: error instanceof Error ? error.message : String(error) });
  }
});
const ready = async () => {
  if (!window.svgEditor) return setTimeout(ready, 25);
  await window.svgEditor.ready(() => undefined);
  send("ready", { requestId: crypto.randomUUID() });
};
ready();
`, "utf8");
  await writeFile(path.join(runtimeRoot, ".gitignore"), "*\n!.gitignore\n", "utf8");
  await assertPreparedRuntime({ runtimeRoot });
  return { runtimeRoot, files: await collectFiles(runtimeRoot) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await prepareSvgEditRuntime();
}
