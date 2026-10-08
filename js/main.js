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
    'ameyaw-sarah.html': ['design'],
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
    'drw-furnart.html': ['design', 'vfx-cgi'],
    'dyv.html': ['design', 'vfx-cgi'],
    'ehr.html': ['design', 'vfx-cgi'],
    'el-dor.html': ['design', 'vfx-cgi'],
    'ela-b.html': ['design', 'vfx-cgi'],
    'elo-tv.html': ['design'],
    'empire-tower.html': ['design', 'vfx-cgi'],
    'frontier-filling-station.html': ['design', 'vfx-cgi'],
    'fule.html': ['vfx-cgi'],
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
    'marble-bath.html': ['vfx-cgi'],
    'margin.html': ['design', 'vfx-cgi'],
    'mig.html': ['design'],
    'moty.html': ['design', 'vfx-cgi'],
    'mtn.html': ['design', 'vfx-cgi'],
    'naadei-villas.html': ['design'],
    'npa-reception-renders.html': ['bim', 'vfx-cgi'],
    'nyla-court.html': ['design', 'vfx-cgi'],
    'petrus.html': ['design', 'vfx-cgi'],
    'poconos-bar-grill.html': ['design', 'vfx-cgi'],
    'product-1h.html': ['design', 'vfx-cgi'],
    'product-hg-desk.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-line-e-float-i.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-mlky.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-mound.html': ['design', 'vfx-cgi'],
    'product-s-age.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-sp001.html': ['design', 'studio-projects', 'vfx-cgi'],
    'protea-hotel-airport.html': ['vfx-cgi'],
    'purc.html': ['design', 'turnkey-build'],
    'senya-resort.html': ['vfx-cgi'],
    'stanchart-hq.html': ['vfx-cgi'],
    'stark-glaube.html': ['design'],
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
        id: 'funko-ridge',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        videoUrl: 'assets/videos/funko-ridge/funko-terrace.mp4',
        videoUrlDesktop: 'assets/videos/funko-ridge/funko-terrace.mp4',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
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
        imageUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
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
        id: 'dyv-dawn',
        title: 'DYV',
        category: 'Interior Design & Architectural Visualization — 2025',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/dyv/dyv-dawn.jpg',
        imageUrlDesktop: 'assets/images/dyv/dyv-dawn.jpg',
        imageMobileUrl: 'assets/images/dyv/dyv-dawn.jpg',
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
        imageUrl: 'assets/images/barham/barham-residence.jpg',
        imageUrlDesktop: 'assets/images/barham/barham-residence.jpg',
        imageMobileUrl: 'assets/images/barham/barham-residence.jpg',
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
        imageUrl: 'assets/images/purc/purc-facade.jpg',
        imageUrlDesktop: 'assets/images/purc/purc-facade.jpg',
        imageMobileUrl: 'assets/images/purc/purc-facade.jpg',
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
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/empire-tower/empire-tower-3.jpg',
        imageUrlDesktop: 'assets/images/empire-tower/empire-tower-3.jpg',
        imageMobileUrl: 'assets/images/empire-tower/empire-tower-3.jpg',
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
        id: 'funko-ridge-plate1',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
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
        imageUrl: 'assets/images/empire-tower/empire-tower-1.jpg',
        imageUrlDesktop: 'assets/images/empire-tower/empire-tower-1.jpg',
        imageMobileUrl: 'assets/images/empire-tower/empire-tower-1.jpg',
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
        imageMobileUrl: 'assets/images/dyv/dyv-panoramic-header.jpg',
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
        id: 'dyv-dawn-plate2',
        title: 'DYV',
        category: 'Interior Design & Architectural Visualization — 2025',
        service: 'Interior Design & Architectural Visualization',
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
        imageMobileUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-2.jpg',
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
        imageMobileUrl: 'assets/images/csm/csm-1.jpg',
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
        imageMobileUrl: 'assets/images/hamlet/hamlet-estate.jpg',
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
        imageMobileUrl: 'assets/images/1957/1957-12.jpg',
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
        imageMobileUrl: 'assets/images/afg/afg-17.jpg',
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
        id: 'kuma-residence',
        title: 'Kuma Residence',
        category: 'Interior Design & Architectural Visualization — 2022',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/kuma-residence/kuma-residence-1.jpg',
        imageUrlDesktop: 'assets/images/kuma-residence/kuma-residence-1.jpg',
        imageMobileUrl: 'assets/images/kuma-residence/kuma-residence-1.jpg',
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
        id: 'petrus',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-1.jpg',
        imageUrlDesktop: 'assets/images/petrus/petrus-1.jpg',
        imageMobileUrl: 'assets/images/petrus/petrus-1.jpg',
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
        imageMobileUrl: 'assets/images/naadei-villas/naadei-villas-1.jpg',
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
        imageUrl: 'assets/images/watsons-place/watsons-place-3.jpg',
        imageUrlDesktop: 'assets/images/watsons-place/watsons-place-3.jpg',
        imageMobileUrl: 'assets/images/watsons-place/watsons-place-3.jpg',
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
        id: 'watsons-place-plate3',
        title: 'Watson’s Place',
        category: 'Interior Design & Architectural Visualization — 2016',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/watsons-place/watsons-place-5.jpg',
        imageUrlDesktop: 'assets/images/watsons-place/watsons-place-5.jpg',
        imageMobileUrl: 'assets/images/watsons-place/watsons-place-5.jpg',
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
        id: 'tower-cascades-plate1',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-hero.jpg',
        imageUrlDesktop: 'assets/images/cascades/tower-cascades-hero.jpg',
        imageMobileUrl: 'assets/images/cascades/tower-cascades-hero.jpg',
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
        imageUrl: 'assets/images/cascades/tower-cascades-1.jpg',
        imageUrlDesktop: 'assets/images/cascades/tower-cascades-1.jpg',
        imageMobileUrl: 'assets/images/cascades/tower-cascades-1.jpg',
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
        imageUrl: 'assets/images/hamlet/hamlet-estate.jpg',
        imageUrlDesktop: 'assets/images/hamlet/hamlet-estate.jpg',
        imageMobileUrl: 'assets/images/hamlet/hamlet-estate.jpg',
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
        imageMobileUrl: 'assets/images/hamlet/hamlet-wide-hero.jpg',
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
        imageUrl: 'assets/images/swipe/swipe-2.jpg',
        imageUrlDesktop: 'assets/images/swipe/swipe-2.jpg',
        imageMobileUrl: 'assets/images/swipe/swipe-2.jpg',
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
        imageMobileUrl: 'assets/images/swipe/swipe-7.jpg',
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
        id: 'nyla-court-plate1',
        title: 'Nyla Court',
        category: 'Interior Design & Architectural Visualization — 2020',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/nyla-court/nyla-court-living-04.jpg',
        imageUrlDesktop: 'assets/images/nyla-court/nyla-court-living-04.jpg',
        imageMobileUrl: 'assets/images/nyla-court/nyla-court-living-04.jpg',
        projectUrl: 'nyla-court.html',
        desc: 'Interior design and architectural visualization for Nyla Court, a group of white two-storey houses arranged around a paved court, developed across twenty-two plates that run from the living and dining room through to the wardrobes and the stone in the bathroom.',
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
        imageUrl: 'assets/images/nyla-court/nyla-court-living-05.jpg',
        imageUrlDesktop: 'assets/images/nyla-court/nyla-court-living-05.jpg',
        imageMobileUrl: 'assets/images/nyla-court/nyla-court-living-05.jpg',
        projectUrl: 'nyla-court.html',
        desc: 'Interior design and architectural visualization for Nyla Court, a group of white two-storey houses arranged around a paved court, developed across twenty-two plates that run from the living and dining room through to the wardrobes and the stone in the bathroom.',
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
        imageUrl: 'assets/images/moty/moty-5.jpg',
        imageUrlDesktop: 'assets/images/moty/moty-5.jpg',
        imageMobileUrl: 'assets/images/moty/moty-5.jpg',
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
        imageUrl: 'assets/images/link-drive/link-drive-5.jpg',
        imageUrlDesktop: 'assets/images/link-drive/link-drive-5.jpg',
        imageMobileUrl: 'assets/images/link-drive/link-drive-5.jpg',
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
        id: 'ela-b-plate1',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-6.jpg',
        imageUrlDesktop: 'assets/images/ela-b/ela-b-6.jpg',
        imageMobileUrl: 'assets/images/ela-b/ela-b-6.jpg',
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
        id: 'el-dor-plate1',
        title: 'El Dor',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/el-dor/el-dor-hero.jpg',
        imageUrlDesktop: 'assets/images/el-dor/el-dor-hero.jpg',
        imageMobileUrl: 'assets/images/el-dor/el-dor-hero.jpg',
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
        imageMobileUrl: 'assets/images/csm/csm-1.jpg',
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
        id: 'brownies-place-plate1',
        title: 'Brownie’s Place',
        category: 'Interior Design, Architectural Visualization & Graphic Design — 2017',
        service: 'Interior Design, Architectural Visualization & Graphic Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/brownies-place/brownies-place-12.jpg',
        imageUrlDesktop: 'assets/images/brownies-place/brownies-place-12.jpg',
        imageMobileUrl: 'assets/images/brownies-place/brownies-place-12.jpg',
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
        imageUrl: 'assets/images/brownies-place/brownies-place-17.jpg',
        imageUrlDesktop: 'assets/images/brownies-place/brownies-place-17.jpg',
        imageMobileUrl: 'assets/images/brownies-place/brownies-place-17.jpg',
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
        imageUrl: 'assets/images/brownies-place/brownies-place-18.jpg',
        imageUrlDesktop: 'assets/images/brownies-place/brownies-place-18.jpg',
        imageMobileUrl: 'assets/images/brownies-place/brownies-place-18.jpg',
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
        imageUrl: 'assets/images/bfa/bfa-5.jpg',
        imageUrlDesktop: 'assets/images/bfa/bfa-5.jpg',
        imageMobileUrl: 'assets/images/bfa/bfa-5.jpg',
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
        imageMobileUrl: 'assets/images/bfa/bfa-6.jpg',
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
        imageUrl: 'assets/images/bfa/bfa-7.jpg',
        imageUrlDesktop: 'assets/images/bfa/bfa-7.jpg',
        imageMobileUrl: 'assets/images/bfa/bfa-7.jpg',
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
        imageUrl: 'assets/images/afg/afg-2.jpg',
        imageUrlDesktop: 'assets/images/afg/afg-2.jpg',
        imageMobileUrl: 'assets/images/afg/afg-2.jpg',
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
        imageMobileUrl: 'assets/images/3aap/3aap-1.jpg',
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
        imageMobileUrl: 'assets/images/3aap/3aap-2.jpg',
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
        imageMobileUrl: 'assets/images/3aap/3aap-3.jpg',
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
        id: '3aap-plate3',
        title: '3AAP',
        category: 'Interior Design, Design + Build, Graphic Design & Architectural Visualization — 2019',
        service: 'Interior Design, Design + Build, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/3aap/3aap-4.jpg',
        imageUrlDesktop: 'assets/images/3aap/3aap-4.jpg',
        imageMobileUrl: 'assets/images/3aap/3aap-4.jpg',
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

,
      {
        id: '5aap-progress-plate1',
        title: '5AAP',
        category: 'Interior Design, Graphic Design & Design + Build — 2020',
        service: 'Interior Design, Graphic Design & Design + Build',
        discipline: 'interiors',
        imageUrl: 'assets/images/5aap/5aap-2.jpg',
        imageUrlDesktop: 'assets/images/5aap/5aap-2.jpg',
        imageMobileUrl: 'assets/images/5aap/5aap-2.jpg',
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
        imageMobileUrl: 'assets/images/5aap/5aap-1.jpg',
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
        imageUrl: 'assets/images/5aap/5aap-2.jpg',
        imageUrlDesktop: 'assets/images/5aap/5aap-2.jpg',
        imageMobileUrl: 'assets/images/5aap/5aap-2.jpg',
        projectUrl: '5aap.html',
        desc: 'The IDP Foundation office: interior design, wayfinding and signage design, and construction, delivered by RDVS across 2019 and 2020.',
        specs: {
          client: 'IDP Foundation',
          scope: 'Interior Design, Graphic Design & Design + Build',
          team: 'RDVS Team',
          year: '2020',
          disciplines: ['Interior Design', 'Graphic Design', 'Design + Build']
        }
      }
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
        videoMobileUrl: 'assets/videos/1981/1981-film.mp4',
        imageUrl: 'assets/images/1981/1981-6.jpg',
        imageUrlDesktop: 'assets/images/1981/1981-6.jpg',
        imageMobileUrl: 'assets/images/1981/1981-6.jpg',
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
        id: '1981-film-project-film',
        title: '1981',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        videoUrl: 'assets/videos/1981/1981-film.mp4',
        videoUrlDesktop: 'assets/videos/1981/1981-film.mp4',
        videoMobileUrl: 'assets/videos/1981/1981-film.mp4',
        imageUrl: 'assets/images/1981/1981-6.jpg',
        imageUrlDesktop: 'assets/images/1981/1981-6.jpg',
        imageMobileUrl: 'assets/images/1981/1981-6.jpg',
        projectUrl: '1981.html',
        desc: 'Walkthrough of the retail shop for Accra fashion brand 1981 — white walls, chrome garment frames each hung in front of its own portrait panel, and a black lightbox brand wall at the head of the axis.',
        specs: {
          client: 'Joelle Eyeson / 1981',
          scope: '3D Modelling, Shading & Texturing, Lighting, Rendering & Post-Processing, Film Animation (interior design by Joelle Eyeson)',
          team: 'Modelling: Winfred Atieku, Jude Abbey + Jude Nyoagbe | Texturing + Lighting + Shading: Jude Nyoagbe | Rendering: Jude Nyoagbe | Post Processing: Randy Biney',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      }

    ],
    images: [
      {
        id: 'chocolate',
        title: 'Chocolate',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'graphic',
        imageUrl: 'assets/images/chocolate/chocolate-13.jpg',
        imageUrlDesktop: 'assets/images/chocolate/chocolate-13.jpg',
        imageMobileUrl: 'assets/images/chocolate/chocolate-13.jpg',
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
        imageMobileUrl: 'assets/images/glow-in-the-dark/glow-in-the-dark-1.jpg',
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
        imageMobileUrl: 'assets/images/stark-glaube/stark-glaube-2.jpg',
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
        imageMobileUrl: 'assets/images/stanchart-hq/stanchart-hq-1.jpg',
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
        id: 'ameyaw-sarah',
        title: 'Ameyaw + Sarah',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'graphic',
        imageUrl: 'assets/images/ameyaw-sarah/ameyaw-sarah-5-desktop.jpg',
        imageUrlDesktop: 'assets/images/ameyaw-sarah/ameyaw-sarah-5-desktop.jpg',
        imageMobileUrl: 'assets/images/ameyaw-sarah/ameyaw-sarah-5-desktop.jpg',
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
        imageUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-2.jpg',
        imageUrlDesktop: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-2.jpg',
        imageMobileUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-2.jpg',
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
        imageMobileUrl: 'assets/images/senya-resort/senya-resort-1.jpg',
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
        imageUrlDesktop: 'assets/images/marble-bath/marble-bath-1-desktop.jpg',
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
        imageMobileUrl: 'assets/images/drw-furnart/drw-furnart-1.jpg',
        projectUrl: 'drw-furnart.html'
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
        category: 'Graphic Design — 2021',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/aelius/aelius-brand.jpg',
        imageUrlDesktop: 'assets/images/aelius/aelius-brand.jpg',
        imageMobileUrl: 'assets/images/aelius/aelius-brand.jpg',
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
        id: 'senya-resort-plate1',
        title: 'Senya Resort',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/senya-resort/senya-resort-1.jpg',
        imageUrlDesktop: 'assets/images/senya-resort/senya-resort-1.jpg',
        imageMobileUrl: 'assets/images/senya-resort/senya-resort-1.jpg',
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
        imageUrl: 'assets/images/mtn-hq/mtn-hq-18.jpg',
        imageUrlDesktop: 'assets/images/mtn-hq/mtn-hq-18.jpg',
        imageMobileUrl: 'assets/images/mtn-hq/mtn-hq-18.jpg',
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
        id: 'marble-bath-plate1',
        title: 'Marble & Bath',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/marble-bath/marble-bath-1.jpg',
        imageUrlDesktop: 'assets/images/marble-bath/marble-bath-1-desktop.jpg',
        imageMobileUrl: 'assets/images/marble-bath/marble-bath-1.jpg',
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
        imageUrl: 'assets/images/fule/fule-5.jpg',
        imageUrlDesktop: 'assets/images/fule/fule-5.jpg',
        imageMobileUrl: 'assets/images/fule/fule-5.jpg',
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
        imageUrl: 'assets/images/fule/fule-6.jpg',
        imageUrlDesktop: 'assets/images/fule/fule-6.jpg',
        imageMobileUrl: 'assets/images/fule/fule-6.jpg',
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
        imageUrl: 'assets/images/fule/fule-7.jpg',
        imageUrlDesktop: 'assets/images/fule/fule-7.jpg',
        imageMobileUrl: 'assets/images/fule/fule-7.jpg',
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
        id: 'drw-furnart-plate1',
        title: 'DRW Furnart',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/drw-furnart/drw-furnart-1.jpg',
        imageUrlDesktop: 'assets/images/drw-furnart/drw-furnart-1.jpg',
        imageMobileUrl: 'assets/images/drw-furnart/drw-furnart-1.jpg',
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
        imageUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-4.jpg',
        imageUrlDesktop: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-4.jpg',
        imageMobileUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-4.jpg',
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
        imageMobileUrl: 'assets/images/dela-anyaa/dela-anyaa-10.jpg',
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
        imageMobileUrl: 'assets/images/dela-anyaa/dela-anyaa-9.jpg',
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
        imageMobileUrl: 'assets/images/chocolate/chocolate-14.jpg',
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
        imageMobileUrl: 'assets/images/chocolate/chocolate-15.jpg',
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
        imageMobileUrl: 'assets/images/ameyaw-sarah/ameyaw-sarah-1.jpg',
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
        imageUrl: 'assets/images/2gs/2gs-10.jpg',
        imageUrlDesktop: 'assets/images/2gs/2gs-10.jpg',
        imageMobileUrl: 'assets/images/2gs/2gs-10.jpg',
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
        imageMobileUrl: 'assets/images/1981/1981-6.jpg',
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
        imageMobileUrl: 'assets/images/protea-hotel-airport/E7iCvERX0AENu7d.jpg',
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
        imageMobileUrl: 'assets/images/ahero/F9WX-jyXcAApIqO.jpg',
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
        imageMobileUrl: 'assets/images/giffard-park/Ei4kUxWXYAIh8HL.jpg',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'hola',
        title: 'Hola',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/hola/F15a8D5XsAAu3mA.jpg',
        imageUrlDesktop: 'assets/images/hola/F15a8D5XsAAu3mA.jpg',
        imageMobileUrl: 'assets/images/hola/F15a8D5XsAAu3mA.jpg',
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
        imageMobileUrl: 'assets/images/lamu/FtIUHJPXoA4P9Sk.jpg',
        projectUrl: 'lamu.html'
      },
      {
        id: 'margin',
        title: 'Margin',
        category: 'Workplace Interiors — 2022',
        service: 'Workplace Interiors',
        discipline: 'vfx',
        imageUrl: 'assets/images/margin/F-XhIIqXMAAGhOa.jpg',
        imageUrlDesktop: 'assets/images/margin/F-XhIIqXMAAGhOa.jpg',
        imageMobileUrl: 'assets/images/margin/F-XhIIqXMAAGhOa.jpg',
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
        imageMobileUrl: 'assets/images/the-fitzgerald/Eud0gaBUYAABir9.jpg',
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
        imageMobileUrl: 'assets/images/a-a/G09Bw1sWAAATy5h.jpg',
        projectUrl: 'a-a.html'
      },
      {
        id: 'ttd',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/Fs47RTMWwAA-eEF.jpg',
        imageUrlDesktop: 'assets/images/ttd/Fs47RTMWwAA-eEF.jpg',
        imageMobileUrl: 'assets/images/ttd/Fs47RTMWwAA-eEF.jpg',
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
        imageMobileUrl: 'assets/images/avalon/Gc8QzsaXkAAQotV.jpg',
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
        imageMobileUrl: 'assets/images/ackon-desk/GUEAQ-MWsAAGT7n.jpg',
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
        imageMobileUrl: 'assets/images/mig/mig-1h-2.jpg',
        projectUrl: 'mig.html'
      }


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
        videoMobileUrl: 'assets/videos/ceeander/ceeander-motion.mp4',
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
        videoMobileUrl: 'assets/videos/trumpet-africa-ident/trumpet-africa.mp4',
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
        id: 'trumpet-africa-motion-film',
        title: 'Trumpet Africa Productions Ident',
        category: 'Broadcast — 2014',
        service: 'Broadcast',
        discipline: 'motion',
        videoUrl: 'assets/videos/trumpet-africa-ident/trumpet-africa.mp4',
        videoUrlDesktop: 'assets/videos/trumpet-africa-ident/trumpet-africa.mp4',
        videoMobileUrl: 'assets/videos/trumpet-africa-ident/trumpet-africa.mp4',
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
        id: 'ceeander-motion-film',
        title: 'Ceeander Ident',
        category: '3D Animation — 2014',
        service: '3D Animation',
        discipline: 'motion',
        videoUrl: 'assets/videos/ceeander/ceeander-motion.mp4',
        videoUrlDesktop: 'assets/videos/ceeander/ceeander-motion.mp4',
        videoMobileUrl: 'assets/videos/ceeander/ceeander-motion.mp4',
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
        id: 'caustics-rnd',
        title: 'Caustics RnD',
        category: '3D Animation — 2020',
        service: '3D Animation',
        discipline: 'motion',
        videoUrl: 'assets/videos/caustics-rnd/caustics-rnd-film.mp4',
        videoUrlDesktop: 'assets/videos/caustics-rnd/caustics-rnd-film.mp4',
        videoMobileUrl: 'assets/videos/caustics-rnd/caustics-rnd-film.mp4',
        imageUrl: 'assets/images/caustics-rnd/caustics-rnd-film-frame.jpg',
        imageUrlDesktop: 'assets/images/caustics-rnd/caustics-rnd-film-frame.jpg',
        imageMobileUrl: 'assets/images/caustics-rnd/caustics-rnd-film-frame.jpg',
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
        id: 'elo-tv',
        title: 'ELO TV',
        category: 'Motion Design — 2015',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/elo-tv/elo-tv-16.jpg',
        imageUrlDesktop: 'assets/images/elo-tv/elo-tv-16.jpg',
        imageMobileUrl: 'assets/images/elo-tv/elo-tv-16.jpg',
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
        imageMobileUrl: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
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
        imageMobileUrl: 'assets/images/glow-in-the-dark/glow-in-the-dark-1.jpg',
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
        imageMobileUrl: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
        projectUrl: 'hfc-tvc.html',
        desc: 'Broadcast commercial spot combining 3D kinetic typographic choreography, graphic pacing, and fluid motion design.',
        specs: {
          client: 'Midnight Run',
          scope: 'Visual Effects (VFX) & Motion Design',
          team: 'Jude Abbey, Jude Nyoagbe, Randy Biney',
          year: '2016',
          disciplines: ['Motion Design', 'Broadcast TVC']
        }
      }

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
        id: 'product-hg-desk-film1',
        title: 'HG-DESK',
        category: 'Design · In-house · VFX + CGI — 2020',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        videoUrl: 'assets/videos/hg-desk/hg-desk-film.mp4',
        videoUrlDesktop: 'assets/videos/hg-desk/hg-desk-film.mp4',
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
        id: 'product-line-e-float-i-film1',
        title: 'LINE E FLOAT I',
        category: 'Design · In-house · VFX + CGI',
        service: 'Design · In-house · VFX + CGI',
        discipline: 'products',
        videoUrl: 'assets/videos/line-e-float-i/line-e-float-i-film.mp4',
        videoUrlDesktop: 'assets/videos/line-e-float-i/line-e-float-i-film.mp4',
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
      imageUrl: 'assets/images/hamlet/hamlet-estate.jpg',
      imageMobileUrl: 'assets/images/hamlet/hamlet-estate.jpg',
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
