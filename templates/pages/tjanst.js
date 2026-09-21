const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, buildServiceSchema, buildFaqSchema, buildBreadcrumbSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr, renderToc } = require('../../lib/html');
const { v } = require('../../lib/assetVersion');
const { renderProcessSteps } = require('../partials/processSteps');
const { renderCtaBand } = require('../partials/ctaBand');
const { renderBeforeAfterSection } = require('../partials/beforeAfter');
const { renderRelatedServices } = require('../partials/relatedServices');
const { renderSourceLinks } = require('../partials/sourceLinks');
const { renderSidebarNav, renderSidebarWhyUs } = require('../partials/sidebar');
const { renderLeadFormCard } = require('../partials/leadFormCard');

function checkItem(text) {
  return `<li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(text)}</li>`;
}

function checkList(items) {
  return `<div class="tp-about-bottom-feature"><ul>${items.map(checkItem).join('')}</ul></div>`;
}

// item.answer renderas orenat — se motsvarande kommentar för longDescription
// nedan. Gör att FAQ-svar kan länka internt (t.ex. till /guider/rot-avdrag).
function faqItem(item) {
  return `
        <details class="nt-faq-item">
          <summary>${escapeHtml(item.question)}</summary>
          <p>${item.answer}</p>
        </details>`;
}

// "Vad kostar X i Stockholm?" som egen sektion på tjänstesidan — samma
// mönster som de konkurrenter som rankar för tjänsten. Prisfaktorerna hämtas
// från tjänstens prisguide (site.json services[].priceGuide -> data/guider)
// så att de bara underhålls på ett ställe; hela genomgången finns i guiden.
function priceSection(site, tjanst, guidesBySlug) {
  const svc = site.services.find((s) => s.slug === tjanst.slug);
  const guide = svc && svc.priceGuide && guidesBySlug[svc.priceGuide.slug];
  if (!guide) return '';
  const factors = (guide.sections.find((s) => s.heading.startsWith('Det här påverkar')) || {}).list || [];
  return `
          <h3 id="pris" class="fs-24 fw-700 mt-40 mb-20" style="color:var(--nt-navy);">Vad kostar ${escapeHtml(tjanst.name.toLowerCase())} i ${escapeHtml(tjanst.targetLocation)}?</h3>
          <p style="color:var(--nt-gray);line-height:1.8;" class="mb-16">Varje projekt är olika, så vi anger inget fast pris på webben — ett schablonpris blir antingen för högt för de enkla jobben eller en överraskning för de svårare. Det som oftast avgör kostnaden är:</p>
          ${checkList(factors.slice(0, 5))}
          <div class="nt-highlight mt-20 mb-10">
            <p style="color:var(--nt-gray);line-height:1.8;margin:0;">Läs hela genomgången i vår guide <a href="/guider/${escapeAttr(guide.slug)}">${escapeHtml(guide.title)}</a> — eller <a href="/kontakt">kontakta oss</a> för en kostnadsfri bedömning och offert på just ditt projekt.</p>
          </div>`;
}

function inclusionCard(text) {
  return `
        <div class="col-md-6">
          <div class="nt-inclusion">
            <i class="fas fa-circle-check"></i>
            <span>${escapeHtml(text)}</span>
          </div>
        </div>`;
}

/**
 * @param {object} site - data/site.json
 * @param {import('../../lib/types').Tjanst} tjanst
 */
function renderTjanstPage(site, tjanst, guidesBySlug = {}) {
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
    buildBreadcrumbSchema([
      { name: 'Hem', url: `${site.url}/` },
      { name: 'Tjänster', url: `${site.url}/tjanster` },
      { name: tjanst.name },
    ]),
  ]);

  const referenceProjectsBlock = tjanst.referenceProjects.length
    ? `<div class="row g-4">${tjanst.referenceProjects.map((p) => `
        <div class="col-md-4">
          <div class="nt-icon-card" style="padding:0;overflow:hidden;">
            ${p.image ? `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}" style="width:100%;height:200px;object-fit:cover;display:block;">` : ''}
            <div style="padding:24px 26px;">
              <h3>${escapeHtml(p.title)}</h3>
              <p>${escapeHtml(p.description)}</p>
              ${p.location ? `<p style="color:var(--nt-gray);font-size:.85rem;margin-top:8px;"><i class="fas fa-location-dot"></i> ${escapeHtml(p.location)}</p>` : ''}
            </div>
          </div>
        </div>`).join('')}</div>`
    : `<div class="nt-todo-block">[TODO: referensprojekt för ${escapeHtml(tjanst.name)} i ${escapeHtml(tjanst.targetLocation)} läggs in här när kunden tillhandahåller exempel/bilder.]</div>`;

  const inclusionsBlock = (tjanst.inclusions && tjanst.inclusions.length) ? `
          <h3 id="vad-ingar" class="fs-24 fw-700 mt-40 mb-20" style="color:var(--nt-navy);">Vad ingår i ${escapeHtml(tjanst.name.toLowerCase())}?</h3>
          <div class="row g-3 mb-10">${tjanst.inclusions.map(inclusionCard).join('')}
          </div>` : '';

  // longDescription/whyImportant/*.intro renderas orenat (inte escapeHtml) — texten är
  // författad av oss i /data, inte användarinmatning, och innehåller medvetna interna
  // länkar (<a href="/tjanster/...">) för intern länkning. Håll den datan fri från HTML
  // utöver dessa länkar.
  const whyImportantBlock = (tjanst.whyImportant && tjanst.whyImportant.length) ? `
          <h3 id="varfor" class="fs-24 fw-700 mt-40 mb-20" style="color:var(--nt-navy);">Varför är ${escapeHtml(tjanst.name.toLowerCase())} viktigt?</h3>
          ${tjanst.whyImportant.map((p) => `<p style="color:var(--nt-gray);line-height:1.8;" class="mb-16">${p}</p>`).join('')}` : '';

  const signsBlockInline = tjanst.signs ? `
          <h3 id="tecken" class="fs-24 fw-700 mt-40 mb-20" style="color:var(--nt-navy);">${escapeHtml(tjanst.signs.heading)}</h3>
          ${tjanst.signs.intro ? `<p style="color:var(--nt-gray);line-height:1.8;" class="mb-16">${tjanst.signs.intro}</p>` : ''}
          ${checkList(tjanst.signs.items)}` : '';

  const whyUsBlock = (tjanst.whyUs && tjanst.whyUs.items && tjanst.whyUs.items.length) ? `
          <h3 id="varfor-oss" class="fs-24 fw-700 mt-40 mb-20" style="color:var(--nt-navy);">Varför välja Haninge Grävtjänst för ${escapeHtml(tjanst.name.toLowerCase())}?</h3>
          ${tjanst.whyUs.intro ? `<p style="color:var(--nt-gray);line-height:1.8;" class="mb-16">${tjanst.whyUs.intro}</p>` : ''}
          ${checkList(tjanst.whyUs.items)}` : '';

  const considerationsBlock = (tjanst.considerations && tjanst.considerations.items && tjanst.considerations.items.length) ? `
          <h3 id="tank-pa" class="fs-24 fw-700 mt-40 mb-20" style="color:var(--nt-navy);">Vad bör du tänka på?</h3>
          ${tjanst.considerations.intro ? `<p style="color:var(--nt-gray);line-height:1.8;" class="mb-16">${tjanst.considerations.intro}</p>` : ''}
          ${checkList(tjanst.considerations.items)}` : '';

  const priceBlock = priceSection(site, tjanst, guidesBySlug);
  const n = tjanst.name.toLowerCase();
  const toc = renderToc([
    inclusionsBlock && { id: 'vad-ingar', label: `Vad ingår i ${n}?` },
    whyImportantBlock && { id: 'varfor', label: `Varför är ${n} viktigt?` },
    signsBlockInline && { id: 'tecken', label: tjanst.signs.heading },
    priceBlock && { id: 'pris', label: `Vad kostar ${n}?` },
    considerationsBlock && { id: 'tank-pa', label: 'Vad bör du tänka på?' },
    { id: 'sa-gar-det-till', label: 'Så går det till' },
    tjanst.referenceProjects.length && { id: 'referenser', label: 'Exempel från våra uppdrag' },
    { id: 'vanliga-fragor', label: 'Vanliga frågor' },
  ]);

  const bodyContent = `
  <!-- =============== BREADCRUMB =============== -->
  <div class="tp-breadcrumb-area tp-breadcrumb-spacing nt-dark-band pt-180 pb-90"${tjanst.heroImage ? ` style="background-image:url('${escapeAttr(tjanst.heroImage)}');" role="img" aria-label="${escapeAttr(tjanst.heroImageAlt || tjanst.name)}"` : ''}>
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

  <!-- =============== HUVUDINNEHÅLL + SIDOPANEL =============== -->
  <div class="pt-100 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <div class="row">
        <div class="col-lg-8">
          <span class="nt-eyebrow">Tjänst</span>
          <h2 class="mb-25 fs-xl-40 fs-sm-36" style="color:var(--nt-navy);">${escapeHtml(tjanst.name)} i ${escapeHtml(tjanst.targetLocation)}</h2>
          ${tjanst.longDescription.map((p) => `<p style="color:var(--nt-gray);line-height:1.8;" class="mb-20">${p}</p>`).join('')}
          ${toc}

          <div class="row g-3 mb-10">
            <div class="col-md-6">
              <div class="nt-highlight h-100">
                <span class="nt-highlight__icon"><i class="fas fa-shield-check"></i></span>
                <h3>${escapeHtml(tjanst.benefits[0] || '')}</h3>
              </div>
            </div>
            <div class="col-md-6">
              <div class="nt-highlight h-100">
                <span class="nt-highlight__icon"><i class="fas fa-circle-check"></i></span>
                <h3>${escapeHtml(tjanst.benefits[1] || '')}</h3>
              </div>
            </div>
          </div>

          ${inclusionsBlock}

          <a href="/kontakt" class="tp-btn-xl mt-30 d-inline-block lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-btn-switch-animation tp-text-common-white fw-500">
            <span class="d-flex align-items-center justify-content-center">
              <span class="btn-text">Begär offert på ${escapeHtml(tjanst.name.toLowerCase())}</span>
              <span class="btn-icon"><i class="fas fa-arrow-right"></i></span>
              <span class="btn-icon"><i class="fas fa-arrow-right"></i></span>
            </span>
          </a>

          ${whyImportantBlock}
          ${signsBlockInline}
          ${priceBlock}
          ${whyUsBlock}
          ${considerationsBlock}
        </div>

        <div class="col-lg-4">
          <div class="nt-side-sticky">
            ${renderLeadFormCard(site, { presetServiceName: tjanst.name, source: `tjanst-sidebar:${tjanst.slug}`, idPrefix: 'tjanst' })}
            ${renderSidebarWhyUs(site)}
            ${renderSidebarNav(site, tjanst.slug)}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /HUVUDINNEHÅLL + SIDOPANEL =============== -->

  ${renderProcessSteps({ eyebrow: 'Så går det till', heading: `${tjanst.name} steg för steg`, steps: tjanst.process, id: 'sa-gar-det-till' })}

  <!-- =============== REFERENSPROJEKT =============== -->
  <div id="referenser" class="pt-130 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <span class="nt-eyebrow">Referensprojekt</span>
      <h2 class="fs-xl-40 fs-sm-36 mb-40">${escapeHtml(tjanst.name)} i ${escapeHtml(tjanst.targetLocation)} — exempel från våra uppdrag</h2>
      ${referenceProjectsBlock}
    </div>
  </div>
  <!-- =============== /REFERENSPROJEKT =============== -->

  ${renderBeforeAfterSection({ heading: `Före och efter — ${tjanst.name.toLowerCase()}`, pairs: tjanst.beforeAfter || [] })}

  <!-- =============== FAQ =============== -->
  <div id="vanliga-fragor" class="pt-30 pb-130" style="background:var(--nt-white);">
    <div class="container">
      <div class="row justify-content-center mb-50">
        <div class="col-xl-7 text-center">
          <span class="nt-eyebrow" style="justify-content:center;">Vanliga frågor</span>
          <h2 class="fs-xl-40 fs-sm-36">Om ${escapeHtml(tjanst.name.toLowerCase())} i ${escapeHtml(tjanst.targetLocation)}</h2>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-9">${tjanst.faq.map(faqItem).join('')}
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /FAQ =============== -->

  ${renderRelatedServices(site, tjanst)}

  ${renderSourceLinks(site, tjanst.sourceKeys || [])}

  ${renderCtaBand(site, {
    eyebrow: 'Redo att börja?',
    heading: `Kontakta oss för ${tjanst.name.toLowerCase()} i ${tjanst.targetLocation}`,
    subtext: `Berätta om ditt projekt så återkommer vi med en kostnadsfri bedömning och offert.`,
  })}`;

  const extraScripts = `<script src="${v('/assets/js/lead-form.js')}"></script>`;

  return { metaHtml, schemaHtml, bodyContent, extraScripts, preloadImage: tjanst.heroImage };
}

module.exports = { renderTjanstPage };
