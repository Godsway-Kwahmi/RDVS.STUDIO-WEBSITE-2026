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
        title: 'Tower Cascades Vertical Complex',
        category: 'Architecture — 2025',
        service: 'Architecture',
        discipline: 'architecture',
        videoUrl: 'assets/videos/tower-cascades/tower-cascades.mp4',
        imageUrl: 'assets/images/cascades/tower-cascades-night.jpg',
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
        title: 'D E T A I L S Architectural Film',
        category: 'Architecture — 2024',
        service: 'Architecture',
        discipline: 'architecture',
        videoUrl: 'assets/videos/d-e-t-a-i-l-s/details-film.mp4',
        imageUrl: 'assets/images/hamlet/hamlet-estate.jpg',
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
        title: 'Funko Ridge Coastal Enclave',
        category: 'Architecture — 2025',
        service: 'Architecture',
        discipline: 'architecture',
        videoUrl: 'assets/videos/funko-ridge/funko-terrace.mp4',
        imageUrl: 'assets/images/funko-ridge/funko-ridge-1.jpg',
        projectUrl: 'funko-ridge.html',
        desc: 'Terraced hillside residential enclave contoured to natural topographic gradients, minimizing site impact and optimizing panoramic ocean views.',
        specs: {
          client: 'Ridge Estates Ltd',
          scope: 'Topographic Masterplanning & Architectural Simulation',
          team: 'Godsway Kwahmi, RDVS Masterplanning',
          area: '45,000 sq.m',
          year: '2025',
          disciplines: ['Masterplanning', 'Environmental Architecture', '3D Simulation']
        }
      },
      {
        id: '5aap-progress',
        title: '5AAP Commercial Complex',
        category: 'Architecture — 2024',
        service: 'Architecture',
        discipline: 'architecture',
        videoUrl: 'assets/videos/5aap/5aap-progress.mp4',
        imageUrl: 'assets/images/5aap/5aap-1.jpg',
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
        id: 'hamlet-estate',
        title: 'Hamlet Contemporary Residence',
        category: 'Architecture — 2024',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/hamlet/hamlet-estate.jpg',
        projectUrl: 'hamlet.html',
        desc: 'Cantilevered geometric volumes with integrated nightscape illumination, balancing private sanctuaries with panoramic open-plan entertainment zones.',
        specs: {
          client: 'Private Client',
          scope: 'Architectural Concept & Photorealistic 3D VFX Visualization',
          team: 'Godsway Kwahmi, RDVS Architecture',
          area: '820 sq.m',
          year: '2024',
          disciplines: ['Architectural Design', '3D Photoreal Visualization', 'Landscape Integration']
        }
      },
      {
        id: 'dyv-dawn',
        title: 'DYV Mixed-Use Development',
        category: 'Architecture — 2025',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/dyv/dyv-dawn.jpg',
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
        imageUrl: 'assets/images/barham/barham-residence.jpg',
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
        id: 'frontier-tower',
        title: 'Frontier Commercial Complex',
        category: 'Architecture — 2025',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/frontier/frontier-tower.jpg',
        projectUrl: 'frontier.html',
        desc: 'A striking vertical facade composition optimizing solar shading and environmental efficiency for high-density metropolitan commerce.',
        specs: {
          client: 'Frontier Properties',
          scope: 'Commercial Architecture & Photoreal Simulation',
          team: 'Godsway Kwahmi, Lead Architectural Team',
          area: '16,500 sq.m',
          year: '2025',
          disciplines: ['Architectural Design', 'Structural Coordination', '3D VFX Simulation']
        }
      },
      {
        id: 'purc-complex',
        title: 'PURC Institutional Complex',
        category: 'Architecture — 2023',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/purc/purc-facade.jpg',
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
        title: 'Airport City Commercial Hub',
        category: 'Architecture — 2024',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/airport-city/airport-city-1.jpg',
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
        id: 'advantage-place',
        title: 'Advantage Place Commercial Center',
        category: 'Architecture — 2024',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/advantage-place/advantage-place-1.jpg',
        projectUrl: 'advantage-place.html',
        desc: 'High-density commercial office architecture engineered for climate resilience with continuous solar-shading louver screens.',
        specs: {
          client: 'Advantage Properties',
          scope: 'Commercial Facade & Architectural Planning',
          team: 'Godsway Kwahmi, Commercial Design Team',
          area: '12,400 sq.m',
          year: '2024',
          disciplines: ['Commercial Architecture', 'Facade Engineering']
        }
      },
      {
        id: 'adentan-townhouses',
        title: 'Adentan Contemporary Townhouses',
        category: 'Architecture — 2024',
        service: 'Architecture',
        discipline: 'architecture',
        imageUrl: 'assets/images/adentan-townhouses/adentan-townhouses-1.jpg',
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
      }
    ]
  },

  interiors: {
    name: 'Interior Design',
    videos: [
      {
        id: '1957-interior-video',
        title: '1957 Monochrome Residence',
        category: 'Interior Design — 2024',
        service: 'Interior Design',
        discipline: 'interiors',
        videoUrl: 'assets/videos/1957/1957-lounge.mp4',
        imageUrl: 'assets/images/1957/1957-1.jpg',
        projectUrl: '1957.html',
        desc: 'A masterclass in quiet luxury, featuring continuous off-white microcement surfaces, recessed linear reveal details, and low-profile European furniture.',
        specs: {
          client: 'Private Client',
          scope: 'Interior Design & Minimalist Furniture Styling',
          team: 'Godsway Kwahmi, RDVS Interior Atelier',
          area: '340 sq.m',
          year: '2024',
          disciplines: ['Interior Design', 'Minimalist Architecture', 'Joinery Fabrication']
        }
      },
      {
        id: 'csm-interiors-film',
        title: 'CSM Executive Suites',
        category: 'Interior Design — 2024',
        service: 'Interior Design',
        discipline: 'interiors',
        videoUrl: 'assets/videos/csm-interiors/csm-interiors.mp4',
        imageUrl: 'assets/images/margin/margin-bank.jpg',
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
      }
    ],
    images: [
      {
        id: 'afg-hq',
        title: 'AFG Executive Headquarters',
        category: 'Interior Design — 2024',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/afg/afg-headquarters.jpg',
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
        title: 'Hubtel Executive Boardroom Wing',
        category: 'Interior Design — 2023',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/hubtel/hubtel-executive.jpg',
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
        title: 'La Beach Towers Penthouse',
        category: 'Interior Design — 2024',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/labeach/la-beach-towers.jpg',
        projectUrl: 'labeach.html',
        desc: 'Panoramic coastal luxury interior framing expansive oceanic vistas through minimalist double-height glazing and bespoke low-slung joinery.',
        specs: {
          client: 'Private Residence',
          scope: 'Luxury Interior Design & High-End 3D Visualization',
          team: 'Godsway Kwahmi, Residential Luxury Unit',
          area: '480 sq.m',
          year: '2024',
          disciplines: ['Interior Design', 'Lighting Design', 'Custom Furniture Specification']
        }
      },
      {
        id: 'mtn-corridor',
        title: 'MTN Headquarters Executive Wing',
        category: 'Interior Design — 2024',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/mtn/mtn-corridor.jpg',
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
        title: 'ABL Corporate Reception',
        category: 'Interior Design — 2023',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/abl/abl-reception.jpg',
        projectUrl: 'abl-reception.html',
        desc: 'Minimalist commercial lobby blending linear slatted wall elements with monolithic reception counter architecture and concealed ambient illumination.',
        specs: {
          client: 'Accra Breweries Limited',
          scope: 'Interior Design & Bespoke Reception Millwork',
          team: 'Godsway Kwahmi, RDVS Commercial Interiors',
          area: '380 sq.m',
          year: '2023',
          disciplines: ['Interior Design', 'Joinery Fabrication', 'Lighting Design']
        }
      },
      {
        id: 'c25-interior',
        title: 'C25 Private Residence',
        category: 'Interior Design — 2024',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/c25/c25-1.jpg',
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
        title: 'Margin Financial Suite',
        category: 'Interior Design — 2024',
        service: 'Interior Design',
        discipline: 'interiors',
        imageUrl: 'assets/images/margin/margin-bank.jpg',
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
        imageUrl: 'assets/images/1957/1957-interior.jpg',
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
        title: 'VR Showcase Architectural Simulation',
        category: 'Visual Effects (VFX) & CGI — 2024',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/vr-showcase/vr-showcase-poster.jpg',
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
        title: '94 Laurel CGI Visualization',
        category: 'Visual Effects (VFX) & CGI — 2013',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/94-laurel/94-laurel-1.jpg',
        projectUrl: '94-laurel.html',
        desc: 'High-fidelity photorealistic CGI rendering for a Canadian residential estate, executing high-precision 3D modeling, texturing, material shading, ray-traced lighting, and post-processing.',
        specs: {
          client: 'Brent Hughes',
          scope: '3D Modeling, Texturing, Shading, Rendering & Post Processing',
          team: 'Godsway Kwahmi, RDVS CGI Team',
          area: 'Canada',
          year: '2013',
          disciplines: ['Visual Effects (VFX) & CGI', '3D Photoreal Rendering']
        }
      },
      {
        id: 'onehive-center',
        title: 'OneHive Innovation Center',
        category: 'Visual Effects (VFX) & CGI — 2025',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/onehive/onehive.jpg',
        projectUrl: 'onehive.html',
        desc: 'A high-concept technology incubator pairing organic fluid contours with integrated digital display matrices and acoustic ceiling baffles.',
        specs: {
          client: 'OneHive Venture Studio',
          scope: 'Computational Concept Modeling & Cinematic 3D VFX',
          team: 'Godsway Kwahmi, RDVS VFX Studio',
          area: '1,800 sq.m',
          year: '2025',
          disciplines: ['Parametric Modeling', 'Lighting Simulation', 'Creative Direction']
        }
      },
      {
        id: 'campions-estate',
        title: 'Campions Estate CGI Renderings',
        category: 'Visual Effects (VFX) & CGI — 2024',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/campions-renderings/campions-renderings-1.jpg',
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
        title: 'Villa Aggregate CGI Simulation',
        category: 'Visual Effects (VFX) & CGI — 2024',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/aggregate/villa-aggregate.jpg',
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
        title: 'Chocolate Pavilion CGI Simulation',
        category: 'Visual Effects (VFX) & CGI — 2024',
        service: 'Visual Effects (VFX) & CGI',
        discipline: 'vfx',
        imageUrl: 'assets/images/chocolate/chocolate-1.jpg',
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
      }
    ]
  },

  motion: {
    name: 'Motion Design',
    videos: [
      {
        id: 'ceeander-motion',
        title: 'Ceeander Entertainment Broadcast Ident',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/ceeander/ceeander-1.jpg',
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
        title: 'Trumpet Africa Broadcast Ident',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/dyv/dyv-dawn.jpg',
        videoUrl: 'assets/videos/trumpet-africa-ident/trumpet-africa.mp4',
        projectUrl: 'trumpet-africa-ident.html',
        desc: 'Dynamic broadcast identity featuring sculptured fluid geometry, particle physics simulation, and monumental form.',
        specs: {
          client: 'Trumpet Africa Network',
          scope: 'Broadcast Design & Cinematic Animation',
          team: 'Godsway Kwahmi, RDVS Broadcast Motion',
          area: 'Network Ident',
          year: '2024',
          disciplines: ['Motion Design', '3D Animation']
        }
      },
      {
        id: 'hfc-tvc-motion',
        title: 'HFC Bank Commercial TVC',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
        videoUrl: 'assets/videos/hfc-tvc/hfc-commercial.mp4',
        projectUrl: 'hfc-tvc.html',
        desc: 'Broadcast commercial spot combining 3D kinetic typographic choreography, graphic pacing, and fluid motion design.',
        specs: {
          client: 'HFC Bank',
          scope: 'Broadcast Commercial & Motion Direction',
          team: 'Godsway Kwahmi, RDVS Motion Studio',
          area: 'Commercial Campaign',
          year: '2024',
          disciplines: ['Motion Design', 'Broadcast TVC']
        }
      },
      {
        id: 'moty-intro-motion',
        title: 'MOTY Broadcast Titles',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/ceeander/ceeander-1.jpg',
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
        title: 'Viasat1 Breakfast Show Opening Titles',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hamlet/hamlet-estate.jpg',
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
        title: 'Emerge Brand Identity Motion Package',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/emerge-ident/emerge-ident-1.png',
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
        title: 'Elo TV Broadcast Package',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/elo-tv/elo-tv-1.jpg',
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
        title: 'Hot Gossip Broadcast Branding',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hot-gossip/hot-gossip-1.jpg',
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
        title: 'HFC TVC Visual Keyframe Design',
        category: 'Motion Design — 2024',
        service: 'Motion Design',
        discipline: 'motion',
        imageUrl: 'assets/images/hfc-tvc/hfc-tvc-1.jpg',
        projectUrl: 'hfc-tvc.html',
        desc: 'High-contrast stylized motion keyframes establishing lighting mood, particle density, and corporate typographic hierarchy.',
        specs: {
          client: 'HFC Bank',
          scope: 'Broadcast Visual Keyframes & Motion Graphics',
          team: 'Godsway Kwahmi, RDVS Motion Studio',
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
      const sanityHero = await window.RDVSSanity.getHeroProjects();
      if (sanityHero && sanityHero.length > 0) {
        sanityHero.forEach((p, idx) => {
          const disc = (p.discipline || '').toLowerCase();
          const targetKey = disc.includes('interior') ? 'interiors'
            : disc.includes('vfx') || disc.includes('cgi') ? 'vfx'
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

  // Generate 20 slides: Equal number (5) from each of the 4 service types
  // Mix of videos and images (2 videos + 3 images per service discipline = 8 videos and 12 images total)
  const serviceKeys = ['architecture', 'interiors', 'vfx', 'motion'];
  const perServiceCount = 5;
  const selectedByService = {};

  serviceKeys.forEach(key => {
    const pool = servicePools[key];
    const shuffledVideos = shuffleArray(pool.videos || []);
    const shuffledImages = shuffleArray(pool.images || []);

    const videoCount = Math.min(2, shuffledVideos.length);
    const imageCount = perServiceCount - videoCount;

    const chosenVideos = shuffledVideos.slice(0, videoCount);
    const chosenImages = shuffledImages.slice(0, imageCount);

    selectedByService[key] = shuffleArray([...chosenVideos, ...chosenImages]);
  });

  // Interleave round-robin across services so consecutive slides alternate discipline
  const projects = [];
  for (let r = 0; r < perServiceCount; r++) {
    serviceKeys.forEach(k => {
      if (selectedByService[k] && selectedByService[k][r]) {
        projects.push(selectedByService[k][r]);
      }
    });
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
    projects.forEach((proj, idx) => {
      // 1. Update photographic or cinematic video slide
      if (slides[idx]) {
        slides[idx].setAttribute('aria-label', proj.title);
        const mediaContainer = slides[idx].querySelector('.slide-media');
        if (mediaContainer) {
          if (proj.videoUrl) {
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
              mediaContainer.innerHTML = `<video class="slide-video" src="${proj.videoUrl}" poster="${proj.imageUrl || ''}" muted playsinline preload="auto"></video>`;
            }

          } else {
            mediaContainer.innerHTML = `<img src="${proj.imageUrl}" alt="${proj.title}" class="slide-img" ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
          }
        }
      }

      // 2. Update lower-third caption card
      if (captionCards[idx]) {

        const catEl = captionCards[idx].querySelector('.project-category');
        const titleEl = captionCards[idx].querySelector('.project-title');
        const actionLink = captionCards[idx].querySelector('.project-action-link');
        const specTrigger = captionCards[idx].querySelector('.project-spec-trigger');

        if (catEl) catEl.textContent = proj.category;
        if (titleEl) titleEl.textContent = proj.title;
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

  function openDrawer(index) {
    const project = projects[index];
    if (!project) return;

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
