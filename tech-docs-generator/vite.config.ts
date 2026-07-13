import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { getStagingSiteOutputRoot } from './scripts/output-contract.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

export default defineConfig({
  cacheDir: path.resolve(repoRoot, '.tmp', 'tech-docs', 'vite-cache'),
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // Allow dev server to serve files from site/app/css/ (parent dir)
      allow: [repoRoot],
    },
  },
  build: {
    // Repo root (not site/) — see AGENTS.md layout
    // Contract: ../.tmp/generated-documents/site
    outDir: getStagingSiteOutputRoot(repoRoot),
    emptyOutDir: true,
  },
  base: './',
})
