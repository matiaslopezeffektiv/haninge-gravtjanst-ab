const { execFileSync } = require('child_process');

/**
 * Cache-busting query-parameter för egna CSS/JS-filer. Utan den här hänger
 * ändringar i t.ex. custom.css fast i besökarens 7-dagars browser-cache
 * (vercel.json sätter max-age=604800 på /assets/(.*) utan "immutable" eller
 * filnamnshash) — vi fick precis se det i praktiken när en ny CSS-regel
 * inte syntes förrän hård-refresh. Genom att lägga på git-commit-hashen som
 * ?v=... får varje deploy en ny URL för samma fil, så gamla cachade kopior
 * aldrig återanvänds av misstag.
 */
const ASSET_VERSION = (() => {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: __dirname + '/..' }).toString().trim();
  } catch {
    return String(Date.now());
  }
})();

function v(path) {
  return `${path}?v=${ASSET_VERSION}`;
}

module.exports = { ASSET_VERSION, v };
