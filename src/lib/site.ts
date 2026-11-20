/**
 * Loads and validates src/data/site.json. An invalid file fails the build.
 */
import raw from '@/data/site.json';
import { z } from 'astro/zod';

const maybeUrl = z.union([z.url(), z.literal('')]).default('');

const siteSchema = z.object({
  name: z.string().min(1),
  monogram: z.string().min(1).max(3),
  headline: z.string().min(1),
  intro: z.string().min(1),
  location: z.string().default(''),
  availability: z.string().default(''),
  bio: z.array(z.string()).min(1),
  photo: z.string().default(''),
  photoAlt: z.string().default(''),
  email: z.union([z.email(), z.literal('')]).default(''),
  resumeUrl: z.string().default(''),
  bookingUrl: maybeUrl,
  socials: z.object({
    github: maybeUrl,
    linkedin: maybeUrl,
    huggingface: maybeUrl,
  }),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(200),
    ogImage: z.string().min(1),
  }),
  currentWork: z.object({
    /** false hides the whole Current work section (content is kept). */
    enabled: z.boolean().default(true),
    eyebrow: z.string(),
    title: z.string().min(1),
    summary: z.string().min(1),
    points: z.array(z.string()),
    stack: z.array(z.string()),
    status: z.string().default(''),
  }),
  resume: z
    .object({ title: z.string().min(1), summary: z.string().min(1) })
    .optional(),
  skills: z.array(z.object({ group: z.string(), items: z.array(z.string()) })),
  certifications: z
    .array(
      z.object({
        name: z.string().min(1),
        issuer: z.string().min(1),
        issued: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use YYYY-MM'),
        expires: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use YYYY-MM').optional(),
      }),
    )
    .default([]),
  contact: z.object({
    heading: z.string(),
    intro: z.string(),
    form: z.object({
      provider: z.enum(['formspree', 'web3forms', 'getform', 'custom']),
      endpoint: z.url(),
      accessKey: z.string().optional(),
      honeypotField: z.string().default('_gotcha'),
      projectTypes: z.array(z.string()).min(1),
      budgets: z.array(z.string()).min(1),
      timelines: z.array(z.string()).min(1),
    }),
  }),
});

export type Site = z.infer<typeof siteSchema>;

const parsed = siteSchema.safeParse(raw);
if (!parsed.success) {
  throw new Error(`src/data/site.json is invalid:\n${z.prettifyError(parsed.error)}`);
}
export const site: Site = parsed.data;
