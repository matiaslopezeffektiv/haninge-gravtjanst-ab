#!/usr/bin/env node
/**
 * Bygger hela sajten från /data + /templates till /dist.
 * Statisk generering: varje route renderas en gång vid build, ingen server
 * krävs i runtime. Kör med `npm run build`.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const { validateTjanst } = require('../lib/types');
const { renderPage } = require('../templates/layout');
const { renderHomePage } = require('../templates/pages/home');
const { renderKontaktPage } = require('../templates/pages/kontakt');
const { renderTjansterHubPage } = require('../templates/pages/tjansterHub');
const { renderTjanstPage } = require('../templates/pages/tjanst');
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

function writePage(relPath, site, activePath, { metaHtml, schemaHtml, bodyContent, extraStyles, extraScripts }) {
  writeFile(relPath, renderPage({ site, metaHtml, schemaHtml, activePath, bodyContent, extraStyles, extraScripts }));
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

function buildSitemap(site, routes) {
  const urls = routes.map(({ loc, priority, changefreq }) => `  <url>
    <loc>${site.url}${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');
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

  console.log('Kopierar statiska tillgångar ...');
  copyRecursive(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));

  console.log('Renderar sidor ...');
  writePage('index.html', site, '/', renderHomePage(site));
  writePage('kontakt.html', site, '/kontakt', renderKontaktPage(site));
  writePage('tjanster.html', site, '/tjanster', renderTjansterHubPage(site));
  writePage('om-oss.html', site, '/om-oss', renderOmOssPage(site));
  writePage('integritetspolicy.html', site, '/integritetspolicy', renderIntegritetspolicyPage(site));

  const routes = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/tjanster', priority: '0.9', changefreq: 'weekly' },
    { loc: '/om-oss', priority: '0.6', changefreq: 'monthly' },
    { loc: '/kontakt', priority: '0.7', changefreq: 'monthly' },
    { loc: '/integritetspolicy', priority: '0.3', changefreq: 'yearly' },
  ];

  for (const svc of site.services) {
    if (!svc.hasPage) continue;
    const tjanst = tjansterBySlug[svc.slug];
    if (!tjanst) {
      throw new Error(`site.json listar tjänsten "${svc.slug}" som hasPage:true men data/tjanster/${svc.slug}.json saknas`);
    }
    writePage(`tjanster/${tjanst.slug}.html`, site, `/tjanster/${tjanst.slug}`, renderTjanstPage(site, tjanst));
    routes.push({ loc: `/tjanster/${tjanst.slug}`, priority: '0.9', changefreq: 'monthly' });
  }

  console.log('Genererar sitemap.xml och robots.txt ...');
  writeFile('sitemap.xml', buildSitemap(site, routes));
  writeFile('robots.txt', buildRobots(site));

  console.log(`\nKlart. ${tjanster.length} tjänst(er) i /data, ${routes.length} sidor i sitemap.`);
}

main();
