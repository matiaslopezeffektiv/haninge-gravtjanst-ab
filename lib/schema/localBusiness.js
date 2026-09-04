const { isPlaceholder } = require('../html');
const { buildReviewSchema } = require('./review');

/**
 * LocalBusiness-schema för företaget — renderas en gång i layouten (alla sidor).
 * @param {object} site - data/site.json
 * @returns {object} JSON-LD-nod
 */
function buildLocalBusinessSchema(site) {
  const { aggregateRating } = buildReviewSchema({ reviewSummary: site.trustSignals.reviews });

  return {
    '@type': ['GeneralContractor', 'LocalBusiness'],
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/assets/img/logo/haninge.png`,
    image: `${site.url}${site.heroImage}`,
    description: site.description,
    // schema.org vill ha telephone i maskinläsbart format, inte visningsformatet med mellanslag/bindestreck.
    telephone: isPlaceholder(site.phone) ? undefined : site.phoneHref.replace(/^tel:/, ''),
    email: isPlaceholder(site.email) ? undefined : site.email,
    taxID: site.orgNumber,
    priceRange: site.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.streetAddress,
      postalCode: site.address.postalCode,
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      addressCountry: site.address.addressCountry,
    },
    geo: site.geo.latitude && site.geo.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    } : undefined,
    areaServed: site.areasServed.map((a) => ({ '@type': 'City', name: a.name })),
    aggregateRating: aggregateRating || undefined,
    sameAs: site.sameAs && site.sameAs.length ? site.sameAs : undefined,
  };
}

module.exports = { buildLocalBusinessSchema };
