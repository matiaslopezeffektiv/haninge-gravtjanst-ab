#!/usr/bin/env node
/**
 * Bygger hela sajten från /data + /templates till /dist.
 * Statisk generering: varje route renderas en gång vid build, ingen server
 * krävs i runtime. Kör med `npm run build`.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const { validateTjanst, validateOmrade } = require('../lib/types');
const { renderPage } = require('../templates/layout');
const { renderHomePage } = require('../templates/pages/home');
const { renderKontaktPage } = require('../templates/pages/kontakt');
const { renderTjansterHubPage } = require('../templates/pages/tjansterHub');
const { renderTjanstPage } = require('../templates/pages/tjanst');
const { renderOrtPage } = require('../templates/pages/ort');
const { renderOmradePage } = require('../templates/pages/omrade');
const { renderOmradenHubPage } = require('../templates/pages/omradenHub');
const { renderBrfPage } = require('../templates/pages/brf');
const { renderGuidePage } = require('../templates/pages/guide');
const { renderGuiderHubPage } = require('../templates/pages/guiderHub');
const { renderBlogPostPage } = require('../templates/pages/blogPost');
const { renderBloggHubPage } = require('../templates/pages/bloggHub');
const { renderOmOssPage } = require('../templates/pages/omOss');
const { renderIntegritetspolicyPage } = require('../templates/pages/integritetspolicy');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function writeFile(relPath, content) {
  const fullPath = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log('  wrote', relPath);
}

function writePage(relPath, site, activePath, { metaHtml, schemaHtml, bodyContent, extraStyles, extraScripts, preloadImage }) {
  writeFile(relPath, renderPage({ site, metaHtml, schemaHtml, activePath, bodyContent, extraStyles, extraScripts, preloadImage }));
}

function loadTjanster() {
  const dir = path.join(ROOT, 'data', 'tjanster');
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const data = readJson(path.join(dir, f));
      validateTjanst(data, f);
      return data;
    });
}

function loadOmraden() {
  const dir = path.join(ROOT, 'data', 'omraden');
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const data = readJson(path.join(dir, f));
      validateOmrade(data, f);
      return data;
    });
}

function loadJsonDir(dirName) {
  const dir = path.join(ROOT, 'data', dirName);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => readJson(path.join(dir, f)));
}

// changefreq/priority intentionally omitted — Google has stated for years it
// ignores both, so hardcoded values per route were pure boilerplate that
// looked like signal without being any. lastmod is derived from each route's
// source JSON file's last git commit date (falling back to today for routes
// with no single source file, or if git history isn't available) instead of
// the build timestamp — a value that's "today" on every deploy regardless of
// whether content changed is worse than no lastmod at all, and filesystem
// mtime isn't reliable here either since a fresh `git clone`/checkout (e.g.
// on Vercel) stamps every file with the checkout time, not its real history.
const today = new Date().toISOString().slice(0, 10);
function lastCommitDate(file) {
  try {
    // Relative to ROOT, not absolute — git can fail to resolve an absolute
    // path against its toplevel when the repo path contains accented
    // characters (macOS's filesystem APIs return them NFD-decomposed, which
    // doesn't byte-match the NFC form in this source file).
    const relFile = path.relative(ROOT, file);
    const iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', relFile], { cwd: ROOT, encoding: 'utf8' }).trim();
    return iso ? iso.slice(0, 10) : today;
  } catch {
    return today;
  }
}

function buildSitemap(site, routes) {
  const urls = routes.map(({ loc, file }) => {
    const lastmod = file ? lastCommitDate(file) : today;
    return `  <url>\n    <loc>${site.url}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobots(site) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`;
}

function main() {
  console.log('Rensar dist/ ...');
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const site = readJson(path.join(ROOT, 'data', 'site.json'));
  const tjanster = loadTjanster();
  const tjansterBySlug = Object.fromEntries(tjanster.map((t) => [t.slug, t]));
  const omraden = loadOmraden();
  const brf = readJson(path.join(ROOT, 'data', 'brf.json'));
  const guider = loadJsonDir('guider');
  const bloggPosts = loadJsonDir('blogg').sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));

  // Bygger en global lista över alla tjänst×ort-kombinationer (från tjanst.orter)
  // så att omrade.js kan länka en stadsdels "vanliga behov"-kort direkt till
  // rätt /tjanster/[tjanst]/[ort]-sida när en sådan finns, annars till den
  // generella Stockholm-sidan för tjänsten.
  const allOrtMatches = [];
  for (const tjanst of tjanster) {
    for (const ort of tjanst.orter) {
      allOrtMatches.push({ tjanstSlug: tjanst.slug, tjanstName: tjanst.name, ortSlug: ort.slug, ortName: ort.name });
    }
  }

  console.log('Kopierar statiska tillgångar ...');
  copyRecursive(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));

  console.log('Renderar sidor ...');
  writePage('index.html', site, '/', renderHomePage(site, tjansterBySlug));
  writePage('kontakt.html', site, '/kontakt', renderKontaktPage(site));
  writePage('tjanster.html', site, '/tjanster', renderTjansterHubPage(site, tjansterBySlug));
  writePage('om-oss.html', site, '/om-oss', renderOmOssPage(site));
  writePage('integritetspolicy.html', site, '/integritetspolicy', renderIntegritetspolicyPage(site));
  writePage('omraden.html', site, '/omraden', renderOmradenHubPage(site, omraden));
  writePage('brf.html', site, '/brf', renderBrfPage(site, brf));
  writePage('guider.html', site, '/guider', renderGuiderHubPage(site, guider));
  writePage('blogg.html', site, '/blogg', renderBloggHubPage(site, bloggPosts));

  // integritetspolicy.html är noindex (se templates/pages/integritetspolicy.js) och
  // ska därför INTE ligga i sitemap.xml — en noindexad URL i sitemapen är en
  // motsägande signal till Google och slösar crawlbudget.
  const siteJsonFile = path.join(ROOT, 'data', 'site.json');
  const brfJsonFile = path.join(ROOT, 'data', 'brf.json');
  const routes = [
    { loc: '/', file: siteJsonFile },
    { loc: '/tjanster', file: siteJsonFile },
    { loc: '/omraden', file: siteJsonFile },
    { loc: '/brf', file: brfJsonFile },
    { loc: '/guider', file: siteJsonFile },
    { loc: '/blogg', file: siteJsonFile },
    { loc: '/om-oss', file: siteJsonFile },
    { loc: '/kontakt', file: siteJsonFile },
  ];

  for (const guide of guider) {
    writePage(`guider/${guide.slug}.html`, site, `/guider/${guide.slug}`, renderGuidePage(site, guide));
    routes.push({ loc: `/guider/${guide.slug}`, file: path.join(ROOT, 'data', 'guider', `${guide.slug}.json`) });
  }

  for (const post of bloggPosts) {
    writePage(`blogg/${post.slug}.html`, site, `/blogg/${post.slug}`, renderBlogPostPage(site, post));
    routes.push({ loc: `/blogg/${post.slug}`, file: path.join(ROOT, 'data', 'blogg', `${post.slug}.json`) });
  }

  for (const svc of site.services) {
    if (!svc.hasPage) continue;
    const tjanst = tjansterBySlug[svc.slug];
    if (!tjanst) {
      throw new Error(`site.json listar tjänsten "${svc.slug}" som hasPage:true men data/tjanster/${svc.slug}.json saknas`);
    }
    const tjanstFile = path.join(ROOT, 'data', 'tjanster', `${tjanst.slug}.json`);
    writePage(`tjanster/${tjanst.slug}.html`, site, `/tjanster/${tjanst.slug}`, renderTjanstPage(site, tjanst));
    routes.push({ loc: `/tjanster/${tjanst.slug}`, file: tjanstFile });

    for (const ort of tjanst.orter) {
      const omradeForOrt = omraden.find((o) => o.slug === ort.slug);
      writePage(
        `tjanster/${tjanst.slug}/${ort.slug}.html`,
        site,
        `/tjanster/${tjanst.slug}/${ort.slug}`,
        renderOrtPage(site, tjanst, ort, omradeForOrt),
      );
      routes.push({ loc: `/tjanster/${tjanst.slug}/${ort.slug}`, file: tjanstFile });
    }
  }

  for (const omrade of omraden) {
    const ortMatches = allOrtMatches.filter((m) => m.ortSlug === omrade.slug);
    const otherOmraden = omraden.filter((o) => o.slug !== omrade.slug);
    writePage(
      `omraden/${omrade.slug}.html`,
      site,
      `/omraden/${omrade.slug}`,
      renderOmradePage(site, omrade, tjansterBySlug, ortMatches, otherOmraden),
    );
    routes.push({ loc: `/omraden/${omrade.slug}`, file: path.join(ROOT, 'data', 'omraden', `${omrade.slug}.json`) });
  }

  console.log('Genererar sitemap.xml och robots.txt ...');
  writeFile('sitemap.xml', buildSitemap(site, routes));
  writeFile('robots.txt', buildRobots(site));

  console.log(`\nKlart. ${tjanster.length} tjänst(er), ${omraden.length} område(n), ${allOrtMatches.length} tjänst×ort-sida(or), ${guider.length} guide(r), ${bloggPosts.length} blogginlägg, ${routes.length} sidor i sitemap.`);
}

main();
