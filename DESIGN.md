# DESIGN.md — Sirpreet Dhillon portfolio

The design system for this site. Every UI change should follow it. Tokens live in
`src/styles/global.css` (CSS variables + Tailwind v4 `@theme`); this file explains
what they mean and how to use them.

## 1. Intent

**Readers:** recruiters hiring for AI engineering / forward deployed engineer roles,
and prospective clients deciding whether to send an inquiry. Both are scanning for
evidence: what was built, with what, and what changed because of it.

**The site should feel premium and credible: an engineer's work presented with the
restraint of a top studio.** Technical, precise, calm. Not a product launch, not an
agency pitch. One person, clearly accountable for the work.

Principles:

1. **Evidence over atmosphere.** Real screenshots, architecture diagrams, measured
   results and stack lists carry the visual weight. No decorative blobs, gradients or
   stock art.
2. **One idea per screen.** Each section makes a single point, set large, with a lot
   of space around it. If a section needs two headlines, it is two sections.
3. **Restraint is the luxury.** Few elements, one accent, two type voices, one
   persistent call to action. Removing things is the default edit.
4. **One accent, used sparingly.** Teal marks the next action (Inquire), links, focus
   and current state. Everything else is ink, gray and the inverse band.
5. **Two type voices.** Inter for prose and headings; JetBrains Mono for the
   *technical layer*: eyebrows, tags, dates, metric readouts, file/ID-like labels.
6. **Accessible by default.** WCAG 2.2 AA is a floor. Every rule below assumes the
   a11y baseline already in the codebase (skip link, visible `:focus-visible`,
   reduced motion, labelled controls, `aria-live` status, image dimensions).

### What "premium" means here

Studied from a reference studio site (bonanza-studios.com, captured in
`design-references/bonanza/`). We take its *principles*, not its brand: no copying of
its logo, copy, orange accent, Space Grotesk, LED-matrix graphics or layouts.

| Principle | What the reference does | How this site applies it |
|---|---|---|
| Scale contrast | 56px hero, 48px section heads, then 16–18px body; nothing in between competes | Big `display`/`h2`, small calm body; few mid-size elements |
| Weight restraint | Headings at weight 500 with tight tracking; no bold anywhere | Inter 500 for display/h1/h2/h3; 600 only for small `h4` |
| Two-tone headlines | Statement in ink, follow-up sentence in gray ("Code first. *Results, not slide decks.*") | `ink` first clause + `muted` second clause; period-terminated |
| Vertical rhythm | ~200px section padding; one centered idea per viewport | 160px desktop / 96px mobile section padding |
| Polarity bands | Alternates near-black and off-white sections | Inverse band (dark tokens) for 2–3 key moments: hero proof, closing CTA, footer |
| Product-UI proof | Case studies shown as UI tiles with one big number + a one-line outcome | Mono "readout" tiles with real metrics from each case study |
| Process as a timeline | Week 0 → Week 6 stepper explains how an engagement runs | "How I work" timeline for client engagements |
| One persistent CTA | Floating bottom dock holding nav + a single "Inquire" button, on every screen | Same pattern: a floating dock with nav + "Inquire" |
| Quiet motion | Sections reveal as you scroll; honors reduced motion | One short reveal per section; **no** scroll pinning |

What we deliberately do **not** take: scroll-pinned sequences (they make the page
~31,000px tall and leave blank screens when scrolled quickly or captured), novelty
display hardware, pastel corner gradients, star ratings, client-logo walls and the
studio "we" voice.

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

### Inverse band

Premium pages get their rhythm from changes in polarity. The `.band-inverse` class
re-declares the **dark** token set on a section, so everything inside it (text,
accent, borders, buttons) switches together with no new colors:

- Light theme: the band uses the dark palette on `#0a0d10`.
- Dark theme: the band steps *up* to `--surface` (`#11161b`) with a top and bottom
  hairline, so it still reads as a distinct moment without going light.

Every pair inside a band is one of the verified dark-theme pairs below. The dark-theme
band steps each surface up one level, which adds one value, `#1f2831` (surface-2
inside the band). Verified on it: ink 12.44, muted 6.40, faint 4.82, accent 8.02,
border-strong 3.17, ring 8.02. Use at most 3 inverse bands per page, never two in a
row (the closing Inquire band may run into the footer).

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

- **Accent budget:** the Inquire button is the only filled accent element on screen.
  Links, the focus ring, the active nav marker, category tags, eyebrows and the
  timeline's active step may also use accent.
- **Section bands** use `bg`, `surface` or `.band-inverse`. No colored backgrounds.
- **Two-tone headlines:** first clause `text-ink`, second clause `text-muted`, in the
  same element (one `<h2>`, with the second clause in a `<span>`). Both pass AA.
- Selection: `accent-soft` background, `ink` text.
- `meta name="theme-color"` must equal `--bg` in the active theme.

## 3. Typography

| Family | Token | Use |
|---|---|---|
| Inter Variable | `font-sans` | Everything narrative: headings, body, buttons, form text |
| JetBrains Mono Variable | `font-mono` | Eyebrows, tags/chips, dates, metric readouts, code, IDs |

Use `tabular-nums` wherever numbers line up (dates, metrics, counts in filters).

### Scale

Sizes are rem-based (16px root). Utilities are `text-<token>` (e.g. `text-h2`,
`font-mono text-mono-label`) and include line height, tracking and weight.
`display`, `h1`, `h2`, `h3` and `readout` are fluid (`clamp()`) between the mobile
and desktop sizes, so they need no breakpoint classes.

| Token | Size / line height | Weight | Tracking | Use |
|---|---|---|---|---|
| `display` | 64 / 1.02 (mobile: 40) | 500 | -0.045em | Hero statement only |
| `h1` | 52 / 1.06 (mobile: 36) | 500 | -0.04em | Page titles (/work, case study) |
| `h2` | 48 / 1.08 (mobile: 30) | 500 | -0.035em | Section statements (two-tone) |
| `h3` | 28 / 1.2 (mobile: 22) | 500 | -0.02em | Card titles, timeline steps |
| `h4` | 18 / 1.4 | 600 | -0.01em | Small headings, form section titles |
| `readout` | 56 / 1 (mobile: 40), **mono** | 500 | -0.03em | One big metric in a proof tile |
| `lead` | 20 / 1.5 (mobile: 18) | 400 | -0.01em | Intro paragraphs under display/h1/h2 |
| `body-lg` | 18 / 1.6 | 400 | -0.005em | Case-study prose, about text |
| `body` | 16 / 1.65 | 400 | 0 | Default prose |
| `body-sm` | 14 / 1.55 | 400 | 0 | Card body, meta, footer |
| `label` | 14 / 1.4 | 500 | 0 | Buttons, form labels, nav links |
| `mono-label` | 12 / 1.4 (mono) | 500 | 0.06em, uppercase | Eyebrows, dt labels, readout captions |
| `mono-sm` | 12.5 / 1.45 (mono) | 400 | 0 | Tags, dates, small metrics, code |

Rules:

- **Weight 500 is the heading voice.** 600 only for `h4` and bold inline emphasis;
  never 700+. Large type earns presence through size and tracking, not weight.
- **Scale contrast:** a section uses at most one large size (`display` or `h2`) plus
  body sizes. Avoid stacking `h3` under `h2` under `display` on one screen.
- Headings: sentence case, period-terminated statements, `text-wrap: balance`
  (global), max ~16ch for display, ~22ch for h2. Statements may be centered; lists
  and prose are always left-aligned.
- Prose: max width 62ch; paragraphs `text-muted`, emphasis `text-ink`.
- Mono is never used for paragraphs or headings. Mono uppercase only for `mono-label`.
- Use `…`, curly quotes, en dash for ranges (`2021–2023`), numerals for counts.

## 4. Space, layout, radius, borders, elevation

### Spacing

4px base (Tailwind's default spacing scale). Use these steps; avoid odd values.

| Step | px | Typical use |
|---|---|---|
| 1 / 2 | 4 / 8 | Icon gaps, tag padding |
| 3 / 4 | 12 / 16 | Control padding, stacked text |
| 6 / 8 | 24 / 32 | Card padding, grid gap |
| 12 / 16 | 48 / 64 | Statement → content gap |
| 24 | 96 | Section padding on mobile |
| 40 | 160 | Section padding on desktop (`lg`) |

- **One idea per screen.** A section is: eyebrow → two-tone statement → (lead) →
  one piece of content. Desktop sections should be roughly one viewport or more.
- Containers: `max-w-6xl` (1152px) for grids; `max-w-3xl` (768px) for centered
  statements; prose 62ch. Side padding 20px → 32px at `sm`.
- **Tight inside, generous between**: 8–16px inside a block, 160px between sections.
- Leave room for the Inquire dock: page bottom padding 112px, and
  `scroll-padding-bottom` so focused elements are never hidden behind it.

### Radius

| Token | Value | Use |
|---|---|---|
| `rounded-full` | 9999px | Buttons, the Inquire dock, chips/tags, filter chips, avatars, dots |
| `rounded-control` | 12px | Inputs, selects, textarea, icon buttons |
| `rounded-card` | 16px | Cards, readout tiles, form panel |
| `rounded-panel` | 20px | Screenshot / image frames, large figures |
| `rounded-tag` | 6px | Inline code only |

Pills are reserved for things you press or that label: buttons, the dock, chips.
Containers are softly rounded rectangles. Nested elements use the next size down.

### Borders

- 1px everywhere. `border-line` for structure (cards, dividers, section rules);
  `border-line-strong` for interactive control boundaries.
- Hover on cards: border shifts toward accent (`border-accent/50`), not a shadow jump.
- Section separation comes from space and band changes, not rules. Use a hairline only
  inside a section (e.g. between timeline steps).

### Elevation

| Token | Light | Dark | Use |
|---|---|---|---|
| none | — | — | Default. Cards are flat with a hairline. |
| `shadow-card` | `0 1px 2px rgb(12 17 22 / .04), 0 1px 1px rgb(12 17 22 / .03)` | none | Optional resting lift on light |
| `shadow-raised` | `0 2px 4px rgb(12 17 22 / .06), 0 16px 40px -12px rgb(12 17 22 / .22)` | `0 16px 40px -12px rgb(0 0 0 / .7)` | Things that float: Inquire dock, mobile menu, screenshot frames |

Only floating elements get a real shadow, which helps them read as floating. In dark
mode, depth comes from stepping `bg → surface → surface-2`.

## 5. Motion

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 120ms | Color, border, opacity on hover/press |
| `--duration-base` | 180ms | Small transforms (arrow nudge, menu open) |
| `--duration-slow` | 280ms | Dock show/hide |
| `--duration-reveal` | 560ms | Section reveal on enter |
| `ease-out-quart` (Tailwind) | `cubic-bezier(0.25, 1, 0.5, 1)` | Default easing |

- Animate `transform` and `opacity` only. List properties explicitly; never
  `transition: all`.
- **Section reveal:** when a section first enters the viewport, its statement and
  content fade in and rise 12px, once, staggered 80ms across at most 3 items. It is
  progressive enhancement: content is visible without JS, and the hidden start state
  is applied only by a class that JS adds.
- **Timeline progress:** the "How I work" line may fill as the section scrolls
  (a `scaleX`/`scaleY` transform driven by `IntersectionObserver` or CSS scroll-driven
  animation). The page never pins, snaps or hijacks scrolling.
- Hover: arrows nudge 4px, cards shift border color, buttons change fill.
- `prefers-reduced-motion: reduce`: no reveal (content simply present), no timeline
  animation, no smooth scroll (global rule already in place). Never rely on motion to
  convey meaning.

## 6. Components

All interactive elements: visible `:focus-visible` ring (2px `--ring`, 3px offset),
hover state that *increases* contrast, ≥ 44×44px touch target on mobile, and an
accessible name.

### Top bar

- Not sticky. 72px tall, transparent over the hero, no bottom border.
- Left: monogram + name (`label`, weight 500) linking home.
- Right: one quiet proof chip in `mono-sm` `text-faint` (e.g. `AWS · Security+
  certified`, facts only) and the theme toggle (icon button, `aria-label` +
  `aria-pressed`).
- Navigation lives in the dock, not here.

### Inquire dock (the one persistent CTA)

- A floating pill fixed bottom-center (`bottom: max(16px, env(safe-area-inset-bottom))`),
  `rounded-full`, `shadow-raised`. It uses `.band-inverse` colors in light mode and
  `surface-2` + `border-line` in dark mode.
- Contents (desktop): section links in `label` `text-muted` → `text-ink` (Work, How I
  work, About), then the **Inquire** button: accent fill, `accent-fg` text,
  `rounded-full`, 40px tall, trailing →. It links to `#inquire`.
- Mobile: menu icon button (opens the full link list above the dock, Esc closes and
  returns focus) + Inquire.
- It is a `<nav aria-label="Primary">` placed early in the DOM (right after the skip
  link), so keyboard and screen-reader users reach it first even though it is drawn
  at the bottom. Current section: `aria-current="true"` + accent dot.
- It slides out of view (280ms, transform) while the inquiry form itself is on screen,
  and never covers focused content (`scroll-padding-bottom`).
- "Inquire" is the only label for this action site-wide. Retire "Work With Me".

### Hero

- Centered statement, up to ~16ch wide, at `display` size: two-tone, e.g. "I build
  AI systems that ship. *From prototype to production.*" The name sits above it in
  `mono-label` (or as the eyebrow), not as the headline.
- Below: one `lead` sentence (who it's for), then **one** secondary link ("See the
  work ↓"). The Inquire dock is the primary CTA, so the hero has no second button.
- Availability: small status line (accent dot + `body-sm` `text-muted`) above the
  statement.
- Background: plain `bg`. At most a faint dot grid at ≤ 4% ink opacity, masked to
  fade out. No gradients, no glow.
- Height: at least 88svh on desktop so the statement owns the first screen.

### Proof strip

- An inverse band directly under the hero: 3–4 readout tiles in a row (2×2 on
  mobile). Each tile: `readout` number (mono, `tabular-nums`) + `mono-label` caption
  + a link to the case study it came from.
- **Real numbers only, each traceable to a case study.** No "10+ years", ratings,
  "100% satisfaction" or totals that can't be checked.

### Buttons

| Variant | Fill | Text | Border | Hover |
|---|---|---|---|---|
| Primary (Inquire, Send Inquiry) | `accent` | `accent-fg` | none | `accent-hover` |
| Secondary | transparent | `ink` | `line-strong` | `surface-2` fill |
| Ghost | transparent | `muted` | none | `ink` text |
| Link | — | `accent` | underline 40% → 100% | `accent-hover` |

- `rounded-full`, `label` text, 44px tall (40px in the dock), padding `px-5`.
- Trailing icon (16px) for direction (→, ↗ for external, plus sr-only "(opens in a
  new tab)").
- Disabled: 60% opacity, `cursor-not-allowed`, no hover change. Submit stays enabled
  until the request starts; then shows "Sending…".
- Labels are specific Title Case verbs: "Inquire", "Send Inquiry", "Read Case Study".
- At most one primary button per screen besides the dock.

### Selected work (project rows)

- Each featured project is a full-width row, alternating sides on desktop: a
  **proof visual** (real screenshot in `rounded-panel`, or a readout tile with the
  project's headline metric) on one side; on the other, `mono-sm` meta (category ·
  year), `h3` title, a one-sentence outcome in `body-lg`, up to 5 stack tags and
  "Read Case Study →".
- 3–4 rows on the home page, then a quiet "All work →" link. The /work grid keeps
  compact cards (same tokens: `rounded-card`, hairline, hover border to `accent/50`).
- Whole row/card is one link via a stretched `::after` on the title link. Keyboard
  focus shows a ring on the container (`has-[a:focus-visible]:ring-2 ring-ring`).
  Keep this.
- Never invent metrics. If a project has no number, use its screenshot.

### How I work (timeline)

- Horizontal stepper on desktop (≥ `lg`), vertical list on mobile; an ordered list
  (`<ol>`) either way. Each step: `mono-label` time marker ("Week 0"), `h4` name,
  one-line `body-sm` description. A hairline connects the steps; the progress fill
  and the active dot use the accent.
- 4–5 steps, honest about how a solo engagement runs (see section 8).
- Optional engagement types (from Services) appear under the timeline as 2–4 short
  cards with what you get, not as a separate icon grid.

### Tags and chips

- **Stack tag:** `mono-sm`, `text-muted`, `bg-surface-2`, no border, `rounded-full`,
  padding 4px 10px. Lists use `<ul>` with an `aria-label`.
- **Category tag:** same shape, `bg-accent-soft`, `text-accent`.
- **Status badge** (e.g. "In progress"): category tag + 6px accent dot.
- **Filter chips** (/work): `label` text, `rounded-full`, `border-line-strong`;
  selected = accent fill + `accent-fg` with `aria-pressed="true"`. State is mirrored
  in `?category=`.
- Tags are not links unless they filter; if they filter, they are buttons.

### Inquiry form

- Lives in the closing inverse band, under a two-tone statement ("Tell me what you're
  building. *One short message is enough to start.*"), in a `surface` card
  (`rounded-card`, `shadow-raised` in light mode, padding 24 → 40px), max 640px wide.
- Labels above fields in `label`, `text-ink`; required marked with `*` (aria-hidden)
  plus native `required`; a "* Required" legend once.
- Inputs: 48px min height, `bg-bg`, `text-ink`, `border-line-strong`,
  `rounded-control`, padding 12px 16px. Placeholder `text-faint`, ends with `…`,
  shows an example. Focus: border `accent` + 2px ring (`ring-ring`).
- Correct `type`, `autocomplete`, `name`; `spellcheck="false"` on email. Selects get
  explicit `bg-bg text-ink`.
- Errors: inline under the field in `body-sm` `text-danger`, field border `danger`,
  `aria-invalid` + `aria-describedby`; form-level error in a `danger-soft` box with
  `role="alert"` that says what to do next. Focus the first invalid field on submit.
- Success replaces the form with a focused `role="status"` panel.
- Keep: honeypot, no-JS POST fallback, unsaved-changes warning. The section's id is
  `#inquire`.

### Section heading

`mono-label` eyebrow in `text-accent` → two-tone `h2` → optional `lead` (max 40rem).
64px to the section content. Centered for statement sections, left-aligned when
followed by a list or grid.

### Footer

- Inverse band, compact: name + one-line descriptor (`body-sm`), © year in `mono-sm`
  `text-faint`, social icon buttons (40px, `rounded-full`, sr-only labels), and text
  links to /work and the résumé PDF. One row on desktop, stacked on mobile.
- No link farms, newsletter forms or sitemap columns.

### Case-study page (for reference)

Header (eyebrow, two-tone `h1`, `lead`, links) → proof readouts (if the project has
metrics) → cover in `rounded-panel` → two columns at `lg`: content (`body-lg`, max
62ch) and a sticky "Project facts" `dl` card. Markdown is rendered with headings
demoted one level (see `src/lib/markdown-case-study.mjs`).

## 7. Writing voice (UI copy)

- First person singular ("I"), never the agency "we". Plain, specific, active:
  "Built a RAG service with enforced citations", not "Leveraged cutting-edge AI".
- Statements are short and period-terminated, in pairs: a claim, then its proof or
  consequence ("I build AI systems that ship. From prototype to production.").
- Lead with outcome and scope; quantify only with real numbers.
- Title Case for buttons and nav labels; sentence case for headings.
- Numerals for counts ("2 business days"), `…` not `...`.

## 8. Home page structure

Six sections, each one idea, with polarity changes at the key moments:

| # | Section | Band | One idea | Content (from the site today) |
|---|---|---|---|---|
| 1 | Hero | `bg` | Who I am and what I ship | Availability line; two-tone statement; one `lead`; "See the work ↓" |
| 2 | Proof | inverse | The work is measured | 3–4 readout tiles from real case-study results (below) |
| 3 | Selected work | `bg` | What I've built | 3–4 featured project rows → "All work →" |
| 4 | How I work | `surface` | What working with me looks like | Timeline + engagement types (replaces the Services grid) |
| 5 | About | `bg` | Who's accountable | Photo, short bio, experience timeline (condensed), certifications, résumé link |
| 6 | Inquire | inverse | Start a conversation | Two-tone statement + the inquiry form (`#inquire`) + direct email/LinkedIn |
| — | Footer | inverse (continues) | | Compact footer |

The Inquire dock is present on every screen; it hides only while section 6's form is
visible.

**Proof readouts (all from published case studies):**

| Readout | Caption | Source |
|---|---|---|
| `0.99` | Citation accuracy | Ask My Docs |
| `0.87 → 0.96` | Recall@5 with reranking | Ask My Docs |
| `6/6` | Out-of-scope questions refused | Ask My Docs |
| `2` | AWS + CompTIA Security+ certifications | Skills & certifications |

Replace or rotate these as new case studies add numbers; three of four from one
project is acceptable at launch but should diversify.

**How I work (draft steps, to be confirmed against real practice):**

1. **Day 0: Message.** You describe the problem in a few lines; I reply within 2
   business days.
2. **Week 1: Scope.** A call and a written one-page plan: goal, constraints, success
   measure, timeline.
3. **Weeks 1–2: Prototype.** A working slice on real data, so decisions are made on
   something you can use.
4. **Build.** Production engineering with tests, evaluation and weekly demos.
5. **Handover.** Docs, runbooks and a walkthrough, so your team owns it.

## 9. Don'ts

- No purple/blue/pink gradients, mesh blobs, glows, pastel corner washes or
  "aurora" backgrounds.
- No generic 3-card hero ("Fast · Secure · Scalable") or icon-grid feature rows
  with vague claims.
- No stock photos, 3D renders, robot/brain/AI-sparkle imagery, LED/pixel novelty
  graphics or emoji as icons.
- No second accent color; no Tailwind palette colors in markup.
- No more than one CTA label for inquiries ("Inquire"); no competing primary buttons.
- No heavy drop shadows on static cards; no glassmorphism cards.
- No font weights above 600, no bold display type, no all-caps headings, no mono
  paragraphs.
- No scroll pinning, scroll-jacking, snap scrolling, parallax, typewriter effects or
  animated counters.
- No fake social proof: star ratings, unverifiable client counts, logo walls of
  companies I haven't worked with, skill bars/percentages.
- No agency voice ("we", "our team"), no buzzword copy.
- No light-gray text below 4.5:1 to look "subtle". Use `--faint`, which passes.
- Don't remove focus outlines, skip link, `aria-*` states or image dimensions while
  restyling.
