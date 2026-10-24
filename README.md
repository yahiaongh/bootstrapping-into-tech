# Bootstrapping Into Tech — Responsive edition

A static educational website built with plain HTML, CSS, and JavaScript. No build step or framework is required.

## Responsive design changes
- Mobile-first layout with breakpoints for desktop, tablet, and narrow phones.
- Mobile navigation menu button with `aria-expanded`, keyboard support, and close-on-navigation behavior.
- One-column lesson cards and lesson content on narrow screens.
- Flexible typography using `clamp()`, responsive spacing, wrapping buttons, and overflow-safe code examples.
- Accessible focus indicators, skip links, and reduced-motion support.
- The same three lesson PDFs and interactive learning features.

## Run locally
From the project root:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000/`.

## Cloudflare Pages configuration
The repository root contains `index.html`, `assets/`, `lessons/`, and `pdfs/` directly.
- Framework preset: `None`
- Build command: `exit 0` (or leave the build command empty if Cloudflare allows it)
- Build output directory: `.`
- Root directory: repository root / blank

## Umami analytics setup
Each HTML page contains a commented placeholder snippet, so analytics remain inactive until configured. In Umami, add your website and copy the exact tracking snippet from its dashboard. Replace `YOUR_UMAMI_TRACKING_SCRIPT_URL` and `YOUR_UMAMI_WEBSITE_ID`, then uncomment the script in all five HTML files. Use the official docs at https://docs.umami.is/docs/collect-data.

Events implemented in `assets/js/main.js`:
- `pdf_download`
- `lesson_toc_click`
- `lesson_scroll_depth` (25, 50, 75, 90)
- `engaged_reading_30s` (30 seconds of accumulated visible-tab time)
- `practice_started`
- `answer_revealed`
- `quiz_completed` (broad correct/incorrect band; no selected answer sent)
- `next_lesson_click`
- `topic_interest_click`

Automatic Umami pageviews are left enabled; custom code does not send manual pageviews. The code does not intentionally transmit names, emails, student IDs, or free-text answers.

## Deploy
Keep the folder structure intact and deploy the repository root as a static site. Verify all lesson links, PDF downloads, the mobile menu, and quiz interactions on the live URL. Live Umami collection has not been verified because no real Website ID or tracking URL was provided.

## Privacy
Review privacy and consent requirements applicable to your deployment and audience before enabling analytics. The privacy page is a starting point, not a guarantee of legal compliance.
