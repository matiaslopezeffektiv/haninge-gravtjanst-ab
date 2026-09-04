const { escapeHtml, escapeAttr } = require('../../lib/html');

/**
 * Kundrecensioner — riktiga citat från Reco.se, med länk till alla
 * recensioner. AggregateRating-schemat byggs separat i lib/schema/review.js
 * utifrån site.trustSignals.reviews (ingen påhittad enskild betygssättning).
 * @param {object} site - data/site.json
 */
function renderTestimonials(site) {
  const t = site.trustSignals.reviews;
  const quotes = (site.testimonials || []).slice(0, 3).map((q) => `
        <div class="col-md-4">
          <div class="nt-quote h-100">
            <div class="nt-quote__stars">★★★★★</div>
            <p>&rdquo;${escapeHtml(q.text)}&rdquo;</p>
            <div class="nt-quote__author">
              <div class="nt-quote__avatar">${escapeHtml(q.author.charAt(0))}</div>
              <div>
                <h6>${escapeHtml(q.author)}</h6>
                <span>Reco.se</span>
              </div>
            </div>
          </div>
        </div>`).join('');

  return `
  <!-- =============== KUNDRECENSIONER =============== -->
  <div class="pt-100 pb-100" style="background:var(--nt-gray-light);">
    <div class="container">
      <div class="row justify-content-center mb-50 text-center">
        <div class="col-xl-7">
          <span class="nt-eyebrow" style="justify-content:center;">Kundrecensioner</span>
          <h2 class="fs-xl-40 fs-sm-36">Vad våra kunder säger</h2>
          <p style="color:var(--nt-gray);">${escapeHtml(String(t.averageRating))} av 5 i snittbetyg baserat på ${escapeHtml(String(t.count))} recensioner på <a href="${escapeAttr(t.url)}" target="_blank" rel="noopener">Reco.se</a>.</p>
        </div>
      </div>
      <div class="row g-4">${quotes}
      </div>
    </div>
  </div>
  <!-- =============== /KUNDRECENSIONER =============== -->`;
}

module.exports = { renderTestimonials };
