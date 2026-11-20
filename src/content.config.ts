/**
 * Content "database" schemas.
 *
 * Every Markdown file under src/content/** is validated against these Zod
 * schemas at build time. A missing required field or a wrong type fails
 * `npm run build` (and therefore the deploy) with a message pointing at the file.
 *
 * If you add/rename a field here, mirror it in .pages.yml (CMS form) and
 * scripts/new-project.mjs (CLI prompt).
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const PROJECT_CATEGORIES = [
  'AI/LLM',
  'Full-stack',
  'Data',
  'Cloud/Architecture',
  'Systems/Edge',
] as const;

const nonEmpty = (label: string) => z.string().trim().min(1, `${label} is required`);

/** Paths to files in /public (start with "/") or absolute http(s) URLs. */
const assetPath = z
  .string()
  .trim()
  .refine((v) => v.startsWith('/') || /^https?:\/\//.test(v), {
    message: 'Must start with "/" (a file in /public) or be a full https:// URL',
  });

const optionalUrl = z
  .union([z.url(), z.literal('')])
  .optional()
  .transform((v) => (v ? v : undefined));

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z
    .object({
      title: nonEmpty('title'),
      slug: z
        .string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase-kebab-case, e.g. "rag-knowledge-assistant"'),
      summary: nonEmpty('summary').max(160, 'summary should be one line (≤160 chars)'),
      industry: nonEmpty('industry'),
      category: z.enum(PROJECT_CATEGORIES),
      year: z.number().int().min(2000).max(2100),
      role: nonEmpty('role'),
      problem: nonEmpty('problem'),
      solution: nonEmpty('solution'),
      stack: z.array(z.string().trim().min(1)).min(1, 'stack needs at least one item'),
      outcome: nonEmpty('outcome'),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      cover: z
        .union([assetPath, z.literal('')])
        .optional()
        .transform((v) => (v ? v : undefined)),
      coverAlt: z.string().optional(),
      links: z
        .object({ repo: optionalUrl, demo: optionalUrl })
        .optional()
        .default({ repo: undefined, demo: undefined }),
      confidential: z.boolean().default(false),
      /** Bullets for the generated resume (npm run resume). Empty = not on the resume. */
      resumeBullets: z.array(z.string().trim().min(1)).default([]),
      draft: z.boolean().default(false),
    })
    .refine((p) => !p.cover || (p.coverAlt && p.coverAlt.trim().length > 0), {
      message: 'coverAlt (alt text) is required when a cover image is set',
      path: ['coverAlt'],
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/services' }),
  schema: z.object({
    title: nonEmpty('title'),
    icon: z.enum(['sparkles', 'code', 'chart', 'cloud', 'chip']),
    summary: nonEmpty('summary'),
    deliverables: z.array(z.string()).min(1),
    order: z.number().default(100),
  }),
});

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use YYYY-MM, e.g. 2019-03');

const experience = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/experience' }),
  schema: z.object({
    role: nonEmpty('role'),
    org: nonEmpty('org'),
    location: z.string().optional(),
    start: yearMonth,
    end: z.union([yearMonth, z.literal('present')]),
    summary: nonEmpty('summary'),
    highlights: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    order: z.number().default(100),
  }),
});

export const collections = { projects, services, experience };
