const { escapeHtml, escapeAttr } = require('../../lib/html');

/**
 * Utlänk-badge till en av kundens sex satellitdomäner — samma mönster som
 *"Läs mer på draneringarstockholm.nu" på nuvarande sajt, men som en
 * återanvändbar komponent istället för hårdkodad text per sida, så
 * strategin (behålla/ta bort/byta domän) är lätt att justera på ett ställe.
 * Returnerar tom sträng om tjänsten saknar en kopplad satellitdomän.
 * @param {object} site - data/site.json
 * @param {string} serviceSlug
 */
function renderSatelliteLink(site, serviceSlug) {
  const url = site.satelliteSites && site.satelliteSites[serviceSlug];
  if (!url) return '';

  const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `<p class="nt-satellite-link"><i class="fas fa-arrow-up-right-from-square"></i> Läs mer på <a href="${escapeAttr(url)}" target="_blank" rel="noopener">${escapeHtml(domain)}</a></p>`;
}

module.exports = { renderSatelliteLink };
