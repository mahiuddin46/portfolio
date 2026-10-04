# mahiuddinahmed.com

Personal site for Mahi Uddin Ahmed — digital builder, e-commerce, growth.

Hand-written static site. No framework, no build step, no dependencies.
Three files do the work: `index.html`, `assets/css/site.css`, `assets/js/site.js`.

## Run it

Nothing to install. Any static server works:

```bash
cd portfolio
python3 -m http.server 8000
# → http://localhost:8000
```

Opening `index.html` directly via `file://` will not work, because every asset
path is root-relative (`/assets/...`). Use a server.

## Deploy it

Upload the contents of this folder to the web root. That's the whole deploy.

- **cPanel / shared hosting** — drop everything into `public_html/`.
- **Vercel / Netlify / Cloudflare Pages** — drag the folder in, or point it at the repo. No build command, no output directory.

It works on any host that serves files. See "Hosting" in `CONTENT-TODO.md`
for whether your current host is fast enough.

### Server config worth adding

Long-cache the fingerprinted assets, short-cache the HTML. On Apache/cPanel,
an `.htaccess` in the web root:

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
```

If you change `site.css` or `site.js` after that, bump the query string in
`index.html` (`site.css?v=2`) so browsers pick up the new file.

## Structure

```
index.html              all content, in document order
assets/
  css/site.css          design tokens → sections, in page order
  js/site.js            ~110 lines: spotlight, nav, reveals, magnetic button
  fonts/                4 woff2 files, self-hosted (84 KB total)
  img/                  portraits (avif + webp), og.png, favicon.svg
robots.txt
sitemap.xml
```

### Editing content

All copy lives in `index.html` as plain HTML — there is no CMS and no data
file to keep in sync. Search for the section comment (`<!-- ===== WORK ===== -->`)
and edit in place.

### Design tokens

Everything visual is driven by the custom properties in `:root` at the top of
`site.css`. Changing `--amber` changes every accent on the page; changing
`--gut` changes every page margin; changing `--rhythm` changes the vertical
spacing between all sections.

### Adding a real screenshot to a project

Each project currently uses a hand-built browser frame (`.frame`) rather than a
screenshot. To swap in a real one, replace the `.frame__body` contents with:

```html
<img src="/assets/img/work/mynah-mart.webp" width="1600" height="1000"
     alt="The Mynah Mart storefront" loading="lazy" decoding="async">
```

and add `.frame__body{padding:0}` for that frame. Keep the `.frame__bar` — it
is what makes it read as a site rather than a floating image.

## Performance notes

- No JavaScript library. The entire script is ~3 KB unminified.
- Fonts are self-hosted woff2, latin subset, `font-display:swap`, two preloaded.
- Portraits ship as AVIF with WebP fallback, two widths each, correct `sizes`.
- The hero portrait is preloaded with a matching `imagesrcset`, everything
  below the fold is `loading="lazy"`.
- Animation is CSS; the only JS loop is the spotlight, which is `requestAnimationFrame`
  driven and stops as soon as the cursor settles.
- No layout shift: every `<img>` has explicit `width` and `height`.

## Accessibility

- Semantic landmarks, one `h1`, no skipped heading levels.
- Skip link, visible focus rings (`:focus-visible`, amber on dark / olive on ivory).
- `prefers-reduced-motion: reduce` disables the spotlight, the marquee, the
  entrance sequence and every reveal — the page renders fully static.
- The page is fully readable with JavaScript disabled.
