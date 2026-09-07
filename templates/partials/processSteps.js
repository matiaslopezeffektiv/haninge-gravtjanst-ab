const { escapeHtml } = require('../../lib/html');

/**
 *"Så går det till" — återanvänds av startsidan, kontaktsidan (generella
 * företagssteg, site.process) och varje tjänstesida (tjänstespecifika steg,
 * tjanst.process). Fanns på både start- och kontaktsidan i referensmallen.
 * @param {object} params
 * @param {string} params.eyebrow
 * @param {string} params.heading
 * @param {import('../../lib/types').ProcessStep[]} params.steps
 */
function renderProcessSteps({ eyebrow, heading, steps }) {
  const stepHtml = steps.map((step) => `
        <div class="col-xl-3 col-md-6">
          <div class="nt-step h-100">
            <span class="nt-step__num">0${step.step}</span>
            <h3>${escapeHtml(step.title)}</h3>
            <p>${escapeHtml(step.description)}</p>
          </div>
        </div>`).join('');

  return `
  <!-- =============== SÅ GÅR DET TILL =============== -->
  <div class="tp-process-area bg-position pt-130 pb-130" style="background-color:#FDF3EA;background-image:url('/assets/img/process/process-band.webp');background-size:cover;background-position:right center;">
    <div class="container">
      <div class="row justify-content-center mb-70">
        <div class="col-xl-7 text-center">
          <span class="nt-eyebrow" style="justify-content:center;">${escapeHtml(eyebrow)}</span>
          <h2 class="fs-xl-40 fs-sm-36">${escapeHtml(heading)}</h2>
        </div>
      </div>
      <div class="row g-4 gy-5">${stepHtml}
      </div>
    </div>
  </div>
  <!-- =============== /SÅ GÅR DET TILL =============== -->`;
}

module.exports = { renderProcessSteps };
