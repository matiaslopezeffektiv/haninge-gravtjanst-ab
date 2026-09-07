/**
 * Innehållsmodell för Haninge Grävtjänst AB.
 * Dessa typedefs är den formella kontraktet för filerna i /data — inga klasser,
 * bara dokumentation + ett runtime-schema (validateTjanst) som build.js kör mot varje fil.
 *
 * @typedef {Object} ProcessStep
 * @property {number} step
 * @property {string} title
 * @property {string} description
 *
 * @typedef {Object} FaqItem
 * @property {string} question
 * @property {string} answer
 *
 * @typedef {Object} ReferenceProject
 * @property {string} title
 * @property {string} description
 * @property {string} [image]
 * @property {string} [location]
 *
 * @typedef {Object} Ort
 * En stödjande stadsdelssida under en tjänst (/tjanster/[tjanst]/[ort]), t.ex.
 * "Dränering i Haninge". Ska ENDAST skapas för tjänst×ort-kombinationer med
 * bekräftad sökefterfrågan (se GSC-export i /GSC Data och data/site.json
 * areasServed) och måste ha genuint unikt innehåll — aldrig samma brödtext som
 * andra orter med ortnamnet utbytt. Länkar upp till förälder-tjänstens
 * Stockholm-sida (fullständig FAQ/considerations finns bara där, för att
 * undvika duplicerat innehåll mellan de många ort-sidorna).
 * @property {string} slug
 * @property {string} name
 * @property {string} parentService - slug för den tjänst orten hör till
 * @property {string} h1
 * @property {string} metaTitle
 * @property {string} metaDescription
 * @property {string[]} intro - 2 unika stycken, kopplar tjänsten till ortens faktiska bebyggelse/mark
 * @property {string[]} localPoints - 3-4 konkreta, lokalt relevanta punkter (ej generiska)
 * @property {ReferenceProject[]} referenceProjects - egna referensprojekt för just denna ort
 *
 * @typedef {Object} OmradeRelevantService
 * @property {string} slug - tjänstens slug
 * @property {string} blurb - kort, områdesspecifik text (inte generisk mall-text)
 *
 * @typedef {Object} Omrade
 * En stadsdels-hubbsida (/omraden/[slug]) — listar samtliga 7 tjänster för
 * området och länkar vidare till ev. dedikerade tjänst×ort-sidor (Ort ovan)
 * som finns för just denna stadsdel. Genuint unikt innehåll grundat i
 * verklig kunskap om områdets bebyggelse/mark — inga påhittade projektsiffror
 * per område.
 * @property {string} slug
 * @property {string} name
 * @property {string} region - t.ex. "Söderort", "Innerstaden" — för gruppering på hubbindex
 * @property {string} h1
 * @property {string} metaTitle
 * @property {string} metaDescription
 * @property {string} shortDescription - kort teaser för hubbindex-kortet
 * @property {string[]} intro - 2 unika inledande stycken
 * @property {string} whyUs - ett stycke, varför välja oss i just detta område
 * @property {OmradeRelevantService[]} relevantServices - 3 kurerade tjänster med områdesspecifik text
 *
 * @typedef {Object} Tjanst
 * @property {string} slug
 * @property {string} name
 * @property {string} targetLocation - primärt målsökord, ska vara "Stockholm" enligt arkitekturprincipen
 * @property {string} h1
 * @property {string} metaTitle
 * @property {string} metaDescription
 * @property {string} shortDescription
 * @property {string[]} longDescription - stycken, renderas som separata <p>
 * @property {string} icon - Font Awesome-klass
 * @property {string|null} heroImage
 * @property {string} heroImageAlt
 * @property {string[]} benefits
 * @property {string[]} [inclusions] - "Vad ingår i tjänsten?" — konkret lista över vad som utförs
 * @property {Object} [signs] - "Tecken på att du behöver X" — { heading, intro, items: string[], image?, imageAlt? }
 * @property {string[]} [whyImportant] - "Varför är det viktigt?" — stycken som förklarar varför tjänsten spelar roll
 * @property {Object} [whyUs] - "Varför välja Haninge Grävtjänst?" — { intro, items: string[] }, tjänstespecifika (ej generiska) anledningar
 * @property {Object} [considerations] - "Vad bör du tänka på?" — { intro, items: string[] }, praktiska råd/saker att tänka på innan/under arbetet
 * @property {ProcessStep[]} process
 * @property {FaqItem[]} faq
 * @property {ReferenceProject[]} referenceProjects
 * @property {Ort[]} orter - stödjande stadsdelssidor, se Ort-typedef. Tom tills underlag finns.
 * @property {string[]} [sourceKeys] - nycklar in i site.json externalResources, renderas som "Källor och läsvärt"
 */

const REQUIRED_TJANST_FIELDS = [
  'slug', 'name', 'targetLocation', 'h1', 'metaTitle', 'metaDescription',
  'shortDescription', 'longDescription', 'icon', 'benefits', 'process',
  'faq', 'referenceProjects', 'orter',
];

const REQUIRED_ORT_FIELDS = ['slug', 'name', 'parentService', 'h1', 'metaTitle', 'metaDescription', 'intro', 'localPoints', 'referenceProjects'];
const REQUIRED_OMRADE_FIELDS = ['slug', 'name', 'region', 'h1', 'metaTitle', 'metaDescription', 'shortDescription', 'intro', 'whyUs', 'relevantServices'];

/**
 * Kastar fel om en tjänst-datafil inte matchar Tjanst-schemat.
 * @param {object} data
 * @param {string} fileLabel - för felmeddelanden
 */
function validateTjanst(data, fileLabel) {
  for (const field of REQUIRED_TJANST_FIELDS) {
    if (!(field in data)) {
      throw new Error(`[data/tjanster/${fileLabel}] saknar obligatoriskt fält "${field}"`);
    }
  }
  if (!Array.isArray(data.orter)) {
    throw new Error(`[data/tjanster/${fileLabel}] "orter" måste vara en array`);
  }
  data.orter.forEach((ort, i) => {
    for (const field of REQUIRED_ORT_FIELDS) {
      if (!(field in ort)) {
        throw new Error(`[data/tjanster/${fileLabel}] orter[${i}] saknar obligatoriskt fält "${field}"`);
      }
    }
    if (ort.parentService !== data.slug) {
      throw new Error(`[data/tjanster/${fileLabel}] orter[${i}].parentService ("${ort.parentService}") matchar inte tjänstens slug ("${data.slug}")`);
    }
    if (!Array.isArray(ort.intro) || !Array.isArray(ort.localPoints)) {
      throw new Error(`[data/tjanster/${fileLabel}] orter[${i}] "intro" och "localPoints" måste vara arrayer`);
    }
  });
}

/**
 * Kastar fel om en område-datafil inte matchar Omrade-schemat.
 * @param {object} data
 * @param {string} fileLabel
 */
function validateOmrade(data, fileLabel) {
  for (const field of REQUIRED_OMRADE_FIELDS) {
    if (!(field in data)) {
      throw new Error(`[data/omraden/${fileLabel}] saknar obligatoriskt fält "${field}"`);
    }
  }
  if (!Array.isArray(data.intro) || !Array.isArray(data.relevantServices)) {
    throw new Error(`[data/omraden/${fileLabel}] "intro" och "relevantServices" måste vara arrayer`);
  }
}

module.exports = { validateTjanst, validateOmrade };
