const { buildLocalBusinessSchema } = require('./localBusiness');
const { buildServiceSchema } = require('./service');
const { buildFaqSchema } = require('./faqPage');
const { buildReviewSchema } = require('./review');
const { buildBreadcrumbSchema } = require('./breadcrumb');

/**
 * Slår ihop ett antal schema-noder till en @graph och renderar dem som en
 * enda <script type="application/ld+json">-tagg. Noder som är null/undefined
 * filtreras bort (t.ex. FAQPage när sidan saknar FAQ).
 * @param {Array<object|null|undefined>} nodes
 * @returns {string}
 */
function renderSchemaGraph(nodes) {
  const graph = nodes.filter(Boolean);
  if (graph.length === 0) return '';
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

module.exports = {
  buildLocalBusinessSchema,
  buildServiceSchema,
  buildFaqSchema,
  buildReviewSchema,
  buildBreadcrumbSchema,
  renderSchemaGraph,
};
