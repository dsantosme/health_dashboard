import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// SINGLE=1 gera tudo em um arquivo so (CSS, JS e imagens em data URI), para
// abrir o app direto de um .html — sem servidor, sem rede.
declare const process: { env: Record<string, string | undefined> }
const unico = process.env.SINGLE === '1'

// base relativo para funcionar em GitHub Pages ou em qualquer subpasta
export default defineConfig({
  plugins: [react()],
  base: './',
  define: { 'import.meta.env.VITE_SINGLE': JSON.stringify(unico) },
  build: {
    outDir: unico ? 'dist-single' : 'dist',
    cssCodeSplit: !unico,
    assetsInlineLimit: unico ? 100_000_000 : 4096,
    rollupOptions: unico ? { output: { inlineDynamicImports: true } } : {},
  },
})
