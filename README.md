Engagement invitation microsite

Overview

This is a lightweight, single-page microsite for the engagement of Lakshmikanth & Maanya (13 Oct 2025, 12:30 PM IST).

Files
- index.html — main page
- styles.css — design tokens and layout
- script.js — countdown (IST), terminal typing effect, share and calendar ICS download
- assets/og.svg — open graph image (SVG)

How to run

Open `index.html` in a static server or your browser. For local testing, from the project root run:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Publish to GitHub Pages

- Push the repository to GitHub under your user/org (e.g., `l-akshmikanth/engagement-invitation`).
- In the repository Settings → Pages, choose the `main` branch and the root (`/`) folder as the site source.
- After a minute the site will be available at `https://<username>.github.io/engagement-invitation`.

Mobile compatibility notes

- The map iframe is responsive and lazy-loaded.
- Navigation collapses on small screens; consider adding a simple hamburger menu if you want visible nav on mobile.
- Fonts are loaded from Google Fonts; for faster mobile load consider self-hosting or using font-display:swap.

WordPress integration notes
- Use a lightweight theme (GeneratePress / Astra / Twenty Twenty-Four)
- Add the countdown and terminal block as a small custom block or use a plugin for custom HTML
- Enqueue one CSS and one JS file. Defer JS and use async where appropriate.
- Suggested plugins: WP Super Cache, Rank Math/Yoast, an image optimizer, Wordfence basic
- Remove emoji script and unused block styles for performance; disable XML-RPC if unnecessary.

Accessibility & SEO
- Landmarks: header/main/footer
- aria-live on countdown region
- Structured data: schema.org Event included in page head

Notes & TODO
- Replace placeholder hero photo with final images (optimized WebP/AVIF)
- Provide final copy for lunch note and dress preference if desired
- For production, minify CSS/JS and pre-render OG image to PNG 1200x630

License: content for private invitation. Feel free to adapt.
