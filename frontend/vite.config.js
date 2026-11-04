import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://stockflow-inventory-management-1zx4.onrender.com/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

