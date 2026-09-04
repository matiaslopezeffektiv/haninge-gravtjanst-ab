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
  const areaName = (overrides && overrides.areaName) || tjanst.targetLocation;
  const url = (overrides && overrides.url) || `${site.url}/tjanster/${tjanst.slug}`;
  return {
    '@type': 'Service',
    name: tjanst.name,
    serviceType: tjanst.name,
    description: tjanst.shortDescription,
    provider: { '@id': `${site.url}/#organization` },
    areaServed: {
      '@type': 'City',
      name: areaName,
    },
    url,
  };
}

module.exports = { buildServiceSchema };
