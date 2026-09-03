const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml } = require('../../lib/html');

/**
 * @param {object} site - data/site.json
 */
function renderOmOssPage(site) {
  const title = `Om oss — ${site.name}`;
  const description = `Lär känna ${site.name} — mark- och anläggningsföretag i ${site.primaryLocation} med ${site.homeBase} som hemort.`;

  const metaHtml = buildMetaTags({ site, title, description, path: '/om-oss' });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Hem', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Om oss' },
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
            <h1 class="tp-breadcrumb-title fw-600 fs-60 fs-xs-40 ls-m-3 tp-text-common-white lh-1 mb-20">Om oss</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li>Om oss</li></ul></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /BREADCRUMB =============== -->

  <div class="pt-130 pb-130" style="background:var(--nt-white);">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <span class="nt-eyebrow">Om ${escapeHtml(site.shortName)}</span>
          <h2 class="mb-30 fs-xl-40 fs-sm-36 wow img-custom-anim-top" data-wow-duration="1.5s" data-wow-delay="0.2s">${escapeHtml(site.name)}</h2>
          <div class="nt-todo-block">
            [TODO: riktig text från kund] Den här sidan ska innehålla företagets historia, erfarenhet, ägare/team och vad som gör ${escapeHtml(site.shortName)} till rätt val för mark- och anläggningsarbete i ${escapeHtml(site.primaryLocation)}.
          </div>
          <ul class="tp-about-bottom-feature mt-30">
            <li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(site.trustSignals.fSkatt.value)}</li>
            <li><i class="fa-sharp fa-solid fa-check"></i> <b class="nt-todo">${escapeHtml(site.trustSignals.insurance.value)}</b></li>
            <li><i class="fa-sharp fa-solid fa-check"></i> Verksamma i hela ${escapeHtml(site.primaryLocation)}, hemort ${escapeHtml(site.homeBase)}</li>
          </ul>
          <a href="/kontakt" class="tp-btn-xl mt-30 d-inline-block lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-btn-switch-animation tp-text-common-white fw-500">
            <span class="d-flex align-items-center justify-content-center">
              <span class="btn-text">Kontakta oss</span>
              <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
              <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>`;

  return { metaHtml, schemaHtml, bodyContent };
}

module.exports = { renderOmOssPage };
