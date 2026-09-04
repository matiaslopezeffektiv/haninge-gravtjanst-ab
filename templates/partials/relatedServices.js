const { escapeHtml } = require('../../lib/html');

/**
 * "Relaterade tjänster" — länkar konsekvent till andra relevanta tjänster
 * från varje tjänstesida (t.ex. husgrundssidan länkar till dränering),
 * istället för att hårdkodas olika i varje sidas brödtext. Vilka tjänster
 * som hör ihop styrs av site.json services[].relatedServices.
 * @param {object} site - data/site.json
 * @param {import('../../lib/types').Tjanst} currentTjanst
 */
function renderRelatedServices(site, currentTjanst) {
  const svc = site.services.find((s) => s.slug === currentTjanst.slug);
  const relatedSlugs = (svc && svc.relatedServices) || [];
  const related = relatedSlugs
    .map((slug) => site.services.find((s) => s.slug === slug))
    .filter(Boolean);

  if (related.length === 0) return '';

  const cards = related.map((r) => `
        <div class="col-md-6">
          <a href="${r.hasPage ? `/tjanster/${r.slug}` : '/tjanster'}" class="nt-related-card">
            <span class="nt-related-card__icon"><i class="fas ${r.icon}"></i></span>
            <span>
              <span class="nt-related-card__label">Relaterad tjänst</span>
              <span class="nt-related-card__name">${escapeHtml(r.name)}</span>
            </span>
            <i class="fas fa-arrow-right nt-related-card__arrow"></i>
          </a>
        </div>`).join('');

  return `
  <!-- =============== RELATERADE TJÄNSTER =============== -->
  <div class="pt-30 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <span class="nt-eyebrow">Relaterade tjänster</span>
      <h2 class="fs-24 fw-700 mb-10" style="color:var(--nt-navy);">Andra tjänster som ofta hör ihop</h2>
      <div class="row g-3 mt-10">${cards}
      </div>
    </div>
  </div>
  <!-- =============== /RELATERADE TJÄNSTER =============== -->`;
}

module.exports = { renderRelatedServices };
