// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@scripts': new URL('./src/scripts', import.meta.url).pathname // ✅ Añade esto
      }
    }
  },
  integrations: [icon()]
});