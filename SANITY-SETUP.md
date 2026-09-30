# RDVS Studio — Sanity CMS Setup Guide

## Quick Start

### 1. Create a Sanity account and project
1. Go to **[sanity.io](https://sanity.io)** and sign up (free plan is fine)
2. Click **"Create new project"** → name it `rdvs-studio`
3. Choose dataset name: `production`
4. Copy your **Project ID** from the project dashboard

### 2. Configure environment variables
```sh
# In the website root
cp .env.example .env
# Edit .env and paste your Project ID

# Also configure the Studio itself
cp studio/.env.example studio/.env.local
# Edit studio/.env.local and paste your Project ID
```

### 3. Install Studio dependencies
```sh
npm run setup
# or: cd studio && npm install
```

### 4. Launch the Studio (local)
```sh
npm run sanity:dev
# Opens at http://localhost:3333
```

### 5. Log in and start adding content
- The Studio runs at **http://localhost:3333**
- Sign in with your Sanity account
- Start creating **Projects**, **Slides**, **News posts**, etc.

---

## Content Types

| Type | Description |
|---|---|
| **Projects** | Portfolio work — title, images, gallery, specs, disciplines |
| **Homepage Slides** | Hero slideshow — wide landscape images with order control |
| **News & Journal** | Articles and project spotlights |
| **Services** | Expertise page content — descriptions and capabilities |
| **Team Members** | About page — name, role, photo, bio |
| **Site Settings** | Global — contact info, social links, studio name |

---

## Fetching Content

### Static build (recommended before deploy)
```sh
npm run content:fetch
```
Writes `data/sanity-content.json` — read by `js/sanity-live.js` or a future build script.

### Live preview (browser-side)
Include in any HTML page:
```html
<script src="js/sanity-live.js"></script>
```
Then update the `CONFIG.projectId` in `js/sanity-live.js` with your project ID.

---

## Deploying the Studio
```sh
npm run sanity:deploy
# Prompts for a hostname → e.g. rdvs-studio
# Studio will be live at https://rdvs-studio.sanity.studio
```

---

## Project Structure

```
studio/
  sanity.config.ts    ← Studio configuration
  structure.ts        ← Custom sidebar layout
  schemas/
    index.ts          ← Schema registry
    project.ts        ← Project / portfolio schema
    slide.ts          ← Homepage slide schema
    post.ts           ← News / journal schema
    service.ts        ← Services / expertise schema
    teamMember.ts     ← Team member schema
    siteSettings.ts   ← Global site settings (singleton)

scripts/
  fetch-content.js    ← Node script: Sanity → data/sanity-content.json

js/
  sanity-live.js      ← Browser-side live preview fetcher

data/
  sanity-content.json ← Generated (gitignored) — rebuilt before each deploy
```
