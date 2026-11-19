# sirpreetdhillon — portfolio & client inquiries

One-page portfolio (for recruiters) plus services and an inquiry form (for freelance clients), built with **Astro (static) + TypeScript + Tailwind CSS v4**. All content lives as Markdown/JSON in this repo, validated by Zod schemas at build time. There is no server and no database.

```
src/
  content.config.ts        ← schemas for projects / services / experience
  content/projects/*.md    ← one file per case study  →  /work/<slug>/
  content/services/*.md    ← the 4 service cards
  content/experience/*.md  ← timeline entries
  data/site.json           ← name, headline, bio, socials, resume, booking link,
                             current work, skills, contact form provider
  components/  layouts/  pages/  lib/  styles/
public/                    ← static files (images, resume.pdf, favicons, og image)
scripts/new-project.mjs    ← `npm run new-project`
scripts/generate-images.mjs← `npm run og` (favicons, OG card, resized headshot)
.pages.yml                 ← Pages CMS config (edit content from a browser/phone)
.github/workflows/node.js.yml ← build + deploy to GitHub Pages
```

## Quick start

```bash
npm install
```

```bash
npm run dev        # http://localhost:4321
```

```bash
npm run build      # validates all content, outputs static site to dist/
```

```bash
npm run check      # TypeScript + Astro diagnostics
```

Requires Node 22.12+ (CI uses Node 24).

## Before sharing the site

Projects come from my GitHub repos, and experience matches my LinkedIn (Nov 2026). Before sharing widely:

- **Resume**: put your PDF at `public/resume.pdf`. The resume link stays hidden until that file exists.
- **Booking link**: set `bookingUrl` in `site.json` (Calendly, Cal.com, etc.). It stays hidden while empty.
- **Photo**: `public/images/headshot.jpg` is used through a 480px optimized copy. After replacing it, run `npm run og`. If you clear `photo`, a placeholder box is shown instead.
- **Name, headline, or monogram changed?** Run `npm run og` to regenerate the favicon and the social share image.

---

## Adding a project (pick one, each takes under 5 minutes)

Every project file has these fields. A missing required field or a wrong type **fails the build**, so a broken file can't be deployed.

| field | required | notes |
|---|---|---|
| `title` | ✓ | |
| `slug` | ✓ | lowercase-kebab-case; the URL is `/work/<slug>/` |
| `summary` | ✓ | one line, ≤160 chars |
| `industry` | ✓ | anonymized, e.g. "professional services firm" |
| `category` | ✓ | `AI/LLM` · `Full-stack` · `Data` · `Cloud/Architecture` · `Systems/Edge` |
| `year` | ✓ | number |
| `role`, `problem`, `solution`, `outcome` | ✓ | |
| `stack` | ✓ | list, at least 1 item |
| `featured` | | `true` shows it on the homepage (default `false`) |
| `order` | | lower numbers come first (default `100`) |
| `confidential` | | `true` hides repo/demo links and the cover image, and shows an NDA badge |
| `cover`, `coverAlt` | | `/images/projects/x.png` (file in `public/`); alt text is required when a cover is set |
| `links.repo`, `links.demo` | | full URLs |
| `draft` | | `true` hides it from production builds (it still shows in `npm run dev`) |

The Markdown **below** the front matter is optional. If present, it appears as a "Deep dive" section on the case-study page.

### 1. From a browser or phone: Pages CMS

1. Go to **https://app.pagescms.org** and sign in with GitHub.
2. Authorize access to `siri-dhillon/siri-dhillon.github.io` (first time only).
3. Open **Projects → Add an entry**, fill in the form, and click **Save**.

Saving commits straight to `main`. The workflow then builds and deploys in about a minute. Images uploaded in the CMS go to `public/images/`. The CMS form fields come from `.pages.yml`. If you change a schema in `src/content.config.ts`, update `.pages.yml` too.

### 2. From the terminal: the script

```bash
npm run new-project
```

The script asks for each field, writes `src/content/projects/<slug>.md`, and validates it with `astro sync`. An invalid file is removed. Then commit and push.

### 3. Manually

Copy an existing file in `src/content/projects/`, rename it to `<slug>.md`, and edit it. Run `npm run build` to validate.

Services (`src/content/services/`) and experience entries (`src/content/experience/`) work the same way. Each has its own schema in `src/content.config.ts`.

---

## Changing the inquiry-form provider

The form is plain HTML that POSTs `multipart/form-data`. JavaScript adds an in-page success state, and the form still submits without it. All settings are in `src/data/site.json` → `contact.form`:

```jsonc
"form": {
  "provider": "formspree",                         // formspree | web3forms | getform | custom
  "endpoint": "https://formspree.io/f/YOUR_FORM_ID",
  "accessKey": "",                                 // web3forms only
  "honeypotField": "_gotcha",                      // spam trap; ignored for web3forms (uses "botcheck")
  "projectTypes": [...], "budgets": [...], "timelines": [...]
}
```

- **Formspree (default):** create a form at formspree.io and paste its endpoint. Until you do, the submit button is disabled and a short note is shown.
- **Web3Forms:** `"provider": "web3forms"`, `"endpoint": "https://api.web3forms.com/submit"`, `"accessKey": "<your public key>"`.
- **Getform:** `"provider": "getform"`, `"endpoint": "https://getform.io/f/<id>"`.
- **Anything else** (your own Lambda, Basin, Netlify Forms…): `"provider": "custom"`. The endpoint must accept multipart POST and return 2xx (a JSON body with `success: false` counts as an error).

Fields sent: `name`, `email`, `project_type`, `budget`, `timeline`, `message`, a subject, and the honeypot. A filled honeypot shows a fake success message and sends nothing. To add a provider with different field names, edit `src/lib/form.ts`.

---

## Deployment

### GitHub Pages (current)

`.github/workflows/node.js.yml` runs on every push to `main`. It type-checks, validates content, builds, and deploys. Pull requests are built and checked but not deployed. One-time setup: **Settings → Pages → Source: GitHub Actions**.

The site reads only two variables, so nothing in the code is tied to a host:

| var | meaning | default |
|---|---|---|
| `SITE_URL` | public origin, used for canonical URLs, Open Graph tags, and the sitemap | `https://siri-dhillon.github.io` |
| `BASE_PATH` | sub-path, e.g. `/my-repo` for a project page | `/` |

On Pages, the workflow reads both values from the repo's Pages settings, so a custom domain is picked up automatically. Set repo **variables** named `SITE_URL` / `BASE_PATH` (Settings → Secrets and variables → Actions → Variables) to override them. Internal links all go through `href()` in `src/lib/paths.ts`, so a base path just works. One exception: images you embed in Markdown bodies use absolute `/images/...` paths, which assume `BASE_PATH=/`.

### Adding a custom domain (e.g. `sirpreetdhillon.com`)

1. At your DNS provider:
   - **Apex** `sirpreetdhillon.com`: `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (and optionally `AAAA` to `2606:50c0:8000::153` … `8003::153`).
   - **www**: `CNAME` record `www` → `siri-dhillon.github.io`.
2. In GitHub: **Settings → Pages → Custom domain** → enter the domain → Save, wait for the DNS check, then tick **Enforce HTTPS**.
3. Re-run the workflow (or push). `SITE_URL` now resolves to your domain automatically.

With Actions-based deploys, GitHub stores the domain in the Pages settings, not in a `CNAME` file. The `CNAME` file at the repo root is left over from the old setup and isn't used by this workflow.

### Migrating to Vercel

1. vercel.com → **Add New → Project** → import this repo. Vercel detects Astro (build command `npm run build`, output directory `dist`).
2. **Settings → Environment Variables:** `SITE_URL=https://yourdomain.com` (leave `BASE_PATH` unset).
3. Add your domain under **Settings → Domains** and point DNS where Vercel tells you.
4. Disable the GitHub Pages workflow (delete it, or change its trigger to `workflow_dispatch` only) so you aren't deploying to two hosts.

No code changes are needed. Pages CMS keeps working because it commits to the repo, and Vercel deploys on push.

### Migrating to AWS (S3 + CloudFront)

1. **S3:** create a private bucket, e.g. `sirpreetdhillon-site`, and keep *Block all public access* on.
2. **ACM:** request a certificate for `sirpreetdhillon.com` and `www.…` in **us-east-1** and validate it via DNS.
3. **CloudFront:** create a distribution with the bucket as origin, using **Origin Access Control (OAC)**. Apply the bucket policy CloudFront generates. Set alternate domain names and the ACM certificate, set default root object to `index.html`, and set viewer protocol to *Redirect HTTP to HTTPS*.
4. **Pretty URLs:** Astro outputs `work/index.html`, and S3 REST origins don't resolve directories. Add a **CloudFront Function** (viewer request):

   ```js
   function handler(event) {
     var r = event.request;
     if (r.uri.endsWith('/')) r.uri += 'index.html';
     else if (!r.uri.split('/').pop().includes('.')) r.uri += '/index.html';
     return r;
   }
   ```

5. **404s:** add a custom error response for 403 and 404 that returns `/404.html` with status 404.
6. **DNS:** point the domain at the distribution (Route 53 alias, or a CNAME at another provider).
7. **Deploy:**

   ```bash
   SITE_URL=https://sirpreetdhillon.com npm run build
   ```

   ```bash
   aws s3 sync dist/ s3://sirpreetdhillon-site --delete
   ```

   ```bash
   aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
   ```

   To automate this, replace the `deploy` job in the workflow with a job that uses `aws-actions/configure-aws-credentials` (OIDC role) and runs the last two commands.

---

## Quality notes

- Static HTML with very little JS: theme toggle, mobile menu, project filter, and form submit, each a small inline module.
- Light/dark mode follows the system setting, can be toggled, and the choice is saved per browser. The theme loads before first paint, so there's no flash.
- Accessibility: skip link, semantic landmarks and headings, visible focus rings, labeled form fields, `aria-pressed` filters, a live region for filter results, `prefers-reduced-motion` support, and AA-contrast color tokens (`src/styles/global.css`).
- SEO: per-page `<title>` and description, canonical URLs, Open Graph/Twitter cards (`public/og-default.png`; a project cover overrides it on that project's page), JSON-LD `Person`, `sitemap-index.xml`, and `robots.txt`.
