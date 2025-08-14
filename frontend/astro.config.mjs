// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  publicDir: './public',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@scripts': fileURLToPath(new URL('./public/scripts', import.meta.url))
      }
    }
  },
  integrations: [icon()]
});
