/**
 * T-W3: Inventory direct site deps vs import/require/build usage under site/.
 * Pure Node walk (no rg binary required).
 * Usage: node scripts/audit-site-deps.mjs
 * Exit 0 always (report tool, not gate).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const siteDir = path.join(root, 'site');
const pkg = JSON.parse(fs.readFileSync(path.join(siteDir, 'package.json'), 'utf8'));

const deps = Object.keys(pkg.dependencies || {});
const devDeps = Object.keys(pkg.devDependencies || {});

const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  'coverage',
  'results',
  'test-results',
  'playwright-report',
  'dist',
  '.turbo',
  '.git',
]);

const CODE_EXT = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.mts',
  '.cts',
  '.json',
  '.css',
  '.scss',
  '.md',
  '.mdx',
  '.html',
  '.ps1',
  '.py',
]);

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    if (ent.name.startsWith('.') && ent.name !== '.env.example') {
      if (ent.isDirectory() && SKIP_DIRS.has(ent.name)) continue;
      // skip other dot dirs
      if (ent.isDirectory()) continue;
    }
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walk(full, out);
    } else {
      const ext = path.extname(ent.name).toLowerCase();
      if (!CODE_EXT.has(ext)) continue;
      // skip site/package.json itself for "import" counts (still note build role)
      out.push(full);
    }
  }
  return out;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function makeMatcher(name) {
  const re = escapeRegex(name);
  // import/require of package root or subpath; string refs in configs
  return new RegExp(
    `(?:from\\s+['"]${re}(?:/[^'"]*)?['"]|require\\(\\s*['"]${re}(?:/[^'"]*)?['"]\\s*\\)|import\\(\\s*['"]${re}(?:/[^'"]*)?['"]\\s*\\)|['"]${re}['"])`,
    'g',
  );
}

/** Only packages with a verified non-import role (peers, framework, intentional CDN). */
const BUILD_ROLE_HINTS = {
  next: 'framework',
  react: 'framework',
  'react-dom': 'framework',
  typescript: 'toolchain',
  eslint: 'toolchain',
  'eslint-config-next': 'toolchain',
  // Transitive of eslint-config-next; also direct for version pins / rules.
  '@next/eslint-plugin-next': 'eslint-config-next peer surface',
  '@eslint/js': 'toolchain',
  'eslint-plugin-jsx-a11y': 'eslint-config-next peer surface',
  'eslint-plugin-react': 'eslint-config-next peer surface',
  'eslint-plugin-react-hooks': 'eslint-config-next peer surface',
  'typescript-eslint': 'toolchain',
  vitest: 'toolchain',
  // Optional peers of vitest; scripts use --coverage and test:ui.
  '@vitest/coverage-v8': 'vitest coverage provider v8',
  '@vitest/ui': 'vitest --ui script',
  vite: 'toolchain (vitest)',
  postcss: 'Next/Tailwind pipeline peer',
  tailwindcss: 'build',
  '@tailwindcss/postcss': 'build',
  '@playwright/test': 'e2e',
  '@axe-core/playwright': 'e2e a11y',
  'drizzle-kit': 'db tooling',
  tsx: 'scripts runner',
  esbuild: 'package.json overrides',
  dotenv: 'scripts/env',
  'happy-dom': 'vitest environment',
  'ts-morph': 'codemods/docs scripts',
  '@types/node': 'types',
  '@types/react': 'types',
  '@types/react-dom': 'types',
  '@types/three': 'types',
  '@types/jsdom': 'types',
  'server-only': 'next server boundary marker',
  sharp: 'next image / scripts (native)',
  // Intentional non-import: loaded via self-hosted CDN script (SSR-safe).
  '@google/model-viewer': 'vendor CDN pin / custom element (no npm import)',
  // Peer of @testing-library/react + user-event (pnpm explicit peer).
  '@testing-library/dom': 'peer of testing-library',
};

/**
 * Known idle / no-import suspects (report as NO_IMPORT; do not auto-justify).
 * Owner may still keep for ad-hoc CLI.
 */
const KNOWN_IDLE = new Set([
  'fast-check',
  'whatwg-fetch',
  'lighthouse',
  'wrangler',
  'prettier',
  'prettier-plugin-tailwindcss',
  '@types/istanbul-lib-report',
  '@types/istanbul-reports',
]);

console.log('Walking site/ ...');
const files = walk(siteDir).filter((f) => {
  const rel = path.relative(siteDir, f).replace(/\\/g, '/');
  return rel !== 'package.json';
});
console.log(`Files scanned: ${files.length}`);

// Read all file contents once
const contents = new Map();
for (const f of files) {
  try {
    const text = fs.readFileSync(f, 'utf8');
    // skip huge binaries mislabeled
    if (text.length > 2_000_000) continue;
    contents.set(f, text);
  } catch {
    // ignore
  }
}

function scanPackage(name) {
  const matcher = makeMatcher(name);
  const hits = [];
  for (const [f, text] of contents) {
    matcher.lastIndex = 0;
    if (matcher.test(text)) {
      hits.push(path.relative(root, f).replace(/\\/g, '/'));
    }
  }
  return hits;
}

function classify(name, fileHits) {
  if (fileHits.length > 0) {
    return { status: 'USED', files: fileHits, role: 'import' };
  }
  const hint = BUILD_ROLE_HINTS[name];
  if (hint) {
    return { status: 'BUILD_ROLE', files: [], role: hint };
  }
  if (KNOWN_IDLE.has(name)) {
    return { status: 'NO_IMPORT', files: [], role: 'idle-candidate' };
  }
  return { status: 'NO_IMPORT', files: [], role: null };
}

const report = { dependencies: [], devDependencies: [] };

for (const d of deps) {
  const filesHits = scanPackage(d);
  report.dependencies.push({ name: d, ...classify(d, filesHits) });
}
for (const d of devDeps) {
  const filesHits = scanPackage(d);
  report.devDependencies.push({ name: d, ...classify(d, filesHits) });
}

function printSection(title, rows) {
  console.log(`\n=== ${title} ===`);
  for (const r of rows) {
    const n = r.files.length;
    const sample =
      n === 0
        ? ''
        : n <= 2
          ? `  ${r.files.join(', ')}`
          : `  ${r.files.slice(0, 2).join(', ')} (+${n - 2})`;
    const role = r.role ? ` role=${r.role}` : '';
    console.log(`${r.status.padEnd(12)} ${r.name}${role}${sample}`);
  }
}

printSection('dependencies', report.dependencies);
printSection('devDependencies', report.devDependencies);

const noImport = [
  ...report.dependencies.filter((r) => r.status === 'NO_IMPORT'),
  ...report.devDependencies.filter((r) => r.status === 'NO_IMPORT'),
];
const buildOnly = [
  ...report.dependencies.filter((r) => r.status === 'BUILD_ROLE'),
  ...report.devDependencies.filter((r) => r.status === 'BUILD_ROLE'),
];

console.log('\n=== SUMMARY ===');
console.log(`deps total: ${deps.length}`);
console.log(`devDeps total: ${devDeps.length}`);
console.log(`NO_IMPORT candidates: ${noImport.length}`);
console.log(noImport.map((r) => r.name).join(', ') || '(none)');
console.log(`BUILD_ROLE (no file hit but expected): ${buildOnly.length}`);
console.log(buildOnly.map((r) => r.name).join(', ') || '(none)');

const outPath = path.join(root, 'results', 'tooling', 'site-dep-audit.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(
  outPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      filesScanned: files.length,
      dependencies: report.dependencies.map((r) => ({
        name: r.name,
        status: r.status,
        role: r.role,
        fileCount: r.files.length,
        sampleFiles: r.files.slice(0, 10),
      })),
      devDependencies: report.devDependencies.map((r) => ({
        name: r.name,
        status: r.status,
        role: r.role,
        fileCount: r.files.length,
        sampleFiles: r.files.slice(0, 10),
      })),
    },
    null,
    2,
  ),
);
console.log(`\nWrote ${path.relative(root, outPath)}`);
