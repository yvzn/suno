import { resolve } from 'path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    build: {
        rollupOptions: {
            input: {
                en: resolve(__dirname, 'index.en.html'),
                fr: resolve(__dirname, 'index.fr.html'),
            },
        },
    },
});
