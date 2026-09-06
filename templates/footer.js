const { escapeHtml, escapeAttr, contactLinkOrTodo } = require('../lib/html');

function footerServiceLink(svc) {
  if (svc.hasPage) {
    return `<li><a href="/tjanster/${svc.slug}">${escapeHtml(svc.name)}</a></li>`;
  }
  return `<li><span style="color:rgba(255,255,255,0.4);">${escapeHtml(svc.name)}</span></li>`;
}

function renderFooter(site) {
  const year = new Date().getFullYear();
  return `
  <!-- =============== FOOTER =============== -->
  <footer class="tpfooter pt-80 pb-0">
    <div class="container">
      <div class="row g-5 pb-60">
        <div class="col-xl-4 col-lg-4 col-md-6">
          <div class="tpfooter-widget mb-40">
            <div class="tpfooter__logo mb-25">
              <a href="/"><img src="/assets/img/logo/haninge.webp" alt="${escapeAttr(site.name)}" class="nt-logo-on-dark" width="100" height="50" style="height:50px;width:auto;"></a>
            </div>
            <p style="color:rgba(255,255,255,0.65);line-height:1.7;">${escapeHtml(site.description)}</p>
          </div>
        </div>
        <div class="col-xl-2 col-lg-2 col-md-6">
          <div class="tpfooter-widget mb-40">
            <h3 class="tpfooter-widget__title mb-25">Snabblänkar</h3>
            <ul class="tpfooter__link">
              <li><a href="/">Hem</a></li>
              <li><a href="/tjanster">Tjänster</a></li>
              <li><a href="/omraden">Områden</a></li>
              <li><a href="/brf">BRF</a></li>
              <li><a href="/guider">Guider</a></li>
              <li><a href="/blogg">Blogg</a></li>
              <li><a href="/om-oss">Om oss</a></li>
              <li><a href="/kontakt">Kontakt</a></li>
              <li><a href="/integritetspolicy">Integritetspolicy</a></li>
            </ul>
          </div>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-6">
          <div class="tpfooter-widget mb-40">
            <h3 class="tpfooter-widget__title mb-25">Våra tjänster</h3>
            <ul class="tpfooter__link">${site.services.map(footerServiceLink).join('')}</ul>
          </div>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-6">
          <div class="tpfooter-widget mb-40">
            <h3 class="tpfooter-widget__title mb-25">Kontakt</h3>
            <ul class="tpfooter__link">
              <li><i class="fas fa-phone" style="color:#F5B400;margin-right:8px;"></i>${contactLinkOrTodo(site.phone, site.phoneHref)}</li>
              <li><i class="fas fa-envelope" style="color:#F5B400;margin-right:8px;"></i>${contactLinkOrTodo(site.email, `mailto:${site.email}`)}</li>
              <li><i class="fas fa-map-marker-alt" style="color:#F5B400;margin-right:8px;"></i><span style="color:rgba(255,255,255,0.7);">${escapeHtml(site.address.addressLocality)}, ${escapeHtml(site.address.addressRegion)}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="tpfooter__bottom">
      <div class="container">
        <div class="py-20 text-center">
          <p style="margin:0;">&copy; ${year} ${escapeHtml(site.name)}. Alla rättigheter förbehållna.</p>
          <p class="mt-10" style="margin:0;font-size:.85rem;"><a href="/integritetspolicy" style="color:rgba(255,255,255,.7);">Integritetspolicy</a> &nbsp;&middot;&nbsp; <a href="#" class="nt-cookie-settings-link" style="color:rgba(255,255,255,.7);">Cookie-inställningar</a></p>
        </div>
      </div>
    </div>
  </footer>
  <!-- =============== /FOOTER =============== -->`;
}

module.exports = { renderFooter };
