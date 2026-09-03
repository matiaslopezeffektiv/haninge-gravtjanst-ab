/**
 * LocalBusiness-schema för företaget — renderas en gång i layouten (alla sidor).
 * @param {object} site - data/site.json
 * @returns {object} JSON-LD-nod
 */
function buildLocalBusinessSchema(site) {
  return {
    '@type': ['GeneralContractor', 'LocalBusiness'],
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    // TODO: verklig logotyp-fil när varumärke är klart — just nu en text-baserad platshållare
    logo: `${site.url}/assets/img/logo/haninge-logo-color.svg`,
    image: `${site.url}/assets/img/logo/haninge-logo-color.svg`,
    description: site.description,
    telephone: site.phone.startsWith('[TODO') ? undefined : site.phone,
    email: site.email.startsWith('[TODO') ? undefined : site.email,
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
    areaServed: site.areasServed.map((name) => ({ '@type': 'City', name })),
    sameAs: site.sameAs && site.sameAs.length ? site.sameAs : undefined,
  };
}

module.exports = { buildLocalBusinessSchema };
