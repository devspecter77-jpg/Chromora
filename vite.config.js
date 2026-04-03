import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 4173,
    allowedHosts: ['chromora.onrender.com', 'localhost', '127.0.0.1']
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: 'all'
  }
})