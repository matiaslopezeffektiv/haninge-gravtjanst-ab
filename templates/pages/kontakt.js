const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr, isPlaceholder, serviceOptions } = require('../../lib/html');
const { renderTrustBadges } = require('../partials/trustBadges');
const { renderProcessSteps } = require('../partials/processSteps');
const { renderCtaBand } = require('../partials/ctaBand');

const CONTACT_FORM_STYLES = `<style>
    .nt-contact-info-box {
      background: #fff; border: 1px solid #e6eaf0; border-radius: 12px;
      padding: 28px 26px; margin-bottom: 18px; display: flex; align-items: flex-start; gap: 16px;
      transition: box-shadow .3s ease, border-color .3s ease;
    }
    .nt-contact-info-box:hover { border-color: #D99A00; box-shadow: 0 12px 30px rgba(0,0,0,.10); }
    .nt-contact-info-box .icon {
      width: 50px; height: 50px; background: #FFF4D6; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    /* Mörk ikon på ljus gul tint — ren gul ikonfärg syns knappt mot en gul bakgrundston. */
    .nt-contact-info-box .icon i { color: #1A1A1A; font-size: 1.1rem; }
    .nt-contact-info-box h5 { color: #1A1A1A; font-weight: 700; margin-bottom: 4px; font-size: 1rem; }
    .nt-contact-info-box p, .nt-contact-info-box a { color: #4A4A4A; margin: 0; font-size: .95rem; text-decoration: none; }
    .nt-contact-info-box a:hover { color: #D99A00; }
    .nt-phone-cta { background: #1A1A1A; border-radius: 12px; padding: 34px 30px; text-align: center; margin-bottom: 18px; }
    .nt-phone-cta p { color: rgba(255,255,255,.7); margin-bottom: 8px; }
    .nt-phone-cta a, .nt-phone-cta .nt-todo { font-size: 1.6rem; font-weight: 700; text-decoration: none; display: block; }
    /* Gul text funkar här — botten är mörk antracit (~9.5:1 kontrast), inte vit. */
    .nt-phone-cta a { color: #F5B400; }
    .nt-phone-cta a:hover { color: #fff; }
  </style>`;

/**
 * @param {object} site - data/site.json
 */
function renderKontaktPage(site) {
  const title = `Kontakta ${site.name} — Begär offert`;
  const description = `Kontakta ${site.name} för en kostnadsfri bedömning av ditt mark- eller anläggningsprojekt i ${site.primaryLocation}. Vi återkommer med en offert.`;

  const metaHtml = buildMetaTags({ site, title, description, path: '/kontakt' });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Hem', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Kontakt' },
      ],
    },
  ]);

  const phoneBlock = isPlaceholder(site.phone)
    ? `<b class="nt-todo">${escapeHtml(site.phone)}</b>`
    : `<a href="${escapeAttr(site.phoneHref)}">${escapeHtml(site.phone)}</a>`;

  const emailBlock = isPlaceholder(site.email)
    ? `<b class="nt-todo">${escapeHtml(site.email)}</b>`
    : `<a href="mailto:${escapeAttr(site.email)}">${escapeHtml(site.email)}</a>`;

  const bodyContent = `
  <!-- =============== BREADCRUMB =============== -->
  <div class="tp-breadcrumb-area tp-breadcrumb-spacing nt-dark-band pt-180 pb-90" style="background:var(--nt-navy);">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-9">
          <div class="tp-breadcrumb-content">
            <h1 class="tp-breadcrumb-title fw-600 fs-60 fs-xs-40 ls-m-3 tp-text-common-white lh-1 mb-20">Kontakta oss</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li>Kontakt</li></ul></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /BREADCRUMB =============== -->

  <!-- =============== KONTAKT =============== -->
  <div class="tp-contact-area pt-130 pb-130" style="background-color:var(--nt-gray-light);">
    <div class="container">
      <div class="row g-5">

        <div class="col-lg-7">
          <div style="background:#fff;border-radius:14px;padding:48px 44px;box-shadow:0 18px 50px rgba(0,0,0,.08);">
            <span class="nt-eyebrow">Begär offert</span>
            <h2 class="mb-15 fs-xl-40 fs-sm-36">Berätta vad du behöver hjälp med</h2>
            <p style="color:var(--nt-gray);margin-bottom:36px;">Fyll i formuläret så återkommer vi med en kostnadsfri bedömning och offert.</p>

            <form class="nt-contact-form" id="contact-form">
              <div class="row">
                <div class="col-md-6"><label>Namn *</label><input type="text" name="name" required placeholder="Anna Svensson"></div>
                <div class="col-md-6"><label>Telefon *</label><input type="tel" name="phone" required placeholder="070-123 45 67"></div>
              </div>
              <div class="row">
                <div class="col-md-6"><label>E-post *</label><input type="email" name="email" required placeholder="anna@example.se"></div>
                <div class="col-md-6"><label>Adress / område *</label><input type="text" name="address" required placeholder="Gata, stadsdel eller ort"></div>
              </div>
              <label>Vilken tjänst gäller det? *</label>
              <select name="service" required>
                <option value="">— Välj tjänst —</option>${serviceOptions(site.services)}
              </select>
              <label>Kort beskrivning av behovet *</label>
              <textarea name="message" required placeholder="Berätta kort om projektet — vad, var och ungefär när..."></textarea>
              <label>Bifoga bild (valfritt)</label>
              <input type="file" name="image" id="contact-image" accept="image/*">
              <span class="nt-file-hint">Max 4 MB. En bild kan hjälpa oss bedöma jobbet snabbare.</span>
              <button type="submit" class="tp-btn-xl d-block w-100 lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-text-common-white fw-500" style="border:none;padding:18px;">
                Skicka förfrågan &rarr;
              </button>
              <div class="nt-form-message" style="display:none;margin-top:18px;padding:14px 18px;border-radius:8px;font-size:.92rem;"></div>
            </form>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="nt-phone-cta">
            <p><i class="fas fa-phone-alt" style="color:#F5B400;margin-right:6px;"></i> Snabbaste vägen — ring oss direkt</p>
            ${phoneBlock}
            <p style="margin-top:10px;font-size:.85rem;">Vi återkommer så snart vi kan.</p>
          </div>

          <div class="nt-contact-info-box">
            <div class="icon"><i class="fas fa-envelope"></i></div>
            <div>
              <h5>E-post</h5>
              ${emailBlock}
            </div>
          </div>

          <div class="nt-contact-info-box">
            <div class="icon"><i class="fas fa-map-marker-alt"></i></div>
            <div>
              <h5>Plats</h5>
              <p>${escapeHtml(site.address.addressLocality)}, ${escapeHtml(site.address.addressRegion)}</p>
              <p style="font-size:.85rem;">Vi utför uppdrag i hela ${escapeHtml(site.primaryLocation)}</p>
            </div>
          </div>

          <div class="nt-contact-info-box" style="border:1.5px solid #F5B400;">
            <div class="icon" style="background:#F5B400;"><i class="fas fa-file-invoice" style="color:#1A1A1A;"></i></div>
            <div>
              <h5 style="color:#1A1A1A;">F-skatt &amp; ansvarsförsäkring</h5>
              <p>${escapeHtml(site.trustSignals.fSkatt.value)}. ${escapeHtml(site.trustSignals.insurance.value)}</p>
              <a href="${escapeAttr(site.trustSignals.fSkatt.verifyUrl)}" target="_blank" rel="noopener" style="font-size:.85rem;">${escapeHtml(site.trustSignals.fSkatt.verifyLabel)} →</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  <!-- =============== /KONTAKT =============== -->

  ${renderTrustBadges(site)}

  ${renderProcessSteps({ eyebrow: 'Så går det till', heading: 'Från förfrågan till färdigt arbete', steps: site.process })}

  ${renderCtaBand(site, {
    eyebrow: 'Redo att börja?',
    heading: 'Hellre ett samtal än ett formulär?',
    subtext: `Ring oss så pratar vi igenom ditt projekt direkt.`,
  })}`;

  const extraScripts = '<script src="/assets/js/contact-form.js"></script>';

  return { metaHtml, schemaHtml, bodyContent, extraStyles: CONTACT_FORM_STYLES, extraScripts };
}

module.exports = { renderKontaktPage };
