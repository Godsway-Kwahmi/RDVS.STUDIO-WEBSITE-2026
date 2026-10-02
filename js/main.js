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
  // 4 Core Disciplines: Architecture, Interior Design, Visual Effects (VFX) & CGI, Motion Design
  const servicePools = {
  architecture: {
    name: 'Architecture',
    videos: [
      {
        id: 'tower-cascades',
        title: 'Tower Cascades',
        category: 'Architecture — 2025',
        service: 'Architecture',
        discipline: 'architecture',
        videoUrl: 'assets/videos/tower-cascades/tower-cascades.mp4',
        videoUrlDesktop: 'assets/videos/tower-cascades/tower-cascades.mp4',
        videoMobileUrl: 'assets/videos/tower-cascades/tower-cascades-mobile.mp4',
        imageUrl: 'assets/images/cascades/tower-cascades-night-desktop.jpg',
        imageUrlDesktop: 'assets/images/cascades/tower-cascades-night-desktop.jpg',
        imageMobileUrl: 'assets/images/cascades/tower-cascades-night-mobile.jpg',
        projectUrl: 'tower-cascades.html',
        desc: 'A landmark high-density vertical architecture project integrating tiered garden cascades, environmental shading, and monolithic concrete expressions.',
        specs: {
          client: 'Cascades Development Group',
          scope: 'Architectural Design, Facade Engineering & 3D Simulation',
          team: 'Godsway Kwahmi, Lead Architectural Team',
          area: '32,000 sq.m',
          year: '2025',
          disciplines: ['Architecture', 'Facade Engineering', 'Cinematic 3D Simulation']
        }
      },
      {
        id: 'details-film',
        title: 'Details',
        category: 'Architecture — 2024',
        service: 'Architecture',
        discipline: 'architecture',
        videoUrl: 'assets/videos/d-e-t-a-i-l-s/details-film.mp4',
        videoUrlDesktop: 'assets/videos/d-e-t-a-i-l-s/details-film.mp4',
        videoMobileUrl: 'assets/videos/d-e-t-a-i-l-s/details-film-mobile.mp4',
        imageUrl: 'assets/images/hamlet/hamlet-estate-desktop.jpg',
        imageUrlDesktop: 'assets/images/hamlet/hamlet-estate-desktop.jpg',
        imageMobileUrl: 'assets/images/hamlet/hamlet-estate-mobile.jpg',
        projectUrl: 'd-e-t-a-i-l-s.html',
        desc: 'A visual celebration of tactile material joints, shadow reveals, stone junctions, and precision architectural craftsmanship.',
        specs: {
          client: 'RDVS Studio Gallery',
          scope: 'Architectural Simulation & Photoreal Film',
          team: 'Godsway Kwahmi, RDVS Cinematic Unit',
          area: 'Exhibition',
          year: '2024',
          disciplines: ['Architecture', 'Visual Effects (VFX) & CGI']
        }
      },
      {
        id: 'funko-ridge',
        title: 'Funko Ridge Residence',
        category: 'Architecture — 2019',
        service: 'Architecture',
        discipline: 'architecture',
        videoUrl: 'assets/videos/funko-ridge/funko-terrace.mp4',
        videoUrlDesktop: 'assets/videos/funko-ridge/funko-terrace.mp4',
        videoMobileUrl: 'assets/videos/funko-ridge/funko-terrace-mobile.mp4',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/funko-ridge/funko-ridge-1-desktop.jpg',
        imageMobileUrl: 'assets/images/funko-ridge/funko-ridge-1-mobile.jpg',
        projectUrl: 'funko-ridge.html',
        desc: 'Terraced hillside residential enclave contoured to natural topographic gradients, minimizing site impact and optimizing panoramic ocean views.',
        specs: {
          client: 'Ridge Estates Ltd',
          scope: 'Topographic Masterplanning & Architectural Simulation',
          team: 'Godsway Kwahmi, RDVS Masterplanning',
          area: '45,000 sq.m',
          year: '2019',
          disciplines: ['Masterplanning', 'Environmental Architecture', '3D Simulation']
        }
      },
      {
        id: '5aap-progress',
        title: '5AAP',
        category: 'Architecture — 2024',
        service: 'Architecture',
        discipline: 'architecture',
        videoUrl: 'assets/videos/5aap/5aap-progress-desktop.mp4',
        videoUrlDesktop: 'assets/videos/5aap/5aap-progress-desktop.mp4',
        videoMobileUrl: 'assets/videos/5aap/5aap-progress-mobile.mp4',
        imageUrl: 'assets/images/5aap/5aap-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/5aap/5aap-1-desktop.jpg',
        imageMobileUrl: 'assets/images/5aap/5aap-1-mobile.jpg',
        projectUrl: '5aap.html',
        desc: 'Progressive corporate and commercial campus balancing monumental civic presence with human-scale pedestrian plazas and natural daylight voids.',
        specs: {
          client: '5AAP Holdings',
          scope: 'Architectural Design & Structural Visualization',
          team: 'Godsway Kwahmi, RDVS Architecture',
          area: '18,500 sq.m',
          year: '2024',
          disciplines: ['Architecture', 'Structural Design', 'CGI Visualization']
        }
      }
    ],
    images: [
      {
        id: 'dyv-dawn',
        title: 'DYV Mixed-Use Development',
        category: 'Architecture — 2025',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/dyv/dyv-street-wide.jpg',
        imageUrlDesktop: 'assets/images/dyv/dyv-street-wide.jpg',
        imageMobileUrl: 'assets/images/dyv/dyv-dawn-mobile.jpg',
        projectUrl: 'dyv.html',
        desc: 'An iconic multi-tiered mixed-use urban gateway designed to maximize natural airflow, communal terrace courtyards, and sustainable coastal resilience.',
        specs: {
          client: 'DYV Holdings',
          scope: 'Urban Planning, Facade Engineering & 3D Cinematic Renderings',
          team: 'Godsway Kwahmi, RDVS Urban Studio',
          area: '24,000 sq.m',
          year: '2025',
          disciplines: ['Urban Planning', 'Facade Design', '3D Environmental Rendering']
        }
      },
      {
        id: 'barham-residence',
        title: '41 Barham Luxury Residence',
        category: 'Architecture — 2025',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/barham/barham-residence-desktop.jpg',
        imageUrlDesktop: 'assets/images/barham/barham-residence-desktop.jpg',
        imageMobileUrl: 'assets/images/barham/barham-residence-mobile.jpg',
        projectUrl: 'barham.html',
        desc: 'A minimalist architectural volume embracing high-contrast warm materiality, double-height ceiling voids, and seamless indoor-outdoor courtyards.',
        specs: {
          client: 'Barham Group',
          scope: 'Architectural Design, Interior Styling & Execution',
          team: 'Godsway Kwahmi, RDVS Architecture',
          area: '1,100 sq.m',
          year: '2025',
          disciplines: ['Architectural Design', 'Interior Design', 'Lighting Engineering']
        }
      },
      {
        id: 'frontier-filling-station',
        title: 'Frontier Filling Station',
        category: 'Architecture — 2016',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/frontier-filling-station/frontier-filling-station-1.jpg',
        imageUrlDesktop: 'assets/images/frontier-filling-station/frontier-filling-station-1.jpg',
        imageMobileUrl: 'assets/images/frontier-filling-station/frontier-filling-station-1.jpg',
        projectUrl: 'frontier-filling-station.html',
        desc: 'A 2016 multidisciplinary commission spanning architecture, industrial design, and 3D visualization for the Frontier Filling Station.',
        specs: {
          client: 'Private Client',
          scope: 'Architecture, Industrial Design & 3D Visualization',
          team: 'RDVS Team',
          area: 'Roadside Fueling Station',
          year: '2016',
          disciplines: ['Architecture', 'Industrial Design', '3D Visualization']
        }
      },
      {
        id: 'poconos-bar-grill',
        title: 'Poconos Bar + Grill',
        category: 'Architecture — 2017',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-1.jpg',
        imageUrlDesktop: 'assets/images/poconos-bar-grill/poconos-bar-grill-1.jpg',
        imageMobileUrl: 'assets/images/poconos-bar-grill/poconos-bar-grill-1.jpg',
        projectUrl: 'poconos-bar-grill.html',
        desc: 'A 2017 multidisciplinary commission spanning architecture, landscape design, interior design, and 3D visualization for Poconos Bar + Grill.',
        specs: {
          client: 'Private Client',
          scope: 'Architecture, Landscape Design, Interior Design & 3D Visualization',
          team: 'RDVS Team',
          area: 'Bar + Grill Venue',
          year: '2017',
          disciplines: ['Architecture', 'Landscape Design', 'Interior Design', '3D Visualization']
        }
      },
      {
        id: 'purc-complex',
        title: 'PURC Institutional Complex',
        category: 'Architecture — 2023',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/purc/purc-facade-desktop.jpg',
        imageUrlDesktop: 'assets/images/purc/purc-facade-desktop.jpg',
        imageMobileUrl: 'assets/images/purc/purc-facade-mobile.jpg',
        projectUrl: 'purc.html',
        desc: 'Monolithic civic architecture combining deep louvered facades, robust masonry massing, and monumental public entry porticos.',
        specs: {
          client: 'Public Utilities Regulatory Commission',
          scope: 'Architectural Design, Site Engineering & Construction Oversight',
          team: 'Godsway Kwahmi, RDVS Institutional Group',
          area: '3,200 sq.m',
          year: '2023',
          disciplines: ['Civic Architecture', 'Structural Engineering', 'General Construction']
        }
      },
      {
        id: 'airport-city',
        title: 'Airport City',
        category: 'Architecture — 2024',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/airport-city/airport-city-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/airport-city/airport-city-1-desktop.jpg',
        imageMobileUrl: 'assets/images/airport-city/airport-city-1-mobile.jpg',
        projectUrl: 'airport-city.html',
        desc: 'A dynamic masterplanned business gateway combining high-performance sustainable glazing with expansive communal arrival piazzas.',
        specs: {
          client: 'Airport City Development',
          scope: 'Commercial Architecture & Masterplanning',
          team: 'Godsway Kwahmi, RDVS Masterplanning',
          area: '28,000 sq.m',
          year: '2024',
          disciplines: ['Architecture', 'Urban Masterplanning', 'CGI Visualization']
        }
      },
      {
        id: 'adentan-townhouses',
        title: 'Adentan Townhouses',
        category: 'Architecture — 2024',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/adentan-townhouses/adentan-townhouses-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/adentan-townhouses/adentan-townhouses-1-desktop.jpg',
        imageMobileUrl: 'assets/images/adentan-townhouses/adentan-townhouses-1-mobile.jpg',
        projectUrl: 'adentan-townhouses.html',
        desc: 'Modular residential community balancing privacy with shared landscape courtyards and climate-responsive natural ventilation.',
        specs: {
          client: 'Adentan Residential Group',
          scope: 'Residential Architecture & Site Planning',
          team: 'Godsway Kwahmi, Residential Unit',
          area: '4,800 sq.m',
          year: '2024',
          disciplines: ['Residential Architecture', 'Landscape Integration']
        }
      },
      {
        id: '1hive',
        title: '1Hive',
        category: 'Architecture — 2016',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/1hive/1hive-1.jpg',
        imageUrlDesktop: 'assets/images/1hive/1hive-1.jpg',
        imageMobileUrl: 'assets/images/1hive/1hive-1.jpg',
        projectUrl: '1hive.html',
        desc: 'A 2016 multidisciplinary commission spanning architecture, interior design, and 3D visualization for 1Hive.',
        specs: {
          client: 'Private Client',
          scope: 'Architecture, Interior Design & 3D Visualization',
          team: 'RDVS Team',
          area: 'Private Residence',
          year: '2016',
          disciplines: ['Architecture', 'Interior Design', '3D Visualization']
        }
      }
    ]
  },

  interiors: {
    name: 'Interior Design',
    videos: [
      {
        id: 'csm-interiors-film',
        title: 'CSM Executive Suites',
        category: 'Interior Design — 2024',
        service: 'Interior Design',
        discipline: 'interiors',
        videoUrl: 'assets/videos/csm-interiors/csm-interiors.mp4',
        videoUrlDesktop: 'assets/videos/csm-interiors/csm-interiors.mp4',
        videoMobileUrl: 'assets/videos/csm-interiors/csm-interiors-mobile.mp4',
        imageUrl: 'assets/images/margin/margin-bank-desktop.jpg',
        imageUrlDesktop: 'assets/images/margin/margin-bank-desktop.jpg',
        imageMobileUrl: 'assets/images/margin/margin-bank-mobile.jpg',
        projectUrl: 'work.html',
        desc: 'An immersive cinematic walkthrough detailing warm minimalist executive environments, concealed cove lighting, and acoustic millwork.',
        specs: {
          client: 'CSM Group',
          scope: 'Commercial Interior Design & 3D Walkthrough Film',
          team: 'Godsway Kwahmi, RDVS Interior Architecture',
          area: '480 sq.m',
          year: '2024',
          disciplines: ['Interior Design', 'Workplace Strategy', 'CGI Visualization']
        }
      },
      {
        id: 'advantage-place',
        title: 'Advantage Place',
        category: 'Interior Design — 2015',
        service: 'Interior Design',
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
          area: 'Commercial Development',
          year: '2015',
          disciplines: ['Interior Design', '3D Visualization', 'Modeling & Rendering']
        }
      }
    ],
    images: [
      {
        id: 'hamlet-estate',
        title: 'The Hamlet',
        category: 'Interior Design — 2018',
        service: 'Interior Design',
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
          area: '20 Residences',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization', 'Modeling & Rendering']
        }
      },
      {
        id: '1957-apartments-retail',
        title: '1957 Apartments and Retail',
        category: 'Interior Design — 2019',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/1957/1957-12-desktop.jpg',
        imageUrlDesktop: 'assets/images/1957/1957-12-desktop.jpg',
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
        id: 'afg-hq',
        title: 'AFG Headquarters',
        category: 'Interior Design — 2024',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/afg/afg-headquarters-desktop.jpg',
        imageUrlDesktop: 'assets/images/afg/afg-headquarters-desktop.jpg',
        imageMobileUrl: 'assets/images/afg/afg-headquarters-mobile.jpg',
        projectUrl: 'afg.html',
        desc: 'A sculptured corporate reception and executive suite featuring bespoke faceted acoustics, continuous glass partitioning, and turnkey timber fabrication.',
        specs: {
          client: 'AFG Corporation',
          scope: 'Spatial Architecture, Interior Design & Turnkey Build',
          team: 'Godsway Kwahmi, RDVS Workplace Studio',
          area: '1,450 sq.m',
          year: '2024',
          disciplines: ['Interior Design', 'Spatial Branding', 'Acoustic Engineering', 'General Construction']
        }
      },
      {
        id: 'hubtel-executive',
        title: 'Hubtel',
        category: 'Interior Design — 2023',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/hubtel/hubtel-executive-desktop.jpg',
        imageUrlDesktop: 'assets/images/hubtel/hubtel-executive-desktop.jpg',
        imageMobileUrl: 'assets/images/hubtel/hubtel-executive-mobile.jpg',
        projectUrl: 'hubtel.html',
        desc: 'An immersive technological executive sanctum pairing seamless acoustic wall paneling with custom-milled monolithic conference furnishings.',
        specs: {
          client: 'Hubtel Technologies',
          scope: 'Workplace Architecture, Custom Furniture & Millwork Build',
          team: 'Godsway Kwahmi, RDVS Enterprise Interiors',
          area: '620 sq.m',
          year: '2023',
          disciplines: ['Corporate Workplace', 'Industrial & Furniture Design', 'Smart AV Integration', 'Construction']
        }
      },
      {
        id: 'la-beach-towers',
        title: 'La Beach Towers',
        category: 'Interior Design — 2013',
        service: 'Interior Design',
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
          area: 'Seaside Development',
          year: '2013',
          disciplines: ['Interior Design', '3D Visualization', 'Modeling & Rendering']
        }
      },
      {
        id: 'west-cantonments-residence',
        title: 'West Cantonments Residence',
        category: 'Interior Design — 2018',
        service: 'Interior Design',
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
          area: 'Amenity Interiors',
          year: '2018',
          disciplines: ['Interior Design', '3D Visualization', 'Modeling & Rendering']
        }
      },
      {
        id: 'mtn-corridor',
        title: 'MTN Headquarters Executive Wing',
        category: 'Interior Design — 2024',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/mtn/mtn-corridor-desktop.jpg',
        imageUrlDesktop: 'assets/images/mtn/mtn-corridor-desktop.jpg',
        imageMobileUrl: 'assets/images/mtn/mtn-corridor-mobile.jpg',
        projectUrl: 'mtn.html',
        desc: 'Continuous rhythm of warm timber fins and diffused recessed light guides circulation through executive conference suites.',
        specs: {
          client: 'MTN Group',
          scope: 'Executive Workplace Architecture & Turnkey Build',
          team: 'Godsway Kwahmi, RDVS Corporate Architecture',
          area: '950 sq.m',
          year: '2024',
          disciplines: ['Spatial Architecture', 'Acoustic Engineering', 'Millwork Construction']
        }
      },
      {
        id: 'abl-reception',
        title: 'ABL Reception',
        category: 'Interior Design — 2017',
        service: 'Interior Design',
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
          area: '380 sq.m',
          year: '2017',
          disciplines: ['Interior Design', '3D Visualization']
        }
      },
      {
        id: 'c25-interior',
        title: 'C25',
        category: 'Interior Design — 2024',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/c25/c25-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/c25/c25-1-desktop.jpg',
        imageMobileUrl: 'assets/images/c25/c25-1-mobile.jpg',
        projectUrl: 'c25.html',
        desc: 'Warm neutral palette interior utilizing micro-cement, acoustic fluting, and tailored concealed storage joinery.',
        specs: {
          client: 'Private Residence',
          scope: 'Interior Architecture & Custom Cabinetry',
          team: 'Godsway Kwahmi, RDVS Interior Atelier',
          area: '420 sq.m',
          year: '2024',
          disciplines: ['Interior Design', 'Custom Millwork', 'Lighting']
        }
      },
      {
        id: 'margin-suite',
        title: 'Hubtel',
        category: 'Interior Design — 2024',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/margin/margin-bank-desktop.jpg',
        imageUrlDesktop: 'assets/images/margin/margin-bank-desktop.jpg',
        imageMobileUrl: 'assets/images/margin/margin-bank-mobile.jpg',
        projectUrl: 'hubtel.html',
        desc: 'Precision banking suite designed with acoustic baffle ceilings, private consultation pods, and brushed architectural bronze detailing.',
        specs: {
          client: 'Margin Financial Group',
          scope: 'Commercial Interior Fit-Out & Acoustic Architecture',
          team: 'Godsway Kwahmi, RDVS Workplace Studio',
          area: '540 sq.m',
          year: '2024',
          disciplines: ['Corporate Architecture', 'Acoustic Engineering', 'Custom Metalwork']
        }
      }
    ]
  },

  vfx: {
    name: 'Visual Effects (VFX) & CGI',
    videos: [
      {
        id: '1981-film-project',
        title: '1981 Spatial Architecture Film',
        category: 'Visual Effects (VFX) & CGI — 2024',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/1957/1957-interior-desktop.jpg',
        imageUrlDesktop: 'assets/images/1957/1957-interior-desktop.jpg',
        imageMobileUrl: 'assets/images/1957/1957-interior-mobile.jpg',
        videoUrl: 'assets/videos/1981/1981-film.mp4',
        projectUrl: 'work.html',
        desc: 'Minimalist spatial composition balancing monumental monolithic massing with continuous floor-to-ceiling panoramic glass openings.',
        specs: {
          client: 'Private Client',
          scope: 'Spatial Architecture & CGI Cinematic Experience',
          team: 'Godsway Kwahmi, RDVS VFX & Cinematic Unit',
          area: '520 sq.m',
          year: '2024',
          disciplines: ['Visual Effects (VFX) & CGI', 'Spatial Architecture']
        }
      },
      {
        id: 'vr-showcase-video',
        title: 'VR Showcase',
        category: 'Visual Effects (VFX) & CGI — 2024',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/vr-showcase/vr-showcase-poster.jpg',
        imageUrlDesktop: 'assets/images/vr-showcase/vr-showcase-poster.jpg',
        imageMobileUrl: 'assets/images/vr-showcase/vr-showcase-poster.jpg',
        videoUrl: 'assets/videos/vr-showcase/vr-showcase.mp4',
        projectUrl: 'vr-showcase.html',
        is360: true,
        desc: 'An immersive real-time virtual simulation exploring photorealistic lighting, dynamic materials, and interactive spatial flow.',
        specs: {
          client: 'RDVS Virtual Lab',
          scope: 'Virtual Reality Simulation & Photoreal 3D Environments',
          team: 'Godsway Kwahmi, RDVS Virtual Reality Team',
          area: 'Interactive',
          year: '2024',
          disciplines: ['Visual Effects (VFX) & CGI', 'VR Simulation', 'Interactive 3D']
        }
      }
    ],
    images: [
      {
        id: '94-laurel-cgi',
        title: '94 Laurel',
        category: 'Visual Effects (VFX) & CGI — 2013',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/94-laurel/94-laurel-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/94-laurel/94-laurel-1-desktop.jpg',
        imageMobileUrl: 'assets/images/94-laurel/94-laurel-1-mobile.jpg',
        projectUrl: '94-laurel.html',
        desc: 'High-fidelity photorealistic CGI rendering for a residential estate in Laurel, Canada, executing high-precision 3D modeling, texturing, material shading, ray-traced lighting, and post-processing.',
        specs: {
          client: 'Brent Hughes',
          scope: '3D Modeling, Texturing, Shading, Rendering & Post Processing',
          team: 'Modelling: Jude Abbey, James Dapaah, Jude Nyoagbe | Texturing + Rendering + Post Processing: Jude Nyoagbe',
          location: 'Laurel, Canada',
          area: 'Laurel, Canada',
          year: '2013',
          disciplines: ['Visual Effects (VFX) & CGI', '3D Photoreal Rendering']
        }
      },
      {
        id: 'campions-estate',
        title: 'Campions Renderings',
        category: 'Visual Effects (VFX) & CGI — 2024',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/campions-renderings/campions-renderings-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/campions-renderings/campions-renderings-1-desktop.jpg',
        imageMobileUrl: 'assets/images/campions-renderings/campions-renderings-1-mobile.jpg',
        projectUrl: 'campions-renderings.html',
        desc: 'Photorealistic exterior and interior visual effects study capturing delicate twilight scattering, stone textures, and water reflections.',
        specs: {
          client: 'Campions Property Group',
          scope: 'Photoreal CGI Architectural Visualization',
          team: 'Godsway Kwahmi, RDVS CGI Studio',
          area: '2,200 sq.m',
          year: '2024',
          disciplines: ['Visual Effects (VFX) & CGI', 'Lighting Simulation', 'Shading']
        }
      },
      {
        id: 'villa-aggregate-cgi',
        title: 'Villa Aggregate',
        category: 'Visual Effects (VFX) & CGI — 2024',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/aggregate/villa-aggregate-desktop.jpg',
        imageUrlDesktop: 'assets/images/aggregate/villa-aggregate-desktop.jpg',
        imageMobileUrl: 'assets/images/aggregate/villa-aggregate-mobile.jpg',
        projectUrl: 'villa-aggregate.html',
        desc: 'Complex monolithic concrete and aggregate stone shader simulations exploring tactile micro-reliefs under directional sunlight.',
        specs: {
          client: 'Aggregate Concept Design',
          scope: 'Material Synthesis & Cinematic Photoreal Rendering',
          team: 'Godsway Kwahmi, RDVS Material Lab',
          area: '960 sq.m',
          year: '2024',
          disciplines: ['Visual Effects (VFX) & CGI', 'Material Simulation']
        }
      },
      {
        id: 'chocolate-pavilion',
        title: 'Chocolate',
        category: 'Visual Effects (VFX) & CGI — 2024',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/chocolate/chocolate-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/chocolate/chocolate-1-desktop.jpg',
        imageMobileUrl: 'assets/images/chocolate/chocolate-1-mobile.jpg',
        projectUrl: 'chocolate.html',
        desc: 'Experimental pavilion visualization capturing high-gloss organic envelopes, caustic light dispersion, and spatial volumetric forms.',
        specs: {
          client: 'Pavilion Design Arts',
          scope: 'CGI Volumetric Simulation & Concept Visualization',
          team: 'Godsway Kwahmi, RDVS Experimental VFX',
          area: '720 sq.m',
          year: '2024',
          disciplines: ['Visual Effects (VFX) & CGI', '3D Visualization']
        }
      },
      {
        id: 'stanchart-hq',
        title: 'Stanchart HQ',
        category: 'Visual Effects (VFX) & CGI — 2010',
        service: 'Visual Effects (VFX) & CGI',
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
          area: 'Corporate HQ Tower',
          year: '2010',
          disciplines: ['3D Visualization']
        }
      },
      {
        id: 'harbour-pointe',
        title: 'Harbour Pointe',
        category: 'Visual Effects (VFX) & CGI — 2015',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/harbour-pointe/harbour-pointe-1.jpg',
        imageUrlDesktop: 'assets/images/harbour-pointe/harbour-pointe-1.jpg',
        imageMobileUrl: 'assets/images/harbour-pointe/harbour-pointe-1.jpg',
        projectUrl: 'harbour-pointe.html',
        desc: 'Photorealistic 3D visualization for Harbour Pointe, a mixed-use waterfront development completed in 2015.',
        specs: {
          client: 'Private Client',
          scope: '3D Visualization',
          team: 'RDVS Team',
          area: 'Waterfront Development',
          year: '2015',
          disciplines: ['3D Visualization']
        }
      }
    ]
  },

  motion: {
    name: 'Motion Design',
    videos: [
      {
        id: 'ceeander-motion',
        title: 'Ceeander',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/ceeander/ceeander-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/ceeander/ceeander-1-desktop.jpg',
        imageMobileUrl: 'assets/images/ceeander/ceeander-1-mobile.jpg',
        videoUrl: 'assets/videos/ceeander/ceeander-motion.mp4',
        projectUrl: 'ceeander.html',
        desc: 'Cinematic 3D identity animation blending tactile material textures, kinetic typography, and atmospheric lighting.',
        specs: {
          client: 'Ceeander Entertainment',
          scope: 'Broadcast Identity & Motion Design',
          team: 'Godsway Kwahmi, RDVS Motion Studio',
          area: 'Broadcast Suite',
          year: '2024',
          disciplines: ['Motion Design', 'Visual Effects (VFX) & CGI']
        }
      },
      {
        id: 'trumpet-africa-motion',
        title: 'Trumpet Africa Productions Ident',
        category: 'Motion Design — 2014',
        service: 'Motion Design',
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
          area: 'Broadcast Ident',
          year: '2014',
          disciplines: ['Motion Design', '3D Animation']
        }
      },
      {
        id: 'hfc-tvc-motion',
        title: 'HFC TVC',
        category: 'Visual Effects (VFX) & CGI — 2016',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hfc-tvc/hfc-tvc-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/hfc-tvc/hfc-tvc-1-desktop.jpg',
        imageMobileUrl: 'assets/images/hfc-tvc/hfc-tvc-1-mobile.jpg',
        videoUrl: 'assets/videos/hfc-tvc/hfc-commercial.mp4',
        projectUrl: 'hfc-tvc.html',
        desc: 'Broadcast commercial spot combining 3D kinetic typographic choreography, graphic pacing, and fluid motion design.',
        specs: {
          client: 'HFC Bank',
          scope: 'Broadcast Commercial & Motion Direction',
          team: 'Jude Abbey, Jude Nyoagbe, Randy Biney',
          area: 'Commercial Campaign',
          year: '2024',
          disciplines: ['Motion Design', 'Broadcast TVC']
        }
      },
      {
        id: 'moty-intro-motion',
        title: 'MOTY',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/ceeander/ceeander-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/ceeander/ceeander-1-desktop.jpg',
        imageMobileUrl: 'assets/images/ceeander/ceeander-1-mobile.jpg',
        videoUrl: 'assets/videos/moty/moty-intro.mp4',
        projectUrl: 'moty.html',
        desc: 'Futuristic broadcast title opener utilizing optical refraction, metallic shaders, and synchronized kinetic audio hits.',
        specs: {
          client: 'MOTY Awards Network',
          scope: 'Broadcast Title Sequence & Motion Design',
          team: 'Godsway Kwahmi, RDVS Motion Studio',
          area: 'Broadcast Event',
          year: '2024',
          disciplines: ['Motion Design', '3D Motion Graphics']
        }
      },
      {
        id: 'viasat1-titles-motion',
        title: 'Viasat1 Breakfast Show',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hamlet/hamlet-estate-desktop.jpg',
        imageUrlDesktop: 'assets/images/hamlet/hamlet-estate-desktop.jpg',
        imageMobileUrl: 'assets/images/hamlet/hamlet-estate-mobile.jpg',
        videoUrl: 'assets/videos/viasat1-breakfast-show/viasat1-titles.mp4',
        projectUrl: 'viasat1-breakfast-show.html',
        desc: 'Vibrant morning broadcast identity package featuring 3D graphic ribbons, geometric layout transitions, and dynamic typography.',
        specs: {
          client: 'Viasat1 Television',
          scope: 'Broadcast Identity & Title Package',
          team: 'Godsway Kwahmi, RDVS Motion Studio',
          area: 'Morning Broadcast',
          year: '2024',
          disciplines: ['Motion Design', 'Broadcast Packaging']
        }
      }
    ],
    images: [
      {
        id: 'emerge-ident',
        title: 'Emerge Ident',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/emerge-ident/emerge-ident-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/emerge-ident/emerge-ident-1-desktop.jpg',
        imageMobileUrl: 'assets/images/emerge-ident/emerge-ident-1-mobile.jpg',
        projectUrl: 'emerge-ident.html',
        desc: 'A comprehensive broadcast and digital motion design system exploring clean geometry and dynamic typographic pacing.',
        specs: {
          client: 'Emerge Media Group',
          scope: 'Brand Identity System & Motion Graphics',
          team: 'Godsway Kwahmi, RDVS Motion & Branding',
          area: 'Media Brand',
          year: '2024',
          disciplines: ['Motion Design', 'Brand Identity', 'Graphic Systems']
        }
      },
      {
        id: 'elo-tv',
        title: 'Elo Tv',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/elo-tv/elo-tv-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/elo-tv/elo-tv-1-desktop.jpg',
        imageMobileUrl: 'assets/images/elo-tv/elo-tv-1-mobile.jpg',
        projectUrl: 'elo-tv.html',
        desc: 'On-air broadcast packaging featuring lower thirds, segment stingers, program bugs, and motion typography guidelines.',
        specs: {
          client: 'Elo TV Network',
          scope: 'Television Broadcast Graphics & On-Screen Design',
          team: 'Godsway Kwahmi, RDVS Broadcast Design',
          area: 'Broadcast Channel',
          year: '2024',
          disciplines: ['Motion Design', 'Broadcast Design', 'Motion Packaging']
        }
      },
      {
        id: 'hot-gossip',
        title: 'Hot Gossip',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/hot-gossip/hot-gossip-1-desktop.jpg',
        imageMobileUrl: 'assets/images/hot-gossip/hot-gossip-1-mobile.jpg',
        projectUrl: 'hot-gossip.html',
        desc: 'Fast-paced, colorful entertainment broadcast titles and transition cards designed for prime-time programming.',
        specs: {
          client: 'Hot Gossip Television',
          scope: 'Entertainment Channel Identity & Motion System',
          team: 'Godsway Kwahmi, RDVS Motion Studio',
          area: 'Entertainment Show',
          year: '2024',
          disciplines: ['Motion Design', 'Entertainment Graphics', 'Kinetic Design']
        }
      },
      {
        id: 'hfc-tvc-keyframes',
        title: 'HFC TVC',
        category: 'Visual Effects (VFX) & CGI — 2016',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hfc-tvc/hfc-tvc-1-desktop.jpg',
        imageUrlDesktop: 'assets/images/hfc-tvc/hfc-tvc-1-desktop.jpg',
        imageMobileUrl: 'assets/images/hfc-tvc/hfc-tvc-1-mobile.jpg',
        projectUrl: 'hfc-tvc.html',
        desc: 'High-contrast stylized motion keyframes establishing lighting mood, particle density, and corporate typographic hierarchy.',
        specs: {
          client: 'HFC Bank',
          scope: 'Broadcast Visual Keyframes & Motion Graphics',
          team: 'Jude Abbey, Jude Nyoagbe, Randy Biney',
          area: 'Commercial Campaign',
          year: '2024',
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
      category: 'Studio — 2026',
      service: 'Studio',
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

  // Generate the remaining slides: equal distribution across the 4 service types.
  // News slides always occupy the front, so the budget adapts to their count.
  const serviceKeys = ['architecture', 'interiors', 'vfx', 'motion'];
  const TOTAL_SLIDE_BUDGET = 20;
  const projectSlotBudget = Math.max(TOTAL_SLIDE_BUDGET - newsSlides.length, 0);
  const basePerService = Math.floor(projectSlotBudget / serviceKeys.length);
  let remainder = projectSlotBudget - basePerService * serviceKeys.length;
  const perServiceCounts = {};
  const selectedByService = {};

  serviceKeys.forEach(key => {
    // Distribute any remainder across the first services
    perServiceCounts[key] = basePerService + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder--;

    const pool = servicePools[key];
    const shuffledVideos = shuffleArray(pool.videos || []);
    const shuffledImages = shuffleArray(pool.images || []);

    // Mix of videos and images (max 2 videos per discipline)
    const videoCount = Math.min(2, shuffledVideos.length, perServiceCounts[key]);
    const imageCount = Math.max(perServiceCounts[key] - videoCount, 0);

    const chosenVideos = shuffledVideos.slice(0, videoCount);
    const chosenImages = shuffledImages.slice(0, imageCount);

    selectedByService[key] = shuffleArray([...chosenVideos, ...chosenImages]);
  });

  // Interleave round-robin across services so consecutive slides alternate discipline
  const interleavedProjects = [];
  const maxPerService = Math.max(...serviceKeys.map(k => perServiceCounts[k]), 0);
  for (let r = 0; r < maxPerService; r++) {
    serviceKeys.forEach(k => {
      if (selectedByService[k] && selectedByService[k][r]) {
        interleavedProjects.push(selectedByService[k][r]);
      }
    });
  }

  // Top-up from any pool if the selection underfilled (never exceed the total budget)
  if (newsSlides.length + interleavedProjects.length < TOTAL_SLIDE_BUDGET) {
    const used = new Set([...newsSlides, ...interleavedProjects].map(p => p.id));
    for (const key of serviceKeys) {
      const pool = [...(servicePools[key].videos || []), ...(servicePools[key].images || [])];
      for (const entry of shuffleArray(pool)) {
        if (newsSlides.length + interleavedProjects.length >= TOTAL_SLIDE_BUDGET) break;
        if (used.has(entry.id)) continue;
        used.add(entry.id);
        interleavedProjects.push(entry);
      }
      if (newsSlides.length + interleavedProjects.length >= TOTAL_SLIDE_BUDGET) break;
    }
  }

  // News items always run first on the slideshow
  const projects = [...newsSlides, ...interleavedProjects];

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

  // Spec Drawer Elements
  const specDrawer = document.getElementById('specDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerClose');
  const specTriggers = document.querySelectorAll('.project-spec-trigger');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerClient = document.getElementById('drawerClient');
  const drawerScope = document.getElementById('drawerScope');
  const drawerTeam = document.getElementById('drawerTeam');
  const drawerArea = document.getElementById('drawerArea');
  const drawerYear = document.getElementById('drawerYear');
  const drawerDisciplines = document.getElementById('drawerDisciplines');

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
            if ((proj.is360 || proj.videoUrl.includes('vr-showcase') || proj.videoUrl.includes('360')) && window.VR360) {
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

  // Dynamic Project Title Synchronization from Project Pages
  const projectTitleCache = new Map();

  /**
   * Fetches the latest title directly from a project's HTML page.
   * Ensures that changing the project title on the project page immediately reflects on the slide.
   */
  async function fetchTitleFromProjectPage(projectUrl) {
    if (!projectUrl || projectUrl === 'work.html' || projectUrl.startsWith('http')) {
      return null;
    }
    if (projectTitleCache.has(projectUrl)) {
      return projectTitleCache.get(projectUrl);
    }
    try {
      const res = await fetch(projectUrl, { cache: 'no-cache' });
      if (!res.ok) return null;
      const html = await res.text();
      const match = html.match(/<h1[^>]*class=["'][^"']*project-page-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i) ||
                    html.match(/<header[^>]*class=["'][^"']*project-hero-header[^"']*["'][^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
                    html.match(/<main[^>]*class=["'][^"']*project-detail-container[^"']*["'][^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
                    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (match && match[1]) {
        const temp = document.createElement('div');
        temp.innerHTML = match[1];
        const pageTitle = temp.textContent.trim();
        if (pageTitle) {
          projectTitleCache.set(projectUrl, pageTitle);
          return pageTitle;
        }
      }
    } catch (e) {
      // In file:// protocol or offline, gracefully retain default proj.title
    }
    return null;
  }

  function applyLiveTitleToSlide(idx, liveTitle) {
    if (!projects[idx] || !liveTitle) return;
    projects[idx].title = liveTitle;

    // 1. Lower-third caption title
    if (captionCards[idx]) {
      const titleEl = captionCards[idx].querySelector('.project-title');
      if (titleEl) titleEl.textContent = liveTitle;
    }

    // 2. Slide accessibility labels & image alt text
    if (slides[idx]) {
      slides[idx].setAttribute('aria-label', liveTitle);
      const img = slides[idx].querySelector('img');
      if (img) img.alt = liveTitle;
    }

    // 3. Spec Drawer title if currently open for this project
    if (specDrawer && specDrawer.classList.contains('open') && currentIndex === idx) {
      if (drawerTitle) drawerTitle.textContent = liveTitle;
    }
  }

  async function syncSlideTitlesFromProjectPages() {
    // 1. Fetch active slide first for immediate update
    if (projects.length > 0 && projects[0] && projects[0].projectUrl) {
      fetchTitleFromProjectPage(projects[0].projectUrl).then(liveTitle => {
        if (liveTitle && liveTitle !== projects[0].title) {
          applyLiveTitleToSlide(0, liveTitle);
        }
      });
    }

    // 2. Concurrently fetch all remaining slides
    projects.forEach((proj, idx) => {
      if (idx === 0 || !proj || !proj.projectUrl) return;
      fetchTitleFromProjectPage(proj.projectUrl).then(liveTitle => {
        if (liveTitle && liveTitle !== proj.title) {
          applyLiveTitleToSlide(idx, liveTitle);
        }
      });
    });
  }

  // Populate slides with the randomized selection immediately
  populateRandomizedSlides();
  syncSlideTitlesFromProjectPages();

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

  function updateSlide(newIndex) {
    clearSlideTimer();
    imageElapsed = 0;

    if (newIndex < 0) {
      currentIndex = totalSlides - 1;
    } else if (newIndex >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = newIndex;
    }

    // Sync title from project page for the active slide if available
    const activeProject = projects[currentIndex];
    if (activeProject && activeProject.projectUrl) {
      if (projectTitleCache.has(activeProject.projectUrl)) {
        const cached = projectTitleCache.get(activeProject.projectUrl);
        if (cached && cached !== activeProject.title) {
          applyLiveTitleToSlide(currentIndex, cached);
        }
      } else {
        fetchTitleFromProjectPage(activeProject.projectUrl).then(liveTitle => {
          if (liveTitle && liveTitle !== activeProject.title) {
            applyLiveTitleToSlide(currentIndex, liveTitle);
          }
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
        updateSlide(currentIndex + 1);
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
        updateSlide(currentIndex + 1);
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
      if (projectTitleCache.has(project.projectUrl)) {
        const cached = projectTitleCache.get(project.projectUrl);
        if (cached && cached !== project.title) {
          applyLiveTitleToSlide(index, cached);
        }
      } else {
        fetchTitleFromProjectPage(project.projectUrl).then(liveTitle => {
          if (liveTitle && liveTitle !== project.title) {
            applyLiveTitleToSlide(index, liveTitle);
          }
        });
      }
    }

    if (drawerTitle) drawerTitle.textContent = project.title;
    if (drawerClient) drawerClient.textContent = project.specs.client;
    if (drawerScope) drawerScope.textContent = project.specs.scope;
    if (drawerTeam) drawerTeam.textContent = (project.specs && project.specs.team) || 'RDVS Design Team';
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
