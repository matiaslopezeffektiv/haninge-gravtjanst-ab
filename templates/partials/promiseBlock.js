const { escapeHtml } = require('../../lib/html');

/**
 *"Vårt löfte" — ett mörkt löftesblock (inte kundrecensioner) som fanns på
 * startsidan i referensmallen men föll bort i ombrandningen. Bygger bara på
 * redan bekräftade fakta (F-skatt, ansvarsförsäkring/garantier, hemort) —
 * inga påhittade siffror (t.ex."98% nöjda kunder") som i referensmallen.
 * @param {object} site - data/site.json
 */
function renderPromiseBlock(site) {
  const t = site.trustSignals;
  return `
  <!-- =============== VÅRT LÖFTE =============== -->
  <div class="pt-100 pb-100" style="background:var(--nt-white);">
    <div class="container">
      <div class="tp-round-4" style="background:var(--nt-navy);overflow:hidden;">
        <div class="row align-items-stretch gx-0">
          <div class="col-xl-5 d-none d-lg-block">
            <img src="/assets/img/hero/asfaltering-projekt-1.webp" alt="Nyanlagd asfaltering vid villa" style="width:100%;height:100%;min-height:340px;object-fit:cover;display:block;">
          </div>
          <div class="col-xl-7">
            <div style="padding:70px 8% 66px;">
              <span class="nt-eyebrow nt-eyebrow-light">Vårt löfte</span>
              <h2 class="mb-25 fs-xl-40 fs-sm-36 tp-text-common-white">Vi håller vad vi lovar</h2>
              <p class="mb-30" style="color:rgba(255,255,255,0.75);">Det är grunden för hur vi arbetar — och det du kan förvänta dig av varje uppdrag, stort som litet.</p>
              <div class="tp-about-bottom-feature">
                <ul class="nt-check--light">
                  <li><i class="fa-sharp fa-solid fa-check"></i> Tydlig offert innan arbetet påbörjas — inga dolda kostnader.</li>
                  <li><i class="fa-sharp fa-solid fa-check"></i> ${escapeHtml(t.fSkatt.value)} och ansvarsförsäkring på alla uppdrag.</li>
                  <li><i class="fa-sharp fa-solid fa-check"></i> Garantier som täcker eventuella fel i vårt arbete.</li>
                  <li><i class="fa-sharp fa-solid fa-check"></i> Lokal närvaro i hela ${escapeHtml(site.primaryLocation)}, med ${escapeHtml(site.homeBase)} som hemort.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- =============== /VÅRT LÖFTE =============== -->`;
}

module.exports = { renderPromiseBlock };
