const { renderHeader } = require('./header');
const { renderFooter } = require('./footer');
const { renderFloatingCallButton } = require('./partials/floatingCallButton');
const { escapeAttr } = require('../lib/html');

/**
 * Sidskal som slår ihop <head>-taggar (metadata + schema) med header,
 * sidinnehåll och footer. Varje sida bygger sitt eget bodyContent och
 * skickar in det tillsammans med metaHtml/schemaHtml från lib/metadata
 * och lib/schema.
 *
 * @param {object} params
 * @param {object} params.site - data/site.json
 * @param {string} params.metaHtml - från lib/metadata.buildMetaTags
 * @param {string} params.schemaHtml - från lib/schema.renderSchemaGraph
 * @param {string} params.activePath
 * @param {string} params.bodyContent
 * @param {string} [params.extraStyles] - sidspecifik <style>-block
 * @param {string} [params.extraScripts] - sidspecifika <script>-taggar före </body>
 */
function renderPage({ site, metaHtml, schemaHtml, activePath, bodyContent, extraStyles = '', extraScripts = '' }) {
  return `<!doctype html>
<html class="no-js" lang="${escapeAttr(site.language)}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  ${metaHtml}
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/assets/img/favicon-512.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/favicon-180.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&amp;family=Barlow:wght@400;500;600;700&amp;display=swap">

  <link rel="stylesheet" href="/assets/css/bootstrap.css">
  <link rel="stylesheet" href="/assets/css/animate.css">
  <link rel="stylesheet" href="/assets/css/font-awesome-pro.css">
  <link rel="stylesheet" href="/assets/css/spacing.css">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="/assets/css/custom.css">
  ${extraStyles}

  ${schemaHtml}
</head><body class="tp-bg-common-white-2">

  ${renderHeader(site, activePath)}

  ${bodyContent}

  ${renderFooter(site)}

  ${renderFloatingCallButton(site)}

  <script src="/assets/js/vendor/jquery.js"></script>
  <script src="/assets/js/bootstrap-bundle.js"></script>
  <script src="/assets/js/wow.js"></script>
  <script src="/assets/js/main.js"></script>
  <script src="/assets/js/cookie-consent.js"></script>
  <script src="/assets/js/floating-call-visibility.js"></script>
  ${extraScripts}
</body>
</html>
`;
}

module.exports = { renderPage };
