/**
 * BreadcrumbList-schema. Sista posten (aktuell sida) utelämnar normalt `url`
 * — ett vedertaget, av Google godkänt mönster — men skicka med den om du vill
 * undvika varningar i vissa validerare.
 * @param {Array<{name: string, url?: string}>} items
 * @returns {object} JSON-LD-nod
 */
function buildBreadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

module.exports = { buildBreadcrumbSchema };
