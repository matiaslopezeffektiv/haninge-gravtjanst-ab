const { escapeHtml, escapeAttr } = require('./html');

/**
 * Bygger <title>, description, canonical, Open Graph och Twitter Card-taggar
 * för en sida — en enda källa istället för att skriva samma taggar för hand
 * i varje HTML-fil.
 *
 * @param {object} params
 * @param {object} params.site - data/site.json
 * @param {string} params.title
 * @param {string} params.description
 * @param {string} params.path - t.ex. "/tjanster/dranering" (utan trailing slash, "/" för startsidan)
 * @param {string} [params.image] - absolut eller site-relativ bildväg för OG/Twitter
 * @returns {string} HTML att klistra in i <head>
 */
function buildMetaTags({ site, title, description, path, image }) {
  const url = path === '/' ? site.url + '/' : site.url + path;
  const ogImage = image
    ? (image.startsWith('http') ? image : site.url + image)
    : `${site.url}/assets/img/og/default-og.jpg`;

  return `<title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeAttr(description)}">
  <link rel="canonical" href="${escapeAttr(url)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${escapeAttr(site.name)}">
  <meta property="og:locale" content="${escapeAttr(site.locale)}">
  <meta property="og:url" content="${escapeAttr(url)}">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:image" content="${escapeAttr(ogImage)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(description)}">
  <meta name="twitter:image" content="${escapeAttr(ogImage)}">`;
}

module.exports = { buildMetaTags };
