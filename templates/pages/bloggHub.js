const { buildMetaTags } = require('../../lib/metadata');
const { buildLocalBusinessSchema, renderSchemaGraph } = require('../../lib/schema');
const { escapeHtml, escapeAttr } = require('../../lib/html');

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

function postCard(post) {
  return `
        <div class="col-md-6 col-lg-4">
          <a href="/blogg/${escapeAttr(post.slug)}" class="nt-icon-card position-relative" style="display:block;padding:0;overflow:hidden;">
            <img src="${escapeAttr(post.heroImage)}" alt="${escapeAttr(post.heroImageAlt)}" style="width:100%;height:180px;object-fit:cover;display:block;">
            <div style="padding:26px;">
              <span style="color:var(--nt-gray);font-size:.82rem;">${escapeHtml(formatDate(post.publishDate))}</span>
              <h2 class="mt-8">${escapeHtml(post.title)}</h2>
              <p>${escapeHtml(post.excerpt)}</p>
              <span class="nt-icon-card__link">Läs mer <i class="fas fa-arrow-right"></i></span>
            </div>
          </a>
        </div>`;
}

/**
 * @param {object} site - data/site.json
 * @param {object[]} posts - alla data/blogg/*.json, nyast först
 */
function renderBloggHubPage(site, posts) {
  const title = `Blogg — ${site.name}`;
  const description = `Artiklar om dränering, markarbete, ROT-avdrag och underhåll av mark och husgrund i ${site.primaryLocation} och ${site.homeBase}.`;

  const metaHtml = buildMetaTags({ site, title, description, path: '/blogg' });

  const schemaHtml = renderSchemaGraph([
    buildLocalBusinessSchema(site),
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Hem', item: `${site.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Blogg' },
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
            <h1 class="tp-breadcrumb-title fw-600 fs-60 fs-xs-40 ls-m-3 tp-text-common-white lh-1 mb-20">Blogg — dränering, markarbete och ROT-avdrag</h1>
            <div class="tp-breadcrumb-dvdr"><ul><li><a href="/">Hem</a></li><li class="dvdr">/</li><li>Blogg</li></ul></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /BREADCRUMB =============== -->

  <div class="tp-service-area pt-130 pb-130" style="background:var(--nt-white);">
    <div class="container">
      <div class="row justify-content-center mb-60">
        <div class="col-xl-8 text-center">
          <p style="color:var(--nt-gray);font-size:1.05rem;">Tips och kunskap om dränering, markarbete och underhåll av mark och husgrund i Stockholmsområdet.</p>
        </div>
      </div>
      <div class="row g-4">${posts.map(postCard).join('')}
      </div>
    </div>
  </div>`;

  return { metaHtml, schemaHtml, bodyContent };
}

module.exports = { renderBloggHubPage };
