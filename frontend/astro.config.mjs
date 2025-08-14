// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

export default defineConfig({
  publicDir: './public', // ✅ Asegúrate de que esto está definido
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@scripts': new URL('./public/scripts', import.meta.url).pathname // ⚠️ Cambiado de '../public/src/scripts' a 'public/scripts'
      }
    }
  },
  integrations: [icon()]
});