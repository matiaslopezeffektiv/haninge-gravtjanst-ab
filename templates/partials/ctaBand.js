const { escapeHtml, escapeAttr, isPlaceholder } = require('../../lib/html');

/**
 * Mörk CTA-band med"Begär offert" + telefon-genväg. Fanns i referensmallen
 * på både start- och kontaktsidan (som en sista knuff för den som scrollat
 * igenom utan att skicka formuläret).
 * @param {object} site - data/site.json
 * @param {object} params
 * @param {string} params.eyebrow
 * @param {string} params.heading
 * @param {string} params.subtext
 */
function renderCtaBand(site, { eyebrow, heading, subtext }) {
  const phoneHtml = isPlaceholder(site.phone)
    ? `<b class="nt-todo">${escapeHtml(site.phone)}</b>`
    : `<a href="${escapeAttr(site.phoneHref)}" style="color:#fff;">${escapeHtml(site.phone)}</a>`;

  return `
  <!-- =============== CTA =============== -->
  <div class="tp-cta-area nt-dark-band pt-120 pb-120" style="background:var(--nt-navy-dark);">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-10">
          <span class="nt-eyebrow nt-eyebrow-light">${escapeHtml(eyebrow)}</span>
          <h2 class="mb-15 fs-xl-40 fs-sm-36 tp-text-common-white">${escapeHtml(heading)}</h2>
          <p class="mb-40" style="color:rgba(255,255,255,0.78);font-size:1.05rem;max-width:620px;">${escapeHtml(subtext)}</p>
          <div class="d-flex flex-wrap align-items-center gap-4">
            <a href="/kontakt" class="tp-btn-xl d-inline-block lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-btn-switch-animation tp-text-common-white fw-500">
              <span class="d-flex align-items-center justify-content-center">
                <span class="btn-text">Begär offert</span>
                <span class="btn-icon"><i class="fas fa-arrow-right"></i></span>
                <span class="btn-icon"><i class="fas fa-arrow-right"></i></span>
              </span>
            </a>
            <span class="d-inline-flex align-items-center gap-3">
              <span style="width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;">
                <i class="fas fa-phone" style="color:#F5B400;"></i>
              </span>
              <span>
                <span style="display:block;color:rgba(255,255,255,0.6);font-size:.8rem;">Ring oss direkt</span>
                <span style="display:block;color:#fff;font-weight:700;font-size:1.05rem;">${phoneHtml}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /CTA =============== -->`;
}

module.exports = { renderCtaBand };
