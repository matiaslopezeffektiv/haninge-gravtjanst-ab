const { buildMetaTags } = require('../../lib/metadata');
const { escapeHtml, escapeAttr, isPlaceholder } = require('../../lib/html');

/**
 * 404-sida. Skrivs till dist/404.html av scripts/build.js — Vercel serverar
 * den filen automatiskt för alla vägar som varken matchar en riktig sida
 * eller en post i vercel.json:s redirects-lista (t.ex. en gammal WP-URL vi
 * missat vid domänbytet). Måste alltid finnas kvar, annars faller besökaren
 * tillbaka på Vercels helt oformaterade standardsida.
 * @param {object} site - data/site.json
 */
function renderNotFoundPage(site) {
  const title = `Sidan kunde inte hittas — ${site.name}`;
  const description = 'Sidan du sökte finns inte längre eller har flyttat. Hitta rätt bland våra tjänster och områden, eller kontakta oss direkt.';

  const metaHtml = buildMetaTags({ site, title, description, path: '/404' }) +
    `\n  <meta name="robots" content="noindex, follow">`;

  const phone = isPlaceholder(site.phone) ? site.phone : `<a href="${escapeAttr(site.phoneHref)}">${escapeHtml(site.phone)}</a>`;

  const bodyContent = `
  <!-- =============== 404 =============== -->
  <div class="tp-breadcrumb-area tp-breadcrumb-spacing nt-dark-band pt-180 pb-90" style="background:var(--nt-navy);">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-9">
          <div class="tp-breadcrumb-content">
            <span class="nt-eyebrow nt-eyebrow-light">404</span>
            <h1 class="tp-breadcrumb-title fw-600 fs-52 fs-xs-32 ls-m-3 tp-text-common-white lh-1 mb-20">Sidan kunde inte hittas</h1>
            <p style="color:rgba(255,255,255,0.78);font-size:1.05rem;max-width:620px;margin:0;">Länken kan vara felstavad, eller peka på en sida som flyttat i samband med att vi bytte till en ny webbplats. Prova någon av genvägarna nedan, eller ${phone} om du hellre pratar med oss direkt.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="pt-100 pb-110" style="background:var(--nt-white);">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-6 col-lg-3">
          <a href="/tjanster" class="nt-icon-card d-block" style="text-decoration:none;">
            <span class="nt-icon-card__icon"><i class="fas fa-truck-monster"></i></span>
            <h3>Våra tjänster</h3>
            <p>Dränering, plattsättning, markarbete och mer.</p>
          </a>
        </div>
        <div class="col-md-6 col-lg-3">
          <a href="/omraden" class="nt-icon-card d-block" style="text-decoration:none;">
            <span class="nt-icon-card__icon"><i class="fas fa-location-dot"></i></span>
            <h3>Områden vi jobbar i</h3>
            <p>Haninge, Stockholm och kranskommunerna.</p>
          </a>
        </div>
        <div class="col-md-6 col-lg-3">
          <a href="/blogg" class="nt-icon-card d-block" style="text-decoration:none;">
            <span class="nt-icon-card__icon"><i class="fas fa-book-open"></i></span>
            <h3>Blogg &amp; guider</h3>
            <p>Läsvärt om dränering, tjälskador och renovering.</p>
          </a>
        </div>
        <div class="col-md-6 col-lg-3">
          <a href="/kontakt" class="nt-icon-card d-block" style="text-decoration:none;">
            <span class="nt-icon-card__icon"><i class="fas fa-envelope"></i></span>
            <h3>Kontakta oss</h3>
            <p>Begär en kostnadsfri bedömning av ditt projekt.</p>
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /404 =============== -->`;

  return { metaHtml, schemaHtml: '', bodyContent };
}

module.exports = { renderNotFoundPage };
