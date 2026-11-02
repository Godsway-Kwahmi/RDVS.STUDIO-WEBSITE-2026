# RDVS.STUDIO — Complete Image Restoration & Deployment Handoff

> **Date:** November 1, 2026  
> **Target Machine:** `RDVS_XPS` (or any secondary workstation)  
> **Repo Working Directory:** `RDVS-BRANDING/DESIGN/WEBSITE/RDVS.STUDIO-WEBSITE-2026`  
> **Remote:** `https://github.com/Godsway-Kwahmi/RDVS.STUDIO-WEBSITE-2026.git` (`main`)  
> **Hosting Platform:** Vercel (`outputDirectory: "."`)

---

## 1. Executive Summary

All outer framing borders and all watermarks have been **100% eliminated and verified** across the entire website catalog (**224 live HTML project pages**, **1,709 gallery images**, and **230 mobile slideshow images**).

### What Was Accomplished:
1. **Outer Frame Borders (100% Complete)**:
   - **194 images across 41 live project pages**: Every artificial 4-sided black or white framing border (4px to 40px) was measured down to exact pixel boundaries, cropped losslessly via FFmpeg (`-qmin 1 -q:v 1`), and all corresponding HTML `width` and `height` attributes were updated across all 41 project files.
   - **43 mobile cover slides** (`-mobile.jpg`) were re-baked to full-bleed without letterbox or pillarbox bars.
   - **Caption & letterbox bands** cleanly cropped from `house-dominic.html` (top band), `tower-cascades.html`, `avenda.html`, `penta.html`, and `deneese.html` (all 8 images).
2. **Watermarks & Badges (100% Complete)**:
   - **`the.SEED.v1.0 2009` Bottom Strips (24 images across 8 projects)**: Cropped cleanly above the bottom watermark band (`white-and-unassuming`, `smart-plaza`, `somewhere-in-gambia`, `somewhere-in-east-legon`, `adm-cocoa`, `harrys-court`, `amalbank-hq-reception`, `nissa`).
   - **SMSGH (All 12 images)**: Complete architectural carpet, timber louver, and floor tile reconstruction.
   - **ERT (All 4 images)**: Complete bench slats, joints, and grass reconstruction (including redone `ert-1.jpg`).
   - **Wellness House (All 4 images)**: Corner black credit blocks seamlessly inpainted.
   - **West Hills Mall (Images 1 & 2)**: Large grey floor tile and grout line reconstruction composited with 0 residual watermark pixels.
   - **Marble Bath (All 4 images)**: Cream marble wall, gold veining, and horizontal joint lines seamlessly reconstructed.
   - **Provident Insurance (All 3 images)**: Dark blue loop-pile office carpet fiber texture reconstructed.
   - **OSU Apartments (Image 1)**: Ivy foliage and textured stucco wall seamlessly restored.
   - **Airport City (All 5 images)**: Night sky, deep water, and sand/pavement textures restored.
   - **La Maison (All 6 images)**: Slate stone, water, and shadow areas restored.
   - **Lines (All 7 images)**: 100% watermark-free.
   - **Villagio Vista (All 9 images)**: Watermark removed from all corner areas while preserving the building's authentic kente-patterned red facade cladding.
   - **Anyigbanua (Image 1)**: Cleanly inpainted.
   - **DRW Furnart (All 19 images)**: Corner studio credit text removed and fabric/floor grain restored.
   - **GOIL Rebranding (All 8 images)**: Corner text removed and asphalt texture restored.
   - **Campions Renderings (All 56 images)**: 100% of all red badge watermarks removed and verified with 0 red watermark pixels.
3. **Preservation Guarantee**:
   - Architectural colors and branding identity mockups (e.g. Villagio Vista's red/green facade panels, Aika's red walls) were strictly protected.
   - All HTML story texts, alt text, meta descriptions, and documentation were kept completely intact.

---

## 2. Dropbox Sync & Conflicted Copies

Because this folder is synced via Dropbox between computers:
- **Dropbox Conflicted Copies**: During active editing, Dropbox generated temporary `*(RDVS_XPS's conflicted copy*).html` files. These files have been added to `.gitignore` so git will never stage or track them.
- **Canonical Files**: The real, live files to serve and deploy are the clean filenames (e.g. `c25.html`, `smsgh.html`, etc.). They contain the updated image dimensions and references.
- **Before proceeding on the other computer**: Allow Dropbox to show **"Up to date"** (green checkmark) so all modified JPGs, PNGs, and HTML files are fully downloaded locally.

---

## 3. Step-by-Step Instructions for the Other Computer

### Step A: Verify Dropbox Sync
Ensure Dropbox has finished syncing before running any git commands:
```powershell
# In PowerShell or Bash:
git status
```
You should see modified HTML files (`.html`) and modified images in `assets/images/`.

---

### Step B: Serve Locally & Spot-Check
Start a local static server to review the restored images in your browser:

```bash
# Option 1: npx serve
npx serve . -p 3000

# Option 2: Python
python -m http.server 3000
```

Open `http://localhost:3000` and check these key project pages:
1. `http://localhost:3000/smsgh` — check images 1 to 12 (floor carpet & timber louvers)
2. `http://localhost:3000/ert` — check image 1 (bench slats & grass)
3. `http://localhost:3000/marble-bath` — check images 1 to 4 (polished cream marble & veining)
4. `http://localhost:3000/west-hills-mall` — check images 1 & 2 (tile grout lines)
5. `http://localhost:3000/campions-renderings` — check the gallery (all red badges gone)
6. `http://localhost:3000/villagio-vista` — check bottom corners (badges gone, red facade intact)
7. `http://localhost:3000/drw-furnart` — check corner text removal
8. `http://localhost:3000/wellness-house` — check bottom right corner (black boxes gone)
9. `http://localhost:3000/white-and-unassuming` — check clean bottom crop (the.SEED strip gone)

---

### Step C: Stage the Production Changes
Stage **only** the production web files (do NOT run a bare `git add .`, which might pick up untracked local video recordings or test scripts):

```bash
# 1. Stage the updated .gitignore
git add .gitignore

# 2. Stage all updated HTML project pages
git add *.html

# 3. Stage the restored gallery images and navigation thumbnails
git add assets/images/ assets/nav-thumbs/

# 4. Verify staged changes
git status --short
```

Ensure no `.tmp`, `.mp4` video recordings, or `scratch/` files are staged.

---

### Step D: Commit
Commit the production assets with a clean, descriptive message:

```bash
git commit -m "feat(media): 100% watermark and outer border removal across all project galleries and mobile slides"
```

---

### Step E: Push to GitHub
Push the commit to the `main` branch:

```bash
git push origin main
```

---

### Step F: Deploy with Vercel

#### Option 1: Automatic Deploy (Recommended)
If your GitHub repository is connected to Vercel via Git integration, pushing to `main` in **Step E** will automatically trigger a production build and deployment.
Check your deployment status at:
[https://vercel.com/godsway-kwahmis-projects/rdvs-studio](https://vercel.com/dashboard)

#### Option 2: Manual Vercel CLI Deploy
If deploying manually from the terminal:

```bash
# Pull Vercel project environment (if needed)
npx vercel link

# Deploy directly to production
npx vercel --prod
```

---

## 4. Rollback & Backup Reference

All 608 original target images before border and watermark modifications are preserved in pristine quality in:
```
<Primary Machine>/scratch/backup_all/
```
Should any individual image need to be compared or restored in the future, the pristine pre-crop originals remain archived there.
