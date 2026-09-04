const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr } = require('../../lib/html');
const { renderTrustBadges } = require('../partials/trustBadges');
const { renderCtaBand } = require('../partials/ctaBand');
const { renderTestimonials } = require('../partials/testimonials');

/**
 * @param {object} site - data/site.json
 */
function renderOmOssPage(site) {
  const t = site.trustSignals;
  const title = `Om oss — ${site.name}`;
  const description = `${site.name} — grävfirma med över ${t.yearsExperience} års erfarenhet och ${t.projectsCompleted}+ genomförda projekt i Stockholm, med ${site.homeBase} som hemort.`;

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

  <div class="pt-130 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <span class="nt-eyebrow">Om ${escapeHtml(site.shortName)}</span>
          <h2 class="mb-30 fs-xl-40 fs-sm-36">${escapeHtml(site.name)}</h2>
          <p class="mb-20">${escapeHtml(site.name)} är en grävfirma baserad i ${escapeHtml(site.address.addressLocality)} i ${escapeHtml(site.homeBase)} kommun, med över ${escapeHtml(String(t.yearsExperience))} års erfarenhet av mark- och anläggningsarbete. Vi utför uppdrag i hela Stockholmsområdet — från villaträdgårdar i innerstaden till större markarbeten och BRF-gårdar i förorten.</p>
          <p class="mb-20">Med ${escapeHtml(String(t.projectsCompleted))}+ genomförda projekt har vi byggt upp praktisk erfarenhet av de flesta markförhållanden som förekommer i regionen — lerjord, morän och berg — och vet vad som krävs för att ett arbete ska hålla över tid, inte bara se bra ut vid leverans.</p>
          <p class="mb-20">Vi arbetar med dränering, plattsättning & stensättning, husgrunder & markanläggning, finplanering & innergårdsrenovering, markanläggning & kantsten, asfaltering och grävtjänster/markarbeten — åt privatpersoner, företag och bostadsrättsföreningar. Läs mer om <a href="/tjanster">våra tjänster</a>.</p>
          <ul class="tp-about-bottom-feature mt-30">
            <li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(t.fSkatt.value)}</li>
            <li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(t.insurance.value)}</li>
            <li><i class="fa-sharp fa-solid fa-check"></i> Verksamma i hela ${escapeHtml(site.primaryLocation)}, hemort ${escapeHtml(site.homeBase)}</li>
            <li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(String(t.reviews.averageRating))}/5 i snittbetyg på <a href="${escapeAttr(t.reviews.url)}" target="_blank" rel="noopener">Reco</a> (${escapeHtml(String(t.reviews.count))} recensioner)</li>
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
  </div>

  ${renderTrustBadges(site)}

  ${renderTestimonials(site)}

  ${renderCtaBand(site, {
    eyebrow: 'Redo att börja?',
    heading: 'Berätta vad du behöver hjälp med',
    subtext: 'Kontakta oss idag och få ett skräddarsytt förslag — snabbt och enkelt.',
  })}`;

  return { metaHtml, schemaHtml, bodyContent };
}

module.exports = { renderOmOssPage };
