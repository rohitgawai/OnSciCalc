import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://onscicalc.com',
  trailingSlash: 'never',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'pt', 'hi', 'zh', 'ja', 'ar', 'ru'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  devToolbar: {
    enabled: false,
  },

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});