# MarkPDF

Open-source web app to write markdown, render it safely, and export to PDF in one click.

## Features

- Live markdown editor and preview
- Sanitized HTML output (`DOMPurify`)
- One-click PDF export (`html2pdf.js`)
- Runs fully in the browser (no backend required)
- Deployable on any static hosting platform

## Tech Stack

- React + TypeScript + Vite
- `marked` for markdown parsing
- `dompurify` for sanitization
- `html2pdf.js` for client-side PDF generation

## Local Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173` by default.

## Build

```bash
npm run build
npm run preview
```

## Deployment

This project outputs static files (`dist`), so it can be hosted on any static platform.

- Build command: `npm run build`
- Output directory: `dist`

### Example providers

- Cloudflare Pages
- GitHub Pages
- Netlify
- Vercel

### Optional: Cloudflare Pages CLI deploy

```bash
npm run build
npm run deploy:pages
```

## Open Source

- License: MIT
- Contributions via pull request are welcome. See `CONTRIBUTING.md`.

## Security Note

This project sanitizes rendered markdown before injecting HTML into the preview.
Security headers are defined in `public/_headers` (supported by Cloudflare Pages; use equivalent headers on other hosts).
