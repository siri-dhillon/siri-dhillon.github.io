#!/usr/bin/env node
/**
 * Regenerates favicon + social images from src/data/site.json.
 * Run after changing your name/headline/monogram:  npm run og
 *
 * Outputs (in /public): favicon.svg, favicon.ico, apple-touch-icon.png,
 * og-default.png (1200x630), and headshot-480.jpg (if images/headshot.jpg exists).
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (p) => join(root, 'public', p);
const site = JSON.parse(readFileSync(join(root, 'src/data/site.json'), 'utf8'));
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const ACCENT = '#4338ca';
const FONT = "Inter, 'Helvetica Neue', Arial, sans-serif";

// Favicon (SVG, adapts to dark mode)
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<style>rect{fill:${ACCENT}}@media (prefers-color-scheme:dark){rect{fill:#a5b4fc}text{fill:#0a0e17}}</style>
<rect width="64" height="64" rx="14"/><text x="32" y="42" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="700" fill="#fff">${esc(site.monogram)}</text></svg>`;
writeFileSync(pub('favicon.svg'), favicon);

const staticIcon = (size) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
<rect width="64" height="64" rx="${size >= 180 ? 0 : 14}" fill="${ACCENT}"/><text x="32" y="42" text-anchor="middle" font-family="${FONT}" font-size="28" font-weight="700" fill="#fff">${esc(site.monogram)}</text></svg>`);

await sharp(staticIcon(180)).png().toFile(pub('apple-touch-icon.png'));

// favicon.ico = ICO container wrapping a 32x32 PNG
const png32 = await sharp(staticIcon(32)).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(png32.length, 14); header.writeUInt32LE(22, 18);
writeFileSync(pub('favicon.ico'), Buffer.concat([header, png32]));

// Open Graph card 1200x630
function wrap(text, max) {
  const words = text.split(/\s+/); const lines = []; let line = '';
  for (const w of words) { if ((line + ' ' + w).trim().length > max) { lines.push(line.trim()); line = w; } else line += ' ' + w; }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 3);
}
const headline = wrap(site.headline, 38);
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><radialGradient id="g" cx="85%" cy="0%" r="80%"><stop offset="0" stop-color="#312e81"/><stop offset="1" stop-color="#0a0e17"/></radialGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<rect x="80" y="80" width="72" height="72" rx="16" fill="#a5b4fc"/>
<text x="116" y="128" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="700" fill="#0a0e17">${esc(site.monogram)}</text>
<text x="176" y="128" font-family="${FONT}" font-size="32" font-weight="600" fill="#e8ebf2">${esc(site.name)}</text>
${headline.map((l, i) => `<text x="80" y="${290 + i * 72}" font-family="${FONT}" font-size="56" font-weight="700" fill="#ffffff">${esc(l)}</text>`).join('\n')}
<text x="80" y="560" font-family="${FONT}" font-size="26" fill="#a3adbf">AI / LLM · Full-stack · Data · Cloud · Edge ML</text>
</svg>`;
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(pub('og-default.png'));

// Optimised headshot for the About section
if (existsSync(pub('images/headshot.jpg'))) {
  await sharp(pub('images/headshot.jpg')).resize(480, 640, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 80, mozjpeg: true }).toFile(pub('images/headshot-480.jpg'));
}
console.log('✓ Generated favicon.svg, favicon.ico, apple-touch-icon.png, og-default.png' +
  (existsSync(pub('images/headshot.jpg')) ? ', images/headshot-480.jpg' : ''));
