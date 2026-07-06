import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/vendor/open3d-floorplan/embed/',
  publicDir: 'static',
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, 'src/lib'),
    },
  },
  build: {
    outDir: 'dist/embed',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'embed/index.html'),
      output: {
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      },
    },
  },
});
