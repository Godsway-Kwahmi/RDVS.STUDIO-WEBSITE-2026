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
    'access-bank-iris.html': ['design', 'vfx-cgi'],
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
    'csm.html': ['design', 'vfx-cgi'],
    'd-e-t-a-i-l-s.html': ['studio-projects', 'vfx-cgi'],
    'dela-anyaa.html': ['design'],
    'dyv.html': ['design', 'vfx-cgi'],
    'ehr.html': ['design', 'vfx-cgi'],
    'el-dor.html': ['design', 'vfx-cgi'],
    'ela-b.html': ['design', 'vfx-cgi'],
    'elo-tv.html': ['design'],
    'empire-tower.html': ['design', 'vfx-cgi'],
    'enda-accra-mall.html': ['design', 'vfx-cgi'],
    'enda-acm.html': ['design', 'vfx-cgi'],
    'enda-whm.html': ['design'],
    'ert.html': ['vfx-cgi'],
    'fule.html': ['vfx-cgi'],
    'frontier-filling-station.html': ['design', 'vfx-cgi'],
    'funko-ridge.html': ['design'],
    'gh-phot-awards.html': ['design', 'vfx-cgi'],
    'giffard-park.html': ['design', 'vfx-cgi'],
    'glow-in-the-dark.html': ['design', 'vfx-cgi'],
    'hfa.html': ['design', 'vfx-cgi'],
    'hfc-tvc.html': ['design', 'vfx-cgi'],
    'hola.html': ['vfx-cgi'],
    'hot-gossip.html': ['design', 'vfx-cgi'],
    'hubtel.html': ['design', 'vfx-cgi'],
    'imperial-square.html': ['design'],
    'jhk-investment.html': ['vfx-cgi'],
    'kdmrd.html': ['vfx-cgi'],
    'kuma-residence.html': ['design', 'vfx-cgi'],
    'la-beach-towers.html': ['design', 'vfx-cgi'],
    'link-drive-road.html': ['design', 'vfx-cgi'],
    'macord.html': ['design', 'vfx-cgi'],
    'margin.html': ['design', 'vfx-cgi'],
    'mig.html': ['design'],
    'moty.html': ['design', 'vfx-cgi'],
    'mtn.html': ['design', 'vfx-cgi'],
    'naadei-villas.html': ['design'],
    'npa-reception-renders.html': ['bim', 'vfx-cgi'],
    'petrus.html': ['design', 'vfx-cgi'],
    'poconos-bar-grill.html': ['design', 'vfx-cgi'],
    'ppa-ghana-competition.html': ['competitions', 'design', 'vfx-cgi'],
    'product-1h.html': ['design', 'vfx-cgi'],
    'product-hg-desk.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-line-e-float-i.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-mound.html': ['design', 'vfx-cgi'],
    'product-s-age.html': ['design', 'studio-projects', 'vfx-cgi'],
    'product-sp001.html': ['design', 'studio-projects', 'vfx-cgi'],
    'protea-hotel-airport.html': ['vfx-cgi'],
    'purc.html': ['design', 'turnkey-build'],
    'senya-resort.html': ['vfx-cgi'],
    'smsgh.html': ['art', 'design', 'photography', 'vfx-cgi'],
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
        imageUrl: 'assets/images/d-e-t-a-i-l-s/d-e-t-a-i-l-s-2.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/barham/barham-residence.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/dyv/dyv-atrium.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/funko-ridge/funko-ridge-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'enda-whm',
        title: 'Enda WHM',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/enda-whm/enda-whm-3.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'enda-whm.html',
        desc: 'Enda WHM dining room: an orange service bulkhead over a lit cake display at the left, a timber waffle ceiling with pale globe pendants above, and a backlit screen of bamboo culms glowing over the brick banquette at the right.',

        specs: {
          client: 'Private Client',
          scope: 'Architectural design of the Enda WHM cafe: dining room and banquette wall, the backlit bamboo screen, the service bulkhead and the seating plan',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Architectural Design']
        }
      },
      {
        id: 'enda-whm-plate1',
        title: 'Enda WHM',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/enda-whm/enda-whm-7.jpg',
        mobilePosition: 'center',
        projectUrl: 'enda-whm.html',
        desc: 'Enda WHM banquette wall: the backlit bamboo screen above a red brick dado, brown leather bench seating with oak tables and cube benches, and four globe pendants hung on long cords.',

        specs: {
          client: 'Private Client',
          scope: 'Architectural design of the Enda WHM cafe: dining room and banquette wall, the backlit bamboo screen, the service bulkhead and the seating plan',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Architectural Design']
        }
      },
      {
        id: 'enda-whm-plate2',
        title: 'Enda WHM',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/enda-whm/enda-whm-4.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'enda-whm.html',
        desc: 'Enda WHM seating plan from above: oak tables laid with caddies and a sushi tray, leather banquettes running to the brick and bamboo screen, and a pink globe pendant dropping into frame over parquet flooring.',

        specs: {
          client: 'Private Client',
          scope: 'Architectural design of the Enda WHM cafe: dining room and banquette wall, the backlit bamboo screen, the service bulkhead and the seating plan',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Architectural Design']
        }
      },
      {
        id: 'purc-9-l1-ut',
        title: 'PURC',
        category: 'Architectural Design — 2012',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/purc/purc-entrance-lobby-bw.jpg',
        mobilePosition: 'center',
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
        mobilePosition: 'center',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'empire-tower.html'
      },
      {
        id: 'dyv-dawn',
        title: 'DYV',
        category: 'Interior Design & Architectural Visualization — 2025',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/dyv/dyv-dawn.jpg',
        mobilePosition: 'center',
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
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: '41-barham.html',
        desc: 'The ground-floor living room at night: a grand piano with its lid up and an orange leather lounge chair with ottoman seen through full-height glazing, a tall cream-shaded floor lamp, a grid of framed pet photographs on the wall and a crystal drum chandelier above.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: 'Architect Kofi Amankwah (Architecture), RDVS (Interior Design & 3D Visualization)',
          year: '2017',
          disciplines: ['Architectural Design', 'Interior Design', '3D Visualization']
        }
      },
      {
        id: 'barham-attic',
        title: '41 Barham',
        category: 'Architectural Design — 2017',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/barham/barham-01.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: '41-barham.html',
        desc: 'The attic living room: a low bed with a charcoal throw beneath two skylights in the raked ceiling, a grey sofa and black coffee table on dark timber boards, and a glass door open onto a bare terrace behind grey drapes.',
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
        imageUrl: 'assets/images/barham/barham-02.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: '41-barham.html',
        desc: 'The same attic living room from the terrace door: the bed between its two skylights, a grey sofa with patterned cushions, a black coffee table and dark stained floorboards.',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        mobilePosition: '32% center',
        mobileFit: 'contain',
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
        id: 'purc-9-zm-pb',
        title: 'PURC',
        category: 'Architectural Design — 2012',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/purc/E9OZmPJXMAUyrpB.jpg',
        mobilePosition: 'center',
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
        id: 'purc-complex',
        title: 'PURC',
        category: 'Architectural Design — 2012',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/purc/purc-facade.jpg',
        mobilePosition: 'center',
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
        mobilePosition: '41% center',
        mobileFit: 'contain',
        desktopPosition: 'center 100%',
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
        id: 'macord-international-school-plate3',
        title: 'Macord International School',
        category: '3D Visualization — 2024',
        service: '3D Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/macord/macord-6.jpg',
        fit: 'contain',
        mobilePosition: '55% center',
        desktopPosition: 'center 87.3%',
        projectUrl: 'macord.html',
        desc: 'The school boundary wall at dusk: tall timber fins uplit behind large white lowercase lettering, planting trailing over the pergola edge and red traffic trails streaking the foreground.',
        specs: {
          client: 'Macord International School',
          scope: 'Facade Design (Architectural Design), Landscape Design, Interior Design, Industrial & Furniture Design & 3D Visualization',
          team: 'Jude Nyoagbe',
          year: '2024',
          disciplines: ['Architectural Design', 'Landscape Design', 'Interior Design', 'Industrial & Furniture Design', '3D Visualization']
        }
      },
      {
        id: 'macord-international-school-plate4',
        title: 'Macord International School',
        category: '3D Visualization — 2024',
        service: '3D Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/macord/macord-4.jpg',
        mobilePosition: '30% center',
        projectUrl: 'macord.html',
        desc: 'The signage wall in monochrome: a woman holding a child at the zebra crossing at the left, the large lowercase lettering running off the right edge, tree branches across the top and the planted pergola over the batten wall.',
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
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'empire-tower.html'
      },
      {
        id: 'the-saddle-plate1',
        title: 'The Saddle',
        category: 'Architectural Design & Architectural Visualization — 2018',
        service: 'Architectural Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/the-saddle/the-saddle-1.jpg',
        mobilePosition: 'center',
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
        mobilePosition: '15% center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate2',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-6.jpg',
        mobilePosition: 'center',
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
        id: 'funko-ridge-plate3',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-15.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate4',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-7.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate5',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-9.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate6',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-10.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate7',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-11.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate8',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-12.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate9',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-13.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate10',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-14.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate11',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-17.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate12',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-18.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate13',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-19.jpg',
        mobilePosition: 'center',
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
        id: 'funko-ridge-plate14',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-20.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate15',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-21.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate16',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-22.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate17',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-23.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate18',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-24.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate19',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-25.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate20',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-26.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate21',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-27.jpg',
        mobilePosition: 'center',
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
        id: 'funko-ridge-plate22',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-28.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate23',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-29.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate24',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-30.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate25',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-31.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate26',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-32.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate27',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-33.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate28',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-34.jpg',
        mobilePosition: 'center',
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
        id: 'funko-ridge-plate29',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-35.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate30',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-37.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'funko-ridge-plate31',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-38.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '62% center',
        mobileFit: 'contain',
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
        id: 'empire-tower-plate2',
        title: 'Empire Tower',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/empire-tower/empire-tower-1.jpg',
        mobilePosition: '30% center',
        mobileFit: 'contain',
        projectUrl: 'empire-tower.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for Empire Tower.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and architectural visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'empire-tower-plate3',
        title: 'Empire Tower',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/empire-tower/Eta5jqdXcAAmchw.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'empire-tower.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for Empire Tower.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and architectural visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'empire-tower-plate4',
        title: 'Empire Tower',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/empire-tower/EtQVZm0XcAAdwi8.jpg',
        mobilePosition: '30% center',
        mobileFit: 'contain',
        projectUrl: 'empire-tower.html',
        desc: 'Rigorous spatial articulation balancing proportional harmony, light simulation, and bespoke detailing created for Empire Tower.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and architectural visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },


      {
        id: 'dyv-dawn-plate1',
        title: 'DYV',
        category: 'Interior Design & Architectural Visualization — 2025',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/dyv/dyv-panoramic-header.jpg',
        mobilePosition: 'center',
        projectUrl: 'dyv.html',
        desc: 'An iconic multi-tiered mixed-use urban gateway designed to maximize natural airflow, communal terrace courtyards, and sustainable coastal resilience.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design',
          team: 'RDVS Team',
          year: '2025',
          disciplines: '[\'Architectural Design\']'
        }
      },      {
        id: 'dyv-dawn-plate2',
        title: 'DYV',
        category: 'Interior Design & Architectural Visualization — 2025',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/dyv/dyv-courtyard-night.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        desktopPosition: 'center 83.4%',
        projectUrl: 'dyv.html',
        desc: 'An iconic multi-tiered mixed-use urban gateway designed to maximize natural airflow, communal terrace courtyards, and sustainable coastal resilience.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design',
          team: 'RDVS Team',
          year: '2025',
          disciplines: '[\'Architectural Design\']'
        }
      },      {
        id: 'dyv-dawn-plate3',
        title: 'DYV',
        category: 'Interior Design & Architectural Visualization — 2025',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'architecture',
        imageUrl: 'assets/images/dyv/dyv-atrium.jpg',
        mobilePosition: 'center',
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
        mobilePosition: '36% center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/watsons-place/watsons-place-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/aggregate/villa-aggregate-1.jpg',
        mobilePosition: 'center',
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
        imageUrl: 'assets/images/cascades/E1msdaCXEAEFx84.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/moty/moty-5.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'moty.html',
        desc: 'Interior design and 3D visualization by RDVS. Design in 2016 for MOTY, a children’s clothing shop at Accra Mall, combining retail interiors, custom furniture and playful graphics into a single whimsical world.',

        specs: {
          client: 'Mother of the Year (MOTY)',
          scope: 'Interior design, custom furniture and fixture design, retail graphics and the full set of 3D visualizations for the MOTY children’s store at Accra Mall.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: ['Interior Design', 'Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },

    ],
    images: [
      {
        id: 'access-bank-iris',
        title: 'Access Bank Iris',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/access-bank-iris/018_0-00-00-00_photoreal_5K.png',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'access-bank-iris.html',
        desc: 'Visualization of a glass-fronted meeting room: mesh task chairs around a table, a red and orange geometric brand graphic with chevrons on the rear wall, and a full-height glazed partition reflecting the daylight from the window wall beyond.',

        specs: {
          client: 'Access Bank',
          scope: 'Interior design and architectural visualization of Access Bank Iris in Accra: meeting rooms, executive offices, client lounges, waiting areas and the boardroom',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'access-bank-iris-plate1',
        title: 'Access Bank Iris',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/access-bank-iris/019_sofa_walnut_batten_5K.png',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'access-bank-iris.html',
        desc: 'Executive office visualization with dark timber veneer and vertical slat walls, a white desk carrying a desktop computer and task lamp, grey carpet tiles, and a navy leather sofa in the foreground under recessed ceiling downlights.',

        specs: {
          client: 'Access Bank',
          scope: 'Interior design and architectural visualization of Access Bank Iris in Accra: meeting rooms, executive offices, client lounges, waiting areas and the boardroom',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'access-bank-iris-plate2',
        title: 'Access Bank Iris',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/access-bank-iris/access-bank-iris-3.png',
        mobilePosition: '68% center',
        mobileFit: 'contain',
        projectUrl: 'access-bank-iris.html',
        desc: 'Open client lounge visualization: grey sofa and a round white coffee table in the centre, blue and orange accent chairs, yellow armchairs by the window, a timber slat wall with a green screen, planters and a circular ceiling feature.',

        specs: {
          client: 'Access Bank',
          scope: 'Interior design and architectural visualization of Access Bank Iris in Accra: meeting rooms, executive offices, client lounges, waiting areas and the boardroom',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'access-bank-iris-plate3',
        title: 'Access Bank Iris',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/access-bank-iris/024_plants_photoreal_5K.png',
        mobilePosition: '50% center',
        mobileFit: 'contain',
        projectUrl: 'access-bank-iris.html',
        desc: 'Interior visualization of the client lounge: large tropical plants in ribbed white planters beside upholstered seating, daylight from the window wall and the bank\'s red and orange chevron brand graphics on the partition beyond.',

        specs: {
          client: 'Access Bank',
          scope: 'Interior design and architectural visualization of Access Bank Iris in Accra: meeting rooms, executive offices, client lounges, waiting areas and the boardroom',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'access-bank-iris-plate4',
        title: 'Access Bank Iris',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/access-bank-iris/025_plants_photoreal_5K.png',
        mobilePosition: '50% center',
        mobileFit: 'contain',
        projectUrl: 'access-bank-iris.html',
        desc: 'Client area interior visualization: leafy indoor plants in white planters beside a low seating arrangement, with the bank\'s orange and red chevron pattern on the wall partition and recessed ceiling downlights above.',

        specs: {
          client: 'Access Bank',
          scope: 'Interior design and architectural visualization of Access Bank Iris in Accra: meeting rooms, executive offices, client lounges, waiting areas and the boardroom',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'access-bank-iris-plate5',
        title: 'Access Bank Iris',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/access-bank-iris/026_plants_photoreal_5K.png',
        mobilePosition: '50% center',
        mobileFit: 'contain',
        projectUrl: 'access-bank-iris.html',
        desc: 'Office lounge interior visualization: a bright interior with large potted plants, blue and orange accent seating, and a view through to the reception desk area beyond.',

        specs: {
          client: 'Access Bank',
          scope: 'Interior design and architectural visualization of Access Bank Iris in Accra: meeting rooms, executive offices, client lounges, waiting areas and the boardroom',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'access-bank-iris-plate6',
        title: 'Access Bank Iris',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/access-bank-iris/access-bank-iris-4.jpg',
        mobilePosition: '50% center',
        mobileFit: 'contain',
        projectUrl: 'access-bank-iris.html',
        desc: 'Waiting area visualization seen across a bright yellow curved sofa and a timber-topped round table laid with a white tea set, with orchids in planters, a dark stone-clad column, and a glazed wall to a further seating bay.',

        specs: {
          client: 'Access Bank',
          scope: 'Interior design and architectural visualization of Access Bank Iris in Accra: meeting rooms, executive offices, client lounges, waiting areas and the boardroom',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'access-bank-iris-plate7',
        title: 'Access Bank Iris',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/access-bank-iris/access-bank-iris-5.png',
        mobilePosition: '50% center',
        mobileFit: 'contain',
        projectUrl: 'access-bank-iris.html',
        desc: 'Boardroom visualization: a long pale conference table with black mesh chairs under a cove-lit ceiling recess, projector above, and a dark timber feature wall carrying the backlit blue Access wordmark with orange chevron arrows running off its edge.',

        specs: {
          client: 'Access Bank',
          scope: 'Interior design and architectural visualization of Access Bank Iris in Accra: meeting rooms, executive offices, client lounges, waiting areas and the boardroom',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-acm',
        title: 'Enda ACM',
        category: 'Interior Design, Industrial Design, Graphic Design & 3D Visualization — 2015',
        service: 'Interior Design, Industrial Design, Graphic Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-acm/enda-acm-1-desktop.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'enda-acm.html',
        desc: 'The servery: two curved-glass display cabinets set into a timber counter in front of an asymmetric grid of backlit bottle shelves, with dark walls papered in fine white line drawings of glassware and a glazed wall to the right',

        specs: {
          client: 'ENDA Foods',
          scope: 'Interior design, industrial design, graphic design and 3D visualization of the Enda cafe and Chinese fast-food restaurant: dining hall, banquettes, servery and bamboo screen',
          team: 'RDVS',
          year: '2015',
          disciplines: ['Interior Design', 'Industrial Design', 'Graphic Design', '3D Visualization']
        }
      },
      {
        id: 'enda-acm-plate1',
        title: 'Enda ACM',
        category: 'Interior Design, Industrial Design, Graphic Design & 3D Visualization — 2015',
        service: 'Interior Design, Industrial Design, Graphic Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-acm/enda-acm-2.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'enda-acm.html',
        desc: 'Across the dining hall: low pale timber tables with matching block benches and banquettes in front of a dark wall carrying a backlit screen of uneven bamboo canes over a red brick dado, a dome of square timber coffering sunk into the ceiling above, and white globe pendants hung at varying heights',

        specs: {
          client: 'ENDA Foods',
          scope: 'Interior design, industrial design, graphic design and 3D visualization of the Enda cafe and Chinese fast-food restaurant: dining hall, banquettes, servery and bamboo screen',
          team: 'RDVS',
          year: '2015',
          disciplines: ['Interior Design', 'Industrial Design', 'Graphic Design', '3D Visualization']
        }
      },
      {
        id: 'enda-acm-plate2',
        title: 'Enda ACM',
        category: 'Interior Design, Industrial Design, Graphic Design & 3D Visualization — 2015',
        service: 'Interior Design, Industrial Design, Graphic Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-acm/enda-acm-3.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'enda-acm.html',
        desc: 'The same hall from the other end: a long curved white ceiling swept with circular air diffusers and recessed squares dropping towards the timber coffered dome, runs of tables and block benches on a plank floor, the bamboo screen glowing along the far wall, and a glazed wall with planters in timber crates at the left',

        specs: {
          client: 'ENDA Foods',
          scope: 'Interior design, industrial design, graphic design and 3D visualization of the Enda cafe and Chinese fast-food restaurant: dining hall, banquettes, servery and bamboo screen',
          team: 'RDVS',
          year: '2015',
          disciplines: ['Interior Design', 'Industrial Design', 'Graphic Design', '3D Visualization']
        }
      },
      {
        id: 'enda-accra-mall',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-1.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'enda-accra-mall.html',
        desc: 'The banquette run: low timber tables with condiment caddies against brown leather seating, pink paper lanterns above, red brick dado and planters in timber crates, with the backlit bamboo screen and its silhouette behind.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Interior design, furniture, graphics and imagery for the ENDA foods court at Accra Mall, completed for the 2014 opening.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate1',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-2.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'enda-accra-mall.html',
        desc: 'Looking down the dining area from above: square timber tables with matching benches set along the banquette, a paper lantern suspended mid-frame, and the backlit bamboo screen running the full length behind.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Space planning and styling of the dining hall, with the low timber furniture and the illuminated bamboo screen designed in-house.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate2',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-3.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'enda-accra-mall.html',
        desc: 'Down the length of the banquette run towards the servery, with the brick dado and bamboo screen on one side and the row of illuminated menu boards hanging over the counter ahead.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Interior design of the dining run and its sightline to the servery, with the menu boards carried through from the graphic identity.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate3',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'enda-accra-mall.html',
        desc: 'Wide interior perspective of Enda showing the integrated dining area, ambient lantern lighting, and seamless transition to the ordering counters.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Interior design and visualization of the whole court, showing how the dining hall hands over to the ordering counters.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate4',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-5.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'enda-accra-mall.html',
        desc: 'Intimate view of low timber dining table and bench setting with custom condiment holder and soft backlit bamboo screen texture.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Furniture design for the table setting, including the custom condiment caddy built for these tables.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate5',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-6.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'enda-accra-mall.html',
        desc: 'Panoramic composition across the dining hall highlighting spatial flow, exposed timber ceiling features, and warm ambient illumination.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Interior design of the dining hall, with the timber ceiling features and the lantern lighting planned as one run.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate6',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-7.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'enda-accra-mall.html',
        desc: 'Banquette seating vignette showing brick base detail, plush upholstery, and timber herb planter integration.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Detail design of the banquette: brick base, upholstery and the timber planters built into the seating run.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate7',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-8.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'enda-accra-mall.html',
        desc: 'The servery and ordering counter: vibrant orange finish, hanging illuminated menu displays, and curved glass pastry showcase.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Design of the servery and ordering counter with its illuminated menu displays and curved glass showcase.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate8',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-9.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'enda-accra-mall.html',
        desc: 'The mall-facing corner: a red fascia carrying the circular enda badge above fully glazed walls lettered enda foods, with yellow shell chairs and round tables on the terrazzo concourse.',
        specs: {
          client: 'ENDA Foods',
          scope: 'The concourse face of the unit: signage, the lettered glazing and the seating spilling onto the mall floor.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate9',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-10.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'enda-accra-mall.html',
        desc: 'Close-up of overhead lightbox menu boards displaying fast-food offerings and branded graphic typography.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Graphic design of the overhead lightbox menus, from the typography to the food photography.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate10',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-11.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'enda-accra-mall.html',
        desc: 'Curved glass pastry counter detail showcasing baked goods with clean interior lighting.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Detail of the curved glass pastry counter and its internal lighting.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate11',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-12.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'enda-accra-mall.html',
        desc: 'Custom timber condiment caddy designed specifically for Enda tables, demonstrating industrial furniture details.',
        specs: {
          client: 'ENDA Foods',
          scope: 'Industrial design of the condiment caddy made for these tables.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate12',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-13.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'enda-accra-mall.html',
        desc: 'Suspended pink paper lantern detail casting a gentle warm glow across the timber dining tables.',
        specs: {
          client: 'ENDA Foods',
          scope: 'The lantern lighting detail over the dining tables.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'enda-accra-mall-plate13',
        title: 'Enda - Accra Mall',
        category: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization — 2014',
        service: 'Interior Design, Industrial & Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/enda-accra-mall/enda-accra-mall-14.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'enda-accra-mall.html',
        desc: 'Architectural materiality study: raw red brick dado wall, natural bamboo screening, and oiled timber planks.',
        specs: {
          client: 'ENDA Foods',
          scope: 'The material palette of the court: brick dado, bamboo screening and oiled timber.',
          team: 'Jude Abbey, Jude Nyoagbe, Kuukuwa Manful, Winfred Atieku, Randy Biney',
          year: '2014',
          disciplines: ['Interior Design', 'Industrial & Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'smsgh',
        title: 'SMSGH',
        category: 'Interior Design, Graphic Design, Digital Illustration & Architectural Visualization — 2013',
        service: 'Interior Design, Graphic Design, Digital Illustration & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/smsgh/smsgh-1.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'smsgh.html',
        desc: 'Visualization of the reception: full-height orange wall, dark desk with a white sms logo behind it, multicolour striped carpet, low black benches at the window and recessed ceiling panels over a cove-lit glass partition.',

        specs: {
          client: 'Hubtel',
          scope: 'Interior design, graphic design, digital illustration and architectural visualization of the SMSGH workplace: reception, private offices and a breakout lounge',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: ['Interior Design', 'Graphic Design', 'Digital Illustration', 'Architectural Visualization']
        }
      },
      {
        id: 'smsgh-plate1',
        title: 'SMSGH',
        category: 'Interior Design, Graphic Design, Digital Illustration & Architectural Visualization — 2013',
        service: 'Interior Design, Graphic Design, Digital Illustration & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/smsgh/smsgh-2.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'smsgh.html',
        desc: 'Visualization of a private office: white desk with a computer and black task chairs, green accent wall with open shelving, warm timber floor and ceiling, cove lighting and an orange sofa in the foreground.',

        specs: {
          client: 'Hubtel',
          scope: 'Interior design, graphic design, digital illustration and architectural visualization of the SMSGH workplace: reception, private offices and a breakout lounge',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: ['Interior Design', 'Graphic Design', 'Digital Illustration', 'Architectural Visualization']
        }
      },
      {
        id: 'smsgh-plate2',
        title: 'SMSGH',
        category: 'Interior Design, Graphic Design, Digital Illustration & Architectural Visualization — 2013',
        service: 'Interior Design, Graphic Design, Digital Illustration & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/smsgh/smsgh-3.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'smsgh.html',
        desc: 'Visualization of the breakout lounge: exposed timber ceiling beams and track lights, large colourful paintings on white walls, grey sofas, two yellow armchairs on a dark shag rug, black coffee table and white chairs beyond.',

        specs: {
          client: 'Hubtel',
          scope: 'Interior design, graphic design, digital illustration and architectural visualization of the SMSGH workplace: reception, private offices and a breakout lounge',
          team: 'RDVS. DESIGN',
          year: '2013',
          disciplines: ['Interior Design', 'Graphic Design', 'Digital Illustration', 'Architectural Visualization']
        }
      },
      {
        id: 'stellar-bar-2',
        title: 'Stellar Bar',
        category: 'Interior Design & Architectural Visualization — 2013',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/stellar-bar/stellar-bar-2.jpg',
        mobilePosition: '64% center',
        mobileFit: 'contain',
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
        mobilePosition: '42% center',
        mobileFit: 'contain',
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
        mobilePosition: '68% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
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
        mobilePosition: '70% center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
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
        id: '5aap-progress-plate3',
        title: '5AAP',
        category: 'Interior Design, Graphic Design & Design + Build — 2020',
        service: 'Interior Design, Graphic Design & Design + Build',
        discipline: 'interiors',
        imageUrl: 'assets/images/5aap/5aap-5.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: '5aap.html',
        desc: 'The breakout corner: a long black-topped worktable on crate shelving, two navy lounge chairs, and a low planter box laid with books.',
        specs: {
          client: 'IDP Foundation',
          scope: 'Interior Design, Graphic Design & Design + Build',
          team: 'RDVS Team',
          year: '2020',
          disciplines: ['Interior Design', 'Graphic Design', 'Design + Build']
        }
      },
      {
        id: '5aap-progress-plate4',
        title: '5AAP',
        category: 'Interior Design, Graphic Design & Design + Build — 2020',
        service: 'Interior Design, Graphic Design & Design + Build',
        discipline: 'interiors',
        imageUrl: 'assets/images/5aap/5aap-3.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: '5aap.html',
        desc: 'The Patrick Steele Room seen through its full-height glass partition: dark table, blue chairs and a computer at the far end.',
        specs: {
          client: 'IDP Foundation',
          scope: 'Interior Design, Graphic Design & Design + Build',
          team: 'RDVS Team',
          year: '2020',
          disciplines: ['Interior Design', 'Graphic Design', 'Design + Build']
        }
      },
      {
        id: '5aap-progress-plate5',
        title: '5AAP',
        category: 'Interior Design, Graphic Design & Design + Build — 2020',
        service: 'Interior Design, Graphic Design & Design + Build',
        discipline: 'interiors',
        imageUrl: 'assets/images/5aap/5aap-4.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: '5aap.html',
        desc: 'The Patrick Steele Room from inside, lit by a temporary worklight before handover.',
        specs: {
          client: 'IDP Foundation',
          scope: 'Interior Design, Graphic Design & Design + Build',
          team: 'RDVS Team',
          year: '2020',
          disciplines: ['Interior Design', 'Graphic Design', 'Design + Build']
        }
      },
      {
        id: '5aap-progress-plate6',
        title: '5AAP',
        category: 'Interior Design, Graphic Design & Design + Build — 2020',
        service: 'Interior Design, Graphic Design & Design + Build',
        discipline: 'interiors',
        imageUrl: 'assets/images/5aap/5aap-19.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: '5aap.html',
        desc: 'The corner from the street under overhanging branches, the ladder still leaning on the finished elevation.',
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
        mobilePosition: '85% center',
        projectUrl: 'moty.html',
        desc: 'Interior design and 3D visualization by RDVS. Design in 2016 for MOTY, a children’s clothing shop at Accra Mall, combining retail interiors, custom furniture and playful graphics into a single whimsical world.',
        specs: {
          client: 'Mother of the Year (MOTY)',
          scope: 'Interior design, custom furniture and fixture design, retail graphics and the full set of 3D visualizations for the MOTY children’s store at Accra Mall.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: ['Interior Design', 'Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'kuma-residence-mff-w',
        title: 'Kuma Residence',
        category: 'Interior Design & Architectural Visualization — 2022',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/kuma-residence/FRJmffPWYAECYZw.jpg',
        fit: 'contain',
        containY: '60%',
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        fit: 'contain',
        containY: '60%',
        mobilePosition: '74% center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/ela-b/ela-b-9.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '15% center',
        mobileFit: 'contain',
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
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
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
        mobilePosition: '64% center',
        mobileFit: 'contain',
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
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        desktopPosition: 'center 100%',
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
        fit: 'contain',
        mobilePosition: '59% center',
        mobileFit: 'contain',
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
        mobilePosition: '30% center',
        mobileFit: 'contain',
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
        mobilePosition: '20% center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '15% center',
        mobileFit: 'contain',
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
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'link-drive-road.html'
      },
      {
        id: 'naadei-villas',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-1.jpg',
        mobilePosition: 'center',
        projectUrl: 'naadei-villas.html'
      },
      {
        id: 'asante-interior-design-presentation',
        title: 'TAI',
        category: 'Interior Design — 2020',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-2.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'asante-interior-design-presentation.html'
      },
      {
        id: 'swipe',
        title: 'Swipe',
        category: 'Interior Design, Graphic Design, BIM & Architectural Visualization — 2020',
        service: 'Interior Design, Graphic Design, BIM & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/swipe/swipe-6.jpg',
        mobilePosition: '72% center',
        mobileFit: 'contain',
        projectUrl: 'swipe.html'
      },
      {
        id: 'yah-kumasi-mall-plate1',
        title: 'Yah!',
        category: 'Interior Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/yah-kumasi-mall/yah-kumasi-mall-1.jpg',
        mobilePosition: '59% center',
        mobileFit: 'contain',
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
        mobilePosition: '15% center',
        mobileFit: 'contain',
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
        mobilePosition: '15% center',
        mobileFit: 'contain',
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
        id: 'west-cantonments-residence-plate2',
        title: 'West Cantonments Residence',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cantonments/west-cantonments-17.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'west-cantonments-residence-plate3',
        title: 'West Cantonments Residence',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cantonments/west-cantonments-3.jpg',
        mobilePosition: '59% center',
        mobileFit: 'contain',
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
        id: 'west-cantonments-residence-plate4',
        title: 'West Cantonments Residence',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cantonments/west-cantonments-8.jpg',
        mobilePosition: 'center',
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
        id: 'west-cantonments-residence-plate5',
        title: 'West Cantonments Residence',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cantonments/west-cantonments-9.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
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
        id: 'watsons-place-plate1',
        title: 'Watson’s Place',
        category: 'Interior Design & Architectural Visualization — 2016',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/watsons-place/watsons-place-3.jpg',
        mobilePosition: '59% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '26% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '24% center',
        mobileFit: 'contain',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate3',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-4.jpg',
        mobilePosition: '62% center',
        mobileFit: 'contain',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate4',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-5.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate5',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-6.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate6',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-7.jpg',
        fit: 'contain',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate7',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-8.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate8',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-9.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate9',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-10.jpg',
        mobilePosition: '35% center',
        mobileFit: 'contain',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate10',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-11.jpg',
        mobilePosition: '70% center',
        mobileFit: 'contain',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate11',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-12.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate12',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-13.jpg',
        fit: 'contain',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate13',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-14.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate14',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-15.jpg',
        mobilePosition: '20% center',
        mobileFit: 'contain',
        projectUrl: 'villa-aggregate.html',
        desc: 'Interior design and visualization for a four-bedroom family house built to be sold, organised around vertical timber slats — living room, dining volume, kitchen and study nook, across sixteen plates.',
        specs: {
          client: 'Aggregate Construction Limited',
          scope: 'Interior design and architectural visualization, rendered to support the developer’s sales drive',
          team: 'RDVS Team',
          year: '2021',
          disciplines: '[\'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'villa-aggregate-plate15',
        title: 'Villa Aggregate',
        category: 'Interior Design & Architectural Visualization — 2021',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/aggregate/villa-aggregate-16.jpg',
        fit: 'contain',
        mobilePosition: 'center',
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
        imageUrl: 'assets/images/cascades/E1msdaCXEAEFx84.jpg',
        mobilePosition: '33% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
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
        mobilePosition: '70% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
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
        fit: 'contain',
        mobilePosition: 'center',
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
        mobilePosition: '24% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate3',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/E1beK_vXEAQG_oy.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate4',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/E9tM3Z2XMAMNd0k.jpg',
        fit: 'contain',
        mobilePosition: '82% center',
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
        id: 'hamlet-estate-plate5',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-01.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate6',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-02.jpg',
        mobilePosition: '70% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate7',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-03.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate8',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-04.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate9',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-05.jpg',
        mobilePosition: '46% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate10',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-06.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate11',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-07.jpg',
        fit: 'contain',
        mobilePosition: 'center',
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
        id: 'hamlet-estate-plate12',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-08.jpg',
        mobilePosition: '68% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate13',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-09.jpg',
        mobilePosition: '81% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate14',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-10.jpg',
        mobilePosition: '73% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate15',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-11.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate16',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-12.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate17',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-13.jpg',
        mobilePosition: '41% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate18',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-14.jpg',
        mobilePosition: '40% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate19',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-15.jpg',
        fit: 'contain',
        mobilePosition: '15% center',
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
        id: 'hamlet-estate-plate20',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-16.jpg',
        fit: 'contain',
        mobilePosition: '81% center',
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
        id: 'hamlet-estate-plate21',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-17.jpg',
        fit: 'contain',
        mobilePosition: '15% center',
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
        id: 'hamlet-estate-plate22',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-18.jpg',
        mobilePosition: '20% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate23',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-19.jpg',
        mobilePosition: '45% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate24',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-20.jpg',
        fit: 'contain',
        mobilePosition: '85% center',
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
        id: 'hamlet-estate-plate25',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-21.jpg',
        fit: 'contain',
        mobilePosition: '34% center',
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
        id: 'hamlet-estate-plate26',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-22.jpg',
        mobilePosition: '84% center',
        mobileFit: 'contain',
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
        id: 'hamlet-estate-plate27',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-23.jpg',
        mobilePosition: '29% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'swipe.html',
        desc: 'Interior design, environmental graphics, BIM modelling and architectural visualization for Swipe\'s own workplace in Accra — eight plates that carry a single lime-green identity from the logo through to the walls, the glass and the wayfinding.',
        specs: {
          client: 'Swipe',
          scope: 'Interior design, environmental graphics, BIM modelling and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'BIM & Architectural Visualization\']'
        }
      },
      {
        id: 'swipe-plate2',
        title: 'Swipe',
        category: 'Interior Design, Graphic Design, BIM & Architectural Visualization — 2020',
        service: 'Interior Design, Graphic Design, BIM & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/swipe/swipe-7.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'swipe.html',
        desc: 'Interior design, environmental graphics, BIM modelling and architectural visualization for Swipe\'s own workplace in Accra — eight plates that carry a single lime-green identity from the logo through to the walls, the glass and the wayfinding.',
        specs: {
          client: 'Swipe',
          scope: 'Interior design, environmental graphics, BIM modelling and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'BIM & Architectural Visualization\']'
        }
      },
      {
        id: 'swipe-plate3',
        title: 'Swipe',
        category: 'Interior Design, Graphic Design, BIM & Architectural Visualization — 2020',
        service: 'Interior Design, Graphic Design, BIM & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/swipe/swipe-6.jpg',
        mobilePosition: '72% center',
        mobileFit: 'contain',
        projectUrl: 'swipe.html',
        desc: 'Interior design, environmental graphics, BIM modelling and architectural visualization for Swipe\'s own workplace in Accra — eight plates that carry a single lime-green identity from the logo through to the walls, the glass and the wayfinding.',
        specs: {
          client: 'Swipe',
          scope: 'Interior design, environmental graphics, BIM modelling and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'BIM & Architectural Visualization\']'
        }
      },
      {
        id: 'swipe-plate4',
        title: 'Swipe',
        category: 'Interior Design, Graphic Design, BIM & Architectural Visualization — 2020',
        service: 'Interior Design, Graphic Design, BIM & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/swipe/swipe-8.jpg',
        fit: 'contain',
        mobilePosition: '15% center',
        projectUrl: 'swipe.html',
        desc: 'Interior design, environmental graphics, BIM modelling and architectural visualization for Swipe\'s own workplace in Accra — eight plates that carry a single lime-green identity from the logo through to the walls, the glass and the wayfinding.',
        specs: {
          client: 'Swipe',
          scope: 'Interior design, environmental graphics, BIM modelling and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'BIM & Architectural Visualization\']'
        }
      },
      {
        id: 'swipe-plate5',
        title: 'Swipe',
        category: 'Interior Design, Graphic Design, BIM & Architectural Visualization — 2020',
        service: 'Interior Design, Graphic Design, BIM & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/swipe/swipe-9.jpg',
        fit: 'contain',
        mobilePosition: '72% center',
        projectUrl: 'swipe.html',
        desc: 'Interior design, environmental graphics, BIM modelling and architectural visualization for Swipe\'s own workplace in Accra — eight plates that carry a single lime-green identity from the logo through to the walls, the glass and the wayfinding.',
        specs: {
          client: 'Swipe',
          scope: 'Interior design, environmental graphics, BIM modelling and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'BIM & Architectural Visualization\']'
        }
      },
      {
        id: 'swipe-plate6',
        title: 'Swipe',
        category: 'Interior Design, Graphic Design, BIM & Architectural Visualization — 2020',
        service: 'Interior Design, Graphic Design, BIM & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/swipe/swipe-11.jpg',
        fit: 'contain',
        mobilePosition: '15% center',
        projectUrl: 'swipe.html',
        desc: 'Interior design, environmental graphics, BIM modelling and architectural visualization for Swipe\'s own workplace in Accra — eight plates that carry a single lime-green identity from the logo through to the walls, the glass and the wayfinding.',
        specs: {
          client: 'Swipe',
          scope: 'Interior design, environmental graphics, BIM modelling and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'BIM & Architectural Visualization\']'
        }
      },
      {
        id: 'swipe-plate7',
        title: 'Swipe',
        category: 'Interior Design, Graphic Design, BIM & Architectural Visualization — 2020',
        service: 'Interior Design, Graphic Design, BIM & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/swipe/swipe-12.jpg',
        mobilePosition: '67% center',
        mobileFit: 'contain',
        projectUrl: 'swipe.html',
        desc: 'Interior design, environmental graphics, BIM modelling and architectural visualization for Swipe\'s own workplace in Accra — eight plates that carry a single lime-green identity from the logo through to the walls, the glass and the wayfinding.',
        specs: {
          client: 'Swipe',
          scope: 'Interior design, environmental graphics, BIM modelling and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'BIM & Architectural Visualization\']'
        }
      },
      {
        id: 'swipe-plate8',
        title: 'Swipe',
        category: 'Interior Design, Graphic Design, BIM & Architectural Visualization — 2020',
        service: 'Interior Design, Graphic Design, BIM & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/swipe/swipe-16.jpg',
        fit: 'contain',
        mobilePosition: '85% center',
        projectUrl: 'swipe.html',
        desc: 'Interior design, environmental graphics, BIM modelling and architectural visualization for Swipe\'s own workplace in Accra — eight plates that carry a single lime-green identity from the logo through to the walls, the glass and the wayfinding.',
        specs: {
          client: 'Swipe',
          scope: 'Interior design, environmental graphics, BIM modelling and architectural visualization',
          team: 'RDVS Team',
          year: '2020',
          disciplines: '[\'Interior Design\', \'Graphic Design\', \'BIM & Architectural Visualization\']'
        }
      },
      {
        id: 'poconos-bar-grill-plate1',
        title: 'Poconos Bar + Grill',
        category: 'Landscape Design, Interior Design & 3D Visualization — 2017',
        service: 'Landscape Design, Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-3.jpg',
        mobilePosition: '28% center',
        mobileFit: 'contain',
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
        mobilePosition: '22% center',
        mobileFit: 'contain',
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
        id: 'poconos-bar-grill-plate3',
        title: 'Poconos Bar + Grill',
        category: 'Landscape Design, Interior Design & 3D Visualization — 2017',
        service: 'Landscape Design, Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'poconos-bar-grill.html',
        desc: 'Poconos Bar + Grill dance floor and video wall: a figure with raised arms on the screen and red LED graphics beside it, the lit bar and its bottle shelves opening to the right.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Landscape Design, Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Architectural Design', 'Landscape Design', 'Interior Design', '3D Visualization']
        }
      },
      {
        id: 'poconos-bar-grill-plate4',
        title: 'Poconos Bar + Grill',
        category: 'Landscape Design, Interior Design & 3D Visualization — 2017',
        service: 'Landscape Design, Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-5.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'poconos-bar-grill.html',
        desc: 'Poconos Bar + Grill VIP booth: a grey sectional against a backlit faceted cube wall, black marble tables crowded with spirits and three glowing moon lamps, distressed metal floor lamps at either end.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Landscape Design, Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Architectural Design', 'Landscape Design', 'Interior Design', '3D Visualization']
        }
      },
      {
        id: 'poconos-bar-grill-plate5',
        title: 'Poconos Bar + Grill',
        category: 'Landscape Design, Interior Design & 3D Visualization — 2017',
        service: 'Landscape Design, Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-6.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'poconos-bar-grill.html',
        desc: 'Poconos Bar + Grill lounge head-on: the U-shaped sofa and red cushions wrapped around two marble tables with moon globes, the whole faceted wall washed in warm light.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Design, Landscape Design, Interior Design & 3D Visualization',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Architectural Design', 'Landscape Design', 'Interior Design', '3D Visualization']
        }
      },
      {
        id: 'naadei-villas-plate1',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-2.jpg',
        mobilePosition: 'center',
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
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        id: 'naadei-villas-image3',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-3.jpg',
        mobilePosition: '32% center',
        mobileFit: 'contain',
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
        id: 'naadei-villas-image4',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'naadei-villas-image5',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-5.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'naadei-villas-image6',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-6.jpg',
        mobilePosition: '58% center',
        mobileFit: 'contain',
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
        id: 'naadei-villas-image7',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-7.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'naadei-villas-image8',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-8.jpg',
        mobilePosition: '62% center',
        mobileFit: 'contain',
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
        id: 'naadei-villas-image9',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-9.jpg',
        mobilePosition: '62% center',
        mobileFit: 'contain',
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
        id: 'naadei-villas-image10',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-10.jpg',
        mobilePosition: 'center',
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
        id: 'naadei-villas-image11',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-11.jpg',
        mobilePosition: '40% center',
        mobileFit: 'contain',
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
        id: 'naadei-villas-image13',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-13.jpg',
        mobilePosition: '55% center',
        mobileFit: 'contain',
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
        id: 'naadei-villas-image14',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-14.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'naadei-villas-image15',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-15.jpg',
        mobilePosition: '45% center',
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
        id: 'naadei-villas-image16',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-16.jpg',
        mobilePosition: '52% center',
        mobileFit: 'contain',
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
        id: 'naadei-villas-image17',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-17.jpg',
        mobilePosition: 'center',
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
        id: 'naadei-villas-image18',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-18.jpg',
        mobilePosition: 'center',
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
        id: 'naadei-villas-image19',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-19.jpg',
        mobilePosition: '55% center',
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
        id: 'naadei-villas-image20',
        title: 'Naadei Villas',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/naadei-villas/naadei-villas-20.jpg',
        mobilePosition: 'center',
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
        mobilePosition: 'center',
        projectUrl: 'moty.html',
        desc: 'Interior design and 3D visualization by RDVS. Design in 2016 for MOTY, a children’s clothing shop at Accra Mall, combining retail interiors, custom furniture and playful graphics into a single whimsical world.',
        specs: {
          client: 'Mother of the Year (MOTY)',
          scope: 'Interior design, custom furniture and fixture design, retail graphics and the full set of 3D visualizations for the MOTY children’s store at Accra Mall.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: ['Interior Design', 'Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'moty-intro-motion-plate2',
        title: 'MOTY',
        category: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/moty/moty-2.jpg',
        mobilePosition: '41% center',
        projectUrl: 'moty.html',
        desc: 'Interior design and 3D visualization by RDVS. Design in 2016 for MOTY, a children’s clothing shop at Accra Mall, combining retail interiors, custom furniture and playful graphics into a single whimsical world.',
        specs: {
          client: 'Mother of the Year (MOTY)',
          scope: 'Interior design, custom furniture and fixture design, retail graphics and the full set of 3D visualizations for the MOTY children’s store at Accra Mall.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: ['Interior Design', 'Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'moty-plate1',
        title: 'MOTY',
        category: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/moty/moty-4.jpg',
        mobilePosition: 'center',
        projectUrl: 'moty.html',
        desc: 'Interior design and 3D visualization by RDVS. Design in 2016 for MOTY, a children’s clothing shop at Accra Mall, combining retail interiors, custom furniture and playful graphics into a single whimsical world.',
        specs: {
          client: 'Mother of the Year (MOTY)',
          scope: 'Interior design, custom furniture and fixture design, retail graphics and the full set of 3D visualizations for the MOTY children’s store at Accra Mall.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: ['Interior Design', 'Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'moty-plate2',
        title: 'MOTY',
        category: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/moty/moty-6.jpg',
        mobilePosition: 'center',
        projectUrl: 'moty.html',
        desc: 'Interior design and 3D visualization by RDVS. Design in 2016 for MOTY, a children’s clothing shop at Accra Mall, combining retail interiors, custom furniture and playful graphics into a single whimsical world.',
        specs: {
          client: 'Mother of the Year (MOTY)',
          scope: 'Interior design, custom furniture and fixture design, retail graphics and the full set of 3D visualizations for the MOTY children’s store at Accra Mall.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: ['Interior Design', 'Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },
      {
        id: 'moty-plate3',
        title: 'MOTY',
        category: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/moty/moty-7.jpg',
        mobilePosition: 'center',
        projectUrl: 'moty.html',
        desc: 'Interior design and 3D visualization by RDVS. Design in 2016 for MOTY, a children’s clothing shop at Accra Mall, combining retail interiors, custom furniture and playful graphics into a single whimsical world.',
        specs: {
          client: 'Mother of the Year (MOTY)',
          scope: 'Interior design, custom furniture and fixture design, retail graphics and the full set of 3D visualizations for the MOTY children’s store at Accra Mall.',
          team: 'RDVS. DESIGN',
          year: '2016',
          disciplines: ['Interior Design', 'Furniture Design', 'Graphic Design', 'Architectural Visualization']
        }
      },

      {
        id: 'macord-international-school-plate1',
        title: 'Macord International School',
        category: '3D Visualization — 2024',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/macord/macord-2.jpg',
        mobilePosition: 'center',
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
        mobilePosition: '75% center',
        mobileFit: 'contain',
        desktopPosition: 'center 100%',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '38% center',
        mobileFit: 'contain',
        projectUrl: 'link-drive-road.html',
        desc: 'Interior design and photorealistic 3D visualization for Link Drive Rd., a bespoke residential project completed for Imperial Homes.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: 'link-drive-road-plate3',
        title: 'Link Drive Rd.',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/link-drive/link-drive-2.jpg',
        mobilePosition: '41% center',
        mobileFit: 'contain',
        projectUrl: 'link-drive-road.html',
        desc: 'Interior design and photorealistic 3D visualization for Link Drive Rd., a bespoke residential project completed for Imperial Homes.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: 'link-drive-road-plate4',
        title: 'Link Drive Rd.',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/link-drive/link-drive-3.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'link-drive-road.html',
        desc: 'Interior design and photorealistic 3D visualization for Link Drive Rd., a bespoke residential project completed for Imperial Homes.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: 'link-drive-road-plate5',
        title: 'Link Drive Rd.',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/link-drive/link-drive-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'link-drive-road.html',
        desc: 'Interior design and photorealistic 3D visualization for Link Drive Rd., a bespoke residential project completed for Imperial Homes.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: 'link-drive-road-plate6',
        title: 'Link Drive Rd.',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/link-drive/link-drive-6.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'link-drive-road.html',
        desc: 'Interior design and photorealistic 3D visualization for Link Drive Rd., a bespoke residential project completed for Imperial Homes.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: 'link-drive-road-plate7',
        title: 'Link Drive Rd.',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/link-drive/link-drive-7.jpg',
        mobilePosition: '78% center',
        mobileFit: 'contain',
        projectUrl: 'link-drive-road.html',
        desc: 'Interior design and photorealistic 3D visualization for Link Drive Rd., a bespoke residential project completed for Imperial Homes.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: 'link-drive-road-plate8',
        title: 'Link Drive Rd.',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/link-drive/link-drive-8.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'la-beach-towers-plate3',
        title: 'La Beach Towers',
        category: '3D Visualization — 2013',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/la-beach-towers/la-beach-towers-12.jpg',
        fit: 'contain',
        mobilePosition: 'center',
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
        mobilePosition: 'center',
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
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
        desktopPosition: 'center 70.9%',
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
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'ela-b.html',
        desc: 'Render of the dining area seen through a foreground of blurred white branches: green-topped table, tan and black side chairs, black planters with tall greenery, pale carpet and the reed panel and pendant discs behind.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate2',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-8.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'ela-b.html',
        desc: 'Kitchen render: handleless white wall cabinets over a black worktop and splashback, oak fronted base units, an integrated extractor and hob, a small potted plant on the counter and a pale tiled floor.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate3',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-1.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ela-b.html',
        desc: 'Overhead render looking straight down at a grey shaggy carpet with two flat sculptural shapes in teal and slate grey, a round white openwork tray, and small carved wooden objects placed beside them.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate4',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-2.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ela-b.html',
        desc: 'Render of the open plan living and dining area: white sofas with teal cushions in the foreground, a mint topped dining table with mixed chairs beyond, disc pendants above and a large dried-reed panel on the far wall.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate5',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-3.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ela-b.html',
        desc: 'Wider angle render of the same living room: low white modular seating with teal and grey cushions, black organic coffee tables on a pale rug, blue armchair at the window and two framed artworks on the wall.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate6',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ela-b.html',
        desc: 'Render from the seating edge toward the dining zone: a bright blue lounge chair, dark coffee table with bowls and wooden objects, white armchair, and the reed wall art lit by two flat pendant discs.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate7',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-5.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ela-b.html',
        desc: 'Close-up render of a mint green table top holding a potted monstera, small woven baskets and a blue glass vessel, with a roller blind framing sunlit foliage outside and dried reeds hanging at the right.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate8',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-7.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ela-b.html',
        desc: 'Detail render across a black kitchen counter: stainless steel pots and a gas hob in shallow focus, with a bright green clipped hedge filling the window behind and daylight raking across the worktop.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate9',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-10.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'ela-b.html',
        desc: 'Opposite kitchen view render: the veneer wall and dark door at the right, a run of white and oak cabinets under two small windows, open shelving with jars, and three recessed ceiling discs overhead.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate10',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-11.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ela-b.html',
        desc: 'Bedroom render: a low oak bed with white linen and a navy throw on a teal patterned rug, black pouf at the foot, slim glass side tables, dark curtains and an orange exterior wall visible through the glazing.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate11',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-12.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ela-b.html',
        desc: 'Second angle of the bedroom render: the bed now against a white media wall with a wall-mounted television, pendant lamps over the side table, tall glazing to the balcony and the same geometric teal rug underfoot.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate12',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-13.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ela-b.html',
        desc: 'Tight corner render of the bedroom: a potted plant on the dark floor in front of the orange balcony wall, the edge of the bed with navy bedding, and bright daylight striping across the rug.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate13',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-14.jpg',
        mobilePosition: 'center',
        projectUrl: 'ela-b.html',
        desc: 'Detail render from the bedside: monstera leaves in the foreground, a glass side table with an open book, the white duvet and navy throw, and strong bands of sunlight falling across the teal patterned rug.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'ela-b-plate14',
        title: 'Ela B',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ela-b/ela-b-15.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ela-b.html',
        desc: 'Wide bedroom render from the foot of the room: the oak bed with navy throw centred between full-height glazing and dark drapes, a black pouf on the rug, and two pendant lights hanging low at either side.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design concept and space styling, finish and furniture selection, and the complete set of photoreal interior renderings delivered as real estate marketing collateral.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'el-dor-plate1',
        title: 'El Dor',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/el-dor/el-dor-hero.jpg',
        mobilePosition: '62% center',
        mobileFit: 'contain',
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
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/el-dor/el-dor-8.jpg',
        mobilePosition: '64% center',
        mobileFit: 'contain',
        projectUrl: 'el-dor.html',
        desc: 'A fifteen-plate interior design and 3D visualization set from 2018 for El D Or, a boutique hotel in the Cantonments area of Accra, moving from a sculptural lounge and marble lobby to dark jewel-toned guest suites.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for a hotel presentation.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'el-dor-plate4',
        title: 'El Dor',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/el-dor/el-dor-9.jpg',
        mobilePosition: '33% center',
        mobileFit: 'contain',
        projectUrl: 'el-dor.html',
        desc: 'A fifteen-plate interior design and 3D visualization set from 2018 for El D Or, a boutique hotel in the Cantonments area of Accra, moving from a sculptural lounge and marble lobby to dark jewel-toned guest suites.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for a hotel presentation.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'el-dor-plate5',
        title: 'El Dor',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/el-dor/el-dor-10.jpg',
        mobilePosition: '59% center',
        mobileFit: 'contain',
        projectUrl: 'el-dor.html',
        desc: 'A fifteen-plate interior design and 3D visualization set from 2018 for El D Or, a boutique hotel in the Cantonments area of Accra, moving from a sculptural lounge and marble lobby to dark jewel-toned guest suites.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for a hotel presentation.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'el-dor-plate6',
        title: 'El Dor',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/el-dor/el-dor-11.jpg',
        mobilePosition: '33% center',
        mobileFit: 'contain',
        projectUrl: 'el-dor.html',
        desc: 'A fifteen-plate interior design and 3D visualization set from 2018 for El D Or, a boutique hotel in the Cantonments area of Accra, moving from a sculptural lounge and marble lobby to dark jewel-toned guest suites.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for a hotel presentation.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'el-dor-plate7',
        title: 'El Dor',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/el-dor/el-dor-12.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'el-dor.html',
        desc: 'A fifteen-plate interior design and 3D visualization set from 2018 for El D Or, a boutique hotel in the Cantonments area of Accra, moving from a sculptural lounge and marble lobby to dark jewel-toned guest suites.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for a hotel presentation.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'el-dor-plate8',
        title: 'El Dor',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/el-dor/el-dor-13.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'el-dor.html',
        desc: 'A fifteen-plate interior design and 3D visualization set from 2018 for El D Or, a boutique hotel in the Cantonments area of Accra, moving from a sculptural lounge and marble lobby to dark jewel-toned guest suites.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for a hotel presentation.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'el-dor-plate9',
        title: 'El Dor',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/el-dor/el-dor-14.jpg',
        mobilePosition: 'center',
        desktopPosition: 'center 74.7%',
        projectUrl: 'el-dor.html',
        desc: 'A fifteen-plate interior design and 3D visualization set from 2018 for El D Or, a boutique hotel in the Cantonments area of Accra, moving from a sculptural lounge and marble lobby to dark jewel-toned guest suites.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and photorealistic 3D visualization for a hotel presentation.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },

      {
        id: 'ehr-plate1',
        title: 'EHR',
        category: 'Architectural Design, Interior Design & Architectural Visualization — 2017',
        service: 'Architectural Design, Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ehr/ehr-18.jpg',
        mobilePosition: '55% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ehr.html',
        desc: 'EHR is a 2017 interior design and visualization set for a proposed private residence in Accra, Ghana. This page carries the four frames that were left out of the published gallery: one dusk view of the villa\u2019s garden and three daylight angles of its open-plan dining and bar.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural concept and development for the villa, full interior design including furniture and lighting selection, and the complete set of dusk exterior and interior visualizations used as sales material.',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: '[\'Architectural Design\', \'Interior Design   Architectural Visualization\']'
        }
      },      {
        id: 'ehr-plate4',
        title: 'EHR',
        category: 'Architectural Design, Interior Design & Architectural Visualization — 2017',
        service: 'Architectural Design, Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/ehr/ehr-21.jpg',
        mobilePosition: 'center',
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
        imageUrl: 'assets/images/csm/csm-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '41% center',
        mobileFit: 'contain',
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
        mobilePosition: '64% center',
        mobileFit: 'contain',
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
        mobilePosition: '15% center',
        mobileFit: 'contain',
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
        mobilePosition: '20% center',
        mobileFit: 'contain',
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
        mobilePosition: '20% center',
        mobileFit: 'contain',
        projectUrl: 'bfa.html',
        desc: 'BFA bedroom from the foot of the bed: a low dark upholstered bed in pink sheets and a grey throw, pink panelled half walls, a tall yucca in a white pot beside the headboard, a wall-mounted black television, pink table lamp and a round pink table with a magazine on the white shag rug.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'bfa-plate2',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-6.jpg',
        mobilePosition: '26% center',
        mobileFit: 'contain',
        projectUrl: 'bfa.html',
        desc: 'BFA bedroom from the opposite corner, framed by a blurred wall edge and out-of-focus plant: the black television on a split white and pink wall, a cream armchair on a quilted grey base and a tripod floor lamp with a drum shade.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'bfa-plate3',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-8.jpg',
        mobilePosition: '75% center',
        mobileFit: 'contain',
        projectUrl: 'bfa.html',
        desc: 'BFA living room: the white two-seat sofa with navy velvet cushions on the dark feature wall, two oak-framed lounge chairs with tan slings, decanters on the glass oval table and a slim arc floor lamp by the navy curtain.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'bfa-plate4',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-7.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'bfa.html',
        desc: 'BFA bedroom behind the cream sofa back that spans the foreground: pink headboard panel, pink lamp on a block nightstand, a chrome tray of glass tumblers on the shag rug and a yucca in a black pot by the dark curtains.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'bfa-plate5',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-9.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'bfa.html',
        desc: 'BFA bedroom cropped low at the bed foot: dark grey wall over pink panelling, the pink lamp, a chrome-legged table with a silver ice bucket and crystal bowl, and a pink cantilever side table carrying a potted palm.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'bfa-plate6',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-10.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'bfa.html',
        desc: 'BFA bedroom from the far corner: the bed centred on a grey shag rug with a pink drum table and lamp at right, a cream sofa and floor lamp by the sliding glass doors to the terrace, tall yucca in a black ribbed planter.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'bfa-plate7',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-11.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'bfa.html',
        desc: 'BFA bedroom at nearly the same angle as the plate behind the sofa, with a large white tripod floor lamp added at right against the dark grey upper walls, a yucca in a white pot between the bed and the terrace door, and the same pink table, magazine and remote in the centre.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'bfa-plate8',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-12.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'bfa.html',
        desc: 'BFA kitchen in square crop: a white curved peninsula with potted cacti on a black tripod stand, three pale pink cylinder pendants, glossy white cabinets over oak base units, a sink under a blinded window and a silver Liebherr fridge.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'bfa-plate9',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-13.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'bfa.html',
        desc: 'BFA bedroom panned toward the television wall: a black flat screen on the dark panel above a pink dado band, two dark doors, a yucca on the pink ledge and the chrome tray and round table in the foreground.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'bfa-plate10',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-1.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'bfa.html',
        desc: 'BFA dining area from the far end: an oak table with six black upholstered chairs under an interlocking LED ring pendant, a bowl of yellow citrus on top, two flush black doors in the wall behind and the bar with white wire stools at left.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'bfa-plate11',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-2.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'bfa.html',
        desc: 'BFA kitchen at counter height: glossy taupe wall cabinets and a steel hood over a grey mosaic backsplash and white worktop, oak veneer bases, three stacked yellow bowls, a tall chrome tap and a black-framed window on greenery.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'bfa-plate12',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-3.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'bfa.html',
        desc: 'BFA living room from behind a white sofa with blue velvet cushions: two glass coffee tables on gold drum bases, an oak media console under a black television, an abstract diptych on the pink wall and the dining table beyond.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'bfa-plate13',
        title: 'BFA',
        category: 'Interior Design & 3D Visualization — 2018',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/bfa/bfa-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'bfa.html',
        desc: 'BFA dining table from the opposite end, camera low: the same oak top, black chairs, citrus bowl and ring pendant, with the pink wall diptych behind, black curtains and an orange car at the window, white wire bar stools at right.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },




      {
        id: 'afg-offices-plate2',
        title: 'AFG Offices',
        category: 'Interior Design, 3D Visualization, Graphic Design, Industrial & Furniture Design & Construction — 2019',
        service: 'Interior Design, 3D Visualization, Graphic Design, Industrial & Furniture Design & Construction',
        discipline: 'interiors',
        imageUrl: 'assets/images/afg/afg-21.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        mobilePosition: '15% center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
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
        id: 'abl-reception-plate3',
        title: 'ABL Reception',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/abl-reception/abl-reception-4.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: '1957-apartments-retail-plate1',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-6.jpg',
        fit: 'contain',
        mobilePosition: 'center',
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
        mobilePosition: '78% center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate3',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-3.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate4',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate5',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-5.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate6',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-7.jpg',
        fit: 'contain',
        mobilePosition: '41% center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate7',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-8.jpg',
        mobilePosition: '70% center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate8',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-9.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate9',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-10.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate10',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-11.jpg',
        mobilePosition: '64% center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate11',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-13.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate12',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-1.jpg',
        mobilePosition: '41% center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate13',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-14.jpg',
        mobilePosition: '66% center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate14',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-15.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: '1957.html',
        desc: 'Interior design and 3D architectural visualization for 1957 Apartments and Retail, with architecture by Mustard Architecture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & 3D Visualization',
          team: 'Jude Abbey, Jude Nyoagbe',
          year: '2019',
          disciplines: '[\'Interior Design\', \'3D Visualization\']'
        }
      },      {
        id: '1957-apartments-retail-plate15',
        title: '1957 Apartments and Retail',
        category: 'Interior Design & 3D Visualization — 2019',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-16.jpg',
        fit: 'contain',
        mobilePosition: '75% center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate4',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/E1mtKvQXIAMmM9h.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate5',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/E1mtLvhWQAcCZ7p.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate6',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/E1mtLWgXIAgYyjJ.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate7',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/E2G_xZRWYAIScVK.jpg',
        mobilePosition: '38% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate8',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/E2IDVPjXMAA1kEf.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate9',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/E2IDVrPXsAA5ypI.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate10',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-2.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate11',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-3.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate12',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-4.jpg',
        mobilePosition: '41% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate13',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-5.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate14',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-6.jpg',
        fit: 'contain',
        mobilePosition: '70% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate15',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-7.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate16',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-8.jpg',
        mobilePosition: '41% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate17',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-9.jpg',
        mobilePosition: '35% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate18',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-10.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate19',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-11.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate20',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-12.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate21',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-13.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate22',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-14.jpg',
        mobilePosition: '38% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate23',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-15.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate24',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-16.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate25',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-17.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate26',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-18.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate27',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-19.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate28',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-20.jpg',
        mobilePosition: '36% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate29',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-21.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate30',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-22.jpg',
        mobilePosition: '30% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate31',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-23.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
        specs: {
          client: 'Hawkrad Properties',
          scope: 'Interior design and CGI — still renders, an animation film and a VR walkthrough — produced as marketing material for the development; architecture by ArchXenus',
          team: 'RDVS Team',
          year: '2017',
          disciplines: ['Interior Design', 'Architectural Visualization', '3D Animation']
        }
      },      {
        id: 'tower-cascades-plate32',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/cascades/tower-cascades-24.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'tower-cascades.html',
        desc: 'Interior design and CGI for Hawkrad Properties: thirty-two visualisation plates, an animation film and a VR walkthrough of the Tower Cascades apartments, lobby, roof terrace and gym. Architecture by ArchXenus.',
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
        fit: 'contain',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: '15% center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
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
        id: 'petrus',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-1.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'petrus.html',
        desc: 'Interior design and photorealistic 3D visualization for Petrus, a 2017 residence in Accra: a bedroom in greige linen and oak, a living room under a triple-ring chandelier, a glazed gym and a pool deck with the city beyond.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior design and photorealistic 3D visualization commissioned by Imperial Homes; architecture by S.A.A',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'petrus-plate1',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-2.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'petrus.html',
        desc: 'The Petrus bedroom from the foot of the bed: a white sideboard with brass vertical inlays, radial wall art above, a gold teardrop vase and a dark rug over grey plank flooring.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior design and photorealistic 3D visualization commissioned by Imperial Homes; architecture by S.A.A',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'petrus-plate2',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-3.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'petrus.html',
        desc: 'Petrus living room by day: white sofa and two swivel armchairs around a sculptural white table under a triple-ring LED chandelier, four tree-ring prints on the wall and sliding doors into the gym at left.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior design and photorealistic 3D visualization commissioned by Imperial Homes; architecture by S.A.A',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'petrus-plate3',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-4.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'petrus.html',
        desc: 'Petrus home gym: treadmill, red exercise bike and a black-and-yellow bench along the wood-panelled wall and tall mirror, glass doors onto banana-leaf planting over plank flooring.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior design and photorealistic 3D visualization commissioned by Imperial Homes; architecture by S.A.A',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'petrus-plate4',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-5.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'petrus.html',
        desc: 'Petrus kitchen at counter height: dark gloss base cabinets, cream uppers and grey marble worktops, a board with bread and cheese in the foreground beside a tall tap and under-cabinet lighting.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior design and photorealistic 3D visualization commissioned by Imperial Homes; architecture by S.A.A',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'petrus-plate5',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-6.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'petrus.html',
        desc: 'Petrus kitchen from the far end of the L-run: black gloss drawers with steel pulls, hanging utensils and a roller blind at the window, a glass door at right looking through to the gym.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior design and photorealistic 3D visualization commissioned by Imperial Homes; architecture by S.A.A',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'petrus-plate6',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-7.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'petrus.html',
        desc: 'Petrus living room from behind the sofas: a wall-mounted television over the cream media panel, two white swivel chairs and the ring chandelier, tree-ring artworks and a sliding door to the lawn beyond.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior design and photorealistic 3D visualization commissioned by Imperial Homes; architecture by S.A.A',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'petrus-plate7',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-8.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'petrus.html',
        desc: 'Petrus living room the other way: the white sofa facing the camera with a two-tier coffee table, cognac leather chair in the foreground, an abstract figure painting and a white torso sculpture at left.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior design and photorealistic 3D visualization commissioned by Imperial Homes; architecture by S.A.A',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'petrus-plate8',
        title: 'Petrus',
        category: 'Interior Design & 3D Visualization — 2017',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/petrus/petrus-9.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'petrus.html',
        desc: 'Petrus gym from the low corner: dumbbell rack, bench and cable machine along the wall, red spin bike and treadmill by the black-framed glass doors, a mirror edge at left and the pool beyond.',
        specs: {
          client: 'Imperial Homes',
          scope: 'Interior design and photorealistic 3D visualization commissioned by Imperial Homes; architecture by S.A.A',
          team: 'RDVS. DESIGN',
          year: '2017',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hot-gossip',
        title: 'Hot Gossip',
        category: 'Interior Design & 3D Visualization — 2012',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-1.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hot-gossip.html',
        desc: 'Hot Gossip in 2012: a lounge walled in backlit pink discs, with a curved sectional in pale upholstery, a low table on a dark rug and steps up to a raised area at the far end.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for a 2012 nightlife interior in Accra',
          team: 'Caleb Sackey + R.D+V.S',
          year: '2012',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hot-gossip-plate6',
        title: 'Hot Gossip',
        category: 'Interior Design & 3D Visualization — 2012',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-6.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hot-gossip.html',
        desc: 'The billiards hall at Hot Gossip: a blue-clothed pool table under yellow cove lighting, a glass-block partition on one side and a wall of pink disc lights at the far end.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for a 2012 nightlife interior in Accra',
          team: 'Caleb Sackey + R.D+V.S',
          year: '2012',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hot-gossip-plate5',
        title: 'Hot Gossip',
        category: 'Interior Design & 3D Visualization — 2012',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-5.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hot-gossip.html',
        desc: 'The bar at Hot Gossip: warm yellow strip light under a slatted luminous ceiling, a brass column at the corner, a mirrored back bar with pink disc panels and a row of teal stools.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for a 2012 nightlife interior in Accra',
          team: 'Caleb Sackey + R.D+V.S',
          year: '2012',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hot-gossip-plate2',
        title: 'Hot Gossip',
        category: 'Interior Design & 3D Visualization — 2012',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-2.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hot-gossip.html',
        desc: 'The Hot Gossip washroom: three white vessel basins along a glossy deep-purple counter under a mirror wall, dark mosaic wrapping the side wall and a cove of light across the ceiling.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for a 2012 nightlife interior in Accra',
          team: 'Caleb Sackey + R.D+V.S',
          year: '2012',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hot-gossip-plate3',
        title: 'Hot Gossip',
        category: 'Interior Design & 3D Visualization — 2012',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-3.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hot-gossip.html',
        desc: 'The same washroom from the other end: a long magenta vanity run with basins and mirrors, black mosaic behind it and recessed slots lighting the ceiling.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for a 2012 nightlife interior in Accra',
          team: 'Caleb Sackey + R.D+V.S',
          year: '2012',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hot-gossip-plate4',
        title: 'Hot Gossip',
        category: 'Interior Design & 3D Visualization — 2012',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-4.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hot-gossip.html',
        desc: 'Booth seating at Hot Gossip lit from a wall of glowing pink discs, with a band of blue cove light tracing the ceiling recess above an L-shaped sofa and a low table.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for a 2012 nightlife interior in Accra',
          team: 'Caleb Sackey + R.D+V.S',
          year: '2012',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hot-gossip-plate7',
        title: 'Hot Gossip',
        category: 'Interior Design & 3D Visualization — 2012',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-7.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hot-gossip.html',
        desc: 'The Hot Gossip dance floor of illuminated photo tiles laid out in a grid, leading to a raised DJ booth glowing pink at the far end, with columns of disc lights framing the room.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for a 2012 nightlife interior in Accra',
          team: 'Caleb Sackey + R.D+V.S',
          year: '2012',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hot-gossip-plate8',
        title: 'Hot Gossip',
        category: 'Interior Design & 3D Visualization — 2012',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-8.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hot-gossip.html',
        desc: 'The lit dance floor seen from the side: quilted pale-pink wall panels, a band of disc lights and the glowing floor tiles running towards a bar at the end of the room.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for a 2012 nightlife interior in Accra',
          team: 'Caleb Sackey + R.D+V.S',
          year: '2012',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hot-gossip-plate9',
        title: 'Hot Gossip',
        category: 'Interior Design & 3D Visualization — 2012',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-9.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hot-gossip.html',
        desc: 'Low banquettes set on a dark rug in front of a full-height wall of glowing pink discs that wraps the corner of the lounge.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for a 2012 nightlife interior in Accra',
          team: 'Caleb Sackey + R.D+V.S',
          year: '2012',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hot-gossip-plate10',
        title: 'Hot Gossip',
        category: 'Interior Design & 3D Visualization — 2012',
        service: 'Interior Design & 3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-10.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hot-gossip.html',
        desc: 'The bar and billiards hall from the opposite end: a radial ceiling of yellow-lit slats opening above the room, pendant clusters, and pink disc columns at either side.',
        specs: {
          client: 'Private Client',
          scope: 'Interior design and 3D visualization for a 2012 nightlife interior in Accra',
          team: 'Caleb Sackey + R.D+V.S',
          year: '2012',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hfa',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-6.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hfa.html',
        desc: 'HFA in 2018: the living and dining zone of a new Accra apartment seen through its own opening, a grey sofa on a pale rug before a dark feature wall with a floating timber cabinet, and a white dining set under a dome pendant to the left.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design and photorealistic 3D visualization for a new Accra apartment, delivered as marketing imagery for the Homes Direct campaign.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'hfa-plate1',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-1.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hfa.html',
        desc: 'HFA bedroom: a low bed dressed in grey and taupe against a chocolate-brown accent panel carrying a wall-mounted television over a floating white console, sheer curtains at a tall window and a black ottoman at the foot.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design concept and styling for the bedroom, with the photoreal render delivered for the developer campaign.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'hfa-plate2',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-10.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'hfa.html',
        desc: 'HFA kitchen, square on the column: dark lower cabinets and pale handleless uppers with a bright yellow open shelf as the accent, light quartz counters and splashback running the wall, daylight at a window and door, and the breakfast table glimpsed at the right.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design for the kitchen, its joinery and stone surfaces, rendered square for the campaign set.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'hfa-plate3',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-2.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hfa.html',
        desc: 'HFA master bedroom: the bed facing a tall brown feature panel with a wall-mounted television, an open walk-in wardrobe with hanging clothes to the left, a dark armchair, floor lamp and framed art beyond.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design for the master bedroom and its walk-in wardrobe, rendered for the Homes Direct marketing set.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'hfa-plate4',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-3.jpg',
        mobilePosition: 'center',
        projectUrl: 'hfa.html',
        desc: 'HFA bedroom from the door end: the low bed against the far wall with a round mirror on a brown panel, tall windows and sheer curtains running the left, a small side table with a lamp over a pale rug.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design and styling for the second bedroom, photographed as a render for the marketing set.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'hfa-plate5',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hfa.html',
        desc: 'HFA open-plan living and dining in bright white: a grey sofa and cushions at the left, a white dining table with molded chairs at the right, a timber cabinet wall, a floating console with greenery and a round mirror.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design for the shared living and dining room, its joinery wall and furniture schedule, rendered for the campaign.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'hfa-plate6',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-5.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hfa.html',
        desc: 'HFA dining area at dusk: a white round table with molded chairs beneath a black dome pendant, mauve curtains glowing behind, a framed picture on the left wall and a grey sofa in the foreground.',
        specs: {
          client: 'Homes Direct',
          scope: 'Lighting and styling study for the dining room at evening, part of the rendered marketing set.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'hfa-plate7',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-7.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hfa.html',
        desc: 'HFA dressing area: an upholstered grey armchair before an open wardrobe with hanging clothes and white cabinetry, a folded throw on the chair, a small shelf and plant at the left over warm wood floor.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design for the walk-in dressing space and its joinery, rendered for the Homes Direct set.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'hfa-plate8',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-8.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hfa.html',
        desc: 'HFA kitchen looking toward the dining area: white cabinets and a long stainless double sink beneath a row of windows, a dark island to the right, an open shelf holding bottles and the white table through the opening.',
        specs: {
          client: 'Homes Direct',
          scope: 'Kitchen layout, joinery and worktop specification, rendered for the campaign imagery.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'hfa-plate9',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-9.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'hfa.html',
        desc: 'HFA living room in full daylight: a grey sofa with cushions and a black round pouf on a pale rug, small timber side tables flanking it, framed art on white walls and a white dining set to the right under a dome pendant.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design and furniture specification for the living room, rendered for the developer campaign.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'hfa-plate10',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-11.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'hfa.html',
        desc: 'HFA dining space flooded with daylight, held tall: a white round table with white molded chairs beneath a dark dome pendant, a framed black-and-white picture on the wall, sheer curtains softening tall windows at the right and a leafy plant in the foreground.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design for the dining room, rendered portrait for the Homes Direct marketing set.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
        }
      },
      {
        id: 'hfa-plate11',
        title: 'HFA',
        category: 'Interior Design & Architectural Visualization — 2018',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hfa/hfa-12.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'hfa.html',
        desc: 'HFA dining room in bright white, square on the column: a round white table with molded chairs under a black dome pendant, a framed forest picture on the wall, tall windows with sheer curtains and a potted plant in the foreground.',
        specs: {
          client: 'Homes Direct',
          scope: 'Interior design and styling for the dining room, rendered square for the campaign set.',
          team: 'RDVS. DESIGN',
          year: '2018',
          disciplines: ['Interior Design', 'Architectural Visualization']
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
        imageUrl: 'assets/images/ttd/FuIPLeNWYAIxRIj.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/mig/mig-1h-2.jpg',
        mobilePosition: 'center',
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
        imageUrl: 'assets/images/ahero/F9WX-jyXcAApIqO.jpg',
        mobilePosition: '84% center',
        mobileFit: 'contain',
        projectUrl: 'ahero.html',
      },
      {
        id: 'ackon-desk-film',
        title: 'Ackon Desk',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        videoUrl: 'assets/videos/ackon-desk/ackon-desk-film.mp4',
        imageUrl: 'assets/images/ackon-desk/GUEAQ-MWsAAGT7n.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/tea-house/tea-house-05.png',
        mobilePosition: 'center',
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
        imageUrl: 'assets/images/2gs/2gs-logo-construction-frame.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/1981/1981-6.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'afg-render-87',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-87.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'Visualisation of the lounge: the seating group and faceted Welcome to AFG wall modelled before build, daylight coming through the glazed boardroom.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-88',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-88.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'The lounge camera in its evening grade, the room dropping to black around the lit graphic wall.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-89',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-89.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'Visualisation of the boardroom from the lounge, its glazed wall etched with We build the pride of Africa and the faceted ceiling visible inside.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-90',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-90.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'The same boardroom camera under artificial light, the etched signage and red graphics glowing on the glass.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-91',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-91.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'Boardroom visualisation from the head of the table, showing the faceted ceiling panels and a pull-down projection screen.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-92',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-92.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'Open-plan visualisation: bench desks and task chairs under a black ceiling, the AFG graphic wall at the far end.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-93',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-93.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'The open plan from the opposite end, storage fins dividing the desk banks and daylight at the far windows.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-94',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-94.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'Management office visualisation, a plywood desk and task chair in a bright white room with textured blinds.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-95',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-95.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'Pantry visualisation from the doorway, bench seating and red chairs at the counter.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-96',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-96.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'The pantry from inside, a red-tiled graphic wall, black cabinets and the dining table set with red chairs.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-97',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-97.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'Breakout visualisation: a pinboard wall of red panels, open shelving and a timber table under a black ceiling.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-98',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-98.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'Pantry booth visualisation in daylight, red chairs and bench seating around a plywood table by the window.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-99',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-99.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'The same booth in its blue night grade, the room reduced to silhouette and cool light.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'afg-render-100',
        title: 'AFG Offices',
        category: 'Design Visualisations — 2019',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/afg/afg-100.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'afg.html',
        desc: 'Visualisation of the staff rest room: two low day beds in a deep blue room, the faceted wall shape lit from above.',
        specs: {
          client: 'AFG',
          scope: 'Interior design, environmental graphics, 3D visualization, bespoke furniture and full fit-out construction',
          team: 'RDVS Team',
          year: '2019',
          disciplines: ['Interior Design', '3D Visualization', 'Graphic Design', 'Industrial & Furniture Design', 'Construction']
        }
      },
      {
        id: 'jhk-investment',
        title: 'JHK',
        category: 'Architectural Visualization — 2011',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/jhk-investment/jhk-investment-1.png',
        mobilePosition: '85% center',
        projectUrl: 'jhk-investment.html',
        desc: 'JHK at dusk: a crisp white two-storey villa with tall slit windows and a glazed ground floor, interior light spilling onto a lawn washed by garden uplights under a deep blue evening sky',
        specs: {
          client: 'JHK Investments',
          scope: 'Architectural visualization for JHK Investments: ten exterior views of modern one- and two-storey houses in daylight and at dusk, and a stereo camera flythrough of the development',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: ['Architectural Visualization']
        },
      },
      {
        id: 'jhk-investment-plate1',
        title: 'JHK',
        category: 'Architectural Visualization — 2011',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/jhk-investment/jhk-investment-2.png',
        mobilePosition: 'center',
        projectUrl: 'jhk-investment.html',
        desc: 'Daytime exterior of an ochre single-storey house with a covered porch, children playing on the lawn beside a red toy car and a blue pool cover, palms and trees behind',
        specs: {
          client: 'JHK Investments',
          scope: 'Architectural visualization for JHK Investments: ten exterior views of modern one- and two-storey houses in daylight and at dusk, and a stereo camera flythrough of the development',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: ['Architectural Visualization']
        },
      },
      {
        id: 'jhk-investment-plate2',
        title: 'JHK',
        category: 'Architectural Visualization — 2011',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/jhk-investment/jhk-investment-3.png',
        mobilePosition: '85% center',
        projectUrl: 'jhk-investment.html',
        desc: 'The side of an ochre house with a timber pergola and stone-clad columns casting striped shadows across a paved walkway and lawn, a window glowing warmly',
        specs: {
          client: 'JHK Investments',
          scope: 'Architectural visualization for JHK Investments: ten exterior views of modern one- and two-storey houses in daylight and at dusk, and a stereo camera flythrough of the development',
          team: 'RDVS. DESIGN',
          year: '2011',
          disciplines: ['Architectural Visualization']
        },
      },
      {
        id: 'ert',
        title: 'ERT',
        category: 'Architectural Visualization — 2015',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ert/ert-1.jpg',
        mobilePosition: 'center',
        projectUrl: 'ert.html',
        desc: 'Architectural visualization of ERT, a townhouse scheme by Mobius Architecture in Accra: three white cubic volumes with timber roof screens and a lit lap pool, seen at dusk.',
        specs: {
          client: 'Private Client',
          architecture: 'Mobius Architecture',
          scope: '3D architectural visualization: exterior views of the ERT townhouses at dusk and in daylight, including the drive approach and the corner house.',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'ert-plate1',
        title: 'ERT',
        category: 'Architectural Visualization — 2015',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ert/ert-2.jpg',
        mobilePosition: 'center',
        projectUrl: 'ert.html',
        desc: 'ERT from the drive at dusk: each white volume carries a board-formed concrete window bay and a planted timber pergola, cars parked under the cantilevers and bollard lights tracing the lawn edge.',
        specs: {
          client: 'Private Client',
          architecture: 'Mobius Architecture',
          scope: '3D architectural visualization: exterior views of the ERT townhouses at dusk and in daylight, including the drive approach and the corner house.',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'ert-plate2',
        title: 'ERT',
        category: 'Architectural Visualization — 2015',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ert/ert-3.jpg',
        mobilePosition: 'center',
        projectUrl: 'ert.html',
        desc: 'ERT corner house at dusk: the white cubic volume with its concrete chimney and full-height glazing, a timber Townhouses sign wall uplit at the left and an SUV under the carport.',
        specs: {
          client: 'Private Client',
          architecture: 'Mobius Architecture',
          scope: '3D architectural visualization: exterior views of the ERT townhouses at dusk and in daylight, including the drive approach and the corner house.',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Architectural Visualization\']'
        }
      },      {
        id: 'ert-plate3',
        title: 'ERT',
        category: 'Architectural Visualization — 2015',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ert/ert-4.jpg',
        mobilePosition: 'center',
        projectUrl: 'ert.html',
        desc: 'ERT corner house at dusk: the white cubic volume with its concrete chimney and full-height glazing, a timber Townhouses sign wall uplit at the left and an SUV under the carport.',
        specs: {
          client: 'Private Client',
          architecture: 'Mobius Architecture',
          scope: '3D architectural visualization: exterior views of the ERT townhouses at dusk and in daylight, including the drive approach and the corner house.',
          team: 'RDVS Team',
          year: '2015',
          disciplines: '[\'Architectural Visualization\']'
        }
      },
      {
        id: 'fule-1',
        title: 'Fule',
        category: 'Architectural Visualization — 2013',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/fule/fule-6.jpg',
        fit: 'contain',
        mobilePosition: 'center',
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
        id: 'ttd-zv-h-s-3ll',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/GBzvEEhXsAAX3ll.jpg',
        mobilePosition: '72% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },
      {
        id: 'protea-hotel-airport-7i-qm7-e-he',
        title: 'Protea Hotel - Airport',
        category: 'Architectural Visualization — 2020',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/protea-hotel-airport/E7iCqm7XMAQeNhe.jpg',
        mobilePosition: 'center',
        projectUrl: 'protea-hotel-airport.html'
      },
      {
        id: 'protea-hotel-airport-7i-s8-v',
        title: 'Protea Hotel - Airport',
        category: 'Architectural Visualization — 2020',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/protea-hotel-airport/E7iCs8EWYAAvIOH.jpg',
        mobilePosition: '75% center',
        mobileFit: 'contain',
        projectUrl: 'protea-hotel-airport.html'
      },
      {
        id: 'protea-hotel-airport-7i-sbw',
        title: 'Protea Hotel - Airport',
        category: 'Architectural Visualization — 2020',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/protea-hotel-airport/E7iCsBwXMAIxQGf.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'protea-hotel-airport.html'
      },
      {
        id: 'protea-hotel-airport-7i-tzp',
        title: 'Protea Hotel - Airport',
        category: 'Architectural Visualization — 2020',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/protea-hotel-airport/E7iCtzPXoAEAaLT.jpg',
        mobilePosition: '58% center',
        mobileFit: 'contain',
        projectUrl: 'protea-hotel-airport.html'
      },
      {
        id: 'protea-hotel-airport-7i-whk',
        title: 'Protea Hotel - Airport',
        category: 'Architectural Visualization — 2020',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/protea-hotel-airport/E7iCwhKXIAAdVuB.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'protea-hotel-airport.html'
      },
      {
        id: 'protea-hotel-airport-7i-xqu',
        title: 'Protea Hotel - Airport',
        category: 'Architectural Visualization — 2020',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/protea-hotel-airport/E7iCxquX0AM7iJa.jpg',
        mobilePosition: '45% center',
        mobileFit: 'contain',
        projectUrl: 'protea-hotel-airport.html'
      },
      {
        id: 'mig-efk-0-7-5e',
        title: 'MIG',
        category: 'Modern Indigenous Goods — 2021',
        service: 'Modern Indigenous Goods',
        discipline: 'vfx',
        imageUrl: 'assets/images/mig/EefkDFAX0AA7W5e.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'mig.html'
      },
      {
        id: 'mig-1h-1',
        title: 'MIG',
        category: 'Modern Indigenous Goods — 2021',
        service: 'Modern Indigenous Goods',
        discipline: 'vfx',
        imageUrl: 'assets/images/mig/mig-1h-1.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'mig.html'
      },
      {
        id: 'margin-bank',
        title: 'Margin',
        category: 'Workplace Interiors — 2022',
        service: 'Workplace Interiors',
        discipline: 'vfx',
        imageUrl: 'assets/images/margin/margin-bank.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'margin.html'
      },
      {
        id: 'margin-h-a-90',
        title: 'Margin',
        category: 'Workplace Interiors — 2022',
        service: 'Workplace Interiors',
        discipline: 'vfx',
        imageUrl: 'assets/images/margin/F97ocXEXAAArCud.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'margin.html'
      },
      {
        id: 'hola-1k-sa-0-t-n',
        title: 'Hola',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/hola/F1kFHsaX0AAGtWn.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'hola.html'
      },
      {
        id: 'hola-15a7q-w-z',
        title: 'Hola',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/hola/F15a7QaWAAAaW3Z.jpg',
        mobilePosition: '72% center',
        projectUrl: 'hola.html'
      },
      {
        id: 'giffard-park-i-k-x',
        title: 'Giffard Park',
        category: 'Multi-Unit Residential — 2022',
        service: 'Multi-Unit Residential',
        discipline: 'vfx',
        imageUrl: 'assets/images/giffard-park/EiLEUFFXkAAAxZV.jpg',
        mobilePosition: '20% center',
        mobileFit: 'contain',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'giffard-park-i-s-0yi',
        title: 'Giffard Park',
        category: 'Multi-Unit Residential — 2022',
        service: 'Multi-Unit Residential',
        discipline: 'vfx',
        imageUrl: 'assets/images/giffard-park/EiLEUZFWsAIF0yi.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'avalon-d-8-9-4-gyn1',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/GuZ8So8WAAATDw8.jpg',
        mobilePosition: '85% center',
        projectUrl: 'avalon.html'
      },
      {
        id: 'avalon-d-ct-g-qa-e',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/GdOGAJlXYAEedq8.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'avalon.html'
      },
      {
        id: 'ahero-3a-6-4-7',
        title: 'Ahero',
        category: 'Architectural Visualization & 3D Animation — 2022',
        service: 'Architectural Visualization & 3D Animation',
        discipline: 'vfx',
        imageUrl: 'assets/images/ahero/GVU3aP6W4AA7WUC.jpg',
        mobilePosition: '78% center',
        mobileFit: 'contain',
        projectUrl: 'ahero.html'
      },
      {
        id: 'ahero-9-1k0-0-ev-c',
        title: 'Ahero',
        category: 'Architectural Visualization & 3D Animation — 2022',
        service: 'Architectural Visualization & 3D Animation',
        discipline: 'vfx',
        imageUrl: 'assets/images/ahero/F9YX1k0W0AAevHc.jpg',
        mobilePosition: '30% center',
        mobileFit: 'contain',
        projectUrl: 'ahero.html'
      },
      {
        id: 'ackon-desk-2u-v-q',
        title: 'Ackon Desk',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ackon-desk/GUD2uFJXIAEvHSq.jpg',
        mobilePosition: '30% center',
        mobileFit: 'contain',
        projectUrl: 'ackon-desk.html'
      },
      {
        id: 'ackon-desk-2ug-0-mr',
        title: 'Ackon Desk',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ackon-desk/GUD2ugHW0AAQBmr.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ackon-desk.html'
      },
      {
        id: 'a-a-x-g4i-c-p3d6',
        title: 'A-A',
        category: 'Interior Remodeling — 2023',
        service: 'Interior Remodeling',
        discipline: 'vfx',
        imageUrl: 'assets/images/a-a/GxGGg4iXcAAp3d6.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        desktopPosition: 'center 81.6%',
        projectUrl: 'a-a.html'
      },
      {
        id: '1981-4',
        title: '1981',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/1981/1981-4.jpg',
        mobilePosition: '59% center',
        mobileFit: 'contain',
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
        id: 'glow-in-the-dark',
        title: 'Glow in the Dark',
        category: 'Graphic Design — 2014',
        service: 'Graphic Design',
        discipline: 'graphic',
        imageUrl: 'assets/images/glow-in-the-dark/glow-in-the-dark-1.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
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
        id: 'senya-resort',
        title: 'Senya Resort',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/senya-resort/senya-resort-1-desktop.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        projectUrl: '2gs.html'
      },
      {
        id: 'dela-anyaa',
        title: 'Dela Anyaa',
        category: 'Graphic Design — 2015',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/dela-anyaa/dela-anyaa-8-desktop.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'dela-anyaa.html'
      },
      {
        id: 'npa-reception-renders',
        title: 'NPA',
        category: 'Architectural Visualization & BIM — 2022',
        service: 'Architectural Visualization & BIM',
        discipline: 'vfx',
        imageUrl: 'assets/images/npa/npa-3.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'npa-reception-renders.html'
      },
      {
        id: 'aelius',
        title: 'Aelius Consult Brand System',
        category: 'Graphic Design — 2021',
        service: 'Graphic Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/aelius/aelius-brand.jpg',
        mobilePosition: 'center',
        desktopPosition: 'center 61.5%',
        projectUrl: 'aelius.html'
      },
      {
        id: 'the-tea-house-plate1',
        title: 'The Tea House',
        category: 'Graphic Design, Digital & Web Design — 2021',
        service: 'Graphic Design, Digital & Web Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/tea-house/tea-house-01.png',
        mobilePosition: '24% center',
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
        mobilePosition: '26% center',
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
        mobilePosition: '29% center',
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
        id: 'senya-resort-plate1',
        title: 'Senya Resort',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/senya-resort/senya-resort-3.jpg',
        fit: 'contain',
        mobilePosition: 'center',
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
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'senya-resort.html',
        desc: 'Interior visualizations for a resort scheme designed by Leonie Badger \\u2014 an open-plan living space organised around a floor-to-ceiling wall of stacked timber cubes, African textile panels, rattan pendants and carved masks set along a low white console.',
        specs: {
          client: 'Leonie Badger',
          scope: '3D Visualization',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'3D Visualization\']'
        }
      },      {
        id: 'senya-resort-plate3',
        title: 'Senya Resort',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/senya-resort/senya-resort-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'senya-resort.html',
        desc: 'Interior visualizations for a resort scheme designed by Leonie Badger \\u2014 an open-plan living space organised around a floor-to-ceiling wall of stacked timber cubes, African textile panels, rattan pendants and carved masks set along a low white console.',
        specs: {
          client: 'Leonie Badger',
          scope: '3D Visualization',
          team: 'RDVS Team',
          year: '2018',
          disciplines: '[\'3D Visualization\']'
        }
      },      {
        id: 'senya-resort-plate4',
        title: 'Senya Resort',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/senya-resort/EuMQCBQXYAMNGul.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        projectUrl: 'npa-reception-renders.html',
        desc: 'BIM modelling and architectural visualization for the National Petroleum Authority s open-plan office   five plates of a white, black and grey floorplate carried by one blue brand wall, built around an interior scheme by Newland Interiors.',
        specs: {
          client: 'National Petroleum Authority',
          scope: 'BIM modelling and architectural visualization; interior design by Newland Interiors. Deliverables: 3D renders, measured and working drawings',
          team: 'RDVS Team',
          year: '2022',
          interiorDesign: 'Newland Interiors',
          deliverables: '3D renders, measured and working drawings',
          disciplines: ['BIM', 'Architectural Visualization']
        }
      },
      {
        id: 'npa-reception-renders-plate2',
        title: 'NPA',
        category: 'Architectural Visualization & BIM — 2022',
        service: 'Architectural Visualization & BIM',
        discipline: 'vfx',
        imageUrl: 'assets/images/npa/npa-1.jpg',
        mobilePosition: 'center',
        projectUrl: 'npa-reception-renders.html',
        desc: 'BIM modelling and architectural visualization for the National Petroleum Authority s open-plan office   five plates of a white, black and grey floorplate carried by one blue brand wall, built around an interior scheme by Newland Interiors.',
        specs: {
          client: 'National Petroleum Authority',
          scope: 'BIM modelling and architectural visualization; interior design by Newland Interiors. Deliverables: 3D renders, measured and working drawings',
          team: 'RDVS Team',
          year: '2022',
          interiorDesign: 'Newland Interiors',
          deliverables: '3D renders, measured and working drawings',
          disciplines: ['BIM', 'Architectural Visualization']
        }
      },
      {
        id: 'npa-reception-renders-plate3',
        title: 'NPA',
        category: 'Architectural Visualization & BIM — 2022',
        service: 'Architectural Visualization & BIM',
        discipline: 'vfx',
        imageUrl: 'assets/images/npa/npa-4.jpg',
        mobilePosition: 'center',
        projectUrl: 'npa-reception-renders.html',
        desc: 'BIM modelling and architectural visualization for the National Petroleum Authority s open-plan office   five plates of a white, black and grey floorplate carried by one blue brand wall, built around an interior scheme by Newland Interiors.',
        specs: {
          client: 'National Petroleum Authority',
          scope: 'BIM modelling and architectural visualization; interior design by Newland Interiors. Deliverables: 3D renders, measured and working drawings',
          team: 'RDVS Team',
          year: '2022',
          interiorDesign: 'Newland Interiors',
          deliverables: '3D renders, measured and working drawings',
          disciplines: ['BIM', 'Architectural Visualization']
        }
      },
      {
        id: 'npa-reception-renders-plate4',
        title: 'NPA',
        category: 'Architectural Visualization & BIM — 2022',
        service: 'Architectural Visualization & BIM',
        discipline: 'vfx',
        imageUrl: 'assets/images/npa/npa-5.jpg',
        mobilePosition: 'center',
        projectUrl: 'npa-reception-renders.html',
        desc: 'BIM modelling and architectural visualization for the National Petroleum Authority s open-plan office   five plates of a white, black and grey floorplate carried by one blue brand wall, built around an interior scheme by Newland Interiors.',
        specs: {
          client: 'National Petroleum Authority',
          scope: 'BIM modelling and architectural visualization; interior design by Newland Interiors. Deliverables: 3D renders, measured and working drawings',
          team: 'RDVS Team',
          year: '2022',
          interiorDesign: 'Newland Interiors',
          deliverables: '3D renders, measured and working drawings',
          disciplines: ['BIM', 'Architectural Visualization']
        }
      },      {
        id: 'mtn-hq-plate1',
        title: 'MTN HQ',
        category: 'Graphic Design & 3D Visualization — 2017',
        service: 'Graphic Design & 3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/mtn-hq/mtn-hq-19.jpg',
        mobilePosition: 'center',
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
        mobilePosition: 'center',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '68% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'gh-phot-awards-plate3',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-7.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'gh-phot-awards-plate4',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-8.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'gh-phot-awards-plate5',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-9.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'gh-phot-awards-plate6',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-10.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'gh-phot-awards-plate7',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-11.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'gh-phot-awards-plate8',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-12.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'gh-phot-awards-plate9',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-2.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'gh-phot-awards-plate10',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-3.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'gh-phot-awards-plate11',
        title: 'Gh Photography Awards',
        category: 'Industrial Design, 3D Visualization & Motion Design — 2016',
        service: 'Industrial Design, 3D Visualization & Motion Design',
        discipline: 'vfx',
        imageUrl: 'assets/images/gh-phot-awards/gh-phot-awards-4.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '41% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        id: 'baobab-hotel-exteriors-plate2',
        title: 'Baobab Hotel - Exteriors',
        category: '3D Visualization — 2016',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-2.jpg',
        fit: 'contain',
        mobilePosition: '75% center',
        mobileFit: 'contain',
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
        id: '1981-film-project-plate1',
        title: '1981',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/1981/1981-1.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: '1981.html',
        desc: 'Walkthrough of the retail shop for Accra fashion brand 1981 — white walls, chrome garment frames each hung in front of its own portrait panel, and a black lightbox brand wall at the head of the axis.',
        specs: {
          client: 'Joelle Eyeson / 1981',
          scope: '3D Modelling, Shading & Texturing, Lighting, Rendering & Post-Processing, Film Animation (interior design by Joelle Eyeson)',
          team: 'Modelling: Winfred Atieku, Jude Abbey + Jude Nyoagbe | Texturing + Lighting + Shading: Jude Nyoagbe | Rendering: Jude Nyoagbe | Post Processing: Randy Biney',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      },      {
        id: '1981-plate1',
        title: '1981',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/1981/1981-2.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: '1981.html',
        desc: 'Walkthrough of the retail shop for Accra fashion brand 1981 — white walls, chrome garment frames each hung in front of its own portrait panel, and a black lightbox brand wall at the head of the axis.',
        specs: {
          client: 'Joelle Eyeson / 1981',
          scope: '3D Modelling, Shading & Texturing, Lighting, Rendering & Post-Processing, Film Animation (interior design by Joelle Eyeson)',
          team: 'Modelling: Winfred Atieku, Jude Abbey + Jude Nyoagbe | Texturing + Lighting + Shading: Jude Nyoagbe | Rendering: Jude Nyoagbe | Post Processing: Randy Biney',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      },      {
        id: '1981-plate2',
        title: '1981',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/1981/1981-5.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: '1981.html',
        desc: 'Walkthrough of the retail shop for Accra fashion brand 1981 — white walls, chrome garment frames each hung in front of its own portrait panel, and a black lightbox brand wall at the head of the axis.',
        specs: {
          client: 'Joelle Eyeson / 1981',
          scope: '3D Modelling, Shading & Texturing, Lighting, Rendering & Post-Processing, Film Animation (interior design by Joelle Eyeson)',
          team: 'Modelling: Winfred Atieku, Jude Abbey + Jude Nyoagbe | Texturing + Lighting + Shading: Jude Nyoagbe | Rendering: Jude Nyoagbe | Post Processing: Randy Biney',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      },      {
        id: '1981-plate3',
        title: '1981',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/1981/1981-6.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: '1981.html',
        desc: 'Walkthrough of the retail shop for Accra fashion brand 1981 — white walls, chrome garment frames each hung in front of its own portrait panel, and a black lightbox brand wall at the head of the axis.',
        specs: {
          client: 'Joelle Eyeson / 1981',
          scope: '3D Modelling, Shading & Texturing, Lighting, Rendering & Post-Processing, Film Animation (interior design by Joelle Eyeson)',
          team: 'Modelling: Winfred Atieku, Jude Abbey + Jude Nyoagbe | Texturing + Lighting + Shading: Jude Nyoagbe | Rendering: Jude Nyoagbe | Post Processing: Randy Biney',
          year: '2015',
          disciplines: '[\'3D Visualization\']'
        }
      },      {
        id: '1981-plate4',
        title: '1981',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/1981/1981-3.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
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
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'protea-hotel-airport.html'
      },
      {
        id: 'ahero',
        title: 'Ahero',
        category: 'Architectural Visualization & 3D Animation — 2022',
        service: 'Architectural Visualization & 3D Animation',
        discipline: 'vfx',
        imageUrl: 'assets/images/ahero/F9WX-jyXcAApIqO.jpg',
        mobilePosition: '35% center',
        mobileFit: 'contain',
        projectUrl: 'ahero.html'
      },
      {
        id: 'ahero-plate1',
        title: 'Ahero',
        category: 'Architectural Visualization & 3D Animation — 2022',
        service: 'Architectural Visualization & 3D Animation',
        discipline: 'vfx',
        imageUrl: 'assets/images/ahero/GVU3aRQXAAAw57F.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ahero.html'
      },
      {
        id: 'ahero-plate2',
        title: 'Ahero',
        category: 'Architectural Visualization & 3D Animation — 2022',
        service: 'Architectural Visualization & 3D Animation',
        discipline: 'vfx',
        imageUrl: 'assets/images/ahero/GVU3aYNWwAABrJl.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ahero.html'
      },
      {
        id: 'ahero-plate3',
        title: 'Ahero',
        category: 'Architectural Visualization & 3D Animation — 2022',
        service: 'Architectural Visualization & 3D Animation',
        discipline: 'vfx',
        imageUrl: 'assets/images/ahero/GVU3aYSWkAA9h4b.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ahero.html'
      },
      {
        id: 'giffard-park',
        title: 'Giffard Park',
        category: 'Multi-Unit Residential — 2022',
        service: 'Multi-Unit Residential',
        discipline: 'vfx',
        imageUrl: 'assets/images/giffard-park/Ei4kUxWXYAIh8HL.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'giffard-park-plate1',
        title: 'Giffard Park',
        category: 'Multi-Unit Residential — 2022',
        service: 'Multi-Unit Residential',
        discipline: 'vfx',
        imageUrl: 'assets/images/giffard-park/FgahHx2WAAAX8cJ.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'giffard-park-plate2',
        title: 'Giffard Park',
        category: 'Multi-Unit Residential — 2022',
        service: 'Multi-Unit Residential',
        discipline: 'vfx',
        imageUrl: 'assets/images/giffard-park/Ei4kVs2XgAAA_L1.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'giffard-park-plate3',
        title: 'Giffard Park',
        category: 'Multi-Unit Residential — 2022',
        service: 'Multi-Unit Residential',
        discipline: 'vfx',
        imageUrl: 'assets/images/giffard-park/EiyxydCWkAI4H1P.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'giffard-park-plate4',
        title: 'Giffard Park',
        category: 'Multi-Unit Residential — 2022',
        service: 'Multi-Unit Residential',
        discipline: 'vfx',
        imageUrl: 'assets/images/giffard-park/giffard-park-7.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'giffard-park-plate5',
        title: 'Giffard Park',
        category: 'Multi-Unit Residential — 2022',
        service: 'Multi-Unit Residential',
        discipline: 'vfx',
        imageUrl: 'assets/images/giffard-park/giffard-park-8.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'giffard-park-plate6',
        title: 'Giffard Park',
        category: 'Multi-Unit Residential — 2022',
        service: 'Multi-Unit Residential',
        discipline: 'vfx',
        imageUrl: 'assets/images/giffard-park/giffard-park-9.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'giffard-park.html'
      },
      {
        id: 'hola',
        title: 'Hola',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/hola/F1kFFaMWwAI9r82.jpg',
        mobileFit: 'contain',
        projectUrl: 'hola.html'
      },
      {
        id: 'margin',
        title: 'Margin',
        category: 'Workplace Interiors — 2022',
        service: 'Workplace Interiors',
        discipline: 'vfx',
        imageUrl: 'assets/images/margin/GH1cB5CW4AAQFih.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'margin.html'
      },      {
        id: 'margin-plate1',
        title: 'Margin',
        category: 'Workplace Interiors — 2022',
        service: 'Workplace Interiors',
        discipline: 'vfx',
        imageUrl: 'assets/images/margin/F-XhIIqXMAAGhOa.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'margin.html'
      },      {
        id: 'margin-plate2',
        title: 'Margin',
        category: 'Workplace Interiors — 2022',
        service: 'Workplace Interiors',
        discipline: 'vfx',
        imageUrl: 'assets/images/margin/F-ZKh-aWQAAV90S.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        projectUrl: 'margin.html'
      },
      {
        id: 'the-fitzgerald',
        title: 'The Fitzgerald',
        category: 'Event Space Interiors — 2022',
        service: 'Event Space Interiors',
        discipline: 'vfx',
        imageUrl: 'assets/images/the-fitzgerald/Eud0gaBUYAABir9.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'the-fitzgerald.html'
      },
      {
        id: 'a-a',
        title: 'A-A',
        category: 'Interior Remodeling — 2023',
        service: 'Interior Remodeling',
        discipline: 'vfx',
        imageUrl: 'assets/images/a-a/G09Bw1sWAAATy5h.jpg',
        fit: 'contain',
        mobilePosition: 'center',
        desktopPosition: 'center 90.9%',
        projectUrl: 'a-a.html'
      },
      {
        id: 'ttd',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FsOwki3WcAEJtvW.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate1',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/Fs47RTMWwAA-eEF.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate2',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FsLMJdyX0AIUNuB.jpg',
        mobilePosition: 'center',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate3',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FsToeqxWcAEA8ft.jpg',
        mobilePosition: '36% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate4',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FsaGWWLWABgVwQD.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate5',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FseFF83XsAE3byC.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate6',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FseFG8GXoAE54NP.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate7',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FseFGd0X0AAMMNc.jpg',
        mobilePosition: '64% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate8',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FshZRdsWwAIPdr1.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate9',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FshZS8UXsAArIuW.jpg',
        mobilePosition: '72% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate10',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FshZSMBXwAASFtI.jpg',
        mobilePosition: '74% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate11',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FspUg4aX0AIuCJH.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate12',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/Ft4iPZlWYAEaQWQ.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate13',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/Ft5c57XWwAIKvYV.jpg',
        mobilePosition: '85% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate14',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FtU6ipnWAAAdtts.jpg',
        mobilePosition: 'center',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate15',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FtZCqbqWYAEc3_S.jpg',
        mobilePosition: 'center',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate16',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FtcjLP0WAAUNJRl.jpg',
        mobilePosition: 'center',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate17',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/Ftn-e3YWcAYqRZ9.jpg',
        mobilePosition: 'center',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate18',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FuIPLeNWYAIxRIj.jpg',
        mobilePosition: '66% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate19',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FuIPM-RWIAAms-l.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate20',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FuIPMK6X0AAZtYD.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate21',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FuIPNjxWIAILRM7.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },      {
        id: 'ttd-plate22',
        title: 'TTD',
        category: 'Interior & Architecture — 2023',
        service: 'Interior & Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/ttd/FuLgJKhWAA0jerA.jpg',
        mobilePosition: '15% center',
        mobileFit: 'contain',
        projectUrl: 'ttd.html'
      },
      {
        id: 'avalon',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/Gc8QzsaXkAAQotV.jpg',
        mobilePosition: '62% center',
        mobileFit: 'contain',
        projectUrl: 'avalon.html'
      },
      {
        id: 'avalon-plate1',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/GdOGAzlXQAA03pC.jpg',
        mobilePosition: 'center',
        projectUrl: 'avalon.html'
      },
      {
        id: 'avalon-plate2',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/GdTbJDjWAAAyxys.jpg',
        mobilePosition: 'center',
        projectUrl: 'avalon.html'
      },
      {
        id: 'avalon-plate3',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/GdGKctIWgAAqaDe.jpg',
        mobilePosition: 'center',
        projectUrl: 'avalon.html'
      },
      {
        id: 'avalon-plate4',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/GdI8J9RW4AAgyn1.jpg',
        mobilePosition: 'center',
        projectUrl: 'avalon.html'
      },
      {
        id: 'avalon-plate5',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/GuZ9BhbW8AAjMjv.jpg',
        mobilePosition: 'center',
        projectUrl: 'avalon.html'
      },
      {
        id: 'avalon-plate6',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/GuZ9BkOW8AAFase.jpg',
        mobilePosition: 'center',
        projectUrl: 'avalon.html'
      },
      {
        id: 'avalon-plate7',
        title: 'Avalon',
        category: 'Interior Architecture — 2024',
        service: 'Interior Architecture',
        discipline: 'vfx',
        imageUrl: 'assets/images/avalon/GuZ9Bv1WwAA0pxM.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'avalon.html'
      },
      {
        id: 'ackon-desk',
        title: 'Ackon Desk',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ackon-desk/GUEAQ-MWsAAGT7n.jpg',
        mobilePosition: '28% center',
        mobileFit: 'contain',
        projectUrl: 'ackon-desk.html'
      },
      {
        id: 'ackon-desk-plate1',
        title: 'Ackon Desk',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ackon-desk/GUD2uA9WoAAj5rO.jpg',
        mobilePosition: '30% center',
        mobileFit: 'contain',
        projectUrl: 'ackon-desk.html',
        desc: 'Sculptural solid timber executive desk balancing robust organic joinery with clean architectural silhouettes.',
        specs: {
          client: 'AFK',
          scope: 'Architectural Visualization',
          team: 'AFK x RDVS',
          year: '2022',
          disciplines: ['Architectural Visualization', 'Furniture & Product Design']
        }
      },
      {
        id: 'ackon-desk-plate2',
        title: 'Ackon Desk',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ackon-desk/GUEAQukWQAAoY9G.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
        projectUrl: 'ackon-desk.html',
        desc: 'Sculptural solid timber executive desk balancing robust organic joinery with clean architectural silhouettes.',
        specs: {
          client: 'AFK',
          scope: 'Architectural Visualization',
          team: 'AFK x RDVS',
          year: '2022',
          disciplines: ['Architectural Visualization', 'Furniture & Product Design']
        }
      },
      {
        id: 'ackon-desk-plate3',
        title: 'Ackon Desk',
        category: 'Architectural Visualization — 2022',
        service: 'Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ackon-desk/GUEAQvzWoAEGQaK.jpg',
        mobilePosition: '25% center',
        mobileFit: 'contain',
        projectUrl: 'ackon-desk.html',
        desc: 'Sculptural solid timber executive desk balancing robust organic joinery with clean architectural silhouettes.',
        specs: {
          client: 'AFK',
          scope: 'Architectural Visualization',
          team: 'AFK x RDVS',
          year: '2022',
          disciplines: ['Architectural Visualization', 'Furniture & Product Design']
        }
      },

      {
        id: 'mig',
        title: 'MIG',
        category: 'Modern Indigenous Goods — 2021',
        service: 'Modern Indigenous Goods',
        discipline: 'vfx',
        imageUrl: 'assets/images/mig/mig-1h-2.jpg',
        fit: 'contain',
        mobilePosition: '63% center',
        mobileFit: 'contain',
        projectUrl: 'mig.html'
      },
      {
        id: 'ppa-ghana-competition',
        title: 'PPA Ghana Competition',
        category: 'Interior Design & Architectural Visualization — 2010',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'vfx',
        imageUrl: 'assets/images/ppa-ghana-competition/ppa-ghana-competition-3.png',
        mobilePosition: '22% center',
        mobileFit: 'contain',
        projectUrl: 'ppa-ghana-competition.html',
        desc: 'A 2010 competition entry for the Public Procurement Authority of Ghana: RDVS supplied the interior design and 3D visualization for an eight-plate, twin-wing glazed headquarters designed by Tekton Consult.',
        specs: {
          client: 'Public Procurement Authority (PPA)',
          scope: 'Interior design and 3D visualization of a competition entry: double-height reception, executive office and further reception views, each presented as a competition sheet with a CAD plan inset',
          team: 'Tekton Consult (design); R.D+V.S (interior design and visualization)',
          year: '2010',
          disciplines: ['Interior Design', '3D Visualization']
        }
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
        imageUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/elo-tv/elo-tv-logo-frame.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/ceeander/ceeander-cover.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/caustics-rnd/caustics-rnd-film-frame.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/elo-tv/elo-tv-16.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
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
        mobilePosition: 'center',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
  // Named frames the owner keeps off the homepage are subtracted first
  // (scratch/_slide_pool_exclusions.py; S-AGE plates 3-5, user, 2026-10-25).
  // LINE E FLOAT I answers the standard window instead -- every film, the header and the
  // first two plates (user, 2026-10-29; _slide_frame_window.STANDARD_WINDOW).
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
        imageUrl: 'assets/images/mig/mig-hg-desk-1.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/mig/mig-line-e-float-i-6.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/mig/mig-mound-1.jpg',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '63% center',
        mobileFit: 'contain',
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
        fit: 'contain',
        mobilePosition: 'center',
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
        mobilePosition: '28% center',
        mobileFit: 'contain',
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
        mobilePosition: '28% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '16% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '46% center',
        mobileFit: 'contain',
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
        mobilePosition: '59% center',
        mobileFit: 'contain',
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
        mobilePosition: '71% center',
        mobileFit: 'contain',
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
        imageUrl: 'assets/images/mig/mig-line-e-float-i-11.jpg',
        mobilePosition: '24% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
        mobilePosition: '24% center',
        mobileFit: 'contain',
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
        mobilePosition: '74% center',
        mobileFit: 'contain',
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
        mobilePosition: '65% center',
        mobileFit: 'contain',
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
        mobilePosition: '35% center',
        mobileFit: 'contain',
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
        mobilePosition: 'center',
        mobileFit: 'contain',
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
      imageUrl: 'assets/images/rdvs-intro/rdvs-intro-film-frame-desktop.jpg',
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

  // Generate the remaining slides: one random draw over the works of every service pool —
  // the four disciplines plus the Products page — with no per-category quota. News slides always
  // occupy the tail, so the budget adapts to their count.
  const serviceKeys = ['architecture', 'interiors', 'vfx', 'motion', 'products'];
  // Owner, 2026-11-01: "let's make the number of slides on the home page 20 instead of 15". That restores the
  // size the deck had before his 2026-10-22 order ("reduce the number of slides on the homepage from 20 to 15"),
  // and it is still ONE fact told in four places that have to agree: this constant, the .slide / .caption-card /
  // .pagination-bar blocks baked into index.html, the counter and the three size comments baked there, and
  // scratch/_slide_deck.py -- which PARSES this line instead of repeating the number.
  // `scratch/_deck_size_contract.py` is the guard; `scratch/_grow_deck.py` then `_paint_homepage_deck.py` are
  // the writers for an increase, and `scratch/_cut_deck_to_15.py` is the one for a decrease.
  const TOTAL_SLIDE_BUDGET = 20;

  // Drawn again on every page load, so a refresh — or the automatic reload that fires when
  // the deck reaches its last slide — shows a different cut of the work instead of replaying the
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
  // slideshow running indefinitely on fresh material: the deck plays through its last slide —
  // which since 2026-10-24 is the news article — and only then the page reloads and a new draw
  // starts at slide one. The trigger is the BUDGET, not a number: his 2026-10-22 cut to fifteen moved it to 15,
  // and his 2026-11-01 order back to twenty moves it again. Stated as `TOTAL_SLIDE_BUDGET` below, so the reload
  // can never fire at a slide the deck does not have -- which is what a typed literal did once.
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

  // Owner order, 2026-11-02: "let's not force slideshow on the homepage to serve exact number of slides from
  // all different project categories in one cycle but rather random projects irrespective of the category."
  // So the per-service quotas are gone. Every service pool is merged into ONE pool of works, and a deck is a
  // uniform random draw of distinct works from it -- a cycle can lean on interiors one load and on films the
  // next, exactly as chance falls. The freshness rules the owner asked for on 2026-10-29 still hold, now over
  // the whole pool rather than per service:
  //   1. no work repeats until every work in the pool has been shown (one global round);
  //   2. the previous deck's works are held out even when the round resets, so consecutive decks share none;
  //   3. the ENTRY of a work (its film, a GIF, one of its plates) is re-drawn every cycle.
  // A work pooled under two services is ONE work here, so it is no likelier to show than any other.
  const slideKey = (entry) => entry.projectUrl || entry.id || entry.title;
  const mediaKey = (entry) => entry.videoUrl || entry.imageUrl || entry.id || entry.title;
  const newsKeys = new Set(newsSlides.map(entry => slideKey(entry)));

  const works = new Map();
  serviceKeys.forEach(key => {
    for (const entry of drawOf(key)) {
      const id = slideKey(entry);
      if (newsKeys.has(id)) continue; // a news work never also plays as a project
      if (!works.has(id)) works.set(id, []);
      const group = works.get(id);
      if (!group.some(other => mediaKey(other) === mediaKey(entry))) group.push(entry);
    }
  });
  const workIds = [...works.keys()];

  const DECK_ROTATION_KEY = 'rdvs-deck-rotation-v3';
  const rotation = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem(DECK_ROTATION_KEY) || 'null');
      if (stored && Array.isArray(stored.seen)) {
        return { seen: stored.seen, previous: Array.isArray(stored.previous) ? stored.previous : [] };
      }
    } catch (e) {
      // storage blocked: a plain draw, never a blank deck
    }
    return { seen: [], previous: [] };
  })();
  function saveRotation() {
    try { localStorage.setItem(DECK_ROTATION_KEY, JSON.stringify(rotation)); } catch (e) {}
  }

  // Stale names -- works archived or renamed since they were shown -- are pruned against the pool that exists now.
  const known = list => list.filter(id => works.has(id));
  let round = known(rotation.seen);
  const previousDeck = known(rotation.previous);
  const picks = [];
  const take = (from) => {
    for (const id of shuffled(from)) {
      if (picks.length >= projectSlotBudget) break;
      picks.push(id);
      round.push(id);
    }
  };
  take(workIds.filter(id => !round.includes(id) && !previousDeck.includes(id)));
  if (picks.length < projectSlotBudget) {
    // The round is complete: open a new one with the deck the visitor just watched held at its back.
    round = [...previousDeck, ...picks];
    take(workIds.filter(id => !round.includes(id)));
  }
  if (picks.length < projectSlotBudget) {
    // Backstop only (a pool smaller than two decks): never leave a slot empty.
    take(workIds.filter(id => !picks.includes(id)));
  }

  const drawnProjects = picks.map(id => {
    const group = works.get(id);
    return group[Math.floor(Math.random() * group.length)];
  });

  rotation.seen = round;
  rotation.previous = picks;
  // The draw time is part of the record: a probe (and the visitor's own history) can see that
  // the deck was drawn on this load rather than restored from the last one.
  rotation.at = Date.now();
  // Persist before the deck paints: the next deck -- the automatic reload, or the visitor's
  // next visit -- must start after these works, not replay them.
  saveRotation();

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

  const urlParams = new URLSearchParams(window.location.search);
  const isWalkthrough = urlParams.has('walkthrough');

  const projects = spreadRepeats([...shuffled(drawnProjects), ...newsSlides]);

  if (isWalkthrough) {
    projects.splice(0, projects.length);
    projects.push({
      id: 'dyv-dawn',
      title: 'DYV',
      category: 'Design · VFX + CGI — 2025',
      service: 'Design · VFX + CGI',
      discipline: 'vfx',
      imageUrl: 'assets/images/dyv/dyv-dawn.jpg',
      mobilePosition: '18% center',
      projectUrl: 'dyv.html'
    });
    projects.push({
      id: 'macord-3',
      title: 'Macord International School',
      category: 'Design · VFX + CGI — 2024',
      service: 'Design · VFX + CGI',
      discipline: 'architecture',
      imageUrl: 'assets/images/macord/macord-3.jpg',
      mobilePosition: '92% center',
      desktopPosition: 'center 100%',
      projectUrl: 'macord.html'
    });
    projects.push({
      id: 'avalon',
      title: 'Avalon',
      category: 'Design · VFX + CGI — 2024',
      service: 'Design · VFX + CGI',
      discipline: 'vfx',
      imageUrl: 'assets/images/avalon/GuZ8So8WAAATDw8.jpg',
      mobilePosition: '42% center',
      projectUrl: 'avalon.html'
    });
  }

  // Check URL query or hash call for specific project (e.g. ?project=1957 or #1957)
  try {
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

  // ---- The hero's ink follows the GROUND, and the ground is measured, not assumed ------------------
  // Owner order 2026-11-03: "check the theme for consistency throughout the site to make sure words are
  // readable when themes are changes".  The homepage hero is the one place on the site with TWO grounds
  // under one block of type: the slide is a photograph (a photograph has no theme, so its type is media
  // ink -- white -- in both themes) and the band behind the controls paints --header-bg (a theme surface,
  // so its type has to follow the theme).  Which law a row owes is therefore a question about where its
  // box is, and scratch/_hero_ground_map.cjs answers it per viewport: the band's top edge sits
  // --hero-strip-height pixels above the viewport floor (40 at >=1200, 108 at 641-1199, 113 at <=640),
  // and a row is on the band only when its whole box lies below that edge.
  //
  // Measured 2026-11-03 at 360x740, 480x800, 640x900, 641x900, 820x1180, 1024x768, 1199x800, 1200x800,
  // 1440x900, 1920x1080 and 2560x1440, in both themes, the answer is NOT a function of the breakpoint:
  //   >=1200     the category tops 73.8px above the floor and the counter 69.9 -- on the PICTURE -- while
  //              the links, bars, socials and credit at 24..32.4 sit inside the 40px band;
  //   <=640      the caption cluster is lifted to 207..274.7 -- on the PICTURE -- and the counter, bars,
  //              socials and credit at 32.8..107.1 stay inside the 113px band;
  //   641-1199   BOTH, in different windows: at 1024x768 the category tops at 100.6 and the title at 78.8,
  //              inside the 108px band, and at 641x900 they top at 183.1 and 161.3, above it.
  // That last line is why this is a measurement and not a media query: 641 and 1024 are the same tier and
  // they disagree, because the caption is lifted by a fraction of the viewport while the band is a fixed
  // number of pixels.  Every static list of rows per breakpoint -- which is what css/styles.css had until
  // this pass, and what cost the light theme 1.08:1 on "View project" at 390x844 and 1.28:1 on the title
  // at 1024x768 -- is wrong in at least one window a visitor can actually have.
  //
  // So CSS owns the two ink definitions (the [data-hero-ground] rules at the foot of styles.css) and this
  // loop owns the boundary.  The volume pill is deliberately NOT classified: it paints its own
  // rgba(0, 0, 0, .65) in both themes, so its white glyph is correct wherever the pill happens to sit.
  // The cost is one getBoundingClientRect per row per event, on rows the deck already touches.
  const HERO_GROUND_ROWS = [
    '.caption-card.active .project-category',
    '.caption-card.active .project-title',
    '.caption-card.active .project-links',
    '.hero-viewport .slide-status',
    '.hero-viewport .pagination-bars',
    '.hero-viewport .hero-social-links',
    '.hero-viewport .hero-credit'
  ];

  // Owner, 2026-11-06: the phone contain slide is boxed between the nav bar and the caption block --
  // the base the markup draws -- so the base is where the footer block's top lands, measured here
  // rather than guessed from a breakpoint. The caption's own wrapping can move that line, which is
  // why this rides the same calls that already re-classify the caption's ink.
  function assignMobileContainBase() {
    const foot = document.querySelector('.hero-footer');
    if (!foot) return;
    const base = Math.round(window.innerHeight - foot.getBoundingClientRect().top);
    document.documentElement.style.setProperty('--mobile-contain-base', Math.max(0, base) + 'px');
  }

  // Owner, 2026-11-06: "when we implement wide treatment on a mobile slide or portrait treatment on a
  // desktop slide positioning, let's not add drop shadow from the top or bottom band of the homepage".
  // The scrim's gradient is only ever visible in the top fifth and the bottom third of the window, and
  // on a treatment slide those two zones are the plate's theme ground -- so the gradient reads as a
  // drop shadow laid across both bands. The treatment is live at two disjoint widths (phone contain at
  // <=768 px, portrait contain at >=1024 px), so the flag follows the same two floors rather than the
  // media class alone: the 769-1023 band renders every slide under the cover law and keeps its scrim.
  // The first pass also demanded a real band before lifting the scrim, reasoning that a contain plate
  // running the window's full height has no ground left to shade. The owner overruled that an hour
  // later, naming portrait and square plates: the treatment itself is what the shadow must follow.
  function assignHeroScrim() {
    if (!heroViewport) return;
    const media = document.querySelector('.slide.active .slide-media');
    if (!media) return;
    const treatment = (window.innerWidth <= 768 && media.classList.contains('slide-media-mobile-contain')) ||
      (window.innerWidth >= 1024 && media.classList.contains('slide-media-contain'));
    heroViewport.classList.toggle('is-contain-slide', treatment);
  }

  function assignHeroGrounds() {
    const foot = document.querySelector('.hero-footer-container');
    if (!foot) return;
    assignMobileContainBase();
    // After the base, so the phone plate is measured in the box it will actually occupy.
    assignHeroScrim();
    const strip = parseFloat(getComputedStyle(foot).getPropertyValue('--hero-strip-height')) || 0;
    const bandTop = window.innerHeight - strip;
    // A phone contain slide paints the page's own ground, not a photograph, so every caption row
    // stands on the theme and must wear the theme's ink. Without this the rows above the band stayed
    // on the media ink and, in the light theme, the title went white-on-white.
    const onGround = window.innerWidth <= 768 &&
      !!document.querySelector('.slide.active .slide-media-mobile-contain');
    for (const sel of HERO_GROUND_ROWS) {
      for (const el of document.querySelectorAll(sel)) {
        const box = el.getBoundingClientRect();
        // No box is an inactive caption card: nothing is being read there, and its own rows would be
        // measured at 0x0, which reads as "above the band" and would silently paint them media ink.
        if (!box.width || !box.height) continue;
        el.dataset.heroGround = onGround || box.top >= bandTop - 0.05 ? 'band' : 'media';
      }
    }
  }

  let heroGroundFrame = 0;
  function scheduleHeroGrounds() {
    if (heroGroundFrame) cancelAnimationFrame(heroGroundFrame);
    heroGroundFrame = requestAnimationFrame(() => { heroGroundFrame = 0; assignHeroGrounds(); });
  }
  // The window's HEIGHT moves the band's edge against a caption lifted by a percentage, so a resize --
  // a phone rotating, a desktop address bar sliding away -- re-derives the law rather than a tier list.
  window.addEventListener('resize', scheduleHeroGrounds);
  // ... and so does the caption's own text, because a category line that wraps pushes the title up.
  if (typeof ResizeObserver === 'function') {
    const captionHost = document.querySelector('.caption-wrapper');
    if (captionHost) new ResizeObserver(scheduleHeroGrounds).observe(captionHost);
  }
  // Once here, before the deck starts: the homepage keeps its caption behind the intro veil for 6.9 s, and
  // the law should already be on the rows by the time the veil lifts rather than at the first cut.
  assignHeroGrounds();

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

  // Owner, 2026-11-05: a plate shown whole no longer floats in the middle of the window -- its left
  // edge starts on the caption’s own column, so the caption’s text stands on the plate’s edge exactly
  // as it does on the Margin slide ("the left edge of the image is in line with the text like this and
  // the rest of the image shifts slightly to the right and not dead center"), with the theme ground
  // gathering on the side the plate leaves free. Owner, 2026-11-06: that datum moves one navigation-bar
  // height further left, so the text now stands just inside the plate’s edge. object-position percentages
  // resolve against the plate’s own free space, so the shift is a px term beside 50% and is only written
  // where there is free space to move through: a landscape plate already spans the width. A portrait or
  // square plate joins the datum at its own size as well, which is what BFA’s squares needed: on a window
  // taller than 1400 px they were painted unscaled and centred, so the caption fell inside the image
  // instead of on its edge.
  const HERO_CAPTION_INSET = 330;
  const HERO_CAPTION_MIN = 312; // --hero-caption-min (288) + --grid-margin (24)
  // Owner, 2026-11-06: the portrait plate's left datum is one navigation-bar height left of the
  // caption column -- "the shift to the left for the new portrait position should be the same
  // distance as the height of the navigation background bar". --header-height is 56px.
  const PORTRAIT_DATUM_OFFSET = 56;
  function anchorContainSlide(mediaContainer) {
    mediaContainer.style.removeProperty('--slide-contain-shift');
    if (!mediaContainer.classList.contains('slide-media-contain')) return;
    if (!window.matchMedia('(min-width: 1200px)').matches) return;
    const img = mediaContainer.querySelector('img');
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    const W = mediaContainer.clientWidth;
    const H = mediaContainer.clientHeight;
    const scale = Math.min(1, W / img.naturalWidth, H / img.naturalHeight);
    const paintedW = img.naturalWidth * scale;
    const freeX = W - paintedW;
    if (freeX <= 1) return;
    // A landscape plate that is not held to the window’s height keeps its symmetric bands; only the
    // portrait and square plates the owner’s rule names come off centre here.  The 5% tolerance is what
    // keeps 1H's 1123x1077 and Tower Cascades' 1131x1130 in that group: on a window taller than they are
    // they paint at their own size, and only rounding says they are wider than tall.  It reaches five
    // entries in all -- the two 1H copies of mig-1h-1 and three Tower Cascades near-squares -- and stops
    // well short of the pool's next-widest contained plate at 1.19.
    if (Math.abs(img.naturalHeight * scale - H) > 1 && img.naturalWidth > img.naturalHeight * 1.05) return;
    const column = Math.max(W / 2 - HERO_CAPTION_INSET, HERO_CAPTION_MIN);
    const datum = column - PORTRAIT_DATUM_OFFSET;
    // A plate that reaches past the datum from the left has no room to sit on it without losing
    // its right edge, so it stays centred and keeps its theme ground on both sides.
    if (datum + paintedW > W + 1) return;
    const shift = datum - freeX / 2;
    // Owner, 2026-11-05: "let the anchor pull left on narrow desktops too". The datum is a fixed
    // distance from the left edge while a centred plate's edge is a fixed distance from the centre, so
    // on a narrow window the centred edge lands right of the datum -- 48 of the pool's 67 contained
    // plates at 1366x640 -- and the caption stood in the theme ground instead of on the plate. The
    // datum is never left of HERO_CAPTION_MIN less the bar and the guard above keeps the right edge
    // inside the window, so pulling left cannot push the plate off screen at either end.
    if (Math.abs(shift) > 0.05) mediaContainer.style.setProperty('--slide-contain-shift', shift.toFixed(1) + 'px');
  }

  let containAnchorFrame = 0;
  window.addEventListener('resize', () => {
    if (containAnchorFrame) return;
    containAnchorFrame = requestAnimationFrame(() => {
      containAnchorFrame = 0;
      document.querySelectorAll('.slide-media-contain').forEach(anchorContainSlide);
    });
  });

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
            mediaContainer.classList.remove('slide-media-contain');
            // Owner, 2026-11-06: a film whose frame is too wide to show whole on a phone can ask for
            // the phone contain treatment through `mobileFit`. It is a phone-only class; the desktop
            // branch below stays on cover.
            mediaContainer.classList.toggle('slide-media-mobile-contain', proj.mobileFit === 'contain');
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
              const deskVid = proj.videoUrl;
              const deskPoster = proj.imageUrl || '';
              const rung = filmRendition(proj);
              // Videos take the entry's own `mobilePosition` now, the same way the image branch below already
              // does (owner, 2026-11-03: "...make sure we capture the right half of the video... so
              // don't center this video like the other videos"). Census over the pool as
              // scratch/_slide_deck.py parses it: 26 entries carry a videoUrl, 25 of them say 'center' and
              // only Ahero's says anything else, so wiring the field through moves Ahero and leaves the
              // other 25 films exactly where they are.
              //
              // Ahero's value is the middle of the right half: 84% puts the 390 px window on frame x
              // 62.0%..88.0%, measured by scratch/_ahero_right_half.py through the site's own mapping
              // (and its edge-energy profile puts the film's work at fx=0.772, so the owner's half is
              // where the work already is). The property lands on `.slide-media`, and the phone rule
              // in css/styles.css now reads it for video as well as for a still.
              const mobilePos = proj.mobilePosition || 'center';
              mediaContainer.style.setProperty('--slide-mobile-pos', mobilePos);
              mediaContainer.style.removeProperty('--slide-desktop-pos');

              mediaContainer.innerHTML = rung
                ? `
                <video class="slide-video" src="${rung.video}" poster="${rung.poster}" muted playsinline preload="none"></video>
              `
                : `
                <video class="slide-video" src="${deskVid}" poster="${deskPoster}" muted playsinline preload="none"></video>
              `;
            }

          } else {
            const deskImg = proj.imageUrl;
            const mobilePos = proj.mobilePosition || 'center';
            // Owner, 2026-11-05: the plates that cannot fill the window without cropping or upscaling
            // -- Kuma Residence, 3AAP, Hot Gossip, Margin, Stanchart HQ and Fule -- are shown whole,
            // with the leftover window painted in the page's theme ground. `scale-down` is the one
            // value that never upscales: contain would blow a 978 px study up to the viewport, and
            // cover would crop it.
            const isContain = proj.fit === 'contain';
            mediaContainer.classList.toggle('slide-media-contain', isContain);
            // The phone-only counterpart (owner, 2026-11-06): a wide plate that cover would crop to a
            // sliver is shown whole between the nav and the caption, on the theme ground. Kept off the
            // desktop branch on purpose -- the stylesheet only reads it under 769 px.
            mediaContainer.classList.toggle('slide-media-mobile-contain', proj.mobileFit === 'contain');
            // Contain is a desktop law only, and the owner moved its floor to 1024 px on 2026-11-06:
            // "implement the portrait positioning only on desktops from 1024pixels wide and above. For any
            // screen less than that width ... please have the images fill the whole screen like before".
            // Below 1024 px the stylesheet leaves the cover rule standing, so the slide fills the window;
            // under 769 px it also reads this entry's `mobilePosition`, which is the same anchor a cover
            // slide uses. `containY` is written too, but the stylesheet only applies it above 1023 px.
            mediaContainer.style.setProperty('--slide-mobile-pos', mobilePos);
            // The deck re-draws into the same slide nodes on every rotation, so a slide that does not ask
            // for an anchor must have the previous occupant's cleared rather than left to inherit.
            if (!isContain && proj.desktopPosition) mediaContainer.style.setProperty('--slide-desktop-pos', proj.desktopPosition);
            else mediaContainer.style.removeProperty('--slide-desktop-pos');
            if (isContain && proj.containY) mediaContainer.style.setProperty('--slide-contain-y', proj.containY);
            else mediaContainer.style.removeProperty('--slide-contain-y');
            mediaContainer.innerHTML = `
              <picture class="slide-picture"${idx === 0 ? '' : ' data-defer'}>
                <img ${idx === 0 ? 'src' : 'data-src'}="${deskImg}" alt="${proj.title}" class="slide-img${isContain ? ' slide-img-contain' : ''}" ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
              </picture>
            `;
            anchorContainSlide(mediaContainer);
            const containImg = isContain && mediaContainer.querySelector('img');
            // The pass above can only work once the pixels are decoded, and a still that is not slide 1 is
            // drawn with its URL parked in `data-src` -- an img with no src reports `complete` as true with
            // naturalWidth 0, so keying the retry on `complete` alone means a plate that `lightStill()` lits
            // minutes later never re-anchors and lands dead-centred instead of on the caption column.
            // `naturalWidth` is the honest "decoded yet?" test.
            if (containImg && !(containImg.complete && containImg.naturalWidth)) {
              containImg.addEventListener('load', () => anchorContainSlide(mediaContainer), { once: true });
            }
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
      requestStillWarm();
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
        if (isActive && proj && !proj.is360 && proj.renditions) {
          const rung = filmRendition(proj);
          const targetSrc = rung ? rung.video : proj.videoUrl;
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
    // The active card is the only one with a box, so a cut to a caption of a different height moves
    // every text row in the footer block -- and near the band's edge, moving is re-classifying.
    assignHeroGrounds();

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
    // ... and the rest of the deck keeps draining into the browser cache in the background.
    requestStillWarm();
  }

  window.rdvsGoToSlide = function(idx) {
    updateSlide(idx, false);
  };
  window.rdvsSetProgress = function(idx, pct) {
    if (paginationBars[idx]) {
      const fill = paginationBars[idx].querySelector('.pagination-fill');
      if (fill) fill.style.width = pct + '%';
    }
  };

  function startCurrentSlide() {
    clearSlideTimer();
    if (isWalkthrough) return;

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

  // ---------------------------------------------------------------- whole-deck still preloading
  /**
   * Owner order, 2026-11-05: "Because the images in the slides are large, let's load them in the
   * background the moment a visitor enters the site." Same day, on the pace: "allow two or three in
   * parallel".
   *
   * hydrateStills() keeps the hero to itself and still lights only the two slides ahead, so this is the
   * rest of the deck: every still that is not yet lit, walked in the draw's own order from whichever
   * slide the viewer is on, THREE FILES AT A TIME and at low fetch priority. Three shares the pipe with
   * the hero and the film queue without letting a slow plate hold up the rest. A plate warmed here is
   * painted straight out of the browser cache when the deck reaches it instead of starting to download
   * at the cut. Save-data and 2G never enter the queue, and a file that stalls is dropped after
   * STILL_WARM_CAP_MS so it cannot park the rest.
   */
  const STILL_WARM_PARALLEL = 3;        // background stills allowed in flight at once
  const STILL_WARM_GAP_MS = 150;        // breathing room before the pool refills
  const STILL_WARM_CAP_MS = 30000;      // a stalled file must not park the whole deck
  const warmedStills = new Set();       // urls this page has already pulled into the cache
  const stillWarmInFlight = new Map();  // url -> the background stills currently in flight
  let stillWarmGap = null;
  let stillWarmQueued = false;

  function stillWarmUrl() {
    for (let step = 0; step < totalSlides; step++) {
      const idx = (currentIndex + step) % totalSlides;
      const proj = projects[idx];
      const slide = slides[idx];
      if (!proj || !proj.imageUrl || proj.videoUrl) continue;      // a film owns its own poster
      if (warmedStills.has(proj.imageUrl) || stillWarmInFlight.has(proj.imageUrl)) continue;
      // a picture that no longer carries data-defer is lit or on screen: its bytes are already moving
      if (!slide || !slide.querySelector('picture.slide-picture[data-defer]')) continue;
      return proj.imageUrl;
    }
    return '';
  }

  function warmStill(url) {
    const image = new Image();
    image.decoding = 'async';
    if ('fetchPriority' in image) image.fetchPriority = 'low';
    const item = { url, image };
    stillWarmInFlight.set(url, item);
    let settled = false;
    let cap = null;
    const settle = () => {
      if (settled) return;
      settled = true;
      clearTimeout(cap);
      warmedStills.add(url);
      stillWarmInFlight.delete(url);
      clearTimeout(stillWarmGap);
      stillWarmGap = setTimeout(pumpStills, STILL_WARM_GAP_MS);
    };
    cap = setTimeout(() => {
      image.src = '';                       // releases the pipe; the slide asks again if it is reached
      settle();
    }, STILL_WARM_CAP_MS);
    image.onload = settle;
    image.onerror = settle;
    image.src = url;
  }

  function pumpStills() {
    stillWarmGap = null;
    if (document.hidden || lightDataWanted()) return;
    while (stillWarmInFlight.size < STILL_WARM_PARALLEL) {
      const url = stillWarmUrl();
      if (!url) return;
      warmStill(url);
    }
  }

  function requestStillWarm() {
    if (stillWarmQueued || stillWarmGap || stillWarmInFlight.size) return;
    stillWarmQueued = true;
    const run = () => {
      stillWarmQueued = false;
      stillWarmGap = null;
      pumpStills();
    };
    if (window.requestIdleCallback) window.requestIdleCallback(run, { timeout: 2500 });
    else stillWarmGap = setTimeout(run, 1200);
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
    if (!proj || !proj.videoUrl) return '';
    const rung = filmRendition(proj);
    if (rung) return rung.video;
    return proj.videoUrl;
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
    if (!document.hidden) {
      requestFilmWarm();
      requestStillWarm();
    }
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

    // Owner, 2026-11-06: "Even on touch screen on mobile, hide arrow icons for previous and next slides
    // until user touches the screen. On screen touch, show for 3 seconds and then hide again until another
    // touch." The stylesheet owns the look -- on a coarse pointer the glyphs are 0 opacity unless
    // .hero-step-nav carries `is-revealed` -- and this is the clock. Each touch restarts the three seconds
    // rather than queueing another; the listener sits on the document so a touch anywhere counts, and
    // passive because it never cancels the page's own gestures.
    const stepNav = document.querySelector('.hero-step-nav');
    if (stepNav) {
      let stepNavRevealTimer = 0;
      document.addEventListener('touchstart', () => {
        stepNav.classList.add('is-revealed');
        clearTimeout(stepNavRevealTimer);
        stepNavRevealTimer = setTimeout(() => stepNav.classList.remove('is-revealed'), 3000);
      }, { passive: true });
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
