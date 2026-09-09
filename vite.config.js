import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The original project listed @vitejs/plugin-react as a dependency but never
// registered it, so React Fast Refresh never ran in dev. This wires it up and
// adds sane production build settings.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  server: { port: 5173, host: true }
});
