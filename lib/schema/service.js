/**
 * Service-schema för en tjänstesida. Används även för tjänst×ort-sidor via
 * `overrides` (areaName/url) — se templates/pages/ort.js.
 * @param {object} site - data/site.json
 * @param {import('../types').Tjanst} tjanst
 * @param {object} [overrides]
 * @param {string} [overrides.areaName] - ersätter tjanst.targetLocation i areaServed
 * @param {string} [overrides.url] - ersätter den genererade tjänst-URL:en
 * @returns {object} JSON-LD-nod
 */
function buildServiceSchema(site, tjanst, overrides) {
  // On the parent /tjanster/[slug] page (no overrides.areaName), reflect all
  // areas we actually serve rather than collapsing to tjanst.targetLocation's
  // single generic city — matches the granularity buildLocalBusinessSchema
  // already uses. Tjänst×ort and område pages pass a single areaName since
  // they're specifically about that one area.
  const areaServed = (overrides && overrides.areaName)
    ? { '@type': 'City', name: overrides.areaName }
    : (site.areasServed || []).map((a) => ({ '@type': 'City', name: a.name }));
  const url = (overrides && overrides.url) || `${site.url}/tjanster/${tjanst.slug}`;
  return {
    '@type': 'Service',
    name: tjanst.name,
    serviceType: tjanst.name,
    description: tjanst.shortDescription,
    provider: { '@id': `${site.url}/#organization` },
    areaServed,
    url,
    image: tjanst.heroImage ? `${site.url}${tjanst.heroImage}` : undefined,
  };
}

module.exports = { buildServiceSchema };
