#!/usr/bin/env node
/**
 * Builds the resume from the SAME content as the website, so they never drift:
 *   src/data/site.json           → header, summary, skills, certifications
 *   src/content/experience/*.md  → Professional experience
 *   src/content/projects/*.md    → Projects (only those with `resumeBullets`)
 *
 *   npm run resume
 *
 * Outputs
 *   public/resume.pdf                         public version (drafts excluded) — linked on the site
 *   resume/out/<Name>-Resume-Full.pdf         full version incl. draft projects (gitignored)
 *   resume/out/*.html                         the HTML each PDF was printed from
 *
 * Needs Google Chrome/Chromium for HTML → PDF. Set CHROME_PATH if it isn't found.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parse as parseYaml } from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'resume/out');
mkdirSync(outDir, { recursive: true });

const site = JSON.parse(readFileSync(join(root, 'src/data/site.json'), 'utf8'));
const SITE_URL = (process.env.SITE_URL || 'https://siri-dhillon.github.io').replace(/\/$/, '');

function readCollection(dir) {
  return readdirSync(join(root, dir))
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => {
      const src = readFileSync(join(root, dir, f), 'utf8');
      const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!m) throw new Error(`${dir}/${f}: missing front matter`);
      return parseYaml(m[1]);
    });
}

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const ym = (v) => (v === 'present' ? 'Present' : `${MONTHS[Number(String(v).split('-')[1]) - 1]} ${String(v).split('-')[0]}`);
const bare = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const byOrder = (a, b) => (a.order ?? 100) - (b.order ?? 100);

const experience = readCollection('src/content/experience').sort(byOrder);
const allProjects = readCollection('src/content/projects')
  .filter((p) => Array.isArray(p.resumeBullets) && p.resumeBullets.length)
  .sort(byOrder);

if (!site.resume) throw new Error('site.json is missing the "resume" block (title, summary, certifications)');

function render({ includeDrafts }) {
  const projects = allProjects.filter((p) => includeDrafts || !p.draft);
  const skills = site.skills
    .map((g) => ({ group: g.group, items: g.items.filter((i) => !/certified/i.test(i)) }))
    .filter((g) => g.items.length);

  const contact = [
    site.location && ['Location', esc(site.location.split('·')[0].trim())],
    ['Website', `<a href="${SITE_URL}/">${esc(bare(SITE_URL))}</a>`],
    site.socials.linkedin && ['LinkedIn', `<a href="${site.socials.linkedin}">${esc(bare(site.socials.linkedin))}</a>`],
    site.socials.github && ['GitHub', `<a href="${site.socials.github}">${esc(bare(site.socials.github))}</a>`],
  ].filter(Boolean);

  const entry = (left, bullets) => `
      <div class="row">
        <div class="left">${left}</div>
        <ul class="right">${bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      </div>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(site.name)} — Resume</title>
<style>
  @page { size: Letter; margin: 0.55in 0.6in; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Aptos, Calibri, "Segoe UI", "Helvetica Neue", Arial, sans-serif; font-size: 10.5pt; line-height: 1.32; color: #111; }
  a { color: inherit; text-decoration: none; }
  header { display: grid; grid-template-columns: 1fr 3.4in; gap: 0.3in; align-items: start; padding-bottom: 8pt; border-bottom: 1px solid #111; }
  h1 { font-family: "Times New Roman", Times, serif; font-size: 30pt; line-height: 1; margin: 0; font-weight: 700; letter-spacing: -0.3pt; }
  .title { font-family: "Times New Roman", Times, serif; font-size: 12.5pt; margin-top: 3pt; }
  table.contact { width: 100%; border-collapse: collapse; font-size: 10pt; }
  table.contact td { padding: 3pt 0; border-bottom: 1px solid #111; }
  table.contact tr:last-child td { border-bottom: 0; }
  table.contact td:last-child { text-align: right; }
  section { border-bottom: 1px solid #111; padding: 7pt 0 6pt; }
  section:last-of-type { border-bottom: 0; }
  h2 { font-size: 10.5pt; font-weight: 700; text-transform: uppercase; margin: 0 0 4pt; letter-spacing: 0.2pt; }
  .row { display: grid; grid-template-columns: 2.35in 1fr; gap: 0.2in; margin: 0 0 6pt; break-inside: avoid; }
  .row:last-child { margin-bottom: 0; }
  .left { line-height: 1.4; }
  .left b { display: block; }
  .muted { color: #222; }
  ul.right { margin: 0; padding-left: 14pt; }
  ul.right li { margin: 0 0 2.5pt; padding-left: 2pt; }
  .summary { display: grid; grid-template-columns: 2.35in 1fr; gap: 0.2in; }
  .summary h2 { margin: 0; }
  .summary p { margin: 0; }
</style></head>
<body>
  <header>
    <div>
      <h1>${esc(site.name)}</h1>
      <div class="title">${esc(site.resume.title)}</div>
    </div>
    <table class="contact">${contact.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
  </header>

  <section class="summary">
    <h2>Summary</h2>
    <p>${esc(site.resume.summary)}</p>
  </section>

  <section>
    <h2>Professional Experience</h2>
    ${experience
      .map((e) =>
        entry(
          `<b>${esc(e.role)}</b><span class="muted">${esc(e.org)}</span><br>${ym(e.start)} – ${ym(e.end)}`,
          e.highlights?.length ? e.highlights : [e.summary],
        ),
      )
      .join('')}
  </section>

  <section>
    <h2>Projects</h2>
    ${projects
      .map((p) =>
        entry(
          `<b>${esc(p.title)}</b><span class="muted">${esc(p.stack.slice(0, 4).join(' | '))}</span><br>${esc(p.year)}${p.draft ? ' – Present' : ''}`,
          p.resumeBullets,
        ),
      )
      .join('')}
  </section>

  <section>
    <h2>Skills</h2>
    ${skills.map((g) => `<div class="row"><div class="left"><b>${esc(g.group)}</b></div><div>${g.items.map(esc).join(' • ')}</div></div>`).join('')}
  </section>

  <section>
    <h2>Education</h2>
    <div class="row"><div class="left"><b>Bachelor of Applied Science</b>Computer Engineering</div><div>Simon Fraser University | Graduated 2023</div></div>
  </section>

  ${
    site.resume.certifications?.length
      ? `<section><h2>Additional Information</h2>
    <div class="row"><div class="left"><b>Certifications</b></div><ul class="right">${site.resume.certifications.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div></section>`
      : ''
  }
</body></html>`;
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser',
  ].filter(Boolean);
  for (const c of candidates) {
    if (c.startsWith('/') ? existsSync(c) : spawnSync('which', [c]).status === 0) return c;
  }
  throw new Error('Chrome/Chromium not found. Install it or set CHROME_PATH.');
}

const chrome = findChrome();
const slugName = site.name.replace(/\s+/g, '-');
const builds = [
  { includeDrafts: false, file: `${slugName}-Resume` },
  { includeDrafts: true, file: `${slugName}-Resume-Full` },
];

for (const b of builds) {
  const html = join(outDir, `${b.file}.html`);
  const pdf = join(outDir, `${b.file}.pdf`);
  writeFileSync(html, render(b));
  const r = spawnSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdf}`, pathToFileURL(html).href], { encoding: 'utf8' });
  if (r.status !== 0 || !existsSync(pdf)) throw new Error(`PDF render failed for ${b.file}:\n${r.stderr}`);
  console.log(`✓ ${pdf.replace(root + '/', '')}`);
}

copyFileSync(join(outDir, `${slugName}-Resume.pdf`), join(root, 'public/resume.pdf'));
console.log('✓ public/resume.pdf (public version, drafts excluded)');
