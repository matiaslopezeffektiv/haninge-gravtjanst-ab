/* ============================================
   Döljer den flytande "Ring nu"-knappen när ett element som redan erbjuder
   kontakt (t.ex. hero-minformuläret på startsidan) är synligt i viewporten —
   annars riskerar knappen (hög z-index, fast position i samma hörn) att
   hamna ovanpå formulärets skicka-knapp på kortare skärmar.
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const callBtn = document.querySelector('.nt-floating-call');
  const triggers = document.querySelectorAll('.nt-hides-floating-call');
  if (!callBtn || !triggers.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    const anyVisible = entries.some(function (entry) { return entry.isIntersecting; });
    callBtn.classList.toggle('nt-floating-call--hidden', anyVisible);
  }, { threshold: 0.15 });

  triggers.forEach(function (el) { observer.observe(el); });
});
