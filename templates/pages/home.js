const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, buildFaqSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr } = require('../../lib/html');
const { renderTrustBadges } = require('../partials/trustBadges');
const { renderProcessSteps } = require('../partials/processSteps');
const { renderCtaBand } = require('../partials/ctaBand');
const { renderPromiseBlock } = require('../partials/promiseBlock');
const { renderSatelliteLink } = require('../partials/satelliteLink');
const { renderTestimonials } = require('../partials/testimonials');

function faqItem(item) {
  return `
        <details class="nt-faq-item">
          <summary>${escapeHtml(item.question)}</summary>
          <p>${escapeHtml(item.answer)}</p>
        </details>`;
}

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

function statBlock(icon, label, value) {
  const valueHtml = value == null
    ? '<b class="nt-todo">TODO</b>'
    : `<span>${escapeHtml(String(value))}</span>`;
  return `
        <div class="col-xl-3 col-lg-6 col-md-6">
          <div class="tp-counter-wrap nt-stat-block mb-30">
            <span class="nt-stat-block__icon"><i class="fas ${icon}"></i></span>
            <div class="nt-stat-light">
              <h3>${valueHtml}</h3>
              <p>${escapeHtml(label)}</p>
            </div>
          </div>
        </div>`;
}

/**
 * @param {object} site - data/site.json
 */
function renderHomePage(site, tjansterBySlug) {
  const metaHtml = buildMetaTags({
    site,
    title: `Grävfirma i ${site.primaryLocation} — ${site.name}`,
    description: `${site.name} utför dränering, plattsättning, husgrunder och finplanering i ${site.primaryLocation} och ${site.homeBase}. Över ${site.trustSignals.yearsExperience} års erfarenhet, ${site.trustSignals.projectsCompleted}+ projekt.`,
    path: '/',
  });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    { '@type': 'WebSite', name: site.name, url: site.url, inLanguage: site.language },
    buildFaqSchema(site.faq),
  ]);

  const t = site.trustSignals;

  const bodyContent = `
  <!-- =============== HERO =============== -->
  <section class="nt-hero-static" style="background-image:url('${escapeHtml(site.heroImage)}');" role="img" aria-label="${escapeHtml(site.heroImageAlt)}">
    <div class="container nt-hero-content">
      <div class="row">
        <div class="col-xl-8 col-lg-10">
          <span class="nt-eyebrow nt-eyebrow-light">Mark &amp; anläggning i ${escapeHtml(site.primaryLocation)}</span>
          <h1>Grävfirma i <span>${escapeHtml(site.primaryLocation)}</span> — från dränering till färdig mark</h1>
          <p>${escapeHtml(site.tagline)}. ${escapeHtml(site.name)} utför mark- och anläggningsarbeten åt privatpersoner, företag och BRF:er i hela ${escapeHtml(site.primaryLocation)}, med ${escapeHtml(site.homeBase)} som hemort.</p>
          <div class="d-flex flex-wrap gap-3 mb-45">
            <a href="/kontakt" class="tp-btn-xl d-inline-block lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-btn-switch-animation tp-text-common-white fw-500">
              <span class="d-flex align-items-center justify-content-center">
                <span class="btn-text">Begär offert</span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
              </span>
            </a>
            <a href="/tjanster" class="tp-btn-xl d-inline-block lh-0 tp-round-26 fs-16 tp-bg-common-white ls-0 tp-btn-switch-animation fw-500">
              <span class="d-flex align-items-center justify-content-center">
                <span class="btn-text">Se våra tjänster</span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
              </span>
            </a>
          </div>
          <div class="nt-trust-row">
            <span><i class="fas fa-file-invoice"></i> F-skattsedel</span>
            <span><i class="fas fa-shield-check"></i> Ansvarsförsäkrat</span>
            <span><i class="fas fa-location-dot"></i> Hemort ${escapeHtml(site.homeBase)}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- =============== /HERO =============== -->

  ${renderTrustBadges(site)}

  <!-- =============== OM OSS =============== -->
  <div class="tp-about-area pt-130 pb-110">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6 mb-40">
          <div class="p-relative mr-50" style="min-height:340px;border-radius:14px;overflow:hidden;">
            <img src="/assets/img/hero/plattsattning-projekt-1.webp" alt="Färdigställd stensättning vid villa" style="width:100%;height:100%;min-height:340px;object-fit:cover;display:block;">
          </div>
        </div>
        <div class="col-lg-6 mb-40">
          <div class="tp-about-2-content tp-about-4-content ml-30">
            <span class="nt-eyebrow">Om ${escapeHtml(site.shortName)}</span>
            <h2 class="mb-25 fs-xl-40 fs-sm-36">Lokal grävfirma med ${escapeHtml(site.primaryLocation)} som arbetsfält</h2>
            <p class="mb-20">Med över ${escapeHtml(String(t.yearsExperience))} års erfarenhet och ${escapeHtml(String(t.projectsCompleted))}+ genomförda projekt har vi sett de flesta typer av markförhållanden som Stockholmsområdet har att erbjuda — från lerjord i lägre liggande områden till berg i dagen på höjderna. Vi specialiserar oss på <a href="/tjanster/dranering">dränering</a>, mark- och anläggningsarbete, och tar hela projekt från första spadtag till färdig yta.</p>
            <p class="mb-20">Som lokal grävfirma med hemort i ${escapeHtml(site.homeBase)} känner vi till de markförhållanden som är vanliga i olika delar av regionen, vilket gör att vi kan planera rätt uppbyggnad — bärlager, dränering och lutning — redan från start istället för att behöva göra om arbetet i efterhand. Vi tar både fristående uppdrag och helhetsprojekt där flera <a href="/tjanster">tjänster</a> kombineras, till exempel dränering i samband med ny finplanering.</p>
            <div class="tp-about-bottom-feature mb-40 mt-30"><ul>
              <li><i class="fa-sharp fa-solid fa-check"></i> F-skattsedel och ansvarsförsäkring på plats</li>
              <li><i class="fa-sharp fa-solid fa-check"></i> Arbetar i hela ${escapeHtml(site.primaryLocation)}, hemort ${escapeHtml(site.homeBase)}</li>
              <li><i class="fa-sharp fa-solid fa-check"></i> Privatpersoner, företag och BRF:er</li>
            </ul></div>
            <a href="/om-oss" class="tp-btn-xl d-inline-block lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-btn-switch-animation tp-text-common-white fw-500">
              <span class="d-flex align-items-center justify-content-center">
                <span class="btn-text">Läs mer om oss</span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /OM OSS =============== -->

  <!-- =============== TJÄNSTER =============== -->
  <div class="tp-service-area pt-130 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <div class="row align-items-end mb-60">
        <div class="col-lg-8">
          <span class="nt-eyebrow">Våra tjänster</span>
          <h2 class="mb-20 fs-xl-40 fs-sm-36">Mark- och anläggningsarbete från grund till finplanering</h2>
          <p style="color:var(--nt-gray);line-height:1.8;max-width:640px;">Vi tar hela kedjan i ett mark- eller anläggningsprojekt — från <a href="/tjanster/markarbeten">schaktning och grävning</a> och <a href="/tjanster/dranering">dränering</a> av husgrunden, till <a href="/tjanster/plattsattning-stensattning">stensättning</a>, <a href="/tjanster/markanlaggning-kantsten">kantsten</a> och <a href="/tjanster/finplanering-innergardsrenovering">finplanering</a> av den färdiga ytan. Behöver du bara en av delarna hjälper vi till med det också.</p>
        </div>
        <div class="col-lg-4">
          <div class="text-lg-end mt-25">
            <a href="/tjanster" class="tp-btn-xl d-inline-block lh-0 tp-round-26 fs-16 border-full-1 ls-0 tp-btn-switch-animation fw-500">
              <span class="d-flex align-items-center justify-content-center">
                <span class="btn-text">Se alla tjänster</span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div class="row g-4">${site.services.map((svc) => serviceCard(site, svc, tjansterBySlug)).join('')}
      </div>
    </div>
  </div>
  <!-- =============== /TJÄNSTER =============== -->

  <!-- =============== UPPTAGNINGSOMRÅDE =============== -->
  <div class="pt-100 pb-100" style="background:var(--nt-gray-light);">
    <div class="container">
      <div class="row align-items-center g-5">
        <div class="col-lg-5">
          <span class="nt-eyebrow">Var vi jobbar</span>
          <h2 class="mb-20 fs-xl-40 fs-sm-36" style="color:var(--nt-navy);">Verksamma i hela Stockholm</h2>
          <p style="color:var(--nt-gray);line-height:1.8;" class="mb-20">Med ${escapeHtml(site.homeBase)} som hemort tar vi uppdrag i hela Stockholmsområdet, bland annat i:</p>
          <div class="tp-about-bottom-feature"><ul>${site.areasServed.map((a) => `<li><i class="fa-sharp fa-solid fa-check"></i> <a href="/omraden/${escapeAttr(a.slug)}" style="color:inherit;">${escapeHtml(a.name)}</a></li>`).join('')}</ul></div>
          <div class="d-flex flex-wrap gap-3 mt-20">
            <a href="/omraden" class="tp-btn-xl d-inline-block lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-btn-switch-animation tp-text-common-white fw-500">
              <span class="d-flex align-items-center justify-content-center">
                <span class="btn-text">Se alla områden</span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
              </span>
            </a>
            <a href="/kontakt" class="tp-btn-xl d-inline-block lh-0 tp-round-26 fs-16 tp-bg-common-white ls-0 tp-btn-switch-animation fw-500">
              <span class="d-flex align-items-center justify-content-center">
                <span class="btn-text">Kontakta oss</span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
              </span>
            </a>
          </div>
        </div>
        <div class="col-lg-7">
          <div style="border-radius:14px;overflow:hidden;box-shadow:0 20px 50px rgba(28,46,74,.12);">
            <iframe
              src="https://www.google.com/maps?q=Stockholm,Sverige&z=10&output=embed"
              width="100%" height="420" style="border:0;display:block;"
              allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
              title="Karta över Haninge Grävtjänsts arbetsområde i Stockholm">
            </iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /UPPTAGNINGSOMRÅDE =============== -->

  ${renderProcessSteps({ eyebrow: 'Så går det till', heading: 'Från förfrågan till färdigt arbete', steps: site.process })}

  <!-- =============== VARFÖR OSS =============== -->
  <div class="tp-chose-area p-relative">
    <div class="container-fluid p-0">
      <div class="row gx-0 align-items-stretch">
        <div class="col-lg-5 d-none d-lg-block">
          <img src="/assets/img/hero/varfor-oss.jpeg" alt="Grävmaskin i arbete" style="width:100%;height:100%;min-height:100%;object-fit:cover;display:block;">
        </div>
        <div class="col-lg-7">
          <div class="p-relative" style="background:var(--nt-navy);padding:100px 8% 90px;">
            <span class="nt-eyebrow nt-eyebrow-light">Varför ${escapeHtml(site.shortName)}</span>
            <h2 class="mb-20 fs-xl-40 fs-sm-36 tp-text-common-white">Trygghet och lokal kännedom — samlat på ett ställe</h2>
            <p class="mb-45" style="color:rgba(255,255,255,0.75);max-width:560px;">Vi är inte bara en grävfirma — vi är en lokal partner som känner Stockholmsområdets mark, tar ansvar för hela projektet och finns kvar om något behöver justeras efteråt. <a href="/om-oss" style="color:#F5B400;text-decoration:underline;">Läs mer om oss</a> och hur vi arbetar.</p>
            <div class="nt-usp-item">
              <div class="nt-usp-icon"><i class="fas fa-file-invoice"></i></div>
              <div class="nt-usp-text">
                <h5>${escapeHtml(t.fSkatt.label)}</h5>
                <p>${escapeHtml(t.fSkatt.value)}</p>
              </div>
            </div>
            <div class="nt-usp-item">
              <div class="nt-usp-icon"><i class="fas fa-shield-check"></i></div>
              <div class="nt-usp-text">
                <h5>${escapeHtml(t.insurance.label)}</h5>
                <p>${escapeHtml(t.insurance.value)}</p>
              </div>
            </div>
            <div class="nt-usp-item">
              <div class="nt-usp-icon"><i class="fas fa-location-dot"></i></div>
              <div class="nt-usp-text">
                <h5>Lokal förankring</h5>
                <p>Hemort i ${escapeHtml(site.homeBase)}, verksamma i hela ${escapeHtml(site.primaryLocation)}.</p>
              </div>
            </div>
            <div class="nt-usp-item">
              <div class="nt-usp-icon"><i class="fas fa-star"></i></div>
              <div class="nt-usp-text">
                <h5>${escapeHtml(String(t.reviews.averageRating))} av 5 på ${escapeHtml(t.reviews.source)}</h5>
                <p>Baserat på ${escapeHtml(String(t.reviews.count))} recensioner från riktiga kunder. <a href="${escapeAttr(t.reviews.url)}" target="_blank" rel="noopener" style="color:#F5B400;text-decoration:underline;">Läs recensionerna</a>.</p>
              </div>
            </div>
            <a href="/kontakt" class="tp-btn-xl mt-20 d-inline-block lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-btn-switch-animation tp-text-common-white fw-500">
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
  </div>
  <!-- =============== /VARFÖR OSS =============== -->

  <!-- =============== SIFFROR =============== -->
  <div class="tp-counter-area pt-90 pb-60" style="background:var(--nt-gray-light);">
    <div class="container">
      <div class="row">
        ${statBlock('fa-diagram-project', 'Genomförda projekt', `${t.projectsCompleted}+`)}
        ${statBlock('fa-list-check', 'Tjänsteområden', site.services.length)}
        ${statBlock('fa-award', 'Års erfarenhet', `${t.yearsExperience}+`)}
        ${statBlock('fa-star', 'Betyg på Reco', `${t.reviews.averageRating}/5`)}
      </div>
    </div>
  </div>
  <!-- =============== /SIFFROR =============== -->

  ${renderPromiseBlock(site)}

  ${renderTestimonials(site)}

  <!-- =============== FAQ =============== -->
  <div class="pt-30 pb-130" style="background:var(--nt-white);">
    <div class="container">
      <div class="row justify-content-center mb-50">
        <div class="col-xl-7 text-center">
          <span class="nt-eyebrow" style="justify-content:center;">Vanliga frågor</span>
          <h2 class="mb-20 fs-xl-40 fs-sm-36">Bra att veta innan ni kontaktar oss</h2>
          <p style="color:var(--nt-gray);line-height:1.8;">Vanliga frågor om oss som företag och hur vi arbetar. Fler frågor specifika för respektive tjänst hittar du på <a href="/tjanster">tjänstesidorna</a>, och fördjupning kring ROT-avdrag och bygglov i våra <a href="/guider">guider</a>.</p>
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-9">${site.faq.map(faqItem).join('')}
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /FAQ =============== -->

  ${renderCtaBand(site, {
    eyebrow: 'Redo att börja?',
    heading: 'Berätta vad du behöver hjälp med',
    subtext: 'Kontakta oss idag och få ett skräddarsytt förslag — snabbt och enkelt.',
  })}`;

  return { metaHtml, schemaHtml, bodyContent };
}

module.exports = { renderHomePage };
