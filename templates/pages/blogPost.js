const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, buildFaqSchema, buildBreadcrumbSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr } = require('../../lib/html');
const { renderCtaBand } = require('../partials/ctaBand');

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  const months = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

function bodySection(s) {
  return `
          ${s.heading ? `<h2 class="fs-24 fw-700 mt-40 mb-20" style="color:var(--nt-navy);">${escapeHtml(s.heading)}</h2>` : ''}
          ${s.paragraphs.map((p) => `<p style="color:var(--nt-gray);line-height:1.8;" class="mb-20">${p}</p>`).join('')}`;
}

// Kort, självständig svarsruta direkt efter ingressen — tänkt att kunna
// lyftas rakt av som utdrag/AI-sammanfattning ("vad är X i korthet"),
// separat från den mer utförliga brödtexten under.
function summaryBox(heading, items) {
  return `
          <div class="nt-highlight mt-10 mb-40" style="max-width:100%;">
            <p style="color:var(--nt-navy);font-weight:700;margin-bottom:10px;">${escapeHtml(heading)}</p>
            <div class="tp-about-bottom-feature" style="margin:0;"><ul>${items.map((t) => `<li><i class="fa-sharp fa-solid fa-check"></i> ${t}</li>`).join('')}</ul></div>
          </div>`;
}

// item.answer renderas orenat — se motsvarande kommentar i templates/pages/tjanst.js.
function faqItem(item) {
  return `
        <details class="nt-faq-item">
          <summary>${escapeHtml(item.question)}</summary>
          <p>${item.answer}</p>
        </details>`;
}

function relatedServiceLink(site, slug) {
  const svc = site.services.find((s) => s.slug === slug);
  if (!svc) return '';
  return `
        <a href="/tjanster/${svc.slug}" class="nt-related-card">
          <span class="nt-related-card__icon"><i class="fas ${svc.icon}"></i></span>
          <span>
            <span class="nt-related-card__label">Relaterad tjänst</span>
            <span class="nt-related-card__name">${escapeHtml(svc.name)}</span>
          </span>
          <i class="fas fa-arrow-right nt-related-card__arrow"></i>
        </a>`;
}

/**
 * @param {object} site - data/site.json
 * @param {object} post - data/blogg/[slug].json
 */
function renderBlogPostPage(site, post) {
  const metaHtml = buildMetaTags({
    site,
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blogg/${post.slug}`,
    image: post.heroImage,
  });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    {
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription,
      image: `${site.url}${post.heroImage}`,
      datePublished: post.publishDate,
      dateModified: post.updatedDate || post.publishDate,
      author: { '@type': 'Organization', name: site.name, '@id': `${site.url}/#organization` },
      publisher: { '@type': 'Organization', name: site.name, '@id': `${site.url}/#organization` },
      mainEntityOfPage: `${site.url}/blogg/${post.slug}`,
    },
    buildFaqSchema(post.faq),
    buildBreadcrumbSchema([
      { name: 'Hem', url: `${site.url}/` },
      { name: 'Blogg', url: `${site.url}/blogg` },
      { name: post.title },
    ]),
  ]);

  const relatedLinks = (post.relatedServiceSlugs || []).map((slug) => relatedServiceLink(site, slug)).join('');

  // post.body[].paragraphs renderas orenat — se motsvarande kommentar i templates/pages/tjanst.js.
  const bodyContent = `
  <!-- =============== BREADCRUMB =============== -->
  <div class="tp-breadcrumb-area tp-breadcrumb-spacing nt-dark-band pt-180 pb-90"${post.heroImage ? ` style="background-image:url('${escapeAttr(post.heroImage)}');" role="img" aria-label="${escapeAttr(post.heroImageAlt || post.title)}"` : ''}>
    <div class="container">
      <div class="row">
        <div class="col-xl-9 col-lg-10">
          <div class="tp-breadcrumb-content">
            <span class="nt-eyebrow nt-eyebrow-light" style="margin-bottom:14px;">${escapeHtml(formatDate(post.publishDate))} · ${escapeHtml(site.name)}</span>
            <h1 class="tp-breadcrumb-title fw-600 fs-52 fs-xs-32 ls-m-3 tp-text-common-white lh-1 mb-20">${escapeHtml(post.title)}</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li><a href="/blogg">Blogg</a></li><li class="dvdr">/</li><li>${escapeHtml(post.title)}</li></ul></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /BREADCRUMB =============== -->

  <!-- =============== ARTIKELINNEHÅLL =============== -->
  <div class="pt-100 pb-60" style="background:var(--nt-white);">
    <div class="container">
      <div class="row">
        <div class="col-lg-9">
          ${bodySection(post.body[0])}
          ${(post.keyTakeaways && post.keyTakeaways.length) ? summaryBox('I korthet', post.keyTakeaways) : ''}
          ${post.body.slice(1).map(bodySection).join('')}

          ${relatedLinks ? `
          <div class="mt-50 pt-40" style="border-top:1px solid var(--nt-border, #e5e5e5);">
            <span class="nt-eyebrow">Läs mer</span>
            <div class="d-flex flex-wrap gap-3 mt-15">${relatedLinks}</div>
          </div>` : ''}
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /ARTIKELINNEHÅLL =============== -->

  ${(post.faq && post.faq.length) ? `
  <!-- =============== FAQ =============== -->
  <div class="pt-30 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <div class="row justify-content-center mb-50">
        <div class="col-xl-8 text-center">
          <span class="nt-eyebrow" style="justify-content:center;">Vanliga frågor</span>
          <h2 class="fs-xl-40 fs-sm-36">${escapeHtml(post.faqHeading || 'Vanliga frågor')}</h2>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-9">${post.faq.map(faqItem).join('')}
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /FAQ =============== -->` : ''}

  ${renderCtaBand(site, {
    eyebrow: 'Behöver du hjälp?',
    heading: 'Berätta om ditt projekt',
    subtext: 'Kontakta oss för en kostnadsfri bedömning och offert.',
  })}`;

  return { metaHtml, schemaHtml, bodyContent, preloadImage: post.heroImage };
}

module.exports = { renderBlogPostPage };
