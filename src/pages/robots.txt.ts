import type { APIRoute } from 'astro';
import { site } from '../config/site';

// While the site is a test version, keep search engines out. On launch, flip site.launched to true.
export const GET: APIRoute = ({ site: base }) => {
  const body = site.launched
    ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', base)}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'content-type': 'text/plain' } });
};
