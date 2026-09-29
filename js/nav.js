/**
 * RDVS STUDIO 2026 — Global Navigation Controller
 * Handles responsive mobile navigation drawer, accessibility attributes, 
 * outside-click dismissal, and active link states across all screen sizes.
 */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn') || document.querySelector('.mobile-toggle');
    const primaryNav = document.querySelector('.primary-nav');
    const siteHeader = document.querySelector('.site-header');

    if (!mobileMenuBtn || !primaryNav) return;

    // Set initial ARIA state
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-controls', 'primary-nav');
    primaryNav.id = primaryNav.id || 'primary-nav';

    function openMobileMenu() {
      primaryNav.classList.add('mobile-active');
      mobileMenuBtn.textContent = 'Close';
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }

    function closeMobileMenu() {
      primaryNav.classList.remove('mobile-active');
      mobileMenuBtn.textContent = 'Menu';
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }

    function toggleMobileMenu() {
      if (primaryNav.classList.contains('mobile-active')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    // Toggle on button click
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close when tapping any navigation link inside mobile drawer
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (primaryNav.classList.contains('mobile-active')) {
          closeMobileMenu();
        }
      });
    });

    // Close on click outside header
    document.addEventListener('click', (e) => {
      if (!primaryNav.classList.contains('mobile-active')) return;
      if (siteHeader && !siteHeader.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('mobile-active')) {
        closeMobileMenu();
      }
    });

    // Automatically highlight active page link
    const currentPath = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
    primaryNav.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkPath = href.split('?')[0].split('#')[0];
        if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
          link.classList.add('active');
        }
      }
    });
  });
})();
