const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, buildServiceSchema, buildFaqSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr } = require('../../lib/html');

function benefitItem(text) {
  return `<li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(text)}</li>`;
}

function processStep(step) {
  return `
        <div class="col-xl-3 col-md-6">
          <div class="nt-step h-100 wow fadeInUp" data-wow-delay=".${step.step}s" data-wow-duration=".9s">
            <span class="nt-step__num">0${step.step}</span>
            <h4>${escapeHtml(step.title)}</h4>
            <p>${escapeHtml(step.description)}</p>
          </div>
        </div>`;
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
 * @param {import('../../lib/types').Tjanst} tjanst
 */
function renderTjanstPage(site, tjanst) {
  const metaHtml = buildMetaTags({
    site,
    title: tjanst.metaTitle,
    description: tjanst.metaDescription,
    path: `/tjanster/${tjanst.slug}`,
  });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    buildServiceSchema(site, tjanst),
    buildFaqSchema(tjanst.faq),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Hem', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Tjänster', item: `${site.url}/tjanster` },
        { '@type': 'ListItem', position: 3, name: tjanst.name },
      ],
    },
  ]);

  const referenceProjectsBlock = tjanst.referenceProjects.length
    ? `<div class="row g-4">${tjanst.referenceProjects.map((p) => `
        <div class="col-md-4"><div class="nt-icon-card"><h4>${escapeHtml(p.title)}</h4><p>${escapeHtml(p.description)}</p></div></div>`).join('')}</div>`
    : `<div class="nt-todo-block">[TODO: referensprojekt för ${escapeHtml(tjanst.name)} i ${escapeHtml(tjanst.targetLocation)} läggs in här när kunden tillhandahåller exempel/bilder.]</div>`;

  const bodyContent = `
  <!-- =============== BREADCRUMB =============== -->
  <div class="tp-breadcrumb-area tp-breadcrumb-spacing nt-dark-band pt-180 pb-90" style="background:var(--nt-navy);">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-9">
          <div class="tp-breadcrumb-content">
            <h1 class="tp-breadcrumb-title fw-600 fs-60 fs-xs-40 ls-m-3 tp-text-common-white lh-1 mb-20">${escapeHtml(tjanst.h1)}</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li><a href="/tjanster">Tjänster</a></li><li class="dvdr">/</li><li>${escapeHtml(tjanst.name)}</li></ul></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /BREADCRUMB =============== -->

  <!-- =============== INTRO =============== -->
  <div class="pt-130 pb-60" style="background:var(--nt-white);">
    <div class="container">
      <div class="row">
        <div class="col-lg-8">
          <span class="nt-eyebrow">${escapeHtml(tjanst.name)} i ${escapeHtml(tjanst.targetLocation)}</span>
          ${tjanst.longDescription.map((p) => `<p style="color:var(--nt-gray);line-height:1.8;" class="mb-20">${escapeHtml(p)}</p>`).join('')}
          <ul class="tp-about-bottom-feature" style="margin-top:24px;">${tjanst.benefits.map(benefitItem).join('')}</ul>
          <a href="/kontakt" class="tp-btn-xl mt-20 d-inline-block lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-btn-switch-animation tp-text-common-white fw-500">
            <span class="d-flex align-items-center justify-content-center">
              <span class="btn-text">Begär offert på ${escapeHtml(tjanst.name.toLowerCase())}</span>
              <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
              <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /INTRO =============== -->

  <!-- =============== SÅ GÅR DET TILL =============== -->
  <div class="tp-process-area pt-100 pb-130" style="background-color:#FDF3EA;">
    <div class="container">
      <div class="row justify-content-center mb-70">
        <div class="col-xl-7 text-center">
          <span class="nt-eyebrow">Så går det till</span>
          <h2 class="fs-xl-40 fs-sm-36 wow img-custom-anim-top" data-wow-duration="1.5s" data-wow-delay="0.2s">${escapeHtml(tjanst.name)} steg för steg</h2>
        </div>
      </div>
      <div class="row g-4 gy-5">${tjanst.process.map(processStep).join('')}
      </div>
    </div>
  </div>
  <!-- =============== /SÅ GÅR DET TILL =============== -->

  <!-- =============== REFERENSPROJEKT =============== -->
  <div class="pt-130 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <span class="nt-eyebrow">Referensprojekt</span>
      <h2 class="fs-xl-40 fs-sm-36 mb-40 wow img-custom-anim-left" data-wow-duration="1.5s" data-wow-delay="0.2s">${escapeHtml(tjanst.name)} i ${escapeHtml(tjanst.targetLocation)} — exempel från våra uppdrag</h2>
      ${referenceProjectsBlock}
    </div>
  </div>
  <!-- =============== /REFERENSPROJEKT =============== -->

  <!-- =============== FAQ =============== -->
  <div class="pt-30 pb-130" style="background:var(--nt-white);">
    <div class="container">
      <div class="row justify-content-center mb-50">
        <div class="col-xl-7 text-center">
          <span class="nt-eyebrow">Vanliga frågor</span>
          <h2 class="fs-xl-40 fs-sm-36 wow img-custom-anim-top" data-wow-duration="1.5s" data-wow-delay="0.2s">Om ${escapeHtml(tjanst.name.toLowerCase())} i ${escapeHtml(tjanst.targetLocation)}</h2>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-9">${tjanst.faq.map(faqItem).join('')}
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /FAQ =============== -->

  <!-- =============== CTA =============== -->
  <div class="tp-cta-area nt-dark-band pt-100 pb-100" style="background:var(--nt-navy-dark);">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-10">
          <span class="nt-eyebrow nt-eyebrow-light">Redo att börja?</span>
          <h2 class="mb-30 fs-xl-40 fs-sm-36 tp-text-common-white wow img-custom-anim-left" data-wow-duration="1.5s" data-wow-delay="0.2s">Kontakta oss för ${escapeHtml(tjanst.name.toLowerCase())} i ${escapeHtml(tjanst.targetLocation)}</h2>
          <a href="/kontakt" class="tp-btn-xl d-inline-block lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-btn-switch-animation tp-text-common-white fw-500">
            <span class="d-flex align-items-center justify-content-center">
              <span class="btn-text">Begär offert</span>
              <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
              <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /CTA =============== -->`;

  return { metaHtml, schemaHtml, bodyContent };
}

module.exports = { renderTjanstPage };
