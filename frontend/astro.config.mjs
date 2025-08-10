// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // Esto asigna el alias '~' a tu carpeta 'src'
        '~': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },

  integrations: [icon()]
});