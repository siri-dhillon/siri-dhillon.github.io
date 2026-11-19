/**
 * Base-path aware URL helpers. Always build internal links through `href()` so
 * the site works at "/" (custom domain, Vercel, S3) or under a sub-path
 * (e.g. GitHub project pages) without code changes.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Internal page/asset URL respecting the configured base path. External URLs pass through. */
export function href(path = '/'): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}` || '/';
}

/** Absolute URL (for canonical / Open Graph). */
export function absolute(path: string, site: URL | undefined): string {
  if (/^https?:/.test(path)) return path;
  return new URL(href(path), site).toString();
}
