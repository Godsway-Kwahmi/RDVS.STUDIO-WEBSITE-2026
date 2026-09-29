/**
 * RDVS STUDIOS — Sanity CDN Client & GROQ Query Service
 * Headless integration for architecture portfolio, news, and hero slideshow.
 */

const RDVSSanity = (() => {
  // Sanity Configuration
  // Replace 'your-project-id' with your Sanity Project ID when deployed
  const config = {
    projectId: window.SANITY_PROJECT_ID || 'your-project-id',
    dataset: window.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true
  };

  /**
   * Check if Sanity credentials have been configured
   */
  function isConfigured() {
    return config.projectId && config.projectId !== 'your-project-id';
  }

  /**
   * Execute GROQ Query via Sanity CDN HTTP API
   */
  async function query(groq) {
    if (!isConfigured()) {
      return null;
    }

    const host = config.useCdn ? 'apicdn.sanity.io' : 'api.sanity.io';
    const encodedQuery = encodeURIComponent(groq);
    const url = `https://${config.projectId}.${host}/v${config.apiVersion}/data/query/${config.dataset}?query=${encodedQuery}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Sanity Query Failed: HTTP ${response.status}`);
      }
      const data = await response.json();
      return data.result;
    } catch (err) {
      console.warn('[RDVS Sanity] Remote query error, fallback activated:', err);
      return null;
    }
  }

  /**
   * Helper: Build Sanity Image CDN URL with sizing and auto-format
   */
  function urlForImage(source, width = 1920, quality = 85) {
    if (!source) return null;
    if (typeof source === 'string') return source;
    if (source.asset && source.asset.url) {
      return `${source.asset.url}?auto=format&w=${width}&q=${quality}`;
    }
    // Direct Sanity ref format: image-Tb97YFYSyXBNuCcxhuC9rfzq-1920x1080-jpg
    if (source.asset && source.asset._ref) {
      const ref = source.asset._ref;
      const parts = ref.split('-');
      if (parts.length >= 4) {
        const id = parts[1];
        const dimensions = parts[2];
        const format = parts[3];
        return `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${id}-${dimensions}.${format}?auto=format&w=${width}&q=${quality}`;
      }
    }
    return null;
  }

  /**
   * Fetch 10 featured projects for the hero slideshow
   */
  async function getHeroProjects() {
    const groq = `*[_type == "project" && (featuredOnHero == true || defined(order))] | order(order asc, year desc)[0...10] {
      _id,
      title,
      "slug": slug.current,
      category,
      discipline,
      "imageUrl": coverImage.asset->url,
      description,
      client,
      location,
      year,
      area,
      scope,
      disciplines
    }`;

    const remoteProjects = await query(groq);
    return remoteProjects && remoteProjects.length > 0 ? remoteProjects : null;
  }

  /**
   * Fetch all portfolio projects for work.html
   */
  async function getWorkProjects() {
    const groq = `*[_type == "project"] | order(order asc, year desc) {
      _id,
      title,
      "slug": slug.current,
      category,
      discipline,
      "imageUrl": coverImage.asset->url,
      description
    }`;

    const remoteProjects = await query(groq);
    return remoteProjects && remoteProjects.length > 0 ? remoteProjects : null;
  }

  /**
   * Fetch news monographs for news.html
   */
  async function getNewsArticles() {
    const groq = `*[_type == "article"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      category,
      publishedAt,
      "imageUrl": coverImage.asset->url,
      excerpt
    }`;

    const remoteArticles = await query(groq);
    return remoteArticles && remoteArticles.length > 0 ? remoteArticles : null;
  }

  return {
    config,
    isConfigured,
    query,
    urlForImage,
    getHeroProjects,
    getWorkProjects,
    getNewsArticles
  };
})();

// Expose globally
window.RDVSSanity = RDVSSanity;
