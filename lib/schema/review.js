/**
 * AggregateRating + Review-schema. Strukturen är förberedd men returnerar
 * null tills riktiga recensioner finns — vi emitterar aldrig påhittade betyg.
 *
 * @param {object} params
 * @param {{count: number|null, averageRating: number|null}} params.reviewSummary - site.trustSignals.reviews
 * @param {Array<{author: string, rating: number, text: string, date?: string}>} [params.reviews] - enskilda recensioner, tomt tills riktiga finns
 * @returns {{aggregateRating: object|null, reviews: object[]}}
 */
function buildReviewSchema({ reviewSummary, reviews = [] }) {
  const aggregateRating = reviewSummary && reviewSummary.count && reviewSummary.averageRating
    ? {
      '@type': 'AggregateRating',
      ratingValue: reviewSummary.averageRating,
      reviewCount: reviewSummary.count,
    }
    : null;

  const reviewNodes = reviews.map((r) => ({
    '@type': 'Review',
    author: { '@type': 'Person', name: r.author },
    reviewRating: { '@type': 'Rating', ratingValue: r.rating },
    reviewBody: r.text,
    datePublished: r.date,
  }));

  return { aggregateRating, reviews: reviewNodes };
}

module.exports = { buildReviewSchema };
