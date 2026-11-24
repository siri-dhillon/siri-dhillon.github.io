import { getCollection, type CollectionEntry } from 'astro:content';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export type Project = CollectionEntry<'projects'>;

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => byOrder(a, b) || b.data.year - a.data.year);
}

export async function getFeaturedProjects() {
  return (await getProjects()).filter((p) => p.data.featured);
}

export async function getServices() {
  return (await getCollection('services')).sort(byOrder);
}

export async function getExperience() {
  return (await getCollection('experience')).sort(byOrder);
}

/**
 * Links that may only be shown for non-confidential projects.
 * Confidential projects never expose repo/demo links or cover images,
 * which could identify the client.
 */
export function publicDetails(p: Project): {
  links: { repo?: string; demo?: string };
  cover?: string;
  coverAlt?: string;
} {
  if (p.data.confidential) return { links: {} };
  return { links: p.data.links ?? {}, cover: p.data.cover, coverAlt: p.data.coverAlt };
}

/** True if a site-relative file exists in /public (used to hide links to files not uploaded yet). */
export function publicFileExists(path: string): boolean {
  if (!path) return false;
  if (/^https?:/.test(path)) return true;
  return existsSync(join(process.cwd(), 'public', path));
}

const yearMonth = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });
export function formatYearMonth(ym: string): string {
  if (ym === 'present') return 'Present';
  const [y, m] = ym.split('-').map(Number);
  return yearMonth.format(Date.UTC(y, m - 1));
}
