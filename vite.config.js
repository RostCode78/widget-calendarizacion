import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'src',
  base: './', // Electron carga los archivos con file://
  plugins: [react()],
  build: { outDir: '../dist', emptyOutDir: true },
});
