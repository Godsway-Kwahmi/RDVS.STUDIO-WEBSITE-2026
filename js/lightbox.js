/**
 * RDVS STUDIO 2026 — Minimalist Fullscreen Lightbox
 * Displays uncropped full-resolution project photography with proportion preservation
 * Keyboard, touch swipe, and pointer navigation
 *
 * The gallery is a sequence of FRAMES, not a sequence of JPEGs: a project page that puts a film
 * in its gallery (the `gallery-item` <video> blocks on 19 pages as of 2026-10-07) has that film
 * play in the lightbox too, in page order, navigated by the same arrows, swipe and keys. The user
 * order was "for each of the lightbox on each project page that has images and videos, allow
 * light box to include videos in the lightbox gallery" — so the strip and the film are one deck,
 * and the hero stays out of it exactly as the hero still did.
 */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Gallery media only — the project hero is the page's own header, never a slide in its deck.
    const IMAGE_SELECTOR = '.gallery-img, .project-gallery-grid img, .gallery-item img, ' +
      '.product-gallery-grid img';
    const VIDEO_SELECTOR = '.gallery-video, .project-gallery-grid video, .gallery-item video, ' +
      '.product-gallery-grid video';

    let candidateNodes = Array.from(
      document.querySelectorAll(IMAGE_SELECTOR + ', ' + VIDEO_SELECTOR)
    );

    // Pages that predate the gallery-item contract still get their images, as before.
    if (candidateNodes.length === 0) {
      candidateNodes = Array.from(document.querySelectorAll(
        '.project-detail-container img, .product-detail-container img, ' +
        '.project-detail-container video, .product-detail-container video'
      ));
    }

    const isHeroMedia = (el) =>
      el.classList.contains('project-hero-img') ||
      el.classList.contains('project-hero-video') ||
      !!el.closest('.project-hero-media');

    const projectMedia = [];
    const seenElements = new Set();
    for (const el of candidateNodes) {
      if (isHeroMedia(el) || seenElements.has(el)) continue;
      seenElements.add(el);
      projectMedia.push(el);
    }

    // The deck is named by the page it sits on: a project page titles itself
    // .project-page-title, a product page .product-page-title.
    const pageTitleEl = document.querySelector('.project-page-title, .product-page-title');
    const pageTitle = pageTitleEl ? pageTitleEl.textContent.trim() : 'Project Photography';

    function mediaOf(el, idx) {
      const base = { index: idx, element: el, title: pageTitle };
      if (el.tagName === 'VIDEO') {
        // currentSrc is the cut the browser actually chose (a <source> child may beat the
        // element's own src); fall back to src, then to the first <source>.
        const sourceChild = el.querySelector('source[src]');
        const src = el.currentSrc || el.getAttribute('src') ||
          (sourceChild ? sourceChild.getAttribute('src') : '');
        return Object.assign(base, {
          kind: 'video',
          src: src,
          poster: el.getAttribute('poster') || '',
          alt: el.getAttribute('aria-label') || el.getAttribute('title') ||
            `${pageTitle} — Film ${idx + 1}`
        });
      }
      return Object.assign(base, {
        kind: 'image',
        src: el.getAttribute('src') || el.getAttribute('data-src'),
        poster: '',
        alt: el.getAttribute('alt') || `${pageTitle} — View ${idx + 1}`
      });
    }

    const imagesData = projectMedia.map(mediaOf).filter(item => !!item.src);
    // A film the page never named is still worth a real caption: number them among themselves,
    // not by their position in the whole deck.
    let filmOrdinal = 0;
    for (const item of imagesData) {
      if (item.kind !== 'video') continue;
      filmOrdinal += 1;
      if (!item.element.getAttribute('aria-label') && !item.element.getAttribute('title')) {
        item.alt = `${pageTitle} — Film ${filmOrdinal}`;
      }
    }
    const filmCount = filmOrdinal;

    if (imagesData.length === 0) return;


    // Inject Lightbox Modal DOM
    let lightboxEl = document.getElementById('minimalLightbox');
    if (!lightboxEl) {
      lightboxEl = document.createElement('div');
      lightboxEl.id = 'minimalLightbox';
      lightboxEl.className = 'minimal-lightbox';
      lightboxEl.setAttribute('role', 'dialog');
      lightboxEl.setAttribute('aria-modal', 'true');
      lightboxEl.setAttribute('aria-hidden', 'true');

      lightboxEl.innerHTML = `
        <div class="lightbox-header">
          <div class="lightbox-meta">
            <span class="lightbox-counter">01 / ${String(imagesData.length).padStart(2, '0')}</span>
            <span class="lightbox-divider">&mdash;</span>
            <span class="lightbox-title"></span>
          </div>
          <button type="button" class="lightbox-close-btn" aria-label="Close fullscreen view">Close &times;</button>
        </div>

        <div class="lightbox-stage">
          <button type="button" class="lightbox-arrow prev" aria-label="Previous view">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div class="lightbox-media-container" title="Click outside to close">
            <img src="" alt="" class="lightbox-active-img">
            <video class="lightbox-active-video" controls playsinline preload="metadata"></video>
          </div>

          <button type="button" class="lightbox-arrow next" aria-label="Next view">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div class="lightbox-footer">
          <p class="lightbox-caption-text"></p>
          <span class="lightbox-hint">ESC or click backdrop to close &middot; &larr; &rarr; arrows to navigate</span>
        </div>
      `;

      document.body.appendChild(lightboxEl);
    }

    const activeImg = lightboxEl.querySelector('.lightbox-active-img');
    const activeVideo = lightboxEl.querySelector('.lightbox-active-video');
    const counterEl = lightboxEl.querySelector('.lightbox-counter');
    const captionEl = lightboxEl.querySelector('.lightbox-caption-text');
    const titleEl = lightboxEl.querySelector('.lightbox-title');
    const closeBtn = lightboxEl.querySelector('.lightbox-close-btn');
    const prevBtn = lightboxEl.querySelector('.lightbox-arrow.prev');
    const nextBtn = lightboxEl.querySelector('.lightbox-arrow.next');
    const mediaContainer = lightboxEl.querySelector('.lightbox-media-container');

    let currentIndex = 0;
    const total = imagesData.length;

    // Hide arrows if only 1 image exists
    if (total <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }

    let currentVrViewer = null;
    // Inline gallery films keep buffering while the deck is open; park them and hand them back
    // on close so the page resumes exactly where it was.
    let parkedFilms = [];

    function stopFilm() {
      if (!activeVideo) return;
      try { activeVideo.pause(); } catch (e) { /* detached or blocked */ }
      activeVideo.style.display = 'none';
    }

    function hideVr() {
      const vrContainer = mediaContainer.querySelector('.lightbox-vr-container');
      if (vrContainer) vrContainer.style.display = 'none';
    }

    function parkInlineFilms() {
      parkedFilms = imagesData
        .filter(item => item.kind === 'video' && !item.element.paused)
        .map(item => item.element);
      parkedFilms.forEach(v => { try { v.pause(); } catch (e) { /* ignore */ } });
    }

    function releaseInlineFilms() {
      parkedFilms.forEach(v => { try { v.play().catch(() => {}); } catch (e) { /* ignore */ } });
      parkedFilms = [];
    }

    function showImage(idx) {
      if (idx < 0) idx = total - 1;
      if (idx >= total) idx = 0;
      currentIndex = idx;

      const item = imagesData[currentIndex];
      if (titleEl) titleEl.textContent = item.title;

      if (currentVrViewer) {
        currentVrViewer.destroy();
        currentVrViewer = null;
      }

      // A still whose filename says 360 has always opened in the panorama viewer; a FILM is only
      // routed there when the page itself flags it, because a screen capture OF a VR tour
      // (assets/videos/1hive/1hive-vr-tour.mp4) is a flat recording, not an equirectual source.
      const flagged360 = (item.element.getAttribute && item.element.getAttribute('data-360') === 'true') ||
        !!item.element.closest('.vr-360-container');
      const is360 = item.kind === 'image'
        ? ((item.src && (item.src.includes('360') || item.src.includes('vr-'))) || flagged360)
        : flagged360;

      if (is360 && window.VR360) {
        stopFilm();
        activeImg.style.display = 'none';
        let vrContainer = mediaContainer.querySelector('.lightbox-vr-container');
        if (!vrContainer) {
          vrContainer = document.createElement('div');
          vrContainer.className = 'lightbox-vr-container vr-360-container';
          vrContainer.style.width = '88vw';
          vrContainer.style.height = '72vh';
          vrContainer.style.maxWidth = '1400px';
          vrContainer.style.borderRadius = '4px';
          mediaContainer.appendChild(vrContainer);
        }
        vrContainer.style.display = 'block';
        currentVrViewer = window.VR360.create(vrContainer, {
          src: item.src,
          isVideo: /\.(mp4|webm)$/i.test(item.src),
          autoRotate: true,
          autoRotateSpeed: 0.03,
          showControls: true,
          showDpad: true,
          showZoom: true,
          showBadge: true,
          showDragHint: true
        });

        if (counterEl) {
          counterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
        }
        if (captionEl) {
          captionEl.textContent = item.alt;
        }
      } else if (item.kind === 'video') {
        hideVr();
        activeImg.style.display = 'none';
        if (activeVideo) {
          // Re-pointing src reloads the cut; muted is the only autoplay browsers allow without a
          // gesture, and the control bar is the gesture that unmutes it.
          if (activeVideo.getAttribute('src') !== item.src) activeVideo.src = item.src;
          if (item.poster) activeVideo.setAttribute('poster', item.poster);
          else activeVideo.removeAttribute('poster');
          activeVideo.muted = true;
          activeVideo.loop = false;
          activeVideo.style.display = 'block';
          activeVideo.style.opacity = '0';
          const play = () => { activeVideo.style.opacity = '1'; };
          activeVideo.addEventListener('loadeddata', play, { once: true });
          try {
            const p = activeVideo.play();
            if (p && p.catch) p.catch(play);      // blocked autoplay still shows the poster
          } catch (e) { play(); }
        }
        if (counterEl) {
          counterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
        }
        if (captionEl) {
          captionEl.textContent = item.alt;
        }
      } else {
        hideVr();
        stopFilm();
        activeImg.style.display = 'block';
        activeImg.style.opacity = '0';

        setTimeout(() => {
          activeImg.src = item.src;
          activeImg.alt = item.alt;
          if (counterEl) {
            counterEl.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
          }
          if (captionEl) {
            captionEl.textContent = item.alt;
          }
          activeImg.style.opacity = '1';
        }, 100);
      }
    }

    function openLightbox(idx) {
      parkInlineFilms();
      showImage(idx);
      lightboxEl.classList.add('open');
      lightboxEl.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      if (currentVrViewer) {
        currentVrViewer.destroy();
        currentVrViewer = null;
      }
      hideVr();
      stopFilm();
      activeImg.style.display = 'block';
      releaseInlineFilms();

      lightboxEl.classList.remove('open');
      lightboxEl.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Attach click listeners to each page frame.
    // A still opens where it was clicked. A film does NOT: its tile carries native player
    // controls and the click-to-play gesture belongs to them, so the film gets its own expand
    // button instead — keyboard-reachable, and the deck still reaches it with the arrows.
    imagesData.forEach(item => {
      if (item.kind !== 'video') {
        item.element.addEventListener('click', () => openLightbox(item.index));
        return;
      }
      const tile = item.element.closest('.gallery-item') || item.element.parentElement;
      if (!tile || tile.querySelector('.lightbox-film-expand')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lightbox-film-expand';
      btn.setAttribute('aria-label', `Open ${item.alt.split(':')[0].trim()} film fullscreen`);
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">' +
        '<polyline points="15 3 21 3 21 9"></polyline>' +
        '<polyline points="9 21 3 21 3 15"></polyline>' +
        '<line x1="21" y1="3" x2="13" y2="11"></line>' +
        '<line x1="3" y1="21" x2="11" y2="13"></line></svg>';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(item.index);
      });
      tile.appendChild(btn);
    });


    // Control Listeners
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
      });
    }

    // Click backdrop / media container to close (unless clicking the media itself)
    if (mediaContainer) {
      mediaContainer.addEventListener('click', (e) => {
        if (e.target === mediaContainer) {
          closeLightbox();
        }
      });
    }

    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl || e.target.classList.contains('lightbox-stage')) {
        closeLightbox();
      }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
      if (!lightboxEl.classList.contains('open')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showImage(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        showImage(currentIndex + 1);
      }
    });

    // Touch Swipe Navigation for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightboxEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 50) {
        showImage(currentIndex + 1);
      } else if (touchEndX > touchStartX + 50) {
        showImage(currentIndex - 1);
      }
    }, { passive: true });


  });
})();
