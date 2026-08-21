import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativo para funcionar em GitHub Pages ou em qualquer subpasta
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist' },
})
