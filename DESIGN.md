# DESIGN.md — Sirpreet Dhillon portfolio

The design system for this site. Every UI change should follow it. Tokens live in
`src/styles/global.css` (CSS variables + Tailwind v4 `@theme`); this file explains
what they mean and how to use them.

## 1. Intent

**Readers:** recruiters hiring for AI engineering / forward deployed engineer roles,
and prospective clients deciding whether to send an inquiry. Both are scanning for
evidence: what was built, with what, and what changed because of it.

**The site should feel like a well-written engineering design doc.** Technical,
precise, calm, credible. Not a product launch, not a creative agency.

Principles:

1. **Evidence over atmosphere.** Real architecture diagrams, screenshots, metrics and
   stack lists carry the visual weight. No decorative blobs, gradients or stock art.
2. **One accent, used sparingly.** Teal marks the next action (primary CTA), links,
   focus and the current state. Everything else is ink and neutral gray.
3. **Two type voices.** Inter for prose and headings; JetBrains Mono for the
   *technical layer*: eyebrows, tags, dates, metrics, file/ID-like labels.
4. **Structure from lines, not shadows.** Hairline borders and surface steps create
   hierarchy. Shadows are rare and soft.
5. **Accessible by default.** WCAG 2.2 AA is a floor. Every rule below assumes the
   a11y baseline already in the codebase (skip link, visible `:focus-visible`,
   reduced motion, labelled controls, `aria-live` status, image dimensions).

## 2. Color

The theme follows the visitor's OS setting (`prefers-color-scheme`) unless they pick
one with the toggle. The choice is stored in `localStorage` and applied as `.dark`
on `<html>` before first paint. Light and dark get equal design care; neither is a
fallback for the other.

### Tokens

| Role | CSS var | Tailwind | Light | Dark |
|---|---|---|---|---|
| Page background | `--bg` | `bg-bg` | `#ffffff` | `#0a0d10` |
| Surface (cards, bands) | `--surface` | `bg-surface` | `#f6f8f9` | `#11161b` |
| Surface 2 (insets, hover, tags) | `--surface-2` | `bg-surface-2` | `#edf1f3` | `#182027` |
| Hairline border | `--border` | `border-line` | `#e1e6ea` | `#232c35` |
| Strong border (inputs, controls) | `--border-strong` | `border-line-strong` | `#7a8693` | `#687582` |
| Primary text | `--text` | `text-ink` | `#0c1116` | `#e6ebef` |
| Secondary text | `--muted` | `text-muted` | `#4a5561` | `#a0abb6` |
| Tertiary text (meta, placeholders) | `--faint` | `text-faint` | `#5f6b78` | `#8794a1` |
| Accent (CTA fill, links, accent text) | `--accent` | `*-accent` | `#0f766e` | `#2dd4bf` |
| Accent hover | `--accent-hover` | `*-accent-hover` | `#115e59` | `#5eead4` |
| Accent tint (category tag, selection) | `--accent-soft` | `bg-accent-soft` | `#e3f4f1` | `#0d2b28` |
| Text on accent fill | `--accent-fg` | `text-accent-fg` | `#ffffff` | `#03201c` |
| Focus ring | `--ring` | `ring-ring` / `outline` | `#0f766e` | `#2dd4bf` |
| Error text / border | `--danger` | `*-danger` | `#b42318` | `#fda29b` |
| Error tint | `--danger-soft` | `bg-danger-soft` | `#fef1f0` | `#2a1513` |

Note the accent *inverts in lightness* between themes: deep teal with white text in
light mode, bright teal with near-black text in dark mode. Never put white text on the
dark-mode accent.

### Verified contrast (WCAG 2.x)

Text pairs need ≥ 4.5:1. UI boundaries (input borders, focus ring) need ≥ 3:1.

| Pair | Light | Dark |
|---|---|---|
| ink on bg / surface / surface-2 | 18.96 / 17.80 / 16.69 | 16.23 / 15.15 / 13.72 |
| muted on bg / surface / surface-2 | 7.60 / 7.13 / 6.69 | 8.34 / 7.79 / 7.06 |
| faint on bg / surface / surface-2 | 5.44 / 5.11 / 4.79 | 6.29 / 5.87 / 5.32 |
| accent text on bg / surface / surface-2 | 5.47 / 5.14 / 4.82 | 10.47 / 9.77 / 8.85 |
| accent text on accent-soft | 4.82 | 8.10 |
| accent-fg on accent / accent-hover | 5.47 / 7.58 | 9.19 / 11.57 |
| danger on bg / danger-soft | 6.57 / 5.97 | 10.04 / 8.90 |
| border-strong on bg / surface / surface-2 (3:1) | 3.71 / 3.48 / 3.27 | 4.13 / 3.86 / 3.50 |
| ring on bg / surface / surface-2 (3:1) | 5.47 / 5.14 / 4.82 | 10.47 / 9.77 / 8.85 |

`--border` (hairline) is decorative and intentionally low-contrast. **Never use it
as the only boundary of an interactive control.** Inputs use `--border-strong`.

When adding a color, add it to both themes and re-verify every pair it can appear in.
Don't introduce Tailwind palette colors (`red-500`, `emerald-500`, …) in markup; add a
token instead. Status dots may use the accent.

### Usage rules

- **Accent budget:** at most one filled accent button per viewport. Links, the focus
  ring, the active nav item marker, category tags and eyebrows may also use accent.
- **Section bands** alternate `bg` and `surface` only. No colored section backgrounds.
- Selection: `accent-soft` background, `ink` text.
- `meta name="theme-color"` must equal `--bg` in the active theme.

## 3. Typography

| Family | Token | Use |
|---|---|---|
| Inter Variable | `font-sans` | Everything narrative: headings, body, buttons, form text |
| JetBrains Mono Variable | `font-mono` | Eyebrows, tags/chips, dates, metrics, code, IDs |

Use `tabular-nums` wherever numbers line up (dates, metrics, counts in filters).

### Scale

Sizes are rem-based (16px root). Utilities are `text-<token>` (e.g. `text-h2`,
`font-mono text-mono-label`) and include line height, tracking and weight.
`display`, `h1` and `h2` are fluid (`clamp()`) between the mobile and desktop sizes,
so they need no breakpoint classes.

| Token | Size / line height | Weight | Tracking | Use |
|---|---|---|---|---|
| `display` | 56 / 1.04 (mobile: 40) | 600 | -0.035em | Hero name only |
| `h1` | 44 / 1.08 (mobile: 34) | 600 | -0.03em | Page titles (/work, case study) |
| `h2` | 32 / 1.15 (mobile: 28) | 600 | -0.025em | Section headings |
| `h3` | 22 / 1.3 | 600 | -0.015em | Card titles, sub-sections |
| `h4` | 18 / 1.4 | 600 | -0.01em | Small headings, form section titles |
| `lead` | 19 / 1.6 | 400 | -0.005em | Intro paragraphs under h1/h2 |
| `body` | 16 / 1.65 | 400 | 0 | Default prose |
| `body-sm` | 14 / 1.55 | 400 | 0 | Card body, meta, footer |
| `label` | 14 / 1.4 | 500 | 0 | Buttons, form labels, nav links |
| `mono-label` | 12 / 1.4 (mono) | 500 | 0.06em, uppercase | Eyebrows, dt labels |
| `mono-sm` | 12.5 / 1.45 (mono) | 400 | 0 | Tags, dates, metrics, code |

Rules:

- **Weight ceiling is 600.** No `font-bold` / 700+ on headings.
- Headings: sentence case, `text-wrap: balance` (already global), max ~20ch for
  display, ~28ch for h1/h2.
- Prose: max width 68ch; paragraphs `text-muted`, emphasis `text-ink`.
- Mono is never used for paragraphs or headings. Mono uppercase only for `mono-label`.
- Use `…`, curly quotes, en dash for ranges (`2021–2023`), numerals for counts.
- Numbers in comparisons/metrics: `tabular-nums`.

## 4. Space, layout, radius, borders, elevation

### Spacing

4px base (Tailwind's default spacing scale). Use these steps; avoid odd values.

| Step | px | Typical use |
|---|---|---|
| 1 / 2 | 4 / 8 | Icon gaps, tag padding |
| 3 / 4 | 12 / 16 | Control padding, stacked text |
| 6 | 24 | Card padding (mobile), grid gap |
| 8 | 32 | Card padding (desktop), block gap |
| 12 / 16 | 48 / 64 | Heading → content, sub-section gap |
| 24 | 96 | Section padding (desktop); 16 (64px) on mobile |

- Container: `max-w-6xl` (72rem / 1152px), side padding 20px → 32px at `sm`.
- Grid: 12-col mental model; project grids 1 → 2 → 3 columns (`md`, `lg`).
- **Tight inside, generous between**: 8–16px inside a block, 48–96px between sections.

### Radius

| Token | Value | Use |
|---|---|---|
| `rounded-tag` | 6px | Tags, chips, inline code, small badges |
| `rounded-control` | 8px | Buttons, inputs, selects, icon buttons, nav items |
| `rounded-card` | 12px | Cards, form panel, callouts |
| `rounded-panel` | 16px | Image / screenshot frames, large figures |
| `rounded-full` | 9999px | Avatars, status dots only |

No pill-shaped buttons. One radius per component; nested elements use the next size
down.

### Borders

- 1px everywhere. `border-line` for structure (cards, dividers, section rules);
  `border-line-strong` for interactive control boundaries.
- Hover on cards: border shifts toward accent (`border-accent/50`), not a shadow jump.
- Section separation: a top hairline (`border-t border-line`) or a `surface` band.

### Elevation

| Token | Light | Dark | Use |
|---|---|---|---|
| none | — | — | Default. Cards are flat with a hairline. |
| `shadow-card` | `0 1px 2px rgb(12 17 22 / .04), 0 1px 1px rgb(12 17 22 / .03)` | none | Optional resting lift on light |
| `shadow-raised` | `0 1px 2px rgb(12 17 22 / .05), 0 8px 24px -8px rgb(12 17 22 / .12)` | `0 8px 24px -8px rgb(0 0 0 / .6)` | Mobile menu, dropdowns |

In dark mode, depth comes from stepping `bg → surface → surface-2`, not shadow.

## 5. Motion

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 120ms | Color, border, opacity on hover/press |
| `--duration-base` | 180ms | Small transforms (arrow nudge, menu open) |
| `--duration-slow` | 280ms | Entrance of a single hero element (optional) |
| `ease-out-quart` (Tailwind) | `cubic-bezier(0.25, 1, 0.5, 1)` | Default easing |

- Animate `transform` and `opacity` only. List properties explicitly; never
  `transition: all`.
- Motion is feedback, not decoration: hover/focus/press states and one optional hero
  entrance. No scroll-triggered reveals on content, no parallax, no autoplaying loops.
- `prefers-reduced-motion: reduce` disables transitions/animations and smooth scroll
  (global rule already in place). Never rely on motion to convey meaning.

## 6. Components

All interactive elements: visible `:focus-visible` ring (2px `--ring`, 3px offset),
hover state that *increases* contrast, ≥ 44×44px touch target on mobile, and an
accessible name.

### Navigation (header)

- Sticky, 64px tall, `bg/85` with backdrop blur and a bottom `border-line`. Never
  covers focused content (`scroll-padding-top` already set).
- Left: monogram (accent fill, `rounded-control`) + name in `label` weight 600.
- Center/right: links in `label`, `text-muted` → `text-ink` on hover, `surface-2`
  hover background, `rounded-control`. Current page: `text-ink` + `aria-current`
  + 2px accent underline marker.
- Right: theme toggle (icon button, `aria-label` + `aria-pressed`) and one compact
  primary button "Work With Me" (hidden below `sm`).
- Mobile: hamburger → full-width panel under the header, `shadow-raised`, Esc closes
  and returns focus, links ≥ 48px tall.

### Hero

- Left-aligned, single column of text up to ~44rem, with an optional *technical
  artifact* on the right at `lg`: an architecture sketch, a real screenshot, or a
  small "system card" (mono key/value list: role, focus, stack, location). It must be
  real content, not illustration.
- Order: availability status (accent dot + `body-sm`) → name (`display`) →
  positioning line (`h2` size, weight 500, `text-ink`) → one-paragraph `lead` → CTA
  row (primary "View Work" + secondary "Work With Me") → proof row.
- **Proof row:** 3–4 mono facts separated by hairlines, e.g. `8 case studies ·
  AWS certified · Security+`. Facts must be verifiable elsewhere on the site.
- Background: plain `bg`. At most a faint 1px grid or dotted pattern at ≤ 4% ink
  opacity, masked to fade out. No gradients.

### Buttons

| Variant | Fill | Text | Border | Hover |
|---|---|---|---|---|
| Primary | `accent` | `accent-fg` | none | `accent-hover` |
| Secondary | `bg` | `ink` | `line-strong` | `surface-2` fill |
| Ghost | transparent | `muted` | none | `surface-2` fill, `ink` text |
| Link | — | `accent` | underline 40% → 100% | `accent-hover` |

- Size: `label` text, 40px tall (desktop), 44px (touch), padding `px-4`;
  `rounded-control`. Compact nav size: 36px tall, still 44px hit area on mobile.
- Trailing icon (16px) for direction (→, ↗ for external, plus sr-only "(opens in a
  new tab)").
- Disabled: 60% opacity, `cursor-not-allowed`, no hover change. Submit stays enabled
  until the request starts; then shows "Sending…".
- Labels are specific Title Case verbs: "Send Inquiry", "View Case Study", not "Submit".

### Project cards

- `bg` (on `surface` bands) or `surface` (on `bg`), `border-line`, `rounded-card`,
  padding 24 → 32px. Flat; hover shifts border to `accent/50` and nudges the arrow
  4px (transform).
- Whole card is one link via a stretched `::after` on the title link. Keyboard focus
  shows a ring on the card (`has-[a:focus-visible]:ring-2 ring-ring`). Keep this.
- Content order: meta row (category tag + `mono-sm` year · industry, NDA lock if
  confidential) → title (`h3`) → for featured cards Problem / What I built / Result
  as a `dl` with `mono-label` terms, each clamped to 3 lines → stack tags (max 5–7,
  then "+N") → "Read case study →" in accent.
- If a project has a headline metric, show it as a mono figure (`mono-sm`, ink,
  `tabular-nums`) in the result row. Never invent metrics.
- Cover images: `rounded-panel`, real `width`/`height`, `loading="lazy"` unless above
  the fold.

### Tags and chips

- **Stack tag:** `mono-sm`, `text-muted`, `bg-surface-2`, `border-line`,
  `rounded-tag`, padding 2px 8px. Lists use `<ul>` with an `aria-label`.
- **Category tag:** same shape, `bg-accent-soft`, `text-accent`, no border.
- **Status badge** (e.g. "In progress"): category tag + 6px accent dot.
- **Filter chips** (/work): `label` text, `rounded-control`, `border-line-strong`;
  selected = accent fill + `accent-fg` with `aria-pressed="true"`. State is mirrored
  in `?category=`.
- Tags are not links unless they filter; if they filter, they are buttons.

### Inquiry form

- Lives in a `surface` card (`rounded-card`, padding 24 → 32px) on a `bg`/`surface`
  band; two columns at `sm` for short fields, full width for message.
- Labels above fields in `label`, `text-ink`; required marked with `*` (aria-hidden)
  plus native `required`; a "* Required" legend once.
- Inputs: 44px min height, `bg-bg`, `text-ink`, `border-line-strong`,
  `rounded-control`, padding 12px 14px. Placeholder `text-faint`, ends with `…`,
  shows an example. Focus: border `accent` + 2px ring (`ring-ring`).
- Correct `type`, `autocomplete`, `name`; `spellcheck="false"` on email. Selects get
  explicit `bg-bg text-ink`.
- Errors: inline under the field in `body-sm` `text-danger`, field border `danger`,
  `aria-invalid` + `aria-describedby`; form-level error in a `danger-soft` box with
  `role="alert"` that says what to do next. Focus the first invalid field on submit.
- Success replaces the form with a focused `role="status"` panel.
- Keep: honeypot, no-JS POST fallback, unsaved-changes warning.

### Section heading

`mono-label` eyebrow in `text-accent` → `h2` → optional `lead` (max 42rem). 48px to
the section content.

### Footer

- Top `border-line`, `bg` background, 40px vertical padding.
- Left: name + one-line descriptor in `body-sm` `text-muted`; © year in `mono-sm`
  `text-faint`. Right: social icon buttons (40px, `rounded-control`, sr-only labels)
  and a text link to /work and the résumé PDF.
- No link farms or newsletter forms.

### Case-study page (for reference)

Header (eyebrow, `h1`, `lead`, links) → cover in `rounded-panel` → two columns at
`lg`: content (max 68ch) and a sticky "Project facts" `dl` card. Markdown is rendered
with headings demoted one level (see `src/lib/markdown-case-study.mjs`).

## 7. Writing voice (UI copy)

- Plain, specific, active: "Built a RAG service with enforced citations", not
  "Leveraged cutting-edge AI".
- Lead with outcome and scope; quantify only with real numbers.
- Title Case for buttons and nav labels; sentence case for headings.
- Numerals for counts ("2 business days"), `…` not `...`.

## 8. Don'ts

- No purple/blue/pink gradients, mesh blobs, glows or "aurora" backgrounds.
- No generic 3-card hero ("Fast · Secure · Scalable") or icon-grid feature rows
  with vague claims.
- No stock photos, 3D renders, robot/brain/AI-sparkle imagery or emoji as icons.
- No second accent color; no Tailwind palette colors in markup.
- No pill-shaped CTAs, no heavy drop shadows, no glassmorphism cards.
- No font weights above 600; no all-caps headings; no mono paragraphs.
- No scroll-jacking, parallax, typewriter effects, or animated counters.
- No skill bars/percentages or logo walls of tools.
- No light-gray text below 4.5:1 to look "subtle". Use `--faint`, which passes.
- Don't remove focus outlines, skip link, `aria-*` states or image dimensions while
  restyling.
