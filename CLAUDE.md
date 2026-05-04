# Boris Halas — www-boris-halas

## Dev Server

- **Port 3001** — always use `next dev --port 3001`. No other port.
- Production: https://borishalas.com
- Repo: `versalarchitect/boris-halas`
- Deployed via Vercel (auto-deploy on push to main)

## Design Spec — borishalas.com IS the source of truth

The live production site at https://borishalas.com is the **only** design reference. localhost:3001 must be pixel-identical to production at all times. Any change that would make the local site look or behave differently from what's currently live is wrong.

### What must NOT change without explicit approval:
- Left sidebar layout (logo top, nav links, Instagram/Share, copyright bottom)
- Horizontal-scrolling full-height photo galleries
- Fixed viewport model (`h-screen` + `overflow-hidden` on body)
- Typography (Helvetica Neue, current font sizes, letter-spacing, weights)
- Navigation structure (Around, Fashion, Editorial, Music, Somewhere, Store, Info)
- Store grid layout (horizontal scroll, product cards with SOLD OUT badges)
- Info page layout (centered photo + contact/follow below)
- Mobile layout (logo top-left, hamburger top-right, full-bleed gallery)
- Color scheme (white background, black text, minimal)
- Image presentation (no cropping, no borders, 3px gap between gallery images)

### Reference screenshots (captured 2026-05-03 from production)

Screenshots of every page at desktop (1920x1080) and mobile (390x844 iPhone) are in `.claude/design-spec/`:

**Gallery pages (horizontal scroll):**
- `home-desktop.png` / `home-mobile.png` — Around gallery (homepage)
- `fashion-desktop.png` / `fashion-mobile.png`
- `editorial-desktop.png` / `editorial-mobile.png`
- `music-desktop.png` / `music-mobile.png`
- `somewhere-desktop.png` / `somewhere-mobile.png`

**Store:**
- `store-desktop.png` / `store-mobile.png` — product grid (horizontal scroll)
- `store-ryoko-desktop.png` / `store-ryoko-mobile.png` — product detail
- `store-book-desktop.png` / `store-book-mobile.png`
- `store-cap-pink-desktop.png` / `store-cap-pink-mobile.png`
- `store-cap-green-desktop.png` / `store-cap-green-mobile.png`

**Info:**
- `info-desktop.png` / `info-mobile.png` — bio photo + contact

When in doubt, open the screenshot. If localhost:3001 doesn't match, it's wrong.

### Store layout rule:
The distance (gap) between product images/cards must be the same on mobile and desktop for consistency. Do not use different gap values at different breakpoints.

### CMS rule:
The CMS replaces hardcoded data with dynamic data. It does NOT change any frontend layout, CSS, component structure, or visual behavior. If a CMS feature would require altering the frontend, flag it instead of changing it.
