/**
 * FAQPage-schema. Returnerar null om ingen FAQ finns — vi vill aldrig
 * emittera ett tomt/falskt FAQPage-schema.
 * @param {import('../types').FaqItem[]} faq
 * @returns {object|null} JSON-LD-nod
 */
function buildFaqSchema(faq) {
  if (!faq || faq.length === 0) return null;

  return {
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

module.exports = { buildFaqSchema };
