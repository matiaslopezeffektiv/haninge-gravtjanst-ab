const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml } = require('../../lib/html');
const { renderSatelliteLink } = require('../partials/satelliteLink');

function serviceCard(site, svc, tjansterBySlug) {
  if (svc.hasPage) {
    const tjanst = tjansterBySlug && tjansterBySlug[svc.slug];
    const shortDescription = tjanst ? tjanst.shortDescription : '[TODO: kort beskrivning från kund]';
    return `
        <div class="col-xl-4 col-md-6">
          <div class="nt-icon-card position-relative">
            <div class="nt-icon-card__icon"><i class="fas ${svc.icon}"></i></div>
            <h4><a href="/tjanster/${svc.slug}">${escapeHtml(svc.name)}</a></h4>
            <p>${escapeHtml(shortDescription)}</p>
            <a class="nt-icon-card__link" href="/tjanster/${svc.slug}">Läs mer <i class="fas fa-arrow-right"></i></a>
            ${renderSatelliteLink(site, svc.slug)}
          </div>
        </div>`;
  }
  return `
        <div class="col-xl-4 col-md-6">
          <div class="nt-icon-card position-relative" style="opacity:.6;">
            <span class="nt-coming-soon__badge" style="position:absolute;top:20px;right:20px;">Kommer snart</span>
            <div class="nt-icon-card__icon"><i class="fas ${svc.icon}"></i></div>
            <h4>${escapeHtml(svc.name)}</h4>
            <p>[TODO: kort beskrivning från kund]</p>
          </div>
        </div>`;
}

/**
 * @param {object} site - data/site.json
 */
function renderTjansterHubPage(site, tjansterBySlug) {
  const title = `Våra tjänster — ${site.name}`;
  const description = `Dränering, plattsättning, husgrundsarbete, finplanering, markanläggning, asfaltering och markarbeten — alla våra tjänster i ${site.primaryLocation} och ${site.homeBase}.`;

  const metaHtml = buildMetaTags({ site, title, description, path: '/tjanster' });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Hem', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Tjänster' },
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
            <h1 class="tp-breadcrumb-title fw-600 fs-60 fs-xs-40 ls-m-3 tp-text-common-white lh-1 mb-20">Våra tjänster</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li>Tjänster</li></ul></div>
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
          <p style="color:var(--nt-gray);font-size:1.05rem;">${escapeHtml(site.name)} utför mark- och anläggningsarbete i hela ${escapeHtml(site.primaryLocation)}, med ${escapeHtml(site.homeBase)} som hemort. Varje tjänst har en egen sida med mer information — övriga tjänster publiceras löpande.</p>
        </div>
      </div>
      <div class="row g-4">${site.services.map((svc) => serviceCard(site, svc, tjansterBySlug)).join('')}
      </div>
    </div>
  </div>`;

  return { metaHtml, schemaHtml, bodyContent };
}

module.exports = { renderTjansterHubPage };
