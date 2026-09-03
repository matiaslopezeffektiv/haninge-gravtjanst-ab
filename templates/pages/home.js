const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr, isPlaceholder } = require('../../lib/html');

function serviceCard(svc) {
  if (svc.hasPage) {
    return `
        <div class="col-xl-4 col-md-6">
          <div class="nt-icon-card position-relative wow fadeInUp" data-wow-delay=".2s" data-wow-duration=".9s">
            <div class="nt-icon-card__icon"><i class="fas ${svc.icon}"></i></div>
            <h4><a href="/tjanster/${svc.slug}">${escapeHtml(svc.name)}</a></h4>
            <p>[TODO: kort beskrivning från kund]</p>
            <a class="nt-icon-card__link" href="/tjanster/${svc.slug}">Läs mer <i class="fas fa-arrow-right"></i></a>
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

function trustBadge(icon, label, value) {
  const valueHtml = isPlaceholder(value) ? `<b class="nt-todo">${escapeHtml(value)}</b>` : escapeHtml(value);
  return `
          <div class="col-lg-4 col-md-6 tp-counter-3-border">
            <div class="tp-feature-3-wrap tpshake-wrap d-flex md-space wow fadeInUp" data-wow-delay=".2s" data-wow-duration=".9s">
              <span class="mr-25 nt-icon-card__icon" style="margin-bottom:0;flex-shrink:0;"><i class="fas ${icon}"></i></span>
              <div>
                <h3 class="fs-24 fw-600 mb-10" style="color:var(--nt-navy);">${escapeHtml(label)}</h3>
                <p style="color:var(--nt-gray);margin:0;">${valueHtml}</p>
              </div>
            </div>
          </div>`;
}

function statBlock(label, value) {
  const valueHtml = value == null
    ? '<b class="nt-todo">TODO</b>'
    : `<span>${escapeHtml(String(value))}</span>`;
  return `
        <div class="col-xl-3 col-lg-6 col-md-6">
          <div class="tp-counter-wrap d-flex align-items-center mb-30 wow fadeInUp" data-wow-delay=".1s" data-wow-duration=".9s">
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
function renderHomePage(site) {
  const metaHtml = buildMetaTags({
    site,
    title: `${site.name} — Mark- & anläggningsarbeten i Stockholm`,
    description: site.description,
    path: '/',
  });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    { '@type': 'WebSite', name: site.name, url: site.url, inLanguage: site.language },
  ]);

  const t = site.trustSignals;

  const bodyContent = `
  <!-- =============== HERO =============== -->
  <section class="nt-hero-static">
    <div class="container nt-hero-content">
      <div class="row">
        <div class="col-xl-8 col-lg-10">
          <span class="nt-eyebrow nt-eyebrow-light">Mark &amp; anläggning i ${escapeHtml(site.primaryLocation)}</span>
          <h1>Grävfirma i <span>${escapeHtml(site.primaryLocation)}</span> — från dränering till färdig mark</h1>
          <p>${escapeHtml(site.name)} utför mark- och anläggningsarbeten åt privatpersoner, företag och BRF:er i hela ${escapeHtml(site.primaryLocation)}, med ${escapeHtml(site.homeBase)} som hemort. <b class="nt-todo">[TODO: riktig text från kund]</b></p>
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

  <!-- =============== TRYGGHETSPUNKTER =============== -->
  <div class="tp-feature-area tp-feature-4-wrap pt-90 pb-60 fix" style="background:var(--nt-white);">
    <div class="container">
      <div class="tp-border-bottom pb-30">
        <div class="row gx-60">
          ${trustBadge('fa-file-invoice', t.fSkatt.label, t.fSkatt.value)}
          ${trustBadge('fa-shield-check', t.insurance.label, t.insurance.value)}
          ${trustBadge('fa-certificate', 'Branschcertifiering', t.certifications[0])}
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /TRYGGHETSPUNKTER =============== -->

  <!-- =============== OM OSS =============== -->
  <div class="tp-about-area pt-130 pb-110">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6 mb-40">
          <div class="p-relative mr-50" style="min-height:340px;border-radius:14px;background:linear-gradient(135deg,var(--nt-navy) 0%,var(--nt-navy-light) 100%);display:flex;align-items:center;justify-content:center;">
            <b class="nt-todo" style="font-size:1rem;">[TODO: bild från kund — pågående markarbete]</b>
          </div>
        </div>
        <div class="col-lg-6 mb-40">
          <div class="tp-about-2-content tp-about-4-content ml-30">
            <span class="nt-eyebrow">Om ${escapeHtml(site.shortName)}</span>
            <h2 class="mb-25 fs-xl-40 fs-sm-36 wow img-custom-anim-top" data-wow-duration="1.5s" data-wow-delay="0.2s">Lokal grävfirma med ${escapeHtml(site.primaryLocation)} som arbetsfält</h2>
            <p class="mb-20 nt-todo-block">[TODO: riktig text från kund] Beskriv företagets historia, erfarenhet och specialisering inom mark- och anläggningsarbete.</p>
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
          <h2 class="fs-xl-40 fs-sm-36 wow img-custom-anim-left" data-wow-duration="1.5s" data-wow-delay="0.2s">Mark- och anläggningsarbete från grund till finplanering</h2>
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
      <div class="row g-4">${site.services.map(serviceCard).join('')}
      </div>
    </div>
  </div>
  <!-- =============== /TJÄNSTER =============== -->

  <!-- =============== SÅ GÅR DET TILL =============== -->
  <div class="tp-process-area bg-position pt-130 pb-130" style="background-color:#FDF3EA;">
    <div class="container">
      <div class="row justify-content-center mb-70">
        <div class="col-xl-7 text-center">
          <span class="nt-eyebrow">Så går det till</span>
          <h2 class="fs-xl-40 fs-sm-36 wow img-custom-anim-top" data-wow-duration="1.5s" data-wow-delay="0.2s">Från förfrågan till färdigt arbete</h2>
        </div>
      </div>
      <div class="row g-4 gy-5">
        <div class="col-xl-3 col-md-6">
          <div class="nt-step h-100 wow fadeInUp" data-wow-delay=".1s" data-wow-duration=".9s">
            <span class="nt-step__num">01</span>
            <h4>Du hör av dig</h4>
            <p>Ring, mejla eller fyll i formuläret. Berätta vad du behöver hjälp med och var fastigheten ligger.</p>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="nt-step h-100 wow fadeInUp" data-wow-delay=".2s" data-wow-duration=".9s">
            <span class="nt-step__num">02</span>
            <h4>Kostnadsfri bedömning</h4>
            <p>Vi bedömer omfattningen — vid behov besöker vi platsen — och tar fram en offert.</p>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="nt-step h-100 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".9s">
            <span class="nt-step__num">03</span>
            <h4>Vi utför arbetet</h4>
            <p>[TODO: riktig text från kund] Genomförande enligt överenskommen tidsplan och offert.</p>
          </div>
        </div>
        <div class="col-xl-3 col-md-6">
          <div class="nt-step h-100 wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">
            <span class="nt-step__num">04</span>
            <h4>Slutbesiktning</h4>
            <p>[TODO: riktig text från kund] Genomgång av utfört arbete, ev. dokumentation lämnas.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /SÅ GÅR DET TILL =============== -->

  <!-- =============== VARFÖR OSS =============== -->
  <div class="tp-chose-area p-relative">
    <div class="container-fluid p-0">
      <div class="row gx-0 align-items-stretch">
        <div class="col-lg-5 d-none d-lg-block">
          <div class="h-100" style="min-height:100%;background:linear-gradient(135deg,var(--nt-navy-dark) 0%,var(--nt-navy) 100%);"></div>
        </div>
        <div class="col-lg-7">
          <div class="p-relative" style="background:var(--nt-navy);padding:100px 8% 90px;">
            <span class="nt-eyebrow nt-eyebrow-light">Varför ${escapeHtml(site.shortName)}</span>
            <h2 class="mb-20 fs-xl-40 fs-sm-36 tp-text-common-white wow img-custom-anim-left" data-wow-duration="1.5s" data-wow-delay="0.2s">Trygghet och lokal kännedom — samlat på ett ställe</h2>
            <p class="mb-45" style="color:rgba(255,255,255,0.75);max-width:560px;">[TODO: riktig text från kund]</p>
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
                <p class="nt-todo">${escapeHtml(t.insurance.value)}</p>
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
              <div class="nt-usp-icon"><i class="fas fa-certificate"></i></div>
              <div class="nt-usp-text">
                <h5>Branschcertifiering</h5>
                <p class="nt-todo">${escapeHtml(t.certifications[0])}</p>
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
        ${statBlock('Genomförda projekt', t.projectsCompleted)}
        ${statBlock('Tjänsteområden', site.services.length)}
        ${statBlock('Års erfarenhet', t.yearsExperience)}
        ${statBlock('Betyg i kundrecensioner', t.reviews.averageRating)}
      </div>
    </div>
  </div>
  <!-- =============== /SIFFROR =============== -->

  <!-- =============== KUNDRECENSIONER =============== -->
  <div class="pt-100 pb-100" style="background:var(--nt-white);">
    <div class="container text-center">
      <span class="nt-eyebrow">Kundrecensioner</span>
      <h2 class="fs-xl-40 fs-sm-36 mb-30 wow img-custom-anim-top" data-wow-duration="1.5s" data-wow-delay="0.2s">Vad våra kunder säger</h2>
      <div class="nt-todo-block d-inline-block" style="max-width:520px;">
        [TODO: riktiga kundrecensioner läggs in här när kunden tillhandahåller dem. Strukturen för Review/AggregateRating-schema är förberedd i lib/schema/review.js.]
      </div>
    </div>
  </div>
  <!-- =============== /KUNDRECENSIONER =============== -->

  <!-- =============== CTA =============== -->
  <div class="tp-cta-area nt-dark-band pt-120 pb-120" style="background:var(--nt-navy-dark);">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-10">
          <span class="nt-eyebrow nt-eyebrow-light">Redo att börja?</span>
          <h2 class="mb-15 fs-xl-40 fs-sm-36 tp-text-common-white wow img-custom-anim-left" data-wow-duration="1.5s" data-wow-delay="0.2s">Berätta vad du behöver hjälp med</h2>
          <p class="mb-40" style="color:rgba(255,255,255,0.78);font-size:1.05rem;max-width:620px;">Kontakta oss idag och få ett skräddarsytt förslag — snabbt och enkelt.</p>
          <div class="d-flex flex-wrap align-items-center gap-4">
            <a href="/kontakt" class="tp-btn-xl d-inline-block lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-btn-switch-animation tp-text-common-white fw-500">
              <span class="d-flex align-items-center justify-content-center">
                <span class="btn-text">Begär offert</span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
                <span class="btn-icon"><i class="fa-sharp fa-regular fa-arrow-right"></i></span>
              </span>
            </a>
            <span class="d-inline-flex align-items-center gap-3">
              <span style="width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;">
                <i class="fas fa-phone" style="color:#F47C20;"></i>
              </span>
              <span>
                <span style="display:block;color:rgba(255,255,255,0.6);font-size:.8rem;">Ring oss direkt</span>
                <span style="display:block;color:#fff;font-weight:700;font-size:1.05rem;">${isPlaceholder(site.phone) ? `<b class="nt-todo">${escapeHtml(site.phone)}</b>` : `<a href="${escapeAttr(site.phoneHref)}" style="color:#fff;">${escapeHtml(site.phone)}</a>`}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /CTA =============== -->`;

  return { metaHtml, schemaHtml, bodyContent };
}

module.exports = { renderHomePage };
