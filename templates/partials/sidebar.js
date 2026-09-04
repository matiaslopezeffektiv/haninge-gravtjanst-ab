const { escapeHtml, escapeAttr } = require('../../lib/html');

/**
 * Delade sidopanel-kort för tjänstesidor och tjänst×ort-sidor (samma visuella
 * språk på båda, se templates/pages/tjanst.js och templates/pages/ort.js).
 */

function renderSidebarNav(site, currentSlug) {
  const items = site.services.map((svc) => `
      <li class="${svc.slug === currentSlug ? 'is-active' : ''}"><a href="/tjanster/${svc.slug}">${escapeHtml(svc.name)} <i class="fas fa-arrow-right"></i></a></li>`).join('');
  return `
        <div class="nt-side-card">
          <h3>Alla tjänster</h3>
          <ul class="nt-side-nav">${items}
          </ul>
        </div>`;
}

function renderSidebarContact(site) {
  return `
        <div class="nt-side-card nt-side-card--navy">
          <h3>Kontakta oss direkt</h3>
          <p style="color:rgba(255,255,255,.65);font-size:.85rem;margin-bottom:4px;">Ring oss</p>
          <a href="${escapeAttr(site.phoneHref)}" style="color:#F5B400;font-weight:700;font-size:1.3rem;display:block;margin-bottom:16px;text-decoration:none;">${escapeHtml(site.phone)}</a>
          <p style="color:rgba(255,255,255,.65);font-size:.85rem;margin-bottom:4px;">E-post</p>
          <a href="mailto:${escapeAttr(site.email)}" style="color:#fff;font-weight:600;text-decoration:none;">${escapeHtml(site.email)}</a>
        </div>`;
}

function renderSidebarWhyUs(site) {
  const t = site.trustSignals;
  return `
        <div class="nt-side-card">
          <h3>Varför Haninge Grävtjänst?</h3>
          <div class="tp-about-bottom-feature" style="margin:0;"><ul>
            <li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(t.fSkatt.value)}</li>
            <li><i class="fa-sharp fa-solid fa-check"></i> Ansvarsförsäkring och garanti på utfört arbete</li>
            <li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(String(t.yearsExperience))}+ års erfarenhet, ${escapeHtml(String(t.projectsCompleted))}+ projekt</li>
            <li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(String(t.reviews.averageRating))}/5 på <a href="${escapeAttr(t.reviews.url)}" target="_blank" rel="noopener">Reco</a></li>
          </ul></div>
        </div>`;
}

module.exports = { renderSidebarNav, renderSidebarContact, renderSidebarWhyUs };
