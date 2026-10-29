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
    '2gs.html': ['design'],
    '3aap.html': ['design', 'turnkey-build', 'vfx-cgi'],
    '41-barham.html': ['design', 'vfx-cgi'],
    '5aap.html': ['design', 'turnkey-build'],
    'a-a.html': ['design', 'vfx-cgi'],
    'abl-reception.html': ['design', 'vfx-cgi'],
    'ackon-desk.html': ['vfx-cgi'],
    'aelius.html': ['design'],
    'afg.html': ['design', 'turnkey-build', 'vfx-cgi'],
    'ahero.html': ['vfx-cgi'],
    'asante-interior-design-presentation.html': ['design', 'vfx-cgi'],
    'avalon.html': ['design', 'vfx-cgi'],
    'baobab-hotel-exteriors.html': ['vfx-cgi'],
    'bfa.html': ['design', 'vfx-cgi'],
    'brownies-place.html': ['design', 'vfx-cgi'],
    'caustics-rnd.html': ['studio-projects', 'vfx-cgi'],
    'ceeander.html': ['design', 'vfx-cgi'],
    'chocolate.html': ['design'],
    'csm.html': ['design', 'vfx-cgi'],
    'd-e-t-a-i-l-s.html': ['studio-projects', 'vfx-cgi'],
    'dela-anyaa.html': ['design'],
    'dyv.html': ['design', 'vfx-cgi'],
    'ehr.html': ['design', 'vfx-cgi'],
    'el-dor.html': ['design', 'vfx-cgi'],
    'ela-b.html': ['design', 'vfx-cgi'],
    'elo-tv.html': ['design'],
    'empire-tower.html': ['design', 'vfx-cgi'],
    'frontier-filling-station.html': ['design', 'vfx-cgi'],
    'funko-ridge.html': ['design'],
    'gh-phot-awards.html': ['design', 'vfx-cgi'],
    'giffard-park.html': ['design', 'vfx-cgi'],
    'glow-in-the-dark.html': ['design', 'vfx-cgi'],
    'hfc-tvc.html': ['design', 'vfx-cgi'],
    'hola.html': ['vfx-cgi'],
    'hubtel.html': ['design', 'vfx-cgi'],
    'imperial-square.html': ['design'],
    'kdmrd.html': ['vfx-cgi'],
    'kuma-residence.html': ['design', 'vfx-cgi'],
    'la-beach-towers.html': ['design', 'vfx-cgi'],
    'lamu.html': ['vfx-cgi'],
    'link-drive-road.html': ['design', 'vfx-cgi'],
    'macord.html': ['design', 'vfx-cgi'],
    'margin.html': ['design', 'vfx-cgi'],
    'mig.html': ['design'],
    'moty.html': ['design', 'vfx-cgi'],
    'mtn.html': ['design', 'vfx-cgi'],
    'naadei-villas.html': ['design'],
    'npa-reception-renders.html': ['bim', 'vfx-cgi'],
    'poconos-bar-grill.html': ['design', 'vfx-cgi'],
    'product-1h.html': ['design', 'vfx-cgi'],
    'product-hg-desk.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-line-e-float-i.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-mound.html': ['design', 'vfx-cgi'],
    'product-s-age.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-sp001.html': ['design', 'studio-projects', 'vfx-cgi'],
    'protea-hotel-airport.html': ['vfx-cgi'],
    'purc.html': ['design', 'turnkey-build'],
    'senya-resort.html': ['vfx-cgi'],
    'stanchart-hq.html': ['vfx-cgi'],
    'stark-glaube.html': ['design'],
    'stellar-bar.html': ['design', 'vfx-cgi'],
    'swipe.html': ['bim', 'design', 'vfx-cgi'],
    'the-fitzgerald.html': ['design', 'vfx-cgi'],
    'the-hamlet-presentation.html': ['design', 'vfx-cgi'],
    'the-saddle.html': ['design', 'vfx-cgi'],
    'the-tea-house.html': ['design'],
    'tower-cascades.html': ['design', 'vfx-cgi'],
    'trumpet-africa-ident.html': ['design'],
    'ttd.html': ['design', 'vfx-cgi'],
    'villa-aggregate.html': ['design', 'vfx-cgi'],
    'watsons-place.html': ['design', 'vfx-cgi'],
    'west-cantonments-igl-presentation.html': ['design', 'vfx-cgi'],
    'yah-kumasi-mall.html': ['design', 'vfx-cgi'],
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
        id: 'details-film-3',
        title: 'Details',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'architecture',
        videoUrl: 'assets/videos/d-e-t-a-i-l-s/details-film.mp4',
        videoUrlDesktop: 'assets/videos/d-e-t-a-i-l-s/details-film.mp4',
        videoMobileUrl: 'assets/videos/d-e-t-a-i-l-s/details-film-mobile.mp4',
        imageUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-2.jpg',
        imageUrlDesktop: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-2.jpg',
        imageMobileUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-2-mobile.jpg',
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
        id: 'funko-kitchen',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        videoUrl: 'assets/videos/funko-ridge/funko-kitchen.mp4',
        videoUrlDesktop: 'assets/videos/funko-ridge/funko-kitchen.mp4',
        videoMobileUrl: 'assets/videos/funko-ridge/funko-kitchen-mobile.mp4',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-4-mobile.jpg',
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
        id: '41-barham-film',
        title: '41 Barham',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        videoUrl: 'assets/videos/41-barham/41-barham-film.mp4',
        videoUrlDesktop: 'assets/videos/41-barham/41-barham-film.mp4',
        videoMobileUrl: 'assets/videos/41-barham/41-barham-film-mobile.mp4',
        imageUrl: 'assets/images/barham/barham-residence.jpg',
        imageUrlDesktop: 'assets/images/barham/barham-residence.jpg',
        imageMobileUrl: 'assets/images/barham/barham-residence-mobile.jpg',
        projectUrl: '41-barham.html',
        desc: 'A twenty-second title sequence held with the project',

        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: 'Architect Kofi Amankwah (Architecture), RDVS (Interior Design & 3D Visualization)',
          year: '2017',
          disciplines: ['Architectural Design', 'Interior Design', '3D Visualization']
        }
      },
      {
        id: 'dyv-film',
        title: 'DYV',
        category: 'Interior Design & Architectural Visualization — 2025',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        videoUrl: 'assets/videos/dyv/dyv-film.mp4',
        videoUrlDesktop: 'assets/videos/dyv/dyv-film.mp4',
        videoMobileUrl: 'assets/videos/dyv/dyv-film-mobile.mp4',
        imageUrl: 'assets/images/dyv/dyv-atrium.jpg',
        imageUrlDesktop: 'assets/images/dyv/dyv-atrium.jpg',
        imageMobileUrl: 'assets/images/dyv/dyv-atrium-mobile.jpg',
        projectUrl: 'dyv.html',
        desc: 'The atrium fly-through: a fifteen-second monochrome push-in through the central atrium: a dense cluster of glowing cylindrical pendants under the domed opening, curved balcony bands rising around it, and lounge groups set among indoor trees. It opens on the same atrium view the gallery holds as its fourth plate, and it is the studio’s own capture posted to Instagram, so it is 1068x720 rather than a master render',
        specs: {
          client: 'DYV Holdings',
          scope: 'Urban Planning, Facade Engineering & 3D Cinematic Renderings',
          team: 'Godsway Kwahmi, RDVS Urban Studio',
          year: '2025',
          disciplines: ['Urban Planning', 'Facade Design', '3D Environmental Rendering']
        }
      },
      {
        id: 'funko-ridge',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        videoUrl: 'assets/videos/funko-ridge/funko-terrace.mp4',
        videoUrlDesktop: 'assets/videos/funko-ridge/funko-terrace.mp4',
        videoMobileUrl: 'assets/videos/funko-ridge/funko-terrace-mobile.mp4',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-4-mobile.jpg',
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
        videoMobileUrl: 'assets/videos/funko-ridge/funko-bedroom-mobile.mp4',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-4-mobile.jpg',
        projectUrl: 'funko-ridge.html',
        desc: 'Terraced hillside residential enclave contoured to natural topographic gradients, minimizing site impact and optimizing panoramic ocean views.',
        specs: {
          client: 'Ridge Estates / Private Client',
          scope: 'Architectural Design, Spatial Design, 3D VFX & Turnkey Delivery',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Architectural Design\', \'Spatial Design\']'
        }
      }

    ],
    images: [
      {
        id: 'purc-9-l1-ut',
        title: 'PURC',
        category: 'Architectural Design — 2012',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/purc/E9OZl1VWQAACIut.jpg',
        imageUrlDesktop: 'assets/images/purc/E9OZl1VWQAACIut.jpg',
        imageMobileUrl: 'assets/images/purc/E9OZl1VWQAACIut-mobile.jpg',
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
        id: 'purc-9-q7-r',
        title: 'PURC',
        category: 'Architectural Design — 2012',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/purc/E9NWq7VWUAAQIJr.jpg',
        imageUrlDesktop: 'assets/images/purc/E9NWq7VWUAAQIJr.jpg',
        imageMobileUrl: 'assets/images/purc/E9NWq7VWUAAQIJr-mobile.jpg',
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
        id: 'funko-ridge-5',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-5.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-5.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-5-mobile.jpg',
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
        id: 'funko-ridge-6',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-hero.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-hero.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-hero-mobile.jpg',
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
        id: 'empire-tower-t-k-o-g-3a',
        title: 'Empire Tower',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/empire-tower/EtVkWAoWgAEV3aY.jpg',
        imageUrlDesktop: 'assets/images/empire-tower/EtVkWAoWgAEV3aY.jpg',
        imageMobileUrl: 'assets/images/empire-tower/EtVkWAoWgAEV3aY-mobile.jpg',
        projectUrl: 'empire-tower.html'
      },
      {
        id: 'dyv-dawn',
        title: 'DYV',
        category: 'Interior Design & Architectural Visualization — 2025',
        service: 'Interior Design & Architectural Visualization',
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
          year: '2025',
          disciplines: ['Urban Planning', 'Facade Design', '3D Environmental Rendering']
        }
      },
      {
        id: 'barham-residence',
        title: '41 Barham',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/barham/E9yFXncXEAEzLJ3-a.jpg',
        imageUrlDesktop: 'assets/images/barham/E9yFXncXEAEzLJ3-a.jpg',
        imageMobileUrl: 'assets/images/barham/E9yFXncXEAEzLJ3-a-mobile.jpg',
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
        id: 'barham-daylight',
        title: '41 Barham',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/barham/E9yFXncXEAEzLJ3-b.jpg',
        imageUrlDesktop: 'assets/images/barham/E9yFXncXEAEzLJ3-b.jpg',
        imageMobileUrl: 'assets/images/barham/E9yFXncXEAEzLJ3-b-mobile.jpg',
        projectUrl: '41-barham.html',
        desc: 'The same rear elevation in daylight, square-on above the lawn: the glass-railed first-floor balcony between the twin gables, dark window frames and a white hoarding across the foreground.',
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
        imageMobileUrl: 'assets/images/imperial-square/imperial-square-1-mobile.jpg',
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
        imageMobileUrl: 'assets/images/frontier-filling-station/frontier-filling-station-1-mobile.jpg',
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
        imageMobileUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-1-mobile.jpg',
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
          disciplines: ['Architectural Design', 'Interior Design', 'Architectural Visualization', 'Graphic Design', 'Design Documentation']
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
        imageMobileUrl: 'assets/images/macord/macord-5-mobile.jpg',
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
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/empire-tower/empire-tower-3.jpg',
        imageUrlDesktop: 'assets/images/empire-tower/empire-tower-3.jpg',
        imageMobileUrl: 'assets/images/empire-tower/empire-tower-3-mobile.jpg',
        projectUrl: 'empire-tower.html'
      },
      {
        id: 'the-saddle-plate1',
        title: 'The Saddle',
        category: 'Architectural Design & Architectural Visualization — 2018',
        service: 'Architectural Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/the-saddle/the-saddle-1.jpg',
        imageUrlDesktop: 'assets/images/the-saddle/the-saddle-1.jpg',
        imageMobileUrl: 'assets/images/the-saddle/the-saddle-1-mobile.jpg',
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
        id: 'funko-ridge-plate1',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-4-mobile.jpg',
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
        id: 'empire-tower-plate1',
        title: 'Empire Tower',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/empire-tower/EtJStmkW4AIP-3M.jpg',
        imageUrlDesktop: 'assets/images/empire-tower/EtJStmkW4AIP-3M.jpg',
        imageMobileUrl: 'assets/images/empire-tower/EtJStmkW4AIP-3M-mobile.jpg',
        projectUrl: 'empire-tower.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for Empire Tower.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and architectural visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Architectural Design\']'
        }
      },

      {
        id: 'dyv-dawn-plate1',
        title: 'DYV',
        category: 'Interior Design & Architectural Visualization — 2025',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/dyv/dyv-panoramic-header.jpg',
        imageUrlDesktop: 'assets/images/dyv/dyv-panoramic-header.jpg',
        imageMobileUrl: 'assets/images/dyv/dyv-panoramic-header-mobile.jpg',
        projectUrl: 'dyv.html',
        desc: 'An iconic multi-tiered mixed-use urban gateway designed to maximize natural airflow, communal terrace courtyards, and sustainable coastal resilience.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design',
          team: 'RDVS Team',
          year: '2025',
          disciplines: '[\'Architectural Design\']'
        }
      },
      {
        id: 'details-film',
        title: 'Details',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-2.jpg',
        imageUrlDesktop: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-2.jpg',
        imageMobileUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-2-mobile.jpg',
        projectUrl: 'd-e-t-a-i-l-s.html',
        desc: 'A self-initiated film about the parts of an interior a walkthrough would rush past: the joint where a lamp stem meets its base, the way light sits inside a glass case, the edge of a paving slab against gravel.',
        specs: {
          client: 'RDVS Studios',
          scope: 'Self-initiated interior modelling, look-dev, lighting, rendering and edit',
          team: 'RDVS Team',
          year: '2018',
          disciplines: ['3D Visualization', 'Architectural Visualization']
        }
      }

    ]
  },

  interiors: {
    name: 'Interior Design',
    videos: [
      {
        id: 'watsons-place-film',
        title: 'Watson’s Place',
        category: 'Interior Design & Architectural Visualization — 2016',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        videoUrl: 'assets/videos/watsons-place/watsons-place-film.mp4',
        videoUrlDesktop: 'assets/videos/watsons-place/watsons-place-film.mp4',
        videoMobileUrl: 'assets/videos/watsons-place/watsons-place-film-mobile.mp4',
        imageUrl: 'assets/images/watsons-place/watsons-place-4.jpg',
        imageUrlDesktop: 'assets/images/watsons-place/watsons-place-4.jpg',
        imageMobileUrl: 'assets/images/watsons-place/watsons-place-4-mobile.jpg',
        projectUrl: 'watsons-place.html',
        desc: 'The delivered animation of the street views and the three rooms',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for property marketing: two street-facing exterior views and lounge, dining and bedroom interior renders.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'villa-aggregate-film',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        videoUrl: 'assets/videos/villa-aggregate/villa-aggregate-film.mp4',
        videoUrlDesktop: 'assets/videos/villa-aggregate/villa-aggregate-film.mp4',
        videoMobileUrl: 'assets/videos/villa-aggregate/villa-aggregate-film-mobile.mp4',
        imageUrl: 'assets/images/aggregate/villa-aggregate-1.jpg',
        imageUrlDesktop: 'assets/images/aggregate/villa-aggregate-1.jpg',
        imageMobileUrl: 'assets/images/aggregate/villa-aggregate-1-mobile.jpg',
        projectUrl: 'villa-aggregate.html',
        desc: 'A walkthrough of the villa',

        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'tower-cascades-film',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        videoUrl: 'assets/videos/tower-cascades/tower-cascades-film.mp4',
        videoUrlDesktop: 'assets/videos/tower-cascades/tower-cascades-film.mp4',
        videoMobileUrl: 'assets/videos/tower-cascades/tower-cascades-film-mobile.mp4',
        imageUrl: 'assets/images/cascades/tower-cascades-hero.jpg',
        imageUrlDesktop: 'assets/images/cascades/tower-cascades-hero.jpg',
        imageMobileUrl: 'assets/images/cascades/tower-cascades-hero-mobile.jpg',
        projectUrl: 'tower-cascades.html',
        desc: 'The delivered animation, end to end',

        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },
      {
        id: 'moty-intro',
        title: 'MOTY',
        category: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        videoUrl: 'assets/videos/moty/moty-intro.mp4',
        videoUrlDesktop: 'assets/videos/moty/moty-intro.mp4',
        videoMobileUrl: 'assets/videos/moty/moty-intro-mobile.mp4',
        imageUrl: 'assets/images/moty/moty-5.jpg',
        imageUrlDesktop: 'assets/images/moty/moty-5.jpg',
        imageMobileUrl: 'assets/images/moty/moty-5-mobile.jpg',
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

    ],
    images: [
      {
        id: 'stellar-bar-2',
        title: 'Stellar Bar',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/stellar-bar/stellar-bar-2.jpg',
        imageUrlDesktop: 'assets/images/stellar-bar/stellar-bar-2.jpg',
        imageMobileUrl: 'assets/images/stellar-bar/stellar-bar-2-mobile.jpg',
        projectUrl: 'stellar-bar.html',
        desc: 'A 2013 bar interior for Stellar Foods in Nigeria: a low, warm lounge of timber banquettes, brick-piered back bar and an internally lit bar counter, designed and rendered by RDVS before construction.',
        specs: {
          client: 'Stellar Foods',
          scope: 'Interior design and architectural visualization of a bar: seating plan, bar front, finishes and lighting scheme, resolved in photoreal renders before construction',
          team: 'RDVS',
          year: '2013',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'stellar-bar-3',
        title: 'Stellar Bar',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/stellar-bar/stellar-bar-3.jpg',
        imageUrlDesktop: 'assets/images/stellar-bar/stellar-bar-3.jpg',
        imageMobileUrl: 'assets/images/stellar-bar/stellar-bar-3-mobile.jpg',
        projectUrl: 'stellar-bar.html',
        desc: 'A 2013 bar interior for Stellar Foods in Nigeria: a low, warm lounge of timber banquettes, brick-piered back bar and an internally lit bar counter, designed and rendered by RDVS before construction.',
        specs: {
          client: 'Stellar Foods',
          scope: 'Interior design and architectural visualization of a bar: seating plan, bar front, finishes and lighting scheme, resolved in photoreal renders before construction',
          team: 'RDVS',
          year: '2013',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'stellar-bar',
        title: 'Stellar Bar',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/stellar-bar/stellar-bar-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/stellar-bar/stellar-bar-1-desktop.jpg',
        imageMobileUrl: 'assets/images/stellar-bar/stellar-bar-1-desktop-mobile.jpg',
        projectUrl: 'stellar-bar.html',
        desc: 'A 2013 bar interior for Stellar Foods in Nigeria: a low, warm lounge of timber banquettes, brick-piered back bar and an internally lit bar counter, designed and rendered by RDVS before construction.',
        specs: {
          client: 'Stellar Foods',
          scope: 'Interior design and architectural visualization of a bar: seating plan, bar front, finishes and lighting scheme, resolved in photoreal renders before construction',
          team: 'RDVS',
          year: '2013',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: '5aap-progress-plate1',
        title: '5AAP',
        category: 'Interior Design, Graphic Design & Design + Build — 2020',
        service: 'Interior Design, Graphic Design & Design + Build',
        discipline: 'interiors',
        imageUrl: 'assets/images/5aap/5aap-2.jpg',
        imageUrlDesktop: 'assets/images/5aap/5aap-2.jpg',
        imageMobileUrl: 'assets/images/5aap/5aap-2-mobile.jpg',
        projectUrl: '5aap.html',
        desc: 'The IDP Foundation office: interior design, wayfinding and signage design, and construction, delivered by RDVS across 2019 and 2020.',
        specs: {
          client: 'IDP Foundation',
          scope: 'Interior Design, Graphic Design & Design + Build',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'Design + Build\']'
        }
      },
      {
        id: '5aap-progress-plate2',
        title: '5AAP',
        category: 'Interior Design, Graphic Design & Design + Build — 2020',
        service: 'Interior Design, Graphic Design & Design + Build',
        discipline: 'interiors',
        imageUrl: 'assets/images/5aap/5aap-1.jpg',
        imageUrlDesktop: 'assets/images/5aap/5aap-1.jpg',
        imageMobileUrl: 'assets/images/5aap/5aap-1-mobile.jpg',
        projectUrl: '5aap.html',
        desc: 'The IDP Foundation office: interior design, wayfinding and signage design, and construction, delivered by RDVS across 2019 and 2020.',
        specs: {
          client: 'IDP Foundation',
          scope: 'Interior Design, Graphic Design & Design + Build',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'Design + Build\']'
        }
      },
      {
        id: '5aap-progress',
        title: '5AAP',
        category: 'Interior Design, Graphic Design & Design + Build — 2020',
        service: 'Interior Design, Graphic Design & Design + Build',
        discipline: 'interiors',
        imageUrl: 'assets/images/5aap/EnCDoTBXEAAqKsO.jpg',
        imageUrlDesktop: 'assets/images/5aap/EnCDoTBXEAAqKsO.jpg',
        imageMobileUrl: 'assets/images/5aap/EnCDoTBXEAAqKsO-mobile.jpg',
        projectUrl: '5aap.html',
        desc: 'The IDP Foundation office: interior design, wayfinding and signage design, and construction, delivered by RDVS across 2019 and 2020.',
        specs: {
          client: 'IDP Foundation',
          scope: 'Interior Design, Graphic Design & Design + Build',
          team: 'RDVS Team',
          year: '2020',
          disciplines: ['Interior Design', 'Graphic Design', 'Design + Build']
        }
      },
      {
        id: 'moty-3',
        title: 'MOTY',
        category: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/moty/moty-3.jpg',
        imageUrlDesktop: 'assets/images/moty/moty-3.jpg',
        imageMobileUrl: 'assets/images/moty/moty-3-mobile.jpg',
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
        id: 'kuma-residence-mff-w',
        title: 'Kuma Residence',
        category: 'Interior Design & Architectural Visualization — 2022',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/kuma-residence/FRJmffPWYAECYZw.jpg',
        imageUrlDesktop: 'assets/images/kuma-residence/FRJmffPWYAECYZw.jpg',
        imageMobileUrl: 'assets/images/kuma-residence/FRJmffPWYAECYZw-mobile.jpg',
        projectUrl: 'kuma-residence.html',
        desc: 'A material and lighting study for a private residence, rendered in greyscale so the values could be read before any palette was committed — part of an iterative interior design process run almost in real time.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design carried through an in-house material and lighting study: modelling, look-dev, lighting and photoreal rendering',
          team: 'RDVS Team',
          year: '2022',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'kuma-residence-mev8-sn-2',
        title: 'Kuma Residence',
        category: 'Interior Design & Architectural Visualization — 2022',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/kuma-residence/FRJmev8XIAAsnF2.jpg',
        imageUrlDesktop: 'assets/images/kuma-residence/FRJmev8XIAAsnF2.jpg',
        imageMobileUrl: 'assets/images/kuma-residence/FRJmev8XIAAsnF2-mobile.jpg',
        projectUrl: 'kuma-residence.html',
        desc: 'A material and lighting study for a private residence, rendered in greyscale so the values could be read before any palette was committed — part of an iterative interior design process run almost in real time.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design carried through an in-house material and lighting study: modelling, look-dev, lighting and photoreal rendering',
          team: 'RDVS Team',
          year: '2022',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-3',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-3.jpg',
        imageUrlDesktop: 'assets/images/ela-b/ela-b-3.jpg',
        imageMobileUrl: 'assets/images/ela-b/ela-b-3-mobile.jpg',
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
        id: 'el-dor-7',
        title: 'El Dor',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/el-dor/el-dor-7.jpg',
        imageUrlDesktop: 'assets/images/el-dor/el-dor-7.jpg',
        imageMobileUrl: 'assets/images/el-dor/el-dor-7-mobile.jpg',
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
        id: 'afg-4',
        title: 'AFG Offices',
        category: 'Interior Design, 3D Visualization, Graphic Design, Industrial & Furniture Design & Construction — 2019',
        service: 'Interior Design, 3D Visualization, Graphic Design, Industrial & Furniture Design & Construction',
        discipline: 'interiors',
        imageUrl: 'assets/images/afg/afg-15.jpg',
        imageUrlDesktop: 'assets/images/afg/afg-15.jpg',
        imageMobileUrl: 'assets/images/afg/afg-15-mobile.jpg',
        projectUrl: 'afg.html',
        desc: 'A design-and-build office for AFG in Accra — brand set into the architecture across a faceted red graphic wall and etched glass, bespoke plywood and steel furniture, photographed room by room and shown beside the pre-build visualisations, across ninety-eight plates.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'csm',
        title: 'CSM',
        category: 'Interior Design & 3D Visualization — 2014',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/csm/csm-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/csm/csm-1-desktop.jpg',
        imageMobileUrl: 'assets/images/csm/csm-1-desktop-mobile.jpg',
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
        imageUrl: 'assets/images/hamlet/hamlet-estate.jpg',
        imageUrlDesktop: 'assets/images/hamlet/hamlet-estate.jpg',
        imageMobileUrl: 'assets/images/hamlet/hamlet-estate-mobile.jpg',
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
        imageUrl: 'assets/images/afg/afg-17.jpg',
        imageUrlDesktop: 'assets/images/afg/afg-17.jpg',
        imageMobileUrl: 'assets/images/afg/afg-17-mobile.jpg',
        projectUrl: 'afg.html',
        desc: 'A design-and-build office for AFG in Accra — brand set into the architecture across a faceted red graphic wall and etched glass, bespoke plywood and steel furniture, photographed room by room and shown beside the pre-build visualisations, across ninety-eight plates.',
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
        imageMobileUrl: 'assets/images/hubtel/hubtel-nairobi-1-mobile.jpg',
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
        imageMobileUrl: 'assets/images/la-beach-towers/la-beach-towers-16-mobile.jpg',
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
        imageMobileUrl: 'assets/images/cantonments/west-cantonments-16-mobile.jpg',
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
        imageMobileUrl: 'assets/images/abl-reception/abl-reception-1-mobile.jpg',
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
        id: 'kuma-residence',
        title: 'Kuma Residence',
        category: 'Interior Design & Architectural Visualization — 2022',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/kuma-residence/kuma-residence-1.jpg',
        imageUrlDesktop: 'assets/images/kuma-residence/kuma-residence-1.jpg',
        imageMobileUrl: 'assets/images/kuma-residence/kuma-residence-1-mobile.jpg',
        projectUrl: 'kuma-residence.html',
        desc: 'A material and lighting study for a private residence, rendered in greyscale so the values could be read before any palette was committed — part of an iterative interior design process run almost in real time.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design carried through an in-house material and lighting study: modelling, look-dev, lighting and photoreal rendering',
          team: 'RDVS Team',
          year: '2022',
          disciplines: ['Interior Design', 'Architectural Visualization']
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
        imageMobileUrl: 'assets/images/aggregate/villa-aggregate-1-mobile.jpg',
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
        id: 'link-drive-road',
        title: 'Link Drive Rd.',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/link-drive/link-drive-1.jpg',
        imageUrlDesktop: 'assets/images/link-drive/link-drive-1.jpg',
        imageMobileUrl: 'assets/images/link-drive/link-drive-1-mobile.jpg',
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
        imageMobileUrl: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-2-mobile.jpg',
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
        imageMobileUrl: 'assets/images/swipe/swipe-6-mobile.jpg',
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
        imageMobileUrl: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-1-mobile.jpg',
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
        imageMobileUrl: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-2-mobile.jpg',
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
        imageMobileUrl: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-3-mobile.jpg',
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
        imageMobileUrl: 'assets/images/cantonments/west-cantonments-1-mobile.jpg',
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
        imageUrl: 'assets/images/cantonments/west-cantonments-17.jpg',
        imageUrlDesktop: 'assets/images/cantonments/west-cantonments-17.jpg',
        imageMobileUrl: 'assets/images/cantonments/west-cantonments-17-mobile.jpg',
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
        imageUrl: 'assets/images/watsons-place/watsons-place-3.jpg',
        imageUrlDesktop: 'assets/images/watsons-place/watsons-place-3.jpg',
        imageMobileUrl: 'assets/images/watsons-place/watsons-place-3-mobile.jpg',
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
        imageUrl: 'assets/images/watsons-place/watsons-place-4.jpg',
        imageUrlDesktop: 'assets/images/watsons-place/watsons-place-4.jpg',
        imageMobileUrl: 'assets/images/watsons-place/watsons-place-4-mobile.jpg',
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
        imageUrl: 'assets/images/watsons-place/watsons-place-5.jpg',
        imageUrlDesktop: 'assets/images/watsons-place/watsons-place-5.jpg',
        imageMobileUrl: 'assets/images/watsons-place/watsons-place-5-mobile.jpg',
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
        imageMobileUrl: 'assets/images/aggregate/villa-aggregate-2-mobile.jpg',
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
        imageMobileUrl: 'assets/images/aggregate/villa-aggregate-3-mobile.jpg',
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
        id: 'tower-cascades-plate1',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-hero.jpg',
        imageUrlDesktop: 'assets/images/cascades/tower-cascades-hero.jpg',
        imageMobileUrl: 'assets/images/cascades/tower-cascades-hero-mobile.jpg',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-three visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
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
        imageUrl: 'assets/images/cascades/E14fBXJXMAEasP9.jpg',
        imageUrlDesktop: 'assets/images/cascades/E14fBXJXMAEasP9.jpg',
        imageMobileUrl: 'assets/images/cascades/E14fBXJXMAEasP9-mobile.jpg',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-three visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
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
        imageUrl: 'assets/images/hamlet/hamlet-bath.jpg',
        imageUrlDesktop: 'assets/images/hamlet/hamlet-bath.jpg',
        imageMobileUrl: 'assets/images/hamlet/hamlet-bath-mobile.jpg',
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
        imageUrl: 'assets/images/hamlet/hamlet-wide-hero.jpg',
        imageUrlDesktop: 'assets/images/hamlet/hamlet-wide-hero.jpg',
        imageMobileUrl: 'assets/images/hamlet/hamlet-wide-hero-mobile.jpg',
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
        imageMobileUrl: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-1-mobile.jpg',
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
        imageMobileUrl: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-3-mobile.jpg',
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
        imageUrl: 'assets/images/swipe/swipe-2.jpg',
        imageUrlDesktop: 'assets/images/swipe/swipe-2.jpg',
        imageMobileUrl: 'assets/images/swipe/swipe-2-mobile.jpg',
        projectUrl: 'swipe.html',
        desc: 'Interior design, environmental graphics, BIM modelling and architectural visualization for Swipe\'s own workplace in Accra   seven plates that carry a single lime-green identity from the logo through to the walls, the glass and the wayfinding.',
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
        imageUrl: 'assets/images/swipe/swipe-7.jpg',
        imageUrlDesktop: 'assets/images/swipe/swipe-7.jpg',
        imageMobileUrl: 'assets/images/swipe/swipe-7-mobile.jpg',
        projectUrl: 'swipe.html',
        desc: 'Interior design, environmental graphics, BIM modelling and architectural visualization for Swipe\'s own workplace in Accra   seven plates that carry a single lime-green identity from the logo through to the walls, the glass and the wayfinding.',
        specs: {
          client: 'Swipe',
          scope: 'Interior design, environmental graphics, BIM modelling and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'BIM   Architectural Visualization\']'
        }
      },
      {
        id: 'poconos-bar-grill-plate1',
        title: 'Poconos Bar + Grill',
        category: 'Landscape Design, Interior Design & 3D Visualization — 2017',
        service: 'Landscape Design, Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-3.jpg',
        imageUrlDesktop: 'assets/images/poconos-bar-grill/poconos-bar-grill-3.jpg',
        imageMobileUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-3-mobile.jpg',
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
        imageMobileUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-2-mobile.jpg',
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
        id: 'naadei-villas-plate1',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-2.jpg',
        imageUrlDesktop: 'assets/images/naadei-villas/naadei-villas-2.jpg',
        imageMobileUrl: 'assets/images/naadei-villas/naadei-villas-2-mobile.jpg',
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
        imageUrl: 'assets/images/naadei-villas/naadei-villas-12.jpg',
        imageUrlDesktop: 'assets/images/naadei-villas/naadei-villas-12.jpg',
        imageMobileUrl: 'assets/images/naadei-villas/naadei-villas-12-mobile.jpg',
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
        imageUrl: 'assets/images/moty/moty-5.jpg',
        imageUrlDesktop: 'assets/images/moty/moty-5.jpg',
        imageMobileUrl: 'assets/images/moty/moty-5-mobile.jpg',
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
        imageMobileUrl: 'assets/images/moty/moty-2-mobile.jpg',
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
        id: 'macord-international-school-plate1',
        title: 'Macord International School',
        category: '3D Visualization — 2024',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/macord/macord-2.jpg',
        imageUrlDesktop: 'assets/images/macord/macord-2.jpg',
        imageMobileUrl: 'assets/images/macord/macord-2-mobile.jpg',
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
        imageMobileUrl: 'assets/images/macord/macord-3-mobile.jpg',
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
        imageUrl: 'assets/images/link-drive/link-drive-5.jpg',
        imageUrlDesktop: 'assets/images/link-drive/link-drive-5.jpg',
        imageMobileUrl: 'assets/images/link-drive/link-drive-5-mobile.jpg',
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
        imageUrl: 'assets/images/link-drive/link-drive-9.jpg',
        imageUrlDesktop: 'assets/images/link-drive/link-drive-9.jpg',
        imageMobileUrl: 'assets/images/link-drive/link-drive-9-mobile.jpg',
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
        imageUrl: 'assets/images/la-beach-towers/la-beach-towers-1.jpg',
        imageUrlDesktop: 'assets/images/la-beach-towers/la-beach-towers-1.jpg',
        imageMobileUrl: 'assets/images/la-beach-towers/la-beach-towers-1-mobile.jpg',
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
        imageUrl: 'assets/images/la-beach-towers/la-beach-towers-4.jpg',
        imageUrlDesktop: 'assets/images/la-beach-towers/la-beach-towers-4.jpg',
        imageMobileUrl: 'assets/images/la-beach-towers/la-beach-towers-4-mobile.jpg',
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
        imageUrl: 'assets/images/imperial-square/imperial-square-3.jpg',
        imageUrlDesktop: 'assets/images/imperial-square/imperial-square-3.jpg',
        imageMobileUrl: 'assets/images/imperial-square/imperial-square-3-mobile.jpg',
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
        imageMobileUrl: 'assets/images/imperial-square/imperial-square-2-mobile.jpg',
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
        id: 'hubtel-nairobi-plate1',
        title: 'Hubtel Nairobi',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hubtel/hubtel-nairobi-2.jpg',
        imageUrlDesktop: 'assets/images/hubtel/hubtel-nairobi-2.jpg',
        imageMobileUrl: 'assets/images/hubtel/hubtel-nairobi-2-mobile.jpg',
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
        id: 'ela-b-plate1',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-6.jpg',
        imageUrlDesktop: 'assets/images/ela-b/ela-b-6.jpg',
        imageMobileUrl: 'assets/images/ela-b/ela-b-6-mobile.jpg',
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
        imageMobileUrl: 'assets/images/ela-b/ela-b-2-mobile.jpg',
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
        imageUrl: 'assets/images/el-dor/el-dor-hero.jpg',
        imageUrlDesktop: 'assets/images/el-dor/el-dor-hero.jpg',
        imageMobileUrl: 'assets/images/el-dor/el-dor-hero-mobile.jpg',
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
        imageMobileUrl: 'assets/images/el-dor/el-dor-2-mobile.jpg',
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
        id: 'ehr-plate1',
        title: 'EHR',
        category: 'Architectural Design, Interior Design & Architectural Visualization — 2017',
        service: 'Architectural Design, Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ehr/ehr-18.jpg',
        imageUrlDesktop: 'assets/images/ehr/ehr-18.jpg',
        imageMobileUrl: 'assets/images/ehr/ehr-18-mobile.jpg',
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
        imageMobileUrl: 'assets/images/ehr/ehr-19-mobile.jpg',
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
        imageMobileUrl: 'assets/images/ehr/ehr-20-mobile.jpg',
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
        imageUrl: 'assets/images/csm/csm-3.jpg',
        imageUrlDesktop: 'assets/images/csm/csm-3.jpg',
        imageMobileUrl: 'assets/images/csm/csm-3-mobile.jpg',
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
        imageMobileUrl: 'assets/images/csm/csm-2-mobile.jpg',
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
        id: 'brownies-place-plate1',
        title: 'Brownie’s Place',
        category: 'Interior Design, Architectural Visualization & Graphic Design — 2017',
        service: 'Interior Design, Architectural Visualization & Graphic Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/brownies-place/brownies-place-12.jpg',
        imageUrlDesktop: 'assets/images/brownies-place/brownies-place-12.jpg',
        imageMobileUrl: 'assets/images/brownies-place/brownies-place-12-mobile.jpg',
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
        imageUrl: 'assets/images/brownies-place/brownies-place-18.jpg',
        imageUrlDesktop: 'assets/images/brownies-place/brownies-place-18.jpg',
        imageMobileUrl: 'assets/images/brownies-place/brownies-place-18-mobile.jpg',
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
        imageUrl: 'assets/images/brownies-place/brownies-place-1.jpg',
        imageUrlDesktop: 'assets/images/brownies-place/brownies-place-1.jpg',
        imageMobileUrl: 'assets/images/brownies-place/brownies-place-1-mobile.jpg',
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
        imageUrl: 'assets/images/bfa/bfa-5.png',
        imageUrlDesktop: 'assets/images/bfa/bfa-5.png',
        imageMobileUrl: 'assets/images/bfa/bfa-5-mobile.png',
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
        imageUrl: 'assets/images/bfa/bfa-6.jpg',
        imageUrlDesktop: 'assets/images/bfa/bfa-6.jpg',
        imageMobileUrl: 'assets/images/bfa/bfa-6-mobile.jpg',
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
        imageUrl: 'assets/images/bfa/bfa-8.jpg',
        imageUrlDesktop: 'assets/images/bfa/bfa-8.jpg',
        imageMobileUrl: 'assets/images/bfa/bfa-8-mobile.jpg',
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
        id: 'afg-offices-plate2',
        title: 'AFG Offices',
        category: 'Interior Design, 3D Visualization, Graphic Design, Industrial & Furniture Design & Construction — 2019',
        service: 'Interior Design, 3D Visualization, Graphic Design, Industrial & Furniture Design & Construction',
        discipline: 'interiors',
        imageUrl: 'assets/images/afg/afg-21.jpg',
        imageUrlDesktop: 'assets/images/afg/afg-21.jpg',
        imageMobileUrl: 'assets/images/afg/afg-21-mobile.jpg',
        projectUrl: 'afg.html',
        desc: 'A design-and-build office for AFG in Accra — brand set into the architecture across a faceted red graphic wall and etched glass, bespoke plywood and steel furniture, photographed room by room and shown beside the pre-build visualisations, across ninety-eight plates.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\', \'Graphic Design\', \'Industrial   Furniture Design   Construction\']'
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
        imageMobileUrl: 'assets/images/abl-reception/abl-reception-2-mobile.jpg',
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
        imageMobileUrl: 'assets/images/abl-reception/abl-reception-3-mobile.jpg',
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
        id: '1957-apartments-retail-plate1',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-6.jpg',
        imageUrlDesktop: 'assets/images/1957/1957-6.jpg',
        imageMobileUrl: 'assets/images/1957/1957-6-mobile.jpg',
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
        imageMobileUrl: 'assets/images/1957/1957-2-mobile.jpg',
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
        imageUrl: 'assets/images/cascades/E14fiz3X0AA3X0k.jpg',
        imageUrlDesktop: 'assets/images/cascades/E14fiz3X0AA3X0k.jpg',
        imageMobileUrl: 'assets/images/cascades/E14fiz3X0AA3X0k-mobile.jpg',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-three visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },
      {
        id: '3aap',
        title: '3AAP',
        category: 'Interior Design, Design + Build, Graphic Design & Architectural Visualization — 2019',
        service: 'Interior Design, Design + Build, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/3aap/3aap-1.jpg',
        imageUrlDesktop: 'assets/images/3aap/3aap-1.jpg',
        imageMobileUrl: 'assets/images/3aap/3aap-1-mobile.jpg',
        projectUrl: '3aap.html',
        desc: 'A workspace fit-out designed and built for Impact Hub Accra in 2019: a tall white room under an exposed concrete ceiling and steel trusses, fitted with yellow wall cabinets over black base units by MIG, the studio\u2019s furniture line. Photographed on site as the installation went in.',
        specs: {
          client: 'Impact Hub Accra',
          scope: 'Interior Design, Fit-out, Graphic Design & Architectural Visualization',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', 'Design + Build', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: '3aap-plate1',
        title: '3AAP',
        category: 'Interior Design, Design + Build, Graphic Design & Architectural Visualization — 2019',
        service: 'Interior Design, Design + Build, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/3aap/3aap-2.jpg',
        imageUrlDesktop: 'assets/images/3aap/3aap-2.jpg',
        imageMobileUrl: 'assets/images/3aap/3aap-2-mobile.jpg',
        projectUrl: '3aap.html',
        desc: 'A workspace fit-out designed and built for Impact Hub Accra in 2019: a tall white room under an exposed concrete ceiling and steel trusses, fitted with yellow wall cabinets over black base units by MIG, the studio\u2019s furniture line. Photographed on site as the installation went in.',
        specs: {
          client: 'Impact Hub Accra',
          scope: 'Interior Design, Fit-out, Graphic Design & Architectural Visualization',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', 'Design + Build', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: '3aap-plate2',
        title: '3AAP',
        category: 'Interior Design, Design + Build, Graphic Design & Architectural Visualization — 2019',
        service: 'Interior Design, Design + Build, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/3aap/3aap-3.jpg',
        imageUrlDesktop: 'assets/images/3aap/3aap-3.jpg',
        imageMobileUrl: 'assets/images/3aap/3aap-3-mobile.jpg',
        projectUrl: '3aap.html',
        desc: 'A workspace fit-out designed and built for Impact Hub Accra in 2019: a tall white room under an exposed concrete ceiling and steel trusses, fitted with yellow wall cabinets over black base units by MIG, the studio\u2019s furniture line. Photographed on site as the installation went in.',
        specs: {
          client: 'Impact Hub Accra',
          scope: 'Interior Design, Fit-out, Graphic Design & Architectural Visualization',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', 'Design + Build', 'Graphic Design', 'Architectural Visualization']
        }
      },
    ]
  },

  vfx: {
    name: 'VFX + CGI',
    videos: [
      {
        id: 'ttd-film',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        videoUrl: 'assets/videos/ttd/ttd-film.mp4',
        videoUrlDesktop: 'assets/videos/ttd/ttd-film.mp4',
        videoMobileUrl: 'assets/videos/ttd/ttd-film-mobile.mp4',
        imageUrl: 'assets/images/ttd/FuIPLeNWYAIxRIj.jpg',
        imageUrlDesktop: 'assets/images/ttd/FuIPLeNWYAIxRIj.jpg',
        imageMobileUrl: 'assets/images/ttd/FuIPLeNWYAIxRIj-mobile.jpg',
        projectUrl: 'ttd.html',
        desc: 'A ninety-second render film of the TTD living room from one locked-off camera: the room runs from dark through lit evening to full daylight, holding on the red sectional, the terracotta stair and the blue dining wall at the far end',
      },
      {
        id: 'mig-logo-letters-flip-v2',
        title: 'MIG',
        category: 'Modern Indigenous Goods — 2021',
        service: 'Modern Indigenous Goods',
        discipline: 'vfx',
        videoUrl: 'assets/videos/mig/mig-logo-letters-flip-v2.mp4',
        videoUrlDesktop: 'assets/videos/mig/mig-logo-letters-flip-v2.mp4',
        videoMobileUrl: 'assets/videos/mig/mig-logo-letters-flip-v2-mobile.mp4',
        imageUrl: 'assets/images/mig/mig-1h-2.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-1h-2.jpg',
        imageMobileUrl: 'assets/images/mig/mig-1h-2-mobile.jpg',
        projectUrl: 'mig.html',
        desc: 'The four-and-a-half-second flip: the four marks of the MIG monogram start edge-on as one flat band, then rotate up into the picture plane one after another from the left, their extruded sides catching grey light as they turn, and resolve into the flat black logotype on white the page opens with, which holds to the end',
      },
      {
        id: 'ahero-film',
        title: 'Ahero',
        category: 'Architectural Visualization & 3D Animation — 2022',
        service: 'Architectural Visualization & 3D Animation',
        discipline: 'vfx',
        videoUrl: 'assets/videos/ahero/ahero-film.mp4',
        videoUrlDesktop: 'assets/videos/ahero/ahero-film.mp4',
        videoMobileUrl: 'assets/videos/ahero/ahero-film-mobile.mp4',
        imageUrl: 'assets/images/ahero/F9WX-jyXcAApIqO.jpg',
        imageUrlDesktop: 'assets/images/ahero/F9WX-jyXcAApIqO.jpg',
        imageMobileUrl: 'assets/images/ahero/F9WX-jyXcAApIqO-mobile.jpg',
        projectUrl: 'ahero.html',
      },
      {
        id: 'ackon-desk-film',
        title: 'Ackon Desk',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        videoUrl: 'assets/videos/ackon-desk/ackon-desk-film.mp4',
        videoUrlDesktop: 'assets/videos/ackon-desk/ackon-desk-film.mp4',
        videoMobileUrl: 'assets/videos/ackon-desk/ackon-desk-film-mobile.mp4',
        imageUrl: 'assets/images/ackon-desk/GUEAQ-MWsAAGT7n.jpg',
        imageUrlDesktop: 'assets/images/ackon-desk/GUEAQ-MWsAAGT7n.jpg',
        imageMobileUrl: 'assets/images/ackon-desk/GUEAQ-MWsAAGT7n-mobile.jpg',
        projectUrl: 'ackon-desk.html',
        desc: 'A walkthrough of the rendered desk',
      },
      {
        id: 'the-tea-house-website-load',
        title: 'The Tea House',
        category: 'Graphic Design, Digital & Web Design — 2021',
        service: 'Graphic Design, Digital & Web Design',
        discipline: 'vfx',
        videoUrl: 'assets/videos/the-tea-house/the-tea-house-website-load.mp4',
        videoUrlDesktop: 'assets/videos/the-tea-house/the-tea-house-website-load.mp4',
        videoMobileUrl: 'assets/videos/the-tea-house/the-tea-house-website-load-mobile.mp4',
        imageUrl: 'assets/images/tea-house/tea-house-05.png',
        imageUrlDesktop: 'assets/images/tea-house/tea-house-05.png',
        imageMobileUrl: 'assets/images/tea-house/tea-house-05-mobile.png',
        projectUrl: 'the-tea-house.html',
        desc: 'The delivered site loading on a desktop mockup: the mark and headline in, then the shapes and the two buttons sweeping up the fold',

        specs: {
          client: 'Private Client',
          scope: 'Brand identity system, graphic design and custom UI/UX web design — art direction, menu, booking and reservation flows',
          team: 'Jude Abbey, Jude Nyoagbe, Mahalia, Bimpong',
          year: '2021',
          disciplines: '[\'Graphic Design\', \'Digital   Web Design\']'
        }
      },
      {
        id: '2gs-film',
        title: '2GS',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        videoUrl: 'assets/videos/2gs/2gs-logo-construction-v2.mp4',
        videoUrlDesktop: 'assets/videos/2gs/2gs-logo-construction-v2.mp4',
        videoMobileUrl: 'assets/videos/2gs/2gs-logo-construction-v2-mobile.mp4',
        imageUrl: 'assets/images/2gs/2gs-logo-construction-frame.jpg',
        imageUrlDesktop: 'assets/images/2gs/2gs-logo-construction-frame.jpg',
        imageMobileUrl: 'assets/images/2gs/2gs-logo-construction-frame-mobile.jpg',
        projectUrl: '2gs.html',
        desc: 'The eight-and-a-half-second ident: the monogram assembles itself out of the dark, its lower blocks arriving as bare outlines before they fill, while the stacked 2GS, CONSTRUCTION and +LOGISTICS wordmark draws in beside them; faint construction ticks sit under the mark and to its right, then fade as light crosses the sand fill and the finished lockup holds',
        specs: {
          client: '2GS Construction + Logistics',
          scope: 'Identity and branding: monogram and lockups, labyrinth motif, colour palette and typography, business cards, letterheads and stationery, signage',
          team: 'Randy Biney (concept + design); Jude Nyoagbe (concept)',
          year: '2015',
          disciplines: ['Graphic Design']
        }
      },
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

    ],
    images: [
      {
        id: 'ttd-zv-h-s-3ll',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/GBzvEEhXsAAX3ll.jpg',
        imageUrlDesktop: 'assets/images/ttd/GBzvEEhXsAAX3ll.jpg',
        imageMobileUrl: 'assets/images/ttd/GBzvEEhXsAAX3ll-mobile.jpg',
        projectUrl: 'ttd.html'
      },
      {
        id: 'stanchart-hq-3',
        title: 'Stanchart HQ',
        category: 'Architectural Visualization — 2010',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/stanchart-hq/stanchart-hq-3.jpg',
        imageUrlDesktop: 'assets/images/stanchart-hq/stanchart-hq-3.jpg',
        imageMobileUrl: 'assets/images/stanchart-hq/stanchart-hq-3-mobile.jpg',
        projectUrl: 'stanchart-hq.html',
        desc: 'Photorealistic 3D visualization for Stanchart HQ, a corporate headquarters tower completed in 2010.',
        specs: {
          client: 'Standard Chartered Bank',
          scope: 'Architectural visualization: three street-level views of the proposed head office tower — two daylight studies and a dusk long-exposure.',
          team: 'Vista (design and modelling); R.D+V.S (visualization)',
          year: '2010',
          disciplines: ['3D Visualization']
        }
      },
      {
        id: 'stanchart-hq-2',
        title: 'Stanchart HQ',
        category: 'Architectural Visualization — 2010',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/stanchart-hq/stanchart-hq-2.jpg',
        imageUrlDesktop: 'assets/images/stanchart-hq/stanchart-hq-2.jpg',
        imageMobileUrl: 'assets/images/stanchart-hq/stanchart-hq-2-mobile.jpg',
        projectUrl: 'stanchart-hq.html',
        desc: 'Photorealistic 3D visualization for Stanchart HQ, a corporate headquarters tower completed in 2010.',
        specs: {
          client: 'Standard Chartered Bank',
          scope: 'Architectural visualization: three street-level views of the proposed head office tower — two daylight studies and a dusk long-exposure.',
          team: 'Vista (design and modelling); R.D+V.S (visualization)',
          year: '2010',
          disciplines: ['3D Visualization']
        }
      },
      {
        id: 'protea-hotel-airport-7i-qm7-e-he',
        title: 'Protea Hotel - Airport',
        category: 'Architectural Visualization — 2020',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/protea-hotel-airport/E7iCqm7XMAQeNhe.jpg',
        imageUrlDesktop: 'assets/images/protea-hotel-airport/E7iCqm7XMAQeNhe.jpg',
        imageMobileUrl: 'assets/images/protea-hotel-airport/E7iCqm7XMAQeNhe-mobile.jpg',
        projectUrl: 'protea-hotel-airport.html'
      },
      {
        id: 'protea-hotel-airport-7i-s8-v',
        title: 'Protea Hotel - Airport',
        category: 'Architectural Visualization — 2020',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/protea-hotel-airport/E7iCs8EWYAAvIOH.jpg',
        imageUrlDesktop: 'assets/images/protea-hotel-airport/E7iCs8EWYAAvIOH.jpg',
        imageMobileUrl: 'assets/images/protea-hotel-airport/E7iCs8EWYAAvIOH-mobile.jpg',
        projectUrl: 'protea-hotel-airport.html'
      },
      {
        id: 'mig-efk-0-7-5e',
        title: 'MIG',
        category: 'Modern Indigenous Goods — 2021',
        service: 'Modern Indigenous Goods',
        discipline: 'vfx',
        imageUrl: 'assets/images/mig/EefkDFAX0AA7W5e.jpg',
        imageUrlDesktop: 'assets/images/mig/EefkDFAX0AA7W5e.jpg',
        imageMobileUrl: 'assets/images/mig/EefkDFAX0AA7W5e-mobile.jpg',
        projectUrl: 'mig.html'
      },
      {
        id: 'mig-1h-1',
        title: 'MIG',
        category: 'Modern Indigenous Goods — 2021',
        service: 'Modern Indigenous Goods',
        discipline: 'vfx',
        imageUrl: 'assets/images/mig/mig-1h-1.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-1h-1.jpg',
        imageMobileUrl: 'assets/images/mig/mig-1h-1-mobile.jpg',
        projectUrl: 'mig.html'
      },
      {
        id: 'margin-bank',
        title: 'Margin',
        category: 'Workplace Interiors — 2022',
        service: 'Workplace Interiors',
        discipline: 'vfx',
        imageUrl: 'assets/images/margin/margin-bank.jpg',
        imageUrlDesktop: 'assets/images/margin/margin-bank.jpg',
        imageMobileUrl: 'assets/images/margin/margin-bank-mobile.jpg',
        projectUrl: 'margin.html'
      },
      {
        id: 'margin-h-a-90',
        title: 'Margin',
        category: 'Workplace Interiors — 2022',
        service: 'Workplace Interiors',
        discipline: 'vfx',
        imageUrl: 'assets/images/margin/F97ocXEXAAArCud.jpg',
        imageUrlDesktop: 'assets/images/margin/F97ocXEXAAArCud.jpg',
        imageMobileUrl: 'assets/images/margin/F97ocXEXAAArCud-mobile.jpg',
        projectUrl: 'margin.html'
      },
      {
        id: 'lamu-t-o-d',
        title: 'Lamu',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/lamu/FtIUIQMXoAIdEBC.jpg',
        imageUrlDesktop: 'assets/images/lamu/FtIUIQMXoAIdEBC.jpg',
        imageMobileUrl: 'assets/images/lamu/FtIUIQMXoAIdEBC-mobile.jpg',
        projectUrl: 'lamu.html'
      },
      {
        id: 'lamu-t-o-w-wq-x',
        title: 'Lamu',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/lamu/FtIUHoSXwAEwqDx.jpg',
        imageUrlDesktop: 'assets/images/lamu/FtIUHoSXwAEwqDx.jpg',
        imageMobileUrl: 'assets/images/lamu/FtIUHoSXwAEwqDx-mobile.jpg',
        projectUrl: 'lamu.html'
      },
      {
        id: 'hola-1k-sa-0-t-n',
        title: 'Hola',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/hola/F1kFHsaX0AAGtWn.jpg',
        imageUrlDesktop: 'assets/images/hola/F1kFHsaX0AAGtWn.jpg',
        imageMobileUrl: 'assets/images/hola/F1kFHsaX0AAGtWn-mobile.jpg',
        projectUrl: 'hola.html'
      },
      {
        id: 'hola-15a57-g-y-r',
        title: 'Hola',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/hola/F15a57TXgAAZyVr.jpg',
        imageUrlDesktop: 'assets/images/hola/F15a57TXgAAZyVr.jpg',
        imageMobileUrl: 'assets/images/hola/F15a57TXgAAZyVr-mobile.jpg',
        projectUrl: 'hola.html'
      },
      {
        id: 'giffard-park-i-k-x',
        title: 'Giffard Park',
        category: 'Multi-Unit Residential — 2022',
        service: 'Multi-Unit Residential',
        discipline: 'vfx',
        imageUrl: 'assets/images/giffard-park/EiLEUFFXkAAAxZV.jpg',
        imageUrlDesktop: 'assets/images/giffard-park/EiLEUFFXkAAAxZV.jpg',
        imageMobileUrl: 'assets/images/giffard-park/EiLEUFFXkAAAxZV-mobile.jpg',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'giffard-park-i-s-0yi',
        title: 'Giffard Park',
        category: 'Multi-Unit Residential — 2022',
        service: 'Multi-Unit Residential',
        discipline: 'vfx',
        imageUrl: 'assets/images/giffard-park/EiLEUZFWsAIF0yi.jpg',
        imageUrlDesktop: 'assets/images/giffard-park/EiLEUZFWsAIF0yi.jpg',
        imageMobileUrl: 'assets/images/giffard-park/EiLEUZFWsAIF0yi-mobile.jpg',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'avalon-d-8-9-4-gyn1',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/GuZ8So8WAAATDw8.jpg',
        imageUrlDesktop: 'assets/images/avalon/GuZ8So8WAAATDw8.jpg',
        imageMobileUrl: 'assets/images/avalon/GuZ8So8WAAATDw8-mobile.jpg',
        projectUrl: 'avalon.html'
      },
      {
        id: 'avalon-d-ct-g-qa-e',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/GdOGAJlXYAEedq8.jpg',
        imageUrlDesktop: 'assets/images/avalon/GdOGAJlXYAEedq8.jpg',
        imageMobileUrl: 'assets/images/avalon/GdOGAJlXYAEedq8-mobile.jpg',
        projectUrl: 'avalon.html'
      },
      {
        id: 'ahero-3a-6-4-7',
        title: 'Ahero',
        category: 'Architectural Visualization & 3D Animation — 2022',
        service: 'Architectural Visualization & 3D Animation',
        discipline: 'vfx',
        imageUrl: 'assets/images/ahero/GVU3aP6W4AA7WUC.jpg',
        imageUrlDesktop: 'assets/images/ahero/GVU3aP6W4AA7WUC.jpg',
        imageMobileUrl: 'assets/images/ahero/GVU3aP6W4AA7WUC-mobile.jpg',
        projectUrl: 'ahero.html'
      },
      {
        id: 'ahero-9-1k0-0-ev-c',
        title: 'Ahero',
        category: 'Architectural Visualization & 3D Animation — 2022',
        service: 'Architectural Visualization & 3D Animation',
        discipline: 'vfx',
        imageUrl: 'assets/images/ahero/F9YX1k0W0AAevHc.jpg',
        imageUrlDesktop: 'assets/images/ahero/F9YX1k0W0AAevHc.jpg',
        imageMobileUrl: 'assets/images/ahero/F9YX1k0W0AAevHc-mobile.jpg',
        projectUrl: 'ahero.html'
      },
      {
        id: 'ackon-desk-2u-v-q',
        title: 'Ackon Desk',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ackon-desk/GUD2uFJXIAEvHSq.jpg',
        imageUrlDesktop: 'assets/images/ackon-desk/GUD2uFJXIAEvHSq.jpg',
        imageMobileUrl: 'assets/images/ackon-desk/GUD2uFJXIAEvHSq-mobile.jpg',
        projectUrl: 'ackon-desk.html'
      },
      {
        id: 'ackon-desk-2ug-0-mr',
        title: 'Ackon Desk',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ackon-desk/GUD2ugHW0AAQBmr.jpg',
        imageUrlDesktop: 'assets/images/ackon-desk/GUD2ugHW0AAQBmr.jpg',
        imageMobileUrl: 'assets/images/ackon-desk/GUD2ugHW0AAQBmr-mobile.jpg',
        projectUrl: 'ackon-desk.html'
      },
      {
        id: 'a-a-x-g4i-c-p3d6',
        title: 'A-A',
        category: 'Interior Remodeling — 2023',
        service: 'Interior Remodeling',
        discipline: 'vfx',
        imageUrl: 'assets/images/a-a/GxGGg4iXcAAp3d6.jpg',
        imageUrlDesktop: 'assets/images/a-a/GxGGg4iXcAAp3d6.jpg',
        imageMobileUrl: 'assets/images/a-a/GxGGg4iXcAAp3d6-mobile.jpg',
        projectUrl: 'a-a.html'
      },
      {
        id: '1981-4',
        title: '1981',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/1981/1981-4.jpg',
        imageUrlDesktop: 'assets/images/1981/1981-4.jpg',
        imageMobileUrl: 'assets/images/1981/1981-4-mobile.jpg',
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
      {
        id: 'chocolate',
        title: 'Chocolate',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'graphic',
        imageUrl: 'assets/images/chocolate/chocolate-13.jpg',
        imageUrlDesktop: 'assets/images/chocolate/chocolate-13.jpg',
        imageMobileUrl: 'assets/images/chocolate/chocolate-13-mobile.jpg',
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
        imageMobileUrl: 'assets/images/stark-glaube/stark-glaube-2-desktop-mobile.jpg',
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
        id: 'stanchart-hq',
        title: 'Stanchart HQ',
        category: 'Architectural Visualization — 2010',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/stanchart-hq/stanchart-hq-1.jpg',
        imageUrlDesktop: 'assets/images/stanchart-hq/stanchart-hq-1.jpg',
        imageMobileUrl: 'assets/images/stanchart-hq/stanchart-hq-1-mobile.jpg',
        projectUrl: 'stanchart-hq.html',
        desc: 'Photorealistic 3D visualization for Stanchart HQ, a corporate headquarters tower completed in 2010.',
        specs: {
          client: 'Standard Chartered Bank',
          scope: 'Architectural visualization: three street-level views of the proposed head office tower — two daylight studies and a dusk long-exposure.',
          team: 'Vista (design and modelling); R.D+V.S (visualization)',
          year: '2010',
          disciplines: ['3D Visualization']
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
        imageMobileUrl: 'assets/images/gh-phot-awards/gh-phot-awards-1-mobile.jpg',
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
        id: 'mtn-hq',
        title: 'MTN HQ',
        category: 'Graphic Design & 3D Visualization — 2017',
        service: 'Graphic Design & 3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/mtn-hq/mtn-hq-1.jpg',
        imageUrlDesktop: 'assets/images/mtn-hq/mtn-hq-1.jpg',
        imageMobileUrl: 'assets/images/mtn-hq/mtn-hq-1-mobile.jpg',
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
        id: 'baobab-hotel-exteriors',
        title: 'Baobab Hotel - Exteriors',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-2.jpg',
        imageUrlDesktop: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-2.jpg',
        imageMobileUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-2-mobile.jpg',
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
        imageMobileUrl: 'assets/images/senya-resort/senya-resort-1-desktop-mobile.jpg',
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
        id: '2gs',
        title: '2GS',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/2gs/2gs-9.jpg',
        imageUrlDesktop: 'assets/images/2gs/2gs-9.jpg',
        imageMobileUrl: 'assets/images/2gs/2gs-9-mobile.jpg',
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
        imageMobileUrl: 'assets/images/dela-anyaa/dela-anyaa-8-desktop-mobile.jpg',
        projectUrl: 'dela-anyaa.html'
      },
      {
        id: 'npa-reception-renders',
        title: 'NPA',
        category: 'Architectural Visualization & BIM — 2022',
        service: 'Architectural Visualization & BIM',
        discipline: 'vfx',
        imageUrl: 'assets/images/npa/npa-3.jpg',
        imageUrlDesktop: 'assets/images/npa/npa-3.jpg',
        imageMobileUrl: 'assets/images/npa/npa-3-mobile.jpg',
        projectUrl: 'npa-reception-renders.html'
      },
      {
        id: 'aelius',
        title: 'Aelius Consult Brand System',
        category: 'Graphic Design — 2021',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/aelius/aelius-brand.jpg',
        imageUrlDesktop: 'assets/images/aelius/aelius-brand.jpg',
        imageMobileUrl: 'assets/images/aelius/aelius-brand-mobile.jpg',
        projectUrl: 'aelius.html'
      },
      {
        id: 'the-tea-house-plate1',
        title: 'The Tea House',
        category: 'Graphic Design, Digital & Web Design — 2021',
        service: 'Graphic Design, Digital & Web Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/tea-house/tea-house-01.png',
        imageUrlDesktop: 'assets/images/tea-house/tea-house-01.png',
        imageMobileUrl: 'assets/images/tea-house/tea-house-01-mobile.png',
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
        imageMobileUrl: 'assets/images/tea-house/tea-house-02-mobile.png',
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
        imageUrl: 'assets/images/tea-house/tea-house-05.png',
        imageUrlDesktop: 'assets/images/tea-house/tea-house-05.png',
        imageMobileUrl: 'assets/images/tea-house/tea-house-05-mobile.png',
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
        id: 'stark-glaube-plate1',
        title: 'Stark Glaube',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/stark-glaube/stark-glaube-1.jpg',
        imageUrlDesktop: 'assets/images/stark-glaube/stark-glaube-1.jpg',
        imageMobileUrl: 'assets/images/stark-glaube/stark-glaube-1-mobile.jpg',
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
        imageUrl: 'assets/images/stark-glaube/stark-glaube-3.jpg',
        imageUrlDesktop: 'assets/images/stark-glaube/stark-glaube-3.jpg',
        imageMobileUrl: 'assets/images/stark-glaube/stark-glaube-3-mobile.jpg',
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
        id: 'senya-resort-plate1',
        title: 'Senya Resort',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/senya-resort/senya-resort-3.jpg',
        imageUrlDesktop: 'assets/images/senya-resort/senya-resort-3.jpg',
        imageMobileUrl: 'assets/images/senya-resort/senya-resort-3-mobile.jpg',
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
        imageMobileUrl: 'assets/images/senya-resort/senya-resort-2-mobile.jpg',
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
        id: 'npa-reception-renders-plate1',
        title: 'NPA',
        category: 'Architectural Visualization & BIM — 2022',
        service: 'Architectural Visualization & BIM',
        discipline: 'vfx',
        imageUrl: 'assets/images/npa/npa-2.jpg',
        imageUrlDesktop: 'assets/images/npa/npa-2.jpg',
        imageMobileUrl: 'assets/images/npa/npa-2-mobile.jpg',
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
        imageMobileUrl: 'assets/images/npa/npa-1-mobile.jpg',
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
        id: 'mtn-hq-plate1',
        title: 'MTN HQ',
        category: 'Graphic Design & 3D Visualization — 2017',
        service: 'Graphic Design & 3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/mtn-hq/mtn-hq-17.jpg',
        imageUrlDesktop: 'assets/images/mtn-hq/mtn-hq-17.jpg',
        imageMobileUrl: 'assets/images/mtn-hq/mtn-hq-17-mobile.jpg',
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
        imageUrl: 'assets/images/mtn-hq/mtn-hq-18.jpg',
        imageUrlDesktop: 'assets/images/mtn-hq/mtn-hq-18.jpg',
        imageMobileUrl: 'assets/images/mtn-hq/mtn-hq-18-mobile.jpg',
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
        id: 'kdmrd-plate1',
        title: 'KDMRD',
        category: '3D Visualization — 2017',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/kdmrd/kdmrd-hero.jpg',
        imageUrlDesktop: 'assets/images/kdmrd/kdmrd-hero.jpg',
        imageMobileUrl: 'assets/images/kdmrd/kdmrd-hero-mobile.jpg',
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
        imageMobileUrl: 'assets/images/kdmrd/kdmrd-1-mobile.jpg',
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
        imageUrl: 'assets/images/kdmrd/kdmrd-3.jpg',
        imageUrlDesktop: 'assets/images/kdmrd/kdmrd-3.jpg',
        imageMobileUrl: 'assets/images/kdmrd/kdmrd-3-mobile.jpg',
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
        id: 'gh-phot-awards-plate1',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-5.jpg',
        imageUrlDesktop: 'assets/images/gh-phot-awards/gh-phot-awards-5.jpg',
        imageMobileUrl: 'assets/images/gh-phot-awards/gh-phot-awards-5-mobile.jpg',
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
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-6.jpg',
        imageUrlDesktop: 'assets/images/gh-phot-awards/gh-phot-awards-6.jpg',
        imageMobileUrl: 'assets/images/gh-phot-awards/gh-phot-awards-6-mobile.jpg',
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
        id: 'details-film-plate1',
        title: 'Details',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-3.jpg',
        imageUrlDesktop: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-3.jpg',
        imageMobileUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-3-mobile.jpg',
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
        imageUrl: 'assets/images/dela-anyaa/dela-anyaa-10.jpg',
        imageUrlDesktop: 'assets/images/dela-anyaa/dela-anyaa-10.jpg',
        imageMobileUrl: 'assets/images/dela-anyaa/dela-anyaa-10-mobile.jpg',
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
        imageUrl: 'assets/images/dela-anyaa/dela-anyaa-9.jpg',
        imageUrlDesktop: 'assets/images/dela-anyaa/dela-anyaa-9.jpg',
        imageMobileUrl: 'assets/images/dela-anyaa/dela-anyaa-9-mobile.jpg',
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
        id: 'chocolate-plate1',
        title: 'Chocolate',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/chocolate/chocolate-14.jpg',
        imageUrlDesktop: 'assets/images/chocolate/chocolate-14.jpg',
        imageMobileUrl: 'assets/images/chocolate/chocolate-14-mobile.jpg',
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
        imageUrl: 'assets/images/chocolate/chocolate-15.jpg',
        imageUrlDesktop: 'assets/images/chocolate/chocolate-15.jpg',
        imageMobileUrl: 'assets/images/chocolate/chocolate-15-mobile.jpg',
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
        id: 'baobab-hotel-exteriors-plate1',
        title: 'Baobab Hotel - Exteriors',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-1.jpg',
        imageUrlDesktop: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-1.jpg',
        imageMobileUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-1-mobile.jpg',
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
        id: '2gs-plate2',
        title: '2GS',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/2gs/2gs-10.jpg',
        imageUrlDesktop: 'assets/images/2gs/2gs-10.jpg',
        imageMobileUrl: 'assets/images/2gs/2gs-10-mobile.jpg',
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
        imageUrl: 'assets/images/1981/1981-1.jpg',
        imageUrlDesktop: 'assets/images/1981/1981-1.jpg',
        imageMobileUrl: 'assets/images/1981/1981-1-mobile.jpg',
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
      {
        id: 'protea-hotel-airport',
        title: 'Protea Hotel - Airport',
        category: 'Architectural Visualization — 2020',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/protea-hotel-airport/E7iCvERX0AENu7d.jpg',
        imageUrlDesktop: 'assets/images/protea-hotel-airport/E7iCvERX0AENu7d.jpg',
        imageMobileUrl: 'assets/images/protea-hotel-airport/E7iCvERX0AENu7d-mobile.jpg',
        projectUrl: 'protea-hotel-airport.html'
      },
      {
        id: 'ahero',
        title: 'Ahero',
        category: 'Architectural Visualization & 3D Animation — 2022',
        service: 'Architectural Visualization & 3D Animation',
        discipline: 'vfx',
        imageUrl: 'assets/images/ahero/F9WX-jyXcAApIqO.jpg',
        imageUrlDesktop: 'assets/images/ahero/F9WX-jyXcAApIqO.jpg',
        imageMobileUrl: 'assets/images/ahero/F9WX-jyXcAApIqO-mobile.jpg',
        projectUrl: 'ahero.html'
      },
      {
        id: 'giffard-park',
        title: 'Giffard Park',
        category: 'Multi-Unit Residential — 2022',
        service: 'Multi-Unit Residential',
        discipline: 'vfx',
        imageUrl: 'assets/images/giffard-park/Ei4kUxWXYAIh8HL.jpg',
        imageUrlDesktop: 'assets/images/giffard-park/Ei4kUxWXYAIh8HL.jpg',
        imageMobileUrl: 'assets/images/giffard-park/Ei4kUxWXYAIh8HL-mobile.jpg',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'hola',
        title: 'Hola',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/hola/F1kFFaMWwAI9r82.jpg',
        imageUrlDesktop: 'assets/images/hola/F1kFFaMWwAI9r82.jpg',
        imageMobileUrl: 'assets/images/hola/F1kFFaMWwAI9r82-mobile.jpg',
        projectUrl: 'hola.html'
      },
      {
        id: 'lamu',
        title: 'Lamu',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/lamu/FtIUHJPXoA4P9Sk.jpg',
        imageUrlDesktop: 'assets/images/lamu/FtIUHJPXoA4P9Sk.jpg',
        imageMobileUrl: 'assets/images/lamu/FtIUHJPXoA4P9Sk-mobile.jpg',
        projectUrl: 'lamu.html'
      },
      {
        id: 'margin',
        title: 'Margin',
        category: 'Workplace Interiors — 2022',
        service: 'Workplace Interiors',
        discipline: 'vfx',
        imageUrl: 'assets/images/margin/GH1cB5CW4AAQFih.jpg',
        imageUrlDesktop: 'assets/images/margin/GH1cB5CW4AAQFih.jpg',
        imageMobileUrl: 'assets/images/margin/GH1cB5CW4AAQFih-mobile.jpg',
        projectUrl: 'margin.html'
      },
      {
        id: 'the-fitzgerald',
        title: 'The Fitzgerald',
        category: 'Event Space Interiors — 2022',
        service: 'Event Space Interiors',
        discipline: 'vfx',
        imageUrl: 'assets/images/the-fitzgerald/Eud0gaBUYAABir9.jpg',
        imageUrlDesktop: 'assets/images/the-fitzgerald/Eud0gaBUYAABir9.jpg',
        imageMobileUrl: 'assets/images/the-fitzgerald/Eud0gaBUYAABir9-mobile.jpg',
        projectUrl: 'the-fitzgerald.html'
      },
      {
        id: 'a-a',
        title: 'A-A',
        category: 'Interior Remodeling — 2023',
        service: 'Interior Remodeling',
        discipline: 'vfx',
        imageUrl: 'assets/images/a-a/G09Bw1sWAAATy5h.jpg',
        imageUrlDesktop: 'assets/images/a-a/G09Bw1sWAAATy5h.jpg',
        imageMobileUrl: 'assets/images/a-a/G09Bw1sWAAATy5h-mobile.jpg',
        projectUrl: 'a-a.html'
      },
      {
        id: 'ttd',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FsOwki3WcAEJtvW.jpg',
        imageUrlDesktop: 'assets/images/ttd/FsOwki3WcAEJtvW.jpg',
        imageMobileUrl: 'assets/images/ttd/FsOwki3WcAEJtvW-mobile.jpg',
        projectUrl: 'ttd.html'
      },
      {
        id: 'avalon',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/Gc8QzsaXkAAQotV.jpg',
        imageUrlDesktop: 'assets/images/avalon/Gc8QzsaXkAAQotV.jpg',
        imageMobileUrl: 'assets/images/avalon/Gc8QzsaXkAAQotV-mobile.jpg',
        projectUrl: 'avalon.html'
      },
      {
        id: 'ackon-desk',
        title: 'Ackon Desk',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ackon-desk/GUEAQ-MWsAAGT7n.jpg',
        imageUrlDesktop: 'assets/images/ackon-desk/GUEAQ-MWsAAGT7n.jpg',
        imageMobileUrl: 'assets/images/ackon-desk/GUEAQ-MWsAAGT7n-mobile.jpg',
        projectUrl: 'ackon-desk.html'
      },
      {
        id: 'mig',
        title: 'MIG',
        category: 'Modern Indigenous Goods — 2021',
        service: 'Modern Indigenous Goods',
        discipline: 'vfx',
        imageUrl: 'assets/images/mig/mig-1h-2.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-1h-2.jpg',
        imageMobileUrl: 'assets/images/mig/mig-1h-2-mobile.jpg',
        projectUrl: 'mig.html'
      }


    ]
  },

  motion: {
    name: 'Motion Design',
    videos: [
      {
        id: 'trumpet-africa-moonlit',
        title: 'Trumpet Africa Productions Ident',
        category: 'Broadcast — 2014',
        service: 'Broadcast',
        discipline: 'motion',
        videoUrl: 'assets/videos/trumpet-africa-ident/trumpet-africa-moonlit.mp4',
        videoUrlDesktop: 'assets/videos/trumpet-africa-ident/trumpet-africa-moonlit.mp4',
        videoMobileUrl: 'assets/videos/trumpet-africa-ident/trumpet-africa-moonlit-mobile.mp4',
        imageUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        imageUrlDesktop: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        imageMobileUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01-mobile.png',
        projectUrl: 'trumpet-africa-ident.html',
        desc: 'Full rendered broadcast ident animations',

        specs: {
          client: 'Trumpet Africa Productions',
          scope: 'Concept Development, Storyboarding, Illustrations, Motion Design & 3D Animation',
          team: 'Concept: Jude Nyoagbe + Randy Biney, Animation: Randy Biney',
          year: '2014',
          disciplines: ['Motion Design', '3D Animation']
        }
      },
      {
        id: 'hfc-commercial',
        title: 'HFC TVC',
        category: 'Visual Effects (VFX) & Motion Design — 2016',
        service: 'Visual Effects (VFX) & Motion Design',
        discipline: 'motion',
        videoUrl: 'assets/videos/hfc-tvc/hfc-commercial.mp4',
        videoUrlDesktop: 'assets/videos/hfc-tvc/hfc-commercial.mp4',
        videoMobileUrl: 'assets/videos/hfc-tvc/hfc-commercial-mobile.mp4',
        imageUrl: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
        imageUrlDesktop: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
        imageMobileUrl: 'assets/images/hfc-tvc/hfc-tvc-1-mobile.jpg',
        projectUrl: 'hfc-tvc.html',
        desc: 'The 2-second clip held with the project',

        specs: {
          client: 'Midnight Run',
          scope: 'Visual Effects (VFX) & Motion Design',
          team: 'Jude Abbey, Jude Nyoagbe, Randy Biney',
          year: '2016',
          disciplines: ['Motion Design', 'Keyframe Design']
        }
      },
      {
        id: 'elo-tv-film',
        title: 'ELO TV',
        category: 'Motion Design — 2015',
        service: 'Motion Design',
        discipline: 'motion',
        videoUrl: 'assets/videos/elo-tv/elo-tv-logo-16x9-v2.mp4',
        videoUrlDesktop: 'assets/videos/elo-tv/elo-tv-logo-16x9-v2.mp4',
        videoMobileUrl: 'assets/videos/elo-tv/elo-tv-logo-16x9-v2-mobile.mp4',
        imageUrl: 'assets/images/elo-tv/elo-tv-logo-frame.jpg',
        imageUrlDesktop: 'assets/images/elo-tv/elo-tv-logo-frame.jpg',
        imageMobileUrl: 'assets/images/elo-tv/elo-tv-logo-frame-mobile.jpg',
        projectUrl: 'elo-tv.html',
        desc: 'The broadcast ident itself: eight seconds at 1920x1080 and 30 fps in which a bloom of light opens the top bar of the slanted E, the three bars unfold onto a presenter in red, and the red tv chip resolves its letters before the mark holds and fades back to black.',
        specs: {
          client: 'ELO TV',
          scope: 'Graphic Design & Motion Design (Brand Identity, Stationery & Broadcast Ident)',
          team: 'RDVS Team',
          year: '2015',
          disciplines: ['Graphic Design', 'Motion Design']
        }
      },
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
        imageMobileUrl: 'assets/images/ceeander/ceeander-cover-mobile.jpg',
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
        imageMobileUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01-mobile.png',
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
        id: 'caustics-rnd',
        title: 'Caustics RnD',
        category: '3D Animation — 2020',
        service: '3D Animation',
        discipline: 'motion',
        videoUrl: 'assets/videos/caustics-rnd/caustics-rnd-film.mp4',
        videoUrlDesktop: 'assets/videos/caustics-rnd/caustics-rnd-film.mp4',
        videoMobileUrl: 'assets/videos/caustics-rnd/caustics-rnd-film-mobile.mp4',
        imageUrl: 'assets/images/caustics-rnd/caustics-rnd-film-frame.jpg',
        imageUrlDesktop: 'assets/images/caustics-rnd/caustics-rnd-film-frame.jpg',
        imageMobileUrl: 'assets/images/caustics-rnd/caustics-rnd-film-frame-mobile.jpg',
        projectUrl: 'caustics-rnd.html',
        desc: 'An in-house study of caustic light: 25.7 seconds at 1920x1080, rendered in Corona Renderer 5, of the rippled webs moving water throws across a pool, its edge and the wall behind it.',
        specs: {
          client: 'RDVS Studios',
          scope: 'Self-initiated study: modelling, look-dev, caustic light simulation, lighting, rendering and edit',
          team: 'RDVS',
          year: '2020',
          disciplines: ['Motion Design', '3D Animation']
        }
      }
    ],
    images: [
      {
        id: 'trumpet-africa-palette',
        title: 'Trumpet Africa Productions Ident',
        category: 'Broadcast — 2014',
        service: 'Broadcast',
        discipline: 'motion',
        imageUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-03.png',
        imageUrlDesktop: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-03.png',
        imageMobileUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-03-mobile.png',
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
        id: 'elo-tv-17',
        title: 'ELO TV',
        category: 'Motion Design — 2015',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/elo-tv/elo-tv-17.jpg',
        imageUrlDesktop: 'assets/images/elo-tv/elo-tv-17.jpg',
        imageMobileUrl: 'assets/images/elo-tv/elo-tv-17-mobile.jpg',
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
        id: 'ceeander-2',
        title: 'Ceeander Ident',
        category: '3D Animation — 2014',
        service: '3D Animation',
        discipline: 'motion',
        imageUrl: 'assets/images/ceeander/ceeander-7.png',
        imageUrlDesktop: 'assets/images/ceeander/ceeander-7.png',
        imageMobileUrl: 'assets/images/ceeander/ceeander-7-mobile.png',
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
        id: 'elo-tv',
        title: 'ELO TV',
        category: 'Motion Design — 2015',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/elo-tv/elo-tv-07.jpg',
        imageUrlDesktop: 'assets/images/elo-tv/elo-tv-07.jpg',
        imageMobileUrl: 'assets/images/elo-tv/elo-tv-07-mobile.jpg',
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
        id: 'trumpet-africa-motion-plate1',
        title: 'Trumpet Africa Productions Ident',
        category: 'Broadcast — 2014',
        service: 'Broadcast',
        discipline: 'motion',
        imageUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-02.png',
        imageUrlDesktop: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-02.png',
        imageMobileUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-02-mobile.png',
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
        id: 'hfc-tvc-motion-plate1',
        title: 'HFC TVC',
        category: 'Visual Effects (VFX) & Motion Design — 2016',
        service: 'Visual Effects (VFX) & Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hfc-tvc/hfc-tvc-7.jpg',
        imageUrlDesktop: 'assets/images/hfc-tvc/hfc-tvc-7.jpg',
        imageMobileUrl: 'assets/images/hfc-tvc/hfc-tvc-7-mobile.jpg',
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
        imageMobileUrl: 'assets/images/hfc-tvc/hfc-tvc-6-mobile.jpg',
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
        imageUrl: 'assets/images/glow-in-the-dark/glow-in-the-dark-teaser.gif',
        imageUrlDesktop: 'assets/images/glow-in-the-dark/glow-in-the-dark-teaser.gif',
        imageMobileUrl: 'assets/images/glow-in-the-dark/glow-in-the-dark-teaser-mobile.gif',
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
        id: 'ceeander-motion-plate1',
        title: 'Ceeander Ident',
        category: '3D Animation — 2014',
        service: '3D Animation',
        discipline: 'motion',
        imageUrl: 'assets/images/ceeander/ceeander-6.png',
        imageUrlDesktop: 'assets/images/ceeander/ceeander-6.png',
        imageMobileUrl: 'assets/images/ceeander/ceeander-6-mobile.png',
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

    ]
  },
  // The fifth stream is the studio's own MIG line: the seven `product-*.html` pieces, designed and
  // visualized in-house rather than commissioned. They joined work.html's grid on 2026-10-21, but they
  // keep their own stream so the deck gives them an equal share next to the four disciplines instead of
  // burying a piece of furniture inside the VFX pool.
  // Every still and every film a product page renders is pooled, not just the header,
  // so a plate deeper in the gallery can reach the deck too (user, 2026-10-05).
  // scratch/_build_product_pool.py rebuilds this block from the pages themselves.
  products: {
    name: 'Product Design',
    videos: [
      {
        id: 'product-hg-desk-film1',
        title: 'HG-DESK',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        videoUrl: 'assets/videos/hg-desk/hg-desk-film.mp4',
        videoUrlDesktop: 'assets/videos/hg-desk/hg-desk-film.mp4',
        videoMobileUrl: 'assets/videos/hg-desk/hg-desk-film-mobile.mp4',
        imageUrl: 'assets/images/mig/mig-hg-desk-1.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-hg-desk-1.jpg',
        imageMobileUrl: 'assets/images/mig/mig-hg-desk-1-mobile.jpg',
        projectUrl: 'product-hg-desk.html',
        desc: 'A work desk built around one thick top with a returned edge carrying the MIG mark, set on angled trestle supports. Designed by RDVS in 2020 for the MIG line.',
        specs: {
          client: 'RDVS Studios',
          year: '2020',
        }
      },
      {
        id: 'product-line-e-float-i-film1',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        videoUrl: 'assets/videos/line-e-float-i/line-e-float-i-film.mp4',
        videoUrlDesktop: 'assets/videos/line-e-float-i/line-e-float-i-film.mp4',
        videoMobileUrl: 'assets/videos/line-e-float-i/line-e-float-i-film-mobile.mp4',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-6.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-6.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-6-mobile.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'RDVS Studios',
          year: '2020',
        }
      },
      {
        id: 'product-mound-film1',
        title: 'MOUND',
        category: 'Design · VFX + CGI — 2016',
        service: 'Design · VFX + CGI',
        discipline: 'products',
        videoUrl: 'assets/videos/mound/mound-film.mp4',
        videoUrlDesktop: 'assets/videos/mound/mound-film.mp4',
        videoMobileUrl: 'assets/videos/mound/mound-film-mobile.mp4',
        imageUrl: 'assets/images/mig/mig-mound-1.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-mound-1.jpg',
        imageMobileUrl: 'assets/images/mig/mig-mound-1-mobile.jpg',
        projectUrl: 'product-mound.html',
        desc: 'The plate labels MOUND as accessories for fruit and clutter: a shallow tray for what collects on a surface, and a mesh-top bench doing the same job at a larger scale at the foot of a bed. Designed by RDVS in 2016 for the MIG line.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-1h-1-mobile.jpg',
        projectUrl: 'product-1h.html',
        desc: 'A wall run built from modules rather than one fixed elevation: open bays and closed volumes re-stack around a screen at eye level. RDVS designed 1H in 2016 for the MIG line and documented it in two schemes, a dark-stained set stacked as a tall bay and a white-and-dark set run wider across the wall.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-1h-2-mobile.jpg',
        projectUrl: 'product-1h.html',
        desc: 'A wall run built from modules rather than one fixed elevation: open bays and closed volumes re-stack around a screen at eye level. RDVS designed 1H in 2016 for the MIG line and documented it in two schemes, a dark-stained set stacked as a tall bay and a white-and-dark set run wider across the wall.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-1h-3-mobile.jpg',
        projectUrl: 'product-1h.html',
        desc: 'A wall run built from modules rather than one fixed elevation: open bays and closed volumes re-stack around a screen at eye level. RDVS designed 1H in 2016 for the MIG line and documented it in two schemes, a dark-stained set stacked as a tall bay and a white-and-dark set run wider across the wall.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-1h-4-mobile.jpg',
        projectUrl: 'product-1h.html',
        desc: 'A wall run built from modules rather than one fixed elevation: open bays and closed volumes re-stack around a screen at eye level. RDVS designed 1H in 2016 for the MIG line and documented it in two schemes, a dark-stained set stacked as a tall bay and a white-and-dark set run wider across the wall.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-1h-5-mobile.jpg',
        projectUrl: 'product-1h.html',
        desc: 'A wall run built from modules rather than one fixed elevation: open bays and closed volumes re-stack around a screen at eye level. RDVS designed 1H in 2016 for the MIG line and documented it in two schemes, a dark-stained set stacked as a tall bay and a white-and-dark set run wider across the wall.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-1h-6-mobile.jpg',
        projectUrl: 'product-1h.html',
        desc: 'A wall run built from modules rather than one fixed elevation: open bays and closed volumes re-stack around a screen at eye level. RDVS designed 1H in 2016 for the MIG line and documented it in two schemes, a dark-stained set stacked as a tall bay and a white-and-dark set run wider across the wall.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-hg-desk-1-mobile.jpg',
        projectUrl: 'product-hg-desk.html',
        desc: 'A work desk built around one thick top with a returned edge carrying the MIG mark, set on angled trestle supports. Designed by RDVS in 2020 for the MIG line.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-hg-desk-2-mobile.jpg',
        projectUrl: 'product-hg-desk.html',
        desc: 'A work desk built around one thick top with a returned edge carrying the MIG mark, set on angled trestle supports. Designed by RDVS in 2020 for the MIG line.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-hg-desk-3-mobile.jpg',
        projectUrl: 'product-hg-desk.html',
        desc: 'A work desk built around one thick top with a returned edge carrying the MIG mark, set on angled trestle supports. Designed by RDVS in 2020 for the MIG line.',
        specs: {
          client: 'RDVS Studios',
          year: '2020',
        }
      },
      {
        id: 'product-line-e-float-i',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-6.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-6.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-6-mobile.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'RDVS Studios',
          year: '2020',
        }
      },
      {
        id: 'product-line-e-float-i-plate2',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-7.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-7.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-7-mobile.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'RDVS Studios',
          year: '2020',
        }
      },
      {
        id: 'product-line-e-float-i-plate3',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-2.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-2.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-2-mobile.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'RDVS Studios',
          year: '2020',
        }
      },
      {
        id: 'product-line-e-float-i-plate4',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-3.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-3.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-3-mobile.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'RDVS Studios',
          year: '2020',
        }
      },
      {
        id: 'product-line-e-float-i-plate5',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-4.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-4.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-4-mobile.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'RDVS Studios',
          year: '2020',
        }
      },
      {
        id: 'product-line-e-float-i-plate6',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-5.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-5.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-5-mobile.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'RDVS Studios',
          year: '2020',
        }
      },
      {
        id: 'product-line-e-float-i-plate7',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-8.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-8.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-8-mobile.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'RDVS Studios',
          year: '2020',
        }
      },
      {
        id: 'product-line-e-float-i-plate8',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-9.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-9.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-9-mobile.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'RDVS Studios',
          year: '2020',
        }
      },
      {
        id: 'product-line-e-float-i-plate9',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        imageUrl: 'assets/images/mig/mig-line-e-float-i-10.jpg',
        imageUrlDesktop: 'assets/images/mig/mig-line-e-float-i-10.jpg',
        imageMobileUrl: 'assets/images/mig/mig-line-e-float-i-10-mobile.jpg',
        projectUrl: 'product-line-e-float-i.html',
        desc: 'A media unit carried off the floor on the wall, so the floor below it stays clear and the screen reads as the only thing in the run. Shown in blush against a two-tone wall, and in white under a matching shelf.',
        specs: {
          client: 'RDVS Studios',
          year: '2020',
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
        imageMobileUrl: 'assets/images/mig/mig-mound-1-mobile.jpg',
        projectUrl: 'product-mound.html',
        desc: 'The plate labels MOUND as accessories for fruit and clutter: a shallow tray for what collects on a surface, and a mesh-top bench doing the same job at a larger scale at the foot of a bed. Designed by RDVS in 2016 for the MIG line.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-mound-2-mobile.jpg',
        projectUrl: 'product-mound.html',
        desc: 'The plate labels MOUND as accessories for fruit and clutter: a shallow tray for what collects on a surface, and a mesh-top bench doing the same job at a larger scale at the foot of a bed. Designed by RDVS in 2016 for the MIG line.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-s-age-1-mobile.jpg',
        projectUrl: 'product-s-age.html',
        desc: 'A curved front-of-house desk in white, its plain panel carrying an information-desk pictogram. Designed by RDVS in 2018 for the MIG line.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-s-age-2-mobile.jpg',
        projectUrl: 'product-s-age.html',
        desc: 'A curved front-of-house desk in white, its plain panel carrying an information-desk pictogram. Designed by RDVS in 2018 for the MIG line.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-sp001-1-mobile.jpg',
        projectUrl: 'product-sp001.html',
        desc: 'A low pod for a power nap at work, deep enough to hold some privacy. Designed by RDVS in 2019 for the MIG line, and given here lit on black, dressed with pillows, and exploded so the slatted top and the hardwood frame read separately.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-sp001-2-mobile.jpg',
        projectUrl: 'product-sp001.html',
        desc: 'A low pod for a power nap at work, deep enough to hold some privacy. Designed by RDVS in 2019 for the MIG line, and given here lit on black, dressed with pillows, and exploded so the slatted top and the hardwood frame read separately.',
        specs: {
          client: 'RDVS Studios',
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
        imageMobileUrl: 'assets/images/mig/mig-sp001-3-mobile.jpg',
        projectUrl: 'product-sp001.html',
        desc: 'A low pod for a power nap at work, deep enough to hold some privacy. Designed by RDVS in 2019 for the MIG line, and given here lit on black, dressed with pillows, and exploded so the slatted top and the hardwood frame read separately.',
        specs: {
          client: 'RDVS Studios',
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

  // ─── News slides: the first 3 items from the news section always CLOSE the slideshow ───
  // Owner order, 2026-10-22: the news articles used to lead the deck; they now play last, so the
  // dispatch is the final slide before the automatic reload.
  // Fallback snapshot mirrors news.html (applies on file:// where fetch is blocked).
  // The film belongs to the news ITEM, not to the card's markup, so the deck's two routes -- the fetched
  // news.html card and the snapshot below -- both take it from this one table and cannot disagree about what
  // the slide plays. Owner order 2026-10-22: "use the final intro animation as the video for the slideshow on
  // the homepage for the news item about 'We have updated our website'". The film is a film of what SHIPS:
  // scratch/_intro_render_build.py lifts the veil out of index.html byte for byte, Chrome pauses and seeks it
  // at 30 fps, scratch/_intro_film.py encodes it, and scratch/_intro_film_contract.py re-checks every path in
  // this table against the bytes on disk. The posters are frames OF THE FILM, not the hamlet plate the slide
  // used to borrow. news.html's card and we-have-updated-our-website.html's header keep the photo: this order
  // is the slideshow, and one item at a time.
  //
  // The ladder below is the second half of the same order: "make versions for every screen type/size so when
  // the user is using a certain size of device the appropriate size/resolution is what is called/played".
  // Each rung is the animation rendered AT that device's own viewport and pixel ratio, so it is that device's
  // layout of the composition -- the veil sizes its type as min(13vw,24vh) and places everything in
  // percentages, which means a rung is not a crop of another rung. scratch/_intro_tiers.py owns the table
  // (viewport, ratio, media query, file names), writes this block, and the contract fails if the block and
  // the ladder on disk diverge.
  // <<<INTRO-FILM-LADDER  generated by `py -3.10 -X utf8 scratch/_intro_tiers.py --emit`; do not hand-edit
  const INTRO_FILM_RUNGS = [
    { media: '(max-width: 429px)', video: 'assets/videos/rdvs-intro/rdvs-intro-film-phone.mp4', poster: 'assets/images/rdvs-intro/rdvs-intro-film-frame-phone.jpg' },
    { media: '(max-width: 767px)', video: 'assets/videos/rdvs-intro/rdvs-intro-film-phone-large.mp4', poster: 'assets/images/rdvs-intro/rdvs-intro-film-frame-phone-large.jpg' },
    { media: '(max-width: 1180px) and (orientation: portrait)', video: 'assets/videos/rdvs-intro/rdvs-intro-film-tablet-portrait.mp4', poster: 'assets/images/rdvs-intro/rdvs-intro-film-frame-tablet-portrait.jpg' },
    { media: '(max-width: 1365px) and (orientation: landscape)', video: 'assets/videos/rdvs-intro/rdvs-intro-film-tablet-landscape.mp4', poster: 'assets/images/rdvs-intro/rdvs-intro-film-frame-tablet-landscape.jpg' },
    { media: '(max-width: 1600px)', video: 'assets/videos/rdvs-intro/rdvs-intro-film-laptop.mp4', poster: 'assets/images/rdvs-intro/rdvs-intro-film-frame-laptop.jpg' },
    { media: '', video: 'assets/videos/rdvs-intro/rdvs-intro-film-desktop.mp4', poster: 'assets/images/rdvs-intro/rdvs-intro-film-frame-desktop.jpg' }
  ];
  // >>>INTRO-FILM-LADDER

  /** The rung this viewport is in: the FIRST media query that matches, and the last entry (no query) if
   *  none does. One function answers for the markup, for the viewport swap and for the background warm
   *  queue, so the bytes a slide buys are the bytes the slide loads. */
  function filmRendition(proj) {
    const rungs = proj && proj.renditions;
    if (!rungs || !rungs.length) return null;
    for (const rung of rungs) {
      if (!rung.media || window.matchMedia(rung.media).matches) return rung;
    }
    return rungs[rungs.length - 1];
  }

  const NEWS_FILMS = {
    'we-have-updated-our-website.html': {
      renditions: INTRO_FILM_RUNGS,
      // There is no per-slide fit any more (owner, 2026-10-23: "make sure the video for the news slide fills
      // the screen like all the other slides"). This entry used to carry `fit: 'contain'`, which letterboxes
      // the film -- black bars on any window whose aspect differs from its rendition's -- and a barred slide
      // is exactly the thing the deck's other fourteen slides are not. The house rule in css/styles.css is
      // `object-fit: cover` on .slide-media video and this slide now simply takes it.
      //
      // What cover costs is measured, not guessed: scratch/_news_slide_fill.py reads the ladder out of this
      // file, takes the veil's own ink margins out of scratch/_intro_boxes.json (the type block starts 5.22%
      // from the left and the widest line ends 6.2% from the right of its frame), and prints the crop for 24
      // real viewports. On the device a rung was rendered for the crop is 0.0%, because a rung is painted AT
      // that viewport; the exposure is on windows that fall between rungs, where the crop can reach 6.8% per
      // side and shave a letter or the footer line. That is the trade he asked for, and the numbers are in
      // the handoff rather than buried under a rule that hides them.
      videoUrl: 'assets/videos/rdvs-intro/rdvs-intro-film-desktop.mp4',
      videoUrlDesktop: 'assets/videos/rdvs-intro/rdvs-intro-film-desktop.mp4',
      videoMobileUrl: 'assets/videos/rdvs-intro/rdvs-intro-film-phone.mp4',
      imageUrl: 'assets/images/rdvs-intro/rdvs-intro-film-frame-desktop.jpg',
      imageUrlDesktop: 'assets/images/rdvs-intro/rdvs-intro-film-frame-desktop.jpg',
      imageMobileUrl: 'assets/images/rdvs-intro/rdvs-intro-film-frame-phone.jpg',
    },
  };

  const staticNewsSlides = [
    {
      id: 'news-website-update',
      title: 'We have updated our website',
      category: 'Studio Dispatch — 2026',
      service: 'Studio Dispatch',
      discipline: 'news',
      // Media comes out of NEWS_FILMS above, the same table the fetched route applies to the card it reads, so
      // the two routes cannot render different media on the one slide both claim to mirror. That agreement is
      // why this block exists at all: the snapshot used to name assets/images/hamlet/hamlet-estate.jpg — a
      // 1600x2000 portrait master at 1.87 MB — where the HTTP path produced the card's desktop plate, and it
      // then mirrored the card's two hamlet renditions. The owner has since put the studio's opening animation
      // on this slide, so what both routes mirror now is that film and the film's own frames.
      ...NEWS_FILMS['we-have-updated-our-website.html'],
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

        const entry = {
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
        };
        // A news ITEM can carry a film that the card itself does not draw -- NEWS_FILMS above. Merged LAST, so
        // the film's own frames replace the card's photo, which is what keeps the fetched route and the static
        // snapshot rendering the same media on the same slide.
        entries.push(Object.assign(entry, NEWS_FILMS[entry.projectUrl] || {}));
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
  // occupy the tail, so the budget adapts to their count.
  const serviceKeys = ['architecture', 'interiors', 'vfx', 'motion', 'products'];
  // Owner, 2026-10-22: "let's reduce the number of slides on the homepage from 20 to 15". The deck
  // was twenty since the pool was enlarged; 15 is the new size, and it is ONE fact told in two
  // places that have to agree -- this constant and the number of .slide / .caption-card /
  // .pagination-bar blocks baked into index.html. `scratch/_deck_size_contract.py` is the guard.
  const TOTAL_SLIDE_BUDGET = 15;

  // Drawn again on every page load, so a refresh — or the automatic reload that fires when
  // the deck reaches slide 15 — shows a different cut of the work instead of replaying the
  // same fifteen. Fisher-Yates over a copy; the pools stay as curated.
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
  // slideshow running indefinitely on fresh material: the deck plays through its last slide —
  // which since 2026-10-22 is the news article — and only then the page reloads and a new
  // draw starts at slide one. The deck itself was cut to fifteen slides on 2026-10-22, so the
  // reload fires at the end of the shorter run -- not at a twentieth slide that no longer exists.
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

  // News items always run LAST (owner order, 2026-10-22 — they led the deck before); the works
  // before them play in random order, with a swap pass so the same work never occupies two
  // consecutive slides.
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

  const projects = spreadRepeats([...shuffled(drawnProjects), ...newsSlides]);

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
  // The slide title is itself a link to its project page (the owner's markup of 2026-10-24 boxes
  // the title and asks for it), so the caption heading carries an <a>.  The deck therefore writes
  // the ANCHOR's text: titleEl.textContent on the heading would replace the heading's children and
  // delete the link on the first slide change.  Falls back to the heading when a card has no
  // anchor, which is what the baked markup always has but a hand-edited page might not.
  function setSlideTitle(titleEl, text, href) {
    if (!titleEl) return;
    const link = titleEl.querySelector('a.project-title-link') || titleEl;
    link.textContent = text;
    if (href && link !== titleEl) link.setAttribute('href', href);
  }

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
    ['Disciplines', 'disciplines']
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
              // A laddered film takes its rung, which carries its own poster frame; every other film keeps
              // the deck's house two-rendition split, decided here rather than by the <source> children
              // below: a src attribute is read first and the children are only walked when it is absent,
              // so those two lines have always been decoration. A ladder would state the same choice twice
              // in two dialects, so a laddered slide gets one src, no children, and filmRendition() is the
              // only thing that decides which file a viewport plays.
              const rung = filmRendition(proj);
              const activeVid = isMobileViewport && mobVid ? mobVid : deskVid;
              const activePoster = isMobileViewport && mobPoster ? mobPoster : deskPoster;

              mediaContainer.innerHTML = rung
                ? `
                <video class="slide-video" src="${rung.video}" poster="${rung.poster}" muted playsinline preload="none"></video>
              `
                : `
                <video class="slide-video" src="${activeVid}" poster="${activePoster}" muted playsinline preload="none">
                  <source media="(max-width: 768px)" src="${mobVid}" type="video/mp4">
                  <source src="${deskVid}" type="video/mp4">
                </video>
              `;
              // preload="none" at build time is the other half of the background preloading below:
              // the poster still paints instantly, but no film asks for bytes until either it becomes
              // the active slide (play() needs them) or the warm queue reaches it. Before this order
              // every painted film carried preload="auto" and they all started together -- five films,
              // 37.5 MB, one ident that took 61 s on a loopback connection.
              //
              // Nothing here re-classes the container any more: the framing of a slide is decided by
              // css/styles.css alone, for all fifteen of them (owner, 2026-10-23).
            }

          } else {
            const deskImg = proj.imageUrlDesktop || proj.imageUrl;
            const mobImg = proj.imageMobileUrl || proj.imageUrl;
            // ONE STILL AT A TIME (owner, 2026-10-22). Only the slide the viewer lands on is a live image.
            // The rest hold their URLs in data-src / data-srcset until hydrateStills() lights them, and the
            // picture keeps `data-defer` so a guard can tell "deferred on purpose" from "deferred and forgot
            // to light". This is the deck's own half of the same rule index.html's baked paint follows (see
            // slide_markup in scratch/_paint_homepage_deck.py); loading="lazy" alone was not it, because all
            // fifteen slides sit stacked in one 100vw x 100dvh box, so every one of them counts as being in
            // the viewport and the preload scanner asked for all fifteen at once.
            mediaContainer.innerHTML = `
              <picture class="slide-picture"${idx === 0 ? '' : ' data-defer'}>
                <source media="(max-width: 768px)" ${idx === 0 ? 'srcset' : 'data-srcset'}="${mobImg}">
                <img ${idx === 0 ? 'src' : 'data-src'}="${deskImg}" alt="${proj.title}" class="slide-img" ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
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
        if (titleEl) setSlideTitle(titleEl, proj.title, proj.projectUrl);
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
        if (titleEl) setSlideTitle(titleEl, info.title, proj.projectUrl);
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
  // Owner order, 2026-10-27: "instead of 15 seconds, let's extend the playback time on the slides
  // on the homepage for videos more than 30 seconds to 30 seconds like before." A film longer
  // than 30 s is cut at 30 s and the deck moves on; a film shorter than that still plays once, in
  // full, and its own `ended` event advances the slide, so 30 is a ceiling and never a floor.
  // (The ceiling was 30 s until 2026-10-22, 15 s between then and this order.)
  const MAX_VIDEO_DURATION = 30; // seconds of a film the slideshow will play before advancing
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

  function introIsUp() {
    /**
     * The opening veil sits over the deck at z-index 10000 and removes its own node when it is done, so
     * "the veil is still in the document" is the honest test for "the visitor cannot see the deck yet".
     *
     * It is scoped two ways on purpose. A returning visitor has `data-intro="done"` on <html> (set in the
     * head, before this file runs): their veil is display:none and still dropping its node a beat late, and
     * waiting for that would stall the deck for nobody's benefit. And everywhere but index.html there is no
     * veil node at all, so every other page returns false on the first check and is untouched by this.
     */
    if (document.documentElement.dataset.intro) return false;
    return document.getElementById('rdvsIntro') !== null;
  }

  function initCarousel() {
    if (statusTotal) {
      statusTotal.textContent = String(totalSlides).padStart(2, '0');
    }
    // Owner order, 2026-10-22: the intro's line now finishes wiping before any letter appears, which takes
    // the overlay from 5.05 s to 6.90 s -- past an image slide's 6 s dwell. Started under the veil, the deck
    // spent its first slide on a slide nobody could see (and played a film slide's opening seconds behind a
    // blue field). So the deck waits for the overlay to leave, then starts from slide 0 as if the visitor
    // had just arrived. Deferred once, by a 100 ms poll, and only while the veil is actually up.
    if (introIsUp()) {
      // Owner order, 2026-10-22: warm the deck's media UNDER the veil. The visitor cannot see the deck for
      // VEIL seconds and the deck does not start until it leaves, so the pipe is free for exactly that long
      // -- and `preload="none"` on a built film slide means it has asked for nothing on its own account.
      // Still first, film second: hydrateStills() is synchronous and the three stills the viewer reaches
      // inside a minute are the smaller, more visible payload, while requestFilmWarm() waits for an idle
      // beat (up to 4 s) before it puts a film in flight.
      //
      // What does NOT happen under the veil is the deck advancing. Its own start stays on the other side of
      // this branch, so no slide burns its dwell behind a blue field and no film plays its opening seconds to
      // nobody (that regression is why initCarousel defers itself at all -- see the note above).
      hydrateStills();
      requestFilmWarm();
      const waitForIntro = setInterval(() => {
        if (introIsUp()) return;
        clearInterval(waitForIntro);
        initCarousel();
      }, 100);
      return;
    }
    deckStarted = true;
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

    // The film being preloaded in the background may be the one the viewer has just arrived at.
    // Playback owns that element from here, so the queue releases it instead of competing with it.
    handOffWarm(currentIndex);

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
        if (isActive && proj && !proj.is360 && (proj.videoMobileUrl || proj.renditions)) {
          // The same selector the markup used and the one the warm queue uses, so a rotated phone or a
          // resized window moves the slide to the rung that fits it -- poster and all -- instead of
          // letterboxing a landscape film into a portrait box.
          const rung = filmRendition(proj);
          const isMobileNow = window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
          const targetSrc = rung ? rung.video
                                 : (isMobileNow ? proj.videoMobileUrl : (proj.videoUrlDesktop || proj.videoUrl));
          if (targetSrc && !vid.src.endsWith(targetSrc)) {
            vid.src = targetSrc;
            if (rung) vid.poster = rung.poster;
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

    // Every advance re-arms the background preloading from the new position, so the queue is always
    // walking toward the slides the viewer has not seen yet.
    requestFilmWarm();
    // ... and the same walk for the stills: the two slides past this one get their URLs now, so the image
    // is already decoding when the dwell runs out instead of starting to load at the cut.
    hydrateStills();
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
       * - "play 30 seconds of the video if it is longer than that" (2026-10-27; the cap was 15 s
       *   from 2026-10-22 and 30 s before that)
       * - "for videos less than 30 seconds play the video once and move to the next slide"
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

        // Rule: a film longer than the cap is cut at it -- 30 s (15 s between 2026-10-22 and
        // the 2026-10-27 order that restored 30).
        if (cur >= MAX_VIDEO_DURATION) {
          advanceToNext();
        }
      };

      const onEnded = () => {
        // Rule: for videos shorter than the cap, play once and move to next slide
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

  // ---------------------------------------------------------------- deferred stills, one at a time
  /**
   * Owner order, 2026-10-22, on the slow-slideshow investigation: "one still at a time, plus warm under the
   * veil".
   *
   * Measured before it (scratch/_deck_load.py): index.html asked for all fifteen painted stills between
   * 1,286 and 1,591 ms -- ~11 MB of plates up to 3088 px wide -- while the intro veil still covered the
   * deck, and populateRandomizedSlides() then re-drew the deck at random and rewrote every .slide-media, so
   * those bytes were thrown away and the drawn fifteen were fetched on top of them: ~22 MB of stills to
   * paint ~11 MB of pixels, none of it wanted before 6.90 s. loading="lazy" sat on every one of those images
   * and changed nothing, because the fifteen slides are stacked inside the same 100vw x 100dvh box and only
   * opacity-hidden, so the browser sees fifteen in-viewport images and loads fifteen.
   *
   * So a still that is neither the slide on screen nor one of the TWO after it has no `src` at all: its URL
   * waits in data-src / data-srcset and nothing is fetched for it. Three of a deck that holds an image slide
   * for DEFAULT_IMAGE_DURATION is ~18 s of runway for the heaviest plate in the pool, which is enough headroom
   * at 2 Mbps, and it is the same "in the order the viewer will actually see them, one at a time" discipline
   * the film warm queue below runs. `data-defer` comes off the picture as it is lit, which is what makes
   * lighting idempotent and keeps "deferred on purpose" separable from "lit and done" in a DOM read.
   *
   * Slide 1 is exempt at both ends: it is the only still index.html paints live, because it is the one thing
   * a visitor sees before this file has run.
   */
  const STILL_AHEAD = 2;          // slides hydrated in front of the viewer, besides the one on screen
  let deckStarted = false;        // false while the intro veil is up -- this is what filmQueue() warms from

  function lightStill(idx) {
    const slide = slides[idx];
    if (!slide) return;
    const pic = slide.querySelector('picture.slide-picture[data-defer]');
    if (!pic) return;                       // slide 1, or a film slide: its poster rides on the <video>
    pic.querySelectorAll('source[data-srcset]').forEach((s) => { s.srcset = s.dataset.srcset; });
    const img = pic.querySelector('img[data-src]');
    if (img) img.src = img.dataset.src;
    pic.removeAttribute('data-defer');
  }

  function hydrateStills() {
    // the deck's own walk order, wrapping over the end, exactly like filmQueue()
    for (let step = 0; step <= STILL_AHEAD; step++) lightStill((currentIndex + step) % totalSlides);
  }

  // ---------------------------------------------------------------- background film preloading
  /**
   * Owner order, 2026-10-22: "for the animations and videos in the slideshow on the homepage, preload
   * them in the background so they load faster".
   *
   * Measured before it (scratch/_preload_baseline_2026-10-22.md): every painted film slide carried
   * preload="auto", so one draw put 5 films / 37.5 MB into the pipe at the same instant, they shared
   * the bandwidth, `waiting` fired on 3 of 3 film activations, and the worst file — a 13.2 MB logo
   * animation — needed 61 s on a LOOPBACK connection. Nothing about that is the film's fault: the deck
   * was asking for all of them at once, the one on screen included.
   *
   * So the deck now preloads its own films in the order the viewer will actually see them, ONE IN THE
   * BACKGROUND AT A TIME, in the slide's own <video> element (never a second copy of the file), and it
   * never preloads the slide that is currently playing -- that one already has the pipe. The deck's own
   * file, the one on screen, is always allowed to fetch on its own account, so the worst case measured
   * here is one background film plus the playing one. The queue restarts from the new position each
   * time the deck advances, so the film two slides ahead is buffered rather than the one the viewer is
   * never going to reach, and a film is promoted exactly once per page life (`__warmed`) -- promoting
   * it again after the deck wrapped would download it a second time.
   */
  const FILM_WARM_RETRY_MS = 1200;      // breathing room between two warm passes
  const FILM_WARM_CAP_MS = 20000;       // a stalled range must not park the whole queue
  const warmedFilms = new Set();        // urls this page has already taken as far as it intends to
  let warmItem = null;                  // the single film currently in flight
  let warmTimer = null;
  let warmGap = null;

  function filmUrlFor(proj) {
    // the same rendition the slide markup and updateSlide() would use, so a warm never buys the wrong file
    if (!proj || !proj.videoUrl) return '';
    const rung = filmRendition(proj);
    if (rung) return rung.video;
    const onMobile = window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;
    return onMobile && proj.videoMobileUrl ? proj.videoMobileUrl : (proj.videoUrlDesktop || proj.videoUrl);
  }

  function lightDataWanted() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return !!(conn && (conn.saveData || /2g/.test(conn.effectiveType || '')));
  }

  function filmQueue() {
    // the films ahead of the viewer, nearest first, wrapping over the end of the deck — the active
    // slide is deliberately not in here, and a 360 slide owns its own media so it is skipped too
    const out = [];
    const seen = new Set();
    // ... but "the active slide already has the pipe" is only true once the deck has STARTED. Under the intro
    // veil nothing is playing, a built film slide carries preload="none", and the slide the viewer lands on in
    // 6.9 s is precisely the one whose bytes matter most, so while deckStarted is false it is first in line.
    for (let step = deckStarted ? 1 : 0; step < totalSlides; step++) {
      const idx = (currentIndex + step) % totalSlides;
      const slide = slides[idx];
      const vid = slide ? slide.querySelector('video') : null;
      // __warmed is what keeps this to ONE download per film for the life of the page: a slide that
      // has already been promoted -- or already played, because the deck wrapped around -- must not
      // be handed to load() a second time.
      if (!vid || slide._vrViewer || vid.__warmed) continue;
      const url = filmUrlFor(projects[idx]);
      if (!url || warmedFilms.has(url) || seen.has(url)) continue;
      seen.add(url);
      out.push({ idx, vid, url });
    }
    return out;
  }

  function warmNextFilm() {
    if (warmItem || document.hidden || lightDataWanted()) return;
    const item = filmQueue()[0];
    if (!item) return;

    item.vid.__warmed = true;
    if (item.vid.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      // it fetched everything already (the viewer watched this film and the deck came back around)
      warmedFilms.add(item.url);
      return warmLater();
    }

    warmItem = item;
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      clearTimeout(warmTimer);
      warmTimer = null;
      item.vid.removeEventListener('canplay', settle);
      item.vid.removeEventListener('error', settle);
      if (warmItem && warmItem.url === item.url) warmItem = null;
      // A film that reached "canplay" is playable, which is the point of warming it; error counts as
      // finished so the queue never re-tries a file the browser will not take.
      if (item.vid.error || item.vid.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) warmedFilms.add(item.url);
      warmLater();
    };
    item.vid.addEventListener('canplay', settle, { once: true });
    item.vid.addEventListener('error', settle, { once: true });

    // Chrome re-runs resource selection when `preload` changes, so promotion is the preload flip and
    // NOT a load() call: calling load() unconditionally aborts the request the flip just made and
    // downloads the same film twice (measured here on 2026-10-22 -- two resource-timing entries for
    // funko-terrace.mp4, one of them 1 ms). A browser that ignored the flip is forced a beat later,
    // and only if it demonstrably started nothing.
    item.vid.preload = 'auto';
    setTimeout(() => {
      if (settled) return;
      if (item.vid.networkState === HTMLMediaElement.NETWORK_EMPTY) item.vid.load();
    }, 60);
    warmTimer = setTimeout(settle, FILM_WARM_CAP_MS);
  }

  function warmLater() {
    clearTimeout(warmGap);
    warmGap = setTimeout(warmNextFilm, FILM_WARM_RETRY_MS);
  }

  function requestFilmWarm() {
    // idle first: the slide on screen and its caption are the visit's real work
    clearTimeout(warmGap);
    if (window.requestIdleCallback) window.requestIdleCallback(() => warmNextFilm(), { timeout: 4000 });
    else warmGap = setTimeout(warmNextFilm, 1500);
  }

  function handOffWarm(idx) {
    // the deck just landed on the film being warmed -- playback takes over the same element, so the
    // queue lets go of it (and its watchdog) instead of competing with itself
    if (warmItem && warmItem.idx === idx) {
      clearTimeout(warmTimer);
      warmTimer = null;
      warmItem = null;
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) requestFilmWarm();
  });

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
    // Was the gesture that just ended a DRAG? The edge step arrows are visible and therefore live on a
    // touch screen now (owner, 2026-10-23: "let's have the arrows for the slideshow on mobile screen too"),
    // and a touch browser may hand a `click` to whatever is under the finger when a swipe ends. A drag that
    // starts inside one of the 16% bands would then be two commands from one gesture: this handler steps,
    // and the band's own click handler steps again -- in the same direction when the drag starts on the band
    // that points that way, which is exactly the case that reads as the deck running away rather than as a
    // bug. The flag is cleared on every touchstart, set only past the same 50 px this handler already
    // requires, and consumed once by the click listener below. A tap never sets it, so a tap never loses.
    let stepGestureSwipe = false;

    if (heroViewport) {
      heroViewport.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stepGestureSwipe = false;
      }, { passive: true });

      heroViewport.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50 || touchEndX > touchStartX + 50) {
          stepGestureSwipe = true;
        }
        if (touchEndX < touchStartX - 50) {
          updateSlide(currentIndex + 1);
        } else if (touchEndX > touchStartX + 50) {
          updateSlide(currentIndex - 1);
        }
      }, { passive: true });

      // Capture, so this runs before the button's own listener and can stop the propagation outright. It
      // only ever acts on the click that is the tail of the swipe that just happened; a tap, a mouse click
      // and a keyboard activation all arrive with the flag clear.
      heroViewport.addEventListener('click', (e) => {
        if (!stepGestureSwipe) return;
        stepGestureSwipe = false;
        if (e.target && e.target.closest && e.target.closest('.step-btn')) {
          e.stopPropagation();
        }
      }, true);
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
