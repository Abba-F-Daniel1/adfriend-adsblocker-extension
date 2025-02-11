import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.tsx')
      },
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        extend: true,
        inlineDynamicImports: false
      }
    },
    outDir: 'dist',
    sourcemap: true,
    copyPublicDir: true
  },
  publicDir: resolve(__dirname, 'src'),
  server: {
    port: 3000,
    strictPort: true
  }
})