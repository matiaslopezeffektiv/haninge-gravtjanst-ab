const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, buildBreadcrumbSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr, isPlaceholder } = require('../../lib/html');

const POLICY_STYLES = `<style>
    .nt-policy p, .nt-policy li { color: var(--nt-gray); line-height: 1.8; }
    .nt-policy h2 { font-size: 1.5rem; font-weight: 700; color: var(--nt-navy); margin: 46px 0 16px; }
    .nt-policy h2:first-child { margin-top: 0; }
    .nt-policy ul { padding-left: 20px; margin-bottom: 16px; }
    .nt-policy a { color: #1A1A1A; text-decoration: underline; }
    .nt-policy .nt-updated { color: var(--nt-gray); font-size: .9rem; margin-bottom: 40px; }
  </style>`;

/**
 * @param {object} site - data/site.json
 */
function renderIntegritetspolicyPage(site) {
  const title = `Integritetspolicy — ${site.name}`;
  const description = `Läs hur ${site.name} samlar in, använder och skyddar dina personuppgifter, samt hur vi använder cookies på webbplatsen.`;

  const metaHtml = buildMetaTags({ site, title, description, path: '/integritetspolicy' }) +
    `\n  <meta name="robots" content="noindex, follow">`;

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    buildBreadcrumbSchema([
      { name: 'Hem', url: `${site.url}/` },
      { name: 'Integritetspolicy' },
    ]),
  ]);

  const phone = isPlaceholder(site.phone) ? site.phone : `<a href="${escapeAttr(site.phoneHref)}">${escapeHtml(site.phone)}</a>`;
  const email = isPlaceholder(site.email) ? site.email : `<a href="mailto:${escapeAttr(site.email)}">${escapeHtml(site.email)}</a>`;
  const updated = new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' });

  const bodyContent = `
  <!-- =============== BREADCRUMB =============== -->
  <div class="tp-breadcrumb-area tp-breadcrumb-spacing nt-dark-band pt-180 pb-90" style="background:var(--nt-navy);">
    <div class="container">
      <div class="row">
        <div class="col-xl-8 col-lg-9">
          <div class="tp-breadcrumb-content">
            <h1 class="tp-breadcrumb-title fw-600 fs-60 fs-xs-40 ls-m-3 tp-text-common-white lh-1 mb-20">Integritetspolicy</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li>Integritetspolicy</li></ul></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /BREADCRUMB =============== -->

  <!-- =============== INTEGRITETSPOLICY =============== -->
  <div class="pt-130 pb-110">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-xl-8 col-lg-10 nt-policy">
          <p class="nt-updated">Senast uppdaterad: ${escapeHtml(updated)}</p>

          <h2>1. Vem är personuppgiftsansvarig?</h2>
          <p>${escapeHtml(site.name)} ("vi","oss") är personuppgiftsansvarig för behandlingen av dina personuppgifter i samband med denna webbplats.</p>
          <p>Adress: <span class="${isPlaceholder(site.address.streetAddress) ? 'nt-todo' : ''}">${escapeHtml(site.address.streetAddress)}, ${escapeHtml(site.address.postalCode)} ${escapeHtml(site.address.addressLocality)}</span><br>E-post: ${email}<br>Telefon: ${phone}</p>

          <h2>2. Vilka uppgifter samlar vi in?</h2>
          <p>När du använder vårt kontaktformulär ("Begär offert") samlar vi in de uppgifter du själv anger, till exempel:</p>
          <ul>
            <li>Namn</li>
            <li>Telefonnummer</li>
            <li>E-postadress</li>
            <li>Adress/område för uppdraget</li>
            <li>Önskad tjänst och beskrivning av behovet</li>
            <li>Eventuell bifogad bild</li>
          </ul>
          <p>Om du samtycker till statistikcookies samlar vi även in anonymiserad besöksstatistik, se avsnitt 6 nedan.</p>

          <h2>3. Varför behandlar vi dina uppgifter?</h2>
          <p>Vi använder uppgifterna för att kunna besvara din förfrågan, lämna offert och kommunicera med dig kring ett eventuellt uppdrag. Den rättsliga grunden är antingen berättigat intresse (att kunna hantera inkommande förfrågningar) eller att vidta åtgärder inför ingående av avtal, beroende på vad förfrågan gäller.</p>

          <h2>4. Hur länge sparar vi uppgifterna?</h2>
          <p>Uppgifter från kontaktformuläret sparas så länge det behövs för att hantera din förfrågan och eventuell efterföljande dialog. Leder förfrågan inte till ett kundförhållande raderar eller anonymiserar vi uppgifterna inom rimlig tid, normalt inom 24 månader.</p>

          <h2>5. Vem delar vi uppgifterna med?</h2>
          <p>Vi delar uppgifter med underleverantörer som hjälper oss driva webbplatsen och hantera kommunikation:</p>
          <ul>
            <li><strong>Resend</strong> — skickar e-post från kontaktformuläret till oss.</li>
            <li><strong>Vercel</strong> — driftar och hostar webbplatsen, samt levererar anonymiserad besöksstatistik (Vercel Analytics) om du samtyckt till detta.</li>
          </ul>
          <p>Dessa leverantörer kan behandla uppgifter i länder utanför EU/EES. I sådana fall säkerställer vi att överföringen sker med lämpliga skyddsåtgärder, exempelvis EU-kommissionens standardavtalsklausuler.</p>

          <h2>6. Cookies</h2>
          <p>Vi använder följande kategorier av cookies och liknande tekniker:</p>
          <ul>
            <li><strong>Nödvändiga</strong> — krävs för att webbplatsen ska fungera korrekt. Dessa kan inte stängas av.</li>
            <li><strong>Statistik</strong> — Vercel Analytics, som ger oss anonymiserad, aggregerad besöksstatistik. Används endast om du aktivt samtycker.</li>
          </ul>
          <p>Du kan när som helst ändra ditt samtycke via knappen nedan.</p>
          <p><button type="button" class="nt-cookie-settings-link" style="background:none;border:1.5px solid #1A1A1A;color:#1A1A1A;border-radius:8px;padding:10px 20px;font-weight:600;cursor:pointer;">Ändra cookie-inställningar</button></p>

          <h2>7. Dina rättigheter</h2>
          <p>Enligt dataskyddsförordningen (GDPR) har du rätt att:</p>
          <ul>
            <li>Begära tillgång till (registerutdrag) de uppgifter vi har om dig</li>
            <li>Begära rättelse av felaktiga uppgifter</li>
            <li>Begära radering av dina uppgifter ("rätten att bli glömd")</li>
            <li>Begära begränsning av behandlingen eller invända mot den</li>
            <li>Begära dataportabilitet</li>
            <li>Återkalla ett lämnat samtycke när som helst</li>
          </ul>
          <p>Kontakta oss på ${email} för att utöva någon av dina rättigheter. Du har också rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY), <a href="https://www.imy.se" target="_blank" rel="noopener">imy.se</a>.</p>

          <h2>8. Ändringar i denna policy</h2>
          <p>Vi kan komma att uppdatera denna integritetspolicy. Den senaste versionen finns alltid publicerad på denna sida, med angivet datum för senaste uppdatering.</p>

          <h2>9. Kontakt</h2>
          <p>Har du frågor om vår behandling av personuppgifter? Kontakta oss på ${email} eller ${phone}.</p>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /INTEGRITETSPOLICY =============== -->`;

  return { metaHtml, schemaHtml, bodyContent, extraStyles: POLICY_STYLES };
}

module.exports = { renderIntegritetspolicyPage };
