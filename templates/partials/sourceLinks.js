const { escapeHtml, escapeAttr } = require('../../lib/html');

/**
 * "Källor och läsvärt" — utlänkar till oberoende, auktoritativa källor
 * (myndigheter, Reco) för E-E-A-T. Aldrig till konkurrenter. Vilka källor
 * som är relevanta väljs per sida via en lista med nycklar som pekar in i
 * site.externalResources, så länkarna underhålls på ett ställe.
 * @param {object} site - data/site.json
 * @param {string[]} resourceKeys - nycklar i site.externalResources
 */
function renderSourceLinks(site, resourceKeys) {
  const resources = resourceKeys
    .map((key) => site.externalResources[key])
    .filter(Boolean);

  if (resources.length === 0) return '';

  const items = resources.map((r) => `
        <li><a href="${escapeAttr(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.label)}</a></li>`).join('');

  return `
  <!-- =============== KÄLLOR =============== -->
  <div class="pt-10 pb-60" style="background:var(--nt-white);">
    <div class="container">
      <div class="nt-sources">
        <h6>Källor och läsvärt</h6>
        <ul>${items}
        </ul>
      </div>
    </div>
  </div>
  <!-- =============== /KÄLLOR =============== -->`;
}

module.exports = { renderSourceLinks };
