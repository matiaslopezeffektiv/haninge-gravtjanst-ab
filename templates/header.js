const { escapeHtml, escapeAttr, contactLinkOrTodo, isPlaceholder } = require('../lib/html');

function serviceLinkDesktop(svc) {
  if (svc.hasPage) {
    return `<a href="/tjanster/${svc.slug}"><i class="fas ${svc.icon}"></i><span>${escapeHtml(svc.name)}</span></a>`;
  }
  return `<a href="#" class="nt-coming-soon" tabindex="-1"><i class="fas ${svc.icon}"></i><span>${escapeHtml(svc.name)}</span><span class="nt-coming-soon__badge">Kommer snart</span></a>`;
}

function serviceLinkMobile(svc) {
  if (svc.hasPage) {
    return `<li><a href="/tjanster/${svc.slug}">${escapeHtml(svc.name)}</a></li>`;
  }
  return `<li><a href="#" class="nt-coming-soon" tabindex="-1">${escapeHtml(svc.name)} <span class="nt-coming-soon__badge">Snart</span></a></li>`;
}

/**
 * Renderar offcanvas (mobilmeny) + desktop-header/nav.
 * @param {object} site - data/site.json
 * @param {string} activePath -"/","/tjanster","/tjanster/dranering","/om-oss","/kontakt"
 */
function renderHeader(site, activePath) {
  const isActive = (href) => (href === '/' ? activePath === '/' : activePath.startsWith(href)) ? ' active' : '';

  const navLinks = site.nav.map((item) => {
    if (item.href === '/tjanster') {
      return `<li class="has-dropdown${isActive('/tjanster')}"><a href="/tjanster">${escapeHtml(item.label)}</a>
                  <ul class="submenu tp-submenu d-lg-none">${site.services.map(serviceLinkMobile).join('')}</ul>
                  <div class="nt-megamenu nt-megamenu--services d-none d-lg-block">
                    <div class="nt-megamenu__inner">
                      <div class="nt-megamenu__cols"><div class="nt-megamenu__col">${site.services.map(serviceLinkDesktop).join('')}</div></div>
                    </div>
                  </div>
                </li>`;
    }
    return `<li class="${isActive(item.href).trim()}"><a href="${escapeAttr(item.href)}">${escapeHtml(item.label)}</a></li>`;
  }).join('');

  return `
  <!-- Preloader -->
  <div class="preloader"><div class="loading"></div></div>

  <!-- Back to top -->
  <div class="back-to-top-wrapper">
    <button id="back_to_top" type="button" class="back-to-top-btn">
      <svg width="12" height="7" viewBox="0 0 12 7" fill="none"><path d="M11 6L6 1L1 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  </div>

  <!-- =============== OFFCANVAS (mobil meny) =============== -->
  <div class="tpoffcanvas-area">
    <div class="tpoffcanvas">
      <div class="tpoffcanvas__close-btn">
        <button class="close-btn" aria-label="Stäng meny"><i class="fas fa-times"></i></button>
      </div>
      <div class="tpoffcanvas__logo mb-30">
        <a href="/"><img src="/assets/img/logo/haninge.png" alt="${escapeAttr(site.name)}" width="92" height="46" style="height:46px;width:auto;"></a>
      </div>
      <div class="tp-offcanvas-menu mb-30">
        <nav><ul>${navLinks}</ul></nav>
      </div>
      <div class="tpoffcanvas__contact-info">
        <ul>
          <li><i class="fas fa-phone" style="color:#D99A00;margin-right:10px;"></i>${contactLinkOrTodo(site.phone, site.phoneHref)}</li>
          <li class="mt-10"><i class="fas fa-envelope" style="color:#D99A00;margin-right:10px;"></i>${contactLinkOrTodo(site.email, `mailto:${site.email}`)}</li>
        </ul>
      </div>
      <div class="mt-30">
        <a href="/kontakt" class="tp-btn" style="padding:12px 26px;">Begär offert</a>
      </div>
    </div>
  </div>
  <div class="body-overlay"></div>
  <!-- =============== /OFFCANVAS =============== -->

  <!-- =============== NAVBAR =============== -->
  <header class="tpheader tp-header-height" id="header-sticky">
    <div class="container-fluid px-40">
      <div class="row align-items-center">
        <div class="col-xl-2 col-lg-3 col-6">
          <div class="tplogo">
            <a href="/" style="display:inline-block;">
              <img src="/assets/img/logo/haninge.png" alt="${escapeAttr(site.name)}" class="nt-logo-on-dark" width="104" height="52" style="height:52px;width:auto;display:block;">
              <span style="display:block;width:34px;height:3px;background:#F5B400;border-radius:2px;margin:4px auto 0;"></span>
            </a>
          </div>
        </div>
        <div class="col-xl-8 col-lg-7 d-none d-lg-block">
          <div class="tp-main-menu main-menu d-flex justify-content-center">
            <nav class="tp-mobile-menu-active">
              <ul>${navLinks}</ul>
            </nav>
          </div>
        </div>
        <div class="col-xl-2 col-lg-2 col-6 d-flex justify-content-end align-items-center gap-3">
          ${isPlaceholder(site.phone) ? '' : `<a href="${escapeAttr(site.phoneHref)}" class="d-none d-xxl-inline-flex align-items-center" style="color:#fff;font-weight:700;font-size:.92rem;white-space:nowrap;text-decoration:none;"><i class="fas fa-phone" style="color:#F5B400;margin-right:6px;"></i>${escapeHtml(site.phone)}</a>`}
          <a href="/kontakt" class="tp-btn d-none d-lg-inline-flex">Begär offert</a>
          <button class="tp-offcanvas-open-btn tp-menu-bar d-lg-none" aria-label="Öppna meny">
            <i class="fas fa-bars" style="font-size:1.4rem;color:#fff;"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
  <!-- =============== /NAVBAR =============== -->`;
}

module.exports = { renderHeader };
