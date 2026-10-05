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

          // The meta line is read back by js/main.js's slide sync — "Typology / Service — Year ·
          // Client" — so rebuilding it here has to keep that shape and must not invent a default
          // service. It used to fall back to the literal string 'Architectural Design', which
          // would have relabelled every un-typed project on the page AND on its homepage slide.
          const metaEl = document.querySelector('.project-meta-line');
          if (metaEl && (project.typology || project.category || project.year)) {
            const typology = project.typology || project.category || '';
            // `disciplines` stores filter TOKENS ("architecture-planning"); the page shows the bar
            // LABEL ("Architectural Design"). Joining the raw tokens printed slugs in the meta line,
            // and js/main.js reads this line back as the slide's service, so the tokens leaked onto
            // the homepage too. The labels come from js/sanity-taxonomy.js, which is generated from
            // the same filter bar the tokens belong to.
            const tax = window.RDVSSanityTaxonomy;
            const list = Array.isArray(project.disciplines) && project.disciplines.length
              ? project.disciplines
              : (project.cardLabel ? [project.cardLabel] : []);
            const services = list.map(t => (tax ? tax.label(t) : t)).filter(Boolean).join(', ');
            const head = services ? `${typology} / ${services}` : typology;
            metaEl.textContent = `${head} — ${project.year || ''} · ${project.client || project.location || 'Studio'}`;
          }

          const heroImg = document.querySelector('.project-hero-img');
          if (heroImg && project.heroImageUrl) {
            heroImg.src = project.heroImageUrl;
          }

          const leadText = document.querySelector('.project-lead-text');
          if (leadText && project.lead) {
            leadText.textContent = project.lead;
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

          // Gallery hydration is opt-IN, not opt-out.
          //
          // It used to fire on every project page that did NOT carry `data-static-gallery`, and
          // only 2 of 142 pages did — so the first populated dataset would have replaced 140
          // curated galleries with `<img alt="… Architectural Detail">`, destroying the per-plate
          // alt text, the section dividers, the width/height attributes and the plate numbering
          // the Format row is checked against. A page now has to ask for it.
          if (Array.isArray(project.gallery) && project.gallery.length > 0) {
            const gallerySection = document.querySelector('.project-gallery-grid');
            if (gallerySection && gallerySection.getAttribute('data-cms-gallery') === 'true') {
              gallerySection.innerHTML = project.gallery.map(item => `
                <div class="gallery-item">
                  <img src="${item.url}" alt="${item.alt || project.title}" class="gallery-img" loading="lazy">
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
      //
      // Removed. It called getPageContent('about'), which queried `_type == "page"` — a document
      // type studio/schemas/ never defines — and then wrote to `.about-lead-statement`, a selector
      // that does not exist on about.html. Both halves were dead. If per-page editorial copy is
      // wanted, add a `page` type to the schema and a real hook element to the page first.
      if (isAbout) {
        const settings = await window.RDVSSanity.getSiteSettings();
        if (settings && settings.studioName) {
          const brand = document.querySelector('.brand-link');
          if (brand) brand.setAttribute('aria-label', settings.studioName);
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
