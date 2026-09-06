const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, buildServiceSchema, buildBreadcrumbSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr } = require('../../lib/html');
const { renderTrustBadges } = require('../partials/trustBadges');
const { renderCtaBand } = require('../partials/ctaBand');

function serviceGridCard(site, svc, tjansterBySlug) {
  const tjanst = tjansterBySlug && tjansterBySlug[svc.slug];
  const shortDescription = tjanst ? tjanst.shortDescription : '';
  return `
        <div class="col-xl-4 col-md-6">
          <div class="nt-icon-card position-relative">
            <div class="nt-icon-card__icon"><i class="fas ${svc.icon}"></i></div>
            <h3><a href="/tjanster/${svc.slug}">${escapeHtml(svc.name)}</a></h3>
            <p>${escapeHtml(shortDescription)}</p>
            <a class="nt-icon-card__link" href="/tjanster/${svc.slug}">Läs mer <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>`;
}

function relevantServiceCard(site, item, ortMatches) {
  const svc = site.services.find((s) => s.slug === item.slug);
  if (!svc) return '';
  const match = ortMatches.find((m) => m.tjanstSlug === item.slug);
  const href = match ? `/tjanster/${item.slug}/${match.ortSlug}` : `/tjanster/${item.slug}`;
  const linkLabel = match ? `Läs mer om ${svc.name.toLowerCase()} här` : `Läs mer om ${svc.name.toLowerCase()}`;
  return `
        <div class="col-md-4">
          <div class="nt-highlight h-100">
            <span class="nt-highlight__icon"><i class="fas ${svc.icon}"></i></span>
            <h3>${escapeHtml(svc.name)}</h3>
            <p style="color:var(--nt-gray);font-size:.92rem;line-height:1.7;margin:8px 0 12px;">${escapeHtml(item.blurb)}</p>
            <a href="${href}" style="color:var(--nt-navy);font-weight:600;font-size:.9rem;text-decoration:underline;">${escapeHtml(linkLabel)} <i class="fas fa-arrow-right" style="margin-left:4px;"></i></a>
          </div>
        </div>`;
}

/**
 * Stadsdels-hubbsida (/omraden/[slug]) — listar samtliga tjänster för
 * området och länkar vidare till ev. dedikerade tjänst×ort-sidor.
 * @param {object} site - data/site.json
 * @param {import('../../lib/types').Omrade} omrade
 * @param {object} tjansterBySlug
 * @param {Array<{tjanstSlug: string, ortSlug: string}>} ortMatches - tjänst×ort-sidor som finns för detta område
 * @param {import('../../lib/types').Omrade[]} otherOmraden - övriga områden, för "Andra områden"-länkar
 */
function renderOmradePage(site, omrade, tjansterBySlug, ortMatches, otherOmraden) {
  const metaHtml = buildMetaTags({
    site,
    title: omrade.metaTitle,
    description: omrade.metaDescription,
    path: `/omraden/${omrade.slug}`,
  });

  const areaServiceSchemas = omrade.relevantServices
    .map((item) => tjansterBySlug && tjansterBySlug[item.slug])
    .filter(Boolean)
    .map((tjanst) => {
      const match = ortMatches.find((m) => m.tjanstSlug === tjanst.slug);
      return buildServiceSchema(site, tjanst, {
        areaName: omrade.name,
        url: match ? `${site.url}/tjanster/${tjanst.slug}/${match.ortSlug}` : undefined,
      });
    });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    ...areaServiceSchemas,
    buildBreadcrumbSchema([
      { name: 'Hem', url: `${site.url}/` },
      { name: 'Områden', url: `${site.url}/omraden` },
      { name: omrade.name },
    ]),
  ]);

  const otherAreasHtml = otherOmraden.map((o) => `<li><a href="/omraden/${escapeAttr(o.slug)}">${escapeHtml(o.name)}</a></li>`).join('');

  // omrade.intro renderas orenat — se motsvarande kommentar i templates/pages/tjanst.js.
  const bodyContent = `
  <!-- =============== BREADCRUMB =============== -->
  <div class="tp-breadcrumb-area tp-breadcrumb-spacing nt-dark-band pt-180 pb-90">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-9">
          <div class="tp-breadcrumb-content">
            <h1 class="tp-breadcrumb-title fw-600 fs-60 fs-xs-40 ls-m-3 tp-text-common-white lh-1 mb-20">${escapeHtml(omrade.h1)}</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li><a href="/omraden">Områden</a></li><li class="dvdr">/</li><li>${escapeHtml(omrade.name)}</li></ul></div>
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
          <span class="nt-eyebrow">${escapeHtml(omrade.region)}</span>
          <h2 class="mb-25 fs-xl-40 fs-sm-36" style="color:var(--nt-navy);">Om ${escapeHtml(omrade.name)}</h2>
          ${omrade.intro.map((p) => `<p style="color:var(--nt-gray);line-height:1.8;" class="mb-20">${p}</p>`).join('')}
          <p style="color:var(--nt-gray);line-height:1.8;">${escapeHtml(omrade.whyUs)}</p>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /INTRO =============== -->

  <!-- =============== VANLIGA BEHOV =============== -->
  <div class="pt-30 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <span class="nt-eyebrow">Vanliga behov i ${escapeHtml(omrade.name)}</span>
      <h2 class="mb-30 fs-xl-40 fs-sm-36" style="color:var(--nt-navy);">Det här hjälper vi oftast till med här</h2>
      <div class="row g-3">${omrade.relevantServices.map((item) => relevantServiceCard(site, item, ortMatches)).join('')}
      </div>
    </div>
  </div>
  <!-- =============== /VANLIGA BEHOV =============== -->

  ${renderTrustBadges(site)}

  <!-- =============== ALLA TJÄNSTER =============== -->
  <div class="pt-100 pb-100" style="background:var(--nt-gray-light);">
    <div class="container">
      <div class="row align-items-end mb-60">
        <div class="col-lg-8">
          <span class="nt-eyebrow">Alla tjänster</span>
          <h2 class="fs-xl-40 fs-sm-36">Vi utför alla våra tjänster i ${escapeHtml(omrade.name)}</h2>
        </div>
      </div>
      <div class="row g-4">${site.services.map((svc) => serviceGridCard(site, svc, tjansterBySlug)).join('')}
      </div>
    </div>
  </div>
  <!-- =============== /ALLA TJÄNSTER =============== -->

  <!-- =============== ANDRA OMRÅDEN =============== -->
  <div class="pt-100 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <span class="nt-eyebrow">Andra områden</span>
      <h2 class="mb-30 fs-xl-40 fs-sm-36" style="color:var(--nt-navy);">Vi jobbar i hela Stockholmsområdet</h2>
      <div class="tp-about-bottom-feature" style="column-count:2;column-gap:40px;"><ul>${otherAreasHtml}</ul></div>
      <a href="/omraden" class="tp-btn-xl mt-30 d-inline-block lh-0 tp-round-26 fs-16 border-full-1 ls-0 tp-btn-switch-animation fw-500">
        <span class="d-flex align-items-center justify-content-center">
          <span class="btn-text">Se alla områden</span>
          <span class="btn-icon"><i class="fas fa-arrow-right"></i></span>
          <span class="btn-icon"><i class="fas fa-arrow-right"></i></span>
        </span>
      </a>
    </div>
  </div>
  <!-- =============== /ANDRA OMRÅDEN =============== -->

  ${renderCtaBand(site, {
    eyebrow: 'Redo att börja?',
    heading: `Kontakta oss för mark- och anläggningsarbete i ${omrade.name}`,
    subtext: 'Berätta om ditt projekt så återkommer vi med en kostnadsfri bedömning och offert.',
  })}`;

  return { metaHtml, schemaHtml, bodyContent };
}

module.exports = { renderOmradePage };
