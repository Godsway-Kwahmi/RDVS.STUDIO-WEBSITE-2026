/**
 * RDVS STUDIO 2026 — Global Navigation & Theme Controller
 * Handles dark/light theme switching, responsive mobile navigation drawer,
 * accessibility attributes, outside-click dismissal, and active link states across all screen sizes.
 */

(function () {
  // --- Dark / Light Mode Theme Controller ---
  function initThemeToggle() {
    function updateThemeUI(theme) {
      const isDark = theme === 'dark';
      const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
      document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
      });
    }

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    updateThemeUI(currentTheme);

    // Event delegation for theme toggle button
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('.theme-toggle-btn');
      if (!toggleBtn) return;
      e.preventDefault();

      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', nextTheme);
      try {
        localStorage.setItem('rdvs-theme', nextTheme);
      } catch (err) {}

      updateThemeUI(nextTheme);
    });

    // Multi-tab synchronization
    window.addEventListener('storage', (e) => {
      if (e.key === 'rdvs-theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        document.documentElement.setAttribute('data-theme', e.newValue);
        updateThemeUI(e.newValue);
      }
    });

    // OS color scheme change listener (if user has not set an explicit override)
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        try {
          if (!localStorage.getItem('rdvs-theme')) {
            const osTheme = e.matches ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', osTheme);
            updateThemeUI(osTheme);
          }
        } catch (err) {}
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }

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

    // Automatically highlight active page link.
    // vercel.json now serves every page at BOTH /x and /x.html with no redirect, and the nav links
    // are written with the extension, so the pathname has to be normalised back to a file name —
    // otherwise landing on a clean URL like /work silently loses the active-page highlight.
    let currentPath = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
    if (!currentPath.endsWith('.html')) {
      currentPath += '.html';
    }
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
