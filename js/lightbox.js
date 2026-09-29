/**
 * RDVS STUDIO 2026 — Minimalist Fullscreen Lightbox
 * Displays uncropped full-resolution project photography with proportion preservation
 * Keyboard, touch swipe, and pointer navigation
 */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Only run on pages that have project images
    const projectImages = Array.from(document.querySelectorAll('.project-hero-img, .gallery-img, .project-detail-container img'));
    if (projectImages.length === 0) return;

    // Extract project title if present
    const projectTitleEl = document.querySelector('.project-page-title');
    const projectTitle = projectTitleEl ? projectTitleEl.textContent.trim() : 'Project Photography';

    // Build image catalog
    const imagesData = projectImages.map((img, idx) => ({
      index: idx,
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || `${projectTitle} — View ${idx + 1}`,
      element: img
    }));

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
            <span class="lightbox-title">${projectTitle}</span>
          </div>
          <button type="button" class="lightbox-close-btn" aria-label="Close fullscreen view">Close &times;</button>
        </div>

        <div class="lightbox-stage">
          <button type="button" class="lightbox-arrow prev" aria-label="Previous image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div class="lightbox-media-container" title="Click outside to close">
            <img src="" alt="" class="lightbox-active-img">
          </div>

          <button type="button" class="lightbox-arrow next" aria-label="Next image">
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
    const counterEl = lightboxEl.querySelector('.lightbox-counter');
    const captionEl = lightboxEl.querySelector('.lightbox-caption-text');
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

    function showImage(idx) {
      if (idx < 0) idx = total - 1;
      if (idx >= total) idx = 0;
      currentIndex = idx;

      const item = imagesData[currentIndex];
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

    function openLightbox(idx) {
      showImage(idx);
      lightboxEl.classList.add('open');
      lightboxEl.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightboxEl.classList.remove('open');
      lightboxEl.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Attach click listeners to each page image
    imagesData.forEach(item => {
      item.element.addEventListener('click', () => {
        openLightbox(item.index);
      });
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

    // Click backdrop / media container to close (unless clicking the image itself)
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
