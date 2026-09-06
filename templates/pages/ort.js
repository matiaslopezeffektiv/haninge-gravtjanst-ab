const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, buildServiceSchema, buildBreadcrumbSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr } = require('../../lib/html');
const { renderProcessSteps } = require('../partials/processSteps');
const { renderCtaBand } = require('../partials/ctaBand');
const { renderSourceLinks } = require('../partials/sourceLinks');
const { renderSidebarNav, renderSidebarContact, renderSidebarWhyUs } = require('../partials/sidebar');

function pointItem(text) {
  return `<li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(text)}</li>`;
}

/**
 * Tjänst×ort-sida, t.ex. "Dränering i Haninge" (/tjanster/dranering/haninge).
 * Kortare och mer riktad än förälder-tjänstens Stockholm-sida — fullständig
 * FAQ/considerations finns bara där, för att undvika duplicerat innehåll
 * mellan de många ort-sidorna. Se lib/types.js (Ort) för schemat.
 * @param {object} site - data/site.json
 * @param {import('../../lib/types').Tjanst} tjanst - förälder-tjänsten
 * @param {import('../../lib/types').Ort} ort
 * @param {import('../../lib/types').Omrade} [omrade] - för länk till stadsdelens hubbsida, om den finns
 */
function renderOrtPage(site, tjanst, ort, omrade) {
  const metaHtml = buildMetaTags({
    site,
    title: ort.metaTitle,
    description: ort.metaDescription,
    path: `/tjanster/${tjanst.slug}/${ort.slug}`,
  });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    buildServiceSchema(site, tjanst, {
      areaName: ort.name,
      url: `${site.url}/tjanster/${tjanst.slug}/${ort.slug}`,
    }),
    buildBreadcrumbSchema([
      { name: 'Hem', url: `${site.url}/` },
      { name: 'Tjänster', url: `${site.url}/tjanster` },
      { name: tjanst.name, url: `${site.url}/tjanster/${tjanst.slug}` },
      { name: ort.name },
    ]),
  ]);

  const referenceProjectsBlock = (ort.referenceProjects && ort.referenceProjects.length)
    ? `
  <div class="pt-30 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <span class="nt-eyebrow">Referensprojekt</span>
      <h2 class="fs-xl-40 fs-sm-36 mb-40">${escapeHtml(tjanst.name)} i ${escapeHtml(ort.name)} — exempel från våra uppdrag</h2>
      <div class="row g-4">${ort.referenceProjects.map((p) => `
        <div class="col-md-4">
          <div class="nt-icon-card" style="padding:0;overflow:hidden;">
            ${p.image ? `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" style="width:100%;height:200px;object-fit:cover;display:block;">` : ''}
            <div style="padding:24px 26px;">
              <h3>${escapeHtml(p.title)}</h3>
              <p>${escapeHtml(p.description)}</p>
            </div>
          </div>
        </div>`).join('')}</div>
    </div>
  </div>` : '';

  // ort.intro renderas orenat — se motsvarande kommentar i templates/pages/tjanst.js.
  const bodyContent = `
  <!-- =============== BREADCRUMB =============== -->
  <div class="tp-breadcrumb-area tp-breadcrumb-spacing nt-dark-band pt-180 pb-90"${tjanst.heroImage ? ` style="background-image:url('${escapeAttr(tjanst.heroImage)}');"` : ''}>
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-9">
          <div class="tp-breadcrumb-content">
            <h1 class="tp-breadcrumb-title fw-600 fs-60 fs-xs-40 ls-m-3 tp-text-common-white lh-1 mb-20">${escapeHtml(ort.h1)}</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li><a href="/tjanster">Tjänster</a></li><li class="dvdr">/</li><li><a href="/tjanster/${tjanst.slug}">${escapeHtml(tjanst.name)}</a></li><li class="dvdr">/</li><li>${escapeHtml(ort.name)}</li></ul></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /BREADCRUMB =============== -->

  <!-- =============== HUVUDINNEHÅLL + SIDOPANEL =============== -->
  <div class="pt-100 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <div class="row">
        <div class="col-lg-8">
          <span class="nt-eyebrow">${escapeHtml(tjanst.name)} i ${escapeHtml(ort.name)}</span>
          <h2 class="mb-25 fs-xl-40 fs-sm-36" style="color:var(--nt-navy);">${escapeHtml(ort.h1)}</h2>
          ${ort.intro.map((p) => `<p style="color:var(--nt-gray);line-height:1.8;" class="mb-20">${p}</p>`).join('')}

          ${(ort.localPoints && ort.localPoints.length) ? `
          <h3 class="fs-24 fw-700 mt-30 mb-20" style="color:var(--nt-navy);">Bra att veta om ${escapeHtml(tjanst.name.toLowerCase())} i ${escapeHtml(ort.name)}</h3>
          <div class="tp-about-bottom-feature mb-10"><ul>${ort.localPoints.map(pointItem).join('')}</ul></div>` : ''}

          <a href="/kontakt" class="tp-btn-xl mt-30 d-inline-block lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-btn-switch-animation tp-text-common-white fw-500">
            <span class="d-flex align-items-center justify-content-center">
              <span class="btn-text">Begär offert på ${escapeHtml(tjanst.name.toLowerCase())} i ${escapeHtml(ort.name)}</span>
              <span class="btn-icon"><i class="fas fa-arrow-right"></i></span>
              <span class="btn-icon"><i class="fas fa-arrow-right"></i></span>
            </span>
          </a>

          <div class="nt-highlight mt-40" style="max-width:640px;">
            <p style="color:var(--nt-gray);line-height:1.8;margin:0;">
              Vill du läsa mer om hela processen, vad som ingår och vanliga frågor kring ${escapeHtml(tjanst.name.toLowerCase())}?
              Besök vår huvudsida för <a href="/tjanster/${tjanst.slug}">${escapeHtml(tjanst.name.toLowerCase())} i Stockholm</a>${omrade ? ` eller se alla tjänster vi erbjuder i <a href="/omraden/${escapeAttr(omrade.slug)}">${escapeHtml(omrade.name)}</a>` : ''}.
            </p>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="nt-side-sticky">
            ${renderSidebarContact(site)}
            ${renderSidebarWhyUs(site)}
            ${renderSidebarNav(site, tjanst.slug)}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /HUVUDINNEHÅLL + SIDOPANEL =============== -->

  ${renderProcessSteps({ eyebrow: 'Så går det till', heading: `${tjanst.name} steg för steg`, steps: tjanst.process })}

  ${referenceProjectsBlock}

  ${renderSourceLinks(site, tjanst.sourceKeys || [])}

  ${renderCtaBand(site, {
    eyebrow: 'Redo att börja?',
    heading: `Kontakta oss för ${tjanst.name.toLowerCase()} i ${ort.name}`,
    subtext: 'Berätta om ditt projekt så återkommer vi med en kostnadsfri bedömning och offert.',
  })}`;

  return { metaHtml, schemaHtml, bodyContent, preloadImage: tjanst.heroImage };
}

module.exports = { renderOrtPage };
