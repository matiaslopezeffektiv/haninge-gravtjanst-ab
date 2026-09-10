const { escapeHtml, escapeAttr } = require('../../lib/html');

/**
 * Före/efter-jämförelse för referensprojekt — två bilder sida vid sida med
 * tydliga "Före"/"Efter"-märken, istället för en enskild statisk bild.
 * Kräver att båda bilderna faktiskt visar samma plats (annars blir
 * jämförelsen missvisande) — se anropsställena för vilka projekt det gäller.
 * @param {object} params
 * @param {string} params.title
 * @param {string} params.description
 * @param {string} params.beforeImage
 * @param {string} params.beforeAlt
 * @param {string} params.afterImage
 * @param {string} params.afterAlt
 */
function beforeAfterCard({ title, description, beforeImage, beforeAlt, afterImage, afterAlt }) {
  return `
        <div class="nt-before-after">
          <div class="nt-before-after__images">
            <div class="nt-before-after__img-wrap">
              <span class="nt-before-after__badge nt-before-after__badge--before">Före</span>
              <img src="${escapeAttr(beforeImage)}" alt="${escapeAttr(beforeAlt)}" loading="lazy" style="width:100%;height:220px;object-fit:cover;display:block;">
            </div>
            <div class="nt-before-after__img-wrap">
              <span class="nt-before-after__badge nt-before-after__badge--after">Efter</span>
              <img src="${escapeAttr(afterImage)}" alt="${escapeAttr(afterAlt)}" loading="lazy" style="width:100%;height:220px;object-fit:cover;display:block;">
            </div>
          </div>
          <div class="nt-before-after__caption">
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(description)}</p>
          </div>
        </div>`;
}

/**
 * @param {object} params
 * @param {string} params.heading
 * @param {Array} params.pairs - se beforeAfterCard för fältformat
 */
function renderBeforeAfterSection({ heading, pairs }) {
  if (!pairs || !pairs.length) return '';
  const colClass = pairs.length === 1 ? 'col-lg-8' : 'col-lg-6';
  return `
  <!-- =============== FÖRE & EFTER =============== -->
  <div class="pt-30 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <span class="nt-eyebrow">Före &amp; efter</span>
      <h2 class="fs-xl-40 fs-sm-36 mb-40">${escapeHtml(heading)}</h2>
      <div class="row g-4">${pairs.map((p) => `
        <div class="${colClass}">${beforeAfterCard(p)}</div>`).join('')}</div>
    </div>
  </div>
  <!-- =============== /FÖRE & EFTER =============== -->`;
}

module.exports = { renderBeforeAfterSection };
