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
    'EHR', 'RDVS', 'CGI', '3D', 'AI', 'LED', 'FDR', 'US', 'UK', 'CEO', 'UCC', 'GT'
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

  // Master Categorized Studio Project Pools by Discipline
  // 4 Core Disciplines: Architecture, Interior Design, VFX + CGI, Motion Design
  const servicePools = {
  architecture: {
    name: 'Architectural Design',
    videos: [
      {
        id: 'details-film',
        title: 'Details',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'vfx',
        videoUrl: 'assets/videos/d-e-t-a-i-l-s/details-film.mp4',
        videoUrlDesktop: 'assets/videos/d-e-t-a-i-l-s/details-film.mp4',
        videoMobileUrl: 'assets/videos/d-e-t-a-i-l-s/details-film-mobile.mp4',
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
        id: 'funko-ridge',
        title: 'Funko Ridge Residence',
        category: 'Architectural Design & Spatial Design — 2019',
        service: 'Architectural Design & Spatial Design',
        discipline: 'architecture',
        videoUrl: 'assets/videos/funko-ridge/funko-terrace.mp4',
        videoUrlDesktop: 'assets/videos/funko-ridge/funko-terrace.mp4',
        videoMobileUrl: 'assets/videos/funko-ridge/funko-terrace-mobile.mp4',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-1.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-1.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-1-mobile.jpg',
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
        id: '5aap-progress',
        title: '5AAP',
        category: 'Design + Build — 2020',
        service: 'Design + Build',
        discipline: 'architecture',
        videoUrl: 'assets/videos/5aap/5aap-progress-desktop.mp4',
        videoUrlDesktop: 'assets/videos/5aap/5aap-progress-desktop.mp4',
        videoMobileUrl: 'assets/videos/5aap/5aap-progress-mobile.mp4',
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
          disciplines: ['Architectural Design', 'Design & Build']
        }
      }
    ],
    images: [
      {
        id: 'dyv-dawn',
        title: 'DYV',
        category: 'Architectural Design — 2023',
        service: 'Architectural Design',
        discipline: 'architecture',
        imageUrl: 'assets/images/dyv/dyv-street.jpg',
        imageUrlDesktop: 'assets/images/dyv/dyv-street.jpg',
        imageMobileUrl: 'assets/images/dyv/dyv-street.jpg',
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
        imageUrl: 'assets/images/barham/barham-residence.jpg',
        imageUrlDesktop: 'assets/images/barham/barham-residence.jpg',
        imageMobileUrl: 'assets/images/barham/barham-residence-mobile.jpg',
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
        imageUrl: 'assets/images/empire-tower/empire-tower-1.jpg',
        imageUrlDesktop: 'assets/images/empire-tower/empire-tower-1.jpg',
        imageMobileUrl: 'assets/images/empire-tower/empire-tower-1.jpg',
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
      }
    ]
  },

  interiors: {
    name: 'Interior Design',
    videos: [
      {
        id: 'tower-cascades',
        title: 'Tower Cascades',
        category: 'Interior Design & Architectural Visualization — 2017',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        videoUrl: 'assets/videos/tower-cascades/tower-cascades.mp4',
        videoUrlDesktop: 'assets/videos/tower-cascades/tower-cascades.mp4',
        videoMobileUrl: 'assets/videos/tower-cascades/tower-cascades-mobile.mp4',
        imageUrl: 'assets/images/cascades/tower-cascades-hero.jpg',
        imageUrlDesktop: 'assets/images/cascades/tower-cascades-hero.jpg',
        imageMobileUrl: 'assets/images/cascades/tower-cascades-1.jpg',
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
      {
        id: 'advantage-place',
        title: 'Advantage Place',
        category: '3D Visualization — 2015',
        service: '3D Visualization',
        discipline: 'interiors',
        videoUrl: 'assets/videos/advantage-place/advantage-place-anim.mp4',
        videoUrlDesktop: 'assets/videos/advantage-place/advantage-place-anim.mp4',
        videoMobileUrl: 'assets/videos/advantage-place/advantage-place-anim-mobile.mp4',
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
      }
    ],
    images: [
      {
        id: 'csm',
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
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'hamlet-estate',
        title: 'The Hamlet',
        category: '3D Visualization — 2018',
        service: '3D Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/hamlet/hamlet-estate-desktop.jpg',
        imageUrlDesktop: 'assets/images/hamlet/hamlet-estate-desktop.jpg',
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
        imageUrl: 'assets/images/afg/afg-1.jpg',
        imageUrlDesktop: 'assets/images/afg/afg-hero.jpg',
        imageMobileUrl: 'assets/images/afg/afg-4.jpg',
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
        imageUrl: 'assets/images/la-beach-towers/la-beach-towers-1.jpg',
        imageUrlDesktop: 'assets/images/la-beach-towers/la-beach-towers-1.jpg',
        imageMobileUrl: 'assets/images/la-beach-towers/la-beach-towers-1.jpg',
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
        imageUrl: 'assets/images/cantonments/west-cantonments-hero.jpg',
        imageUrlDesktop: 'assets/images/cantonments/west-cantonments-hero.jpg',
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
        imageUrl: 'assets/images/abl-reception/abl-reception-desktop.jpg',
        imageUrlDesktop: 'assets/images/abl-reception/abl-reception-desktop.jpg',
        imageMobileUrl: 'assets/images/abl-reception/abl-reception-mobile.jpg',
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
        imageUrl: 'assets/images/c25/c25-1-desktop.jpg',
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
        imageUrl: 'assets/images/aggregate/villa-aggregate-hero.jpg',
        imageUrlDesktop: 'assets/images/aggregate/villa-aggregate-hero.jpg',
        imageMobileUrl: 'assets/images/aggregate/villa-aggregate-8.jpg',
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
        category: 'Interior Design & Architectural Visualization — 2010',
        service: 'Interior Design & Architectural Visualization',
        discipline: 'interiors',
        imageUrl: 'assets/images/nyla-court/nyla-court-exterior-01.jpg',
        imageUrlDesktop: 'assets/images/nyla-court/nyla-court-exterior-01.jpg',
        imageMobileUrl: 'assets/images/nyla-court/nyla-court-exterior-01.jpg',
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
        imageUrl: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-3.jpg',
        imageUrlDesktop: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-3.jpg',
        imageMobileUrl: 'assets/images/asante-interior-design-presentation/asante-interior-design-presentation-3.jpg',
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
        imageUrl: 'assets/images/1981/1981-6.jpg',
        imageUrlDesktop: 'assets/images/1981/1981-6.jpg',
        imageMobileUrl: 'assets/images/1981/1981-6-mobile.jpg',
        videoUrl: 'assets/videos/1981/1981-film.mp4',
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
        imageUrl: 'assets/images/beautiful-choices/beautiful-choices-1.jpg',
        imageUrlDesktop: 'assets/images/beautiful-choices/beautiful-choices-1.jpg',
        imageMobileUrl: 'assets/images/beautiful-choices/beautiful-choices-1-mobile.jpg',
        videoUrl: 'assets/videos/beautiful-choices/beautiful-choices-anim.mp4',
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
      }
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
        imageMobileUrl: 'assets/images/campions-renderings/campions-renderings-01-mobile.jpg',
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
        imageUrl: 'assets/images/chocolate/chocolate-15-desktop.jpg',
        imageUrlDesktop: 'assets/images/chocolate/chocolate-15-desktop.jpg',
        imageMobileUrl: 'assets/images/chocolate/chocolate-15-mobile.jpg',
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
        imageMobileUrl: 'assets/images/stark-glaube/stark-glaube-2-mobile.jpg',
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
        imageMobileUrl: 'assets/images/stephen-yvonne/stephen-yvonne-1-mobile.jpg',
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
        imageMobileUrl: 'assets/images/ghana-bbq-beer-festival/ghana-bbq-beer-festival-mobile.jpg',
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
        imageUrl: 'assets/images/haustalks/haustalks-1.jpg',
        imageUrlDesktop: 'assets/images/haustalks/haustalks-1.jpg',
        imageMobileUrl: 'assets/images/haustalks/haustalks-mobile.jpg',
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
        imageUrl: 'assets/images/yao-yaa/yao-yaa-1.jpg',
        imageUrlDesktop: 'assets/images/yao-yaa/yao-yaa-1.jpg',
        imageMobileUrl: 'assets/images/yao-yaa/yao-yaa-1-mobile.jpg',
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
        imageUrl: 'assets/images/ameyaw-sarah/ameyaw-sarah-1.jpg',
        imageUrlDesktop: 'assets/images/ameyaw-sarah/ameyaw-sarah-1.jpg',
        imageMobileUrl: 'assets/images/ameyaw-sarah/ameyaw-sarah-1-mobile.jpg',
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
        imageUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-1.jpg',
        imageUrlDesktop: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-1.jpg',
        imageMobileUrl: 'assets/images/baobab-hotel-exteriors/baobab-hotel-exteriors-1-mobile.jpg',
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
        imageUrl: 'assets/images/senya-resort/senya-resort-1.jpg',
        imageUrlDesktop: 'assets/images/senya-resort/senya-resort-1.jpg',
        imageMobileUrl: 'assets/images/senya-resort/senya-resort-1-mobile.jpg',
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
        imageUrl: 'assets/images/marble-bath/marble-bath-2-desktop.jpg',
        imageUrlDesktop: 'assets/images/marble-bath/marble-bath-2-desktop.jpg',
        imageMobileUrl: 'assets/images/marble-bath/marble-bath-2-desktop.jpg',
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
        imageUrl: 'assets/images/airport-hills-residence/airport-hills-residence-1.jpg',
        imageUrlDesktop: 'assets/images/airport-hills-residence/airport-hills-residence-1.jpg',
        imageMobileUrl: 'assets/images/airport-hills-residence/airport-hills-residence-1.jpg',
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
        imageUrl: 'assets/images/ceeander/ceeander-desktop.jpg',
        imageUrlDesktop: 'assets/images/ceeander/ceeander-desktop.jpg',
        imageMobileUrl: 'assets/images/ceeander/ceeander-mobile.jpg',
        videoUrl: 'assets/videos/ceeander/ceeander-motion.mp4',
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
        imageUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        imageUrlDesktop: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        imageMobileUrl: 'assets/images/trumpet-africa-ident/trumpet-africa-sunset-01.png',
        videoUrl: 'assets/videos/trumpet-africa-ident/trumpet-africa.mp4',
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
        id: 'hfc-tvc-motion',
        title: 'HFC TVC',
        category: 'Visual Effects (VFX) & Motion Design — 2016',
        service: 'Visual Effects (VFX) & Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
        imageUrlDesktop: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
        imageMobileUrl: 'assets/images/hfc-tvc/hfc-tvc-1-mobile.jpg',
        videoUrl: 'assets/videos/hfc-tvc/hfc-commercial.mp4',
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
      {
        id: 'moty-intro-motion',
        title: 'MOTY',
        category: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization — 2016',
        service: 'Interior Design, Furniture Design, Graphic Design & Architectural Visualization',
        discipline: 'motion',
        imageUrl: 'assets/images/moty/moty-1.jpg',
        imageUrlDesktop: 'assets/images/moty/moty-1.jpg',
        imageMobileUrl: 'assets/images/moty/moty-1.jpg',
        videoUrl: 'assets/videos/moty/moty-intro.mp4',
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
        imageUrl: 'assets/images/viasat1-breakfast-show/viasat1-breakfast-show-1.jpg',
        imageUrlDesktop: 'assets/images/viasat1-breakfast-show/viasat1-breakfast-show-1.jpg',
        imageMobileUrl: 'assets/images/viasat1-breakfast-show/viasat1-breakfast-show-1.jpg',
        videoUrl: 'assets/videos/viasat1-breakfast-show/viasat1-titles.mp4',
        videoMobileUrl: 'assets/videos/viasat1-breakfast-show/viasat1-titles-mobile.mp4',
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
      }
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
        imageMobileUrl: 'assets/images/emerge-ident/emerge-ident-mobile.jpg',
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
      }
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

  // Generate the remaining slides: a fresh random draw from each of the 4 service pools,
  // distributed equally. News slides always occupy the front, so the budget adapts
  // to their count.
  const serviceKeys = ['architecture', 'interiors', 'vfx', 'motion'];
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

  // A project can appear in more than one pool (a film in motion, its stills in vfx), so
  // each work is claimed once — by the first service that draws it — and the rest of the
  // deck moves up. A work already shown as a news slide is claimed up front for the same
  // reason.
  const slideKey = (entry) => entry.projectUrl || entry.id || entry.title;
  const claimed = new Set(newsSlides.map(slideKey));
  const drawnProjects = [];

  serviceKeys.forEach(key => {
    // Distribute any remainder across the first services
    const quota = basePerService + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;

    let taken = 0;
    for (const entry of drawOf(key)) {
      if (taken >= quota) break;
      const id = slideKey(entry);
      if (claimed.has(id)) continue;
      claimed.add(id);
      drawnProjects.push(entry);
      taken++;
    }
  });

  // Top-up from any pool if a draw underfilled (never exceed the total budget)
  if (newsSlides.length + drawnProjects.length < TOTAL_SLIDE_BUDGET) {
    for (const key of serviceKeys) {
      for (const entry of drawOf(key)) {
        if (newsSlides.length + drawnProjects.length >= TOTAL_SLIDE_BUDGET) break;
        if (claimed.has(slideKey(entry))) continue;
        claimed.add(slideKey(entry));
        drawnProjects.push(entry);
      }
      if (newsSlides.length + drawnProjects.length >= TOTAL_SLIDE_BUDGET) break;
    }
  }

  // News items always run first; the works behind them play in random order.
  const projects = [...newsSlides, ...shuffled(drawnProjects)];

  // Check URL query or hash call for specific project (e.g. ?project=1957 or #1957)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedProject = urlParams.get('project') || urlParams.get('slide') || window.location.hash.replace('#', '');
    if (requestedProject) {
      const norm = requestedProject.toLowerCase().trim();
      let matchedProj = null;
      for (const key of serviceKeys) {
        const allInPool = [...(servicePools[key].videos || []), ...(servicePools[key].images || [])];
        matchedProj = allInPool.find(p => 
          (p.id && p.id.toLowerCase().includes(norm)) || 
          (p.title && p.title.toLowerCase().includes(norm)) ||
          (p.projectUrl && p.projectUrl.toLowerCase().includes(norm))
        );
        if (matchedProj) break;
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

  // Dynamically populate randomized slides into the DOM
  function populateRandomizedSlides() {
    const isMobileViewport = window.innerWidth <= 768 || window.matchMedia('(max-width: 768px)').matches;

    projects.forEach((proj, idx) => {
      // 1. Update photographic or cinematic video slide (dual mobile portrait & desktop widescreen)
      if (slides[idx]) {
        slides[idx].setAttribute('aria-label', proj.title);
        const mediaContainer = slides[idx].querySelector('.slide-media');
        if (mediaContainer) {
          // Force aerial header for 1957 Apartments and Retail anytime there is a call for it
          const is1957 = (proj.id && (proj.id.includes('1957') || proj.id === '1957-apartments-retail')) || 
                         (proj.title && proj.title.includes('1957')) ||
                         (proj.projectUrl && proj.projectUrl.includes('1957'));

          if (is1957) {
            const deskImg = 'assets/images/1957/1957-12-desktop.jpg';
            const mobImg = 'assets/images/1957/1957-12-mobile.jpg';

            mediaContainer.innerHTML = `
              <picture class="slide-picture">
                <source media="(max-width: 768px)" srcset="${mobImg}">
                <img src="${deskImg}" alt="${proj.title}" class="slide-img" ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
              </picture>
            `;
          } else if (proj.videoUrl) {
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
          const serviceName = proj.service || (proj.category ? proj.category.split('—')[0].trim() : '');
          const yr = proj.category && proj.category.includes('—') ? proj.category.split('—')[1].trim() : '2026';
          catEl.innerHTML = `<span class="service-name">${formatServiceOrTitle(serviceName)}</span> &mdash; ${yr}`;
        }
        if (titleEl) titleEl.textContent = proj.title;
        if (actionLink) {
          actionLink.href = proj.projectUrl || 'work.html';
          actionLink.innerHTML = proj.discipline === 'news' ? 'Read article &rarr;' : 'View project &rarr;';
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
    // 2. Service + year mirrored from the page meta line
    if (info.service || info.year) {
      if (info.service) proj.service = info.service;
      if (info.year && proj.specs) proj.specs.year = info.year;

      const existingYear = proj.category && proj.category.includes('—') ? proj.category.split('—')[1].trim() : '';
      const yr = info.year || existingYear || '2026';
      proj.category = `${proj.service || ''} — ${yr}`;

      if (captionCards[idx]) {
        const catEl = captionCards[idx].querySelector('.project-category');
        if (catEl) {
          catEl.innerHTML = `<span class="service-name">${formatServiceOrTitle(proj.service)}</span> &mdash; ${yr}`;
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
