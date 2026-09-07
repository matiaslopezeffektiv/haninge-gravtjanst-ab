function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function escapeAttr(str) {
  return escapeHtml(str);
}

/** Sant om värdet är en olöst platshållare, t.ex. "[TODO: telefonnummer]". */
function isPlaceholder(str) {
  return typeof str === 'string' && str.trim().startsWith('[TODO');
}

/**
 * Renderar en kontaktlänk (tel:/mailto:) — eller en synlig TODO-badge om
 * värdet ännu är en olöst platshållare, så vi aldrig skickar ut en trasig länk.
 */
function contactLinkOrTodo(value, href) {
  if (isPlaceholder(value)) {
    // <b>, inte <span>: flera theme-stilar (t.ex. .tp-feature-3-wrap span) styr
    // ALLA span-descendants som runda ikon-badges — den kollisionen gjorde
    // TODO-texten till en tom cirkel istället för läsbar text.
    return `<b class="nt-todo">${escapeHtml(value)}</b>`;
  }
  return `<a href="${escapeAttr(href)}">${escapeHtml(value)}</a>`;
}

/** <option>-lista av tjänster för formulärens tjänste-dropdown, delad mellan
 * kontaktformuläret, hero-minformuläret på startsidan och sidopanelens
 * formulär på tjänste-/ort-sidor. `selectedName` förväljer en tjänst (t.ex.
 * den aktuella sidans) utan att låsa fältet — besökaren kan fortfarande ändra. */
function serviceOptions(services, selectedName) {
  return services.map((s) => `<option value="${escapeAttr(s.name)}"${s.name === selectedName ? ' selected' : ''}>${escapeHtml(s.name)}</option>`).join('') +
    `<option value="Övrigt / Vet ej">Övrigt / Vet ej</option>`;
}

module.exports = { escapeHtml, escapeAttr, isPlaceholder, contactLinkOrTodo, serviceOptions };
