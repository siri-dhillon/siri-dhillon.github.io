/**
 * Sätteri hast plugin for case-study Markdown (Astro's default Markdown processor).
 *
 * 1. Demotes headings one level: the body renders under the page's
 *    "Deep dive" <h2>, so authored `##` must become <h3> to keep the outline valid.
 * 2. Adds intrinsic width/height (read from the file in /public), plus
 *    loading="lazy" and decoding="async", to local images to prevent layout shift.
 */
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

/** Display size of an image in /public (EXIF rotation applied), or undefined if missing. */
export async function publicImageSize(src) {
  if (!src || !src.startsWith('/') || src.startsWith('//')) return undefined;
  const file = join(process.cwd(), 'public', decodeURI(src.split(/[?#]/)[0]));
  if (!existsSync(file)) return undefined;
  const meta = await sharp(file).metadata();
  const { width, height } = meta.autoOrient ?? meta;
  return width && height ? { width, height } : undefined;
}

/** @type {import('satteri').HastPluginDefinition} */
export const caseStudyHast = {
  name: 'case-study',
  element: [
    {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5'],
      visit(node, ctx) {
        ctx.setField(node, 'tagName', `h${Number(node.tagName[1]) + 1}`);
      },
    },
    {
      filter: ['img'],
      async visit(node, ctx) {
        const p = node.properties ?? {};
        if (p.loading == null) ctx.setProperty(node, 'loading', 'lazy');
        if (p.decoding == null) ctx.setProperty(node, 'decoding', 'async');
        if (p.width && p.height) return;
        const size = await publicImageSize(String(p.src ?? ''));
        if (size) {
          ctx.setProperty(node, 'width', size.width);
          ctx.setProperty(node, 'height', size.height);
        }
      },
    },
  ],
};
