const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr } = require('../../lib/html');

function areaCard(omrade) {
  return `
        <div class="col-xl-4 col-md-6">
          <a href="/omraden/${escapeAttr(omrade.slug)}" class="nt-icon-card position-relative" style="display:block;">
            <div class="nt-icon-card__icon"><i class="fas fa-location-dot"></i></div>
            <span class="nt-eyebrow" style="margin-bottom:6px;">${escapeHtml(omrade.region)}</span>
            <h4>${escapeHtml(omrade.name)}</h4>
            <p>${escapeHtml(omrade.shortDescription)}</p>
            <span class="nt-icon-card__link">Läs mer <i class="fas fa-arrow-right"></i></span>
          </a>
        </div>`;
}

/**
 * Hubbsida (/omraden) — index över alla stadsdelar med egen /omraden/[slug]-sida.
 * @param {object} site - data/site.json
 * @param {import('../../lib/types').Omrade[]} omraden
 */
function renderOmradenHubPage(site, omraden) {
  const title = `Områden vi jobbar i — ${site.name}`;
  const description = `${site.name} jobbar i hela Stockholmsområdet. Se vilka stadsdelar vi utför dränering, markarbeten och andra tjänster i.`;

  const metaHtml = buildMetaTags({ site, title, description, path: '/omraden' });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Hem', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Områden' },
      ],
    },
  ]);

  const bodyContent = `
  <!-- =============== BREADCRUMB =============== -->
  <div class="tp-breadcrumb-area tp-breadcrumb-spacing nt-dark-band pt-180 pb-90" style="background:var(--nt-navy);">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-9">
          <div class="tp-breadcrumb-content">
            <h1 class="tp-breadcrumb-title fw-600 fs-60 fs-xs-40 ls-m-3 tp-text-common-white lh-1 mb-20">Områden vi jobbar i</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li>Områden</li></ul></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /BREADCRUMB =============== -->

  <div class="tp-service-area pt-130 pb-130" style="background:var(--nt-white);">
    <div class="container">
      <div class="row justify-content-center mb-60">
        <div class="col-xl-8 text-center">
          <p style="color:var(--nt-gray);font-size:1.05rem;">Med ${escapeHtml(site.homeBase)} som hemort utför vi mark- och anläggningsarbete i hela ${escapeHtml(site.primaryLocation)}. Varje område har olika förutsättningar — från villaförorternas äldre husgrunder till innerstadens gemensamma innergårdar — och vi anpassar arbetet därefter.</p>
        </div>
      </div>
      <div class="row g-4">${omraden.map(areaCard).join('')}
      </div>
    </div>
  </div>`;

  return { metaHtml, schemaHtml, bodyContent };
}

module.exports = { renderOmradenHubPage };
