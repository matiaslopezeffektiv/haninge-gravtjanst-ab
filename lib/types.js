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
 * En stödjande stadsdelssida under en tjänst. Ska ENDAST skapas för orter med
 * bekräftad sökefterfrågan (se data/site.json areasServed) och måste ha genuint
 * unikt innehåll — aldrig samma brödtext som andra orter med ortnamnet utbytt.
 * Länkar upp till förälder-tjänstens Stockholm-sida, inte tvärtom.
 * @property {string} slug
 * @property {string} name
 * @property {string} parentService - slug för den tjänst orten hör till
 * @property {string} intro - unikt inledande stycke, specifikt för denna ort
 * @property {ReferenceProject[]} referenceProjects - egna referensprojekt för just denna ort
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
 * @property {ProcessStep[]} process
 * @property {FaqItem[]} faq
 * @property {ReferenceProject[]} referenceProjects
 * @property {Ort[]} orter - stödjande stadsdelssidor, se Ort-typedef. Tom tills underlag finns.
 */

const REQUIRED_TJANST_FIELDS = [
  'slug', 'name', 'targetLocation', 'h1', 'metaTitle', 'metaDescription',
  'shortDescription', 'longDescription', 'icon', 'benefits', 'process',
  'faq', 'referenceProjects', 'orter',
];

const REQUIRED_ORT_FIELDS = ['slug', 'name', 'parentService', 'intro', 'referenceProjects'];

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
  });
}

module.exports = { validateTjanst };
