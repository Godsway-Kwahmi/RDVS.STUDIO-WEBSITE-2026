/**
 * RDVS STUDIO 2026 — Minimalist Controller
 * Benchmark: Minimalissimo (https://minimalissimo.com/)
 * Dynamic Randomized Slideshow (Picks random project images on each visit)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Master Catalog of Studio Projects & Imagery Pool
  const masterProjects = [
    {
      id: 'afg-hq',
      title: 'AFG Executive Headquarters',
      category: 'Space / Commercial Build — 2024',
      discipline: 'interiors',
      imageUrl: 'assets/images/afg-headquarters.jpg',
      projectUrl: 'afg.html',
      desc: 'A sculptured corporate reception and executive suite featuring bespoke faceted acoustics, continuous glass partitioning, and turnkey timber fabrication.',
      specs: {
        client: 'AFG Corporation',
        scope: 'Spatial Architecture, Interior Design & Turnkey Build',
        area: '1,450 sq.m',
        year: '2024',
        disciplines: ['Interior Architecture', 'Spatial Branding', 'Acoustic Engineering', 'General Construction']
      }
    },
    {
      id: 'hamlet-estate',
      title: 'Hamlet Contemporary Residence',
      category: 'Architecture / Residential — 2024',
      discipline: 'architecture',
      imageUrl: 'assets/images/hamlet-estate.jpg',
      projectUrl: 'hamlet.html',
      desc: 'Cantilevered geometric volumes with integrated nightscape illumination, balancing private sanctuaries with panoramic open-plan entertainment zones.',
      specs: {
        client: 'Private Client',
        scope: 'Architectural Concept & Photorealistic 3D VFX Visualization',
        area: '820 sq.m',
        year: '2024',
        disciplines: ['Architectural Design', '3D Photoreal Visualization', 'Landscape Integration']
      }
    },
    {
      id: 'dyv-dawn',
      title: 'DYV Mixed-Use Development',
      category: 'Urbanism / Concept — 2025',
      discipline: 'architecture',
      imageUrl: 'assets/images/dyv-dawn.jpg',
      projectUrl: 'dyv.html',
      desc: 'An iconic multi-tiered mixed-use urban gateway designed to maximize natural airflow, communal terrace courtyards, and sustainable coastal resilience.',
      specs: {
        client: 'DYV Holdings',
        scope: 'Urban Planning, Facade Engineering & 3D Cinematic Renderings',
        area: '24,000 sq.m',
        year: '2025',
        disciplines: ['Urban Planning', 'Facade Design', '3D Environmental Rendering']
      }
    },
    {
      id: 'hubtel-executive',
      title: 'Hubtel Executive Boardroom Wing',
      category: 'Workplace / Build — 2023',
      discipline: 'interiors',
      imageUrl: 'assets/images/hubtel-executive.jpg',
      projectUrl: 'hubtel.html',
      desc: 'An immersive technological executive sanctum pairing seamless acoustic wall paneling with custom-milled monolithic conference furnishings.',
      specs: {
        client: 'Hubtel Technologies',
        scope: 'Workplace Architecture, Custom Furniture & Millwork Build',
        area: '620 sq.m',
        year: '2023',
        disciplines: ['Corporate Workplace', 'Industrial & Furniture Design', 'Smart AV Integration', 'Construction']
      }
    },
    {
      id: 'barham-residence',
      title: '41 Barham Luxury Residence',
      category: 'Architecture / Private Residence — 2025',
      discipline: 'architecture',
      imageUrl: 'assets/images/barham-residence.jpg',
      projectUrl: 'barham.html',
      desc: 'A minimalist architectural volume embracing high-contrast warm materiality, double-height ceiling voids, and seamless indoor-outdoor courtyards.',
      specs: {
        client: 'Barham Group',
        scope: 'Architectural Design, Interior Styling & Execution',
        area: '1,100 sq.m',
        year: '2025',
        disciplines: ['Architectural Design', 'Interior Architecture', 'Lighting Engineering']
      }
    },
    {
      id: 'frontier-tower',
      title: 'Frontier Commercial Complex',
      category: 'Architecture / Commercial — 2025',
      discipline: 'architecture',
      imageUrl: 'assets/images/frontier-tower.jpg',
      projectUrl: 'frontier.html',
      desc: 'A striking vertical facade composition optimizing solar shading and environmental efficiency for high-density metropolitan commerce.',
      specs: {
        client: 'Frontier Properties',
        scope: 'Commercial Architecture & Photoreal Simulation',
        area: '16,500 sq.m',
        year: '2025',
        disciplines: ['Architectural Design', 'Structural Coordination', '3D VFX Simulation']
      }
    },
    {
      id: 'la-beach-towers',
      title: 'La Beach Towers Penthouse',
      category: 'Space / Interior Architecture — 2024',
      discipline: 'interiors',
      imageUrl: 'assets/images/la-beach-towers.jpg',
      projectUrl: 'labeach.html',
      desc: 'Panoramic coastal luxury interior framing expansive oceanic vistas through minimalist double-height glazing and bespoke low-slung joinery.',
      specs: {
        client: 'Private Residence',
        scope: 'Luxury Interior Architecture & High-End 3D Visualization',
        area: '480 sq.m',
        year: '2024',
        disciplines: ['Interior Architecture', 'Lighting Design', 'Custom Furniture Specification']
      }
    },
    {
      id: 'mtn-corridor',
      title: 'MTN Headquarters Executive Wing',
      category: 'Space / Corporate Build — 2024',
      discipline: 'interiors',
      imageUrl: 'assets/images/mtn-corridor.jpg',
      projectUrl: 'mtn.html',
      desc: 'Continuous rhythm of warm timber fins and diffused recessed light guides circulation through executive conference suites.',
      specs: {
        client: 'MTN Group',
        scope: 'Executive Workplace Architecture & Turnkey Build',
        area: '950 sq.m',
        year: '2024',
        disciplines: ['Spatial Architecture', 'Acoustic Engineering', 'Millwork Construction']
      }
    },
    {
      id: 'onehive-center',
      title: 'OneHive Innovation Center',
      category: 'Visuals / Computational Design — 2025',
      discipline: 'vfx',
      imageUrl: 'assets/images/onehive.jpg',
      projectUrl: 'onehive.html',
      desc: 'A high-concept technology incubator pairing organic fluid contours with integrated digital display matrices and acoustic ceiling baffles.',
      specs: {
        client: 'OneHive Venture Studio',
        scope: 'Computational Concept Modeling & Cinematic 3D VFX',
        area: '1,800 sq.m',
        year: '2025',
        disciplines: ['Parametric Modeling', 'Lighting Simulation', 'Creative Direction']
      }
    },
    {
      id: 'purc-complex',
      title: 'PURC Institutional Complex',
      category: 'Architecture / Civic Build — 2023',
      discipline: 'architecture',
      imageUrl: 'assets/images/purc-facade.jpg',
      projectUrl: 'purc.html',
      desc: 'Monolithic civic architecture combining deep louvered facades, robust masonry massing, and monumental public entry porticos.',
      specs: {
        client: 'Public Utilities Regulatory Commission',
        scope: 'Architectural Design, Site Engineering & Construction Oversight',
        area: '3,200 sq.m',
        year: '2023',
        disciplines: ['Civic Architecture', 'Structural Engineering', 'General Construction']
      }
    },
    {
      id: 'abl-reception',
      title: 'ABL Corporate Reception',
      category: 'Space / Interior Millwork — 2023',
      discipline: 'interiors',
      imageUrl: 'assets/images/abl-reception.jpg',
      projectUrl: 'afg.html',
      desc: 'Minimalist commercial lobby blending linear slatted wall elements with monolithic reception counter architecture and concealed ambient illumination.',
      specs: {
        client: 'Accra Breweries Limited',
        scope: 'Interior Architecture & Bespoke Reception Millwork',
        area: '380 sq.m',
        year: '2023',
        disciplines: ['Interior Architecture', 'Joinery Fabrication', 'Lighting Design']
      }
    },
    {
      id: 'margin-suite',
      title: 'Margin Financial Suite',
      category: 'Space / Acoustic Build — 2024',
      discipline: 'interiors',
      imageUrl: 'assets/images/margin-bank.jpg',
      projectUrl: 'hubtel.html',
      desc: 'Precision banking suite designed with acoustic baffle ceilings, private consultation pods, and brushed architectural bronze detailing.',
      specs: {
        client: 'Margin Financial Group',
        scope: 'Commercial Interior Fit-Out & Acoustic Architecture',
        area: '540 sq.m',
        year: '2024',
        disciplines: ['Corporate Architecture', 'Acoustic Engineering', 'Custom Metalwork']
      }
    },
    {
      id: 'afg-boardroom',
      title: 'AFG Executive Boardroom',
      category: 'Space / Workplace — 2024',
      discipline: 'interiors',
      imageUrl: 'assets/images/afg-meeting.jpg',
      projectUrl: 'afg.html',
      desc: 'A 24-seat conference sanctum engineered with acoustic fabric paneling, integrated conferencing tech, and continuous shadow-line ceilings.',
      specs: {
        client: 'AFG Corporation',
        scope: 'Boardroom Interior & Smart Systems Integration',
        area: '210 sq.m',
        year: '2024',
        disciplines: ['Interior Design', 'Acoustic Architecture', 'Smart Automation']
      }
    },
    {
      id: 'afg-atrium',
      title: 'AFG Atrium Suite',
      category: 'Space / Spatial Design — 2024',
      discipline: 'interiors',
      imageUrl: 'assets/images/afg-reception-2.jpg',
      projectUrl: 'afg.html',
      desc: 'Dramatic high-ceiling arrival gallery highlighting polished terrazzo flooring, linear light coves, and fluted timber wall finishes.',
      specs: {
        client: 'AFG Corporation',
        scope: 'Atrium Architecture & Architectural Lighting',
        area: '420 sq.m',
        year: '2024',
        disciplines: ['Interior Architecture', 'Lighting Engineering']
      }
    },
    {
      id: 'hamlet-bath',
      title: 'Hamlet Master Sanctuary',
      category: 'Interiors / Residential Spa — 2024',
      discipline: 'interiors',
      imageUrl: 'assets/images/hamlet-bath.jpg',
      projectUrl: 'hamlet.html',
      desc: 'Monolithic fluted stone surfaces framing a freestanding soaking tub with floor-to-ceiling glass looking onto a private Japanese stone courtyard.',
      specs: {
        client: 'Private Residence',
        scope: 'Luxury Bathroom Architecture & Material Curation',
        area: '65 sq.m',
        year: '2024',
        disciplines: ['Interior Architecture', 'Stone Engineering', 'Lighting']
      }
    },
    {
      id: '2gs-identity',
      title: '2GS Identity & Spatial Branding',
      category: 'Branding / Graphic Design — 2024',
      discipline: 'graphics',
      imageUrl: 'assets/images/2gs-branding.jpg',
      projectUrl: 'work.html',
      desc: 'A comprehensive brand identity system, tactile stationery suites, and environmental typography integrated into corporate headquarters.',
      specs: {
        client: '2GS Security Group',
        scope: 'Brand Architecture, Graphic Design & Environmental Signage',
        area: 'Corporate Suite',
        year: '2024',
        disciplines: ['Graphic Design', 'Brand Strategy', 'Environmental Graphics']
      }
    },
    {
      id: '1957-interior',
      title: '1957 Monochrome Residence',
      category: 'Interiors / Minimalism — 2024',
      discipline: 'interiors',
      imageUrl: 'assets/images/1957-interior.jpg',
      projectUrl: 'work.html',
      desc: 'A masterclass in quiet luxury, featuring continuous off-white microcement surfaces, recessed linear reveal details, and low-profile European furniture.',
      specs: {
        client: 'Private Client',
        scope: 'Interior Architecture & Minimalist Furniture Styling',
        area: '340 sq.m',
        year: '2024',
        disciplines: ['Interior Design', 'Minimalist Architecture', 'Joinery']
      }
    },
    {
      id: 'brownies-place',
      title: 'Brownies Place Retreat',
      category: 'Architecture / Residential — 2024',
      discipline: 'architecture',
      imageUrl: 'assets/images/brownies-place.jpg',
      projectUrl: 'work.html',
      desc: 'Subtropical modern villa balancing open cross-ventilated living pavilions with natural teak decking and expansive infinity water features.',
      specs: {
        client: 'Private Client',
        scope: 'Architectural Concept & Photorealistic 3D Simulation',
        area: '680 sq.m',
        year: '2024',
        disciplines: ['Architectural Design', '3D Simulation', 'Landscape Design']
      }
    },
    {
      id: 'fule-residence',
      title: 'Fule Residence Villa',
      category: 'Architecture / Contemporary — 2024',
      discipline: 'architecture',
      imageUrl: 'assets/images/fule-residence.jpg',
      projectUrl: 'work.html',
      desc: 'Stacked linear volumes with deep architectural overhangs, tinted solar control glazing, and seamless ground-level garden terraces.',
      specs: {
        client: 'Private Family',
        scope: 'Architectural Planning & Visual Effects Modeling',
        area: '750 sq.m',
        year: '2024',
        disciplines: ['Architectural Design', 'CGI Visualization']
      }
    },
    {
      id: 'funko-ridge',
      title: 'Funko Ridge Coastal Concept',
      category: 'Urbanism / Masterplan — 2025',
      discipline: 'architecture',
      imageUrl: 'assets/images/funko-ridge.jpg',
      projectUrl: 'work.html',
      desc: 'Terraced hillside residential enclave contoured to natural topographic gradients, minimizing site impact and optimizing panoramic ocean views.',
      specs: {
        client: 'Ridge Estates Ltd',
        scope: 'Topographic Masterplan & Environmental 3D Modeling',
        area: '45,000 sq.m',
        year: '2025',
        disciplines: ['Masterplanning', 'Environmental Architecture', 'Cinematic VFX']
      }
    },
    {
      id: 'npa-office',
      title: 'NPA Corporate Open Office',
      category: 'Space / Workplace — 2024',
      discipline: 'interiors',
      imageUrl: 'assets/images/npa-office.jpg',
      projectUrl: 'work.html',
      desc: 'High-density activity-based workplace layout integrating custom felt sound barriers, biophilic planters, and collaborative team benches.',
      specs: {
        client: 'National Petroleum Authority',
        scope: 'Workplace Strategy, Spatial Architecture & Millwork',
        area: '1,200 sq.m',
        year: '2024',
        disciplines: ['Workplace Design', 'Ergonomic Space Planning', 'Construction']
      }
    },
    {
      id: 'nyla-closet',
      title: 'Nyla Bespoke Dressing Suite',
      category: 'Interiors / Millwork — 2024',
      discipline: 'interiors',
      imageUrl: 'assets/images/nyla-closet.jpg',
      projectUrl: 'work.html',
      desc: 'Handcrafted smoked oak wardrobes with internal perimeter LED channels, smoked glass doors, and tailored suede jewelry displays.',
      specs: {
        client: 'Private Residence',
        scope: 'Bespoke Joinery Design & Fine Woodworking Fabrication',
        area: '45 sq.m',
        year: '2024',
        disciplines: ['Custom Millwork', 'Interior Styling', 'Lighting Engineering']
      }
    }
  ];

  // Fisher-Yates Array Shuffle
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Base projects pool
  let allPool = [...masterProjects];

  // Try to load dynamic Sanity content if configured and merge
  if (window.RDVSSanity && window.RDVSSanity.isConfigured()) {
    try {
      const sanityHero = await window.RDVSSanity.getHeroProjects();
      if (sanityHero && sanityHero.length > 0) {
        const formattedSanity = sanityHero.map((p, idx) => ({
          id: p._id || `sanity-project-${idx}`,
          title: p.title,
          category: p.category,
          discipline: p.discipline || 'architecture',
          imageUrl: p.imageUrl || masterProjects[idx % masterProjects.length].imageUrl,
          projectUrl: 'work.html',
          desc: p.description || '',
          specs: {
            client: p.client || 'Commissioned Project',
            scope: p.scope || 'Design + Build',
            area: p.area || '—',
            year: p.year || '2026',
            disciplines: p.disciplines || ['Architecture']
          }
        }));
        allPool = [...formattedSanity, ...allPool];
        console.log('[RDVS Sanity] Live hero projects connected:', formattedSanity.length);
      }
    } catch (e) {
      console.warn('[RDVS Sanity] Falling back to default project pool:', e);
    }
  }

  // Pick 10 completely random project images on each user visit/refresh
  const projects = shuffleArray(allPool).slice(0, 10);

  // DOM Elements
  const slides = document.querySelectorAll('.slide');
  const captionCards = document.querySelectorAll('.caption-card');
  const paginationBars = document.querySelectorAll('.pagination-bar');
  const statusActive = document.querySelector('.status-active');
  const statusTotal = document.querySelector('.status-total');
  const prevBtn = document.querySelector('.step-btn.prev');
  const nextBtn = document.querySelector('.step-btn.next');
  const heroViewport = document.querySelector('.hero-viewport');

  // Spec Drawer Elements
  const specDrawer = document.getElementById('specDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerClose');
  const specTriggers = document.querySelectorAll('.project-spec-trigger');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerClient = document.getElementById('drawerClient');
  const drawerScope = document.getElementById('drawerScope');
  const drawerArea = document.getElementById('drawerArea');
  const drawerYear = document.getElementById('drawerYear');
  const drawerDisciplines = document.getElementById('drawerDisciplines');

  // Dynamically populate randomized slides into the DOM
  function populateRandomizedSlides() {
    projects.forEach((proj, idx) => {
      // 1. Update photographic slide image
      if (slides[idx]) {
        slides[idx].setAttribute('aria-label', proj.title);
        const img = slides[idx].querySelector('.slide-img');
        if (img) {
          img.src = proj.imageUrl;
          img.alt = proj.title;
        }
      }

      // 2. Update lower-third caption card
      if (captionCards[idx]) {
        const catEl = captionCards[idx].querySelector('.project-category');
        const titleEl = captionCards[idx].querySelector('.project-title');
        const descEl = captionCards[idx].querySelector('.project-desc');
        const actionLink = captionCards[idx].querySelector('.project-action-link');
        const specTrigger = captionCards[idx].querySelector('.project-spec-trigger');

        if (catEl) catEl.textContent = proj.category;
        if (titleEl) titleEl.textContent = proj.title;
        if (descEl) descEl.textContent = proj.desc;
        if (actionLink) {
          actionLink.href = proj.projectUrl || 'work.html';
          actionLink.innerHTML = 'View project &rarr;';
        }
        if (specTrigger) {
          specTrigger.setAttribute('data-index', idx);
        }
      }
    });
  }

  // Populate slides with the randomized selection immediately
  populateRandomizedSlides();

  let currentIndex = 0;
  const totalSlides = Math.min(slides.length, projects.length);
  const slideDuration = 6000;
  let autoPlayTimer = null;
  let progressInterval = null;
  let progressStartTime = 0;

  function initCarousel() {
    if (statusTotal) {
      statusTotal.textContent = String(totalSlides).padStart(2, '0');
    }
    updateSlide(0);
    startAutoPlay();
    setupEventListeners();
  }

  function updateSlide(newIndex) {
    if (newIndex < 0) {
      currentIndex = totalSlides - 1;
    } else if (newIndex >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = newIndex;
    }

    // Slides
    slides.forEach((slide, idx) => {
      if (idx === currentIndex) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    // Captions
    captionCards.forEach((card, idx) => {
      card.classList.toggle('active', idx === currentIndex);
    });

    // Hairline Pagination
    paginationBars.forEach((bar, idx) => {
      bar.classList.toggle('active', idx === currentIndex);
      const fill = bar.querySelector('.pagination-fill');
      if (fill) {
        fill.style.width = idx === currentIndex ? '0%' : (idx < currentIndex ? '100%' : '0%');
      }
    });

    // Counter (e.g. "01", "10")
    if (statusActive) {
      statusActive.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    resetProgressBar();
  }

  function resetProgressBar() {
    clearInterval(progressInterval);
    const activeBar = paginationBars[currentIndex];
    if (!activeBar) return;
    const activeFill = activeBar.querySelector('.pagination-fill');
    if (!activeFill) return;

    progressStartTime = Date.now();
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - progressStartTime;
      const progress = Math.min((elapsed / slideDuration) * 100, 100);
      activeFill.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 40);
  }

  function startAutoPlay() {
    stopAutoPlay();
    resetProgressBar();
    autoPlayTimer = setInterval(() => {
      updateSlide(currentIndex + 1);
    }, slideDuration);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    if (progressInterval) clearInterval(progressInterval);
  }

  function setupEventListeners() {
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        updateSlide(currentIndex - 1);
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        updateSlide(currentIndex + 1);
        startAutoPlay();
      });
    }

    paginationBars.forEach((bar) => {
      bar.addEventListener('click', () => {
        const targetIdx = parseInt(bar.getAttribute('data-index'), 10);
        updateSlide(targetIdx);
        startAutoPlay();
      });
    });

    if (heroViewport) {
      heroViewport.addEventListener('mouseenter', stopAutoPlay);
      heroViewport.addEventListener('mouseleave', startAutoPlay);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        updateSlide(currentIndex - 1);
        startAutoPlay();
      } else if (e.key === 'ArrowRight') {
        updateSlide(currentIndex + 1);
        startAutoPlay();
      } else if (e.key === 'Escape') {
        closeDrawer();
      }
    });

    // Touch Swipe Handling
    let touchStartX = 0;
    let touchEndX = 0;

    if (heroViewport) {
      heroViewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroViewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) {
          updateSlide(currentIndex + 1);
          startAutoPlay();
        } else if (touchEndX > touchStartX + 50) {
          updateSlide(currentIndex - 1);
          startAutoPlay();
        }
      }, { passive: true });
    }

    // Drawer Listeners
    specTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        openDrawer(isNaN(idx) ? currentIndex : idx);
      });
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', closeDrawer);
    }

    // Mobile Navigation Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const primaryNav = document.querySelector('.primary-nav');
    if (mobileMenuBtn && primaryNav) {
      mobileMenuBtn.addEventListener('click', () => {
        primaryNav.classList.toggle('mobile-active');
        mobileMenuBtn.textContent = primaryNav.classList.contains('mobile-active') ? 'Close' : 'Menu';
      });
    }
  }

  function openDrawer(index) {
    const project = projects[index];
    if (!project) return;

    if (drawerTitle) drawerTitle.textContent = project.title;
    if (drawerClient) drawerClient.textContent = project.specs.client;
    if (drawerScope) drawerScope.textContent = project.specs.scope;
    if (drawerArea) drawerArea.textContent = project.specs.area;
    if (drawerYear) drawerYear.textContent = project.specs.year;

    if (drawerDisciplines) {
      drawerDisciplines.innerHTML = '';
      project.specs.disciplines.forEach(item => {
        const span = document.createElement('span');
        span.className = 'spec-discipline-item';
        span.textContent = item;
        drawerDisciplines.appendChild(span);
      });
    }

    if (specDrawer) specDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('open');
    stopAutoPlay();
  }

  function closeDrawer() {
    if (specDrawer) specDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    startAutoPlay();
  }

  initCarousel();
});
