import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // ✅ Ensure correct build output directory
  },
  server: {
    watch: {
      usePolling: true,
    },
    host:"0.0.0.0",
    port:5173
  },
});
