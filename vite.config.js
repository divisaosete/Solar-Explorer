import { defineConfig } from 'vite';
export default defineConfig({
  root: 'web',
  // Compatível com subpastas do Live Server e do GitHub Pages.
  base: './',
  build: { outDir: '../dist', emptyOutDir: true },
});
