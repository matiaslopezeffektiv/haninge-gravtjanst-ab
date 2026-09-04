const { escapeHtml, isPlaceholder } = require('../../lib/html');

function trustBadge(icon, label, value) {
  const valueHtml = isPlaceholder(value) ? `<b class="nt-todo">${escapeHtml(value)}</b>` : escapeHtml(value);
  return `
          <div class="col-lg-4 col-md-6 tp-counter-3-border">
            <div class="tp-feature-3-wrap tpshake-wrap d-flex md-space">
              <span class="mr-25" style="margin-bottom:0;flex-shrink:0;"><i class="fas ${icon}" style="color:#F5B400;"></i></span>
              <div>
                <h3 class="fs-24 fw-600 mb-10" style="color:var(--nt-navy);">${escapeHtml(label)}</h3>
                <p style="color:var(--nt-gray);margin:0;">${valueHtml}</p>
              </div>
            </div>
          </div>`;
}

/**
 * Trygghetspunkter — F-skatt/ansvarsförsäkring/certifiering. Delad mellan
 * startsidan och kontaktsidan så trust-signalerna syns på båda (fanns på
 * båda i referensmallen).
 * @param {object} site - data/site.json
 */
function renderTrustBadges(site) {
  const t = site.trustSignals;
  return `
  <!-- =============== TRYGGHETSPUNKTER =============== -->
  <div class="tp-feature-area tp-feature-4-wrap pt-90 pb-60 fix" style="background:var(--nt-white);">
    <div class="container">
      <div class="tp-border-bottom pb-30">
        <div class="row gx-60">
          ${trustBadge('fa-file-invoice', t.fSkatt.label, t.fSkatt.value)}
          ${trustBadge('fa-shield-check', t.insurance.label, t.insurance.value)}
          ${trustBadge('fa-award', 'Erfarenhet', `${t.yearsExperience}+ års erfarenhet och ${t.projectsCompleted}+ genomförda projekt.`)}
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /TRYGGHETSPUNKTER =============== -->`;
}

module.exports = { renderTrustBadges };
