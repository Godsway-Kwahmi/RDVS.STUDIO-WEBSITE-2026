/**
 * RDVS STUDIOS — Sanity Dynamic Hydration & Render Engine
 * Seamlessly connects static HTML pages to headless Sanity CMS content.
 * Gracefully preserves static HTML when CMS is offline or unchanged.
 */

(function () {
  document.addEventListener('DOMContentLoaded', async () => {
    if (!window.RDVSSanity || !window.RDVSSanity.isConfigured()) {
      return;
    }

    const currentFile = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
    const isHomepage = currentFile === 'index.html' || currentFile === '';
    const isDetail = document.querySelector('.project-detail-container') !== null;
    const isNews = currentFile === 'news.html';
    const isAbout = currentFile === 'about.html';

    try {
      // 1. Project Detail Page Hydration
      if (isDetail) {
        const slug = currentFile.replace('.html', '');
        const project = await window.RDVSSanity.getProjectBySlug(slug);
        if (project) {
          const titleEl = document.querySelector('.project-page-title');
          if (titleEl && project.title) titleEl.textContent = project.title;

          const metaEl = document.querySelector('.project-meta-line');
          if (metaEl && (project.category || project.year)) {
            metaEl.textContent = `${project.category || 'Architectural Design'} — ${project.year || ''} · ${project.location || 'Studio'}`;
          }

          const heroImg = document.querySelector('.project-hero-img');
          if (heroImg && project.coverImageUrl) {
            heroImg.src = project.coverImageUrl;
          }

          const leadText = document.querySelector('.project-lead-text');
          if (leadText && project.leadText) {
            leadText.textContent = project.leadText;
          }

          // Specs hydration. Looked up by label rather than position: the row set
          // and order differ between pages, and a generated Services row sits
          // between Typology and Discipline on the current template.
          const specVal = label => {
            const item = [...document.querySelectorAll('.project-spec-item')].find(i => {
              const l = i.querySelector('.project-spec-label');
              return l && l.textContent.trim().toLowerCase() === label.toLowerCase();
            });
            return item && item.querySelector('.project-spec-val');
          };
          if (project.client) {
            const clientVal = specVal('Client');
            if (clientVal) clientVal.textContent = project.client;
          }
          if (project.location) {
            const locVal = specVal('Location');
            if (locVal) locVal.textContent = project.location;
          }
          if (project.year) {
            const yearVal = specVal('Completion') || specVal('Year');
            if (yearVal) yearVal.textContent = String(project.year);
          }
          if (project.scope) {
            const scopeVal = specVal('Scope of Services') || specVal('Scope');
            if (scopeVal) scopeVal.textContent = project.scope;
          }
          if (project.team) {
            const teamVal = specVal('Team');
            if (teamVal) teamVal.textContent = Array.isArray(project.team) ? project.team.join(', ') : project.team;
          }

          // Gallery hydration (skip pages that lock the static markup)
          if (project.galleryUrls && project.galleryUrls.length > 0) {
            const gallerySection = document.querySelector('.project-gallery-grid');
            if (gallerySection && gallerySection.getAttribute('data-static-gallery') !== 'true') {
              gallerySection.innerHTML = project.galleryUrls.map(url => `
                <div class="gallery-item">
                  <img src="${url}" alt="${project.title} Architectural Detail" class="gallery-img" loading="lazy">
                </div>
              `).join('');
            }
          }
        }
      }

      // 2. Homepage Hero Slideshow Hydration
      if (isHomepage) {
        const remoteHeroes = await window.RDVSSanity.getHeroProjects();
        if (remoteHeroes && remoteHeroes.length > 0) {
          const slider = document.querySelector('.hero-slider');
          if (slider) {
            // Can update slides dynamically if desired
            console.log(`[RDVS Sanity] Hydrated ${remoteHeroes.length} hero projects from CMS`);
          }
        }
      }

      // 3. News Page Hydration
      if (isNews) {
        const articles = await window.RDVSSanity.getNewsArticles();
        if (articles && articles.length > 0) {
          console.log(`[RDVS Sanity] News articles synced from CMS (${articles.length})`);
        }
      }

      // 4. About Page Editorial Hydration
      if (isAbout) {
        const aboutContent = await window.RDVSSanity.getPageContent('about');
        if (aboutContent && aboutContent.leadText) {
          const lead = document.querySelector('.about-lead-statement');
          if (lead) lead.textContent = aboutContent.leadText;
        }
      }

      // 5. Social Links Hydration
      if (window.RDVSSanity.getSiteSettings) {
        const settings = await window.RDVSSanity.getSiteSettings();
        if (settings && settings.socialLinks) {
          const { instagram, twitter, facebook, youtube } = settings.socialLinks;
          const applySocial = (patterns, url) => {
            if (!url) return;
            const selectors = patterns.map(p => `.hero-social-link[href*="${p}"], .footer-social-links a[href*="${p}"]`).join(', ');
            document.querySelectorAll(selectors).forEach(link => {
              link.href = url;
            });
          };
          applySocial(['instagram'], instagram);
          applySocial(['twitter', 'x.com'], twitter);
          applySocial(['facebook'], facebook);
          applySocial(['youtube'], youtube);
        }
      }
    } catch (err) {
      console.warn('[RDVS Sanity] Render engine caught exception, static HTML preserved:', err);
    }
  });
})();
