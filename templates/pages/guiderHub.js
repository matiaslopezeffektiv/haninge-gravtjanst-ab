const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, buildBreadcrumbSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr } = require('../../lib/html');

function guideCard(guide) {
  return `
        <div class="col-md-6">
          <a href="/guider/${escapeAttr(guide.slug)}" class="nt-icon-card position-relative" style="display:block;">
            <div class="nt-icon-card__icon"><i class="fas fa-book-open"></i></div>
            <h2>${escapeHtml(guide.title)}</h2>
            <p>${escapeHtml(guide.metaDescription)}</p>
            <span class="nt-icon-card__link">Läs guiden <i class="fas fa-arrow-right"></i></span>
          </a>
        </div>`;
}

/**
 * @param {object} site - data/site.json
 * @param {object[]} guider - alla data/guider/*.json
 */
function renderGuiderHubPage(site, guider) {
  const title = `Guider — ${site.name}`;
  const description = `Guider om ROT-avdrag, bygglov och marklov för mark- och anläggningsarbete i ${site.primaryLocation} och ${site.homeBase}.`;

  const metaHtml = buildMetaTags({ site, title, description, path: '/guider' });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    buildBreadcrumbSchema([
      { name: 'Hem', url: `${site.url}/` },
      { name: 'Guider' },
    ]),
  ]);

  const bodyContent = `
  <!-- =============== BREADCRUMB =============== -->
  <div class="tp-breadcrumb-area tp-breadcrumb-spacing nt-dark-band pt-180 pb-90" style="background:var(--nt-navy);">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-9">
          <div class="tp-breadcrumb-content">
            <h1 class="tp-breadcrumb-title fw-600 fs-60 fs-xs-40 ls-m-3 tp-text-common-white lh-1 mb-20">Guider om ROT-avdrag, bygglov och markarbete</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li>Guider</li></ul></div>
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
          <p style="color:var(--nt-gray);font-size:1.05rem;">Praktiska guider som reder ut vanliga frågor kring regler och ekonomi vid mark- och anläggningsarbete — baserade på Skatteverkets och kommunernas egna riktlinjer.</p>
        </div>
      </div>
      <div class="row g-4">${guider.map(guideCard).join('')}
      </div>
    </div>
  </div>`;

  return { metaHtml, schemaHtml, bodyContent };
}

module.exports = { renderGuiderHubPage };
