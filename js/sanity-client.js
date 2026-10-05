/**
 * RDVS STUDIOS — Sanity CDN Client & GROQ Query Service
 * Headless integration for architecture portfolio, news, project details, and editorial content.
 *
 * Every projection here names fields that studio/schemas/ actually defines, and every `_type`
 * names a schema that exists. Both had drifted: the client used to ask for `_type == "article"`
 * (the news schema is called `post`) and `_type == "page"` (no such type is defined), so those
 * paths could never resolve however full the dataset got.
 */

const RDVSSanity = (() => {
  // Sanity Configuration grounded in studio/sanity.cli.ts and studio/.env.local
  const config = {
    projectId: window.SANITY_PROJECT_ID || 'lqnpv8ns',
    dataset: window.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true
  };

  /**
   * Remote GROQ is opt-IN, not on-by-default, and that is load-bearing for the live site.
   *
   * `config` above falls back to the real project id, so the old `isConfigured()` was always true and
   * every page load fired two unauthenticated GETs at lqnpv8ns.apicdn.sanity.io. Two things made them
   * certain to fail in production: the dataset is empty (nothing imported yet), and www.rdvs.studio is
   * not listed under Sanity's Project settings -> CORS, so the browser refused the responses outright.
   * The homepage console logged "blocked by CORS policy" twice plus two `net::ERR_FAILED`, while the
   * baked local pools in js/main.js rendered the deck exactly as intended.
   *
   * Both consumers already branch on `isConfigured()` (js/main.js before merging remote heroes,
   * js/sanity-render.js at the top of its DOMContentLoaded handler), so leaving it false changes
   * nothing on screen — it just stops the doomed requests and clears the console.
   *
   * To switch the CMS on for real: import the catalogue, register the site origin in Sanity's CORS
   * settings, then either set `window.RDVS_SANITY_REMOTE = true` in the page before this script loads
   * or inject a real `window.SANITY_PROJECT_ID`. Flipping it on without the CORS entry only brings
   * the console errors back.
   */
  const remoteOptIn = window.RDVS_SANITY_REMOTE === true
    || (typeof window.SANITY_PROJECT_ID === 'string' && window.SANITY_PROJECT_ID !== '');

  /**
   * Check if Sanity credentials have been configured AND remote queries have been opted in.
   */
  function isConfigured() {
    return remoteOptIn
      && Boolean(config.projectId)
      && config.projectId !== 'your-project-id';
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

  // The shared projection for one project. `pageFile` is the canonical key — the site renames
  // display titles but keeps its live URLs, so a project's HTML file is not always its slug
  // ("Senseble" is served from home-automation-system-presentation.html). `disciplines` is what
  // the slide caption rolls up to main services; `category`/`discipline` are kept as fallbacks
  // for callers that predate the taxonomy.
  const PROJECT_FIELDS = `{
      _id,
      title,
      pageFile,
      "slug": slug.current,
      "category": coalesce(typology, cardLabel),
      typology,
      "discipline": primaryDiscipline,
      disciplines,
      "year": publishedAt,
      "imageUrl": cardImage.asset->url,
      "heroImageUrl": heroImage.asset->url,
      "description": excerpt,
      "lead": lead,
      "client": specs.client,
      "location": specs.location,
      "area": specs.area,
      "scope": specs.scope,
      "team": specs.team,
      "gallery": gallery[]{ "url": asset->url, alt },
      visibility
    }`;

  /**
   * Fetch 10 projects for the hero slideshow.
   *
   * `visibility != "archived"` also matches documents where the field was never set. Ordering by
   * `featured` only biases the pre-JS paint: js/main.js re-draws the deck at random per load, and
   * a slide may only use a frame its own project page leads with.
   */
  async function getHeroProjects() {
    const groq = `*[_type == "project" && visibility != "archived"] | order(featured desc, publishedAt desc)[0...10] ${PROJECT_FIELDS}`;
    const remoteProjects = await query(groq);
    return remoteProjects && remoteProjects.length > 0 ? remoteProjects : null;
  }

  /**
   * Fetch portfolio projects for work.html — live only, by definition.
   * Archived work stays reachable through archive.html, which queries without the filter.
   */
  async function getWorkProjects() {
    const groq = `*[_type == "project" && visibility != "archived"] | order(publishedAt desc) ${PROJECT_FIELDS}`;
    const remoteProjects = await query(groq);
    return remoteProjects && remoteProjects.length > 0 ? remoteProjects : null;
  }

  /**
   * Fetch every project including archived ones, for archive.html.
   */
  async function getAllProjects() {
    const groq = `*[_type == "project"] | order(publishedAt desc) ${PROJECT_FIELDS}`;
    const remoteProjects = await query(groq);
    return remoteProjects && remoteProjects.length > 0 ? remoteProjects : null;
  }

  /**
   * Fetch a single project by the HTML file it is served from.
   * Not visibility-filtered on purpose: an archived project's own page must still render
   * when it is reached from the archive. Falls back to the slug so a page whose file name and
   * slug still agree keeps working, and so a document without `pageFile` is not invisible.
   */
  async function getProjectBySlug(slug) {
    const key = String(slug).replace(/\.html$/, '');
    // The key is interpolated straight into GROQ, so it has to be a bare file stem. A page name can
    // only ever be [a-z0-9-]; anything else is a malformed URL or an attempt to close the string.
    if (!/^[a-z0-9-]+$/.test(key)) {
      return null;
    }
    const groq = `*[(_type == "project") && (pageFile == "${key}.html" || slug.current == "${key}")][0] ${PROJECT_FIELDS}`;
    return await query(groq);
  }

  /**
   * Fetch editorial content for standard pages (about, expertise, contact, etc.)
   *
   * There is no `page` document type in studio/schemas/, so this used to be a guaranteed null.
   * It now reads the siteSettings singleton, which is where studio-level prose actually lives.
   * Callers that want per-page copy need a `page` type added to the schema first.
   */
  async function getPageContent() {
    return await getSiteSettings();
  }

  /**
   * Fetch the siteSettings singleton (structure.ts pins it to the id "siteSettings").
   */
  async function getSiteSettings() {
    const groq = `*[_type == "siteSettings"][0] {
      studioName,
      tagline,
      description,
      foundedYear,
      archiveStartYear,
      archiveEndYear,
      email,
      phone,
      address,
      socialLinks,
      "ogImageUrl": ogImage.asset->url,
      footerLinks,
      copyrightYear
    }`;
    return await query(groq);
  }

  /**
   * Fetch news articles for news.html.
   * The schema type is `post`; the old query asked for `article`, which nothing defines.
   */
  async function getNewsArticles() {
    const groq = `*[_type == "post" && visibility != "archived"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      category,
      publishedAt,
      "imageUrl": coverImage.asset->url,
      excerpt,
      visibility
    }`;
    const remoteArticles = await query(groq);
    return remoteArticles && remoteArticles.length > 0 ? remoteArticles : null;
  }

  return {
    config,
    remoteOptIn,
    isConfigured,
    query,
    urlForImage,
    getHeroProjects,
    getWorkProjects,
    getAllProjects,
    getProjectBySlug,
    getPageContent,
    getSiteSettings,
    getNewsArticles
  };
})();

// Expose globally
window.RDVSSanity = RDVSSanity;
