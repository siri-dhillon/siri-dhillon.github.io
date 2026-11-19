// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Host-agnostic deploy settings.
 *
 * SITE_URL  – absolute origin the site is served from (used for canonical URLs,
 *             Open Graph tags and the sitemap). e.g. https://sirpreetdhillon.com
 * BASE_PATH – sub-path the site lives under. "/" for a root domain; "/repo" for a
 *             GitHub project page served at user.github.io/repo.
 *
 * Every host (GitHub Pages, Vercel, S3 + CloudFront, Netlify…) just sets these
 * two environment variables at build time. Nothing in the code is host-specific.
 */
const SITE_URL = process.env.SITE_URL || 'https://siri-dhillon.github.io';
const BASE_PATH = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
