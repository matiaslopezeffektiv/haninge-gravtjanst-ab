const { escapeHtml, escapeAttr, serviceOptions } = require('../../lib/html');

/**
 * Sidopanelens formulärkort — samma lågtröskel-formulär (namn/telefon/tjänst)
 * som startsidans hero-kort, se assets/js/lead-form.js. Används på tjänste-
 * och tjänst×ort-sidor där en besökare redan visat intresse för en specifik
 * tjänst; dropdownen förvals till den men går att ändra.
 * @param {object} site - data/site.json
 * @param {object} params
 * @param {string} [params.presetServiceName] - förvald tjänst i dropdownen
 * @param {string} params.source - identifierar formuläret i inkommande lead-mejl
 * @param {string} params.idPrefix - gör fält-id:n unika per sida (t.ex. "tjanst" eller "ort")
 */
function renderLeadFormCard(site, { presetServiceName, source, idPrefix }) {
  return `
        <div class="nt-side-card nt-side-card--navy nt-hides-floating-call">
          <h3>Begär offert</h3>
          <p style="color:rgba(255,255,255,.65);font-size:.85rem;margin-bottom:18px;">Fyll i dina uppgifter så återkommer vi med en kostnadsfri bedömning.</p>
          <form class="nt-contact-form nt-lead-form" id="${escapeAttr(idPrefix)}-lead-form" data-source="${escapeAttr(source)}">
            <label for="${escapeAttr(idPrefix)}-lead-name">Namn</label>
            <input type="text" id="${escapeAttr(idPrefix)}-lead-name" name="name" required placeholder="Ditt namn">
            <label for="${escapeAttr(idPrefix)}-lead-phone">Telefon</label>
            <input type="tel" id="${escapeAttr(idPrefix)}-lead-phone" name="phone" required placeholder="070-123 45 67">
            <label for="${escapeAttr(idPrefix)}-lead-service">Önskad tjänst</label>
            <select id="${escapeAttr(idPrefix)}-lead-service" name="service" required>
              <option value="">— Välj tjänst —</option>${serviceOptions(site.services, presetServiceName)}
            </select>
            <button type="submit" class="tp-btn-xl d-block w-100 lh-0 tp-round-26 fs-16 tp-bg-theme-primary ls-0 tp-btn-switch-animation tp-text-common-white fw-500" style="border:none;padding:16px;">
              Skicka förfrågan &rarr;
            </button>
            <div class="nt-form-message"></div>
          </form>
          <p style="color:rgba(255,255,255,.55);font-size:.82rem;margin:18px 0 0;">Hellre ringa? <a href="${escapeAttr(site.phoneHref)}" style="color:#F5B400;font-weight:700;">${escapeHtml(site.phone)}</a></p>
        </div>`;
}

module.exports = { renderLeadFormCard };
