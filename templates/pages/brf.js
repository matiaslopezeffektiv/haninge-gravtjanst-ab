const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, buildFaqSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml } = require('../../lib/html');
const { renderProcessSteps } = require('../partials/processSteps');
const { renderTrustBadges } = require('../partials/trustBadges');
const { renderTestimonials } = require('../partials/testimonials');
const { renderSourceLinks } = require('../partials/sourceLinks');
const { renderCtaBand } = require('../partials/ctaBand');

function painPointItem(text) {
  return `<li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(text)}</li>`;
}

function relevantServiceCard(site, item) {
  const svc = site.services.find((s) => s.slug === item.slug);
  if (!svc) return '';
  return `
        <div class="col-md-6">
          <div class="nt-highlight h-100">
            <span class="nt-highlight__icon"><i class="fas ${svc.icon}"></i></span>
            <h5>${escapeHtml(svc.name)}</h5>
            <p style="color:var(--nt-gray);font-size:.92rem;line-height:1.7;margin:8px 0 12px;">${escapeHtml(item.blurb)}</p>
            <a href="/tjanster/${item.slug}" style="color:var(--nt-navy);font-weight:600;font-size:.9rem;text-decoration:underline;">Läs mer om ${svc.name.toLowerCase()} <i class="fas fa-arrow-right" style="margin-left:4px;"></i></a>
          </div>
        </div>`;
}

// item.answer renderas orenat, se lib/schema-fria kommentaren i tjanst.js.
function faqItem(item) {
  return `
        <details class="nt-faq-item">
          <summary>${escapeHtml(item.question)}</summary>
          <p>${item.answer}</p>
        </details>`;
}

/**
 * @param {object} site - data/site.json
 * @param {object} brf - data/brf.json
 */
function renderBrfPage(site, brf) {
  const metaHtml = buildMetaTags({ site, title: brf.metaTitle, description: brf.metaDescription, path: '/brf' });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    buildFaqSchema(brf.faq),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Hem', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'BRF' },
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
            <h1 class="tp-breadcrumb-title fw-600 fs-60 fs-xs-40 ls-m-3 tp-text-common-white lh-1 mb-20">${escapeHtml(brf.h1)}</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li>BRF</li></ul></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /BREADCRUMB =============== -->

  <!-- =============== INTRO =============== -->
  <div class="pt-100 pb-60" style="background:var(--nt-white);">
    <div class="container">
      <div class="row">
        <div class="col-lg-9">
          <span class="nt-eyebrow">Bostadsrättsföreningar &amp; samfälligheter</span>
          <h2 class="mb-25 fs-xl-40 fs-sm-36" style="color:var(--nt-navy);">En pålitlig partner för föreningens mark- och gårdsprojekt</h2>
          ${brf.intro.map((p) => `<p style="color:var(--nt-gray);line-height:1.8;" class="mb-20">${escapeHtml(p)}</p>`).join('')}
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /INTRO =============== -->

  <!-- =============== VANLIGA UTMANINGAR =============== -->
  <div class="pt-30 pb-70" style="background:var(--nt-white);">
    <div class="container">
      <div class="row">
        <div class="col-lg-9">
          <h3 class="fs-24 fw-700 mb-20" style="color:var(--nt-navy);">Vanliga utmaningar vi hjälper styrelser lösa</h3>
          <div class="tp-about-bottom-feature mb-10"><ul>${brf.painPoints.map(painPointItem).join('')}</ul></div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /VANLIGA UTMANINGAR =============== -->

  <!-- =============== TJÄNSTER FÖR BRF =============== -->
  <div class="pt-30 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <span class="nt-eyebrow">Vad vi utför åt föreningar</span>
      <h2 class="mb-30 fs-xl-40 fs-sm-36" style="color:var(--nt-navy);">Tjänster som är vanligast hos våra BRF-kunder</h2>
      <div class="row g-3">${brf.relevantServices.map((item) => relevantServiceCard(site, item)).join('')}
      </div>
    </div>
  </div>
  <!-- =============== /TJÄNSTER FÖR BRF =============== -->

  ${renderTrustBadges(site)}

  ${renderProcessSteps({ eyebrow: 'Så går det till', heading: 'Från första kontakt till slutbesiktning', steps: brf.process })}

  ${renderTestimonials(site)}

  <!-- =============== FAQ =============== -->
  <div class="pt-30 pb-130" style="background:var(--nt-white);">
    <div class="container">
      <div class="row justify-content-center mb-50">
        <div class="col-xl-7 text-center">
          <span class="nt-eyebrow" style="justify-content:center;">Vanliga frågor</span>
          <h2 class="fs-xl-40 fs-sm-36">Frågor från styrelser och förvaltare</h2>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-9">${brf.faq.map(faqItem).join('')}
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /FAQ =============== -->

  ${renderSourceLinks(site, brf.sourceKeys || [])}

  ${renderCtaBand(site, {
    eyebrow: 'Redo att börja?',
    heading: 'Berätta om er förenings projekt',
    subtext: 'Kontakta oss så återkommer vi med en kostnadsfri bedömning och ett tydligt underlag för styrelsen.',
  })}`;

  return { metaHtml, schemaHtml, bodyContent };
}

module.exports = { renderBrfPage };
