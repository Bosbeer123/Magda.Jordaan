// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Change `site` once the domain is registered (see docs/SETUP.md, step 5).
export default defineConfig({
  site: 'https://magdajordaan.co.za',
  integrations: [react(), sitemap()],
  trailingSlash: 'never',
  build: { format: 'file' },
});
