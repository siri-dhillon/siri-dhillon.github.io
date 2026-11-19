#!/usr/bin/env node
/**
 * Interactive generator for a new project case study.
 *
 *   npm run new-project
 *
 * Prompts for every field in the `projects` schema (src/content.config.ts),
 * writes src/content/projects/<slug>.md, then runs `astro sync` to validate it.
 */
import { createInterface } from 'node:readline';
import { existsSync, writeFileSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CATEGORIES = ['AI/LLM', 'Full-stack', 'Data', 'Cloud/Architecture', 'Systems/Edge'];

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: process.stdin.isTTY });
const lines = rl[Symbol.asyncIterator]();
const bold = (s) => (process.stdout.isTTY ? `\x1b[1m${s}\x1b[0m` : s);
const dim = (s) => (process.stdout.isTTY ? `\x1b[2m${s}\x1b[0m` : s);

async function ask(label, { required = true, def, validate, hint } = {}) {
  for (;;) {
    const suffix = def !== undefined && def !== '' ? dim(` (${def})`) : '';
    process.stdout.write(`${bold(label)}${hint ? dim(` — ${hint}`) : ''}${suffix}: `);
    const { value, done } = await lines.next();
    if (done) { console.log('\nAborted (input closed).'); process.exit(1); }
    const v = (value ?? '').trim() || (def ?? '');
    if (!v && required) { console.log('  ↳ required'); continue; }
    const err = validate?.(v);
    if (err) { console.log(`  ↳ ${err}`); continue; }
    return v;
  }
}
const yesNo = async (label, def) => /^y/i.test(await ask(label, { def: def ? 'y' : 'n', validate: (v) => (/^(y|n|yes|no)$/i.test(v) ? null : 'answer y or n') }));
const slugify = (s) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
const isUrl = (v) => { try { const u = new URL(v); return /^https?:$/.test(u.protocol) ? null : 'must be http(s)'; } catch { return 'not a valid URL'; } };
const q = (s) => JSON.stringify(s); // JSON strings are valid YAML double-quoted scalars

console.log(`\n${bold('New project')} ${dim('— press Enter to accept defaults in (parentheses)')}\n`);

const title = await ask('Title');
const slug = await ask('Slug', {
  def: slugify(title),
  hint: 'URL: /work/<slug>/',
  validate: (v) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) ? 'lowercase-kebab-case only'
    : existsSync(join(root, 'src/content/projects', `${v}.md`)) ? 'a project with this slug already exists' : null,
});
const summary = await ask('One-line summary', { hint: '≤160 chars', validate: (v) => (v.length > 160 ? `too long (${v.length})` : null) });
const industry = await ask('Industry (anonymized)', { hint: 'e.g. "professional services firm" — never the client name' });
console.log(CATEGORIES.map((c, i) => dim(`  ${i + 1}) ${c}`)).join('\n'));
const catIdx = await ask('Category number', { def: '1', validate: (v) => (CATEGORIES[Number(v) - 1] ? null : `pick 1–${CATEGORIES.length}`) });
const category = CATEGORIES[Number(catIdx) - 1];
const year = await ask('Year', { def: String(new Date().getFullYear()), validate: (v) => (/^(19|20|21)\d\d$/.test(v) ? null : 'four-digit year') });
const role = await ask('Your role', { def: 'Lead engineer' });
const problem = await ask('Problem');
const solution = await ask('What you built');
const stackRaw = await ask('Stack', { hint: 'comma-separated' });
const stack = stackRaw.split(',').map((s) => s.trim()).filter(Boolean);
const outcome = await ask('Outcome / result');
const confidential = await yesNo('Confidential client work? (hides links & cover)', true);
const featured = await yesNo('Feature on homepage?', false);
const order = await ask('Sort order (lower = first)', { def: '100', validate: (v) => (Number.isFinite(Number(v)) ? null : 'number') });
let repo = '', demo = '', cover = '', coverAlt = '';
if (!confidential) {
  repo = await ask('Repo URL', { required: false, hint: 'optional', validate: (v) => (v ? isUrl(v) : null) });
  demo = await ask('Demo URL', { required: false, hint: 'optional', validate: (v) => (v ? isUrl(v) : null) });
  cover = await ask('Cover image path', { required: false, hint: 'optional, e.g. /images/projects/foo.png (put file in public/images/projects)', validate: (v) => (!v || v.startsWith('/') || /^https?:/.test(v) ? null : 'start with / or https://') });
  if (cover) coverAlt = await ask('Cover alt text');
}
rl.close();

const fm = [
  '---',
  `title: ${q(title)}`,
  `slug: ${slug}`,
  `summary: ${q(summary)}`,
  `industry: ${q(industry)}`,
  `category: ${category}`,
  `year: ${Number(year)}`,
  `role: ${q(role)}`,
  `problem: ${q(problem)}`,
  `solution: ${q(solution)}`,
  `stack: [${stack.map(q).join(', ')}]`,
  `outcome: ${q(outcome)}`,
  `featured: ${featured}`,
  `order: ${Number(order)}`,
  `confidential: ${confidential}`,
  ...(cover ? [`cover: ${q(cover)}`, `coverAlt: ${q(coverAlt)}`] : []),
  ...(repo || demo ? ['links:', ...(repo ? [`  repo: ${q(repo)}`] : []), ...(demo ? [`  demo: ${q(demo)}`] : [])] : []),
  '---',
  '',
  '<!-- Optional: write a longer case study here in Markdown. It appears under "Deep dive". -->',
  '',
].join('\n');

const file = join(root, 'src/content/projects', `${slug}.md`);
writeFileSync(file, fm);
console.log(`\n✓ Wrote ${file.replace(root + '/', '')}`);

if (process.env.SKIP_VALIDATE !== '1') {
  console.log(dim('Validating with astro sync…'));
  const r = spawnSync('npx', ['astro', 'sync'], { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' });
  if (r.status !== 0) {
    console.error(`${r.stdout}\n${r.stderr}\n✗ Validation failed — the file was removed. Fix the input and try again.`);
    unlinkSync(file);
    process.exit(1);
  }
  console.log('✓ Valid. Preview with `npm run dev`, then commit & push to publish.');
}
