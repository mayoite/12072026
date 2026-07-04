import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // Allow dev server to serve files from site/app/css/ (parent dir)
      allow: [path.resolve(__dirname, '../..')],
    },
  },
  build: {
    outDir: '../tech-stack-docs',
    emptyOutDir: true,
  },
  base: '/tech-stack-docs/',
})
