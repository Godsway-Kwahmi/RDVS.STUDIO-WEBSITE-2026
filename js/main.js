/**
 * RDVS STUDIO 2026 — Minimalist Controller
 * Benchmark: Minimalissimo (https://minimalissimo.com/)
 * Dynamic Randomized Slideshow (Picks random project images on each visit)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Helper to format titles/services: lowercase except first letter capital; keep abbreviations uppercase
  const ABBREVIATIONS_SET = new Set([
    'AFG', 'DYV', 'ABL', 'MTN', 'PURC', 'HFC', 'WCIGL', 'HQ', 'VFX', 'TVC', 'VR',
    'AV', 'IGL', 'NPA', 'RLG', '2GS', '5AAP', 'BFA', 'SMSGH', 'C25', 'B1', 'DRW',
    'EHR', 'RDVS', 'CGI', '3D', 'AI', 'LED', 'FDR', 'US', 'UK', 'CEO', 'UCC', 'GT', 'MIG'
  ]);

  function formatServiceOrTitle(text) {
    if (!text) return '';
    return text.split(' ').map(w => {
      const cleanUpper = w.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
      if (ABBREVIATIONS_SET.has(cleanUpper)) {
        return w.replace(/[A-Za-z0-9]+/g, cleanUpper);
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');
  }

  // A homepage slide names only the MAIN services its project falls under — the eight on
  // work.html's filter bar. The sub-services a page links in its Services row roll up into these
  // and stay on the project page (user, 2026-10-04). Keys, never labels, are the identity: labels
  // get renamed, keys do not. scratch/_service_axis.py derives both tables from the bar and the
  // pages, and the harness fails if the copies below drift from either.
  const MAIN_SERVICE_ORDER = ['art', 'bim', 'competitions', 'design', 'turnkey-build',
    'studio-projects', 'photography', 'vfx-cgi'];
  const MAIN_SERVICE_NAMES = {
    'art': 'Art', 'bim': 'BIM', 'competitions': 'Competitions', 'design': 'Design',
    'turnkey-build': 'Design + Build', 'studio-projects': 'In-house',
    'photography': 'Photography', 'vfx-cgi': 'VFX + CGI'
  };
  const SUB_SERVICE_PARENTS = {
    'architecture-planning': 'design', 'art-direction': 'design', 'web-design': 'design',
    'graphic-design': 'design', 'illustration': 'design', 'industrial-design': 'design', 'interior-design': 'design',
    'motion-design': 'design',
    'cost-engineering': 'turnkey-build', 'product-material-sourcing': 'turnkey-build',
    'architectural-photography': 'photography', 'drone-photography': 'photography',
    'principal-photography': 'photography',
    '3d-animation': 'vfx-cgi', 'architectural-visualization': 'vfx-cgi',
    'match-moving': 'vfx-cgi', 'photogrammetry': 'vfx-cgi', 'product-visualization': 'vfx-cgi',
    'tracking': 'vfx-cgi', 'virtual-reality': 'vfx-cgi'
  };

  // Each slide's pre-fetch caption, so the deck never flashes sub-services before the page
  // arrives. Values are main-service keys in bar order, deduped from that page's Services row.
  const PROJECT_MAIN_SERVICES = {
    '1957.html': ['design', 'vfx-cgi'],
    '1981.html': ['vfx-cgi'],
    '1hive.html': ['design', 'vfx-cgi'],
    '2gs.html': ['design'],
    '41-barham.html': ['design', 'vfx-cgi'],
    '5aap.html': ['design', 'turnkey-build'],
    '94-laurel.html': ['vfx-cgi'],
    'abl-reception.html': ['design', 'vfx-cgi'],
    'access-bank-iris.html': ['design', 'vfx-cgi'],
    'aces-re-up.html': ['design'],
    'adentan-townhouses.html': ['design', 'vfx-cgi'],
    'adolph-s-wedding-invite.html': ['design'],
    'advantage-place.html': ['design', 'vfx-cgi'],
    'aelius.html': ['design'],
    'afg.html': ['design', 'turnkey-build', 'vfx-cgi'],
    'aika-osu.html': ['design', 'photography'],
    'airport-hills-residence.html': ['vfx-cgi'],
    'akyea-residence.html': ['vfx-cgi'],
    'alexander-signage.html': ['design'],
    'alexander.html': ['design', 'vfx-cgi'],
    'ameyaw-sarah.html': ['design'],
    'anyigbanua.html': ['design', 'vfx-cgi'],
    'apartment-in-takoradi.html': ['design', 'vfx-cgi'],
    'asante-interior-design-presentation.html': ['design', 'vfx-cgi'],
    'b1-hq-lagos-ave.html': ['design'],
    'baobab-hotel-exteriors.html': ['vfx-cgi'],
    'beautiful-choices.html': ['vfx-cgi'],
    'bfa.html': ['design', 'vfx-cgi'],
    'brownies-place.html': ['design', 'vfx-cgi'],
    'c25.html': ['design', 'vfx-cgi'],
    'campions-renderings.html': ['design', 'vfx-cgi'],
    'ceeander.html': ['design', 'vfx-cgi'],
    'chocolate.html': ['design'],
    'clairemont.html': ['design', 'vfx-cgi'],
    'college-invasion.html': ['design'],
    'csm.html': ['design', 'vfx-cgi'],
    'd-e-t-a-i-l-s.html': ['studio-projects', 'vfx-cgi'],
    'daawat-sweets.html': ['vfx-cgi'],
    'dela-anyaa.html': ['design'],
    'drw-furnart.html': ['design', 'vfx-cgi'],
    'dyv.html': ['design', 'vfx-cgi'],
    'ehr.html': ['design', 'vfx-cgi'],
    'eic-competition.html': ['competitions', 'design', 'vfx-cgi'],
    'el-dor.html': ['design', 'vfx-cgi'],
    'ela-b.html': ['design', 'vfx-cgi'],
    'elo-conference.html': ['design'],
    'elo-identity.html': ['design'],
    'elo-tv.html': ['design'],
    'emerge-ident.html': ['design', 'vfx-cgi'],
    'empire-tower.html': ['design'],
    'enda-accra-mall.html': ['art', 'design', 'vfx-cgi'],
    'enda-acm.html': ['design', 'vfx-cgi'],
    'enda-whm.html': ['design'],
    'ert.html': ['design'],
    'fizzles-pub.html': ['design'],
    'frontier-filling-station.html': ['design', 'vfx-cgi'],
    'fule.html': ['vfx-cgi'],
    'funko-ridge.html': ['design'],
    'gh-phot-awards.html': ['design', 'vfx-cgi'],
    'ghana-bbq-beer-festival.html': ['design'],
    'glow-in-the-dark.html': ['design', 'vfx-cgi'],
    'harbour-pointe.html': ['design', 'vfx-cgi'],
    'haustalks.html': ['design'],
    'haven-project.html': ['design', 'vfx-cgi'],
    'hfa.html': ['design', 'vfx-cgi'],
    'hfc-tvc.html': ['design', 'vfx-cgi'],
    'his-grace-garden-presentation.html': ['design'],
    'home-automation-system-presentation.html': ['design', 'vfx-cgi'],
    'hot-gossip.html': ['design'],
    'hubtel.html': ['design', 'vfx-cgi'],
    'hvl.html': ['design'],
    'ike.html': ['design', 'vfx-cgi'],
    'imperial-square.html': ['design'],
    'jhk-investment.html': ['vfx-cgi'],
    'jm-spots.html': ['design', 'vfx-cgi'],
    'kdmrd.html': ['vfx-cgi'],
    'la-beach-towers.html': ['design', 'vfx-cgi'],
    'la-palm-2008-christmas-party-posters.html': ['design'],
    'lase-icon.html': ['art', 'design'],
    'link-drive-road.html': ['design', 'vfx-cgi'],
    'macord.html': ['design', 'vfx-cgi'],
    'mankata.html': ['vfx-cgi'],
    'map-folder-design.html': ['design'],
    'maple-court.html': ['design', 'vfx-cgi'],
    'marble-bath.html': ['vfx-cgi'],
    'maurice-abena.html': ['design'],
    'moty.html': ['design', 'vfx-cgi'],
    'mtn.html': ['design', 'vfx-cgi'],
    'naadei-villas.html': ['design'],
    'ndaba-restaurant-whm.html': ['vfx-cgi'],
    'nest-apt.html': ['vfx-cgi'],
    'nissa-offices-2010.html': ['design'],
    'npa-reception-renders.html': ['bim', 'vfx-cgi'],
    'nyla-court.html': ['design', 'vfx-cgi'],
    'oak-tree-apartments.html': ['design', 'vfx-cgi'],
    'octagon-interiors.html': ['design', 'vfx-cgi'],
    'octagon-mews.html': ['vfx-cgi'],
    'odade3.html': ['vfx-cgi'],
    'of-sunsets.html': ['design', 'vfx-cgi'],
    'osu-apartments.html': ['vfx-cgi'],
    'osu-tower.html': ['vfx-cgi'],
    'palazzo.html': ['vfx-cgi'],
    'petrus.html': ['design', 'vfx-cgi'],
    'pine-square.html': ['design', 'vfx-cgi'],
    'poconos-bar-grill.html': ['design', 'vfx-cgi'],
    'premier-lodge-2.html': ['design'],
    'premier-place.html': ['design', 'vfx-cgi'],
    'product-1h.html': ['design', 'vfx-cgi'],
    'product-hg-desk.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-line-e-float-i.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-mlky.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-mound.html': ['design', 'vfx-cgi'],
    'product-s-age.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-sp001.html': ['design', 'studio-projects', 'vfx-cgi'],
    'project-mount.html': ['design', 'vfx-cgi'],
    'provident-insurance.html': ['vfx-cgi'],
    'purc.html': ['design', 'turnkey-build'],
    'rdvs-ident.html': ['design', 'studio-projects'],
    'rlg.html': ['design', 'vfx-cgi'],
    'safo-adu-residence.html': ['design', 'vfx-cgi'],
    'samsung-branding-proposal.html': ['competitions', 'design', 'photography'],
    'senya-resort.html': ['vfx-cgi'],
    'sinopec-ghana-interiors.html': ['vfx-cgi'],
    'six-acres-company-profile.html': ['design', 'vfx-cgi'],
    'smsgh.html': ['art', 'design', 'photography', 'vfx-cgi'],
    'stanchart-hq.html': ['vfx-cgi'],
    'stark-glaube.html': ['design'],
    'stellar-bar.html': ['design', 'vfx-cgi'],
    'stephen-yvonne.html': ['art', 'design'],
    'swipe.html': ['bim', 'design', 'vfx-cgi'],
    'tedxharambee.html': ['design'],
    'the-address.html': ['design', 'vfx-cgi'],
    'the-hamlet-presentation.html': ['design', 'vfx-cgi'],
    'the-saddle.html': ['design', 'vfx-cgi'],
    'the-tea-house.html': ['design'],
    'tower-cascades.html': ['design', 'vfx-cgi'],
    'trumpet-africa-ident.html': ['design'],
    'viasat1-breakfast-show.html': ['design'],
    'victoria-island-naija-project.html': ['design', 'vfx-cgi'],
    'villa-aggregate.html': ['design', 'vfx-cgi'],
    'vodafone-red-hse.html': ['design'],
    'watsons-place.html': ['design', 'vfx-cgi'],
    'weldment-panels.html': ['vfx-cgi'],
    'west-cantonments-igl-presentation.html': ['design', 'vfx-cgi'],
    'white-fleece.html': ['design'],
    'yah-kumasi-mall.html': ['design', 'vfx-cgi'],
    'yao-yaa.html': ['art', 'design']
  };

  function rollUpMainServices(serviceKeys) {
    const parents = new Set((serviceKeys || [])
      .map(key => SUB_SERVICE_PARENTS[key] || (MAIN_SERVICE_NAMES[key] ? key : null))
      .filter(Boolean));
    return MAIN_SERVICE_ORDER.filter(key => parents.has(key));
  }

  // The slide's service line. A page that tags no service (a news article) keeps its own wording.
  function slideServiceName(project, serviceKeys) {
    const keys = serviceKeys && serviceKeys.length
      ? rollUpMainServices(serviceKeys)
      : (PROJECT_MAIN_SERVICES[project.projectUrl] || []);
    const labels = keys.map(key => MAIN_SERVICE_NAMES[key]);
    return labels.length
      ? labels.join(' \u00b7 ')
      : formatServiceOrTitle(project.service
        || (project.category ? project.category.split('\u2014')[0].trim() : ''));
  }

  // Master Categorized Studio Project Pools by Discipline
  // 4 Core Disciplines: Architecture, Interior Design, VFX + CGI, Motion Design
  // plus the Products page: the studio's own designed pieces.
  const servicePools = {
  architecture: {
    name: 'Architectural Design',
    videos: [
      {
        id: 'funko-ridge',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        videoUrl: 'assets/videos/funko-ridge/funko-terrace.mp4',
        videoUrlDesktop: 'assets/videos/funko-ridge/funko-terrace.mp4',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-1.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-1.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-1.jpg',
        projectUrl: 'funko-ridge.html',
        desc: 'Terraced hillside residential enclave contoured to natural topographic gradients, minimizing site impact and optimizing panoramic ocean views.',
        specs: {
          client: 'Ridge Estates / Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: ['Masterplanning', 'Environmental Architecture', '3D Simulation']
        }
      },
      {
        id: 'funko-ridge-film',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        videoUrl: 'assets/videos/funko-ridge/funko-bedroom.mp4',
        videoUrlDesktop: 'assets/videos/funko-ridge/funko-bedroom.mp4',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-1.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-1.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-1.jpg',
        projectUrl: 'funko-ridge.html',
        desc: 'Terraced hillside residential enclave contoured to natural topographic gradients, minimizing site impact and optimizing panoramic ocean views.',
        specs: {
          client: 'Ridge Estates / Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Architectural Design\', \'Spatial Design\']'
        }
      },

    ],
    images: [
      {
        id: 'dyv-dawn',
        title: 'DYV',
        category: 'Architectural Design — 2023',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/dyv/dyv-dawn.jpg',
        imageUrlDesktop: 'assets/images/dyv/dyv-dawn.jpg',
        imageMobileUrl: 'assets/images/dyv/dyv-dawn-mobile.jpg',
        projectUrl: 'dyv.html',
        desc: 'An iconic multi-tiered mixed-use urban gateway designed to maximize natural airflow, communal terrace courtyards, and sustainable coastal resilience.',
        specs: {
          client: 'DYV Holdings',
          scope: 'Urban Planning, Facade Engineering & 3D Cinematic Renderings',
          team: 'Godsway Kwahmi, RDVS Urban Studio',
          year: '2023',
          disciplines: ['Urban Planning', 'Facade Design', '3D Environmental Rendering']
        }
      },
      {
        id: 'barham-residence',
        title: '41 Barham',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/barham/barham-courtyard.jpg',
        imageUrlDesktop: 'assets/images/barham/barham-courtyard.jpg',
        imageMobileUrl: 'assets/images/barham/barham-courtyard.jpg',
        projectUrl: '41-barham.html',
        desc: 'A minimalist architectural volume embracing high-contrast warm materiality, double-height ceiling voids, and seamless indoor-outdoor courtyards.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: 'Architect Kofi Amankwah (Architecture), RDVS (Interior Design & 3D Visualization)',
          year: '2017',
          disciplines: ['Architectural Design', 'Interior Design', '3D Visualization']
        }
      },
      {
        id: 'imperial-square',
        title: 'Imperial Square',
        category: 'Interior Design — 2013',
        service: 'Interior Design',
        discipline: 'interior-design',
        imageUrl: 'assets/images/imperial-square/imperial-square-1.jpg',
        imageUrlDesktop: 'assets/images/imperial-square/imperial-square-1.jpg',
        imageMobileUrl: 'assets/images/imperial-square/imperial-square-1.jpg',
        projectUrl: 'imperial-square.html',
        desc: 'Comprehensive interior design, industrial & furniture design, and 3D visualization for Imperial Square commercial space.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design, Industrial & Furniture Design, 3D Visualization',
          team: 'RDVS Team',
          year: '2013',
          disciplines: ['Interior Design', 'Industrial Design', 'Furniture Design', '3D Visualization']
        }
      },
      {
        id: 'frontier-filling-station',
        title: 'Frontier Filling Station',
        category: 'Industrial Design & 3D Visualization — 2016',
        service: 'Industrial Design & 3D Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/frontier-filling-station/frontier-filling-station-1.jpg',
        imageUrlDesktop: 'assets/images/frontier-filling-station/frontier-filling-station-1.jpg',
        imageMobileUrl: 'assets/images/frontier-filling-station/frontier-filling-station-1.jpg',
        projectUrl: 'frontier-filling-station.html',
        desc: 'A 2016 multidisciplinary commission spanning architecture, industrial design, and 3D visualization for the Frontier Filling Station.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Industrial Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2016',
          disciplines: ['Architectural Design', 'Industrial Design', '3D Visualization']
        }
      },
      {
        id: 'poconos-bar-grill',
        title: 'Poconos Bar + Grill',
        category: 'Landscape Design, Interior Design & 3D Visualization — 2017',
        service: 'Landscape Design, Interior Design & 3D Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-1.jpg',
        imageUrlDesktop: 'assets/images/poconos-bar-grill/poconos-bar-grill-1.jpg',
        imageMobileUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-1.jpg',
        projectUrl: 'poconos-bar-grill.html',
        desc: 'A 2017 multidisciplinary commission spanning architecture, landscape design, interior design, and 3D visualization for Poconos Bar + Grill.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Landscape Design, Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Architectural Design', 'Landscape Design', 'Interior Design', '3D Visualization']
        }
      },
      {
        id: 'purc-complex',
        title: 'PURC',
        category: 'Architectural Design — 2012',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/purc/purc-colonnade.jpg',
        imageUrlDesktop: 'assets/images/purc/purc-colonnade.jpg',
        imageMobileUrl: 'assets/images/purc/purc-colonnade.jpg',
        projectUrl: 'purc.html',
        desc: 'Monolithic civic tower: a full-height glazed oval core flanked by stepped, sun-shading office bands and grounded by a broad flared arrival canopy.',
        specs: {
          client: 'Public Utilities Regulatory Commission',
          scope: 'Architectural Design, interior design, architectural visualization, graphic design and design documentation',
          team: 'Six-person winning team, incl. RDVS directors @niianerkwei and @kwahmi',
          year: '2012',
          disciplines: ['Architectural Design', 'Interior Design', 'Architectural Visualization', 'Graphic Design', 'Design Documentation']
        }
      },
      {
        id: 'adentan-townhouses',
        title: 'Adentan Townhouses',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/adentan-townhouses/adentan-townhouses-1.jpg',
        imageUrlDesktop: 'assets/images/adentan-townhouses/adentan-townhouses-1.jpg',
        imageMobileUrl: 'assets/images/adentan-townhouses/adentan-townhouses-1-mobile.jpg',
        projectUrl: 'adentan-townhouses.html',
        desc: 'Modular residential community balancing privacy with shared landscape courtyards and climate-responsive natural ventilation.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concepting, mood and colour boards, and architectural 3D visualization of the townhouse exteriors, interiors and cutaway floor plans.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: ['Residential Architecture', 'Landscape Integration']
        }
      },
      {
        id: '1hive',
        title: '1Hive',
        category: 'Interior Design & 3D Visualization — 2016',
        service: 'Interior Design & 3D Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/1hive/1hive-1.jpg',
        imageUrlDesktop: 'assets/images/1hive/1hive-1.jpg',
        imageMobileUrl: 'assets/images/1hive/1hive-1.jpg',
        projectUrl: '1hive.html',
        desc: 'A 2016 multidisciplinary commission spanning architecture, interior design, and 3D visualization for 1Hive.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2016',
          disciplines: ['Architectural Design', 'Interior Design', '3D Visualization']
        }
      },
      {
        id: 'macord-international-school',
        title: 'Macord International School',
        category: '3D Visualization — 2024',
        service: '3D Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/macord/macord-5.jpg',
        imageUrlDesktop: 'assets/images/macord/macord-5.jpg',
        imageMobileUrl: 'assets/images/macord/macord-5.jpg',
        projectUrl: 'macord.html',
        desc: 'A complete 2024 school commission — street-facing facade in rhythmic coloured fins and planted terraces, landscape forecourt, resolved interiors and a bespoke furniture package, carried through to photoreal 3D visualization.',
        specs: {
          client: 'Macord International School',
          scope: 'Facade Design (Architectural Design), Landscape Design, Interior Design, Industrial & Furniture Design & 3D Visualization',
          team: 'Jude Nyoagbe',
          year: '2024',
          disciplines: ['Architectural Design', 'Landscape Design', 'Interior Design', 'Industrial & Furniture Design', '3D Visualization']
        }
      },
      {
        id: 'empire-tower',
        title: 'Empire Tower',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/empire-tower/empire-tower-3.jpg',
        imageUrlDesktop: 'assets/images/empire-tower/empire-tower-3.jpg',
        imageMobileUrl: 'assets/images/empire-tower/empire-tower-3.jpg',
        projectUrl: 'empire-tower.html'
      },
      {
        id: 'enda-whm',
        title: 'Enda WHM',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/enda-whm/enda-whm-1.jpg',
        imageUrlDesktop: 'assets/images/enda-whm/enda-whm-1.jpg',
        imageMobileUrl: 'assets/images/enda-whm/enda-whm-1.jpg',
        projectUrl: 'enda-whm.html'
      },
      {
        id: 'ert',
        title: 'ERT',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/ert/ert-1.jpg',
        imageUrlDesktop: 'assets/images/ert/ert-1.jpg',
        imageMobileUrl: 'assets/images/ert/ert-1.jpg',
        projectUrl: 'ert.html'
      },
      {
        id: 'b1-hq-lagos-ave',
        title: 'B1 HQ Lagos Ave',
        category: 'Architectural Design — 2020',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/b1-hq-lagos-ave/b1-hq-lagos-ave-1.png',
        imageUrlDesktop: 'assets/images/b1-hq-lagos-ave/b1-hq-lagos-ave-1.png',
        imageMobileUrl: 'assets/images/b1-hq-lagos-ave/b1-hq-lagos-ave-1.png',
        projectUrl: 'b1-hq-lagos-ave.html'
      },
      {
        id: 'hot-gossip',
        title: 'Hot Gossip',
        category: 'Architectural Design — 2015',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-1.jpg',
        imageUrlDesktop: 'assets/images/hot-gossip/hot-gossip-1.jpg',
        imageMobileUrl: 'assets/images/hot-gossip/hot-gossip-1-mobile.jpg',
        projectUrl: 'hot-gossip.html',
        desc: 'Fast-paced, colorful entertainment broadcast titles and transition cards designed for prime-time programming.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2015',
          disciplines: ['Motion Design', 'Entertainment Graphics', 'Kinetic Design']
        }
      },
      {
        id: 'vodafone-red-hse-plate1',
        title: 'Vodafone Red Hse',
        category: 'Architectural Design — 2011',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/vodafone-red-hse/vodafone-red-hse-1.jpg',
        imageUrlDesktop: 'assets/images/vodafone-red-hse/vodafone-red-hse-1.jpg',
        imageMobileUrl: 'assets/images/vodafone-red-hse/vodafone-red-hse-1.jpg',
        projectUrl: 'vodafone-red-hse.html',
        desc: 'An initial design proposal for a Vodafone Red House, drawn in July 2011 with Steven Ntow — the brand lockup and the building\'s corner set side by side on one sheet.',
        specs: {
          client: 'Vodafone',
          scope: 'Initial design proposal: corner massing and louvered facade, signage and brand application, and the Red House wordmark lockup.',
          team: 'Steven Ntow + RDVS. DESIGN',
          year: '2011',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'the-saddle-plate1',
        title: 'The Saddle',
        category: 'Architectural Design & Architectural Visualization — 2018',
        service: 'Architectural Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/the-saddle/the-saddle-1.jpg',
        imageUrlDesktop: 'assets/images/the-saddle/the-saddle-1.jpg',
        imageMobileUrl: 'assets/images/the-saddle/the-saddle-1.jpg',
        projectUrl: 'the-saddle.html',
        desc: 'The Saddle is a 2018 concept design and visualization by RDVS Studio, a proposal for a real estate company showing low residential pavilions set on a hillside below a forested ridge, published as one black-and-white image.',
        specs: {
          client: 'Private Client',
          scope: 'Concept design of the hillside pavilion scheme and one finished 3D visualization plate, modelled, lit and post-produced in monochrome for the pitch.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Architectural Design   Architectural Visualization\']'
        }
      },
      {
        id: 'the-address-plate1',
        title: 'The Address',
        category: 'Architectural Design & Architectural Visualization — 2016',
        service: 'Architectural Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/the-address/the-address-1.jpg',
        imageUrlDesktop: 'assets/images/the-address/the-address-1.jpg',
        imageMobileUrl: 'assets/images/the-address/the-address-1.jpg',
        projectUrl: 'the-address.html',
        desc: 'The Address is a three-plate architectural visualization set from 2016 for a mid-rise apartment building in Accra, Ghana, showing its street elevation behind a stone name wall and two furnished angles of a unit s living, dining and kitchen space.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural design and development of the apartment block and its balcony screens, interior styling and furniture selection for the show unit, and the exterior and interior visualizations used to present it.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Architectural Design   Architectural Visualization\']'
        }
      },
      {
        id: 'the-address-plate2',
        title: 'The Address',
        category: 'Architectural Design & Architectural Visualization — 2016',
        service: 'Architectural Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/the-address/the-address-2.jpg',
        imageUrlDesktop: 'assets/images/the-address/the-address-2.jpg',
        imageMobileUrl: 'assets/images/the-address/the-address-2.jpg',
        projectUrl: 'the-address.html',
        desc: 'The Address is a three-plate architectural visualization set from 2016 for a mid-rise apartment building in Accra, Ghana, showing its street elevation behind a stone name wall and two furnished angles of a unit s living, dining and kitchen space.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural design and development of the apartment block and its balcony screens, interior styling and furniture selection for the show unit, and the exterior and interior visualizations used to present it.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Architectural Design   Architectural Visualization\']'
        }
      },
      {
        id: 'the-address-plate3',
        title: 'The Address',
        category: 'Architectural Design & Architectural Visualization — 2016',
        service: 'Architectural Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/the-address/the-address-3.jpg',
        imageUrlDesktop: 'assets/images/the-address/the-address-3.jpg',
        imageMobileUrl: 'assets/images/the-address/the-address-3.jpg',
        projectUrl: 'the-address.html',
        desc: 'The Address is a three-plate architectural visualization set from 2016 for a mid-rise apartment building in Accra, Ghana, showing its street elevation behind a stone name wall and two furnished angles of a unit s living, dining and kitchen space.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural design and development of the apartment block and its balcony screens, interior styling and furniture selection for the show unit, and the exterior and interior visualizations used to present it.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Architectural Design   Architectural Visualization\']'
        }
      },
      {
        id: 'safo-adu-residence-plate1',
        title: 'Safo Adu Townhouses',
        category: 'Architectural Design & Architectural Visualization — 2016',
        service: 'Architectural Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/safo-adu-townhouses/safo-adu-townhouses-1.jpg',
        imageUrlDesktop: 'assets/images/safo-adu-townhouses/safo-adu-townhouses-1.jpg',
        imageMobileUrl: 'assets/images/safo-adu-townhouses/safo-adu-townhouses-1.jpg',
        projectUrl: 'safo-adu-residence.html',
        desc: 'Two dusk visualizations of the Safo Adu townhouses, by RDVS. Design, covering both the architecture and the 3D imagery: a street-facing elevation with parked cars, and a covered timber terrace on a boardwalk deck.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design and 3D visualization: a street-facing elevation of a townhouse unit and a covered terrace view, delivered as two finished dusk renders.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Architectural Design   Architectural Visualization\']'
        }
      },
      {
        id: 'safo-adu-residence-plate2',
        title: 'Safo Adu Townhouses',
        category: 'Architectural Design & Architectural Visualization — 2016',
        service: 'Architectural Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/safo-adu-townhouses/safo-adu-townhouses-2.jpg',
        imageUrlDesktop: 'assets/images/safo-adu-townhouses/safo-adu-townhouses-2.jpg',
        imageMobileUrl: 'assets/images/safo-adu-townhouses/safo-adu-townhouses-2.jpg',
        projectUrl: 'safo-adu-residence.html',
        desc: 'Two dusk visualizations of the Safo Adu townhouses, by RDVS. Design, covering both the architecture and the 3D imagery: a street-facing elevation with parked cars, and a covered timber terrace on a boardwalk deck.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design and 3D visualization: a street-facing elevation of a townhouse unit and a covered terrace view, delivered as two finished dusk renders.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Architectural Design   Architectural Visualization\']'
        }
      },
      {
        id: 'purc-complex-plate1',
        title: 'PURC',
        category: 'Architectural Design — 2012',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/purc/purc-facade.jpg',
        imageUrlDesktop: 'assets/images/purc/purc-facade.jpg',
        imageMobileUrl: 'assets/images/purc/purc-facade-mobile.jpg',
        projectUrl: 'purc.html',
        desc: 'Monolithic civic tower: a full-height glazed oval core flanked by stepped, sun-shading office bands and grounded by a broad flared arrival canopy.',
        specs: {
          client: 'Public Utilities Regulatory Commission',
          scope: 'Architectural Design, interior design, architectural visualization, graphic design and design documentation',
          team: 'Six-person winning team, incl. RDVS directors @niianerkwei and @kwahmi',
          year: '2012',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'purc-complex-plate2',
        title: 'PURC',
        category: 'Architectural Design — 2012',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/purc/purc-portico.jpg',
        imageUrlDesktop: 'assets/images/purc/purc-portico.jpg',
        imageMobileUrl: 'assets/images/purc/purc-portico.jpg',
        projectUrl: 'purc.html',
        desc: 'Monolithic civic tower: a full-height glazed oval core flanked by stepped, sun-shading office bands and grounded by a broad flared arrival canopy.',
        specs: {
          client: 'Public Utilities Regulatory Commission',
          scope: 'Architectural Design, interior design, architectural visualization, graphic design and design documentation',
          team: 'Six-person winning team, incl. RDVS directors @niianerkwei and @kwahmi',
          year: '2012',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'premier-lodge-2-plate1',
        title: 'Premier Lodge 2',
        category: 'Architectural Design — 2013',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/hamlet/hamlet-estate.jpg',
        imageUrlDesktop: 'assets/images/hamlet/hamlet-estate-desktop.jpg',
        imageMobileUrl: 'assets/images/hamlet/hamlet-estate-mobile.jpg',
        projectUrl: 'premier-lodge-2.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for Premier Lodge 2.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2013',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'nissa-offices-2010-plate1',
        title: 'Nissa Offices 2010',
        category: 'Architectural Design — 2010',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/abl/abl-1.jpg',
        imageUrlDesktop: 'assets/images/abl/abl-1.jpg',
        imageMobileUrl: 'assets/images/abl/abl-1.jpg',
        projectUrl: 'nissa-offices-2010.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for Nissa Offices 2010.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2010',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'hot-gossip-plate1',
        title: 'Hot Gossip',
        category: 'Architectural Design — 2015',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-4.jpg',
        imageUrlDesktop: 'assets/images/hot-gossip/hot-gossip-4.jpg',
        imageMobileUrl: 'assets/images/hot-gossip/hot-gossip-4.jpg',
        projectUrl: 'hot-gossip.html',
        desc: 'Fast-paced, colorful entertainment broadcast titles and transition cards designed for prime-time programming.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'hot-gossip-plate2',
        title: 'Hot Gossip',
        category: 'Architectural Design — 2015',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-2.jpg',
        imageUrlDesktop: 'assets/images/hot-gossip/hot-gossip-2.jpg',
        imageMobileUrl: 'assets/images/hot-gossip/hot-gossip-2.jpg',
        projectUrl: 'hot-gossip.html',
        desc: 'Fast-paced, colorful entertainment broadcast titles and transition cards designed for prime-time programming.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'his-grace-garden-presentation-plate1',
        title: 'HGG',
        category: 'Architectural Design — 2016',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/his-grace-garden-presentation/his-grace-garden-presentation-2.jpg',
        imageUrlDesktop: 'assets/images/his-grace-garden-presentation/his-grace-garden-presentation-2.jpg',
        imageMobileUrl: 'assets/images/his-grace-garden-presentation/his-grace-garden-presentation-2.jpg',
        projectUrl: 'his-grace-garden-presentation.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for HGG.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2016',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'his-grace-garden-presentation-plate2',
        title: 'HGG',
        category: 'Architectural Design — 2016',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/his-grace-garden-presentation/his-grace-garden-presentation-3.jpg',
        imageUrlDesktop: 'assets/images/his-grace-garden-presentation/his-grace-garden-presentation-3.jpg',
        imageMobileUrl: 'assets/images/his-grace-garden-presentation/his-grace-garden-presentation-3.jpg',
        projectUrl: 'his-grace-garden-presentation.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for HGG.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2016',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'his-grace-garden-presentation-plate3',
        title: 'HGG',
        category: 'Architectural Design — 2016',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/his-grace-garden-presentation/his-grace-garden-presentation-4.jpg',
        imageUrlDesktop: 'assets/images/his-grace-garden-presentation/his-grace-garden-presentation-4.jpg',
        imageMobileUrl: 'assets/images/his-grace-garden-presentation/his-grace-garden-presentation-4.jpg',
        projectUrl: 'his-grace-garden-presentation.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for HGG.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2016',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'funko-ridge-plate1',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-1.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-1.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-1.jpg',
        projectUrl: 'funko-ridge.html',
        desc: 'Terraced hillside residential enclave contoured to natural topographic gradients, minimizing site impact and optimizing panoramic ocean views.',
        specs: {
          client: 'Ridge Estates / Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Architectural Design\', \'Spatial Design\']'
        }
      },
      {
        id: 'ert-plate1',
        title: 'ERT',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/ert/ert-2.jpg',
        imageUrlDesktop: 'assets/images/ert/ert-2.jpg',
        imageMobileUrl: 'assets/images/ert/ert-2.jpg',
        projectUrl: 'ert.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for ERT.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'ert-plate2',
        title: 'ERT',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/ert/ert-3.jpg',
        imageUrlDesktop: 'assets/images/ert/ert-3.jpg',
        imageMobileUrl: 'assets/images/ert/ert-3.jpg',
        projectUrl: 'ert.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for ERT.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'enda-whm-plate1',
        title: 'Enda WHM',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/enda-whm/enda-whm-2.jpg',
        imageUrlDesktop: 'assets/images/enda-whm/enda-whm-2.jpg',
        imageMobileUrl: 'assets/images/enda-whm/enda-whm-2.jpg',
        projectUrl: 'enda-whm.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for Enda WHM.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'enda-whm-plate2',
        title: 'Enda WHM',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/enda-whm/enda-whm-3.jpg',
        imageUrlDesktop: 'assets/images/enda-whm/enda-whm-3.jpg',
        imageMobileUrl: 'assets/images/enda-whm/enda-whm-3.jpg',
        projectUrl: 'enda-whm.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for Enda WHM.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'empire-tower-plate1',
        title: 'Empire Tower',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/empire-tower/empire-tower-1.jpg',
        imageUrlDesktop: 'assets/images/empire-tower/empire-tower-1.jpg',
        imageMobileUrl: 'assets/images/empire-tower/empire-tower-1.jpg',
        projectUrl: 'empire-tower.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for Empire Tower.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'empire-tower-plate2',
        title: 'Empire Tower',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/empire-tower/empire-tower-2.jpg',
        imageUrlDesktop: 'assets/images/empire-tower/empire-tower-2.jpg',
        imageMobileUrl: 'assets/images/empire-tower/empire-tower-2.jpg',
        projectUrl: 'empire-tower.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for Empire Tower.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'dyv-dawn-plate1',
        title: 'DYV',
        category: 'Architectural Design — 2023',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/dyv/dyv-panoramic-header.jpg',
        imageUrlDesktop: 'assets/images/dyv/dyv-panoramic-header.jpg',
        imageMobileUrl: 'assets/images/dyv/dyv-panoramic-header.jpg',
        projectUrl: 'dyv.html',
        desc: 'An iconic multi-tiered mixed-use urban gateway designed to maximize natural airflow, communal terrace courtyards, and sustainable coastal resilience.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design',
          team: 'RDVS Team',
          year: '2023',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'dyv-dawn-plate2',
        title: 'DYV',
        category: 'Architectural Design — 2023',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/dyv/dyv-courtyard-night.jpg',
        imageUrlDesktop: 'assets/images/dyv/dyv-courtyard-night.jpg',
        imageMobileUrl: 'assets/images/dyv/dyv-courtyard-night.jpg',
        projectUrl: 'dyv.html',
        desc: 'An iconic multi-tiered mixed-use urban gateway designed to maximize natural airflow, communal terrace courtyards, and sustainable coastal resilience.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design',
          team: 'RDVS Team',
          year: '2023',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'b1-hq-lagos-ave-plate1',
        title: 'B1 HQ Lagos Ave',
        category: 'Architectural Design — 2020',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/b1-hq-lagos-ave/b1-hq-lagos-ave-2.png',
        imageUrlDesktop: 'assets/images/b1-hq-lagos-ave/b1-hq-lagos-ave-2.png',
        imageMobileUrl: 'assets/images/b1-hq-lagos-ave/b1-hq-lagos-ave-2.png',
        projectUrl: 'b1-hq-lagos-ave.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for B1 HQ Lagos Ave.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'b1-hq-lagos-ave-plate2',
        title: 'B1 HQ Lagos Ave',
        category: 'Architectural Design — 2020',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/b1-hq-lagos-ave/b1-hq-lagos-ave-3.png',
        imageUrlDesktop: 'assets/images/b1-hq-lagos-ave/b1-hq-lagos-ave-3.png',
        imageMobileUrl: 'assets/images/b1-hq-lagos-ave/b1-hq-lagos-ave-3.png',
        projectUrl: 'b1-hq-lagos-ave.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for B1 HQ Lagos Ave.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'alexander-signage-plate1',
        title: 'Alexander-Signage',
        category: 'Architectural Design — 2021',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/alexander-signage/alexander-signage-1.jpg',
        imageUrlDesktop: 'assets/images/alexander-signage/alexander-signage-1.jpg',
        imageMobileUrl: 'assets/images/alexander-signage/alexander-signage-1.jpg',
        projectUrl: 'alexander-signage.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for Alexander-Signage.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: '5aap-progress-plate1',
        title: '5AAP',
        category: 'Design + Build — 2020',
        service: 'Design + Build',
        discipline: 'architecture',
        imageUrl: 'assets/images/5aap/5aap-2.jpg',
        imageUrlDesktop: 'assets/images/5aap/5aap-2.jpg',
        imageMobileUrl: 'assets/images/5aap/5aap-2.jpg',
        projectUrl: '5aap.html',
        desc: 'Progressive corporate and commercial campus balancing monumental civic presence with human-scale pedestrian plazas and natural daylight voids.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Design + Build\']'
        }
      },
      {
        id: '5aap-progress-plate2',
        title: '5AAP',
        category: 'Design + Build — 2020',
        service: 'Design + Build',
        discipline: 'architecture',
        imageUrl: 'assets/images/5aap/5aap-1.jpg',
        imageUrlDesktop: 'assets/images/5aap/5aap-1.jpg',
        imageMobileUrl: 'assets/images/5aap/5aap-1-mobile.jpg',
        projectUrl: '5aap.html',
        desc: 'Progressive corporate and commercial campus balancing monumental civic presence with human-scale pedestrian plazas and natural daylight voids.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Design + Build\']'
        }
      },
      {
        id: 'details-film',
        title: 'Details',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-1.jpg',
        imageUrlDesktop: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-1.jpg',
        imageMobileUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-1.jpg',
        projectUrl: 'd-e-t-a-i-l-s.html',
        desc: 'A self-initiated film about the parts of an interior a walkthrough would rush past: the joint where a lamp stem meets its base, the way light sits inside a glass case, the edge of a paving slab against gravel.',
        specs: {
          client: 'RDVS Studios',
          scope: 'Self-initiated interior modelling, look-dev, lighting, rendering and edit',
          team: 'RDVS Team',
          year: '2018',
          disciplines: ['3D Visualization', 'Architectural Visualization']
        }
      },
      {
        id: '5aap-progress',
        title: '5AAP',
        category: 'Design + Build — 2020',
        service: 'Design + Build',
        discipline: 'architecture',
        imageUrl: 'assets/images/5aap/5aap-2.jpg',
        imageUrlDesktop: 'assets/images/5aap/5aap-2.jpg',
        imageMobileUrl: 'assets/images/5aap/5aap-2.jpg',
        projectUrl: '5aap.html',
        desc: 'Progressive corporate and commercial campus balancing monumental civic presence with human-scale pedestrian plazas and natural daylight voids.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'RDVS Team',
          year: '2020',
          disciplines: ['Architectural Design', 'Design & Build']
        }
      },

    ]
  },

  interiors: {
    name: 'Interior Design',
    videos: [
      {
        id: 'advantage-place',
        title: 'Advantage Place',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'interiors',
        videoUrl: 'assets/videos/advantage-place/advantage-place-anim.mp4',
        videoUrlDesktop: 'assets/videos/advantage-place/advantage-place-anim.mp4',
        imageUrl: 'assets/images/advantage-place/advantage-place-01.jpg',
        imageUrlDesktop: 'assets/images/advantage-place/advantage-place-01.jpg',
        imageMobileUrl: 'assets/images/advantage-place/advantage-place-01.jpg',
        projectUrl: 'advantage-place.html',
        desc: 'A 2015 interior design and 3D visualization presentation of the Advantage Place commercial development in Accra — lobby, workplace floors, and amenities rendered in photoreal detail alongside a full 3D animation.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization (Modeling & Rendering)',
          team: 'RDVS Team',
          year: '2015',
          disciplines: ['Interior Design', '3D Visualization', 'Modeling & Rendering']
        }
      },
      {
        id: 'advantage-place-film',
        title: 'Advantage Place',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'interiors',
        videoUrl: 'assets/videos/advantage-place/advantage-place-anim.mp4',
        videoUrlDesktop: 'assets/videos/advantage-place/advantage-place-anim.mp4',
        imageUrl: 'assets/images/advantage-place/advantage-place-01.jpg',
        imageUrlDesktop: 'assets/images/advantage-place/advantage-place-01.jpg',
        imageMobileUrl: 'assets/images/advantage-place/advantage-place-01.jpg',
        projectUrl: 'advantage-place.html',
        desc: 'A 2015 interior design and 3D visualization presentation of the Advantage Place commercial development in Accra — lobby, workplace floors, and amenities rendered in photoreal detail alongside a full 3D animation.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization (Modeling & Rendering)',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      },

    ],
    images: [
      {
        id: 'csm',
        title: 'CSM',
        category: 'Interior Design & 3D Visualization — 2014',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/csm/csm-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/csm/csm-1-desktop.jpg',
        imageMobileUrl: 'assets/images/csm/csm-1-desktop.jpg',
        projectUrl: 'csm.html',
        desc: 'Interior design and 3D visualization for Centre Stage Management — a compact office in Tema planned around a reception, two workstations and a meeting space.',
        specs: {
          client: 'Centre Stage Management',
          scope: 'Interior design and 3D visualization of a compact office: reception, two workstations and a meeting space, with space planning, built-in joinery, finishes, lighting design and photoreal renders',
          team: 'Jude Abbey + Jude Nyoagbe (design, modelling); Jude Nyoagbe (texturing, lighting, rendering, post-production)',
          year: '2014',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hamlet-estate',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-bath.jpg',
        imageUrlDesktop: 'assets/images/hamlet/hamlet-bath.jpg',
        imageMobileUrl: 'assets/images/hamlet/hamlet-bath.jpg',
        projectUrl: 'the-hamlet-presentation.html',
        desc: 'Interior design and photorealistic 3D visualization for The Hamlet — twenty luxury residences in Cantonments, Accra, rendered to present the proposed houses to prospective clients.',
        specs: {
          client: 'Nest',
          scope: 'Interior Design & 3D Visualization (Modeling & Rendering)',
          team: 'Jude Nyoagbe, Jude Abbey, Nana Afua Addo Boateng',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization', 'Modeling & Rendering']
        }
      },
      {
        id: '1957-apartments-retail',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-12.jpg',
        imageUrlDesktop: 'assets/images/1957/1957-12.jpg',
        imageMobileUrl: 'assets/images/1957/1957-12-mobile.jpg',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          architecture: 'Mustard Architecture',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'afg-offices',
        title: 'AFG Offices',
        category: 'Interior Design, 3D Visualization, Graphic Design, Industrial & Furniture Design & Construction — 2019',
        service: 'Interior Design, 3D Visualization, Graphic Design, Industrial & Furniture Design & Construction',
        discipline: 'interiors',
        imageUrl: 'assets/images/afg/afg-hero.jpg',
        imageUrlDesktop: 'assets/images/afg/afg-hero.jpg',
        imageMobileUrl: 'assets/images/afg/afg-hero.jpg',
        projectUrl: 'afg.html',
        desc: 'A design-and-build office for AFG in Accra — brand set into the architecture across a faceted red graphic wall and etched glass, bespoke plywood and steel furniture, photographed room by room and shown beside the pre-build visualisations, across one hundred plates.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'hubtel-nairobi',
        title: 'Hubtel Nairobi',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hubtel/hubtel-nairobi-1.jpg',
        imageUrlDesktop: 'assets/images/hubtel/hubtel-nairobi-1.jpg',
        imageMobileUrl: 'assets/images/hubtel/hubtel-nairobi-1.jpg',
        projectUrl: 'hubtel.html',
        desc: 'Interior design and full 3D visualization for Hubtel\'s Nairobi workspace — reception and welcome sequence, open collaborative floor, and executive rooms, resolved around daylight, circulation and brand presence.',
        specs: {
          client: 'SMSGH / Hubtel',
          scope: 'Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'la-beach-towers',
        title: 'La Beach Towers',
        category: '3D Visualization — 2013',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/la-beach-towers/la-beach-towers-16.jpg',
        imageUrlDesktop: 'assets/images/la-beach-towers/la-beach-towers-16.jpg',
        imageMobileUrl: 'assets/images/la-beach-towers/la-beach-towers-16.jpg',
        projectUrl: 'la-beach-towers.html',
        desc: 'Interior design and 3D visualization for La Beach Towers, a seaside development in Ghana — modeling and rendering the living, dining, and private quarters in photoreal detail.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization (Modeling & Rendering)',
          team: 'RDVS Team',
          year: '2013',
          disciplines: ['Interior Design', '3D Visualization', 'Modeling & Rendering']
        }
      },
      {
        id: 'west-cantonments-residence',
        title: 'West Cantonments Residence',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cantonments/west-cantonments-16.jpg',
        imageUrlDesktop: 'assets/images/cantonments/west-cantonments-16.jpg',
        imageMobileUrl: 'assets/images/cantonments/west-cantonments-16.jpg',
        projectUrl: 'west-cantonments-igl-presentation.html',
        desc: 'Interior design and 3D visualization for the West Cantonments development by Infinite Group Ltd in Accra — rendering the reception lobby, executive boardroom, fitness centre, and rooftop bar in photoreal detail.',
        specs: {
          client: 'Infinite Group Ltd',
          scope: 'Interior Design & 3D Visualization (Modeling & Rendering)',
          team: 'RDVS Team',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization', 'Modeling & Rendering']
        }
      },
      {
        id: 'abl-reception',
        title: 'ABL Reception',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/abl-reception/abl-reception-1.jpg',
        imageUrlDesktop: 'assets/images/abl-reception/abl-reception-1.jpg',
        imageMobileUrl: 'assets/images/abl-reception/abl-reception-1.jpg',
        projectUrl: 'abl-reception.html',
        desc: 'Minimalist commercial lobby blending linear slatted wall elements with monolithic reception counter architecture and concealed ambient illumination.',
        specs: {
          client: 'ABL (Accra Brewery Limited)',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe, Nana Afua Boateng',
          year: '2017',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'c25-interior',
        title: 'C25',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/c25/c25-1.jpg',
        imageUrlDesktop: 'assets/images/c25/c25-1-desktop.jpg',
        imageMobileUrl: 'assets/images/c25/c25-1-mobile.jpg',
        projectUrl: 'c25.html',
        desc: 'Warm neutral palette interior utilizing micro-cement, acoustic fluting, and tailored concealed storage joinery.',
        specs: {
          client: 'Devtraco',
          scope: 'RDVS delivered interior design direction and full 3D architectural visualization, modeling the interiors, the exterior elevations, lighting and the final rendered presentation set.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: ['Interior Design', 'Custom Millwork', 'Lighting']
        }
      },
      {
        id: 'villa-aggregate',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-1.jpg',
        imageUrlDesktop: 'assets/images/aggregate/villa-aggregate-1.jpg',
        imageMobileUrl: 'assets/images/aggregate/villa-aggregate-1.jpg',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'nyla-court',
        title: 'Nyla Court',
        category: 'Interior Design & Architectural Visualization — 2020',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/nyla-court/nyla-court-hero.jpg',
        imageUrlDesktop: 'assets/images/nyla-court/nyla-court-hero.jpg',
        imageMobileUrl: 'assets/images/nyla-court/nyla-court-hero.jpg',
        projectUrl: 'nyla-court.html'
      },
      {
        id: 'stellar-bar',
        title: 'Stellar Bar',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/stellar-bar/stellar-bar-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/stellar-bar/stellar-bar-1-desktop.jpg',
        imageMobileUrl: 'assets/images/stellar-bar/stellar-bar-1-desktop.jpg',
        projectUrl: 'stellar-bar.html'
      },
      {
        id: 'enda-accra-mall',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design, 3D Visualization, VR & Digital Art — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design, 3D Visualization, VR & Digital Art',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/enda-accra-mall/enda-accra-mall-1-desktop.jpg',
        imageMobileUrl: 'assets/images/enda-accra-mall/enda-accra-mall-1-desktop.jpg',
        projectUrl: 'enda-accra-mall.html'
      },
      {
        id: 'enda-acm',
        title: 'Enda ACM',
        category: 'Interior Design, Industrial Design, Graphic Design & 3D Visualization — 2015',
        service: 'Interior Design, Industrial Design, Graphic Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-acm/enda-acm-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/enda-acm/enda-acm-1-desktop.jpg',
        imageMobileUrl: 'assets/images/enda-acm/enda-acm-1-desktop.jpg',
        projectUrl: 'enda-acm.html'
      },
      {
        id: 'petrus',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-1.jpg',
        imageUrlDesktop: 'assets/images/petrus/petrus-1.jpg',
        imageMobileUrl: 'assets/images/petrus/petrus-1-mobile.jpg',
        projectUrl: 'petrus.html'
      },
      {
        id: 'link-drive-road',
        title: 'Link Drive Rd.',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/link-drive/link-drive-1.jpg',
        imageUrlDesktop: 'assets/images/link-drive/link-drive-1.jpg',
        imageMobileUrl: 'assets/images/link-drive/link-drive-1.jpg',
        projectUrl: 'link-drive-road.html'
      },
      {
        id: 'naadei-villas',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-1.jpg',
        imageUrlDesktop: 'assets/images/naadei-villas/naadei-villas-1.jpg',
        imageMobileUrl: 'assets/images/naadei-villas/naadei-villas-1-mobile.jpg',
        projectUrl: 'naadei-villas.html'
      },
      {
        id: 'asante-interior-design-presentation',
        title: 'TAI',
        category: 'Interior Design — 2020',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-2.jpg',
        imageUrlDesktop: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-2.jpg',
        imageMobileUrl: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-2.jpg',
        projectUrl: 'asante-interior-design-presentation.html'
      },
      {
        id: 'swipe',
        title: 'Swipe',
        category: 'Interior Design, Graphic Design, BIM & Architectural Visualization — 2020',
        service: 'Interior Design, Graphic Design, BIM & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/swipe/swipe-6.jpg',
        imageUrlDesktop: 'assets/images/swipe/swipe-6.jpg',
        imageMobileUrl: 'assets/images/swipe/swipe-6.jpg',
        projectUrl: 'swipe.html'
      },
      {
        id: 'yah-kumasi-mall-plate1',
        title: 'Yah!',
        category: 'Interior Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-1.jpg',
        imageUrlDesktop: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-1.jpg',
        imageMobileUrl: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-1.jpg',
        projectUrl: 'yah-kumasi-mall.html',
        desc: 'A 2016 interior design, graphic design and 3D visualization set for yah!, a new bakery and cafe in Kumasi Mall, Ghana, built on white space, a black Chinese dragon mural and a magenta brand punch.',
        specs: {
          client: 'Yah!',
          scope: 'Interior design, graphic identity and 3D visualization for the outlet, covering the seating hall, service counter, wall murals, signage and storefront.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Interior Design\', \'Graphic Design   Architectural Visualization\']'
        }
      },
      {
        id: 'yah-kumasi-mall-plate2',
        title: 'Yah!',
        category: 'Interior Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-2.jpg',
        imageUrlDesktop: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-2.jpg',
        imageMobileUrl: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-2.jpg',
        projectUrl: 'yah-kumasi-mall.html',
        desc: 'A 2016 interior design, graphic design and 3D visualization set for yah!, a new bakery and cafe in Kumasi Mall, Ghana, built on white space, a black Chinese dragon mural and a magenta brand punch.',
        specs: {
          client: 'Yah!',
          scope: 'Interior design, graphic identity and 3D visualization for the outlet, covering the seating hall, service counter, wall murals, signage and storefront.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Interior Design\', \'Graphic Design   Architectural Visualization\']'
        }
      },
      {
        id: 'yah-kumasi-mall-plate3',
        title: 'Yah!',
        category: 'Interior Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-3.jpg',
        imageUrlDesktop: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-3.jpg',
        imageMobileUrl: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-3.jpg',
        projectUrl: 'yah-kumasi-mall.html',
        desc: 'A 2016 interior design, graphic design and 3D visualization set for yah!, a new bakery and cafe in Kumasi Mall, Ghana, built on white space, a black Chinese dragon mural and a magenta brand punch.',
        specs: {
          client: 'Yah!',
          scope: 'Interior design, graphic identity and 3D visualization for the outlet, covering the seating hall, service counter, wall murals, signage and storefront.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Interior Design\', \'Graphic Design   Architectural Visualization\']'
        }
      },
      {
        id: 'west-cantonments-residence-plate1',
        title: 'West Cantonments Residence',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cantonments/west-cantonments-1.jpg',
        imageUrlDesktop: 'assets/images/cantonments/west-cantonments-1.jpg',
        imageMobileUrl: 'assets/images/cantonments/west-cantonments-1.jpg',
        projectUrl: 'west-cantonments-igl-presentation.html',
        desc: 'Interior design and 3D visualization for the West Cantonments development by Infinite Group Ltd in Accra — rendering the reception lobby, executive boardroom, fitness centre, and rooftop bar in photoreal detail.',
        specs: {
          client: 'Infinite Group Ltd',
          scope: 'Interior Design & 3D Visualization (Modeling & Rendering)',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'west-cantonments-residence-plate2',
        title: 'West Cantonments Residence',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cantonments/west-cantonments-2.jpg',
        imageUrlDesktop: 'assets/images/cantonments/west-cantonments-2.jpg',
        imageMobileUrl: 'assets/images/cantonments/west-cantonments-2.jpg',
        projectUrl: 'west-cantonments-igl-presentation.html',
        desc: 'Interior design and 3D visualization for the West Cantonments development by Infinite Group Ltd in Accra — rendering the reception lobby, executive boardroom, fitness centre, and rooftop bar in photoreal detail.',
        specs: {
          client: 'Infinite Group Ltd',
          scope: 'Interior Design & 3D Visualization (Modeling & Rendering)',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'watsons-place-plate1',
        title: 'Watson’s Place',
        category: 'Interior Design & Architectural Visualization — 2016',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/watsons-place/watsons-place-4.jpg',
        imageUrlDesktop: 'assets/images/watsons-place/watsons-place-4.jpg',
        imageMobileUrl: 'assets/images/watsons-place/watsons-place-4.jpg',
        projectUrl: 'watsons-place.html',
        desc: 'Five interior design and visualization plates from 2016 for Watson s Place, a residential block in Accra: two street views of the grey, stone and orange facade, then lounge, dining and bedroom interiors made as marketing material.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for property marketing: two street-facing exterior views and lounge, dining and bedroom interior renders.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'watsons-place-plate2',
        title: 'Watson’s Place',
        category: 'Interior Design & Architectural Visualization — 2016',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/watsons-place/watsons-place-1.jpg',
        imageUrlDesktop: 'assets/images/watsons-place/watsons-place-1.jpg',
        imageMobileUrl: 'assets/images/watsons-place/watsons-place-1.jpg',
        projectUrl: 'watsons-place.html',
        desc: 'Five interior design and visualization plates from 2016 for Watson s Place, a residential block in Accra: two street views of the grey, stone and orange facade, then lounge, dining and bedroom interiors made as marketing material.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for property marketing: two street-facing exterior views and lounge, dining and bedroom interior renders.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'watsons-place-plate3',
        title: 'Watson’s Place',
        category: 'Interior Design & Architectural Visualization — 2016',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/watsons-place/watsons-place-2.jpg',
        imageUrlDesktop: 'assets/images/watsons-place/watsons-place-2.jpg',
        imageMobileUrl: 'assets/images/watsons-place/watsons-place-2.jpg',
        projectUrl: 'watsons-place.html',
        desc: 'Five interior design and visualization plates from 2016 for Watson s Place, a residential block in Accra: two street views of the grey, stone and orange facade, then lounge, dining and bedroom interiors made as marketing material.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for property marketing: two street-facing exterior views and lounge, dining and bedroom interior renders.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'villa-aggregate-plate1',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-2.jpg',
        imageUrlDesktop: 'assets/images/aggregate/villa-aggregate-2.jpg',
        imageMobileUrl: 'assets/images/aggregate/villa-aggregate-2.jpg',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'villa-aggregate-plate2',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-3.jpg',
        imageUrlDesktop: 'assets/images/aggregate/villa-aggregate-3.jpg',
        imageMobileUrl: 'assets/images/aggregate/villa-aggregate-3.jpg',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'victoria-island-naija-project-plate1',
        title: 'VI',
        category: 'Interior Design & 3D Visualization — 2013',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/vi/vi-1.jpg',
        imageUrlDesktop: 'assets/images/vi/vi-1.jpg',
        imageMobileUrl: 'assets/images/vi/vi-1.jpg',
        projectUrl: 'victoria-island-naija-project.html',
        desc: 'Four interior visualization plates from 2013 for an apartment on Victoria Island, Lagos, made for a Nigerian architectural firm: a calm living room shown from three cameras plus its kitchen, as interior design and 3D visualization.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design of the living room and kitchen scheme, styling of the views, and four finished 3D visualization plates with title and credit overlays.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design   3D Visualization\']'
        }
      },
      {
        id: 'victoria-island-naija-project-plate2',
        title: 'VI',
        category: 'Interior Design & 3D Visualization — 2013',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/vi/vi-2.jpg',
        imageUrlDesktop: 'assets/images/vi/vi-2.jpg',
        imageMobileUrl: 'assets/images/vi/vi-2.jpg',
        projectUrl: 'victoria-island-naija-project.html',
        desc: 'Four interior visualization plates from 2013 for an apartment on Victoria Island, Lagos, made for a Nigerian architectural firm: a calm living room shown from three cameras plus its kitchen, as interior design and 3D visualization.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design of the living room and kitchen scheme, styling of the views, and four finished 3D visualization plates with title and credit overlays.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design   3D Visualization\']'
        }
      },
      {
        id: 'victoria-island-naija-project-plate3',
        title: 'VI',
        category: 'Interior Design & 3D Visualization — 2013',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/vi/vi-3.jpg',
        imageUrlDesktop: 'assets/images/vi/vi-3.jpg',
        imageMobileUrl: 'assets/images/vi/vi-3.jpg',
        projectUrl: 'victoria-island-naija-project.html',
        desc: 'Four interior visualization plates from 2013 for an apartment on Victoria Island, Lagos, made for a Nigerian architectural firm: a calm living room shown from three cameras plus its kitchen, as interior design and 3D visualization.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design of the living room and kitchen scheme, styling of the views, and four finished 3D visualization plates with title and credit overlays.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design   3D Visualization\']'
        }
      },
      {
        id: 'tower-cascades-plate1',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-hero.jpg',
        imageUrlDesktop: 'assets/images/cascades/tower-cascades-hero.jpg',
        imageMobileUrl: 'assets/images/cascades/tower-cascades-hero.jpg',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: twenty-four visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'tower-cascades-plate2',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-1.jpg',
        imageUrlDesktop: 'assets/images/cascades/tower-cascades-1.jpg',
        imageMobileUrl: 'assets/images/cascades/tower-cascades-1.jpg',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: twenty-four visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'hamlet-estate-plate1',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-estate.jpg',
        imageUrlDesktop: 'assets/images/hamlet/hamlet-estate-desktop.jpg',
        imageMobileUrl: 'assets/images/hamlet/hamlet-estate-mobile.jpg',
        projectUrl: 'the-hamlet-presentation.html',
        desc: 'Interior design and photorealistic 3D visualization for The Hamlet — twenty luxury residences in Cantonments, Accra, rendered to present the proposed houses to prospective clients.',
        specs: {
          client: 'Nest',
          scope: 'Interior Design & 3D Visualization (Modeling & Rendering)',
          team: 'Jude Nyoagbe, Jude Abbey, Nana Afua Addo Boateng',
          year: '2018',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'hamlet-estate-plate2',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-night-angle.jpg',
        imageUrlDesktop: 'assets/images/hamlet/hamlet-night-angle.jpg',
        imageMobileUrl: 'assets/images/hamlet/hamlet-night-angle.jpg',
        projectUrl: 'the-hamlet-presentation.html',
        desc: 'Interior design and photorealistic 3D visualization for The Hamlet — twenty luxury residences in Cantonments, Accra, rendered to present the proposed houses to prospective clients.',
        specs: {
          client: 'Nest',
          scope: 'Interior Design & 3D Visualization (Modeling & Rendering)',
          team: 'Jude Nyoagbe, Jude Abbey, Nana Afua Addo Boateng',
          year: '2018',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'asante-interior-design-presentation-plate1',
        title: 'TAI',
        category: 'Interior Design — 2020',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-1.jpg',
        imageUrlDesktop: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-1.jpg',
        imageMobileUrl: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-1.jpg',
        projectUrl: 'asante-interior-design-presentation.html',
        desc: 'TAI is a four-room interior presentation for a private house in Accra   a bedroom, a dining room, an entrance hall and a gym, each visualized at full size so the client could approve the scheme before anything was built.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design presentation: space planning, furniture and finish selection, lighting design and photoreal 3D visualization of four rooms.',
          team: 'RDVS. DESIGN',
          year: '2020',
          disciplines: '[\'Interior Design\']'
        }
      },
      {
        id: 'asante-interior-design-presentation-plate2',
        title: 'TAI',
        category: 'Interior Design — 2020',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-3.jpg',
        imageUrlDesktop: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-3.jpg',
        imageMobileUrl: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-3.jpg',
        projectUrl: 'asante-interior-design-presentation.html',
        desc: 'TAI is a four-room interior presentation for a private house in Accra   a bedroom, a dining room, an entrance hall and a gym, each visualized at full size so the client could approve the scheme before anything was built.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design presentation: space planning, furniture and finish selection, lighting design and photoreal 3D visualization of four rooms.',
          team: 'RDVS. DESIGN',
          year: '2020',
          disciplines: '[\'Interior Design\']'
        }
      },
      {
        id: 'swipe-plate1',
        title: 'Swipe',
        category: 'Interior Design, Graphic Design, BIM & Architectural Visualization — 2020',
        service: 'Interior Design, Graphic Design, BIM & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/swipe/swipe-1.jpg',
        imageUrlDesktop: 'assets/images/swipe/swipe-1.jpg',
        imageMobileUrl: 'assets/images/swipe/swipe-1.jpg',
        projectUrl: 'swipe.html',
        desc: 'Interior design, environmental graphics, BIM modelling and architectural visualization for Swipe\'s own workplace in Accra   fifteen plates that carry a single lime-green identity from the logo through to the walls, the glass and the wayfinding.',
        specs: {
          client: 'Swipe',
          scope: 'Interior design, environmental graphics, BIM modelling and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'BIM   Architectural Visualization\']'
        }
      },
      {
        id: 'swipe-plate2',
        title: 'Swipe',
        category: 'Interior Design, Graphic Design, BIM & Architectural Visualization — 2020',
        service: 'Interior Design, Graphic Design, BIM & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/swipe/swipe-2.jpg',
        imageUrlDesktop: 'assets/images/swipe/swipe-2.jpg',
        imageMobileUrl: 'assets/images/swipe/swipe-2.jpg',
        projectUrl: 'swipe.html',
        desc: 'Interior design, environmental graphics, BIM modelling and architectural visualization for Swipe\'s own workplace in Accra   fifteen plates that carry a single lime-green identity from the logo through to the walls, the glass and the wayfinding.',
        specs: {
          client: 'Swipe',
          scope: 'Interior design, environmental graphics, BIM modelling and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'BIM   Architectural Visualization\']'
        }
      },
      {
        id: 'stellar-bar-plate1',
        title: 'Stellar Bar',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/stellar-bar/stellar-bar-1.jpg',
        imageUrlDesktop: 'assets/images/stellar-bar/stellar-bar-1.jpg',
        imageMobileUrl: 'assets/images/stellar-bar/stellar-bar-1.jpg',
        projectUrl: 'stellar-bar.html',
        desc: 'A 2013 bar interior for Stellar Foods in Nigeria: a low, warm lounge of timber banquettes, brick-piered back bar and an internally lit bar counter, designed and rendered by RDVS before construction.',
        specs: {
          client: 'Stellar Foods',
          scope: 'Interior design and architectural visualization of a bar interior: lounge and banquette seating, back bar and illuminated bar counter, lighting design and photoreal renders',
          team: 'RDVS',
          year: '2013',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'stellar-bar-plate2',
        title: 'Stellar Bar',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/stellar-bar/stellar-bar-2.jpg',
        imageUrlDesktop: 'assets/images/stellar-bar/stellar-bar-2.jpg',
        imageMobileUrl: 'assets/images/stellar-bar/stellar-bar-2.jpg',
        projectUrl: 'stellar-bar.html',
        desc: 'A 2013 bar interior for Stellar Foods in Nigeria: a low, warm lounge of timber banquettes, brick-piered back bar and an internally lit bar counter, designed and rendered by RDVS before construction.',
        specs: {
          client: 'Stellar Foods',
          scope: 'Interior design and architectural visualization of a bar interior: lounge and banquette seating, back bar and illuminated bar counter, lighting design and photoreal renders',
          team: 'RDVS',
          year: '2013',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'smsgh-plate1',
        title: 'SMSGH',
        category: 'Interior Design, Graphic Design, Digital Illustration & Architectural Visualization — 2013',
        service: 'Interior Design, Graphic Design, Digital Illustration & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/smsgh/smsgh-1.jpg',
        imageUrlDesktop: 'assets/images/smsgh/smsgh-1.jpg',
        imageMobileUrl: 'assets/images/smsgh/smsgh-1.jpg',
        projectUrl: 'smsgh.html',
        desc: 'Interior design, visualization and later photography for the SMSGH office in Accra, Ghana: twelve plates that run from the orange-walled reception and boardroom renders through to photographed corridors, workrooms and the break-out space.',
        specs: {
          client: 'SMSGH',
          scope: 'Interior design for the office floor, environmental graphics and logo wall, 3D visualization of the scheme, and photographic documentation of the completed office.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'Digital Illustration   Architectural Visualization\']'
        }
      },
      {
        id: 'smsgh-plate2',
        title: 'SMSGH',
        category: 'Interior Design, Graphic Design, Digital Illustration & Architectural Visualization — 2013',
        service: 'Interior Design, Graphic Design, Digital Illustration & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/smsgh/smsgh-2.jpg',
        imageUrlDesktop: 'assets/images/smsgh/smsgh-2.jpg',
        imageMobileUrl: 'assets/images/smsgh/smsgh-2.jpg',
        projectUrl: 'smsgh.html',
        desc: 'Interior design, visualization and later photography for the SMSGH office in Accra, Ghana: twelve plates that run from the orange-walled reception and boardroom renders through to photographed corridors, workrooms and the break-out space.',
        specs: {
          client: 'SMSGH',
          scope: 'Interior design for the office floor, environmental graphics and logo wall, 3D visualization of the scheme, and photographic documentation of the completed office.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'Digital Illustration   Architectural Visualization\']'
        }
      },
      {
        id: 'smsgh-plate3',
        title: 'SMSGH',
        category: 'Interior Design, Graphic Design, Digital Illustration & Architectural Visualization — 2013',
        service: 'Interior Design, Graphic Design, Digital Illustration & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/smsgh/smsgh-3.jpg',
        imageUrlDesktop: 'assets/images/smsgh/smsgh-3.jpg',
        imageMobileUrl: 'assets/images/smsgh/smsgh-3.jpg',
        projectUrl: 'smsgh.html',
        desc: 'Interior design, visualization and later photography for the SMSGH office in Accra, Ghana: twelve plates that run from the orange-walled reception and boardroom renders through to photographed corridors, workrooms and the break-out space.',
        specs: {
          client: 'SMSGH',
          scope: 'Interior design for the office floor, environmental graphics and logo wall, 3D visualization of the scheme, and photographic documentation of the completed office.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'Digital Illustration   Architectural Visualization\']'
        }
      },
      {
        id: 'rlg-plate1',
        title: 'RLG',
        category: 'Industrial & Furniture Design — 2013',
        service: 'Industrial & Furniture Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/advantage-place/advantage-place-1.jpg',
        imageUrlDesktop: 'assets/images/advantage-place/advantage-place-1.jpg',
        imageMobileUrl: 'assets/images/advantage-place/advantage-place-1-mobile.jpg',
        projectUrl: 'rlg.html',
        desc: 'A 2013 multidisciplinary commission spanning interior design, industrial   furniture design, graphic design, and 3D visualization for RLG.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design, Industrial & Furniture Design, Graphic Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2013',
          disciplines: '[\'Industrial   Furniture Design\']'
        }
      },
      {
        id: 'project-mount-plate1',
        title: 'Project Mount',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/project-mount/project-mount-1.jpg',
        imageUrlDesktop: 'assets/images/project-mount/project-mount-1.jpg',
        imageMobileUrl: 'assets/images/project-mount/project-mount-1.jpg',
        projectUrl: 'project-mount.html',
        desc: 'Four presentation boards from 2018 for Project Mount, each pairing a photoreal render with the ground-floor plan: two exterior angles of the house and interiors of the living room and dining area.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'Interior Design & 3D Visualization\']'
        }
      },
      {
        id: 'project-mount-plate2',
        title: 'Project Mount',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/project-mount/project-mount-2.jpg',
        imageUrlDesktop: 'assets/images/project-mount/project-mount-2.jpg',
        imageMobileUrl: 'assets/images/project-mount/project-mount-2.jpg',
        projectUrl: 'project-mount.html',
        desc: 'Four presentation boards from 2018 for Project Mount, each pairing a photoreal render with the ground-floor plan: two exterior angles of the house and interiors of the living room and dining area.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'Interior Design & 3D Visualization\']'
        }
      },
      {
        id: 'project-mount-plate3',
        title: 'Project Mount',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/project-mount/project-mount-3.jpg',
        imageUrlDesktop: 'assets/images/project-mount/project-mount-3.jpg',
        imageMobileUrl: 'assets/images/project-mount/project-mount-3.jpg',
        projectUrl: 'project-mount.html',
        desc: 'Four presentation boards from 2018 for Project Mount, each pairing a photoreal render with the ground-floor plan: two exterior angles of the house and interiors of the living room and dining area.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'Interior Design & 3D Visualization\']'
        }
      },
      {
        id: 'premier-place-plate1',
        title: 'Premier Place',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/premier-place/premier-place-1.jpg',
        imageUrlDesktop: 'assets/images/premier-place/premier-place-1.jpg',
        imageMobileUrl: 'assets/images/premier-place/premier-place-1.jpg',
        projectUrl: 'premier-place.html',
        desc: 'Interior design and 3D visualization completed by RDVS. Design in 2012 for Premier Place, an apartment block in Accra delivered for the New Life   Mambo Group, covering private apartments and shared amenity spaces.',
        specs: {
          client: 'New Life & Mambo Group',
          scope: 'Interior design of the apartments and amenity spaces, plus the full set of 3D visualizations for the Premier Place apartment block in Accra.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'premier-place-plate2',
        title: 'Premier Place',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/premier-place/premier-place-2.jpg',
        imageUrlDesktop: 'assets/images/premier-place/premier-place-2.jpg',
        imageMobileUrl: 'assets/images/premier-place/premier-place-2.jpg',
        projectUrl: 'premier-place.html',
        desc: 'Interior design and 3D visualization completed by RDVS. Design in 2012 for Premier Place, an apartment block in Accra delivered for the New Life   Mambo Group, covering private apartments and shared amenity spaces.',
        specs: {
          client: 'New Life & Mambo Group',
          scope: 'Interior design of the apartments and amenity spaces, plus the full set of 3D visualizations for the Premier Place apartment block in Accra.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'premier-place-plate3',
        title: 'Premier Place',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/premier-place/premier-place-3.jpg',
        imageUrlDesktop: 'assets/images/premier-place/premier-place-3.jpg',
        imageMobileUrl: 'assets/images/premier-place/premier-place-3.jpg',
        projectUrl: 'premier-place.html',
        desc: 'Interior design and 3D visualization completed by RDVS. Design in 2012 for Premier Place, an apartment block in Accra delivered for the New Life   Mambo Group, covering private apartments and shared amenity spaces.',
        specs: {
          client: 'New Life & Mambo Group',
          scope: 'Interior design of the apartments and amenity spaces, plus the full set of 3D visualizations for the Premier Place apartment block in Accra.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'poconos-bar-grill-plate1',
        title: 'Poconos Bar + Grill',
        category: 'Landscape Design, Interior Design & 3D Visualization — 2017',
        service: 'Landscape Design, Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-1.jpg',
        imageUrlDesktop: 'assets/images/poconos-bar-grill/poconos-bar-grill-1.jpg',
        imageMobileUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-1.jpg',
        projectUrl: 'poconos-bar-grill.html',
        desc: 'A 2017 multidisciplinary commission spanning architecture, landscape design, interior design, and 3D visualization for Poconos Bar + Grill.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Landscape Design, Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Landscape Design\', \'Interior Design   3D Visualization\']'
        }
      },
      {
        id: 'poconos-bar-grill-plate2',
        title: 'Poconos Bar + Grill',
        category: 'Landscape Design, Interior Design & 3D Visualization — 2017',
        service: 'Landscape Design, Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-2.jpg',
        imageUrlDesktop: 'assets/images/poconos-bar-grill/poconos-bar-grill-2.jpg',
        imageMobileUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-2.jpg',
        projectUrl: 'poconos-bar-grill.html',
        desc: 'A 2017 multidisciplinary commission spanning architecture, landscape design, interior design, and 3D visualization for Poconos Bar + Grill.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Landscape Design, Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Landscape Design\', \'Interior Design   3D Visualization\']'
        }
      },
      {
        id: 'pine-square-plate1',
        title: 'Pine Square',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/pine-square/pine-square-15.jpg',
        imageUrlDesktop: 'assets/images/pine-square/pine-square-15.jpg',
        imageMobileUrl: 'assets/images/pine-square/pine-square-15.jpg',
        projectUrl: 'pine-square.html',
        desc: 'Interior design and 3D visualization for Pine Square, a 2017 office scheme in Accra: dusk and daytime exterior renders, open-plan and executive interiors, and a run of mood boards covering finishes, reception, landscape and rooftop.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization: concept mood boards for finishes, reception, landscape and rooftop, plus exterior dusk and daytime views, parking, lobby, open-plan and executive office renders.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'pine-square-plate2',
        title: 'Pine Square',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/pine-square/pine-square-1.jpg',
        imageUrlDesktop: 'assets/images/pine-square/pine-square-1.jpg',
        imageMobileUrl: 'assets/images/pine-square/pine-square-1.jpg',
        projectUrl: 'pine-square.html',
        desc: 'Interior design and 3D visualization for Pine Square, a 2017 office scheme in Accra: dusk and daytime exterior renders, open-plan and executive interiors, and a run of mood boards covering finishes, reception, landscape and rooftop.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization: concept mood boards for finishes, reception, landscape and rooftop, plus exterior dusk and daytime views, parking, lobby, open-plan and executive office renders.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'pine-square-plate3',
        title: 'Pine Square',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/pine-square/pine-square-2.jpg',
        imageUrlDesktop: 'assets/images/pine-square/pine-square-2.jpg',
        imageMobileUrl: 'assets/images/pine-square/pine-square-2.jpg',
        projectUrl: 'pine-square.html',
        desc: 'Interior design and 3D visualization for Pine Square, a 2017 office scheme in Accra: dusk and daytime exterior renders, open-plan and executive interiors, and a run of mood boards covering finishes, reception, landscape and rooftop.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization: concept mood boards for finishes, reception, landscape and rooftop, plus exterior dusk and daytime views, parking, lobby, open-plan and executive office renders.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'petrus-plate1',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-2.jpg',
        imageUrlDesktop: 'assets/images/petrus/petrus-2.jpg',
        imageMobileUrl: 'assets/images/petrus/petrus-2.jpg',
        projectUrl: 'petrus.html',
        desc: 'Interior design and photorealistic 3D visualization commissioned by Imperial Homes for Petrus, with architecture by S.A.A.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: '3D Visualization & Interior Design: RDVS | Architecture: S.A.A',
          year: '2017',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },
      {
        id: 'petrus-plate2',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-3.jpg',
        imageUrlDesktop: 'assets/images/petrus/petrus-3.jpg',
        imageMobileUrl: 'assets/images/petrus/petrus-3.jpg',
        projectUrl: 'petrus.html',
        desc: 'Interior design and photorealistic 3D visualization commissioned by Imperial Homes for Petrus, with architecture by S.A.A.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: '3D Visualization & Interior Design: RDVS | Architecture: S.A.A',
          year: '2017',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },
      {
        id: 'octagon-interiors-plate1',
        title: 'Octagon',
        category: 'Interior Design & Architectural Visualization — 2014',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/octagon-interiors/octagon-interiors-9.jpg',
        imageUrlDesktop: 'assets/images/octagon-interiors/octagon-interiors-9.jpg',
        imageMobileUrl: 'assets/images/octagon-interiors/octagon-interiors-9.jpg',
        projectUrl: 'octagon-interiors.html',
        desc: 'Interior design and 3D visualization for the Octagon apartment in Accra, Ghana: fourteen plates that move through the dining room, kitchens, bedrooms and lounges before stepping outside to the stone-and-white apartment blocks, their pool deck and a dusk view.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design for the apartment, furniture and finish selection, and a full set of 3D visualizations covering the rooms, the building exteriors and the pool deck.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'octagon-interiors-plate2',
        title: 'Octagon',
        category: 'Interior Design & Architectural Visualization — 2014',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/octagon-interiors/octagon-interiors-1.jpg',
        imageUrlDesktop: 'assets/images/octagon-interiors/octagon-interiors-1.jpg',
        imageMobileUrl: 'assets/images/octagon-interiors/octagon-interiors-1.jpg',
        projectUrl: 'octagon-interiors.html',
        desc: 'Interior design and 3D visualization for the Octagon apartment in Accra, Ghana: fourteen plates that move through the dining room, kitchens, bedrooms and lounges before stepping outside to the stone-and-white apartment blocks, their pool deck and a dusk view.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design for the apartment, furniture and finish selection, and a full set of 3D visualizations covering the rooms, the building exteriors and the pool deck.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'octagon-interiors-plate3',
        title: 'Octagon',
        category: 'Interior Design & Architectural Visualization — 2014',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/octagon-interiors/octagon-interiors-2.jpg',
        imageUrlDesktop: 'assets/images/octagon-interiors/octagon-interiors-2.jpg',
        imageMobileUrl: 'assets/images/octagon-interiors/octagon-interiors-2.jpg',
        projectUrl: 'octagon-interiors.html',
        desc: 'Interior design and 3D visualization for the Octagon apartment in Accra, Ghana: fourteen plates that move through the dining room, kitchens, bedrooms and lounges before stepping outside to the stone-and-white apartment blocks, their pool deck and a dusk view.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design for the apartment, furniture and finish selection, and a full set of 3D visualizations covering the rooms, the building exteriors and the pool deck.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'oak-tree-apartments-plate1',
        title: 'Oak Tree Apartments',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/oak-tree-apartments/oak-tree-apartments-1.jpg',
        imageUrlDesktop: 'assets/images/oak-tree-apartments/oak-tree-apartments-1.jpg',
        imageMobileUrl: 'assets/images/oak-tree-apartments/oak-tree-apartments-1.jpg',
        projectUrl: 'oak-tree-apartments.html',
        desc: 'Eight visualization plates from 2013 for Oak Tree Apartments in Accra, moving between the exterior approach and the furnished unit interiors, delivered as interior design and 3D visualization by RDVS Studio for a private client.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and styling of the apartment rooms, plus the complete set of exterior and interior 3D visualizations with titled, credit-marked plates.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'oak-tree-apartments-plate2',
        title: 'Oak Tree Apartments',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/oak-tree-apartments/oak-tree-apartments-2.jpg',
        imageUrlDesktop: 'assets/images/oak-tree-apartments/oak-tree-apartments-2.jpg',
        imageMobileUrl: 'assets/images/oak-tree-apartments/oak-tree-apartments-2.jpg',
        projectUrl: 'oak-tree-apartments.html',
        desc: 'Eight visualization plates from 2013 for Oak Tree Apartments in Accra, moving between the exterior approach and the furnished unit interiors, delivered as interior design and 3D visualization by RDVS Studio for a private client.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and styling of the apartment rooms, plus the complete set of exterior and interior 3D visualizations with titled, credit-marked plates.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'oak-tree-apartments-plate3',
        title: 'Oak Tree Apartments',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/oak-tree-apartments/oak-tree-apartments-3.jpg',
        imageUrlDesktop: 'assets/images/oak-tree-apartments/oak-tree-apartments-3.jpg',
        imageMobileUrl: 'assets/images/oak-tree-apartments/oak-tree-apartments-3.jpg',
        projectUrl: 'oak-tree-apartments.html',
        desc: 'Eight visualization plates from 2013 for Oak Tree Apartments in Accra, moving between the exterior approach and the furnished unit interiors, delivered as interior design and 3D visualization by RDVS Studio for a private client.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and styling of the apartment rooms, plus the complete set of exterior and interior 3D visualizations with titled, credit-marked plates.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'nyla-court-plate1',
        title: 'Nyla Court',
        category: 'Interior Design & Architectural Visualization — 2020',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/nyla-court/nyla-court-living-01.jpg',
        imageUrlDesktop: 'assets/images/nyla-court/nyla-court-living-01.jpg',
        imageMobileUrl: 'assets/images/nyla-court/nyla-court-living-01.jpg',
        projectUrl: 'nyla-court.html',
        desc: 'Interior design and architectural visualization for Nyla Court, a group of white two-storey houses arranged around a paved court, developed across forty-three plates that run from the living and dining room through to the wardrobes and the stone in the bathroom.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'nyla-court-plate2',
        title: 'Nyla Court',
        category: 'Interior Design & Architectural Visualization — 2020',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/nyla-court/nyla-court-living-02.jpg',
        imageUrlDesktop: 'assets/images/nyla-court/nyla-court-living-02.jpg',
        imageMobileUrl: 'assets/images/nyla-court/nyla-court-living-02.jpg',
        projectUrl: 'nyla-court.html',
        desc: 'Interior design and architectural visualization for Nyla Court, a group of white two-storey houses arranged around a paved court, developed across forty-three plates that run from the living and dining room through to the wardrobes and the stone in the bathroom.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'naadei-villas-plate1',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-2.jpg',
        imageUrlDesktop: 'assets/images/naadei-villas/naadei-villas-2.jpg',
        imageMobileUrl: 'assets/images/naadei-villas/naadei-villas-2.jpg',
        projectUrl: 'naadei-villas.html',
        desc: 'A 2018 interior design and architectural visualization project commissioned by a private client for Naadei Villas.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & Architectural Visualization',
          team: 'Jude Abbey, Jude Nyoagbe, Nana Beniako',
          year: '2018',
          disciplines: '[\'Interior Design\', \'Architectural Visualization\']'
        }
      },
      {
        id: 'naadei-villas-plate2',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-3.jpg',
        imageUrlDesktop: 'assets/images/naadei-villas/naadei-villas-3.jpg',
        imageMobileUrl: 'assets/images/naadei-villas/naadei-villas-3.jpg',
        projectUrl: 'naadei-villas.html',
        desc: 'A 2018 interior design and architectural visualization project commissioned by a private client for Naadei Villas.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & Architectural Visualization',
          team: 'Jude Abbey, Jude Nyoagbe, Nana Beniako',
          year: '2018',
          disciplines: '[\'Interior Design\', \'Architectural Visualization\']'
        }
      },
      {
        id: 'moty-intro-motion-plate1',
        title: 'MOTY',
        category: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/moty/moty-1.jpg',
        imageUrlDesktop: 'assets/images/moty/moty-1.jpg',
        imageMobileUrl: 'assets/images/moty/moty-1.jpg',
        projectUrl: 'moty.html',
        desc: 'Futuristic broadcast title opener utilizing optical refraction, metallic shaders, and synchronized kinetic audio hits.',
        specs: {
          client: 'Mother of the Year (MOTY)',
          scope: 'Interior design, custom furniture and fixture design, retail graphics and the full set of 3D visualizations for the MOTY children’s store at Accra Mall.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Interior Design\', \'Furniture Design\', \'Graphic Design   Architectural Visualization\']'
        }
      },
      {
        id: 'moty-intro-motion-plate2',
        title: 'MOTY',
        category: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/moty/moty-2.jpg',
        imageUrlDesktop: 'assets/images/moty/moty-2.jpg',
        imageMobileUrl: 'assets/images/moty/moty-2.jpg',
        projectUrl: 'moty.html',
        desc: 'Futuristic broadcast title opener utilizing optical refraction, metallic shaders, and synchronized kinetic audio hits.',
        specs: {
          client: 'Mother of the Year (MOTY)',
          scope: 'Interior design, custom furniture and fixture design, retail graphics and the full set of 3D visualizations for the MOTY children’s store at Accra Mall.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Interior Design\', \'Furniture Design\', \'Graphic Design   Architectural Visualization\']'
        }
      },
      {
        id: 'maple-court-plate1',
        title: 'Maple Court',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/maple-court/maple-court-1.jpg',
        imageUrlDesktop: 'assets/images/maple-court/maple-court-1.jpg',
        imageMobileUrl: 'assets/images/maple-court/maple-court-1.jpg',
        projectUrl: 'maple-court.html',
        desc: 'A 2013 interior design and 3D visualization package for Maple Court, a low-rise apartment scheme in Accra, Ghana: street elevation, roof plan, courtyard pool and three furnished interiors, released as a Living set in May 2013.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design for the apartment units, plus 3D visualization of the street elevation, roof plan, courtyard and interiors.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'maple-court-plate2',
        title: 'Maple Court',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/maple-court/maple-court-2.jpg',
        imageUrlDesktop: 'assets/images/maple-court/maple-court-2.jpg',
        imageMobileUrl: 'assets/images/maple-court/maple-court-2.jpg',
        projectUrl: 'maple-court.html',
        desc: 'A 2013 interior design and 3D visualization package for Maple Court, a low-rise apartment scheme in Accra, Ghana: street elevation, roof plan, courtyard pool and three furnished interiors, released as a Living set in May 2013.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design for the apartment units, plus 3D visualization of the street elevation, roof plan, courtyard and interiors.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'maple-court-plate3',
        title: 'Maple Court',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/maple-court/maple-court-3.jpg',
        imageUrlDesktop: 'assets/images/maple-court/maple-court-3.jpg',
        imageMobileUrl: 'assets/images/maple-court/maple-court-3.jpg',
        projectUrl: 'maple-court.html',
        desc: 'A 2013 interior design and 3D visualization package for Maple Court, a low-rise apartment scheme in Accra, Ghana: street elevation, roof plan, courtyard pool and three furnished interiors, released as a Living set in May 2013.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design for the apartment units, plus 3D visualization of the street elevation, roof plan, courtyard and interiors.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'macord-international-school-plate1',
        title: 'Macord International School',
        category: '3D Visualization — 2024',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/macord/macord-5.jpg',
        imageUrlDesktop: 'assets/images/macord/macord-5.jpg',
        imageMobileUrl: 'assets/images/macord/macord-5.jpg',
        projectUrl: 'macord.html',
        desc: 'A complete 2024 school commission — street-facing facade in rhythmic coloured fins and planted terraces, landscape forecourt, resolved interiors and a bespoke furniture package, carried through to photoreal 3D visualization.',
        specs: {
          client: 'Macord International School',
          scope: 'Facade Design (Architectural Design), Landscape Design, Interior Design, Industrial & Furniture Design & 3D Visualization',
          team: 'Jude Nyoagbe',
          year: '2024',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'macord-international-school-plate2',
        title: 'Macord International School',
        category: '3D Visualization — 2024',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/macord/macord-3.jpg',
        imageUrlDesktop: 'assets/images/macord/macord-3.jpg',
        imageMobileUrl: 'assets/images/macord/macord-3.jpg',
        projectUrl: 'macord.html',
        desc: 'A complete 2024 school commission — street-facing facade in rhythmic coloured fins and planted terraces, landscape forecourt, resolved interiors and a bespoke furniture package, carried through to photoreal 3D visualization.',
        specs: {
          client: 'Macord International School',
          scope: 'Facade Design (Architectural Design), Landscape Design, Interior Design, Industrial & Furniture Design & 3D Visualization',
          team: 'Jude Nyoagbe',
          year: '2024',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'link-drive-road-plate1',
        title: 'Link Drive Rd.',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/link-drive/link-drive-4.jpg',
        imageUrlDesktop: 'assets/images/link-drive/link-drive-4.jpg',
        imageMobileUrl: 'assets/images/link-drive/link-drive-4.jpg',
        projectUrl: 'link-drive-road.html',
        desc: 'Interior design and photorealistic 3D visualization for Link Drive Rd., a bespoke residential project completed for Imperial Homes.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },
      {
        id: 'link-drive-road-plate2',
        title: 'Link Drive Rd.',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/link-drive/link-drive-2.jpg',
        imageUrlDesktop: 'assets/images/link-drive/link-drive-2.jpg',
        imageMobileUrl: 'assets/images/link-drive/link-drive-2.jpg',
        projectUrl: 'link-drive-road.html',
        desc: 'Interior design and photorealistic 3D visualization for Link Drive Rd., a bespoke residential project completed for Imperial Homes.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },
      {
        id: 'la-beach-towers-plate1',
        title: 'La Beach Towers',
        category: '3D Visualization — 2013',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/la-beach-towers/la-beach-towers-2.jpg',
        imageUrlDesktop: 'assets/images/la-beach-towers/la-beach-towers-2.jpg',
        imageMobileUrl: 'assets/images/la-beach-towers/la-beach-towers-2.jpg',
        projectUrl: 'la-beach-towers.html',
        desc: 'Interior design and 3D visualization for La Beach Towers, a seaside development in Ghana — modeling and rendering the living, dining, and private quarters in photoreal detail.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization (Modeling & Rendering)',
          team: 'RDVS Team',
          year: '2013',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'la-beach-towers-plate2',
        title: 'La Beach Towers',
        category: '3D Visualization — 2013',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/la-beach-towers/la-beach-towers-3.jpg',
        imageUrlDesktop: 'assets/images/la-beach-towers/la-beach-towers-3.jpg',
        imageMobileUrl: 'assets/images/la-beach-towers/la-beach-towers-3.jpg',
        projectUrl: 'la-beach-towers.html',
        desc: 'Interior design and 3D visualization for La Beach Towers, a seaside development in Ghana — modeling and rendering the living, dining, and private quarters in photoreal detail.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization (Modeling & Rendering)',
          team: 'RDVS Team',
          year: '2013',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'imperial-square-plate1',
        title: 'Imperial Square',
        category: 'Interior Design — 2013',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/imperial-square/imperial-square-1.jpg',
        imageUrlDesktop: 'assets/images/imperial-square/imperial-square-1.jpg',
        imageMobileUrl: 'assets/images/imperial-square/imperial-square-1.jpg',
        projectUrl: 'imperial-square.html',
        desc: 'Comprehensive interior design, industrial & furniture design, and 3D visualization for Imperial Square commercial space.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design, Industrial & Furniture Design, 3D Visualization',
          team: 'RDVS Team',
          year: '2013',
          disciplines: '[\'Interior Design\']'
        }
      },
      {
        id: 'imperial-square-plate2',
        title: 'Imperial Square',
        category: 'Interior Design — 2013',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/imperial-square/imperial-square-2.jpg',
        imageUrlDesktop: 'assets/images/imperial-square/imperial-square-2.jpg',
        imageMobileUrl: 'assets/images/imperial-square/imperial-square-2.jpg',
        projectUrl: 'imperial-square.html',
        desc: 'Comprehensive interior design, industrial & furniture design, and 3D visualization for Imperial Square commercial space.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design, Industrial & Furniture Design, 3D Visualization',
          team: 'RDVS Team',
          year: '2013',
          disciplines: '[\'Interior Design\']'
        }
      },
      {
        id: 'ike-plate1',
        title: 'Ike',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ike/ike-1.jpg',
        imageUrlDesktop: 'assets/images/ike/ike-1.jpg',
        imageMobileUrl: 'assets/images/ike/ike-1.jpg',
        projectUrl: 'ike.html',
        desc: 'Ike is a short 2012 interior design and visualization study for a private client in Accra, Ghana, showing three rooms of a house: a red-walled bedroom, a green-accented kitchen and a double-height living room under exposed timber trusses.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concepts for three rooms, covering colour and material schemes, furniture selection and lighting design, delivered as photorealistic 3D visualizations.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'ike-plate2',
        title: 'Ike',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ike/ike-2.jpg',
        imageUrlDesktop: 'assets/images/ike/ike-2.jpg',
        imageMobileUrl: 'assets/images/ike/ike-2.jpg',
        projectUrl: 'ike.html',
        desc: 'Ike is a short 2012 interior design and visualization study for a private client in Accra, Ghana, showing three rooms of a house: a red-walled bedroom, a green-accented kitchen and a double-height living room under exposed timber trusses.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concepts for three rooms, covering colour and material schemes, furniture selection and lighting design, delivered as photorealistic 3D visualizations.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'ike-plate3',
        title: 'Ike',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ike/ike-3.jpg',
        imageUrlDesktop: 'assets/images/ike/ike-3.jpg',
        imageMobileUrl: 'assets/images/ike/ike-3.jpg',
        projectUrl: 'ike.html',
        desc: 'Ike is a short 2012 interior design and visualization study for a private client in Accra, Ghana, showing three rooms of a house: a red-walled bedroom, a green-accented kitchen and a double-height living room under exposed timber trusses.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concepts for three rooms, covering colour and material schemes, furniture selection and lighting design, delivered as photorealistic 3D visualizations.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'hubtel-nairobi-plate1',
        title: 'Hubtel Nairobi',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hubtel/hubtel-nairobi-2.jpg',
        imageUrlDesktop: 'assets/images/hubtel/hubtel-nairobi-2.jpg',
        imageMobileUrl: 'assets/images/hubtel/hubtel-nairobi-2.jpg',
        projectUrl: 'hubtel.html',
        desc: 'Interior design and full 3D visualization for Hubtel\'s Nairobi workspace — reception and welcome sequence, open collaborative floor, and executive rooms, resolved around daylight, circulation and brand presence.',
        specs: {
          client: 'SMSGH / Hubtel',
          scope: 'Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'hubtel-nairobi-plate2',
        title: 'Hubtel Nairobi',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hubtel/hubtel-nairobi-3.jpg',
        imageUrlDesktop: 'assets/images/hubtel/hubtel-nairobi-3.jpg',
        imageMobileUrl: 'assets/images/hubtel/hubtel-nairobi-3.jpg',
        projectUrl: 'hubtel.html',
        desc: 'Interior design and full 3D visualization for Hubtel\'s Nairobi workspace — reception and welcome sequence, open collaborative floor, and executive rooms, resolved around daylight, circulation and brand presence.',
        specs: {
          client: 'SMSGH / Hubtel',
          scope: 'Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'hfa-plate1',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-1.jpg',
        imageUrlDesktop: 'assets/images/hfa/hfa-1.jpg',
        imageMobileUrl: 'assets/images/hfa/hfa-1.jpg',
        projectUrl: 'hfa.html',
        desc: 'A twelve-plate interior design and 3D visualization set for HFA, a new apartment in Accra produced with the real estate company Homes Direct for its marketing campaigns, presenting bright modern bedrooms, living and dining spaces and kitchens.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design and photorealistic 3D visualization for a residential marketing campaign.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'hfa-plate2',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-2.jpg',
        imageUrlDesktop: 'assets/images/hfa/hfa-2.jpg',
        imageMobileUrl: 'assets/images/hfa/hfa-2.jpg',
        projectUrl: 'hfa.html',
        desc: 'A twelve-plate interior design and 3D visualization set for HFA, a new apartment in Accra produced with the real estate company Homes Direct for its marketing campaigns, presenting bright modern bedrooms, living and dining spaces and kitchens.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design and photorealistic 3D visualization for a residential marketing campaign.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'hfa-plate3',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-3.jpg',
        imageUrlDesktop: 'assets/images/hfa/hfa-3.jpg',
        imageMobileUrl: 'assets/images/hfa/hfa-3.jpg',
        projectUrl: 'hfa.html',
        desc: 'A twelve-plate interior design and 3D visualization set for HFA, a new apartment in Accra produced with the real estate company Homes Direct for its marketing campaigns, presenting bright modern bedrooms, living and dining spaces and kitchens.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design and photorealistic 3D visualization for a residential marketing campaign.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'haven-project-plate1',
        title: 'Haven',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/haven-project/haven-project-1.jpg',
        imageUrlDesktop: 'assets/images/haven-project/haven-project-1.jpg',
        imageMobileUrl: 'assets/images/haven-project/haven-project-1.jpg',
        projectUrl: 'haven-project.html',
        desc: 'An eight-plate interior design and 3D visualization set from 2013 for the Haven Project, a show apartment in Ghana produced as marketing material for a real estate company, touring a bar, dining room, kitchen, bathrooms and a bedroom study.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for apartment marketing material.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'haven-project-plate2',
        title: 'Haven',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/haven-project/haven-project-2.jpg',
        imageUrlDesktop: 'assets/images/haven-project/haven-project-2.jpg',
        imageMobileUrl: 'assets/images/haven-project/haven-project-2.jpg',
        projectUrl: 'haven-project.html',
        desc: 'An eight-plate interior design and 3D visualization set from 2013 for the Haven Project, a show apartment in Ghana produced as marketing material for a real estate company, touring a bar, dining room, kitchen, bathrooms and a bedroom study.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for apartment marketing material.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'haven-project-plate3',
        title: 'Haven',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/haven-project/haven-project-3.jpg',
        imageUrlDesktop: 'assets/images/haven-project/haven-project-3.jpg',
        imageMobileUrl: 'assets/images/haven-project/haven-project-3.jpg',
        projectUrl: 'haven-project.html',
        desc: 'An eight-plate interior design and 3D visualization set from 2013 for the Haven Project, a show apartment in Ghana produced as marketing material for a real estate company, touring a bar, dining room, kitchen, bathrooms and a bedroom study.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for apartment marketing material.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'harbour-pointe-plate1',
        title: 'Harbour Pointe',
        category: 'Interior Design & 3D Visualization — 2015',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/harbour-pointe/harbour-pointe-1.jpg',
        imageUrlDesktop: 'assets/images/harbour-pointe/harbour-pointe-1.jpg',
        imageMobileUrl: 'assets/images/harbour-pointe/harbour-pointe-1.jpg',
        projectUrl: 'harbour-pointe.html',
        desc: 'Collaborative interior design and photorealistic 3D visualization for Harbour Pointe, a mixed-use waterfront development completed in 2015.',
        specs: {
          client: 'Infinite Group Ltd',
          scope: '',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },
      {
        id: 'fizzles-pub-plate1',
        title: 'Fizzles Pub',
        category: 'Interior Design — 2013',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/fizzles-pub/fizzles-pub-8.jpg',
        imageUrlDesktop: 'assets/images/fizzles-pub/fizzles-pub-8.jpg',
        imageMobileUrl: 'assets/images/fizzles-pub/fizzles-pub-8.jpg',
        projectUrl: 'fizzles-pub.html',
        desc: 'Fizzles Pub is an interior design and 3D visualization project RDVS completed for the Fizzles brand in March 2012, imagining an after-work lounge in Accra that blends a bar, eatery and three lounges under moody colored lighting.',
        specs: {
          client: 'Fizzles',
          scope: 'RDVS delivered the interior design concept and full 3D visualization package, covering space planning, lighting design, material and color selection, rendered views, and the technical drawing set.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design\']'
        }
      },
      {
        id: 'fizzles-pub-plate2',
        title: 'Fizzles Pub',
        category: 'Interior Design — 2013',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/fizzles-pub/fizzles-pub-1.jpg',
        imageUrlDesktop: 'assets/images/fizzles-pub/fizzles-pub-1.jpg',
        imageMobileUrl: 'assets/images/fizzles-pub/fizzles-pub-1.jpg',
        projectUrl: 'fizzles-pub.html',
        desc: 'Fizzles Pub is an interior design and 3D visualization project RDVS completed for the Fizzles brand in March 2012, imagining an after-work lounge in Accra that blends a bar, eatery and three lounges under moody colored lighting.',
        specs: {
          client: 'Fizzles',
          scope: 'RDVS delivered the interior design concept and full 3D visualization package, covering space planning, lighting design, material and color selection, rendered views, and the technical drawing set.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design\']'
        }
      },
      {
        id: 'fizzles-pub-plate3',
        title: 'Fizzles Pub',
        category: 'Interior Design — 2013',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/fizzles-pub/fizzles-pub-2.jpg',
        imageUrlDesktop: 'assets/images/fizzles-pub/fizzles-pub-2.jpg',
        imageMobileUrl: 'assets/images/fizzles-pub/fizzles-pub-2.jpg',
        projectUrl: 'fizzles-pub.html',
        desc: 'Fizzles Pub is an interior design and 3D visualization project RDVS completed for the Fizzles brand in March 2012, imagining an after-work lounge in Accra that blends a bar, eatery and three lounges under moody colored lighting.',
        specs: {
          client: 'Fizzles',
          scope: 'RDVS delivered the interior design concept and full 3D visualization package, covering space planning, lighting design, material and color selection, rendered views, and the technical drawing set.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Interior Design\']'
        }
      },
      {
        id: 'enda-acm-plate1',
        title: 'Enda ACM',
        category: 'Interior Design, Industrial Design, Graphic Design & 3D Visualization — 2015',
        service: 'Interior Design, Industrial Design, Graphic Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-acm/enda-acm-1.jpg',
        imageUrlDesktop: 'assets/images/enda-acm/enda-acm-1.jpg',
        imageMobileUrl: 'assets/images/enda-acm/enda-acm-1.jpg',
        projectUrl: 'enda-acm.html',
        desc: 'A restaurant interior designed and visualized for ENDA Foods in 2015. Unlike the studio s visualization-only commissions, this one carries both halves of the job: RDVS Studios took the scheme through from the furniture and the wall graphics to the rendered views.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Interior Design, Furniture and seating design, Wall graphics and signage, 3D Visualization',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Interior Design\', \'Industrial Design\', \'Graphic Design   3D Visualization\']'
        }
      },
      {
        id: 'enda-acm-plate2',
        title: 'Enda ACM',
        category: 'Interior Design, Industrial Design, Graphic Design & 3D Visualization — 2015',
        service: 'Interior Design, Industrial Design, Graphic Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-acm/enda-acm-2.jpg',
        imageUrlDesktop: 'assets/images/enda-acm/enda-acm-2.jpg',
        imageMobileUrl: 'assets/images/enda-acm/enda-acm-2.jpg',
        projectUrl: 'enda-acm.html',
        desc: 'A restaurant interior designed and visualized for ENDA Foods in 2015. Unlike the studio s visualization-only commissions, this one carries both halves of the job: RDVS Studios took the scheme through from the furniture and the wall graphics to the rendered views.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Interior Design, Furniture and seating design, Wall graphics and signage, 3D Visualization',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Interior Design\', \'Industrial Design\', \'Graphic Design   3D Visualization\']'
        }
      },
      {
        id: 'enda-accra-mall-plate1',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design, 3D Visualization, VR & Digital Art — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design, 3D Visualization, VR & Digital Art',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-1.jpg',
        imageUrlDesktop: 'assets/images/enda-accra-mall/enda-accra-mall-1.jpg',
        imageMobileUrl: 'assets/images/enda-accra-mall/enda-accra-mall-1.jpg',
        projectUrl: 'enda-accra-mall.html',
        desc: 'A cafe, Chinese and fast-food counter for ENDA Foods at Accra Mall, completed in 2014. The space plan, the furniture, the graphics and the imagery were all done in-house   a backlit bamboo screen and low timber banquettes on one side, a fully glazed corner unit onto the mall concourse on the other.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Interior Design, Industrial & Furniture Design, Graphic Design and Illustration, 3D Visualization, VR & Digital Art',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: '[\'Interior Design\', \'Industrial   Furniture Design\', \'Graphic Design\', \'3D Visualization\', \'VR   Digital Art\']'
        }
      },
      {
        id: 'enda-accra-mall-plate2',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design, 3D Visualization, VR & Digital Art — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design, 3D Visualization, VR & Digital Art',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-2.jpg',
        imageUrlDesktop: 'assets/images/enda-accra-mall/enda-accra-mall-2.jpg',
        imageMobileUrl: 'assets/images/enda-accra-mall/enda-accra-mall-2.jpg',
        projectUrl: 'enda-accra-mall.html',
        desc: 'A cafe, Chinese and fast-food counter for ENDA Foods at Accra Mall, completed in 2014. The space plan, the furniture, the graphics and the imagery were all done in-house   a backlit bamboo screen and low timber banquettes on one side, a fully glazed corner unit onto the mall concourse on the other.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Interior Design, Industrial & Furniture Design, Graphic Design and Illustration, 3D Visualization, VR & Digital Art',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: '[\'Interior Design\', \'Industrial   Furniture Design\', \'Graphic Design\', \'3D Visualization\', \'VR   Digital Art\']'
        }
      },
      {
        id: 'ela-b-plate1',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-1.jpg',
        imageUrlDesktop: 'assets/images/ela-b/ela-b-1.jpg',
        imageMobileUrl: 'assets/images/ela-b/ela-b-1.jpg',
        projectUrl: 'ela-b.html',
        desc: 'A fifteen-plate interior visualization set made in 2018 as marketing collateral for a real estate company in Accra, showing one contemporary apartment s living, kitchen and bedroom schemes in interior design and 3D visualization.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'ela-b-plate2',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-2.jpg',
        imageUrlDesktop: 'assets/images/ela-b/ela-b-2.jpg',
        imageMobileUrl: 'assets/images/ela-b/ela-b-2.jpg',
        projectUrl: 'ela-b.html',
        desc: 'A fifteen-plate interior visualization set made in 2018 as marketing collateral for a real estate company in Accra, showing one contemporary apartment s living, kitchen and bedroom schemes in interior design and 3D visualization.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'ela-b-plate3',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-3.jpg',
        imageUrlDesktop: 'assets/images/ela-b/ela-b-3.jpg',
        imageMobileUrl: 'assets/images/ela-b/ela-b-3.jpg',
        projectUrl: 'ela-b.html',
        desc: 'A fifteen-plate interior visualization set made in 2018 as marketing collateral for a real estate company in Accra, showing one contemporary apartment s living, kitchen and bedroom schemes in interior design and 3D visualization.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'el-dor-plate1',
        title: 'El Dor',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/el-dor/el-dor-1.jpg',
        imageUrlDesktop: 'assets/images/el-dor/el-dor-1.jpg',
        imageMobileUrl: 'assets/images/el-dor/el-dor-1.jpg',
        projectUrl: 'el-dor.html',
        desc: 'A fifteen-plate interior design and 3D visualization set from 2018 for El D Or, a boutique hotel in the Cantonments area of Accra, moving from a sculptural lounge and marble lobby to dark jewel-toned guest suites.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for a hotel presentation.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'el-dor-plate2',
        title: 'El Dor',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/el-dor/el-dor-2.jpg',
        imageUrlDesktop: 'assets/images/el-dor/el-dor-2.jpg',
        imageMobileUrl: 'assets/images/el-dor/el-dor-2.jpg',
        projectUrl: 'el-dor.html',
        desc: 'A fifteen-plate interior design and 3D visualization set from 2018 for El D Or, a boutique hotel in the Cantonments area of Accra, moving from a sculptural lounge and marble lobby to dark jewel-toned guest suites.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for a hotel presentation.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'el-dor-plate3',
        title: 'El Dor',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/el-dor/el-dor-3.jpg',
        imageUrlDesktop: 'assets/images/el-dor/el-dor-3.jpg',
        imageMobileUrl: 'assets/images/el-dor/el-dor-3.jpg',
        projectUrl: 'el-dor.html',
        desc: 'A fifteen-plate interior design and 3D visualization set from 2018 for El D Or, a boutique hotel in the Cantonments area of Accra, moving from a sculptural lounge and marble lobby to dark jewel-toned guest suites.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for a hotel presentation.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'eic-competition-plate1',
        title: 'EIC Competition',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/eic-competition/eic-competition-1.jpg',
        imageUrlDesktop: 'assets/images/eic-competition/eic-competition-1.jpg',
        imageMobileUrl: 'assets/images/eic-competition/eic-competition-1.jpg',
        projectUrl: 'eic-competition.html',
        desc: 'A 2012 competition entry of interior design and 3D visualization for Enterprise Insurance Company, reimagining its office as a warm contemporary workplace through a boardroom, an executive suite, open-plan workstations and a double-height reception.',
        specs: {
          client: 'Enterprise Insurance Company',
          scope: 'Interior design concept and photorealistic 3D visualization for a competition office proposal.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'eic-competition-plate2',
        title: 'EIC Competition',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/eic-competition/eic-competition-2.jpg',
        imageUrlDesktop: 'assets/images/eic-competition/eic-competition-2.jpg',
        imageMobileUrl: 'assets/images/eic-competition/eic-competition-2.jpg',
        projectUrl: 'eic-competition.html',
        desc: 'A 2012 competition entry of interior design and 3D visualization for Enterprise Insurance Company, reimagining its office as a warm contemporary workplace through a boardroom, an executive suite, open-plan workstations and a double-height reception.',
        specs: {
          client: 'Enterprise Insurance Company',
          scope: 'Interior design concept and photorealistic 3D visualization for a competition office proposal.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'eic-competition-plate3',
        title: 'EIC Competition',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/eic-competition/eic-competition-3.jpg',
        imageUrlDesktop: 'assets/images/eic-competition/eic-competition-3.jpg',
        imageMobileUrl: 'assets/images/eic-competition/eic-competition-3.jpg',
        projectUrl: 'eic-competition.html',
        desc: 'A 2012 competition entry of interior design and 3D visualization for Enterprise Insurance Company, reimagining its office as a warm contemporary workplace through a boardroom, an executive suite, open-plan workstations and a double-height reception.',
        specs: {
          client: 'Enterprise Insurance Company',
          scope: 'Interior design concept and photorealistic 3D visualization for a competition office proposal.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'ehr-plate1',
        title: 'EHR',
        category: 'Architectural Design, Interior Design & Architectural Visualization — 2017',
        service: 'Architectural Design, Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ehr/ehr-18.jpg',
        imageUrlDesktop: 'assets/images/ehr/ehr-18.jpg',
        imageMobileUrl: 'assets/images/ehr/ehr-18.jpg',
        projectUrl: 'ehr.html',
        desc: 'EHR is a 2017 interior design and visualization set for a proposed private residence in Accra, Ghana. This page carries the four frames that were left out of the published gallery: one dusk view of the villa\u2019s garden and three daylight angles of its open-plan dining and bar.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural concept and development for the villa, full interior design including furniture and lighting selection, and the complete set of dusk exterior and interior visualizations used as sales material.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Architectural Design\', \'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'ehr-plate2',
        title: 'EHR',
        category: 'Architectural Design, Interior Design & Architectural Visualization — 2017',
        service: 'Architectural Design, Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ehr/ehr-19.jpg',
        imageUrlDesktop: 'assets/images/ehr/ehr-19.jpg',
        imageMobileUrl: 'assets/images/ehr/ehr-19.jpg',
        projectUrl: 'ehr.html',
        desc: 'EHR is a 2017 interior design and visualization set for a proposed private residence in Accra, Ghana. This page carries the four frames that were left out of the published gallery: one dusk view of the villa\u2019s garden and three daylight angles of its open-plan dining and bar.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural concept and development for the villa, full interior design including furniture and lighting selection, and the complete set of dusk exterior and interior visualizations used as sales material.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Architectural Design\', \'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'ehr-plate3',
        title: 'EHR',
        category: 'Architectural Design, Interior Design & Architectural Visualization — 2017',
        service: 'Architectural Design, Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ehr/ehr-20.jpg',
        imageUrlDesktop: 'assets/images/ehr/ehr-20.jpg',
        imageMobileUrl: 'assets/images/ehr/ehr-20.jpg',
        projectUrl: 'ehr.html',
        desc: 'EHR is a 2017 interior design and visualization set for a proposed private residence in Accra, Ghana. This page carries the four frames that were left out of the published gallery: one dusk view of the villa\u2019s garden and three daylight angles of its open-plan dining and bar.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural concept and development for the villa, full interior design including furniture and lighting selection, and the complete set of dusk exterior and interior visualizations used as sales material.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Architectural Design\', \'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'csm-plate1',
        title: 'CSM',
        category: 'Interior Design & 3D Visualization — 2014',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/csm/csm-1.jpg',
        imageUrlDesktop: 'assets/images/csm/csm-1.jpg',
        imageMobileUrl: 'assets/images/csm/csm-1-mobile.jpg',
        projectUrl: 'csm.html',
        desc: 'Interior design and 3D visualization for Centre Stage Management — a compact office in Tema planned around a reception, two workstations and a meeting space.',
        specs: {
          client: 'Centre Stage Management',
          scope: 'Interior design and 3D visualization of a compact office: reception, two workstations and a meeting space, with space planning, built-in joinery, finishes, lighting design and photoreal renders',
          team: 'Jude Abbey + Jude Nyoagbe (design, modelling); Jude Nyoagbe (texturing, lighting, rendering, post-production)',
          year: '2014',
          disciplines: '[\'Interior Design   3D Visualization\']'
        }
      },
      {
        id: 'csm-plate2',
        title: 'CSM',
        category: 'Interior Design & 3D Visualization — 2014',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/csm/csm-2.jpg',
        imageUrlDesktop: 'assets/images/csm/csm-2.jpg',
        imageMobileUrl: 'assets/images/csm/csm-2.jpg',
        projectUrl: 'csm.html',
        desc: 'Interior design and 3D visualization for Centre Stage Management — a compact office in Tema planned around a reception, two workstations and a meeting space.',
        specs: {
          client: 'Centre Stage Management',
          scope: 'Interior design and 3D visualization of a compact office: reception, two workstations and a meeting space, with space planning, built-in joinery, finishes, lighting design and photoreal renders',
          team: 'Jude Abbey + Jude Nyoagbe (design, modelling); Jude Nyoagbe (texturing, lighting, rendering, post-production)',
          year: '2014',
          disciplines: '[\'Interior Design   3D Visualization\']'
        }
      },
      {
        id: 'campions-estate-plate1',
        title: 'Campions Renderings',
        category: 'Architectural Design, Interior Design & Architectural Visualization — 2015',
        service: 'Architectural Design, Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/campions-renderings/campions-renderings-01-desktop.jpg',
        imageUrlDesktop: 'assets/images/campions-renderings/campions-renderings-01-desktop.jpg',
        imageMobileUrl: 'assets/images/campions-renderings/campions-renderings-01-desktop.jpg',
        projectUrl: 'campions-renderings.html',
        desc: 'Terraced houses grouped around a shared pool courtyard, drawn in several exterior colourways and carried through to the interiors.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Architectural design, Interior design, 3D visualization',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Architectural Design\', \'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'campions-estate-plate2',
        title: 'Campions Renderings',
        category: 'Architectural Design, Interior Design & Architectural Visualization — 2015',
        service: 'Architectural Design, Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/campions-renderings/campions-renderings-01.jpg',
        imageUrlDesktop: 'assets/images/campions-renderings/campions-renderings-01.jpg',
        imageMobileUrl: 'assets/images/campions-renderings/campions-renderings-01-mobile.jpg',
        projectUrl: 'campions-renderings.html',
        desc: 'Terraced houses grouped around a shared pool courtyard, drawn in several exterior colourways and carried through to the interiors.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Architectural design, Interior design, 3D visualization',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Architectural Design\', \'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'c25-interior-plate1',
        title: 'C25',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/c25/c25-2.jpg',
        imageUrlDesktop: 'assets/images/c25/c25-2.jpg',
        imageMobileUrl: 'assets/images/c25/c25-2.jpg',
        projectUrl: 'c25.html',
        desc: 'Warm neutral palette interior utilizing micro-cement, acoustic fluting, and tailored concealed storage joinery.',
        specs: {
          client: 'Devtraco',
          scope: 'RDVS delivered interior design direction and full 3D architectural visualization, modeling the interiors, the exterior elevations, lighting and the final rendered presentation set.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'c25-interior-plate2',
        title: 'C25',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/c25/c25-3.jpg',
        imageUrlDesktop: 'assets/images/c25/c25-3.jpg',
        imageMobileUrl: 'assets/images/c25/c25-3.jpg',
        projectUrl: 'c25.html',
        desc: 'Warm neutral palette interior utilizing micro-cement, acoustic fluting, and tailored concealed storage joinery.',
        specs: {
          client: 'Devtraco',
          scope: 'RDVS delivered interior design direction and full 3D architectural visualization, modeling the interiors, the exterior elevations, lighting and the final rendered presentation set.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'brownies-place-plate1',
        title: 'Brownie’s Place',
        category: 'Interior Design, Architectural Visualization & Graphic Design — 2017',
        service: 'Interior Design, Architectural Visualization & Graphic Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/brownies-place/brownies-place-1.jpg',
        imageUrlDesktop: 'assets/images/brownies-place/brownies-place-1.jpg',
        imageMobileUrl: 'assets/images/brownies-place/brownies-place-1.jpg',
        projectUrl: 'brownies-place.html',
        desc: 'A 2017 commission from the Accra developer Six Acres: RDVS Studios redesigned the facade of Brownie s Place, furnished and lit its interiors, rendered the whole set in 3D and packaged the imagery into a marketing brochure.',
        specs: {
          client: 'Six Acres',
          scope: 'Facade redesign, interior design and styling of the living, dining, bedroom, kitchen and bathroom spaces, 3D visualization in day and evening lighting, and graphic design of the Brownie’s Place marketing brochure.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Interior Design\', \'Architectural Visualization   Graphic Design\']'
        }
      },
      {
        id: 'brownies-place-plate2',
        title: 'Brownie’s Place',
        category: 'Interior Design, Architectural Visualization & Graphic Design — 2017',
        service: 'Interior Design, Architectural Visualization & Graphic Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/brownies-place/brownies-place-2.jpg',
        imageUrlDesktop: 'assets/images/brownies-place/brownies-place-2.jpg',
        imageMobileUrl: 'assets/images/brownies-place/brownies-place-2.jpg',
        projectUrl: 'brownies-place.html',
        desc: 'A 2017 commission from the Accra developer Six Acres: RDVS Studios redesigned the facade of Brownie s Place, furnished and lit its interiors, rendered the whole set in 3D and packaged the imagery into a marketing brochure.',
        specs: {
          client: 'Six Acres',
          scope: 'Facade redesign, interior design and styling of the living, dining, bedroom, kitchen and bathroom spaces, 3D visualization in day and evening lighting, and graphic design of the Brownie’s Place marketing brochure.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Interior Design\', \'Architectural Visualization   Graphic Design\']'
        }
      },
      {
        id: 'brownies-place-plate3',
        title: 'Brownie’s Place',
        category: 'Interior Design, Architectural Visualization & Graphic Design — 2017',
        service: 'Interior Design, Architectural Visualization & Graphic Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/brownies-place/brownies-place-3.jpg',
        imageUrlDesktop: 'assets/images/brownies-place/brownies-place-3.jpg',
        imageMobileUrl: 'assets/images/brownies-place/brownies-place-3.jpg',
        projectUrl: 'brownies-place.html',
        desc: 'A 2017 commission from the Accra developer Six Acres: RDVS Studios redesigned the facade of Brownie s Place, furnished and lit its interiors, rendered the whole set in 3D and packaged the imagery into a marketing brochure.',
        specs: {
          client: 'Six Acres',
          scope: 'Facade redesign, interior design and styling of the living, dining, bedroom, kitchen and bathroom spaces, 3D visualization in day and evening lighting, and graphic design of the Brownie’s Place marketing brochure.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Interior Design\', \'Architectural Visualization   Graphic Design\']'
        }
      },
      {
        id: 'bfa-plate1',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-1.jpg',
        imageUrlDesktop: 'assets/images/bfa/bfa-1.jpg',
        imageMobileUrl: 'assets/images/bfa/bfa-1.jpg',
        projectUrl: 'bfa.html',
        desc: 'Interior design and photorealistic 3D visualization for BFA, with architecture by 1916 Design Construct and commissioned by Homes Direct.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: '[\'Interior Design\', \'3D Visualization — 2018 · Commissioned Work\']'
        }
      },
      {
        id: 'bfa-plate2',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-2.jpg',
        imageUrlDesktop: 'assets/images/bfa/bfa-2.jpg',
        imageMobileUrl: 'assets/images/bfa/bfa-2.jpg',
        projectUrl: 'bfa.html',
        desc: 'Interior design and photorealistic 3D visualization for BFA, with architecture by 1916 Design Construct and commissioned by Homes Direct.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: '[\'Interior Design\', \'3D Visualization — 2018 · Commissioned Work\']'
        }
      },
      {
        id: 'bfa-plate3',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-3.jpg',
        imageUrlDesktop: 'assets/images/bfa/bfa-3.jpg',
        imageMobileUrl: 'assets/images/bfa/bfa-3.jpg',
        projectUrl: 'bfa.html',
        desc: 'Interior design and photorealistic 3D visualization for BFA, with architecture by 1916 Design Construct and commissioned by Homes Direct.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: '[\'Interior Design\', \'3D Visualization — 2018 · Commissioned Work\']'
        }
      },
      {
        id: 'apartment-in-takoradi-plate1',
        title: 'Apartment In Takoradi',
        category: 'Interior Design & Architectural Visualization — 2010',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/apartment-in-takoradi/apartment-in-takoradi-1.jpg',
        imageUrlDesktop: 'assets/images/apartment-in-takoradi/apartment-in-takoradi-1.jpg',
        imageMobileUrl: 'assets/images/apartment-in-takoradi/apartment-in-takoradi-1.jpg',
        projectUrl: 'apartment-in-takoradi.html',
        desc: 'A 2010 interior design and visualization study for Stephen Morgan: two rooms of a proposed apartment in Takoradi, Ghana, shown as a living room opening onto a balcony and an open-plan kitchen with a dark breakfast island.',
        specs: {
          client: 'Stephen Morgan',
          scope: 'Interior design and 3D visualization of the living room and the open-plan kitchen for the proposed apartment.',
          team: 'RDVS. DESIGN',
          year: '2010',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'apartment-in-takoradi-plate2',
        title: 'Apartment In Takoradi',
        category: 'Interior Design & Architectural Visualization — 2010',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/apartment-in-takoradi/apartment-in-takoradi-2.jpg',
        imageUrlDesktop: 'assets/images/apartment-in-takoradi/apartment-in-takoradi-2.jpg',
        imageMobileUrl: 'assets/images/apartment-in-takoradi/apartment-in-takoradi-2.jpg',
        projectUrl: 'apartment-in-takoradi.html',
        desc: 'A 2010 interior design and visualization study for Stephen Morgan: two rooms of a proposed apartment in Takoradi, Ghana, shown as a living room opening onto a balcony and an open-plan kitchen with a dark breakfast island.',
        specs: {
          client: 'Stephen Morgan',
          scope: 'Interior design and 3D visualization of the living room and the open-plan kitchen for the proposed apartment.',
          team: 'RDVS. DESIGN',
          year: '2010',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'anyigbanua-plate1',
        title: 'Anyigbanua',
        category: 'Interior Design & Architectural Visualization — 2012',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/anyigbanua/anyigbanua-1.jpg',
        imageUrlDesktop: 'assets/images/anyigbanua/anyigbanua-1.jpg',
        imageMobileUrl: 'assets/images/anyigbanua/anyigbanua-1.jpg',
        projectUrl: 'anyigbanua.html',
        desc: 'A 2012 interior design and visualization study for the Anyigbanua Residence in Accra, Ghana: a single double-height living room in which RDVS tested a cream modular sectional, an orange feature wall and a mezzanine gallery above it.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design of the double-height living room and a 3D visualization of the proposed seating scheme.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'alexander-plate1',
        title: 'Alexander',
        category: 'Interior Design & Architectural Visualization — 2016',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/alexander/alexander-1.jpg',
        imageUrlDesktop: 'assets/images/alexander/alexander-1.jpg',
        imageMobileUrl: 'assets/images/alexander/alexander-1.jpg',
        projectUrl: 'alexander.html',
        desc: 'Alexander is a set of ten visualizations and interior design studies made in 2016 for a proposed private housing development in Accra, Ghana, covering white cubic villas, their pools and terraces, and the furnished interiors that sell them.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design for the show units and shared amenities, and the complete set of photorealistic exterior and interior visualizations used to market the proposed development.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'alexander-plate2',
        title: 'Alexander',
        category: 'Interior Design & Architectural Visualization — 2016',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/alexander/alexander-2.jpg',
        imageUrlDesktop: 'assets/images/alexander/alexander-2.jpg',
        imageMobileUrl: 'assets/images/alexander/alexander-2.jpg',
        projectUrl: 'alexander.html',
        desc: 'Alexander is a set of ten visualizations and interior design studies made in 2016 for a proposed private housing development in Accra, Ghana, covering white cubic villas, their pools and terraces, and the furnished interiors that sell them.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design for the show units and shared amenities, and the complete set of photorealistic exterior and interior visualizations used to market the proposed development.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'alexander-plate3',
        title: 'Alexander',
        category: 'Interior Design & Architectural Visualization — 2016',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/alexander/alexander-3.jpg',
        imageUrlDesktop: 'assets/images/alexander/alexander-3.jpg',
        imageMobileUrl: 'assets/images/alexander/alexander-3.jpg',
        projectUrl: 'alexander.html',
        desc: 'Alexander is a set of ten visualizations and interior design studies made in 2016 for a proposed private housing development in Accra, Ghana, covering white cubic villas, their pools and terraces, and the furnished interiors that sell them.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design for the show units and shared amenities, and the complete set of photorealistic exterior and interior visualizations used to market the proposed development.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'aika-osu-plate1',
        title: 'Aika',
        category: 'Interior Design & Furniture Design — 2014',
        service: 'Interior Design & Furniture Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/aika/aika-1.jpg',
        imageUrlDesktop: 'assets/images/aika/aika-1.jpg',
        imageMobileUrl: 'assets/images/aika/aika-1.jpg',
        projectUrl: 'aika-osu.html',
        desc: 'A re-modelling of the AIKA fashion shop in Accra, completed with the label in 2014: interior design and furniture design for a small retail room where wall-hung rails, white joinery and a single yellow panel let the clothes do the talking.',
        specs: {
          client: 'AIKA',
          scope: 'Interior design for the shop floor, design and detailing of the display joinery and wall rails, and photographic documentation of the completed store.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Interior Design   Furniture Design\']'
        }
      },
      {
        id: 'aika-osu-plate2',
        title: 'Aika',
        category: 'Interior Design & Furniture Design — 2014',
        service: 'Interior Design & Furniture Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/aika/aika-2.jpg',
        imageUrlDesktop: 'assets/images/aika/aika-2.jpg',
        imageMobileUrl: 'assets/images/aika/aika-2.jpg',
        projectUrl: 'aika-osu.html',
        desc: 'A re-modelling of the AIKA fashion shop in Accra, completed with the label in 2014: interior design and furniture design for a small retail room where wall-hung rails, white joinery and a single yellow panel let the clothes do the talking.',
        specs: {
          client: 'AIKA',
          scope: 'Interior design for the shop floor, design and detailing of the display joinery and wall rails, and photographic documentation of the completed store.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Interior Design   Furniture Design\']'
        }
      },
      {
        id: 'aika-osu-plate3',
        title: 'Aika',
        category: 'Interior Design & Furniture Design — 2014',
        service: 'Interior Design & Furniture Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/aika/aika-3.jpg',
        imageUrlDesktop: 'assets/images/aika/aika-3.jpg',
        imageMobileUrl: 'assets/images/aika/aika-3.jpg',
        projectUrl: 'aika-osu.html',
        desc: 'A re-modelling of the AIKA fashion shop in Accra, completed with the label in 2014: interior design and furniture design for a small retail room where wall-hung rails, white joinery and a single yellow panel let the clothes do the talking.',
        specs: {
          client: 'AIKA',
          scope: 'Interior design for the shop floor, design and detailing of the display joinery and wall rails, and photographic documentation of the completed store.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Interior Design   Furniture Design\']'
        }
      },
      {
        id: 'afg-offices-plate1',
        title: 'AFG Offices',
        category: 'Interior Design, 3D Visualization, Graphic Design, Industrial & Furniture Design & Construction — 2019',
        service: 'Interior Design, 3D Visualization, Graphic Design, Industrial & Furniture Design & Construction',
        discipline: 'interiors',
        imageUrl: 'assets/images/afg/afg-1.jpg',
        imageUrlDesktop: 'assets/images/afg/afg-1.jpg',
        imageMobileUrl: 'assets/images/afg/afg-1.jpg',
        projectUrl: 'afg.html',
        desc: 'A design-and-build office for AFG in Accra — brand set into the architecture across a faceted red graphic wall and etched glass, bespoke plywood and steel furniture, photographed room by room and shown beside the pre-build visualisations, across one hundred plates.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\', \'Graphic Design\', \'Industrial   Furniture Design   Construction\']'
        }
      },
      {
        id: 'afg-offices-plate2',
        title: 'AFG Offices',
        category: 'Interior Design, 3D Visualization, Graphic Design, Industrial & Furniture Design & Construction — 2019',
        service: 'Interior Design, 3D Visualization, Graphic Design, Industrial & Furniture Design & Construction',
        discipline: 'interiors',
        imageUrl: 'assets/images/afg/afg-2.jpg',
        imageUrlDesktop: 'assets/images/afg/afg-2.jpg',
        imageMobileUrl: 'assets/images/afg/afg-2.jpg',
        projectUrl: 'afg.html',
        desc: 'A design-and-build office for AFG in Accra — brand set into the architecture across a faceted red graphic wall and etched glass, bespoke plywood and steel furniture, photographed room by room and shown beside the pre-build visualisations, across one hundred plates.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\', \'Graphic Design\', \'Industrial   Furniture Design   Construction\']'
        }
      },
      {
        id: 'advantage-place-plate1',
        title: 'Advantage Place',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/advantage-place/advantage-place-01.jpg',
        imageUrlDesktop: 'assets/images/advantage-place/advantage-place-01.jpg',
        imageMobileUrl: 'assets/images/advantage-place/advantage-place-01.jpg',
        projectUrl: 'advantage-place.html',
        desc: 'A 2015 interior design and 3D visualization presentation of the Advantage Place commercial development in Accra — lobby, workplace floors, and amenities rendered in photoreal detail alongside a full 3D animation.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization (Modeling & Rendering)',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'adentan-townhouses-plate1',
        title: 'Adentan Townhouses',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/adentan-townhouses/adentan-townhouses-1.jpg',
        imageUrlDesktop: 'assets/images/adentan-townhouses/adentan-townhouses-1.jpg',
        imageMobileUrl: 'assets/images/adentan-townhouses/adentan-townhouses-1-mobile.jpg',
        projectUrl: 'adentan-townhouses.html',
        desc: 'Modular residential community balancing privacy with shared landscape courtyards and climate-responsive natural ventilation.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concepting, mood and colour boards, and architectural 3D visualization of the townhouse exteriors, interiors and cutaway floor plans.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'adentan-townhouses-plate2',
        title: 'Adentan Townhouses',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/adentan-townhouses/adentan-townhouses-2.jpg',
        imageUrlDesktop: 'assets/images/adentan-townhouses/adentan-townhouses-2.jpg',
        imageMobileUrl: 'assets/images/adentan-townhouses/adentan-townhouses-2.jpg',
        projectUrl: 'adentan-townhouses.html',
        desc: 'Modular residential community balancing privacy with shared landscape courtyards and climate-responsive natural ventilation.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concepting, mood and colour boards, and architectural 3D visualization of the townhouse exteriors, interiors and cutaway floor plans.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'access-bank-iris-plate1',
        title: 'Access Bank Iris',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/access-bank-iris/access-bank-iris-1.jpg',
        imageUrlDesktop: 'assets/images/access-bank-iris/access-bank-iris-1.jpg',
        imageMobileUrl: 'assets/images/access-bank-iris/access-bank-iris-1.jpg',
        projectUrl: 'access-bank-iris.html',
        desc: 'A 2018 interior design and 3D visualization package for Access Bank at Iris in Accra, Ghana, delivered by RDVS with Orange Tree: boardrooms, an executive suite and a client lounge dressed in the bank s red, orange and blue identity.',
        specs: {
          client: 'Access Bank',
          scope: 'Interior design and 3D visualization of the meeting rooms, executive office, boardroom and client lounge, produced alongside Orange Tree.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'access-bank-iris-plate2',
        title: 'Access Bank Iris',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/access-bank-iris/access-bank-iris-2.jpg',
        imageUrlDesktop: 'assets/images/access-bank-iris/access-bank-iris-2.jpg',
        imageMobileUrl: 'assets/images/access-bank-iris/access-bank-iris-2.jpg',
        projectUrl: 'access-bank-iris.html',
        desc: 'A 2018 interior design and 3D visualization package for Access Bank at Iris in Accra, Ghana, delivered by RDVS with Orange Tree: boardrooms, an executive suite and a client lounge dressed in the bank s red, orange and blue identity.',
        specs: {
          client: 'Access Bank',
          scope: 'Interior design and 3D visualization of the meeting rooms, executive office, boardroom and client lounge, produced alongside Orange Tree.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'access-bank-iris-plate3',
        title: 'Access Bank Iris',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/access-bank-iris/access-bank-iris-3.jpg',
        imageUrlDesktop: 'assets/images/access-bank-iris/access-bank-iris-3.jpg',
        imageMobileUrl: 'assets/images/access-bank-iris/access-bank-iris-3.jpg',
        projectUrl: 'access-bank-iris.html',
        desc: 'A 2018 interior design and 3D visualization package for Access Bank at Iris in Accra, Ghana, delivered by RDVS with Orange Tree: boardrooms, an executive suite and a client lounge dressed in the bank s red, orange and blue identity.',
        specs: {
          client: 'Access Bank',
          scope: 'Interior design and 3D visualization of the meeting rooms, executive office, boardroom and client lounge, produced alongside Orange Tree.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'abl-reception-plate1',
        title: 'ABL Reception',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/abl-reception/abl-reception-2.jpg',
        imageUrlDesktop: 'assets/images/abl-reception/abl-reception-2.jpg',
        imageMobileUrl: 'assets/images/abl-reception/abl-reception-2.jpg',
        projectUrl: 'abl-reception.html',
        desc: 'Minimalist commercial lobby blending linear slatted wall elements with monolithic reception counter architecture and concealed ambient illumination.',
        specs: {
          client: 'ABL (Accra Brewery Limited)',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe, Nana Afua Boateng',
          year: '2017',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },
      {
        id: 'abl-reception-plate2',
        title: 'ABL Reception',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/abl-reception/abl-reception-3.jpg',
        imageUrlDesktop: 'assets/images/abl-reception/abl-reception-3.jpg',
        imageMobileUrl: 'assets/images/abl-reception/abl-reception-3.jpg',
        projectUrl: 'abl-reception.html',
        desc: 'Minimalist commercial lobby blending linear slatted wall elements with monolithic reception counter architecture and concealed ambient illumination.',
        specs: {
          client: 'ABL (Accra Brewery Limited)',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe, Nana Afua Boateng',
          year: '2017',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },
      {
        id: 'barham-residence-plate1',
        title: '41 Barham',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/barham/barham-courtyard.jpg',
        imageUrlDesktop: 'assets/images/barham/barham-courtyard.jpg',
        imageMobileUrl: 'assets/images/barham/barham-courtyard.jpg',
        projectUrl: '41-barham.html',
        desc: 'A minimalist architectural volume embracing high-contrast warm materiality, double-height ceiling voids, and seamless indoor-outdoor courtyards.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Architectural Design',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'barham-residence-plate2',
        title: '41 Barham',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/barham/barham-pavilion.jpg',
        imageUrlDesktop: 'assets/images/barham/barham-pavilion.jpg',
        imageMobileUrl: 'assets/images/barham/barham-pavilion.jpg',
        projectUrl: '41-barham.html',
        desc: 'A minimalist architectural volume embracing high-contrast warm materiality, double-height ceiling voids, and seamless indoor-outdoor courtyards.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Architectural Design',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: '1hive-plate1',
        title: '1Hive',
        category: 'Interior Design & 3D Visualization — 2016',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1hive/1hive-1.jpg',
        imageUrlDesktop: 'assets/images/1hive/1hive-1.jpg',
        imageMobileUrl: 'assets/images/1hive/1hive-1.jpg',
        projectUrl: '1hive.html',
        desc: 'A 2016 multidisciplinary commission spanning architecture, interior design, and 3D visualization for 1Hive.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2016',
          disciplines: '[\'Interior Design   3D Visualization\']'
        }
      },
      {
        id: '1hive-plate2',
        title: '1Hive',
        category: 'Interior Design & 3D Visualization — 2016',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1hive/1hive-2.jpg',
        imageUrlDesktop: 'assets/images/1hive/1hive-2.jpg',
        imageMobileUrl: 'assets/images/1hive/1hive-2.jpg',
        projectUrl: '1hive.html',
        desc: 'A 2016 multidisciplinary commission spanning architecture, interior design, and 3D visualization for 1Hive.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2016',
          disciplines: '[\'Interior Design   3D Visualization\']'
        }
      },
      {
        id: '1957-apartments-retail-plate1',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-1.jpg',
        imageUrlDesktop: 'assets/images/1957/1957-1.jpg',
        imageMobileUrl: 'assets/images/1957/1957-1.jpg',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },
      {
        id: '1957-apartments-retail-plate2',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-2.jpg',
        imageUrlDesktop: 'assets/images/1957/1957-2.jpg',
        imageMobileUrl: 'assets/images/1957/1957-2.jpg',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },
      {
        id: 'tower-cascades',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-hero.jpg',
        imageUrlDesktop: 'assets/images/cascades/tower-cascades-hero.jpg',
        imageMobileUrl: 'assets/images/cascades/tower-cascades-hero.jpg',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: twenty-four visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },

    ]
  },

  vfx: {
    name: 'VFX + CGI',
    videos: [
      {
        id: '1981-film-project',
        title: '1981',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        videoUrl: 'assets/videos/1981/1981-film.mp4',
        videoUrlDesktop: 'assets/videos/1981/1981-film.mp4',
        videoMobileUrl: 'assets/videos/1981/1981-film-mobile.mp4',
        imageUrl: 'assets/images/1981/1981-6.jpg',
        imageUrlDesktop: 'assets/images/1981/1981-6.jpg',
        imageMobileUrl: 'assets/images/1981/1981-6-mobile.jpg',
        projectUrl: '1981.html',
        desc: 'Walkthrough of the retail shop for Accra fashion brand 1981 — white walls, chrome garment frames each hung in front of its own portrait panel, and a black lightbox brand wall at the head of the axis.',
        specs: {
          client: 'Joelle Eyeson / 1981',
          scope: '3D Modelling, Shading & Texturing, Lighting, Rendering & Post-Processing, Film Animation (interior design by Joelle Eyeson)',
          team: 'Modelling: Winfred Atieku, Jude Abbey + Jude Nyoagbe | Texturing + Lighting + Shading: Jude Nyoagbe | Rendering: Jude Nyoagbe | Post Processing: Randy Biney',
          location: 'Accra, Ghana',
          year: '2015',
          disciplines: ['3D Visualization', 'Retail Interior']
        }
      },
      {
        id: 'beautiful-choices-anim',
        title: 'Beautiful Choices',
        category: '3D Visualization — 2014',
        service: '3D Visualization',
        discipline: 'vfx',
        videoUrl: 'assets/videos/beautiful-choices/beautiful-choices-anim.mp4',
        videoUrlDesktop: 'assets/videos/beautiful-choices/beautiful-choices-anim.mp4',
        imageUrl: 'assets/images/beautiful-choices/beautiful-choices-1.jpg',
        imageUrlDesktop: 'assets/images/beautiful-choices/beautiful-choices-1.jpg',
        imageMobileUrl: 'assets/images/beautiful-choices/beautiful-choices-1.jpg',
        projectUrl: 'beautiful-choices.html',
        desc: 'Rendering and animation for a poster series designed by Dela Anyaa — five colourways of the same sheet modelled as printed panels and fanned through a seamless white set.',
        specs: {
          client: 'Dela Anyaa',
          scope: '3D Modelling, Animation, Rendering, Post Processing & Compositing',
          team: 'Concept: Dela Anyaa | Modelling + Animation + Rendering: Jude Nyoagbe | Post Processing + Compositing: Randy Biney',
          location: 'Accra, Ghana',
          year: '2014',
          disciplines: ['3D Visualization', 'Product Visualization', 'Animation']
        }
      },
      {
        id: 'six-acres-company-profile-film',
        title: 'Six Acres Company Profile',
        category: 'Graphic Design & 3D Visualization — 2017',
        service: 'Graphic Design & 3D Visualization',
        discipline: 'vfx',
        videoUrl: 'assets/videos/six-acres/six-acres-film.mp4',
        videoUrlDesktop: 'assets/videos/six-acres/six-acres-film.mp4',
        imageUrl: 'assets/images/six-acres/six-acres-1.jpg',
        imageUrlDesktop: 'assets/images/six-acres/six-acres-1.jpg',
        imageMobileUrl: 'assets/images/six-acres/six-acres-1.jpg',
        projectUrl: 'six-acres-company-profile.html',
        desc: 'A twenty-two-page company profile for Six Acres Limited, a Ghanaian real-estate developer: editorial design and art direction, the architectural renders that carry its housing product, and photoreal mockups of every spread.',
        specs: {
          client: 'Six Acres Limited',
          scope: 'Company profile design and art direction: cover and page architecture, wordmark and pattern system, architectural renders of the housing product, partner and contact spreads, photoreal mockups of every spread and a short animated flip-through',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Graphic Design   3D Visualization\']'
        }
      },
      {
        id: 'beautiful-choices-anim-film',
        title: 'Beautiful Choices',
        category: '3D Visualization — 2014',
        service: '3D Visualization',
        discipline: 'vfx',
        videoUrl: 'assets/videos/beautiful-choices/beautiful-choices-anim.mp4',
        videoUrlDesktop: 'assets/videos/beautiful-choices/beautiful-choices-anim.mp4',
        imageUrl: 'assets/images/beautiful-choices/beautiful-choices-1.jpg',
        imageUrlDesktop: 'assets/images/beautiful-choices/beautiful-choices-1.jpg',
        imageMobileUrl: 'assets/images/beautiful-choices/beautiful-choices-1.jpg',
        projectUrl: 'beautiful-choices.html',
        desc: 'Rendering and animation for a poster series designed by Dela Anyaa — five colourways of the same sheet modelled as printed panels and fanned through a seamless white set.',
        specs: {
          client: 'Dela Anyaa',
          scope: '3D Modelling, Animation, Rendering, Post Processing & Compositing',
          team: 'Concept: Dela Anyaa | Modelling + Animation + Rendering: Jude Nyoagbe | Post Processing + Compositing: Randy Biney',
          year: '2014',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: '1981-film-project-film',
        title: '1981',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        videoUrl: 'assets/videos/1981/1981-film.mp4',
        videoUrlDesktop: 'assets/videos/1981/1981-film.mp4',
        videoMobileUrl: 'assets/videos/1981/1981-film-mobile.mp4',
        imageUrl: 'assets/images/1981/1981-6.jpg',
        imageUrlDesktop: 'assets/images/1981/1981-6.jpg',
        imageMobileUrl: 'assets/images/1981/1981-6-mobile.jpg',
        projectUrl: '1981.html',
        desc: 'Walkthrough of the retail shop for Accra fashion brand 1981 — white walls, chrome garment frames each hung in front of its own portrait panel, and a black lightbox brand wall at the head of the axis.',
        specs: {
          client: 'Joelle Eyeson / 1981',
          scope: '3D Modelling, Shading & Texturing, Lighting, Rendering & Post-Processing, Film Animation (interior design by Joelle Eyeson)',
          team: 'Modelling: Winfred Atieku, Jude Abbey + Jude Nyoagbe | Texturing + Lighting + Shading: Jude Nyoagbe | Rendering: Jude Nyoagbe | Post Processing: Randy Biney',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      },

    ],
    images: [
      {
        id: '94-laurel-cgi',
        title: '94 Laurel',
        category: 'VFX + CGI — 2013',
        service: 'VFX + CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/94-laurel/94-laurel-1.jpg',
        imageUrlDesktop: 'assets/images/94-laurel/94-laurel-1.jpg',
        imageMobileUrl: 'assets/images/94-laurel/94-laurel-1-mobile.jpg',
        projectUrl: '94-laurel.html',
        desc: 'High-fidelity photorealistic CGI rendering for a residential estate in Laurel, Canada, executing high-precision 3D modeling, texturing, material shading, ray-traced lighting, and post-processing.',
        specs: {
          client: 'Brent Hughes',
          scope: '3D Modeling, Texturing, Shading, Rendering & Post-Processing',
          team: 'Modelling: Jude Abbey, James Dapaah, Jude Nyoagbe | Texturing + Rendering + Post Processing: Jude Nyoagbe',
          location: 'Laurel, Canada',
          year: '2013',
          disciplines: ['VFX + CGI', '3D Photoreal Rendering']
        }
      },
      {
        id: 'campions-estate',
        title: 'Campions Renderings',
        category: 'Architectural Design, Interior Design & Architectural Visualization — 2015',
        service: 'Architectural Design, Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/campions-renderings/campions-renderings-01-desktop.jpg',
        imageUrlDesktop: 'assets/images/campions-renderings/campions-renderings-01-desktop.jpg',
        imageMobileUrl: 'assets/images/campions-renderings/campions-renderings-01-desktop.jpg',
        projectUrl: 'campions-renderings.html',
        desc: 'Terraced houses grouped around a shared pool courtyard, drawn in several exterior colourways and carried through to the interiors.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Architectural design, Interior design, 3D visualization',
          year: '2015',
          disciplines: ['Architectural Design', 'Interior Design', '3D Visualization']
        }
      },
      {
        id: 'chocolate',
        title: 'Chocolate',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'graphic',
        imageUrl: 'assets/images/chocolate/chocolate-1.jpg',
        imageUrlDesktop: 'assets/images/chocolate/chocolate-1.jpg',
        imageMobileUrl: 'assets/images/chocolate/chocolate-1.jpg',
        projectUrl: 'chocolate.html',
        desc: 'Logo design for Chocolate by Kwaku Bediako, a fashion design house in Ghana — a dripping C monogram drawn from a couturier’s dress form, paired with a script wordmark, a winged badge variant, a corporate typeface, stationery, and the badge cast as metal hardware on the house’s footwear and leatherwear.',
        specs: {
          client: 'Chocolate by Kwaku Bediako',
          scope: 'Logo Design, Brand Identity, Corporate Typeface, Stationery & Application',
          team: 'RDVS Team',
          year: '2014',
          disciplines: ['Graphic Design', 'Brand Identity']
        }
      },
      {
        id: 'glow-in-the-dark',
        title: 'Glow in the Dark',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'graphic',
        imageUrl: 'assets/images/glow-in-the-dark/glow-in-the-dark-1.jpg',
        imageUrlDesktop: 'assets/images/glow-in-the-dark/glow-in-the-dark-1.jpg',
        imageMobileUrl: 'assets/images/glow-in-the-dark/glow-in-the-dark-1-mobile.jpg',
        projectUrl: 'glow-in-the-dark.html',
        desc: 'Event marketing for a party advertised for 4 October 2014 — a neon sign key visual modelled in 3D so the glass could be shown dead and struck up, then looped as a teaser between the two states.',
        specs: {
          client: 'Private Client',
          scope: 'Graphic Design, 3D Visualization, Motion Design',
          team: 'Jude Nyoagbe, Randy Biney',
          location: 'Accra, Ghana',
          year: '2014',
          disciplines: ['Graphic Design', '3D Visualization', 'Motion Design']
        }
      },
      {
        id: 'stark-glaube',
        title: 'Stark Glaube',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'graphic',
        imageUrl: 'assets/images/stark-glaube/stark-glaube-2-desktop.jpg',
        imageUrlDesktop: 'assets/images/stark-glaube/stark-glaube-2-desktop.jpg',
        imageMobileUrl: 'assets/images/stark-glaube/stark-glaube-2-desktop.jpg',
        projectUrl: 'stark-glaube.html',
        desc: 'Identity for a Ghanaian company — the initials SG and the name set as a wordmark, taken through four routes: a monogram knocked out of a graded band of triangles, glossy green-and-blue ribbon loops, a bird in flight and a three-bar banner.',
        specs: {
          client: 'Stark Glaube',
          scope: 'Graphic Design, Logo Design & Brand Identity',
          team: 'Paa Kofi Tetteh',
          location: 'Ghana',
          year: '2014',
          disciplines: ['Graphic Design', 'Brand Identity']
        }
      },
      {
        id: 'stephen-yvonne',
        title: 'Stephen + Yvonne',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'graphic',
        imageUrl: 'assets/images/stephen-yvonne/stephen-yvonne-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/stephen-yvonne/stephen-yvonne-1-desktop.jpg',
        imageMobileUrl: 'assets/images/stephen-yvonne/stephen-yvonne-1-desktop.jpg',
        projectUrl: 'stephen-yvonne.html',
        desc: 'Wedding invitation suite for Stephen + Yvonne Ntow — a pair of gold lovebirds whose wings meet as a heart, their plumage then opened out into a feather macro that carries the verse, the invitation and a gold-on-grey location card.',
        specs: {
          client: 'Stephen & Yvonne Ntow',
          scope: 'Graphic Design, Illustration, Digital Art & Print',
          team: 'Randy Biney',
          location: 'Accra, Ghana',
          year: '2014',
          disciplines: ['Graphic Design', 'Digital Art', 'Illustration']
        }
      },
      {
        id: 'stanchart-hq',
        title: 'Stanchart HQ',
        category: '3D Visualization — 2010',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/stanchart-hq/stanchart-hq-1.jpg',
        imageUrlDesktop: 'assets/images/stanchart-hq/stanchart-hq-1.jpg',
        imageMobileUrl: 'assets/images/stanchart-hq/stanchart-hq-1.jpg',
        projectUrl: 'stanchart-hq.html',
        desc: 'Photorealistic 3D visualization for Stanchart HQ, a corporate headquarters tower completed in 2010.',
        specs: {
          client: 'Private Client',
          scope: '3D Visualization',
          team: 'RDVS Team',
          year: '2010',
          disciplines: ['3D Visualization']
        }
      },
      {
        id: 'harbour-pointe',
        title: 'Harbour Pointe',
        category: 'Interior Design & 3D Visualization — 2015',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interior-design',
        imageUrl: 'assets/images/harbour-pointe/harbour-pointe-1.jpg',
        imageUrlDesktop: 'assets/images/harbour-pointe/harbour-pointe-1.jpg',
        imageMobileUrl: 'assets/images/harbour-pointe/harbour-pointe-1.jpg',
        projectUrl: 'harbour-pointe.html',
        desc: 'Collaborative interior design and photorealistic 3D visualization for Harbour Pointe, a mixed-use waterfront development completed in 2015.',
        specs: {
          client: 'Infinite Group Ltd',
          scope: 'Interior Design, 3D Visualization',
          team: 'Kwadwo Boadi (Infinite Group Ltd), Annabella Boadi-Misa (RDVS), Jude Nyoagbe (RDVS)',
          year: '2015',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'ghana-bbq-beer-festival',
        title: 'Ghana BBQ & Beer Festival',
        category: 'Graphic Design — 2017',
        service: 'Graphic Design',
        discipline: 'graphic',
        imageUrl: 'assets/images/ghana-bbq-beer-festival/ghana-bbq-beer-festival-desktop.jpg',
        imageUrlDesktop: 'assets/images/ghana-bbq-beer-festival/ghana-bbq-beer-festival-desktop.jpg',
        imageMobileUrl: 'assets/images/ghana-bbq-beer-festival/ghana-bbq-beer-festival-desktop.jpg',
        projectUrl: 'ghana-bbq-beer-festival.html',
        desc: 'Event poster for a barbecue and beer festival at Bermuda Gardens, Accra — a mustard A4 sheet torn open onto a white-lined street plan, with the title set in a face whose letters are themselves torn.',
        specs: {
          client: 'Private Client',
          scope: 'Graphic Design & Digital Art',
          team: 'RDVS Team',
          location: 'Accra, Ghana',
          year: '2017',
          disciplines: ['Graphic Design', 'Digital Art']
        }
      },
      {
        id: 'gh-phot-awards',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'industrial-design',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-1.jpg',
        imageUrlDesktop: 'assets/images/gh-phot-awards/gh-phot-awards-1.jpg',
        imageMobileUrl: 'assets/images/gh-phot-awards/gh-phot-awards-1.jpg',
        projectUrl: 'gh-phot-awards.html',
        desc: 'Industrial design, 3D visualization and motion design for the Gh Photography Awards ceremony completed in 2016.',
        specs: {
          client: 'Private Client',
          scope: 'Industrial Design, 3D Visualization, Motion Design',
          team: 'RDVS Team',
          year: '2016',
          disciplines: ['Industrial Design', '3D Visualization', 'Motion Design']
        }
      },
      {
        id: 'haustalks',
        title: 'Haustalks',
        category: 'Graphic Design — 2019',
        service: 'Graphic Design',
        discipline: 'graphic',
        imageUrl: 'assets/images/haustalks/haustalks-desktop.jpg',
        imageUrlDesktop: 'assets/images/haustalks/haustalks-desktop.jpg',
        imageMobileUrl: 'assets/images/haustalks/haustalks-desktop.jpg',
        projectUrl: 'haustalks.html',
        desc: 'Identity and campaign plates for Haustalks, an advice service that connects a client with a named building professional — a red speech-bubble monogram set into rendered scenes of steel and of stone.',
        specs: {
          client: 'Haustalks',
          scope: 'Brand Identity, Graphic Design & 3D Visualization',
          team: 'RDVS Team',
          location: 'Accra, Ghana',
          year: '2019',
          disciplines: ['Graphic Design', '3D Visualization']
        }
      },
      {
        id: 'mtn-hq',
        title: 'MTN HQ',
        category: 'Graphic Design & 3D Visualization — 2017',
        service: 'Graphic Design & 3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/mtn-hq/mtn-hq-1.jpg',
        imageUrlDesktop: 'assets/images/mtn-hq/mtn-hq-1.jpg',
        imageMobileUrl: 'assets/images/mtn-hq/mtn-hq-1.jpg',
        projectUrl: 'mtn.html',
        desc: 'Environmental graphics and way-finding pitch for MTN House, Accra — a system built on the SIM card and paper-plane motif, explored through pictograms, signage, kiosks and 3D visualization.',
        specs: {
          client: 'James Cubitt',
          scope: 'Graphic Design, Environmental Graphics, Way-Finding & 3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Environmental Graphics', 'Way-Finding', '3D Visualization']
        }
      },
      {
        id: 'yao-yaa',
        title: 'Yao + Yaa',
        category: 'Graphic Design & Digital Art — 2013',
        service: 'Graphic Design & Digital Art',
        discipline: 'graphic',
        imageUrl: 'assets/images/yao-yaa/yao-yaa-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/yao-yaa/yao-yaa-1-desktop.jpg',
        imageMobileUrl: 'assets/images/yao-yaa/yao-yaa-1-desktop.jpg',
        projectUrl: 'yao-yaa.html',
        desc: 'Wedding invitation for Yao Tettey and Yaa Lamptey — a sea-green paisley field with the couple\u2019s day-names worked into it tone-on-tone, geometric-sans type panels and redrawn Tema venue maps.',
        specs: {
          client: 'Nunya Yao Tettey & Rebecca Yaa Effaah Lamptey',
          scope: 'Graphic Design, Illustration, Digital Art & Print',
          team: 'RDVS Team',
          location: 'Tema, Ghana',
          year: '2013',
          disciplines: ['Graphic Design', 'Digital Art', 'Illustration']
        }
      },
      {
        id: 'ameyaw-sarah',
        title: 'Ameyaw + Sarah',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'graphic',
        imageUrl: 'assets/images/ameyaw-sarah/ameyaw-sarah-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/ameyaw-sarah/ameyaw-sarah-1-desktop.jpg',
        imageMobileUrl: 'assets/images/ameyaw-sarah/ameyaw-sarah-1-desktop.jpg',
        projectUrl: 'ameyaw-sarah.html',
        desc: 'Invitation for an Akan customary marriage \u2014 the adinkra symbol Me Ware Wo redrawn from the couple\u2019s initials as a four-lobed monogram, laid over a kente weave built from minute S and A letterforms, with an adinkra legend driving the directions map.',
        specs: {
          client: 'Ameyaw Mensah & Sarah Amoabeng',
          scope: 'Graphic Design, Illustration & Print',
          team: 'Randy Biney, Jude Nyoagbe',
          location: 'Sunyani, Ghana',
          year: '2014',
          disciplines: ['Graphic Design', 'Illustration', 'Print']
        }
      },
      {
        id: 'baobab-hotel-exteriors',
        title: 'Baobab Hotel - Exteriors',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-1-desktop.jpg',
        imageMobileUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-1-desktop.jpg',
        projectUrl: 'baobab-hotel-exteriors.html',
        desc: 'Exterior visualizations of the Baobab Airport Hotel in Accra for architect Theodore Kanyi \u2014 the tower modelled in 3D and composited into photographed day and night plates of the street, closing on the rooftop pool and bar at dusk.',
        specs: {
          client: 'Architect Theodore Kanyi',
          scope: '3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          location: 'Accra, Ghana',
          year: '2016',
          disciplines: ['3D Visualization']
        }
      },
      {
        id: 'senya-resort',
        title: 'Senya Resort',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/senya-resort/senya-resort-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/senya-resort/senya-resort-1-desktop.jpg',
        imageMobileUrl: 'assets/images/senya-resort/senya-resort-1-desktop.jpg',
        projectUrl: 'senya-resort.html',
        desc: 'Interior visualizations for a resort scheme designed by Leonie Badger \u2014 an open-plan living space organised around a floor-to-ceiling wall of stacked timber cubes, African textile panels, rattan pendants and carved masks set along a low white console.',
        specs: {
          client: 'Leonie Badger',
          scope: '3D Visualization',
          team: 'RDVS Team',
          location: 'Senya, Ghana',
          year: '2018',
          disciplines: ['3D Visualization']
        }
      },
      {
        id: 'maurice-abena',
        title: 'Maurice + Abena',
        category: 'Graphic Design — 2013',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/maurice-abena/maurice-abena-4-desktop.jpg',
        imageUrlDesktop: 'assets/images/maurice-abena/maurice-abena-4-desktop.jpg',
        imageMobileUrl: 'assets/images/maurice-abena/maurice-abena-4-desktop.jpg',
        projectUrl: 'maurice-abena.html'
      },
      {
        id: 'ndaba-restaurant-whm',
        title: 'Ndaba Restaurant, WHM',
        category: '3D Visualization — 2014',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ndaba-restaurant-whm/ndaba-restaurant-whm-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/ndaba-restaurant-whm/ndaba-restaurant-whm-1-desktop.jpg',
        imageMobileUrl: 'assets/images/ndaba-restaurant-whm/ndaba-restaurant-whm-1-desktop.jpg',
        projectUrl: 'ndaba-restaurant-whm.html'
      },
      {
        id: '2gs',
        title: '2GS',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/2gs/2gs-5-desktop.jpg',
        imageUrlDesktop: 'assets/images/2gs/2gs-5-desktop.jpg',
        imageMobileUrl: 'assets/images/2gs/2gs-5-desktop.jpg',
        projectUrl: '2gs.html'
      },
      {
        id: 'dela-anyaa',
        title: 'Dela Anyaa',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/dela-anyaa/dela-anyaa-8-desktop.jpg',
        imageUrlDesktop: 'assets/images/dela-anyaa/dela-anyaa-8-desktop.jpg',
        imageMobileUrl: 'assets/images/dela-anyaa/dela-anyaa-8-desktop.jpg',
        projectUrl: 'dela-anyaa.html'
      },
      {
        id: 'marble-bath',
        title: 'Marble & Bath',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/marble-bath/marble-bath-1.jpg',
        imageUrlDesktop: 'assets/images/marble-bath/marble-bath-1.jpg',
        imageMobileUrl: 'assets/images/marble-bath/marble-bath-1.jpg',
        projectUrl: 'marble-bath.html'
      },
      {
        id: 'drw-furnart',
        title: 'DRW Furnart',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/drw-furnart/drw-furnart-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/drw-furnart/drw-furnart-1-desktop.jpg',
        imageMobileUrl: 'assets/images/drw-furnart/drw-furnart-1-desktop.jpg',
        projectUrl: 'drw-furnart.html'
      },
      {
        id: 'weldment-panels',
        title: 'Weldment Panels',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/weldment-panels/weldment-panels-5.jpg',
        imageUrlDesktop: 'assets/images/weldment-panels/weldment-panels-5.jpg',
        imageMobileUrl: 'assets/images/weldment-panels/weldment-panels-5.jpg',
        projectUrl: 'weldment-panels.html'
      },
      {
        id: 'airport-hills-residence',
        title: 'Airport Hills Residence',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/airport-hills-residence/airport-hills-residence-3.jpg',
        imageUrlDesktop: 'assets/images/airport-hills-residence/airport-hills-residence-3.jpg',
        imageMobileUrl: 'assets/images/airport-hills-residence/airport-hills-residence-3.jpg',
        projectUrl: 'airport-hills-residence.html'
      },
      {
        id: 'palazzo',
        title: 'Palazzo',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/palazzo/palazzo-1.jpg',
        imageUrlDesktop: 'assets/images/palazzo/palazzo-1.jpg',
        imageMobileUrl: 'assets/images/palazzo/palazzo-1.jpg',
        projectUrl: 'palazzo.html'
      },
      {
        id: 'npa-reception-renders',
        title: 'NPA',
        category: 'Architectural Visualization & BIM — 2022',
        service: 'Architectural Visualization & BIM',
        discipline: 'vfx',
        imageUrl: 'assets/images/npa/npa-3.jpg',
        imageUrlDesktop: 'assets/images/npa/npa-3.jpg',
        imageMobileUrl: 'assets/images/npa/npa-3.jpg',
        projectUrl: 'npa-reception-renders.html'
      },
      {
        id: 'aelius',
        title: 'Aelius Consult Brand System',
        category: 'Graphic Design — 2023',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/aelius/aelius-brand.jpg',
        imageUrlDesktop: 'assets/images/aelius/aelius-brand.jpg',
        imageMobileUrl: 'assets/images/aelius/aelius-brand.jpg',
        projectUrl: 'aelius.html'
      },
      {
        id: 'yao-yaa-plate1',
        title: 'Yao + Yaa',
        category: 'Graphic Design & Digital Art — 2013',
        service: 'Graphic Design & Digital Art',
        discipline: 'vfx',
        imageUrl: 'assets/images/yao-yaa/yao-yaa-1.jpg',
        imageUrlDesktop: 'assets/images/yao-yaa/yao-yaa-1.jpg',
        imageMobileUrl: 'assets/images/yao-yaa/yao-yaa-1-mobile.jpg',
        projectUrl: 'yao-yaa.html',
        desc: 'Wedding invitation for Yao Tettey and Yaa Lamptey — a sea-green paisley field with the couple\\u2019s day-names worked into it tone-on-tone, geometric-sans type panels and redrawn Tema venue maps.',
        specs: {
          client: 'Nunya Yao Tettey & Rebecca Yaa Effaah Lamptey',
          scope: 'Graphic Design, Illustration, Digital Art & Print',
          team: 'RDVS Team',
          year: '2013',
          disciplines: '[\'Graphic Design   Digital Art\']'
        }
      },
      {
        id: 'yao-yaa-plate2',
        title: 'Yao + Yaa',
        category: 'Graphic Design & Digital Art — 2013',
        service: 'Graphic Design & Digital Art',
        discipline: 'vfx',
        imageUrl: 'assets/images/yao-yaa/yao-yaa-2.jpg',
        imageUrlDesktop: 'assets/images/yao-yaa/yao-yaa-2.jpg',
        imageMobileUrl: 'assets/images/yao-yaa/yao-yaa-2.jpg',
        projectUrl: 'yao-yaa.html',
        desc: 'Wedding invitation for Yao Tettey and Yaa Lamptey — a sea-green paisley field with the couple\\u2019s day-names worked into it tone-on-tone, geometric-sans type panels and redrawn Tema venue maps.',
        specs: {
          client: 'Nunya Yao Tettey & Rebecca Yaa Effaah Lamptey',
          scope: 'Graphic Design, Illustration, Digital Art & Print',
          team: 'RDVS Team',
          year: '2013',
          disciplines: '[\'Graphic Design   Digital Art\']'
        }
      },
      {
        id: 'white-fleece-plate1',
        title: 'White Fleece',
        category: 'Graphic Design & Identity — 2014',
        service: 'Graphic Design & Identity',
        discipline: 'vfx',
        imageUrl: 'assets/images/white-fleece/white-fleece-8.jpg',
        imageUrlDesktop: 'assets/images/white-fleece/white-fleece-8.jpg',
        imageMobileUrl: 'assets/images/white-fleece/white-fleece-8.jpg',
        projectUrl: 'white-fleece.html',
        desc: 'A 2014 corporate identity for White Fleece, a business in Accra, in which RDVS Studios designed a teal wave-and-orbit logotype and built out a full stationery suite, colour system and brand wallpaper.',
        specs: {
          client: 'White Fleece',
          scope: 'Brand identity design, logotype and variations, letterhead, business card, corporate typeface specification, brand wallpaper and a laptop mockup.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Graphic Design   Identity\']'
        }
      },
      {
        id: 'white-fleece-plate2',
        title: 'White Fleece',
        category: 'Graphic Design & Identity — 2014',
        service: 'Graphic Design & Identity',
        discipline: 'vfx',
        imageUrl: 'assets/images/white-fleece/white-fleece-1.jpg',
        imageUrlDesktop: 'assets/images/white-fleece/white-fleece-1.jpg',
        imageMobileUrl: 'assets/images/white-fleece/white-fleece-1.jpg',
        projectUrl: 'white-fleece.html',
        desc: 'A 2014 corporate identity for White Fleece, a business in Accra, in which RDVS Studios designed a teal wave-and-orbit logotype and built out a full stationery suite, colour system and brand wallpaper.',
        specs: {
          client: 'White Fleece',
          scope: 'Brand identity design, logotype and variations, letterhead, business card, corporate typeface specification, brand wallpaper and a laptop mockup.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Graphic Design   Identity\']'
        }
      },
      {
        id: 'white-fleece-plate3',
        title: 'White Fleece',
        category: 'Graphic Design & Identity — 2014',
        service: 'Graphic Design & Identity',
        discipline: 'vfx',
        imageUrl: 'assets/images/white-fleece/white-fleece-2.jpg',
        imageUrlDesktop: 'assets/images/white-fleece/white-fleece-2.jpg',
        imageMobileUrl: 'assets/images/white-fleece/white-fleece-2.jpg',
        projectUrl: 'white-fleece.html',
        desc: 'A 2014 corporate identity for White Fleece, a business in Accra, in which RDVS Studios designed a teal wave-and-orbit logotype and built out a full stationery suite, colour system and brand wallpaper.',
        specs: {
          client: 'White Fleece',
          scope: 'Brand identity design, logotype and variations, letterhead, business card, corporate typeface specification, brand wallpaper and a laptop mockup.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Graphic Design   Identity\']'
        }
      },
      {
        id: 'weldment-panels-plate1',
        title: 'Weldment Panels',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/weldment-panels/weldment-panels-1.jpg',
        imageUrlDesktop: 'assets/images/weldment-panels/weldment-panels-1.jpg',
        imageMobileUrl: 'assets/images/weldment-panels/weldment-panels-1.jpg',
        projectUrl: 'weldment-panels.html',
        desc: 'Renders of a graffiti-proof wall panel system, made in 2016 as part of a client s presentation material.',
        specs: {
          client: 'Private Client',
          scope: '3D modelling of the panel cladding and the road structures it is fixed to, rendered in daylight, dusk and night lighting for a client presentation.',
          team: 'RDVS Team',
          year: '2016',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'weldment-panels-plate2',
        title: 'Weldment Panels',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/weldment-panels/weldment-panels-2.jpg',
        imageUrlDesktop: 'assets/images/weldment-panels/weldment-panels-2.jpg',
        imageMobileUrl: 'assets/images/weldment-panels/weldment-panels-2.jpg',
        projectUrl: 'weldment-panels.html',
        desc: 'Renders of a graffiti-proof wall panel system, made in 2016 as part of a client s presentation material.',
        specs: {
          client: 'Private Client',
          scope: '3D modelling of the panel cladding and the road structures it is fixed to, rendered in daylight, dusk and night lighting for a client presentation.',
          team: 'RDVS Team',
          year: '2016',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'the-tea-house-plate1',
        title: 'The Tea House',
        category: 'Graphic Design, Digital & Web Design — 2021',
        service: 'Graphic Design, Digital & Web Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/tea-house/tea-house-01.png',
        imageUrlDesktop: 'assets/images/tea-house/tea-house-01.png',
        imageMobileUrl: 'assets/images/tea-house/tea-house-01.png',
        projectUrl: 'the-tea-house.html',
        desc: 'An identity system and bespoke UI/UX web platform for The Tea House, a tea room and event venue in Accra: a leaf mark in two greens, ochre display type and a set of organic overlapping shapes carried across the site\'s story, menu, booking and reservation flows.',
        specs: {
          client: 'Private Client',
          scope: 'Brand identity system, graphic design and custom UI/UX web design — art direction, menu, booking and reservation flows',
          team: 'Jude Abbey, Jude Nyoagbe, Mahalia, Bimpong',
          year: '2021',
          disciplines: '[\'Graphic Design\', \'Digital   Web Design\']'
        }
      },
      {
        id: 'the-tea-house-plate2',
        title: 'The Tea House',
        category: 'Graphic Design, Digital & Web Design — 2021',
        service: 'Graphic Design, Digital & Web Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/tea-house/tea-house-02.png',
        imageUrlDesktop: 'assets/images/tea-house/tea-house-02.png',
        imageMobileUrl: 'assets/images/tea-house/tea-house-02.png',
        projectUrl: 'the-tea-house.html',
        desc: 'An identity system and bespoke UI/UX web platform for The Tea House, a tea room and event venue in Accra: a leaf mark in two greens, ochre display type and a set of organic overlapping shapes carried across the site\'s story, menu, booking and reservation flows.',
        specs: {
          client: 'Private Client',
          scope: 'Brand identity system, graphic design and custom UI/UX web design — art direction, menu, booking and reservation flows',
          team: 'Jude Abbey, Jude Nyoagbe, Mahalia, Bimpong',
          year: '2021',
          disciplines: '[\'Graphic Design\', \'Digital   Web Design\']'
        }
      },
      {
        id: 'the-tea-house-plate3',
        title: 'The Tea House',
        category: 'Graphic Design, Digital & Web Design — 2021',
        service: 'Graphic Design, Digital & Web Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/tea-house/tea-house-03.png',
        imageUrlDesktop: 'assets/images/tea-house/tea-house-03.png',
        imageMobileUrl: 'assets/images/tea-house/tea-house-03.png',
        projectUrl: 'the-tea-house.html',
        desc: 'An identity system and bespoke UI/UX web platform for The Tea House, a tea room and event venue in Accra: a leaf mark in two greens, ochre display type and a set of organic overlapping shapes carried across the site\'s story, menu, booking and reservation flows.',
        specs: {
          client: 'Private Client',
          scope: 'Brand identity system, graphic design and custom UI/UX web design — art direction, menu, booking and reservation flows',
          team: 'Jude Abbey, Jude Nyoagbe, Mahalia, Bimpong',
          year: '2021',
          disciplines: '[\'Graphic Design\', \'Digital   Web Design\']'
        }
      },
      {
        id: 'stephen-yvonne-plate1',
        title: 'Stephen + Yvonne',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/stephen-yvonne/stephen-yvonne-1.jpg',
        imageUrlDesktop: 'assets/images/stephen-yvonne/stephen-yvonne-1-desktop.jpg',
        imageMobileUrl: 'assets/images/stephen-yvonne/stephen-yvonne-1-mobile.jpg',
        projectUrl: 'stephen-yvonne.html',
        desc: 'Wedding invitation suite for Stephen + Yvonne Ntow — a pair of gold lovebirds whose wings meet as a heart, their plumage then opened out into a feather macro that carries the verse, the invitation and a gold-on-grey location card.',
        specs: {
          client: 'Stephen & Yvonne Ntow',
          scope: 'Graphic Design, Illustration, Digital Art & Print',
          team: 'Randy Biney',
          year: '2014',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'stephen-yvonne-plate2',
        title: 'Stephen + Yvonne',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/stephen-yvonne/stephen-yvonne-2.jpg',
        imageUrlDesktop: 'assets/images/stephen-yvonne/stephen-yvonne-2.jpg',
        imageMobileUrl: 'assets/images/stephen-yvonne/stephen-yvonne-2.jpg',
        projectUrl: 'stephen-yvonne.html',
        desc: 'Wedding invitation suite for Stephen + Yvonne Ntow — a pair of gold lovebirds whose wings meet as a heart, their plumage then opened out into a feather macro that carries the verse, the invitation and a gold-on-grey location card.',
        specs: {
          client: 'Stephen & Yvonne Ntow',
          scope: 'Graphic Design, Illustration, Digital Art & Print',
          team: 'Randy Biney',
          year: '2014',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'stark-glaube-plate1',
        title: 'Stark Glaube',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/stark-glaube/stark-glaube-1.jpg',
        imageUrlDesktop: 'assets/images/stark-glaube/stark-glaube-1.jpg',
        imageMobileUrl: 'assets/images/stark-glaube/stark-glaube-1.jpg',
        projectUrl: 'stark-glaube.html',
        desc: 'Identity for a Ghanaian company — the initials SG and the name set as a wordmark, taken through four routes: a monogram knocked out of a graded band of triangles, glossy green-and-blue ribbon loops, a bird in flight and a three-bar banner.',
        specs: {
          client: 'Stark Glaube',
          scope: 'Graphic Design, Logo Design & Brand Identity',
          team: 'Paa Kofi Tetteh',
          year: '2014',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'stark-glaube-plate2',
        title: 'Stark Glaube',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/stark-glaube/stark-glaube-2.jpg',
        imageUrlDesktop: 'assets/images/stark-glaube/stark-glaube-2.jpg',
        imageMobileUrl: 'assets/images/stark-glaube/stark-glaube-2.jpg',
        projectUrl: 'stark-glaube.html',
        desc: 'Identity for a Ghanaian company — the initials SG and the name set as a wordmark, taken through four routes: a monogram knocked out of a graded band of triangles, glossy green-and-blue ribbon loops, a bird in flight and a three-bar banner.',
        specs: {
          client: 'Stark Glaube',
          scope: 'Graphic Design, Logo Design & Brand Identity',
          team: 'Paa Kofi Tetteh',
          year: '2014',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'six-acres-company-profile-plate1',
        title: 'Six Acres Company Profile',
        category: 'Graphic Design & 3D Visualization — 2017',
        service: 'Graphic Design & 3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/six-acres/six-acres-1.jpg',
        imageUrlDesktop: 'assets/images/six-acres/six-acres-1.jpg',
        imageMobileUrl: 'assets/images/six-acres/six-acres-1.jpg',
        projectUrl: 'six-acres-company-profile.html',
        desc: 'A twenty-two-page company profile for Six Acres Limited, a Ghanaian real-estate developer: editorial design and art direction, the architectural renders that carry its housing product, and photoreal mockups of every spread.',
        specs: {
          client: 'Six Acres Limited',
          scope: 'Company profile design and art direction: cover and page architecture, wordmark and pattern system, architectural renders of the housing product, partner and contact spreads, photoreal mockups of every spread and a short animated flip-through',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Graphic Design   3D Visualization\']'
        }
      },
      {
        id: 'six-acres-company-profile-plate2',
        title: 'Six Acres Company Profile',
        category: 'Graphic Design & 3D Visualization — 2017',
        service: 'Graphic Design & 3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/six-acres/six-acres-2.jpg',
        imageUrlDesktop: 'assets/images/six-acres/six-acres-2.jpg',
        imageMobileUrl: 'assets/images/six-acres/six-acres-2.jpg',
        projectUrl: 'six-acres-company-profile.html',
        desc: 'A twenty-two-page company profile for Six Acres Limited, a Ghanaian real-estate developer: editorial design and art direction, the architectural renders that carry its housing product, and photoreal mockups of every spread.',
        specs: {
          client: 'Six Acres Limited',
          scope: 'Company profile design and art direction: cover and page architecture, wordmark and pattern system, architectural renders of the housing product, partner and contact spreads, photoreal mockups of every spread and a short animated flip-through',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Graphic Design   3D Visualization\']'
        }
      },
      {
        id: 'sinopec-ghana-interiors-plate1',
        title: 'Sinopec Ghana Interiors',
        category: 'Architectural Visualization — 2013',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/sinopec-ghana-interiors/sinopec-ghana-interiors-1.jpg',
        imageUrlDesktop: 'assets/images/sinopec-ghana-interiors/sinopec-ghana-interiors-1.jpg',
        imageMobileUrl: 'assets/images/sinopec-ghana-interiors/sinopec-ghana-interiors-1.jpg',
        projectUrl: 'sinopec-ghana-interiors.html',
        desc: 'A 2013 pair of 3D interior visualizations for the Sinopec office in Accra, in which RDVS Studios modeled a bold red reception lounge and a green-accented open-plan workspace to present the corporate fit-out.',
        specs: {
          client: 'Sinopec',
          scope: '3D interior visualization of the office lounge and open-plan workspace, modeled and rendered to present the corporate fit-out.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'sinopec-ghana-interiors-plate2',
        title: 'Sinopec Ghana Interiors',
        category: 'Architectural Visualization — 2013',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/sinopec-ghana-interiors/sinopec-ghana-interiors-2.jpg',
        imageUrlDesktop: 'assets/images/sinopec-ghana-interiors/sinopec-ghana-interiors-2.jpg',
        imageMobileUrl: 'assets/images/sinopec-ghana-interiors/sinopec-ghana-interiors-2.jpg',
        projectUrl: 'sinopec-ghana-interiors.html',
        desc: 'A 2013 pair of 3D interior visualizations for the Sinopec office in Accra, in which RDVS Studios modeled a bold red reception lounge and a green-accented open-plan workspace to present the corporate fit-out.',
        specs: {
          client: 'Sinopec',
          scope: '3D interior visualization of the office lounge and open-plan workspace, modeled and rendered to present the corporate fit-out.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'senya-resort-plate1',
        title: 'Senya Resort',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/senya-resort/senya-resort-1.jpg',
        imageUrlDesktop: 'assets/images/senya-resort/senya-resort-1.jpg',
        imageMobileUrl: 'assets/images/senya-resort/senya-resort-1-mobile.jpg',
        projectUrl: 'senya-resort.html',
        desc: 'Interior visualizations for a resort scheme designed by Leonie Badger \\u2014 an open-plan living space organised around a floor-to-ceiling wall of stacked timber cubes, African textile panels, rattan pendants and carved masks set along a low white console.',
        specs: {
          client: 'Leonie Badger',
          scope: '3D Visualization',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'senya-resort-plate2',
        title: 'Senya Resort',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/senya-resort/senya-resort-2.jpg',
        imageUrlDesktop: 'assets/images/senya-resort/senya-resort-2.jpg',
        imageMobileUrl: 'assets/images/senya-resort/senya-resort-2.jpg',
        projectUrl: 'senya-resort.html',
        desc: 'Interior visualizations for a resort scheme designed by Leonie Badger \\u2014 an open-plan living space organised around a floor-to-ceiling wall of stacked timber cubes, African textile panels, rattan pendants and carved masks set along a low white console.',
        specs: {
          client: 'Leonie Badger',
          scope: '3D Visualization',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'samsung-branding-proposal-plate1',
        title: 'Samsung Branding Proposal',
        category: 'Graphic Design — 2010',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/samsung-branding-proposal/samsung-branding-proposal-1.jpg',
        imageUrlDesktop: 'assets/images/samsung-branding-proposal/samsung-branding-proposal-1.jpg',
        imageMobileUrl: 'assets/images/samsung-branding-proposal/samsung-branding-proposal-1.jpg',
        projectUrl: 'samsung-branding-proposal.html',
        desc: 'A street branding proposal in graphic design, prepared by RDVS. Design for Samsung in 2009, mapping an out-of-home identity rollout at Circle Ridge, Accra, across bus shelters, billboards, flags and totem light boxes.',
        specs: {
          client: 'Samsung',
          scope: 'Out-of-home branding proposal: street furniture and signage design, billboard and flag artwork, and in-context mockup visuals for Samsung in Accra.',
          team: 'RDVS. DESIGN',
          year: '2010',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'samsung-branding-proposal-plate2',
        title: 'Samsung Branding Proposal',
        category: 'Graphic Design — 2010',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/samsung-branding-proposal/samsung-branding-proposal-2.jpg',
        imageUrlDesktop: 'assets/images/samsung-branding-proposal/samsung-branding-proposal-2.jpg',
        imageMobileUrl: 'assets/images/samsung-branding-proposal/samsung-branding-proposal-2.jpg',
        projectUrl: 'samsung-branding-proposal.html',
        desc: 'A street branding proposal in graphic design, prepared by RDVS. Design for Samsung in 2009, mapping an out-of-home identity rollout at Circle Ridge, Accra, across bus shelters, billboards, flags and totem light boxes.',
        specs: {
          client: 'Samsung',
          scope: 'Out-of-home branding proposal: street furniture and signage design, billboard and flag artwork, and in-context mockup visuals for Samsung in Accra.',
          team: 'RDVS. DESIGN',
          year: '2010',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'samsung-branding-proposal-plate3',
        title: 'Samsung Branding Proposal',
        category: 'Graphic Design — 2010',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/samsung-branding-proposal/samsung-branding-proposal-3.jpg',
        imageUrlDesktop: 'assets/images/samsung-branding-proposal/samsung-branding-proposal-3.jpg',
        imageMobileUrl: 'assets/images/samsung-branding-proposal/samsung-branding-proposal-3.jpg',
        projectUrl: 'samsung-branding-proposal.html',
        desc: 'A street branding proposal in graphic design, prepared by RDVS. Design for Samsung in 2009, mapping an out-of-home identity rollout at Circle Ridge, Accra, across bus shelters, billboards, flags and totem light boxes.',
        specs: {
          client: 'Samsung',
          scope: 'Out-of-home branding proposal: street furniture and signage design, billboard and flag artwork, and in-context mockup visuals for Samsung in Accra.',
          team: 'RDVS. DESIGN',
          year: '2010',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'provident-insurance-plate1',
        title: 'Provident Insurance',
        category: 'Architectural Visualization — 2015',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/provident-insurance/provident-insurance-1.jpg',
        imageUrlDesktop: 'assets/images/provident-insurance/provident-insurance-1.jpg',
        imageMobileUrl: 'assets/images/provident-insurance/provident-insurance-1.jpg',
        projectUrl: 'provident-insurance.html',
        desc: 'A 2015 set of 3D interior visualizations for the Provident Insurance office in Accra, made for an architect, in which RDVS Studios rendered a reception, an open-plan floor and an executive suite in the company s blue and white palette.',
        specs: {
          client: 'Private Client',
          scope: '3D interior visualization of the office reception, open-plan floor and executive suite, produced for an architect’s client presentation.',
          team: 'RDVS. DESIGN',
          year: '2015',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'provident-insurance-plate2',
        title: 'Provident Insurance',
        category: 'Architectural Visualization — 2015',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/provident-insurance/provident-insurance-2.jpg',
        imageUrlDesktop: 'assets/images/provident-insurance/provident-insurance-2.jpg',
        imageMobileUrl: 'assets/images/provident-insurance/provident-insurance-2.jpg',
        projectUrl: 'provident-insurance.html',
        desc: 'A 2015 set of 3D interior visualizations for the Provident Insurance office in Accra, made for an architect, in which RDVS Studios rendered a reception, an open-plan floor and an executive suite in the company s blue and white palette.',
        specs: {
          client: 'Private Client',
          scope: '3D interior visualization of the office reception, open-plan floor and executive suite, produced for an architect’s client presentation.',
          team: 'RDVS. DESIGN',
          year: '2015',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'provident-insurance-plate3',
        title: 'Provident Insurance',
        category: 'Architectural Visualization — 2015',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/provident-insurance/provident-insurance-3.jpg',
        imageUrlDesktop: 'assets/images/provident-insurance/provident-insurance-3.jpg',
        imageMobileUrl: 'assets/images/provident-insurance/provident-insurance-3.jpg',
        projectUrl: 'provident-insurance.html',
        desc: 'A 2015 set of 3D interior visualizations for the Provident Insurance office in Accra, made for an architect, in which RDVS Studios rendered a reception, an open-plan floor and an executive suite in the company s blue and white palette.',
        specs: {
          client: 'Private Client',
          scope: '3D interior visualization of the office reception, open-plan floor and executive suite, produced for an architect’s client presentation.',
          team: 'RDVS. DESIGN',
          year: '2015',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'palazzo-plate1',
        title: 'Palazzo',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/palazzo/palazzo-2.jpg',
        imageUrlDesktop: 'assets/images/palazzo/palazzo-2.jpg',
        imageMobileUrl: 'assets/images/palazzo/palazzo-2.jpg',
        projectUrl: 'palazzo.html',
        desc: 'Photorealistic 3D visualization for Palazzo, an exclusive luxury residential development completed for Imperial Homes.',
        specs: {
          client: 'Imperial Homes',
          scope: '3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2017',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'palazzo-plate2',
        title: 'Palazzo',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/palazzo/palazzo-3.jpg',
        imageUrlDesktop: 'assets/images/palazzo/palazzo-3.jpg',
        imageMobileUrl: 'assets/images/palazzo/palazzo-3.jpg',
        projectUrl: 'palazzo.html',
        desc: 'Photorealistic 3D visualization for Palazzo, an exclusive luxury residential development completed for Imperial Homes.',
        specs: {
          client: 'Imperial Homes',
          scope: '3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2017',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'osu-tower-plate1',
        title: 'Osu Tower',
        category: 'Architectural Visualization — 2012',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/osu-tower/osu-tower-12.jpg',
        imageUrlDesktop: 'assets/images/osu-tower/osu-tower-12.jpg',
        imageMobileUrl: 'assets/images/osu-tower/osu-tower-12.jpg',
        projectUrl: 'osu-tower.html',
        desc: 'Twelve visualization plates from 2012 showing the interiors of an apartment in Osu, Accra, together with the tower elevation and its rooftop deck, modelled and rendered as architectural visualization by RDVS Studio for a private client.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural visualization of the apartment interiors, the tower elevation and the rooftop amenity deck, including modelling, material and furniture assignment, lighting and camera work.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'osu-tower-plate2',
        title: 'Osu Tower',
        category: 'Architectural Visualization — 2012',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/osu-tower/osu-tower-1.jpg',
        imageUrlDesktop: 'assets/images/osu-tower/osu-tower-1.jpg',
        imageMobileUrl: 'assets/images/osu-tower/osu-tower-1.jpg',
        projectUrl: 'osu-tower.html',
        desc: 'Twelve visualization plates from 2012 showing the interiors of an apartment in Osu, Accra, together with the tower elevation and its rooftop deck, modelled and rendered as architectural visualization by RDVS Studio for a private client.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural visualization of the apartment interiors, the tower elevation and the rooftop amenity deck, including modelling, material and furniture assignment, lighting and camera work.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'osu-tower-plate3',
        title: 'Osu Tower',
        category: 'Architectural Visualization — 2012',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/osu-tower/osu-tower-2.jpg',
        imageUrlDesktop: 'assets/images/osu-tower/osu-tower-2.jpg',
        imageMobileUrl: 'assets/images/osu-tower/osu-tower-2.jpg',
        projectUrl: 'osu-tower.html',
        desc: 'Twelve visualization plates from 2012 showing the interiors of an apartment in Osu, Accra, together with the tower elevation and its rooftop deck, modelled and rendered as architectural visualization by RDVS Studio for a private client.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural visualization of the apartment interiors, the tower elevation and the rooftop amenity deck, including modelling, material and furniture assignment, lighting and camera work.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'osu-apartments-plate1',
        title: 'Osu Apartments',
        category: 'Architectural Visualization — 2015',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/osu-apartments/osu-apartments-1.jpg',
        imageUrlDesktop: 'assets/images/osu-apartments/osu-apartments-1.jpg',
        imageMobileUrl: 'assets/images/osu-apartments/osu-apartments-1.jpg',
        projectUrl: 'osu-apartments.html',
        desc: 'A single 3D visualization from 2015 for Osu Apartment 2, a residential project in Accra, Ghana: an evening view of the shared terrace, built around a planted timber pergola, hanging lamps and low white seating.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural visualization: one dusk rendering of the apartment project’s planted terrace and outdoor lounge.',
          team: 'RDVS. DESIGN',
          year: '2015',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'odade3-plate1',
        title: 'Odade3',
        category: 'Architectural Visualization — 2014',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/odade3/odade3-1.jpg',
        imageUrlDesktop: 'assets/images/odade3/odade3-1.jpg',
        imageMobileUrl: 'assets/images/odade3/odade3-1.jpg',
        projectUrl: 'odade3.html',
        desc: 'Two 3D visualization plates by RDVS. Design, made in 2014 for the Odade3 Alumni Centre in Accra, presenting a low-rise institutional building with red and stone volumes set in a green landscaped compound.',
        specs: {
          client: 'Odade3',
          scope: '3D architectural visualization of the Odade3 Alumni Centre exteriors and their landscaped compound setting.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'odade3-plate2',
        title: 'Odade3',
        category: 'Architectural Visualization — 2014',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/odade3/odade3-2.jpg',
        imageUrlDesktop: 'assets/images/odade3/odade3-2.jpg',
        imageMobileUrl: 'assets/images/odade3/odade3-2.jpg',
        projectUrl: 'odade3.html',
        desc: 'Two 3D visualization plates by RDVS. Design, made in 2014 for the Odade3 Alumni Centre in Accra, presenting a low-rise institutional building with red and stone volumes set in a green landscaped compound.',
        specs: {
          client: 'Odade3',
          scope: '3D architectural visualization of the Odade3 Alumni Centre exteriors and their landscaped compound setting.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'octagon-mews-plate1',
        title: 'Octagon Mews',
        category: 'Architectural Visualization — 2011',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/octagon-mews/octagon-mews-1.jpg',
        imageUrlDesktop: 'assets/images/octagon-mews/octagon-mews-1.jpg',
        imageMobileUrl: 'assets/images/octagon-mews/octagon-mews-1.jpg',
        projectUrl: 'octagon-mews.html',
        desc: 'Three exterior visualizations from 2011 for Octagon Mews, a group of apartment blocks planned for Accra, Ghana: architectural visualization that sells the scheme through a shaded pool court, a street view and a pergola-shaded approach.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural visualization: three exterior render views of the apartment blocks, the pool court and the paved approach.',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'octagon-mews-plate2',
        title: 'Octagon Mews',
        category: 'Architectural Visualization — 2011',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/octagon-mews/octagon-mews-2.jpg',
        imageUrlDesktop: 'assets/images/octagon-mews/octagon-mews-2.jpg',
        imageMobileUrl: 'assets/images/octagon-mews/octagon-mews-2.jpg',
        projectUrl: 'octagon-mews.html',
        desc: 'Three exterior visualizations from 2011 for Octagon Mews, a group of apartment blocks planned for Accra, Ghana: architectural visualization that sells the scheme through a shaded pool court, a street view and a pergola-shaded approach.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural visualization: three exterior render views of the apartment blocks, the pool court and the paved approach.',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'octagon-mews-plate3',
        title: 'Octagon Mews',
        category: 'Architectural Visualization — 2011',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/octagon-mews/octagon-mews-3.jpg',
        imageUrlDesktop: 'assets/images/octagon-mews/octagon-mews-3.jpg',
        imageMobileUrl: 'assets/images/octagon-mews/octagon-mews-3.jpg',
        projectUrl: 'octagon-mews.html',
        desc: 'Three exterior visualizations from 2011 for Octagon Mews, a group of apartment blocks planned for Accra, Ghana: architectural visualization that sells the scheme through a shaded pool court, a street view and a pergola-shaded approach.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural visualization: three exterior render views of the apartment blocks, the pool court and the paved approach.',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'npa-reception-renders-plate1',
        title: 'NPA',
        category: 'Architectural Visualization & BIM — 2022',
        service: 'Architectural Visualization & BIM',
        discipline: 'vfx',
        imageUrl: 'assets/images/npa/npa-4.jpg',
        imageUrlDesktop: 'assets/images/npa/npa-4.jpg',
        imageMobileUrl: 'assets/images/npa/npa-4.jpg',
        projectUrl: 'npa-reception-renders.html',
        desc: 'BIM modelling and architectural visualization for the National Petroleum Authority s open-plan office   five plates of a white, black and grey floorplate carried by one blue brand wall, built around an interior scheme by Newland Interiors.',
        specs: {
          client: 'National Petroleum Authority',
          scope: 'BIM modelling and architectural visualization; interior design by Newland Interiors',
          team: 'RDVS Team',
          year: '2022',
          disciplines: '[\'Architectural Visualization   BIM\']'
        }
      },
      {
        id: 'npa-reception-renders-plate2',
        title: 'NPA',
        category: 'Architectural Visualization & BIM — 2022',
        service: 'Architectural Visualization & BIM',
        discipline: 'vfx',
        imageUrl: 'assets/images/npa/npa-1.jpg',
        imageUrlDesktop: 'assets/images/npa/npa-1.jpg',
        imageMobileUrl: 'assets/images/npa/npa-1.jpg',
        projectUrl: 'npa-reception-renders.html',
        desc: 'BIM modelling and architectural visualization for the National Petroleum Authority s open-plan office   five plates of a white, black and grey floorplate carried by one blue brand wall, built around an interior scheme by Newland Interiors.',
        specs: {
          client: 'National Petroleum Authority',
          scope: 'BIM modelling and architectural visualization; interior design by Newland Interiors',
          team: 'RDVS Team',
          year: '2022',
          disciplines: '[\'Architectural Visualization   BIM\']'
        }
      },
      {
        id: 'nest-apt-plate1',
        title: 'Nest',
        category: 'Architectural Visualization — 2014',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/nest-apt/nest-apt-1.jpg',
        imageUrlDesktop: 'assets/images/nest-apt/nest-apt-1.jpg',
        imageMobileUrl: 'assets/images/nest-apt/nest-apt-1.jpg',
        projectUrl: 'nest-apt.html',
        desc: 'Nest is an architectural visualization project RDVS delivered in 2014, producing exterior renders of an apartment block under construction in Accra, showing its white modern facade, balconies and ground-floor parking from two street-facing angles.',
        specs: {
          client: 'Private Client',
          scope: 'RDVS delivered 3D architectural visualization: modeling the apartment block and its street setting and producing the two exterior rendered views.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'nest-apt-plate2',
        title: 'Nest',
        category: 'Architectural Visualization — 2014',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/nest-apt/nest-apt-2.jpg',
        imageUrlDesktop: 'assets/images/nest-apt/nest-apt-2.jpg',
        imageMobileUrl: 'assets/images/nest-apt/nest-apt-2.jpg',
        projectUrl: 'nest-apt.html',
        desc: 'Nest is an architectural visualization project RDVS delivered in 2014, producing exterior renders of an apartment block under construction in Accra, showing its white modern facade, balconies and ground-floor parking from two street-facing angles.',
        specs: {
          client: 'Private Client',
          scope: 'RDVS delivered 3D architectural visualization: modeling the apartment block and its street setting and producing the two exterior rendered views.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'ndaba-restaurant-whm-plate1',
        title: 'Ndaba Restaurant, WHM',
        category: '3D Visualization — 2014',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ndaba-restaurant-whm/ndaba-restaurant-whm-1.jpg',
        imageUrlDesktop: 'assets/images/ndaba-restaurant-whm/ndaba-restaurant-whm-1.jpg',
        imageMobileUrl: 'assets/images/ndaba-restaurant-whm/ndaba-restaurant-whm-1.jpg',
        projectUrl: 'ndaba-restaurant-whm.html',
        desc: '',
        specs: {
          client: 'Architect Emmanuel Ampaabeng',
          scope: '3D Visualization, Modelling, Texturing, Rendering & Post-Processing (interior design by Architect Emmanuel Ampaabeng)',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2014',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'ndaba-restaurant-whm-plate2',
        title: 'Ndaba Restaurant, WHM',
        category: '3D Visualization — 2014',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ndaba-restaurant-whm/ndaba-restaurant-whm-4.jpg',
        imageUrlDesktop: 'assets/images/ndaba-restaurant-whm/ndaba-restaurant-whm-4.jpg',
        imageMobileUrl: 'assets/images/ndaba-restaurant-whm/ndaba-restaurant-whm-4.jpg',
        projectUrl: 'ndaba-restaurant-whm.html',
        desc: '',
        specs: {
          client: 'Architect Emmanuel Ampaabeng',
          scope: '3D Visualization, Modelling, Texturing, Rendering & Post-Processing (interior design by Architect Emmanuel Ampaabeng)',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2014',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'mtn-hq-plate1',
        title: 'MTN HQ',
        category: 'Graphic Design & 3D Visualization — 2017',
        service: 'Graphic Design & 3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/mtn-hq/mtn-hq-19.jpg',
        imageUrlDesktop: 'assets/images/mtn-hq/mtn-hq-19.jpg',
        imageMobileUrl: 'assets/images/mtn-hq/mtn-hq-19.jpg',
        projectUrl: 'mtn.html',
        desc: 'Environmental graphics and way-finding pitch for MTN House, Accra — a system built on the SIM card and paper-plane motif, explored through pictograms, signage, kiosks and 3D visualization.',
        specs: {
          client: 'James Cubitt',
          scope: 'Graphic Design, Environmental Graphics, Way-Finding & 3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Graphic Design\', \'3D Visualization\']'
        }
      },
      {
        id: 'mtn-hq-plate2',
        title: 'MTN HQ',
        category: 'Graphic Design & 3D Visualization — 2017',
        service: 'Graphic Design & 3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/mtn-hq/mtn-hq-20.jpg',
        imageUrlDesktop: 'assets/images/mtn-hq/mtn-hq-20.jpg',
        imageMobileUrl: 'assets/images/mtn-hq/mtn-hq-20.jpg',
        projectUrl: 'mtn.html',
        desc: 'Environmental graphics and way-finding pitch for MTN House, Accra — a system built on the SIM card and paper-plane motif, explored through pictograms, signage, kiosks and 3D visualization.',
        specs: {
          client: 'James Cubitt',
          scope: 'Graphic Design, Environmental Graphics, Way-Finding & 3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Graphic Design\', \'3D Visualization\']'
        }
      },
      {
        id: 'maurice-abena-plate1',
        title: 'Maurice + Abena',
        category: 'Graphic Design — 2013',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/maurice-abena/maurice-abena-1.jpg',
        imageUrlDesktop: 'assets/images/maurice-abena/maurice-abena-1.jpg',
        imageMobileUrl: 'assets/images/maurice-abena/maurice-abena-1.jpg',
        projectUrl: 'maurice-abena.html',
        desc: 'Wedding invitation and programme for Maurice Abbey and Abena Asante, built on a script logotype drawn from scratch and a pair of gold bands knotted onto a length of rope.',
        specs: {
          client: 'Maurice Abbey & Abena Asante',
          scope: 'Graphic Design, Illustration, Digital Art & Print',
          team: 'Randy Biney',
          year: '2013',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'maurice-abena-plate2',
        title: 'Maurice + Abena',
        category: 'Graphic Design — 2013',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/maurice-abena/maurice-abena-2.jpg',
        imageUrlDesktop: 'assets/images/maurice-abena/maurice-abena-2.jpg',
        imageMobileUrl: 'assets/images/maurice-abena/maurice-abena-2.jpg',
        projectUrl: 'maurice-abena.html',
        desc: 'Wedding invitation and programme for Maurice Abbey and Abena Asante, built on a script logotype drawn from scratch and a pair of gold bands knotted onto a length of rope.',
        specs: {
          client: 'Maurice Abbey & Abena Asante',
          scope: 'Graphic Design, Illustration, Digital Art & Print',
          team: 'Randy Biney',
          year: '2013',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'marble-bath-plate1',
        title: 'Marble & Bath',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/marble-bath/marble-bath-2.jpg',
        imageUrlDesktop: 'assets/images/marble-bath/marble-bath-2.jpg',
        imageMobileUrl: 'assets/images/marble-bath/marble-bath-2.jpg',
        projectUrl: 'marble-bath.html',
        desc: 'Four interior visualizations of a master bathroom, made in 2015 for a project by Mobius Architecture. Samuel Adabi designed both the interior and the building; RDVS Studios modelled, shaded, lit, rendered and post-processed the views.',
        specs: {
          client: 'Samuel Adabi / Mobius Architecture',
          scope: '3D Visualization, Modelling, Shading & Texturing, Lighting, Rendering & Post-Processing (interior design and architecture by Samuel Adabi / Mobius Architecture)',
          team: 'R.D+V.S (Revival Design + VFX Studios)',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'marble-bath-plate2',
        title: 'Marble & Bath',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/marble-bath/marble-bath-3.jpg',
        imageUrlDesktop: 'assets/images/marble-bath/marble-bath-3.jpg',
        imageMobileUrl: 'assets/images/marble-bath/marble-bath-3.jpg',
        projectUrl: 'marble-bath.html',
        desc: 'Four interior visualizations of a master bathroom, made in 2015 for a project by Mobius Architecture. Samuel Adabi designed both the interior and the building; RDVS Studios modelled, shaded, lit, rendered and post-processed the views.',
        specs: {
          client: 'Samuel Adabi / Mobius Architecture',
          scope: '3D Visualization, Modelling, Shading & Texturing, Lighting, Rendering & Post-Processing (interior design and architecture by Samuel Adabi / Mobius Architecture)',
          team: 'R.D+V.S (Revival Design + VFX Studios)',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'map-folder-design-plate1',
        title: 'MAP',
        category: 'Graphic Design — 2012',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/map-folder-design/map-folder-design-1.jpg',
        imageUrlDesktop: 'assets/images/map-folder-design/map-folder-design-1.jpg',
        imageMobileUrl: 'assets/images/map-folder-design/map-folder-design-1.jpg',
        projectUrl: 'map-folder-design.html',
        desc: 'A 2012 graphic design job for MAP: RDVS Studios took the company s logo apart and rebuilt it as an A5 folder for inserts, presenting three fully resolved options, each laid out on its own grey presentation board.',
        specs: {
          client: 'MAP',
          scope: 'Print and packaging design: three deconstructed-logo concepts for an A5 insert folder, each resolved as a presentation board with its own construction formula.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'map-folder-design-plate2',
        title: 'MAP',
        category: 'Graphic Design — 2012',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/map-folder-design/map-folder-design-2.jpg',
        imageUrlDesktop: 'assets/images/map-folder-design/map-folder-design-2.jpg',
        imageMobileUrl: 'assets/images/map-folder-design/map-folder-design-2.jpg',
        projectUrl: 'map-folder-design.html',
        desc: 'A 2012 graphic design job for MAP: RDVS Studios took the company s logo apart and rebuilt it as an A5 folder for inserts, presenting three fully resolved options, each laid out on its own grey presentation board.',
        specs: {
          client: 'MAP',
          scope: 'Print and packaging design: three deconstructed-logo concepts for an A5 insert folder, each resolved as a presentation board with its own construction formula.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'map-folder-design-plate3',
        title: 'MAP',
        category: 'Graphic Design — 2012',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/map-folder-design/map-folder-design-3.jpg',
        imageUrlDesktop: 'assets/images/map-folder-design/map-folder-design-3.jpg',
        imageMobileUrl: 'assets/images/map-folder-design/map-folder-design-3.jpg',
        projectUrl: 'map-folder-design.html',
        desc: 'A 2012 graphic design job for MAP: RDVS Studios took the company s logo apart and rebuilt it as an A5 folder for inserts, presenting three fully resolved options, each laid out on its own grey presentation board.',
        specs: {
          client: 'MAP',
          scope: 'Print and packaging design: three deconstructed-logo concepts for an A5 insert folder, each resolved as a presentation board with its own construction formula.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'mankata-plate1',
        title: 'Mankata',
        category: 'Architectural Visualization — 2012',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/mankata/mankata-1.jpg',
        imageUrlDesktop: 'assets/images/mankata/mankata-1.jpg',
        imageMobileUrl: 'assets/images/mankata/mankata-1.jpg',
        projectUrl: 'mankata.html',
        desc: 'A single exterior visualization made in 2012 for Mankata Apartments in Accra, a late afternoon view across the lawn at a white residential block with a glazed entrance portal, with architecture by Arch Xenu and 3D visualization by RDVS Studio.',
        specs: {
          client: 'Private Client',
          scope: 'Exterior 3D visualization: camera and composition studies, material and colour assignment, daylight setup and one finished marketing render.',
          team: 'RDVS. DESIGN',
          year: '2012',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'lase-icon-plate1',
        title: 'Lase',
        category: 'Art — 2014',
        service: 'Art',
        discipline: 'vfx',
        imageUrl: 'assets/images/lase-icon/lase-icon-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/lase-icon/lase-icon-1-desktop.jpg',
        imageMobileUrl: 'assets/images/lase-icon/lase-icon-1-desktop.jpg',
        projectUrl: 'lase-icon.html',
        desc: 'An icon for Lase, a piece of software: a point-of-sale terminal drawn as one glossy 3D illustration and produced in two colourways.',
        specs: {
          client: 'Dela Anyaa',
          scope: 'Icon & Logo Design, Digital Illustration',
          team: 'Kofi Tetteh (Concept + Design)',
          year: '2014',
          disciplines: '[\'Art\']'
        }
      },
      {
        id: 'lase-icon-plate2',
        title: 'Lase',
        category: 'Art — 2014',
        service: 'Art',
        discipline: 'vfx',
        imageUrl: 'assets/images/lase-icon/lase-icon-1.jpg',
        imageUrlDesktop: 'assets/images/lase-icon/lase-icon-1-desktop.jpg',
        imageMobileUrl: 'assets/images/lase-icon/lase-icon-1-desktop.jpg',
        projectUrl: 'lase-icon.html',
        desc: 'An icon for Lase, a piece of software: a point-of-sale terminal drawn as one glossy 3D illustration and produced in two colourways.',
        specs: {
          client: 'Dela Anyaa',
          scope: 'Icon & Logo Design, Digital Illustration',
          team: 'Kofi Tetteh (Concept + Design)',
          year: '2014',
          disciplines: '[\'Art\']'
        }
      },
      {
        id: 'kdmrd-plate1',
        title: 'KDMRD',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/kdmrd/kdmrd-hero.jpg',
        imageUrlDesktop: 'assets/images/kdmrd/kdmrd-hero.jpg',
        imageMobileUrl: 'assets/images/kdmrd/kdmrd-hero.jpg',
        projectUrl: 'kdmrd.html',
        desc: 'KDMRD is a 3D visualization study RDVS produced in 2017 for an unidentified client, presenting a bold red cubic building through exterior renders and one shaded courtyard view that show its perforated facade and public landscaped setting.',
        specs: {
          client: 'Private Client',
          scope: 'RDVS delivered 3D architectural visualization: modeling the building and its setting, designing the facade screen and lighting, and producing the rendered exterior and courtyard views.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'kdmrd-plate2',
        title: 'KDMRD',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/kdmrd/kdmrd-1.jpg',
        imageUrlDesktop: 'assets/images/kdmrd/kdmrd-1.jpg',
        imageMobileUrl: 'assets/images/kdmrd/kdmrd-1.jpg',
        projectUrl: 'kdmrd.html',
        desc: 'KDMRD is a 3D visualization study RDVS produced in 2017 for an unidentified client, presenting a bold red cubic building through exterior renders and one shaded courtyard view that show its perforated facade and public landscaped setting.',
        specs: {
          client: 'Private Client',
          scope: 'RDVS delivered 3D architectural visualization: modeling the building and its setting, designing the facade screen and lighting, and producing the rendered exterior and courtyard views.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'kdmrd-plate3',
        title: 'KDMRD',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/kdmrd/kdmrd-2.jpg',
        imageUrlDesktop: 'assets/images/kdmrd/kdmrd-2.jpg',
        imageMobileUrl: 'assets/images/kdmrd/kdmrd-2.jpg',
        projectUrl: 'kdmrd.html',
        desc: 'KDMRD is a 3D visualization study RDVS produced in 2017 for an unidentified client, presenting a bold red cubic building through exterior renders and one shaded courtyard view that show its perforated facade and public landscaped setting.',
        specs: {
          client: 'Private Client',
          scope: 'RDVS delivered 3D architectural visualization: modeling the building and its setting, designing the facade screen and lighting, and producing the rendered exterior and courtyard views.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'jhk-investment-plate1',
        title: 'JHK',
        category: 'Architectural Visualization — 2011',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/jhk-investment/jhk-investment-1.jpg',
        imageUrlDesktop: 'assets/images/jhk-investment/jhk-investment-1.jpg',
        imageMobileUrl: 'assets/images/jhk-investment/jhk-investment-1.jpg',
        projectUrl: 'jhk-investment.html',
        desc: 'JHK is an architectural visualization project RDVS produced in 2011 for JHK Investments, presenting several modern one- and two-storey houses through exterior renders that model, texture and light the homes and their landscaped gardens.',
        specs: {
          client: 'JHK Investments',
          scope: 'RDVS delivered 3D architectural visualization only: modeling, texturing, lighting, rendering and post-production of the exterior images, using SketchUp, V-Ray and Photoshop.',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'jhk-investment-plate2',
        title: 'JHK',
        category: 'Architectural Visualization — 2011',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/jhk-investment/jhk-investment-2.jpg',
        imageUrlDesktop: 'assets/images/jhk-investment/jhk-investment-2.jpg',
        imageMobileUrl: 'assets/images/jhk-investment/jhk-investment-2.jpg',
        projectUrl: 'jhk-investment.html',
        desc: 'JHK is an architectural visualization project RDVS produced in 2011 for JHK Investments, presenting several modern one- and two-storey houses through exterior renders that model, texture and light the homes and their landscaped gardens.',
        specs: {
          client: 'JHK Investments',
          scope: 'RDVS delivered 3D architectural visualization only: modeling, texturing, lighting, rendering and post-production of the exterior images, using SketchUp, V-Ray and Photoshop.',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'jhk-investment-plate3',
        title: 'JHK',
        category: 'Architectural Visualization — 2011',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/jhk-investment/jhk-investment-3.jpg',
        imageUrlDesktop: 'assets/images/jhk-investment/jhk-investment-3.jpg',
        imageMobileUrl: 'assets/images/jhk-investment/jhk-investment-3.jpg',
        projectUrl: 'jhk-investment.html',
        desc: 'JHK is an architectural visualization project RDVS produced in 2011 for JHK Investments, presenting several modern one- and two-storey houses through exterior renders that model, texture and light the homes and their landscaped gardens.',
        specs: {
          client: 'JHK Investments',
          scope: 'RDVS delivered 3D architectural visualization only: modeling, texturing, lighting, rendering and post-production of the exterior images, using SketchUp, V-Ray and Photoshop.',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'hvl-plate1',
        title: 'HVL',
        category: 'Graphic Design — 2011',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/hvl/hvl-1.jpg',
        imageUrlDesktop: 'assets/images/hvl/hvl-1.jpg',
        imageMobileUrl: 'assets/images/hvl/hvl-1.jpg',
        projectUrl: 'hvl.html',
        desc: 'A two-spread brochure designed in 2011 for Hili View Lodge, a hillside guest lodge at Aburi, laying out the cover, the welcome page and the services, facilities, rooms and location columns as graphic design by RDVS Studio.',
        specs: {
          client: 'Hili View Lodge',
          scope: 'Brochure design and layout: cover and typographic identity, photograph selection and placement, and the typesetting of the services, facilities, rooms and location columns.',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'hvl-plate2',
        title: 'HVL',
        category: 'Graphic Design — 2011',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/hvl/hvl-2.jpg',
        imageUrlDesktop: 'assets/images/hvl/hvl-2.jpg',
        imageMobileUrl: 'assets/images/hvl/hvl-2.jpg',
        projectUrl: 'hvl.html',
        desc: 'A two-spread brochure designed in 2011 for Hili View Lodge, a hillside guest lodge at Aburi, laying out the cover, the welcome page and the services, facilities, rooms and location columns as graphic design by RDVS Studio.',
        specs: {
          client: 'Hili View Lodge',
          scope: 'Brochure design and layout: cover and typographic identity, photograph selection and placement, and the typesetting of the services, facilities, rooms and location columns.',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'haustalks-plate1',
        title: 'Haustalks',
        category: 'Graphic Design — 2019',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/haustalks/haustalks-1.jpg',
        imageUrlDesktop: 'assets/images/haustalks/haustalks-1.jpg',
        imageMobileUrl: 'assets/images/haustalks/haustalks-1.jpg',
        projectUrl: 'haustalks.html',
        desc: 'Identity and campaign plates for Haustalks, an advice service that connects a client with a named building professional — a red speech-bubble monogram set into rendered scenes of steel and of stone.',
        specs: {
          client: 'Haustalks',
          scope: 'Brand Identity, Graphic Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2019',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'haustalks-plate2',
        title: 'Haustalks',
        category: 'Graphic Design — 2019',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/haustalks/haustalks-2.jpg',
        imageUrlDesktop: 'assets/images/haustalks/haustalks-2.jpg',
        imageMobileUrl: 'assets/images/haustalks/haustalks-2.jpg',
        projectUrl: 'haustalks.html',
        desc: 'Identity and campaign plates for Haustalks, an advice service that connects a client with a named building professional — a red speech-bubble monogram set into rendered scenes of steel and of stone.',
        specs: {
          client: 'Haustalks',
          scope: 'Brand Identity, Graphic Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2019',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'ghana-bbq-beer-festival-plate1',
        title: 'Ghana BBQ & Beer Festival',
        category: 'Graphic Design — 2017',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/ghana-bbq-beer-festival/ghana-bbq-beer-festival-1.jpg',
        imageUrlDesktop: 'assets/images/ghana-bbq-beer-festival/ghana-bbq-beer-festival-1.jpg',
        imageMobileUrl: 'assets/images/ghana-bbq-beer-festival/ghana-bbq-beer-festival-1.jpg',
        projectUrl: 'ghana-bbq-beer-festival.html',
        desc: 'Event poster for a barbecue and beer festival at Bermuda Gardens, Accra — a mustard A4 sheet torn open onto a white-lined street plan, with the title set in a face whose letters are themselves torn.',
        specs: {
          client: 'Private Client',
          scope: 'Graphic Design & Digital Art',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'ghana-bbq-beer-festival-plate2',
        title: 'Ghana BBQ & Beer Festival',
        category: 'Graphic Design — 2017',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/ghana-bbq-beer-festival/ghana-bbq-beer-festival-2.jpg',
        imageUrlDesktop: 'assets/images/ghana-bbq-beer-festival/ghana-bbq-beer-festival-2.jpg',
        imageMobileUrl: 'assets/images/ghana-bbq-beer-festival/ghana-bbq-beer-festival-2.jpg',
        projectUrl: 'ghana-bbq-beer-festival.html',
        desc: 'Event poster for a barbecue and beer festival at Bermuda Gardens, Accra — a mustard A4 sheet torn open onto a white-lined street plan, with the title set in a face whose letters are themselves torn.',
        specs: {
          client: 'Private Client',
          scope: 'Graphic Design & Digital Art',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'gh-phot-awards-plate1',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-2.jpg',
        imageUrlDesktop: 'assets/images/gh-phot-awards/gh-phot-awards-2.jpg',
        imageMobileUrl: 'assets/images/gh-phot-awards/gh-phot-awards-2.jpg',
        projectUrl: 'gh-phot-awards.html',
        desc: 'Industrial design, 3D visualization and motion design for the Gh Photography Awards ceremony completed in 2016.',
        specs: {
          client: 'Private Client',
          scope: 'Industrial Design, 3D Visualization, Motion Design',
          team: 'RDVS Team',
          year: '2016',
          disciplines: '[\'Industrial Design\', \'3D Visualization\', \'Motion Design\']'
        }
      },
      {
        id: 'gh-phot-awards-plate2',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-3.jpg',
        imageUrlDesktop: 'assets/images/gh-phot-awards/gh-phot-awards-3.jpg',
        imageMobileUrl: 'assets/images/gh-phot-awards/gh-phot-awards-3.jpg',
        projectUrl: 'gh-phot-awards.html',
        desc: 'Industrial design, 3D visualization and motion design for the Gh Photography Awards ceremony completed in 2016.',
        specs: {
          client: 'Private Client',
          scope: 'Industrial Design, 3D Visualization, Motion Design',
          team: 'RDVS Team',
          year: '2016',
          disciplines: '[\'Industrial Design\', \'3D Visualization\', \'Motion Design\']'
        }
      },
      {
        id: 'fule-plate1',
        title: 'Fule',
        category: 'Architectural Visualization — 2013',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/fule/fule-1.jpg',
        imageUrlDesktop: 'assets/images/fule/fule-1.jpg',
        imageMobileUrl: 'assets/images/fule/fule-1.jpg',
        projectUrl: 'fule.html',
        desc: 'Eight architectural visualization plates from 2013 for a private duplex in Accra, made by RDVS. Design: street and courtyard exteriors, then bedroom, kitchen and living room interiors in warm oak and pale neutrals.',
        specs: {
          client: 'Fule Badoe',
          scope: '3D architectural visualization: exterior street, courtyard and garden views, plus interior renders of the bedroom, kitchen and two living spaces.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'fule-plate2',
        title: 'Fule',
        category: 'Architectural Visualization — 2013',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/fule/fule-2.jpg',
        imageUrlDesktop: 'assets/images/fule/fule-2.jpg',
        imageMobileUrl: 'assets/images/fule/fule-2.jpg',
        projectUrl: 'fule.html',
        desc: 'Eight architectural visualization plates from 2013 for a private duplex in Accra, made by RDVS. Design: street and courtyard exteriors, then bedroom, kitchen and living room interiors in warm oak and pale neutrals.',
        specs: {
          client: 'Fule Badoe',
          scope: '3D architectural visualization: exterior street, courtyard and garden views, plus interior renders of the bedroom, kitchen and two living spaces.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'fule-plate3',
        title: 'Fule',
        category: 'Architectural Visualization — 2013',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/fule/fule-3.jpg',
        imageUrlDesktop: 'assets/images/fule/fule-3.jpg',
        imageMobileUrl: 'assets/images/fule/fule-3.jpg',
        projectUrl: 'fule.html',
        desc: 'Eight architectural visualization plates from 2013 for a private duplex in Accra, made by RDVS. Design: street and courtyard exteriors, then bedroom, kitchen and living room interiors in warm oak and pale neutrals.',
        specs: {
          client: 'Fule Badoe',
          scope: '3D architectural visualization: exterior street, courtyard and garden views, plus interior renders of the bedroom, kitchen and two living spaces.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'elo-identity-plate1',
        title: 'ELO Identity',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/elo-identity/elo-identity-6.jpg',
        imageUrlDesktop: 'assets/images/elo-identity/elo-identity-6.jpg',
        imageMobileUrl: 'assets/images/elo-identity/elo-identity-6.jpg',
        projectUrl: 'elo-identity.html',
        desc: 'A full graphic and brand identity for the Exceed League Organisation, delivered by RDVS. Design in 2015: logotype and concept plates, a colour and type system, business card, letterhead and a desktop wallpaper.',
        specs: {
          client: 'Exceed League Organisation',
          scope: 'Identity design: concept development, logotype and lockup variations, colour palette and corporate typeface specification, business card design with colour variants, letterhead, and a branded desktop wallpaper.',
          team: 'RDVS. DESIGN',
          year: '2015',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'elo-identity-plate2',
        title: 'ELO Identity',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/elo-identity/elo-identity-1.jpg',
        imageUrlDesktop: 'assets/images/elo-identity/elo-identity-1.jpg',
        imageMobileUrl: 'assets/images/elo-identity/elo-identity-1.jpg',
        projectUrl: 'elo-identity.html',
        desc: 'A full graphic and brand identity for the Exceed League Organisation, delivered by RDVS. Design in 2015: logotype and concept plates, a colour and type system, business card, letterhead and a desktop wallpaper.',
        specs: {
          client: 'Exceed League Organisation',
          scope: 'Identity design: concept development, logotype and lockup variations, colour palette and corporate typeface specification, business card design with colour variants, letterhead, and a branded desktop wallpaper.',
          team: 'RDVS. DESIGN',
          year: '2015',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'elo-identity-plate3',
        title: 'ELO Identity',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/elo-identity/elo-identity-2.jpg',
        imageUrlDesktop: 'assets/images/elo-identity/elo-identity-2.jpg',
        imageMobileUrl: 'assets/images/elo-identity/elo-identity-2.jpg',
        projectUrl: 'elo-identity.html',
        desc: 'A full graphic and brand identity for the Exceed League Organisation, delivered by RDVS. Design in 2015: logotype and concept plates, a colour and type system, business card, letterhead and a desktop wallpaper.',
        specs: {
          client: 'Exceed League Organisation',
          scope: 'Identity design: concept development, logotype and lockup variations, colour palette and corporate typeface specification, business card design with colour variants, letterhead, and a branded desktop wallpaper.',
          team: 'RDVS. DESIGN',
          year: '2015',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'drw-furnart-plate1',
        title: 'DRW Furnart',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/drw-furnart/drw-furnart-1.jpg',
        imageUrlDesktop: 'assets/images/drw-furnart/drw-furnart-1.jpg',
        imageMobileUrl: 'assets/images/drw-furnart/drw-furnart-1-mobile.jpg',
        projectUrl: 'drw-furnart.html',
        desc: 'A 2016 visualization set for Furnart: the furniture collection designed by DRW   Kuukuwa Manful and Emmanuel Sarpong   rendered both as isolated product studies and staged room by room in a single house interior.',
        specs: {
          client: 'DRW / Furnart',
          scope: '3D visualization of the DRW furniture collection: product studies and staged interior scenes',
          team: 'Kuukuwa Manful & Emmanuel Sarpong (furniture design, DRW); RDVS (3D visualization)',
          year: '2016',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'drw-furnart-plate2',
        title: 'DRW Furnart',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/drw-furnart/drw-furnart-2.jpg',
        imageUrlDesktop: 'assets/images/drw-furnart/drw-furnart-2.jpg',
        imageMobileUrl: 'assets/images/drw-furnart/drw-furnart-2.jpg',
        projectUrl: 'drw-furnart.html',
        desc: 'A 2016 visualization set for Furnart: the furniture collection designed by DRW   Kuukuwa Manful and Emmanuel Sarpong   rendered both as isolated product studies and staged room by room in a single house interior.',
        specs: {
          client: 'DRW / Furnart',
          scope: '3D visualization of the DRW furniture collection: product studies and staged interior scenes',
          team: 'Kuukuwa Manful & Emmanuel Sarpong (furniture design, DRW); RDVS (3D visualization)',
          year: '2016',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'details-film-plate1',
        title: 'Details',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-1.jpg',
        imageUrlDesktop: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-1.jpg',
        imageMobileUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-1.jpg',
        projectUrl: 'd-e-t-a-i-l-s.html',
        desc: 'A self-initiated film about the parts of an interior a walkthrough would rush past: the joint where a lamp stem meets its base, the way light sits inside a glass case, the edge of a paving slab against gravel.',
        specs: {
          client: 'RDVS Studios',
          scope: 'Self-initiated interior modelling, look-dev, lighting, rendering and edit',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'details-film-plate2',
        title: 'Details',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-2.jpg',
        imageUrlDesktop: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-2.jpg',
        imageMobileUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-2.jpg',
        projectUrl: 'd-e-t-a-i-l-s.html',
        desc: 'A self-initiated film about the parts of an interior a walkthrough would rush past: the joint where a lamp stem meets its base, the way light sits inside a glass case, the edge of a paving slab against gravel.',
        specs: {
          client: 'RDVS Studios',
          scope: 'Self-initiated interior modelling, look-dev, lighting, rendering and edit',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'dela-anyaa-plate1',
        title: 'Dela Anyaa',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/dela-anyaa/dela-anyaa-1.jpg',
        imageUrlDesktop: 'assets/images/dela-anyaa/dela-anyaa-1.jpg',
        imageMobileUrl: 'assets/images/dela-anyaa/dela-anyaa-1.jpg',
        projectUrl: 'dela-anyaa.html',
        desc: 'A personal identity for Dela Anyaa, built from two parts: a calligraphic mark rendered in polished chrome, and a hand-written signature used in place of a wordmark.',
        specs: {
          client: 'Dela Anyaa',
          scope: 'Graphic Design, Logo Design & Brand Identity',
          team: 'Kofi Tetteh (Concept + Design)',
          year: '2015',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'dela-anyaa-plate2',
        title: 'Dela Anyaa',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/dela-anyaa/dela-anyaa-2.jpg',
        imageUrlDesktop: 'assets/images/dela-anyaa/dela-anyaa-2.jpg',
        imageMobileUrl: 'assets/images/dela-anyaa/dela-anyaa-2.jpg',
        projectUrl: 'dela-anyaa.html',
        desc: 'A personal identity for Dela Anyaa, built from two parts: a calligraphic mark rendered in polished chrome, and a hand-written signature used in place of a wordmark.',
        specs: {
          client: 'Dela Anyaa',
          scope: 'Graphic Design, Logo Design & Brand Identity',
          team: 'Kofi Tetteh (Concept + Design)',
          year: '2015',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'daawat-sweets-plate1',
        title: 'Daawat Sweets',
        category: 'Architectural Visualization — 2013',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/daawat-sweets/daawat-sweets-1.jpg',
        imageUrlDesktop: 'assets/images/daawat-sweets/daawat-sweets-1.jpg',
        imageMobileUrl: 'assets/images/daawat-sweets/daawat-sweets-1.jpg',
        projectUrl: 'daawat-sweets.html',
        desc: 'Two interior visualizations from 2013 for Daawat Sweets, a sweet shop in Brampton, Ontario, Canada, showing the counter and refrigerated display-case hall, produced by RDVS as 3D renders for an interior design led by other studios.',
        specs: {
          client: 'Daawat Sweets',
          scope: 'Photorealistic 3D interior visualization of the shop counter and display-case areas.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'daawat-sweets-plate2',
        title: 'Daawat Sweets',
        category: 'Architectural Visualization — 2013',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/daawat-sweets/daawat-sweets-2.jpg',
        imageUrlDesktop: 'assets/images/daawat-sweets/daawat-sweets-2.jpg',
        imageMobileUrl: 'assets/images/daawat-sweets/daawat-sweets-2.jpg',
        projectUrl: 'daawat-sweets.html',
        desc: 'Two interior visualizations from 2013 for Daawat Sweets, a sweet shop in Brampton, Ontario, Canada, showing the counter and refrigerated display-case hall, produced by RDVS as 3D renders for an interior design led by other studios.',
        specs: {
          client: 'Daawat Sweets',
          scope: 'Photorealistic 3D interior visualization of the shop counter and display-case areas.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'la-palm-2008-christmas-party-posters-plate1',
        title: 'La Palm 2008 Christmas Party Poster',
        category: 'Graphic Design & Illustration — 2008',
        service: 'Graphic Design & Illustration',
        discipline: 'vfx',
        imageUrl: 'assets/images/la-palm/la-palm-1.jpg',
        imageUrlDesktop: 'assets/images/la-palm/la-palm-1.jpg',
        imageMobileUrl: 'assets/images/la-palm/la-palm-1.jpg',
        projectUrl: 'la-palm-2008-christmas-party-posters.html',
        desc: 'A single poster designed and illustrated in 2008 for La Palm Royal Beach Hotel, advertising the hotel’s children’s Christmas party on Boxing Day at Ghc 15.',
        specs: {
          client: 'La Palm Royal Beach Hotel',
          scope: 'Poster design and illustration for a single hotel event, with artwork prepared for print',
          team: 'RDVS Studios',
          year: '2008',
          disciplines: '[\'Graphic Design & Illustration\']'
        }
      },
      {
        id: 'college-invasion-plate1',
        title: 'College Invasion',
        category: 'Graphic Design — 2009',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/college-invasion/college-invasion-1.jpg',
        imageUrlDesktop: 'assets/images/college-invasion/college-invasion-1.jpg',
        imageMobileUrl: 'assets/images/college-invasion/college-invasion-1.jpg',
        projectUrl: 'college-invasion.html',
        desc: 'A single event poster designed in 2009 for Lockd Down Entertainment, promoting the College Invasion party at the Mirage Club in Osu, Accra, combining graphic design, illustration and typography for a youth nightlife promotion.',
        specs: {
          client: 'Lockd Down Entertainment',
          scope: 'Poster design and artwork preparation for a single nightlife event promotion.',
          team: 'RDVS. DESIGN',
          year: '2009',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'clairemont-plate1',
        title: 'Clairemont',
        category: 'Architectural Visualization & Graphic Design — 2011',
        service: 'Architectural Visualization & Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/clairemont/clairemont-1.jpg',
        imageUrlDesktop: 'assets/images/clairemont/clairemont-1.jpg',
        imageMobileUrl: 'assets/images/clairemont/clairemont-1.jpg',
        projectUrl: 'clairemont.html',
        desc: 'A seventeen-plate brochure RDVS. Design created in 2011 for an architecture firm marketing Clairemont, a contemporary apartment development in Accra, blending graphic design, wayfinding maps and furnished floor plans with architectural visualization renders.',
        specs: {
          client: 'Private Client',
          scope: 'Brochure design and layout, location map illustration, furnished floor plan presentation and architectural visualization for the Clairemont apartment development.',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: '[\'Architectural Visualization   Graphic Design\']'
        }
      },
      {
        id: 'clairemont-plate2',
        title: 'Clairemont',
        category: 'Architectural Visualization & Graphic Design — 2011',
        service: 'Architectural Visualization & Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/clairemont/clairemont-2.jpg',
        imageUrlDesktop: 'assets/images/clairemont/clairemont-2.jpg',
        imageMobileUrl: 'assets/images/clairemont/clairemont-2.jpg',
        projectUrl: 'clairemont.html',
        desc: 'A seventeen-plate brochure RDVS. Design created in 2011 for an architecture firm marketing Clairemont, a contemporary apartment development in Accra, blending graphic design, wayfinding maps and furnished floor plans with architectural visualization renders.',
        specs: {
          client: 'Private Client',
          scope: 'Brochure design and layout, location map illustration, furnished floor plan presentation and architectural visualization for the Clairemont apartment development.',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: '[\'Architectural Visualization   Graphic Design\']'
        }
      },
      {
        id: 'clairemont-plate3',
        title: 'Clairemont',
        category: 'Architectural Visualization & Graphic Design — 2011',
        service: 'Architectural Visualization & Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/clairemont/clairemont-3.jpg',
        imageUrlDesktop: 'assets/images/clairemont/clairemont-3.jpg',
        imageMobileUrl: 'assets/images/clairemont/clairemont-3.jpg',
        projectUrl: 'clairemont.html',
        desc: 'A seventeen-plate brochure RDVS. Design created in 2011 for an architecture firm marketing Clairemont, a contemporary apartment development in Accra, blending graphic design, wayfinding maps and furnished floor plans with architectural visualization renders.',
        specs: {
          client: 'Private Client',
          scope: 'Brochure design and layout, location map illustration, furnished floor plan presentation and architectural visualization for the Clairemont apartment development.',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: '[\'Architectural Visualization   Graphic Design\']'
        }
      },
      {
        id: 'chocolate-plate1',
        title: 'Chocolate',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/chocolate/chocolate-2.jpg',
        imageUrlDesktop: 'assets/images/chocolate/chocolate-2.jpg',
        imageMobileUrl: 'assets/images/chocolate/chocolate-2.jpg',
        projectUrl: 'chocolate.html',
        desc: 'Logo design for Chocolate by Kwaku Bediako, a fashion design house in Ghana — a dripping C monogram drawn from a couturier’s dress form, paired with a script wordmark, a winged badge variant, a corporate typeface, stationery, and the badge cast as metal hardware on the house’s footwear and leatherwear.',
        specs: {
          client: 'Chocolate by Kwaku Bediako',
          scope: 'Logo Design, Brand Identity, Corporate Typeface, Stationery & Application',
          team: 'RDVS Team',
          year: '2014',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'chocolate-plate2',
        title: 'Chocolate',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/chocolate/chocolate-3.jpg',
        imageUrlDesktop: 'assets/images/chocolate/chocolate-3.jpg',
        imageMobileUrl: 'assets/images/chocolate/chocolate-3.jpg',
        projectUrl: 'chocolate.html',
        desc: 'Logo design for Chocolate by Kwaku Bediako, a fashion design house in Ghana — a dripping C monogram drawn from a couturier’s dress form, paired with a script wordmark, a winged badge variant, a corporate typeface, stationery, and the badge cast as metal hardware on the house’s footwear and leatherwear.',
        specs: {
          client: 'Chocolate by Kwaku Bediako',
          scope: 'Logo Design, Brand Identity, Corporate Typeface, Stationery & Application',
          team: 'RDVS Team',
          year: '2014',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'beautiful-choices-anim-plate1',
        title: 'Beautiful Choices',
        category: '3D Visualization — 2014',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/beautiful-choices/beautiful-choices-1.jpg',
        imageUrlDesktop: 'assets/images/beautiful-choices/beautiful-choices-1.jpg',
        imageMobileUrl: 'assets/images/beautiful-choices/beautiful-choices-1.jpg',
        projectUrl: 'beautiful-choices.html',
        desc: 'Rendering and animation for a poster series designed by Dela Anyaa — five colourways of the same sheet modelled as printed panels and fanned through a seamless white set.',
        specs: {
          client: 'Dela Anyaa',
          scope: '3D Modelling, Animation, Rendering, Post Processing & Compositing',
          team: 'Concept: Dela Anyaa | Modelling + Animation + Rendering: Jude Nyoagbe | Post Processing + Compositing: Randy Biney',
          year: '2014',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'baobab-hotel-exteriors-plate1',
        title: 'Baobab Hotel - Exteriors',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-1.jpg',
        imageUrlDesktop: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-1.jpg',
        imageMobileUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-1.jpg',
        projectUrl: 'baobab-hotel-exteriors.html',
        desc: 'Exterior visualizations of the Baobab Airport Hotel in Accra for architect Theodore Kanyi \\u2014 the tower modelled in 3D and composited into photographed day and night plates of the street, closing on the rooftop pool and bar at dusk.',
        specs: {
          client: 'Architect Theodore Kanyi',
          scope: '3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2016',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'baobab-hotel-exteriors-plate2',
        title: 'Baobab Hotel - Exteriors',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-2.jpg',
        imageUrlDesktop: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-2.jpg',
        imageMobileUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-2.jpg',
        projectUrl: 'baobab-hotel-exteriors.html',
        desc: 'Exterior visualizations of the Baobab Airport Hotel in Accra for architect Theodore Kanyi \\u2014 the tower modelled in 3D and composited into photographed day and night plates of the street, closing on the rooftop pool and bar at dusk.',
        specs: {
          client: 'Architect Theodore Kanyi',
          scope: '3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2016',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'ameyaw-sarah-gif',
        title: 'Ameyaw + Sarah',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/ameyaw-sarah/ameyaw-sarah-1.jpg',
        imageUrlDesktop: 'assets/images/ameyaw-sarah/ameyaw-sarah-1.jpg',
        imageMobileUrl: 'assets/images/ameyaw-sarah/ameyaw-sarah-1-mobile.jpg',
        projectUrl: 'ameyaw-sarah.html',
        desc: 'Invitation for an Akan customary marriage \\u2014 the adinkra symbol Me Ware Wo redrawn from the couple\\u2019s initials as a four-lobed monogram, laid over a kente weave built from minute S and A letterforms, with an adinkra legend driving the directions map.',
        specs: {
          client: 'Ameyaw Mensah & Sarah Amoabeng',
          scope: 'Graphic Design, Illustration & Print',
          team: 'Randy Biney, Jude Nyoagbe',
          year: '2014',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'ameyaw-sarah-plate1',
        title: 'Ameyaw + Sarah',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/ameyaw-sarah/ameyaw-sarah-2.gif',
        imageUrlDesktop: 'assets/images/ameyaw-sarah/ameyaw-sarah-2.gif',
        imageMobileUrl: 'assets/images/ameyaw-sarah/ameyaw-sarah-2.gif',
        projectUrl: 'ameyaw-sarah.html',
        desc: 'Invitation for an Akan customary marriage \\u2014 the adinkra symbol Me Ware Wo redrawn from the couple\\u2019s initials as a four-lobed monogram, laid over a kente weave built from minute S and A letterforms, with an adinkra legend driving the directions map.',
        specs: {
          client: 'Ameyaw Mensah & Sarah Amoabeng',
          scope: 'Graphic Design, Illustration & Print',
          team: 'Randy Biney, Jude Nyoagbe',
          year: '2014',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'akyea-residence-plate1',
        title: 'Akyea Residence',
        category: 'Architectural Visualization — 2014',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/akyea-residence/akyea-residence-1.jpg',
        imageUrlDesktop: 'assets/images/akyea-residence/akyea-residence-1.jpg',
        imageMobileUrl: 'assets/images/akyea-residence/akyea-residence-1.jpg',
        projectUrl: 'akyea-residence.html',
        desc: 'A 2014 set of 3D exterior visualizations for a private single-story residence in Ghana, in which RDVS Studios presented the house s angular roofs, timber pergolas and bold red accent walls from several garden approaches.',
        specs: {
          client: 'Private Client',
          scope: '3D exterior visualization of the residence, rendered from several garden approaches to present the architecture and landscaping.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'akyea-residence-plate2',
        title: 'Akyea Residence',
        category: 'Architectural Visualization — 2014',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/akyea-residence/akyea-residence-2.jpg',
        imageUrlDesktop: 'assets/images/akyea-residence/akyea-residence-2.jpg',
        imageMobileUrl: 'assets/images/akyea-residence/akyea-residence-2.jpg',
        projectUrl: 'akyea-residence.html',
        desc: 'A 2014 set of 3D exterior visualizations for a private single-story residence in Ghana, in which RDVS Studios presented the house s angular roofs, timber pergolas and bold red accent walls from several garden approaches.',
        specs: {
          client: 'Private Client',
          scope: '3D exterior visualization of the residence, rendered from several garden approaches to present the architecture and landscaping.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'akyea-residence-plate3',
        title: 'Akyea Residence',
        category: 'Architectural Visualization — 2014',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/akyea-residence/akyea-residence-3.jpg',
        imageUrlDesktop: 'assets/images/akyea-residence/akyea-residence-3.jpg',
        imageMobileUrl: 'assets/images/akyea-residence/akyea-residence-3.jpg',
        projectUrl: 'akyea-residence.html',
        desc: 'A 2014 set of 3D exterior visualizations for a private single-story residence in Ghana, in which RDVS Studios presented the house s angular roofs, timber pergolas and bold red accent walls from several garden approaches.',
        specs: {
          client: 'Private Client',
          scope: '3D exterior visualization of the residence, rendered from several garden approaches to present the architecture and landscaping.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'airport-hills-residence-plate1',
        title: 'Airport Hills Residence',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/airport-hills-residence/airport-hills-residence-1.jpg',
        imageUrlDesktop: 'assets/images/airport-hills-residence/airport-hills-residence-1.jpg',
        imageMobileUrl: 'assets/images/airport-hills-residence/airport-hills-residence-1.jpg',
        projectUrl: 'airport-hills-residence.html',
        desc: 'Exterior renderings for a family house in Airport Hills, Accra   modelled and lit by RDVS from a design by Imperial Homes.',
        specs: {
          client: 'Imperial Homes',
          scope: '3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'airport-hills-residence-plate2',
        title: 'Airport Hills Residence',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/airport-hills-residence/airport-hills-residence-2.jpg',
        imageUrlDesktop: 'assets/images/airport-hills-residence/airport-hills-residence-2.jpg',
        imageMobileUrl: 'assets/images/airport-hills-residence/airport-hills-residence-2.jpg',
        projectUrl: 'airport-hills-residence.html',
        desc: 'Exterior renderings for a family house in Airport Hills, Accra   modelled and lit by RDVS from a design by Imperial Homes.',
        specs: {
          client: 'Imperial Homes',
          scope: '3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'adolph-s-wedding-invite-plate1',
        title: 'Adolph\'s Wedding Invite',
        category: 'Graphic Design — 2018',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/adolph-s-wedding-invite/adolph-s-wedding-invite-1.jpg',
        imageUrlDesktop: 'assets/images/adolph-s-wedding-invite/adolph-s-wedding-invite-1.jpg',
        imageMobileUrl: 'assets/images/adolph-s-wedding-invite/adolph-s-wedding-invite-1.jpg',
        projectUrl: 'adolph-s-wedding-invite.html',
        desc: 'Wedding invitation for Adolph Kwabla Amevor and Theresah Korkor Boatey, built on one device — the couple\'s initials joined into a single stacked letterform and cut in gold over washed white lilies.',
        specs: {
          client: 'Adolph Kwabla Amevor & Theresah Korkor Boatey',
          scope: 'Graphic Design, Lettering & Print',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'adolph-s-wedding-invite-plate2',
        title: 'Adolph\'s Wedding Invite',
        category: 'Graphic Design — 2018',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/adolph-s-wedding-invite/adolph-s-wedding-invite-2.jpg',
        imageUrlDesktop: 'assets/images/adolph-s-wedding-invite/adolph-s-wedding-invite-2.jpg',
        imageMobileUrl: 'assets/images/adolph-s-wedding-invite/adolph-s-wedding-invite-2.jpg',
        projectUrl: 'adolph-s-wedding-invite.html',
        desc: 'Wedding invitation for Adolph Kwabla Amevor and Theresah Korkor Boatey, built on one device — the couple\'s initials joined into a single stacked letterform and cut in gold over washed white lilies.',
        specs: {
          client: 'Adolph Kwabla Amevor & Theresah Korkor Boatey',
          scope: 'Graphic Design, Lettering & Print',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'adolph-s-wedding-invite-plate3',
        title: 'Adolph\'s Wedding Invite',
        category: 'Graphic Design — 2018',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/adolph-s-wedding-invite/adolph-s-wedding-invite-3.jpg',
        imageUrlDesktop: 'assets/images/adolph-s-wedding-invite/adolph-s-wedding-invite-3.jpg',
        imageMobileUrl: 'assets/images/adolph-s-wedding-invite/adolph-s-wedding-invite-3.jpg',
        projectUrl: 'adolph-s-wedding-invite.html',
        desc: 'Wedding invitation for Adolph Kwabla Amevor and Theresah Korkor Boatey, built on one device — the couple\'s initials joined into a single stacked letterform and cut in gold over washed white lilies.',
        specs: {
          client: 'Adolph Kwabla Amevor & Theresah Korkor Boatey',
          scope: 'Graphic Design, Lettering & Print',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'aces-re-up-plate1',
        title: 'Aces Re-Up',
        category: 'Graphic Design — 2013',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/aces-re-up/aces-re-up-1.jpg',
        imageUrlDesktop: 'assets/images/aces-re-up/aces-re-up-1.jpg',
        imageMobileUrl: 'assets/images/aces-re-up/aces-re-up-1.jpg',
        projectUrl: 'aces-re-up.html',
        desc: 'A graphic design commission: RDVS Studios made the key art for Aces Re-Up, a poster for an Accra event organizer s party night, first produced for a 2009 event and published to the studio s portfolio in 2013.',
        specs: {
          client: 'Private Client',
          scope: 'Poster concept, 3D lettering and illustrated artwork for a single event poster.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: '94-laurel-cgi-plate1',
        title: '94 Laurel',
        category: 'VFX + CGI — 2013',
        service: 'VFX + CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/94-laurel/94-laurel-2.jpg',
        imageUrlDesktop: 'assets/images/94-laurel/94-laurel-2.jpg',
        imageMobileUrl: 'assets/images/94-laurel/94-laurel-2.jpg',
        projectUrl: '94-laurel.html',
        desc: 'High-fidelity photorealistic CGI rendering for a residential estate in Laurel, Canada, executing high-precision 3D modeling, texturing, material shading, ray-traced lighting, and post-processing.',
        specs: {
          client: 'Brent Hughes',
          scope: '3D Modeling, Texturing, Shading, Rendering & Post-Processing',
          team: 'Modelling: Jude Abbey, James Dapaah, Jude Nyoagbe | Texturing + Rendering + Post Processing: Jude Nyoagbe',
          year: '2013',
          disciplines: '[\'VFX + CGI\']'
        }
      },
      {
        id: '2gs-plate1',
        title: '2GS',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/2gs/2gs-1.jpg',
        imageUrlDesktop: 'assets/images/2gs/2gs-1.jpg',
        imageMobileUrl: 'assets/images/2gs/2gs-1.jpg',
        projectUrl: '2gs.html',
        desc: 'A 2015 identity for 2GS Construction + Logistics: a monogram built from the idea of the collective, carried from pencil construction studies through stationery, business cards, letterheads and concrete signage.',
        specs: {
          client: '2GS Construction + Logistics',
          scope: 'Identity and branding: monogram and lockups, labyrinth motif, colour palette and typography, business cards, letterheads and stationery, signage',
          team: 'Randy Biney (concept + design); Jude Nyoagbe (concept)',
          year: '2015',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: '2gs-plate2',
        title: '2GS',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/2gs/2gs-2.jpg',
        imageUrlDesktop: 'assets/images/2gs/2gs-2.jpg',
        imageMobileUrl: 'assets/images/2gs/2gs-2.jpg',
        projectUrl: '2gs.html',
        desc: 'A 2015 identity for 2GS Construction + Logistics: a monogram built from the idea of the collective, carried from pencil construction studies through stationery, business cards, letterheads and concrete signage.',
        specs: {
          client: '2GS Construction + Logistics',
          scope: 'Identity and branding: monogram and lockups, labyrinth motif, colour palette and typography, business cards, letterheads and stationery, signage',
          team: 'Randy Biney (concept + design); Jude Nyoagbe (concept)',
          year: '2015',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: '1981-film-project-plate1',
        title: '1981',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/1981/1981-6.jpg',
        imageUrlDesktop: 'assets/images/1981/1981-6.jpg',
        imageMobileUrl: 'assets/images/1981/1981-6-mobile.jpg',
        projectUrl: '1981.html',
        desc: 'Walkthrough of the retail shop for Accra fashion brand 1981 — white walls, chrome garment frames each hung in front of its own portrait panel, and a black lightbox brand wall at the head of the axis.',
        specs: {
          client: 'Joelle Eyeson / 1981',
          scope: '3D Modelling, Shading & Texturing, Lighting, Rendering & Post-Processing, Film Animation (interior design by Joelle Eyeson)',
          team: 'Modelling: Winfred Atieku, Jude Abbey + Jude Nyoagbe | Texturing + Lighting + Shading: Jude Nyoagbe | Rendering: Jude Nyoagbe | Post Processing: Randy Biney',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      },

    ]
  },

  motion: {
    name: 'Motion Design',
    videos: [
      {
        id: 'ceeander-motion',
        title: 'Ceeander Ident',
        category: '3D Animation — 2014',
        service: '3D Animation',
        discipline: 'motion',
        videoUrl: 'assets/videos/ceeander/ceeander-motion.mp4',
        videoUrlDesktop: 'assets/videos/ceeander/ceeander-motion.mp4',
        videoMobileUrl: 'assets/videos/ceeander/ceeander-motion-mobile.mp4',
        imageUrl: 'assets/images/ceeander/ceeander-cover.jpg',
        imageUrlDesktop: 'assets/images/ceeander/ceeander-cover.jpg',
        imageMobileUrl: 'assets/images/ceeander/ceeander-cover.jpg',
        projectUrl: 'ceeander.html',
        desc: 'A 22-second ident for Ceeander Entertainment \u2014 masks glow in darkness, torchlight seeps into the scene, and a lightning strike opens onto the company\u2019s logo in its actual colours.',
        specs: {
          client: 'Ceeander Entertainment Ltd',
          scope: 'Concept, Storyboarding, 3D Animation, Motion Design & Sound Design',
          team: 'Randy Biney + Jude Nyoagbe',
          location: 'Nigeria',
          year: '2014',
          disciplines: ['Motion Design', '3D Animation']
        }
      },
      {
        id: 'trumpet-africa-motion',
        title: 'Trumpet Africa Productions Ident',
        category: 'Broadcast — 2014',
        service: 'Broadcast',
        discipline: 'motion',
        videoUrl: 'assets/videos/trumpet-africa-ident/trumpet-africa.mp4',
        videoUrlDesktop: 'assets/videos/trumpet-africa-ident/trumpet-africa.mp4',
        videoMobileUrl: 'assets/videos/trumpet-africa-ident/trumpet-africa-mobile.mp4',
        imageUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        imageUrlDesktop: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        imageMobileUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        projectUrl: 'trumpet-africa-ident.html',
        desc: 'Broadcast ident designed for Trumpet Africa Productions, exploring and documenting African stories through the motif of Creation and Revelation.',
        specs: {
          client: 'Trumpet Africa Productions',
          scope: 'Concept Development, Storyboarding, Illustrations, Motion Design & 3D Animation',
          team: 'Concept: Jude Nyoagbe + Randy Biney, Animation: Randy Biney',
          year: '2014',
          disciplines: ['Motion Design', '3D Animation']
        }
      },
      {
        id: 'moty-intro-motion',
        title: 'MOTY',
        category: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'motion',
        videoUrl: 'assets/videos/moty/moty-intro.mp4',
        videoUrlDesktop: 'assets/videos/moty/moty-intro.mp4',
        imageUrl: 'assets/images/moty/moty-1.jpg',
        imageUrlDesktop: 'assets/images/moty/moty-1.jpg',
        imageMobileUrl: 'assets/images/moty/moty-1.jpg',
        projectUrl: 'moty.html',
        desc: 'Futuristic broadcast title opener utilizing optical refraction, metallic shaders, and synchronized kinetic audio hits.',
        specs: {
          client: 'Mother of the Year (MOTY)',
          scope: 'Interior design, custom furniture and fixture design, retail graphics and the full set of 3D visualizations for the MOTY children’s store at Accra Mall.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: ['Motion Design', '3D Motion Graphics']
        }
      },
      {
        id: 'viasat1-titles-motion',
        title: 'Viasat1 Breakfast Show',
        category: 'Graphic Design & Motion Design — 2013',
        service: 'Graphic Design & Motion Design',
        discipline: 'motion',
        videoUrl: 'assets/videos/viasat1-breakfast-show/viasat1-titles.mp4',
        videoUrlDesktop: 'assets/videos/viasat1-breakfast-show/viasat1-titles.mp4',
        videoMobileUrl: 'assets/videos/viasat1-breakfast-show/viasat1-titles-mobile.mp4',
        imageUrl: 'assets/images/viasat1-breakfast-show/viasat1-breakfast-show-1.jpg',
        imageUrlDesktop: 'assets/images/viasat1-breakfast-show/viasat1-breakfast-show-1.jpg',
        imageMobileUrl: 'assets/images/viasat1-breakfast-show/viasat1-breakfast-show-1.jpg',
        projectUrl: 'viasat1-breakfast-show.html',
        desc: 'Vibrant morning broadcast identity package featuring 3D graphic ribbons, geometric layout transitions, and dynamic typography.',
        specs: {
          client: 'Viasat 1',
          scope: 'Concept and identity design for the programme, covering logotype, colour palette, typeface specification, on-screen graphics and idents, and a storyboarded animated opening sequence.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: ['Motion Design', 'Broadcast Packaging']
        }
      },
      {
        id: 'jm-spots',
        title: 'J&M Spots',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'motion',
        videoUrl: 'assets/videos/jm-spots/jm-spots-film.mp4',
        videoUrlDesktop: 'assets/videos/jm-spots/jm-spots-film.mp4',
        imageUrl: 'assets/images/jm-spots/jm-spots-04.jpg',
        imageUrlDesktop: 'assets/images/jm-spots/jm-spots-04.jpg',
        imageMobileUrl: 'assets/images/jm-spots/jm-spots-04.jpg',
        projectUrl: 'jm-spots.html'
      },
      {
        id: 'of-sunsets',
        title: 'Of Sunsets',
        category: 'Architectural Visualization & Motion Design — 2017',
        service: 'Architectural Visualization & Motion Design',
        discipline: 'motion',
        videoUrl: 'assets/videos/of-sunsets/of-sunsets-film.mp4',
        videoUrlDesktop: 'assets/videos/of-sunsets/of-sunsets-film.mp4',
        imageUrl: 'assets/images/of-sunsets/of-sunsets-1.jpg',
        imageUrlDesktop: 'assets/images/of-sunsets/of-sunsets-1.jpg',
        imageMobileUrl: 'assets/images/of-sunsets/of-sunsets-1.jpg',
        projectUrl: 'of-sunsets.html'
      },
      {
        id: 'trumpet-africa-motion-film',
        title: 'Trumpet Africa Productions Ident',
        category: 'Broadcast — 2014',
        service: 'Broadcast',
        discipline: 'motion',
        videoUrl: 'assets/videos/trumpet-africa-ident/trumpet-africa.mp4',
        videoUrlDesktop: 'assets/videos/trumpet-africa-ident/trumpet-africa.mp4',
        videoMobileUrl: 'assets/videos/trumpet-africa-ident/trumpet-africa-mobile.mp4',
        imageUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        imageUrlDesktop: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        imageMobileUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        projectUrl: 'trumpet-africa-ident.html',
        desc: 'Broadcast ident designed for Trumpet Africa Productions, exploring and documenting African stories through the motif of Creation and Revelation.',
        specs: {
          client: 'Trumpet Africa Productions',
          scope: 'Concept Development, Storyboarding, Illustrations, Motion Design & 3D Animation',
          team: 'RDVS Team',
          year: '2014',
          disciplines: '[\'Broadcast\']'
        }
      },
      {
        id: 'jm-spots-film',
        title: 'J&M Spots',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'motion',
        videoUrl: 'assets/videos/jm-spots/jm-spots-film.mp4',
        videoUrlDesktop: 'assets/videos/jm-spots/jm-spots-film.mp4',
        imageUrl: 'assets/images/jm-spots/jm-spots-04.jpg',
        imageUrlDesktop: 'assets/images/jm-spots/jm-spots-04.jpg',
        imageMobileUrl: 'assets/images/jm-spots/jm-spots-04.jpg',
        projectUrl: 'jm-spots.html',
        desc: 'A web advertising film for J M D cor, a wallpaper retail shop in Accra   an animated build of the shop s logotype, then four furnished rooms that put its paper to work.',
        specs: {
          client: 'J&M Décor',
          scope: 'Title Animation, Interior Modelling, Shading + Texturing, Lighting, 3D Animation & Direction',
          team: 'Modelling + Interior Design: Jude Abbey, Jude Nyoagbe | Title Animation: Randy Biney, Jude Nyoagbe | Shading + Texturing, 3D Animation + Direction: Jude Nyoagbe | Voice Over: Emerge Ltd',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'emerge-ident-film',
        title: 'Emerge Co. Ltd Showreel',
        category: '3D Animation — 2015',
        service: '3D Animation',
        discipline: 'motion',
        videoUrl: 'assets/videos/emerge-ident/emerge-showreel.mp4',
        videoUrlDesktop: 'assets/videos/emerge-ident/emerge-showreel.mp4',
        imageUrl: 'assets/images/emerge-ident/emerge-ident-08.jpg',
        imageUrlDesktop: 'assets/images/emerge-ident/emerge-ident-08.jpg',
        imageMobileUrl: 'assets/images/emerge-ident/emerge-ident-08.jpg',
        projectUrl: 'emerge-ident.html',
        desc: 'A 3D animated showreel for Emerge Co. Ltd \\u2014 goldfish leap out of a bowl on white, each jump carrying an orange service heading after it: Clientele, Production, Events, Advertising.',
        specs: {
          client: 'Emerge Co. Ltd',
          scope: 'Concept, 3D Animation & Motion Design',
          team: 'RDVS Studios',
          year: '2015',
          disciplines: '[\'3D Animation\']'
        }
      },
      {
        id: 'ceeander-motion-film',
        title: 'Ceeander Ident',
        category: '3D Animation — 2014',
        service: '3D Animation',
        discipline: 'motion',
        videoUrl: 'assets/videos/ceeander/ceeander-motion.mp4',
        videoUrlDesktop: 'assets/videos/ceeander/ceeander-motion.mp4',
        videoMobileUrl: 'assets/videos/ceeander/ceeander-motion-mobile.mp4',
        imageUrl: 'assets/images/ceeander/ceeander-cover.jpg',
        imageUrlDesktop: 'assets/images/ceeander/ceeander-cover.jpg',
        imageMobileUrl: 'assets/images/ceeander/ceeander-cover.jpg',
        projectUrl: 'ceeander.html',
        desc: 'A 22-second ident for Ceeander Entertainment \\u2014 masks glow in darkness, torchlight seeps into the scene, and a lightning strike opens onto the company\\u2019s logo in its actual colours.',
        specs: {
          client: 'Ceeander Entertainment Ltd',
          scope: 'Concept, Storyboarding, 3D Animation, Motion Design & Sound Design',
          team: 'RDVS Team',
          year: '2014',
          disciplines: '[\'3D Animation\']'
        }
      },

      {
        id: 'senseble-plate1',
        title: 'Senseble',
        category: 'Industrial & Furniture Design, Graphic Design, Digital & Web Design & Product Visualization — 2017',
        service: 'Industrial & Furniture Design, Graphic Design, Digital & Web Design & Product Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/senseble/senseble-hero.jpg',
        imageUrlDesktop: 'assets/images/senseble/senseble-hero.jpg',
        imageMobileUrl: 'assets/images/senseble/senseble-hero.jpg',
        projectUrl: 'home-automation-system-presentation.html',
        desc: 'A wall-mounted home-control panel for Clearspace Ltd: one surface for the lights, the scenes and the audio of a house, designed from the housing to the carton it ships in.',
        specs: {
          client: 'Clearspace Ltd',
          scope: 'Concept design, prototype, assembly drawings & packaging design',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Industrial & Furniture Design\', \'Graphic Design\', \'Digital & Web Design\', \'Product Visualization\']'
        }
      },
      {
        id: 'senseble-plate2',
        title: 'Senseble',
        category: 'Industrial & Furniture Design, Graphic Design, Digital & Web Design & Product Visualization — 2017',
        service: 'Industrial & Furniture Design, Graphic Design, Digital & Web Design & Product Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/senseble/senseble-4.jpg',
        imageUrlDesktop: 'assets/images/senseble/senseble-4.jpg',
        imageMobileUrl: 'assets/images/senseble/senseble-4.jpg',
        projectUrl: 'home-automation-system-presentation.html',
        desc: 'A wall-mounted home-control panel for Clearspace Ltd: one surface for the lights, the scenes and the audio of a house, designed from the housing to the carton it ships in.',
        specs: {
          client: 'Clearspace Ltd',
          scope: 'Concept design, prototype, assembly drawings & packaging design',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Industrial & Furniture Design\', \'Graphic Design\', \'Digital & Web Design\', \'Product Visualization\']'
        }
      },
      {
        id: 'senseble-plate3',
        title: 'Senseble',
        category: 'Industrial & Furniture Design, Graphic Design, Digital & Web Design & Product Visualization — 2017',
        service: 'Industrial & Furniture Design, Graphic Design, Digital & Web Design & Product Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/senseble/senseble-3.jpg',
        imageUrlDesktop: 'assets/images/senseble/senseble-3.jpg',
        imageMobileUrl: 'assets/images/senseble/senseble-3.jpg',
        projectUrl: 'home-automation-system-presentation.html',
        desc: 'A wall-mounted home-control panel for Clearspace Ltd: one surface for the lights, the scenes and the audio of a house, designed from the housing to the carton it ships in.',
        specs: {
          client: 'Clearspace Ltd',
          scope: 'Concept design, prototype, assembly drawings & packaging design',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Industrial & Furniture Design\', \'Graphic Design\', \'Digital & Web Design\', \'Product Visualization\']'
        }
      },
    ],
    images: [
      {
        id: 'emerge-ident',
        title: 'Emerge Co. Ltd Showreel',
        category: '3D Animation — 2015',
        service: '3D Animation',
        discipline: 'motion',
        imageUrl: 'assets/images/emerge-ident/emerge-ident-08.jpg',
        imageUrlDesktop: 'assets/images/emerge-ident/emerge-ident-08.jpg',
        imageMobileUrl: 'assets/images/emerge-ident/emerge-ident-08.jpg',
        projectUrl: 'emerge-ident.html',
        desc: 'A 3D animated showreel for Emerge Co. Ltd \u2014 goldfish leap out of a bowl on white, each jump carrying an orange service heading after it: Clientele, Production, Events, Advertising.',
        specs: {
          client: 'Emerge Co. Ltd',
          scope: 'Concept, 3D Animation & Motion Design',
          team: 'RDVS Studios',
          location: 'Accra, Ghana',
          year: '2015',
          disciplines: ['Motion Design', '3D Animation']
        }
      },
      {
        id: 'elo-tv',
        title: 'ELO TV',
        category: 'Motion Design — 2015',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/elo-tv/elo-tv-01.jpg',
        imageUrlDesktop: 'assets/images/elo-tv/elo-tv-01.jpg',
        imageMobileUrl: 'assets/images/elo-tv/elo-tv-01.jpg',
        projectUrl: 'elo-tv.html',
        desc: 'A 2015 brand identity and broadcast motion package — slanted ELO wordmark with halftone velocity trail, stationery system and a kinetic on-air ident that opens the letterforms over live footage.',
        specs: {
          client: 'ELO TV',
          scope: 'Graphic Design & Motion Design (Brand Identity, Stationery & Broadcast Ident)',
          team: 'RDVS Team',
          year: '2015',
          disciplines: ['Graphic Design', 'Motion Design']
        }
      },
      {
        id: 'hfc-tvc-keyframes',
        title: 'HFC TVC',
        category: 'Visual Effects (VFX) & Motion Design — 2016',
        service: 'Visual Effects (VFX) & Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
        imageUrlDesktop: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
        imageMobileUrl: 'assets/images/hfc-tvc/hfc-tvc-1-mobile.jpg',
        projectUrl: 'hfc-tvc.html',
        desc: 'High-contrast stylized motion keyframes establishing lighting mood, particle density, and corporate typographic hierarchy.',
        specs: {
          client: 'Midnight Run',
          scope: 'Visual Effects (VFX) & Motion Design',
          team: 'Jude Abbey, Jude Nyoagbe, Randy Biney',
          year: '2016',
          disciplines: ['Motion Design', 'Keyframe Design']
        }
      },
      {
        id: 'viasat1-titles-motion-plate1',
        title: 'Viasat1 Breakfast Show',
        category: 'Graphic Design & Motion Design — 2013',
        service: 'Graphic Design & Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/viasat1-breakfast-show/viasat1-breakfast-show-1.jpg',
        imageUrlDesktop: 'assets/images/viasat1-breakfast-show/viasat1-breakfast-show-1.jpg',
        imageMobileUrl: 'assets/images/viasat1-breakfast-show/viasat1-breakfast-show-1.jpg',
        projectUrl: 'viasat1-breakfast-show.html',
        desc: 'Vibrant morning broadcast identity package featuring 3D graphic ribbons, geometric layout transitions, and dynamic typography.',
        specs: {
          client: 'Viasat 1',
          scope: 'Concept and identity design for the programme, covering logotype, colour palette, typeface specification, on-screen graphics and idents, and a storyboarded animated opening sequence.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Graphic Design   Motion Design\']'
        }
      },
      {
        id: 'viasat1-titles-motion-plate2',
        title: 'Viasat1 Breakfast Show',
        category: 'Graphic Design & Motion Design — 2013',
        service: 'Graphic Design & Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/viasat1-breakfast-show/viasat1-breakfast-show-2.jpg',
        imageUrlDesktop: 'assets/images/viasat1-breakfast-show/viasat1-breakfast-show-2.jpg',
        imageMobileUrl: 'assets/images/viasat1-breakfast-show/viasat1-breakfast-show-2.jpg',
        projectUrl: 'viasat1-breakfast-show.html',
        desc: 'Vibrant morning broadcast identity package featuring 3D graphic ribbons, geometric layout transitions, and dynamic typography.',
        specs: {
          client: 'Viasat 1',
          scope: 'Concept and identity design for the programme, covering logotype, colour palette, typeface specification, on-screen graphics and idents, and a storyboarded animated opening sequence.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Graphic Design   Motion Design\']'
        }
      },
      {
        id: 'trumpet-africa-motion-plate1',
        title: 'Trumpet Africa Productions Ident',
        category: 'Broadcast — 2014',
        service: 'Broadcast',
        discipline: 'motion',
        imageUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        imageUrlDesktop: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        imageMobileUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        projectUrl: 'trumpet-africa-ident.html',
        desc: 'Broadcast ident designed for Trumpet Africa Productions, exploring and documenting African stories through the motif of Creation and Revelation.',
        specs: {
          client: 'Trumpet Africa Productions',
          scope: 'Concept Development, Storyboarding, Illustrations, Motion Design & 3D Animation',
          team: 'RDVS Team',
          year: '2014',
          disciplines: '[\'Broadcast\']'
        }
      },
      {
        id: 'tedxharambee-plate1',
        title: 'TEDxHarambee',
        category: 'Motion Design — 2013',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/tedxharambee/tedxharambee-poster.jpg',
        imageUrlDesktop: 'assets/images/tedxharambee/tedxharambee-poster.jpg',
        imageMobileUrl: 'assets/images/tedxharambee/tedxharambee-poster.jpg',
        projectUrl: 'tedxharambee.html',
        desc: 'An eight-frame motion design intro made for TEDxHarambee, the event dated 4th November 2010 on screen: black titles, red and white event typography, speaker cards and sponsor billboards, all cut by a turning metal gear.',
        specs: {
          client: 'TEDxHarambee',
          scope: 'Motion design for the event intro film: titles, time and date cards, speaker cards and sponsor billboards.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Motion Design\']'
        }
      },
      {
        id: 'tedxharambee-plate2',
        title: 'TEDxHarambee',
        category: 'Motion Design — 2013',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/tedxharambee/tedxharambee-1.jpg',
        imageUrlDesktop: 'assets/images/tedxharambee/tedxharambee-1.jpg',
        imageMobileUrl: 'assets/images/tedxharambee/tedxharambee-1.jpg',
        projectUrl: 'tedxharambee.html',
        desc: 'An eight-frame motion design intro made for TEDxHarambee, the event dated 4th November 2010 on screen: black titles, red and white event typography, speaker cards and sponsor billboards, all cut by a turning metal gear.',
        specs: {
          client: 'TEDxHarambee',
          scope: 'Motion design for the event intro film: titles, time and date cards, speaker cards and sponsor billboards.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Motion Design\']'
        }
      },
      {
        id: 'tedxharambee-plate3',
        title: 'TEDxHarambee',
        category: 'Motion Design — 2013',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/tedxharambee/tedxharambee-2.jpg',
        imageUrlDesktop: 'assets/images/tedxharambee/tedxharambee-2.jpg',
        imageMobileUrl: 'assets/images/tedxharambee/tedxharambee-2.jpg',
        projectUrl: 'tedxharambee.html',
        desc: 'An eight-frame motion design intro made for TEDxHarambee, the event dated 4th November 2010 on screen: black titles, red and white event typography, speaker cards and sponsor billboards, all cut by a turning metal gear.',
        specs: {
          client: 'TEDxHarambee',
          scope: 'Motion design for the event intro film: titles, time and date cards, speaker cards and sponsor billboards.',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: '[\'Motion Design\']'
        }
      },
      {
        id: 'rdvs-ident-plate1',
        title: 'RDVS Ident',
        category: 'Motion Design — 2010',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/rdvs-ident/rdvs-ident-poster.jpg',
        imageUrlDesktop: 'assets/images/rdvs-ident/rdvs-ident-poster.jpg',
        imageMobileUrl: 'assets/images/rdvs-ident/rdvs-ident-poster.jpg',
        projectUrl: 'rdvs-ident.html',
        desc: 'RDVS Ident is the studio s first After Effects experiment   a 2010 motion piece that animates the running-figure mark over a blue gradient field, made as an in-house study rather than for a client.',
        specs: {
          client: 'RDVS Studios',
          scope: 'Self-initiated motion design and animation: logo build, type animation and render of a studio ident.',
          team: 'RDVS. DESIGN',
          year: '2010',
          disciplines: '[\'Motion Design\']'
        }
      },
      {
        id: 'of-sunsets-plate1',
        title: 'Of Sunsets',
        category: 'Architectural Visualization & Motion Design — 2017',
        service: 'Architectural Visualization & Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/of-sunsets/of-sunsets-1.jpg',
        imageUrlDesktop: 'assets/images/of-sunsets/of-sunsets-1.jpg',
        imageMobileUrl: 'assets/images/of-sunsets/of-sunsets-1.jpg',
        projectUrl: 'of-sunsets.html',
        desc: 'Of Sunsets is a 2017 visualization and motion design set by RDVS Studio for an apartment scheme by Mobius Architecture, covering its lobby, living spaces and rooftop amenity across paired day and night lighting studies, and cut into a short film.',
        specs: {
          client: 'Mobius Architecture',
          scope: '3D modelling of the lobby, apartments and roof terrace, still architectural visualization in day and night lighting conditions, and a short film cut from an earlier version of the model.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Architectural Visualization   Motion Design\']'
        }
      },
      {
        id: 'of-sunsets-plate2',
        title: 'Of Sunsets',
        category: 'Architectural Visualization & Motion Design — 2017',
        service: 'Architectural Visualization & Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/of-sunsets/of-sunsets-2.jpg',
        imageUrlDesktop: 'assets/images/of-sunsets/of-sunsets-2.jpg',
        imageMobileUrl: 'assets/images/of-sunsets/of-sunsets-2.jpg',
        projectUrl: 'of-sunsets.html',
        desc: 'Of Sunsets is a 2017 visualization and motion design set by RDVS Studio for an apartment scheme by Mobius Architecture, covering its lobby, living spaces and rooftop amenity across paired day and night lighting studies, and cut into a short film.',
        specs: {
          client: 'Mobius Architecture',
          scope: '3D modelling of the lobby, apartments and roof terrace, still architectural visualization in day and night lighting conditions, and a short film cut from an earlier version of the model.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Architectural Visualization   Motion Design\']'
        }
      },
      {
        id: 'jm-spots-plate1',
        title: 'J&M Spots',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'motion',
        imageUrl: 'assets/images/jm-spots/jm-spots-04.jpg',
        imageUrlDesktop: 'assets/images/jm-spots/jm-spots-04.jpg',
        imageMobileUrl: 'assets/images/jm-spots/jm-spots-04.jpg',
        projectUrl: 'jm-spots.html',
        desc: 'A web advertising film for J M D cor, a wallpaper retail shop in Accra   an animated build of the shop s logotype, then four furnished rooms that put its paper to work.',
        specs: {
          client: 'J&M Décor',
          scope: 'Title Animation, Interior Modelling, Shading + Texturing, Lighting, 3D Animation & Direction',
          team: 'Modelling + Interior Design: Jude Abbey, Jude Nyoagbe | Title Animation: Randy Biney, Jude Nyoagbe | Shading + Texturing, 3D Animation + Direction: Jude Nyoagbe | Voice Over: Emerge Ltd',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      },
      {
        id: 'hfc-tvc-motion-plate1',
        title: 'HFC TVC',
        category: 'Visual Effects (VFX) & Motion Design — 2016',
        service: 'Visual Effects (VFX) & Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hfc-tvc/hfc-tvc-5.jpg',
        imageUrlDesktop: 'assets/images/hfc-tvc/hfc-tvc-5.jpg',
        imageMobileUrl: 'assets/images/hfc-tvc/hfc-tvc-5.jpg',
        projectUrl: 'hfc-tvc.html',
        desc: 'Broadcast commercial spot combining 3D kinetic typographic choreography, graphic pacing, and fluid motion design.',
        specs: {
          client: 'Midnight Run',
          scope: 'Visual Effects (VFX) & Motion Design',
          team: 'Jude Abbey, Jude Nyoagbe, Randy Biney',
          year: '2016',
          disciplines: '[\'Visual Effects (VFX)\', \'Motion Design\']'
        }
      },
      {
        id: 'hfc-tvc-motion-plate2',
        title: 'HFC TVC',
        category: 'Visual Effects (VFX) & Motion Design — 2016',
        service: 'Visual Effects (VFX) & Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hfc-tvc/hfc-tvc-6.jpg',
        imageUrlDesktop: 'assets/images/hfc-tvc/hfc-tvc-6.jpg',
        imageMobileUrl: 'assets/images/hfc-tvc/hfc-tvc-6.jpg',
        projectUrl: 'hfc-tvc.html',
        desc: 'Broadcast commercial spot combining 3D kinetic typographic choreography, graphic pacing, and fluid motion design.',
        specs: {
          client: 'Midnight Run',
          scope: 'Visual Effects (VFX) & Motion Design',
          team: 'Jude Abbey, Jude Nyoagbe, Randy Biney',
          year: '2016',
          disciplines: '[\'Visual Effects (VFX)\', \'Motion Design\']'
        }
      },
      {
        id: 'glow-in-the-dark-gif',
        title: 'Glow in the Dark',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'motion',
        imageUrl: 'assets/images/glow-in-the-dark/glow-in-the-dark-1.jpg',
        imageUrlDesktop: 'assets/images/glow-in-the-dark/glow-in-the-dark-1.jpg',
        imageMobileUrl: 'assets/images/glow-in-the-dark/glow-in-the-dark-1-mobile.jpg',
        projectUrl: 'glow-in-the-dark.html',
        desc: 'Event marketing for a party advertised for 4 October 2014 — a neon sign key visual modelled in 3D so the glass could be shown dead and struck up, then looped as a teaser between the two states.',
        specs: {
          client: 'Private Client',
          scope: 'Graphic Design, 3D Visualization, Motion Design',
          team: 'Jude Nyoagbe, Randy Biney',
          year: '2014',
          disciplines: '[\'Graphic Design\']'
        }
      },
      {
        id: 'emerge-ident-plate1',
        title: 'Emerge Co. Ltd Showreel',
        category: '3D Animation — 2015',
        service: '3D Animation',
        discipline: 'motion',
        imageUrl: 'assets/images/emerge-ident/emerge-ident-01.jpg',
        imageUrlDesktop: 'assets/images/emerge-ident/emerge-ident-01.jpg',
        imageMobileUrl: 'assets/images/emerge-ident/emerge-ident-01.jpg',
        projectUrl: 'emerge-ident.html',
        desc: 'A 3D animated showreel for Emerge Co. Ltd \\u2014 goldfish leap out of a bowl on white, each jump carrying an orange service heading after it: Clientele, Production, Events, Advertising.',
        specs: {
          client: 'Emerge Co. Ltd',
          scope: 'Concept, 3D Animation & Motion Design',
          team: 'RDVS Studios',
          year: '2015',
          disciplines: '[\'3D Animation\']'
        }
      },
      {
        id: 'elo-tv-plate1',
        title: 'ELO TV',
        category: 'Motion Design — 2015',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/elo-tv/elo-tv-02.jpg',
        imageUrlDesktop: 'assets/images/elo-tv/elo-tv-02.jpg',
        imageMobileUrl: 'assets/images/elo-tv/elo-tv-02.jpg',
        projectUrl: 'elo-tv.html',
        desc: 'A 2015 brand identity and broadcast motion package — slanted ELO wordmark with halftone velocity trail, stationery system and a kinetic on-air ident that opens the letterforms over live footage.',
        specs: {
          client: 'ELO TV',
          scope: 'Graphic Design & Motion Design (Brand Identity, Stationery & Broadcast Ident)',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Motion Design\']'
        }
      },
      {
        id: 'elo-tv-plate2',
        title: 'ELO TV',
        category: 'Motion Design — 2015',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/elo-tv/elo-tv-03.jpg',
        imageUrlDesktop: 'assets/images/elo-tv/elo-tv-03.jpg',
        imageMobileUrl: 'assets/images/elo-tv/elo-tv-03.jpg',
        projectUrl: 'elo-tv.html',
        desc: 'A 2015 brand identity and broadcast motion package — slanted ELO wordmark with halftone velocity trail, stationery system and a kinetic on-air ident that opens the letterforms over live footage.',
        specs: {
          client: 'ELO TV',
          scope: 'Graphic Design & Motion Design (Brand Identity, Stationery & Broadcast Ident)',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Motion Design\']'
        }
      },
      {
        id: 'elo-conference-plate1',
        title: 'ELO Conference',
        category: 'Motion Design — 2014',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/elo-conference/elo-conference-poster.jpg',
        imageUrlDesktop: 'assets/images/elo-conference/elo-conference-poster.jpg',
        imageMobileUrl: 'assets/images/elo-conference/elo-conference-poster.jpg',
        projectUrl: 'elo-conference.html',
        desc: 'A 2014 motion design piece for ELO, the ExceedLeague Organisation: a web advertisement for the Mission Possible conference built from a chrome logo reveal, blue particle bursts and a rotating wireframe globe carrying speaker captions.',
        specs: {
          client: 'ELO',
          scope: 'Motion design and animation for the conference web advertisement, covering the logo reveal, particle effects, globe sequence, speaker captions and end card.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Motion Design\']'
        }
      },
      {
        id: 'elo-conference-plate2',
        title: 'ELO Conference',
        category: 'Motion Design — 2014',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/elo-conference/elo-conference-1.jpg',
        imageUrlDesktop: 'assets/images/elo-conference/elo-conference-1.jpg',
        imageMobileUrl: 'assets/images/elo-conference/elo-conference-1.jpg',
        projectUrl: 'elo-conference.html',
        desc: 'A 2014 motion design piece for ELO, the ExceedLeague Organisation: a web advertisement for the Mission Possible conference built from a chrome logo reveal, blue particle bursts and a rotating wireframe globe carrying speaker captions.',
        specs: {
          client: 'ELO',
          scope: 'Motion design and animation for the conference web advertisement, covering the logo reveal, particle effects, globe sequence, speaker captions and end card.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Motion Design\']'
        }
      },
      {
        id: 'elo-conference-plate3',
        title: 'ELO Conference',
        category: 'Motion Design — 2014',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/elo-conference/elo-conference-2.jpg',
        imageUrlDesktop: 'assets/images/elo-conference/elo-conference-2.jpg',
        imageMobileUrl: 'assets/images/elo-conference/elo-conference-2.jpg',
        projectUrl: 'elo-conference.html',
        desc: 'A 2014 motion design piece for ELO, the ExceedLeague Organisation: a web advertisement for the Mission Possible conference built from a chrome logo reveal, blue particle bursts and a rotating wireframe globe carrying speaker captions.',
        specs: {
          client: 'ELO',
          scope: 'Motion design and animation for the conference web advertisement, covering the logo reveal, particle effects, globe sequence, speaker captions and end card.',
          team: 'RDVS. DESIGN',
          year: '2014',
          disciplines: '[\'Motion Design\']'
        }
      },
      {
        id: 'ceeander-motion-plate1',
        title: 'Ceeander Ident',
        category: '3D Animation — 2014',
        service: '3D Animation',
        discipline: 'motion',
        imageUrl: 'assets/images/ceeander/ceeander-cover.jpg',
        imageUrlDesktop: 'assets/images/ceeander/ceeander-cover.jpg',
        imageMobileUrl: 'assets/images/ceeander/ceeander-cover.jpg',
        projectUrl: 'ceeander.html',
        desc: 'A 22-second ident for Ceeander Entertainment \\u2014 masks glow in darkness, torchlight seeps into the scene, and a lightning strike opens onto the company\\u2019s logo in its actual colours.',
        specs: {
          client: 'Ceeander Entertainment Ltd',
          scope: 'Concept, Storyboarding, 3D Animation, Motion Design & Sound Design',
          team: 'RDVS Team',
          year: '2014',
          disciplines: '[\'3D Animation\']'
        }
      },
      {
        id: 'hfc-tvc-motion',
        title: 'HFC TVC',
        category: 'Visual Effects (VFX) & Motion Design — 2016',
        service: 'Visual Effects (VFX) & Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
        imageUrlDesktop: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
        imageMobileUrl: 'assets/images/hfc-tvc/hfc-tvc-1-mobile.jpg',
        projectUrl: 'hfc-tvc.html',
        desc: 'Broadcast commercial spot combining 3D kinetic typographic choreography, graphic pacing, and fluid motion design.',
        specs: {
          client: 'Midnight Run',
          scope: 'Visual Effects (VFX) & Motion Design',
          team: 'Jude Abbey, Jude Nyoagbe, Randy Biney',
          year: '2016',
          disciplines: ['Motion Design', 'Broadcast TVC']
        }
      },

    ]
  },
  // The fifth stream is the Products page (product.html): the studio's own MIG pieces,
  // which live on their own pages and are designed + visualized in-house rather than
  // commissioned. They draw an equal share of the deck like the four disciplines, so a
  // product slide reaches the homepage instead of hiding inside the VFX pool.
  // Every still and every film a product page renders is pooled, not just the header,
  // so a plate deeper in the gallery can reach the deck too (user, 2026-10-05).
  // scratch/_build_product_pool.py rebuilds this block from the pages themselves.
  products: {
    name: 'Product Design',
    videos: [
      {
        id: 'product-mound-film1',
        title: 'MOUND',
        category: 'Design · VFX + CGI — 2016',
        service: 'Design · VFX + CGI',
        discipline: 'products',
        videoUrl: 'assets/videos/mound/mound-film.mp4',
        videoUrlDesktop: 'assets/videos/mound/mound-film.mp4',
        imageUrl: 'assets/images/mig/mig-mound-1.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-mound-1.jpg',
        imageMobileUrl: 'assets/images/mig/mig-mound-1.jpg',
        projectUrl: 'product-mound.html',
        desc: 'The plate labels MOUND as accessories for fruit and clutter: a shallow tray for what collects on a surface, and a mesh-top bench doing the same job at a larger scale at the foot of a bed. Designed by RDVS in 2016 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Accessories / Tray & bench',
          year: '2016',
        }
      },
    ],
    images: [
      {
        id: 'product-1h',
        title: '1H',
        category: 'Design · VFX + CGI — 2016',
        service: 'Design · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-1h-1.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-1h-1.jpg',
        imageMobileUrl: 'assets/images/mig/mig-1h-1.jpg',
        projectUrl: 'product-1h.html',
        desc: 'A wall run built from modules rather than one fixed elevation: open bays and closed volumes re-stack around a screen at eye level. RDVS designed 1H in 2016 for the MIG line and documented it in two schemes, a dark-stained set stacked as a tall bay and a white-and-dark set run wider across the wall.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Media wall',
          year: '2016',
        }
      },
      {
        id: 'product-1h-plate2',
        title: '1H',
        category: 'Design · VFX + CGI — 2016',
        service: 'Design · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-1h-2.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-1h-2.jpg',
        imageMobileUrl: 'assets/images/mig/mig-1h-2.jpg',
        projectUrl: 'product-1h.html',
        desc: 'A wall run built from modules rather than one fixed elevation: open bays and closed volumes re-stack around a screen at eye level. RDVS designed 1H in 2016 for the MIG line and documented it in two schemes, a dark-stained set stacked as a tall bay and a white-and-dark set run wider across the wall.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Media wall',
          year: '2016',
        }
      },
      {
        id: 'product-1h-plate3',
        title: '1H',
        category: 'Design · VFX + CGI — 2016',
        service: 'Design · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-1h-3.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-1h-3.jpg',
        imageMobileUrl: 'assets/images/mig/mig-1h-3.jpg',
        projectUrl: 'product-1h.html',
        desc: 'A wall run built from modules rather than one fixed elevation: open bays and closed volumes re-stack around a screen at eye level. RDVS designed 1H in 2016 for the MIG line and documented it in two schemes, a dark-stained set stacked as a tall bay and a white-and-dark set run wider across the wall.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Media wall',
          year: '2016',
        }
      },
      {
        id: 'product-1h-plate4',
        title: '1H',
        category: 'Design · VFX + CGI — 2016',
        service: 'Design · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-1h-4.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-1h-4.jpg',
        imageMobileUrl: 'assets/images/mig/mig-1h-4.jpg',
        projectUrl: 'product-1h.html',
        desc: 'A wall run built from modules rather than one fixed elevation: open bays and closed volumes re-stack around a screen at eye level. RDVS designed 1H in 2016 for the MIG line and documented it in two schemes, a dark-stained set stacked as a tall bay and a white-and-dark set run wider across the wall.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Media wall',
          year: '2016',
        }
      },
      {
        id: 'product-1h-plate5',
        title: '1H',
        category: 'Design · VFX + CGI — 2016',
        service: 'Design · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-1h-5.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-1h-5.jpg',
        imageMobileUrl: 'assets/images/mig/mig-1h-5.jpg',
        projectUrl: 'product-1h.html',
        desc: 'A wall run built from modules rather than one fixed elevation: open bays and closed volumes re-stack around a screen at eye level. RDVS designed 1H in 2016 for the MIG line and documented it in two schemes, a dark-stained set stacked as a tall bay and a white-and-dark set run wider across the wall.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Media wall',
          year: '2016',
        }
      },
      {
        id: 'product-1h-plate6',
        title: '1H',
        category: 'Design · VFX + CGI — 2016',
        service: 'Design · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-1h-6.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-1h-6.jpg',
        imageMobileUrl: 'assets/images/mig/mig-1h-6.jpg',
        projectUrl: 'product-1h.html',
        desc: 'A wall run built from modules rather than one fixed elevation: open bays and closed volumes re-stack around a screen at eye level. RDVS designed 1H in 2016 for the MIG line and documented it in two schemes, a dark-stained set stacked as a tall bay and a white-and-dark set run wider across the wall.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Media wall',
          year: '2016',
        }
      },
      {
        id: 'product-hg-desk',
        title: 'HG-DESK',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-hg-desk-1.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-hg-desk-1.jpg',
        imageMobileUrl: 'assets/images/mig/mig-hg-desk-1.jpg',
        projectUrl: 'product-hg-desk.html',
        desc: 'A work desk built around one thick top with a returned edge carrying the MIG mark, set on angled trestle supports. Designed by RDVS in 2020 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Desk',
          year: '2020',
        }
      },
      {
        id: 'product-hg-desk-plate2',
        title: 'HG-DESK',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-hg-desk-2.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-hg-desk-2.jpg',
        imageMobileUrl: 'assets/images/mig/mig-hg-desk-2.jpg',
        projectUrl: 'product-hg-desk.html',
        desc: 'A work desk built around one thick top with a returned edge carrying the MIG mark, set on angled trestle supports. Designed by RDVS in 2020 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Desk',
          year: '2020',
        }
      },
      {
        id: 'product-hg-desk-plate3',
        title: 'HG-DESK',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-hg-desk-3.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-hg-desk-3.jpg',
        imageMobileUrl: 'assets/images/mig/mig-hg-desk-3.jpg',
        projectUrl: 'product-hg-desk.html',
        desc: 'A work desk built around one thick top with a returned edge carrying the MIG mark, set on angled trestle supports. Designed by RDVS in 2020 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Desk',
          year: '2020',
        }
      },
      {
        id: 'product-line-e-float-i',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-2.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-2.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-2.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Floating media unit',
        }
      },
      {
        id: 'product-line-e-float-i-plate2',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-3.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-3.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-3.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Floating media unit',
        }
      },
      {
        id: 'product-line-e-float-i-plate3',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-4.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-4.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-4.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Floating media unit',
        }
      },
      {
        id: 'product-line-e-float-i-plate4',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-5.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-5.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-5.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Floating media unit',
        }
      },
      {
        id: 'product-line-e-float-i-plate5',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-6.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-6.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-6.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Floating media unit',
        }
      },
      {
        id: 'product-line-e-float-i-plate6',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-7.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-7.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-7.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Floating media unit',
        }
      },
      {
        id: 'product-line-e-float-i-plate7',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-8.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-8.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-8.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Floating media unit',
        }
      },
      {
        id: 'product-line-e-float-i-plate8',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-9.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-9.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-9.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Floating media unit',
        }
      },
      {
        id: 'product-line-e-float-i-plate9',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-10.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-10.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-10.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Floating media unit',
        }
      },
      {
        id: 'product-mlky',
        title: 'MLKY',
        category: 'Design · In-house · VFX + CGI — 2021',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-mlky-1.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-mlky-1.jpg',
        imageMobileUrl: 'assets/images/mig/mig-mlky-1.jpg',
        projectUrl: 'product-mlky.html',
        desc: 'An experimental lighting range rather than one fixture: a reeded column that lifts a room from the floor, a cluster of rounded diffusers that reads as a single body, and a corrugated trunk tapering from a thin tip to an open mouth. RDVS designed MLKY in 2021 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Lights / Experimental lighting',
          year: '2021',
        }
      },
      {
        id: 'product-mlky-plate2',
        title: 'MLKY',
        category: 'Design · In-house · VFX + CGI — 2021',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-mlky-2.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-mlky-2.jpg',
        imageMobileUrl: 'assets/images/mig/mig-mlky-2.jpg',
        projectUrl: 'product-mlky.html',
        desc: 'An experimental lighting range rather than one fixture: a reeded column that lifts a room from the floor, a cluster of rounded diffusers that reads as a single body, and a corrugated trunk tapering from a thin tip to an open mouth. RDVS designed MLKY in 2021 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Lights / Experimental lighting',
          year: '2021',
        }
      },
      {
        id: 'product-mlky-plate3',
        title: 'MLKY',
        category: 'Design · In-house · VFX + CGI — 2021',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-mlky-3.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-mlky-3.jpg',
        imageMobileUrl: 'assets/images/mig/mig-mlky-3.jpg',
        projectUrl: 'product-mlky.html',
        desc: 'An experimental lighting range rather than one fixture: a reeded column that lifts a room from the floor, a cluster of rounded diffusers that reads as a single body, and a corrugated trunk tapering from a thin tip to an open mouth. RDVS designed MLKY in 2021 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Lights / Experimental lighting',
          year: '2021',
        }
      },
      {
        id: 'product-mound',
        title: 'MOUND',
        category: 'Design · VFX + CGI — 2016',
        service: 'Design · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-mound-1.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-mound-1.jpg',
        imageMobileUrl: 'assets/images/mig/mig-mound-1.jpg',
        projectUrl: 'product-mound.html',
        desc: 'The plate labels MOUND as accessories for fruit and clutter: a shallow tray for what collects on a surface, and a mesh-top bench doing the same job at a larger scale at the foot of a bed. Designed by RDVS in 2016 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Accessories / Tray & bench',
          year: '2016',
        }
      },
      {
        id: 'product-mound-plate2',
        title: 'MOUND',
        category: 'Design · VFX + CGI — 2016',
        service: 'Design · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-mound-2.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-mound-2.jpg',
        imageMobileUrl: 'assets/images/mig/mig-mound-2.jpg',
        projectUrl: 'product-mound.html',
        desc: 'The plate labels MOUND as accessories for fruit and clutter: a shallow tray for what collects on a surface, and a mesh-top bench doing the same job at a larger scale at the foot of a bed. Designed by RDVS in 2016 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Accessories / Tray & bench',
          year: '2016',
        }
      },
      {
        id: 'product-s-age',
        title: 'S-AGE',
        category: 'Design · In-house · VFX + CGI — 2018',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-s-age-1.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-s-age-1.jpg',
        imageMobileUrl: 'assets/images/mig/mig-s-age-1.jpg',
        projectUrl: 'product-s-age.html',
        desc: 'A curved front-of-house desk in white, its plain panel carrying an information-desk pictogram. Designed by RDVS in 2018 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Reception desk',
          year: '2018',
        }
      },
      {
        id: 'product-s-age-plate2',
        title: 'S-AGE',
        category: 'Design · In-house · VFX + CGI — 2018',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-s-age-2.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-s-age-2.jpg',
        imageMobileUrl: 'assets/images/mig/mig-s-age-2.jpg',
        projectUrl: 'product-s-age.html',
        desc: 'A curved front-of-house desk in white, its plain panel carrying an information-desk pictogram. Designed by RDVS in 2018 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Reception desk',
          year: '2018',
        }
      },
      {
        id: 'product-s-age-plate3',
        title: 'S-AGE',
        category: 'Design · In-house · VFX + CGI — 2018',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-s-age-3.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-s-age-3.jpg',
        imageMobileUrl: 'assets/images/mig/mig-s-age-3.jpg',
        projectUrl: 'product-s-age.html',
        desc: 'A curved front-of-house desk in white, its plain panel carrying an information-desk pictogram. Designed by RDVS in 2018 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Reception desk',
          year: '2018',
        }
      },
      {
        id: 'product-s-age-plate4',
        title: 'S-AGE',
        category: 'Design · In-house · VFX + CGI — 2018',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-s-age-4.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-s-age-4.jpg',
        imageMobileUrl: 'assets/images/mig/mig-s-age-4.jpg',
        projectUrl: 'product-s-age.html',
        desc: 'A curved front-of-house desk in white, its plain panel carrying an information-desk pictogram. Designed by RDVS in 2018 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Reception desk',
          year: '2018',
        }
      },
      {
        id: 'product-s-age-plate5',
        title: 'S-AGE',
        category: 'Design · In-house · VFX + CGI — 2018',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-s-age-5.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-s-age-5.jpg',
        imageMobileUrl: 'assets/images/mig/mig-s-age-5.jpg',
        projectUrl: 'product-s-age.html',
        desc: 'A curved front-of-house desk in white, its plain panel carrying an information-desk pictogram. Designed by RDVS in 2018 for the MIG line.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Reception desk',
          year: '2018',
        }
      },
      {
        id: 'product-sp001',
        title: 'SP001',
        category: 'Design · In-house · VFX + CGI — 2019',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-sp001-1.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-sp001-1.jpg',
        imageMobileUrl: 'assets/images/mig/mig-sp001-1.jpg',
        projectUrl: 'product-sp001.html',
        desc: 'A low pod for a power nap at work, deep enough to hold some privacy. Designed by RDVS in 2019 for the MIG line, and given here lit on black, dressed with pillows, and exploded so the slatted top and the hardwood frame read separately.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Sleeping pod',
          year: '2019',
        }
      },
      {
        id: 'product-sp001-plate2',
        title: 'SP001',
        category: 'Design · In-house · VFX + CGI — 2019',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-sp001-2.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-sp001-2.jpg',
        imageMobileUrl: 'assets/images/mig/mig-sp001-2.jpg',
        projectUrl: 'product-sp001.html',
        desc: 'A low pod for a power nap at work, deep enough to hold some privacy. Designed by RDVS in 2019 for the MIG line, and given here lit on black, dressed with pillows, and exploded so the slatted top and the hardwood frame read separately.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Sleeping pod',
          year: '2019',
        }
      },
      {
        id: 'product-sp001-plate3',
        title: 'SP001',
        category: 'Design · In-house · VFX + CGI — 2019',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-sp001-3.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-sp001-3.jpg',
        imageMobileUrl: 'assets/images/mig/mig-sp001-3.jpg',
        projectUrl: 'product-sp001.html',
        desc: 'A low pod for a power nap at work, deep enough to hold some privacy. Designed by RDVS in 2019 for the MIG line, and given here lit on black, dressed with pillows, and exploded so the slatted top and the hardwood frame read separately.',
        specs: {
          client: 'In-house',
          scope: 'Furniture / Sleeping pod',
          year: '2019',
        }
      },
    ]
  }
};

  // Fisher-Yates Array Shuffle
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Try to load dynamic Sanity content if configured and merge
  if (window.RDVSSanity && window.RDVSSanity.isConfigured()) {
    try {
      // Race against a short timeout so a slow/unreachable Sanity API can never
      // stall slide population and leave static markup on screen
      const sanityHero = await Promise.race([
        window.RDVSSanity.getHeroProjects(),
        new Promise(resolve => setTimeout(() => resolve(null), 2500))
      ]);
      if (sanityHero && sanityHero.length > 0) {
        sanityHero.forEach((p, idx) => {
          const disc = (p.discipline || '').toLowerCase();
          const targetKey = disc.includes('interior') ? 'interiors'
            : disc.includes('vfx') || disc.includes('cgi') || disc.includes('visualization') || disc.includes('animation') || disc.includes('arch viz') ? 'vfx'
            : disc.includes('motion') ? 'motion'
            : 'architecture';

          const formatted = {
            id: p._id || `sanity-project-${idx}`,
            title: p.title,
            category: p.category || `${servicePools[targetKey].name} — 2026`,
            service: servicePools[targetKey].name,
            discipline: targetKey,
            imageUrl: p.imageUrl || 'assets/images/hamlet/hamlet-estate.jpg',
            projectUrl: 'work.html',
            desc: p.description || '',
            specs: {
              client: p.client || 'Commissioned Project',
              scope: p.scope || 'Design + Build',
              team: 'RDVS Design Team',
              area: p.area || '—',
              year: p.year || '2026',
              disciplines: p.disciplines || [servicePools[targetKey].name]
            }
          };

          if (p.videoUrl) {
            formatted.videoUrl = p.videoUrl;
            servicePools[targetKey].videos.unshift(formatted);
          } else {
            servicePools[targetKey].images.unshift(formatted);
          }
        });
        console.log('[RDVS Sanity] Live hero projects connected:', sanityHero.length);
      }
    } catch (e) {
      console.warn('[RDVS Sanity] Falling back to default project pool:', e);
    }
  }

  // ─── News slides: the first 3 items from the news section always lead the slideshow ───
  // Fallback snapshot mirrors news.html (applies on file:// where fetch is blocked).
  const staticNewsSlides = [
    {
      id: 'news-website-update',
      title: 'We have updated our website',
      category: 'Studio Dispatch — 2026',
      service: 'Studio Dispatch',
      discipline: 'news',
      imageUrl: 'assets/images/hamlet/hamlet-estate-desktop.jpg',
      imageMobileUrl: 'assets/images/hamlet/hamlet-estate-mobile.jpg',
      projectUrl: 'we-have-updated-our-website.html',
      desc: 'RDVS Studios launches an updated digital platform documenting our multidisciplinary architecture, interior design, 3D visualization, visual effects, and turnkey build practices.',
      specs: {
        client: 'RDVS Studios',
        scope: 'News / Editorial',
        team: 'RDVS Design Team',
        area: '—',
        year: '2026',
        disciplines: ['Studio News']
      }
    }
  ];

  /**
   * Best-effort read of the first items from the news section of news.html.
   * Falls back to the static snapshot when fetch is unavailable (file://).
   */
  async function fetchNewsSlideEntries(limit = 3) {
    try {
      const res = await fetch('news.html', { cache: 'no-cache' });
      if (!res.ok) return staticNewsSlides;
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const cards = doc.querySelectorAll('section.minimal-grid .grid-card');
      const entries = [];
      for (const card of cards) {
        if (entries.length >= limit) break;
        const link = card.querySelector('a[href]');
        const titleEl = card.querySelector('.card-title');
        if (!link || !titleEl) continue;

        const catEl = card.querySelector('.project-category');
        const descEl = card.querySelector('.project-desc');
        const img = card.querySelector('img');
        const source = card.querySelector('source[srcset]');

        const catText = (catEl ? catEl.textContent : '').trim(); // e.g. "Studio / 2026"
        const parts = catText.split('/').map(s => s.trim());
        const servicePart = parts[0] || 'Studio';
        const year = (catText.match(/\d{4}/) || [])[0] || '2026';

        entries.push({
          id: `news-${entries.length}-${(link.getAttribute('href') || '').replace(/[^a-z0-9]+/gi, '-')}`,
          title: titleEl.textContent.trim(),
          category: `${servicePart} — ${year}`,
          service: servicePart,
          discipline: 'news',
          imageUrl: img ? (img.getAttribute('src') || '') : '',
          imageMobileUrl: source ? source.getAttribute('srcset') : (img ? img.getAttribute('src') : ''),
          projectUrl: link.getAttribute('href'),
          desc: descEl ? descEl.textContent.trim() : '',
          specs: {
            client: 'RDVS Studios',
            scope: 'News / Editorial',
            team: 'RDVS Design Team',
            area: '—',
            year: year,
            disciplines: ['Studio News']
          }
        });
      }
      return entries.length > 0 ? entries : staticNewsSlides;
    } catch (e) {
      // file:// protocol blocks fetch — use the static snapshot
      return staticNewsSlides;
    }
  }

  const newsSlides = (await fetchNewsSlideEntries(3)).slice(0, 3);

  // Generate the remaining slides: a fresh random draw from each of the service pools —
  // the four disciplines plus the Products page — distributed equally. News slides always
  // occupy the front, so the budget adapts to their count.
  const serviceKeys = ['architecture', 'interiors', 'vfx', 'motion', 'products'];
  const TOTAL_SLIDE_BUDGET = 20;

  // Drawn again on every page load, so a refresh — or the automatic reload that fires when
  // the deck reaches slide 20 — shows a different cut of the work instead of replaying the
  // same twenty. Fisher-Yates over a copy; the pools stay as curated.
  function shuffled(list) {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
  function drawOf(key) {
    const pool = servicePools[key] || {};
    return shuffled([...(pool.videos || []), ...(pool.images || [])]);
  }

  // "After the 20 slide in the slideshow on the home page, let's implement an automatic
  // page refresh." Because each load re-draws the deck, this reload is what keeps the
  // slideshow running indefinitely on fresh material: slide 20 ends, the page reloads and
  // a new draw starts at slide one, picking up new work and news on the way.
  const AUTO_REFRESH_AFTER_SLIDE = TOTAL_SLIDE_BUDGET;
  const AUTO_REFRESH_MIN_GAP_MS = 30000;
  let autoRefreshQueued = false;

  function requestDeckRefresh() {
    if (autoRefreshQueued) return false;
    try {
      const last = Number(sessionStorage.getItem('rdvs-deck-refreshed-at') || 0);
      if (Date.now() - last < AUTO_REFRESH_MIN_GAP_MS) return false;
      sessionStorage.setItem('rdvs-deck-refreshed-at', String(Date.now()));
    } catch (e) {
      // Storage unavailable: the once-per-page-life flag below still prevents looping
    }
    autoRefreshQueued = true;
    window.location.reload();
    return true;
  }

  const projectSlotBudget = Math.max(TOTAL_SLIDE_BUDGET - newsSlides.length, 0);
  const basePerService = Math.floor(projectSlotBudget / serviceKeys.length);
  let remainder = projectSlotBudget - basePerService * serviceKeys.length;

  // A work now contributes up to three entries to the pool — its film, a GIF, its best
  // stills — so the draw is over PROJECTS, not entries: each service's entries are grouped
  // by work, a work is picked at random, and one entry is taken from inside its group.
  // Selecting entries directly would make a work with three entries three times as likely
  // to show as a work with one. A work may still appear twice per deck (MAX_PER_PROJECT),
  // never on consecutive slides, and never next to its own news slide.
  const slideKey = (entry) => entry.projectUrl || entry.id || entry.title;
  const MAX_PER_PROJECT = 2;
  const claims = new Map(newsSlides.map(entry => [slideKey(entry), MAX_PER_PROJECT]));
  const claimable = (entry) => (claims.get(slideKey(entry)) || 0) < MAX_PER_PROJECT;
  const claim = (entry) => {
    const key = slideKey(entry);
    claims.set(key, (claims.get(key) || 0) + 1);
  };

  // Groups come from drawOf(), which already shuffles the pool, so the entry sitting at the
  // head of a group is a random pick from that work's media.
  function groupsOf(key) {
    const groups = new Map();
    for (const entry of drawOf(key)) {
      const id = slideKey(entry);
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(entry);
    }
    return groups;
  }
  const groups = {};
  serviceKeys.forEach(key => { groups[key] = groupsOf(key); });

  const drawnProjects = [];
  // Which service absorbs the odd slot is part of the draw as well, so the split of the
  // deck is not pinned to the order of serviceKeys.
  const serviceOrder = shuffled(serviceKeys);

  serviceOrder.forEach(key => {
    const quota = basePerService + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;

    let taken = 0;
    for (const id of shuffled([...groups[key].keys()])) {
      if (taken >= quota) break;
      const group = groups[key].get(id);
      if (!group.length || !claimable(group[0])) continue;
      const entry = group.pop();
      claim(entry);
      drawnProjects.push(entry);
      taken++;
    }
  });

  // Top-up only fires when a draw underfills. The leftovers from every service are pooled
  // and shuffled, so even the fill order is not a fixed sweep of the pools.
  if (newsSlides.length + drawnProjects.length < TOTAL_SLIDE_BUDGET) {
    const leftovers = [];
    serviceKeys.forEach(key => groups[key].forEach(group => leftovers.push(...group)));
    for (const entry of shuffled(leftovers)) {
      if (newsSlides.length + drawnProjects.length >= TOTAL_SLIDE_BUDGET) break;
      if (!claimable(entry)) continue;
      claim(entry);
      drawnProjects.push(entry);
    }
  }

  // News items always run first; the works behind them play in random order, with a swap
  // pass so the same work never occupies two consecutive slides.
  function spreadRepeats(list) {
    for (let i = 1; i < list.length; i++) {
      if (slideKey(list[i]) !== slideKey(list[i - 1])) continue;
      // Try every slot that is not directly beside its twin — forward first, then
      // backward, so a repeat sitting on the last two slides can still be separated.
      const forward = [];
      for (let j = i + 1; j < list.length; j++) {
        if (slideKey(list[j]) !== slideKey(list[i])) forward.push(j);
      }
      const backward = [];
      for (let j = i - 1; j >= 1; j--) {
        if (slideKey(list[j]) !== slideKey(list[i]) && slideKey(list[j - 1]) !== slideKey(list[i])) {
          backward.push(j);
        }
      }
      const slots = [...forward, ...backward];
      if (!slots.length) continue;
      const moved = list.splice(i, 1)[0];
      list.splice(slots[0], 0, moved);
    }
    return list;
  }

  const projects = spreadRepeats([...newsSlides, ...shuffled(drawnProjects)]);

  // Check URL query or hash call for specific project (e.g. ?project=1957 or #1957)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedProject = urlParams.get('project') || urlParams.get('slide') || window.location.hash.replace('#', '');
    if (requestedProject) {
      const norm = requestedProject.toLowerCase().trim();
      const slugOf = p => (p.projectUrl || '').toLowerCase().replace(/^.*\//, '').replace(/\.html$/, '');
      // '1H' is a prefix of '1Hive', so the closest match wins rather than the first one the
      // scan happens to reach. Exact title, id or page slug beats a prefix, which beats a
      // substring anywhere in the string.
      const scoreOf = p => {
        const title = (p.title || '').toLowerCase();
        const id = (p.id || '').toLowerCase();
        const slug = slugOf(p);
        if (title === norm || id === norm || slug === norm) return 0;
        if (title.startsWith(norm) || id.startsWith(norm) || slug.startsWith(norm)) return 1;
        if (title.includes(norm) || id.includes(norm) || slug.includes(norm)) return 2;
        return 3;
      };
      let matchedProj = null;
      let bestScore = 3;
      for (const key of serviceKeys) {
        const allInPool = [...(servicePools[key].videos || []), ...(servicePools[key].images || [])];
        for (const p of allInPool) {
          const score = scoreOf(p);
          if (score < bestScore) {
            bestScore = score;
            matchedProj = p;
          }
        }
      }
      if (matchedProj) {
        const existingIdx = projects.findIndex(p => p.id === matchedProj.id || p.title === matchedProj.title);
        if (existingIdx > -1) {
          projects.splice(existingIdx, 1);
        }
        projects.unshift(matchedProj);
      }
    }
  } catch (e) {
    console.warn('[RDVS Slideshow] URL project selection error:', e);
  }

  // DOM Elements
  const slides = document.querySelectorAll('.slide');
  const captionCards = document.querySelectorAll('.caption-card');
  const paginationBars = document.querySelectorAll('.pagination-bar');
  const statusActive = document.querySelector('.status-active');
  const statusTotal = document.querySelector('.status-total');
  const prevBtn = document.querySelector('.step-btn.prev');
  const nextBtn = document.querySelector('.step-btn.next');
  const heroViewport = document.querySelector('.hero-viewport');

  // Minimalist Volume Controls
  const heroVolumeControl = document.getElementById('heroVolumeControl');
  const volumeToggleBtn = document.getElementById('volumeToggleBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  let sharedMuted = true;
  let sharedVolume = 0.75;

  function updateVolumeUI(isMuted, vol) {
    if (!heroVolumeControl) return;
    const iconMuted = heroVolumeControl.querySelector('.icon-muted');
    const iconUnmuted = heroVolumeControl.querySelector('.icon-unmuted');

    if (volumeSlider) {
      volumeSlider.value = isMuted ? 0 : vol;
      const pct = (isMuted ? 0 : vol) * 100;
      volumeSlider.style.background = `linear-gradient(to right, #ffffff ${pct}%, rgba(255, 255, 255, 0.2) ${pct}%)`;
    }

    if (iconMuted && iconUnmuted) {
      if (isMuted || vol === 0) {
        iconMuted.style.display = 'block';
        iconUnmuted.style.display = 'none';
      } else {
        iconMuted.style.display = 'none';
        iconUnmuted.style.display = 'block';
      }
    }
  }

  // Bind Hero Volume Controls
  if (volumeToggleBtn && volumeSlider) {
    volumeToggleBtn.addEventListener('click', () => {
      const activeSlide = slides[currentIndex];
      const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;

      sharedMuted = !sharedMuted;
      if (!sharedMuted && sharedVolume <= 0.05) {
        sharedVolume = 0.75;
      }

      if (activeVideo) {
        activeVideo.muted = sharedMuted;
        activeVideo.volume = sharedMuted ? 0 : sharedVolume;
      }

      updateVolumeUI(sharedMuted, sharedVolume);
    });

    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const activeSlide = slides[currentIndex];
      const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;

      if (val === 0) {
        sharedMuted = true;
      } else {
        sharedMuted = false;
        sharedVolume = val;
      }

      if (activeVideo) {
        activeVideo.muted = sharedMuted;
        activeVideo.volume = sharedMuted ? 0 : sharedVolume;
      }

      updateVolumeUI(sharedMuted, sharedVolume);
    });
  }

  // Spec Drawer Elements — the row set is generated from each project page's own
  // specification panel, so only the list container and the project name are wired by id.
  const specDrawer = document.getElementById('specDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerClose');
  const specTriggers = document.querySelectorAll('.project-spec-trigger');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerSpecList = document.getElementById('specList');

  // Rows whose value is a list read as chips; everything else is a sentence.
  const DRAWER_CHIP_LABELS = ['Services', 'Disciplines'];

  // Field order used when a slide has no page to read (external link, offline): the
  // pool entry's baked specs stand in, and any row without a value is dropped rather
  // than rendered blank.
  const DRAWER_FALLBACK_FIELDS = [
    ['Client', 'client'],
    ['Location', 'location'],
    ['Area', 'area'],
    ['Year', 'year'],
    ['Scope', 'scope'],
    ['Team', 'team'],
    ['Disciplines', 'disciplines'],
  ];

  function splitDrawerList(value) {
    const separator = value.includes('\u00b7') ? '\u00b7' : (value.includes(',') ? ',' : null);
    if (!separator) return [value];
    return value.split(separator).map(part => part.trim()).filter(Boolean);
  }

  function buildDrawerRow(label, value) {
    const row = document.createElement('div');
    row.className = 'spec-row';
    const labelEl = document.createElement('span');
    labelEl.className = 'spec-label';
    labelEl.textContent = label;
    row.appendChild(labelEl);

    if (DRAWER_CHIP_LABELS.includes(label)) {
      const chips = document.createElement('div');
      chips.className = 'spec-disciplines';
      splitDrawerList(value).forEach(item => {
        const chip = document.createElement('span');
        chip.className = 'spec-discipline-item';
        chip.textContent = item;
        chips.appendChild(chip);
      });
      row.appendChild(chips);
      return row;
    }

    const valueEl = document.createElement('span');
    valueEl.className = 'spec-value';
    valueEl.textContent = value;
    row.appendChild(valueEl);
    return row;
  }

  function renderDrawerSpecs(project) {
    if (!drawerSpecList || !project) return;
    const rows = (project.specRows && project.specRows.length)
      ? project.specRows
      : DRAWER_FALLBACK_FIELDS
          .map(([label, field]) => {
            const raw = project.specs ? project.specs[field] : undefined;
            return [label, Array.isArray(raw) ? raw.join(' \u00b7 ') : String(raw || '').trim()];
          })
          .filter(([, value]) => value && value !== '\u2014');
    drawerSpecList.innerHTML = '';
    rows.forEach(([label, value]) => drawerSpecList.appendChild(buildDrawerRow(label, value)));
  }

  // A slide's date line. Product pages (and any work the studio has not dated) state no year,
  // and printing 2026 for them would claim a date the page never gives -- so the segment is
  // simply left off. Both caption sites build the line through here for that reason.
  function categoryLine(service, yr) {
    return yr
      ? `<span class="service-name">${service}</span> &mdash; ${yr}`
      : `<span class="service-name">${service}</span>`;
  }

  // Dynamically populate randomized slides into the DOM
  function populateRandomizedSlides() {
    const isMobileViewport = window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;

    projects.forEach((proj, idx) => {
      // 1. Update photographic or cinematic video slide (dual mobile portrait & desktop widescreen)
      if (slides[idx]) {
        slides[idx].setAttribute('aria-label', proj.title);
        const mediaContainer = slides[idx].querySelector('.slide-media');
        if (mediaContainer) {
          if (proj.videoUrl) {
            if ((proj.is360 || proj.videoUrl.includes('360')) && window.VR360) {
              mediaContainer.innerHTML = '';
              const vrWrap = document.createElement('div');
              vrWrap.className = 'slide-vr-wrapper vr-360-container';
              vrWrap.style.width = '100%';
              vrWrap.style.height = '100%';
              mediaContainer.appendChild(vrWrap);

              const vid = document.createElement('video');
              vid.className = 'slide-video';
              vid.src = proj.videoUrl;
              vid.poster = proj.imageUrl || '';
              vid.muted = true;
              vid.playsInline = true;
              vid.setAttribute('playsinline', '');
              vid.preload = 'auto';
              vrWrap.appendChild(vid);

              slides[idx]._vrViewer = window.VR360.create(vrWrap, {
                videoElement: vid,
                isVideo: true,
                autoplay: false,
                muted: true,
                loop: false,
                autoRotate: true,
                autoRotateSpeed: 0.04,
                showControls: true,
                showDpad: true,
                showZoom: true,
                showBadge: true,
                showDragHint: true
              });
            } else {
              const deskVid = proj.videoUrlDesktop || proj.videoUrl;
              const mobVid = proj.videoMobileUrl || proj.videoUrl;
              const deskPoster = proj.imageUrlDesktop || proj.imageUrl || '';
              const mobPoster = proj.imageMobileUrl || proj.imageUrl || '';
              const activeVid = isMobileViewport && mobVid ? mobVid : deskVid;
              const activePoster = isMobileViewport && mobPoster ? mobPoster : deskPoster;

              mediaContainer.innerHTML = `
                <video class="slide-video" src="${activeVid}" poster="${activePoster}" muted playsinline preload="auto">
                  <source media="(max-width: 768px)" src="${mobVid}" type="video/mp4">
                  <source src="${deskVid}" type="video/mp4">
                </video>
              `;
            }

          } else {
            const deskImg = proj.imageUrlDesktop || proj.imageUrl;
            const mobImg = proj.imageMobileUrl || proj.imageUrl;

            mediaContainer.innerHTML = `
              <picture class="slide-picture">
                <source media="(max-width: 768px)" srcset="${mobImg}">
                <img src="${deskImg}" alt="${proj.title}" class="slide-img" ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
              </picture>
            `;
          }
        }
      }

      // 2. Update lower-third caption card with thin service name
      if (captionCards[idx]) {

        const catEl = captionCards[idx].querySelector('.project-category');
        const titleEl = captionCards[idx].querySelector('.project-title');
        const actionLink = captionCards[idx].querySelector('.project-action-link');
        const specTrigger = captionCards[idx].querySelector('.project-spec-trigger');

        if (catEl) {
          const serviceName = slideServiceName(proj);
          const yr = proj.category && proj.category.includes('—') ? proj.category.split('—')[1].trim() : '';
          catEl.innerHTML = categoryLine(serviceName, yr);
        }
        if (titleEl) titleEl.textContent = proj.title;
        if (actionLink) {
          actionLink.href = proj.projectUrl || 'work.html';
          actionLink.innerHTML = proj.discipline === 'news' ? 'Read article &rarr;'
            : proj.discipline === 'products' ? 'View product &rarr;' : 'View project &rarr;';
        }
        if (specTrigger) {
          specTrigger.setAttribute('data-index', idx);
        }
      }
    });
  }

  // Dynamic Project Information Synchronization from Project Pages
  // The homepage slides mirror each project page's header — the <h1 class="project-page-title">
  // and the <span class="project-meta-line"> (service & year) — so editing a project page
  // immediately reflects on its homepage slide.
  const projectPageInfoCache = new Map();

  function decodePageText(raw) {
    // Credit rows list one role per <br>; collapsing them straight to text would read as a
    // run-on sentence, so each break becomes the same ' | ' separator pages use inline.
    const temp = document.createElement('div');
    temp.innerHTML = raw.replace(/<br\s*\/?>/gi, ' | ');
    return temp.textContent
      .split('|')
      .map(segment => segment.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join(' | ');
  }

  /**
   * Reads a project page's own specification panel — every .project-spec-item as a
   * [label, value] pair, in the order the page lists them. The Services row holds a link
   * list rather than a sentence, so its anchors are rejoined with the same middot the
   * page uses as a separator.
   */
  function parseProjectSpecRows(html) {
    const panel = html.match(/class="[^"]*project-specs-grid[^"]*"[^>]*>([\s\S]*?)<\/aside>/i);
    if (!panel) return [];
    const chunks = panel[1].split(/<div\b[^>]*class="[^"]*project-spec-item[^"]*"[^>]*>/i).slice(1);
    const rows = [];
    chunks.forEach(chunk => {
      const labelMatch = chunk.match(/class="[^"]*project-spec-label[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
      const valueMatch = chunk.match(/class="[^"]*project-spec-val[^"]*"[^>]*>([\s\S]*)$/i);
      if (!labelMatch || !valueMatch) return;
      const serviceLinks = [...valueMatch[1].matchAll(/<a\b[^>]*class="[^"]*project-service[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)]
        .map(link => decodePageText(link[1]));
      const label = decodePageText(labelMatch[1]);
      const value = serviceLinks.length ? serviceLinks.join(' \u00b7 ') : decodePageText(valueMatch[1]);
      if (label && value) rows.push([label, value]);
    });
    return rows;
  }

  /**
   * The filter keys behind a page's Services row links (`work.html?service=interior-design`).
   * Keys rather than labels: the slide rolls them up to main services, and labels get renamed
   * while keys do not. Only the specification panel is read — it is the only place a project
   * page links a service.
   */
  function parseProjectServiceKeys(html) {
    const panel = html.match(/class="[^"]*project-specs-grid[^"]*"[^>]*>[\s\S]*?<\/aside>/i);
    if (!panel) return [];
    return [...panel[0].matchAll(/[?&]service=([a-z0-9-]+)/gi)].map(found => found[1]);
  }

  /**
   * Fetches the header information (title, service, year) directly from a project's HTML page.
   */
  async function fetchProjectPageInfo(projectUrl) {
    if (!projectUrl || projectUrl === 'work.html' || projectUrl.startsWith('http')) {
      return null;
    }
    if (projectPageInfoCache.has(projectUrl)) {
      return projectPageInfoCache.get(projectUrl);
    }
    try {
      const res = await fetch(projectUrl, { cache: 'no-cache' });
      if (!res.ok) return null;
      const html = await res.text();
      const info = {};

      const titleMatch = html.match(/<h1[^>]*class=["'][^"']*project-page-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i) ||
                         html.match(/<header[^>]*class=["'][^"']*project-hero-header[^"']*["'][^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
                         html.match(/<main[^>]*class=["'][^"']*project-detail-container[^"']*["'][^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
                         html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (titleMatch && titleMatch[1]) {
        const pageTitle = decodePageText(titleMatch[1]);
        if (pageTitle) info.title = pageTitle;
      }

      const metaMatch = html.match(/<span[^>]*class=["'][^"']*project-meta-line[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
      if (metaMatch && metaMatch[1]) {
        const metaText = decodePageText(metaMatch[1]);
        const dashIndex = metaText.indexOf('—');
        if (dashIndex > -1) {
          const left = metaText.slice(0, dashIndex).trim();
          const right = metaText.slice(dashIndex + 1).trim();
          const yearMatch = right.match(/\b(19|20)\d{2}\b/);
          if (yearMatch) info.year = yearMatch[0];
          const segments = left.split('/').map(s => s.trim()).filter(Boolean);
          const service = (segments.length ? segments[segments.length - 1] : left).trim();
          // A meta line that repeats the same term on both sides of the slash
          // ("Architecture / Architecture") is legacy template copy and carries no
          // real service information — keep the curated service, adopt only the year.
          const isTemplateService = segments.length > 1 &&
            segments[0].toLowerCase() === service.toLowerCase();
          if (service && !isTemplateService) info.service = service;
        }
      }

      const specRows = parseProjectSpecRows(html);
      info.serviceKeys = parseProjectServiceKeys(html);
      if (specRows.length) {
        info.specRows = specRows;
        const byLabel = Object.fromEntries(specRows);
        // Keep the baked specs object in step: the drawer falls back to these fields if a
        // later page read fails, and the deck's offline paint is ordered by specs.year.
        info.specs = {
          client: byLabel['Client'],
          location: byLabel['Location'],
          area: byLabel['Area'] || byLabel['Built-Up Area'] || byLabel['Site Area'],
          scope: byLabel['Scope of Services'] || byLabel['Scope'],
          team: byLabel['Team'],
          year: byLabel['Completion'] || byLabel['Year'] || info.year,
        };
      }

      if (Object.keys(info).length) {
        projectPageInfoCache.set(projectUrl, info);
        return info;
      }
    } catch (e) {
      // In file:// protocol or offline, gracefully retain the baked project data
    }
    return null;
  }

  function applyLiveInfoToSlide(idx, info) {
    const proj = projects[idx];
    if (!proj || !info) return;

    // 1. Title — the project page header wins
    if (info.title && info.title !== proj.title) {
      proj.title = info.title;
      if (captionCards[idx]) {
        const titleEl = captionCards[idx].querySelector('.project-title');
        if (titleEl) titleEl.textContent = info.title;
      }
      if (slides[idx]) {
        slides[idx].setAttribute('aria-label', info.title);
        const img = slides[idx].querySelector('img');
        if (img) img.alt = info.title;
      }
    }
    // 2. Service + year mirrored from the page meta line. The caption does not print that
    // mirror: it names only the main services the page's own Services row rolls up to, so
    // editing a page's tags moves its slide without putting sub-services back on the deck.
    if (info.service || info.year || (info.serviceKeys && info.serviceKeys.length)) {
      if (info.service) proj.service = info.service;
      if (info.year && proj.specs) proj.specs.year = info.year;
      if (info.serviceKeys && info.serviceKeys.length && proj.projectUrl) {
        PROJECT_MAIN_SERVICES[proj.projectUrl] = rollUpMainServices(info.serviceKeys);
      }

      const existingYear = proj.category && proj.category.includes('—') ? proj.category.split('—')[1].trim() : '';
      const yr = info.year || existingYear;
      proj.category = yr ? `${proj.service || ''} — ${yr}` : (proj.service || '');

      if (captionCards[idx]) {
        const catEl = captionCards[idx].querySelector('.project-category');
        if (catEl) {
          catEl.innerHTML = categoryLine(slideServiceName(proj, info.serviceKeys), yr);
        }
      }
    }

    // 3. Details — the page's specification panel becomes the drawer's row set, and its
    // scalar fields also overwrite the baked pool specs so the fallback cannot disagree.
    if (info.specRows && info.specRows.length) {
      proj.specRows = info.specRows;
      if (info.specs) {
        proj.specs = proj.specs || {};
        Object.entries(info.specs).forEach(([field, value]) => {
          if (value) proj.specs[field] = value;
        });
      }
    }

    if (specDrawer && specDrawer.classList.contains('open') && currentIndex === idx) {
      renderDrawerSpecs(proj);
      if (drawerTitle) drawerTitle.textContent = proj.title;
    }
  }

  function syncSlideInfoFromProjectPages() {
    // 1. Fetch active slide first for immediate update
    if (projects.length > 0 && projects[0] && projects[0].projectUrl) {
      fetchProjectPageInfo(projects[0].projectUrl).then(info => {
        if (info) applyLiveInfoToSlide(0, info);
      });
    }

    // 2. Concurrently fetch all remaining slides
    projects.forEach((proj, idx) => {
      if (idx === 0 || !proj || !proj.projectUrl) return;
      fetchProjectPageInfo(proj.projectUrl).then(info => {
        if (info) applyLiveInfoToSlide(idx, info);
      });
    });
  }

  // Populate slides with the randomized selection immediately
  populateRandomizedSlides();
  syncSlideInfoFromProjectPages();

  let currentIndex = 0;
  const totalSlides = Math.min(slides.length, projects.length);
  const DEFAULT_IMAGE_DURATION = 6000; // 6 seconds for image slides
  const MAX_VIDEO_DURATION = 30; // 30 seconds maximum for video slides
  let slideTimer = null;
  let progressInterval = null;
  let activeVideoCleanup = null;
  let imageElapsed = 0;
  let imageStartTime = 0;
  let isPaused = false;

  function clearSlideTimer() {
    if (slideTimer) {
      clearTimeout(slideTimer);
      slideTimer = null;
    }
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    if (typeof activeVideoCleanup === 'function') {
      activeVideoCleanup();
      activeVideoCleanup = null;
    }
  }

  function initCarousel() {
    if (statusTotal) {
      statusTotal.textContent = String(totalSlides).padStart(2, '0');
    }
    updateSlide(0);
    setupEventListeners();
  }

  function updateSlide(newIndex, autoAdvance = false) {
    clearSlideTimer();
    imageElapsed = 0;

    if (newIndex < 0) {
      currentIndex = totalSlides - 1;
    } else if (newIndex >= totalSlides) {
      // End of the deck: the automatic run refreshes the page instead of looping
      // (manual stepping still wraps to slide one). See AUTO_REFRESH_AFTER_SLIDE.
      if (autoAdvance && totalSlides >= AUTO_REFRESH_AFTER_SLIDE && requestDeckRefresh()) return;
      currentIndex = 0;
    } else {
      currentIndex = newIndex;
    }

    // Sync title from project page for the active slide if available
    const activeProject = projects[currentIndex];
    if (activeProject && activeProject.projectUrl) {
      if (projectPageInfoCache.has(activeProject.projectUrl)) {
        applyLiveInfoToSlide(currentIndex, projectPageInfoCache.get(activeProject.projectUrl));
      } else {
        fetchProjectPageInfo(activeProject.projectUrl).then(info => {
          if (info) applyLiveInfoToSlide(currentIndex, info);
        });
      }
    }

    // Update slides & strictly pause/reset non-active videos
    slides.forEach((slide, idx) => {
      const isActive = idx === currentIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

      if (slide._vrViewer) {
        if (!isActive) {
          slide._vrViewer.pause();
        } else {
          slide._vrViewer.resume();
        }
      }

      const vid = slide.querySelector('video');
      if (vid) {
        const proj = projects[idx];
        if (isActive && proj && !proj.is360 && proj.videoMobileUrl) {
          const isMobileNow = window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
          const targetSrc = isMobileNow ? proj.videoMobileUrl : (proj.videoUrlDesktop || proj.videoUrl);
          if (targetSrc && !vid.src.endsWith(targetSrc)) {
            vid.src = targetSrc;
          }
        }
        vid.pause();
        vid.currentTime = 0;
        vid.loop = false; // Strictly do not loop
      }
    });

    // Captions
    captionCards.forEach((card, idx) => {
      card.classList.toggle('active', idx === currentIndex);
    });

    // Hairline Pagination
    paginationBars.forEach((bar, idx) => {
      bar.classList.toggle('active', idx === currentIndex);
      bar.setAttribute('aria-selected', idx === currentIndex ? 'true' : 'false');
      const fill = bar.querySelector('.pagination-fill');
      if (fill) {
        fill.style.width = idx === currentIndex ? '0%' : (idx < currentIndex ? '100%' : '0%');
      }
    });

    // Counter (e.g. "01", "10")
    if (statusActive) {
      statusActive.textContent = String(currentIndex + 1).padStart(2, '0');
    }

    startCurrentSlide();
  }

  function startCurrentSlide() {
    clearSlideTimer();

    const activeSlide = slides[currentIndex];
    if (!activeSlide) return;

    const activeBar = paginationBars[currentIndex];
    const activeFill = activeBar ? activeBar.querySelector('.pagination-fill') : null;
    const activeVideo = activeSlide.querySelector('video');

    if (activeVideo) {
      /**
       * VIDEO SLIDE LOGIC:
       * - "play only 30 seconds of the video if it is more than 30 seconds"
       * - "for those less than 30 seconds play the video once and move to the next slide"
       * - "don't loop"
       * - Minimalist Volume Controls display & synchronization
       */
      if (heroVolumeControl) {
        heroVolumeControl.classList.add('visible');
      }
      activeVideo.loop = false;
      activeVideo.currentTime = 0;
      activeVideo.muted = sharedMuted;
      activeVideo.volume = sharedMuted ? 0 : sharedVolume;
      updateVolumeUI(sharedMuted, sharedVolume);

      let advanced = false;
      const advanceToNext = () => {
        if (advanced) return;
        advanced = true;
        clearSlideTimer();
        updateSlide(currentIndex + 1, true);
      };

      const getTargetDuration = () => {
        const d = activeVideo.duration;
        if (d && !isNaN(d) && d > 0) {
          return Math.min(d, MAX_VIDEO_DURATION);
        }
        return MAX_VIDEO_DURATION;
      };

      let targetDuration = getTargetDuration();

      const onTimeUpdate = () => {
        targetDuration = getTargetDuration();
        const cur = activeVideo.currentTime;
        const progress = Math.min((cur / targetDuration) * 100, 100);
        if (activeFill) {
          activeFill.style.width = `${progress}%`;
        }

        // Rule: If video exceeds 30 seconds, advance immediately at 30 seconds
        if (cur >= MAX_VIDEO_DURATION) {
          advanceToNext();
        }
      };

      const onEnded = () => {
        // Rule: For videos <= 30 seconds, play once and move to next slide
        if (activeFill) activeFill.style.width = '100%';
        advanceToNext();
      };

      const onLoadedMetadata = () => {
        targetDuration = getTargetDuration();
      };

      const onError = () => {
        console.warn('[RDVS Slideshow] Video error on slide ' + currentIndex + ', falling back to image duration.');
        let startTime = Date.now();
        progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const prog = Math.min((elapsed / DEFAULT_IMAGE_DURATION) * 100, 100);
          if (activeFill) activeFill.style.width = `${prog}%`;
          if (prog >= 100) clearInterval(progressInterval);
        }, 40);
        slideTimer = setTimeout(advanceToNext, DEFAULT_IMAGE_DURATION);
      };

      activeVideo.addEventListener('timeupdate', onTimeUpdate);
      activeVideo.addEventListener('ended', onEnded);
      activeVideo.addEventListener('loadedmetadata', onLoadedMetadata);
      activeVideo.addEventListener('error', onError);

      // Play video
      const playPromise = activeVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('[RDVS Slideshow] Video autoplay prevented:', err);
          // If browser policy prevents unmuted autoplay, run timer for targetDuration
          let startTime = Date.now();
          const fallbackDuration = targetDuration * 1000;
          progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const prog = Math.min((elapsed / fallbackDuration) * 100, 100);
            if (activeFill) activeFill.style.width = `${prog}%`;
            if (prog >= 100) clearInterval(progressInterval);
          }, 40);
          slideTimer = setTimeout(advanceToNext, fallbackDuration);
        });
      }

      // Safety timeout: guaranteed transition even if events are not dispatched
      slideTimer = setTimeout(advanceToNext, (MAX_VIDEO_DURATION + 1) * 1000);

      activeVideoCleanup = () => {
        activeVideo.removeEventListener('timeupdate', onTimeUpdate);
        activeVideo.removeEventListener('ended', onEnded);
        activeVideo.removeEventListener('loadedmetadata', onLoadedMetadata);
        activeVideo.removeEventListener('error', onError);
        activeVideo.pause();
      };

    } else {
      /**
       * IMAGE SLIDE LOGIC:
       * - Standard 6-second presentation with smooth hairline progress fill
       */
      if (heroVolumeControl) {
        heroVolumeControl.classList.remove('visible');
      }
      imageStartTime = Date.now() - imageElapsed;
      const remainingTime = Math.max(0, DEFAULT_IMAGE_DURATION - imageElapsed);

      progressInterval = setInterval(() => {
        const elapsed = Date.now() - imageStartTime;
        imageElapsed = elapsed;
        const progress = Math.min((elapsed / DEFAULT_IMAGE_DURATION) * 100, 100);
        if (activeFill) {
          activeFill.style.width = `${progress}%`;
        }
        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 40);

      slideTimer = setTimeout(() => {
        updateSlide(currentIndex + 1, true);
      }, remainingTime);
    }
  }

  function pauseCurrentSlide() {
    isPaused = true;
    if (slideTimer) {
      clearTimeout(slideTimer);
      slideTimer = null;
    }
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    const activeSlide = slides[currentIndex];
    const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;
    if (activeVideo) {
      activeVideo.pause();
    }
  }

  function resumeCurrentSlide() {
    if (!isPaused) return;
    isPaused = false;
    const activeSlide = slides[currentIndex];
    const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;
    if (activeVideo) {
      activeVideo.play().catch(() => {});
    } else {
      startCurrentSlide();
    }
  }

  function setupEventListeners() {
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        updateSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        updateSlide(currentIndex + 1);
      });
    }

    paginationBars.forEach((bar) => {
      bar.addEventListener('click', () => {
        const targetIdx = parseInt(bar.getAttribute('data-index'), 10);
        updateSlide(targetIdx);
      });
    });

    if (heroViewport) {
      heroViewport.addEventListener('mouseenter', pauseCurrentSlide);
      heroViewport.addEventListener('mouseleave', resumeCurrentSlide);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        updateSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateSlide(currentIndex + 1);
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
        } else if (touchEndX > touchStartX + 50) {
          updateSlide(currentIndex - 1);
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


  }

  async function openDrawer(index) {
    const project = projects[index];
    if (!project) return;

    if (project.projectUrl) {
      if (projectPageInfoCache.has(project.projectUrl)) {
        applyLiveInfoToSlide(index, projectPageInfoCache.get(project.projectUrl));
      } else {
        fetchProjectPageInfo(project.projectUrl).then(info => {
          if (info) applyLiveInfoToSlide(index, info);
        });
      }
    }

    if (drawerTitle) drawerTitle.textContent = project.title;
    renderDrawerSpecs(project);

    if (specDrawer) specDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('open');
    pauseCurrentSlide();
  }

  function closeDrawer() {
    if (specDrawer) specDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    resumeCurrentSlide();
  }

  
  // Minimalist volume controls for all standalone video elements across pages
  function initAllPageVideos() {
    const standaloneVideos = document.querySelectorAll('video:not(.slide-video)');
    standaloneVideos.forEach(vid => {
      if (vid.parentElement && !vid.parentElement.querySelector('.video-volume-overlay')) {
        const parent = vid.parentElement;
        const computedPos = window.getComputedStyle(parent).position;
        if (computedPos === 'static') {
          parent.style.position = 'relative';
        }

        const overlay = document.createElement('div');
        overlay.className = 'minimal-volume-control video-volume-overlay visible';
        overlay.innerHTML = `
          <button type="button" class="volume-toggle-btn" aria-label="Mute or unmute video audio" title="Mute / Unmute">
            <svg class="icon-muted" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
            <svg class="icon-unmuted" viewBox="0 0 24 24" style="display: none;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          </button>
          <div class="volume-slider-container">
            <input type="range" class="volume-slider" min="0" max="1" step="0.05" value="${vid.muted ? 0 : vid.volume}" aria-label="Volume level" title="Volume slider">
          </div>
        `;
        parent.appendChild(overlay);

        const btn = overlay.querySelector('.volume-toggle-btn');
        const slider = overlay.querySelector('.volume-slider');
        const iconMuted = overlay.querySelector('.icon-muted');
        const iconUnmuted = overlay.querySelector('.icon-unmuted');

        const updateStandaloneUI = () => {
          const isM = vid.muted || vid.volume === 0;
          iconMuted.style.display = isM ? 'block' : 'none';
          iconUnmuted.style.display = isM ? 'none' : 'block';
          slider.value = isM ? 0 : vid.volume;
          const pct = (isM ? 0 : vid.volume) * 100;
          slider.style.background = `linear-gradient(to right, #ffffff ${pct}%, rgba(255, 255, 255, 0.2) ${pct}%)`;
        };

        btn.addEventListener('click', () => {
          vid.muted = !vid.muted;
          if (!vid.muted && vid.volume === 0) vid.volume = 0.75;
          updateStandaloneUI();
        });

        slider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          vid.volume = val;
          vid.muted = val === 0;
          updateStandaloneUI();
        });

        updateStandaloneUI();
      }
    });
  }

  initAllPageVideos();

  initCarousel();
});
