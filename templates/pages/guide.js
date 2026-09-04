const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, buildFaqSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml } = require('../../lib/html');
const { renderSourceLinks } = require('../partials/sourceLinks');
const { renderCtaBand } = require('../partials/ctaBand');

function listItem(text) {
  return `<li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(text)}</li>`;
}

function section(s) {
  return `
          <h3 class="fs-24 fw-700 mt-40 mb-20" style="color:var(--nt-navy);">${escapeHtml(s.heading)}</h3>
          ${s.body.map((p) => `<p style="color:var(--nt-gray);line-height:1.8;" class="mb-16">${p}</p>`).join('')}
          ${(s.list && s.list.length) ? `<div class="tp-about-bottom-feature mb-10"><ul>${s.list.map(listItem).join('')}</ul></div>` : ''}`;
}

function faqItem(item) {
  return `
        <details class="nt-faq-item">
          <summary>${escapeHtml(item.question)}</summary>
          <p>${escapeHtml(item.answer)}</p>
        </details>`;
}

/**
 * @param {object} site - data/site.json
 * @param {object} guide - data/guider/[slug].json
 */
function renderGuidePage(site, guide) {
  const metaHtml = buildMetaTags({ site, title: guide.metaTitle, description: guide.metaDescription, path: `/guider/${guide.slug}` });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    buildFaqSchema(guide.faq),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Hem', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Guider', item: `${site.url}/guider` },
        { '@type': 'ListItem', position: 3, name: guide.title },
      ],
    },
  ]);

  // guide.intro/sections[].body renderas orenat — se motsvarande kommentar i templates/pages/tjanst.js.
  const bodyContent = `
  <!-- =============== BREADCRUMB =============== -->
  <div class="tp-breadcrumb-area tp-breadcrumb-spacing nt-dark-band pt-180 pb-90" style="background:var(--nt-navy);">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-9">
          <div class="tp-breadcrumb-content">
            <h1 class="tp-breadcrumb-title fw-600 fs-60 fs-xs-40 ls-m-3 tp-text-common-white lh-1 mb-20">${escapeHtml(guide.h1)}</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li><a href="/guider">Guider</a></li><li class="dvdr">/</li><li>${escapeHtml(guide.title)}</li></ul></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /BREADCRUMB =============== -->

  <!-- =============== GUIDE-INNEHÅLL =============== -->
  <div class="pt-100 pb-60" style="background:var(--nt-white);">
    <div class="container">
      <div class="row">
        <div class="col-lg-9">
          <span class="nt-eyebrow">Guide &middot; Uppdaterad ${escapeHtml(guide.updated)}</span>
          <h2 class="mb-25 fs-xl-40 fs-sm-36" style="color:var(--nt-navy);">${escapeHtml(guide.title)}</h2>
          ${guide.intro.map((p) => `<p style="color:var(--nt-gray);line-height:1.8;" class="mb-20">${p}</p>`).join('')}
          ${guide.sections.map(section).join('')}
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /GUIDE-INNEHÅLL =============== -->

  <!-- =============== FAQ =============== -->
  <div class="pt-30 pb-130" style="background:var(--nt-white);">
    <div class="container">
      <div class="row justify-content-center mb-50">
        <div class="col-xl-7 text-center">
          <span class="nt-eyebrow" style="justify-content:center;">Vanliga frågor</span>
          <h2 class="fs-xl-40 fs-sm-36">Om ${escapeHtml(guide.title.toLowerCase())}</h2>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-9">${guide.faq.map(faqItem).join('')}
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /FAQ =============== -->

  ${renderSourceLinks(site, guide.sourceKeys || [])}

  ${renderCtaBand(site, {
    eyebrow: 'Har du fler frågor?',
    heading: 'Vi hjälper dig gärna med ditt projekt',
    subtext: 'Kontakta oss för en kostnadsfri bedömning — vi berättar vad som gäller för just ditt projekt.',
  })}`;

  return { metaHtml, schemaHtml, bodyContent };
}

module.exports = { renderGuidePage };
