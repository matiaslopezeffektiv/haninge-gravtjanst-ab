/**
 * Service-schema för en tjänstesida.
 * @param {object} site - data/site.json
 * @param {import('../types').Tjanst} tjanst
 * @returns {object} JSON-LD-nod
 */
function buildServiceSchema(site, tjanst) {
  return {
    '@type': 'Service',
    name: tjanst.name,
    serviceType: tjanst.name,
    description: tjanst.shortDescription,
    provider: { '@id': `${site.url}/#organization` },
    areaServed: {
      '@type': 'City',
      name: tjanst.targetLocation,
    },
    url: `${site.url}/tjanster/${tjanst.slug}`,
  };
}

module.exports = { buildServiceSchema };
