import { resolve } from 'path'
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [preact()],
  base: (command === 'build' ? '/app/' : '/'),
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        en: resolve(__dirname, 'index.en.html'),
        fr: resolve(__dirname, 'index.fr.html'),
        offline: resolve(__dirname, 'offline.html'),
      },
    },
  },
}));
