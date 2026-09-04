const { escapeHtml, escapeAttr, isPlaceholder } = require('../../lib/html');

/**
 * Flytande "Ring nu"-knapp, synlig på alla sidor — särskilt viktig på mobil
 * där besökare hellre ringer direkt än fyller i ett formulär. Visas inte
 * om telefonnumret ännu är en olöst platshållare.
 * @param {object} site - data/site.json
 */
function renderFloatingCallButton(site) {
  if (isPlaceholder(site.phone)) return '';

  return `
  <a href="${escapeAttr(site.phoneHref)}" class="nt-floating-call" aria-label="Ring ${escapeHtml(site.phone)}">
    <i class="fas fa-phone"></i>
    <span class="nt-floating-call__text">Ring nu</span>
  </a>`;
}

module.exports = { renderFloatingCallButton };
