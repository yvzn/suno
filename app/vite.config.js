import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return ({
    plugins: [preact()],
    base: (command === 'build' ? env.VITE_APP_BASE : '/'),
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
  });
});
