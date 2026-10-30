// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// The site's own address. On Netlify, URL is set automatically (the netlify.app address, or the custom domain once
// it's added), so canonical links and the sitemap follow whatever address the site is served from.
export default defineConfig({
  site: process.env.URL ?? 'http://localhost:4321',
  integrations: [react(), sitemap()],
  trailingSlash: 'never',
  build: { format: 'file' },
});
