import {readFileSync} from 'node:fs'

const readData = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))

export const ownershipContent = {
  dictionary: readData('../../dictionaries/en.json'),
  descriptions: readData('../../data/academic-focus-descriptions.json'),
  roleSummaries: readData('../../data/career-role-summaries.json'),
  featuredSkills: readData('../../data/featured-skills.json'),
  awards: {
    'major-field-exam': {focusKey: 'mathematics', label: 'Major Field Exam 189/200'},
    'math-and-physics-club-president': {focusKey: 'mathematics', label: 'Math & Physics Club President'},
    'sigma-zeta-president': {focusKey: 'mathematics', label: 'Sigma Zeta President'},
    'association-for-computing-machinery': {focusKey: 'computer-science', label: 'ACM Vice-president'},
  },
}

const nameKey = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '')
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

// Fill absent fields without replacing existing strings, empty arrays, or icons.
export function missingFields(current, fallback, prefix = 'dictionary') {
  if (current == null) return {[prefix]: fallback}
  if (!isObject(current)) throw new Error(`Expected an object at ${prefix}.`)
  return Object.fromEntries(Object.entries(fallback).flatMap(([key, value]) => {
    const path = `${prefix}.${key}`
    if (current[key] == null) return [[path, value]]
    return isObject(value) ? Object.entries(missingFields(current[key], value, path)) : []
  }))
}

function requireItem(document, field, key) {
  const items = document[field]?.filter((item) => item._key === key) ?? []
  if (items.length !== 1) throw new Error(`Expected exactly one ${field} item ${key} in ${document._id}.`)
  return items[0]
}

function descriptionBlock(key, text) {
  return [{
    _type: 'block', _key: `${key}-description`, style: 'normal', markDefs: [],
    children: [{_type: 'span', _key: 'text', text, marks: []}],
  }]
}

export function buildContentOwnershipPlan(documents, content = ownershipContent) {
  const byId = new Map(documents.map((document) => [document._id, document]))
  const requireDocument = (id) => {
    const document = byId.get(id)
    if (!document) throw new Error(`Expected document ${id} was not found; no changes prepared.`)
    return document
  }
  const settings = requireDocument('siteSettings')
  if (settings.contentOwnershipVersion >= 1) return {creates: [], patches: [], alreadyApplied: true}

  const creates = []
  const patches = []
  const publishedSkills = documents.filter((document) => document._type === 'skill' && !document._id.startsWith('drafts.') && !document._id.startsWith('versions.'))
  const needsCareerSkills = [settings, byId.get('drafts.siteSettings')]
    .some((document) => document && document.careerSkills == null)
  const featuredIds = needsCareerSkills ? content.featuredSkills.map((desired) => {
    const exact = byId.get(desired._id)
    const matches = publishedSkills.filter((skill) => nameKey(skill.subtitle || skill.title || '') === nameKey(desired.subtitle))
    if (!exact && matches.length > 1) throw new Error(`Multiple skills match ${desired.subtitle}; no changes prepared.`)
    const existing = exact || matches[0]
    if (existing) {
      if (existing._type !== 'skill') throw new Error(`Expected ${existing._id} to be a skill document.`)
      return existing._id
    }
    const draftOnly = documents.find((document) => document._type === 'skill'
      && document._id.startsWith('drafts.') && !byId.has(document._id.slice('drafts.'.length))
      && (document._id === `drafts.${desired._id}` || nameKey(document.subtitle || document.title || '') === nameKey(desired.subtitle)))
    if (draftOnly) throw new Error(`Skill ${desired._id} has an unpublished draft; resolve it before migrating.`)
    const document = {...desired, _type: 'skill'}
    creates.push(document)
    byId.set(document._id, document)
    return document._id
  }) : []
  const employers = Object.keys(content.roleSummaries).map(requireDocument)
  const roleIds = (needsCareerSkills ? employers : []).flatMap((employer) => employer.roles ?? [])
    .sort((a, b) => (b.startDate ?? '').localeCompare(a.startDate ?? ''))
    .flatMap((role) => (role.skills ?? []).map((reference) => reference._ref))
  const seenIds = new Set()
  const careerSkills = [...featuredIds, ...roleIds].flatMap((id) => {
    const skill = requireDocument(id)
    if (skill._type !== 'skill') throw new Error(`Expected ${id} to be a skill document.`)
    if (seenIds.has(id)) return []
    seenIds.add(id)
    return [{_type: 'reference', _key: `career-skill-${seenIds.size}`, _ref: id}]
  })

  // Patch the published records and any corresponding draft, preserving other edits.
  function patchRecord(id, buildFields) {
    const published = requireDocument(id)
    for (const document of [published, byId.get(`drafts.${id}`)].filter(Boolean)) {
      const fields = buildFields(document)
      if (Object.keys(fields).length) patches.push({id: document._id, revision: document._rev, set: fields})
    }
  }

  patchRecord('siteSettings', (document) => {
    const dictionary = structuredClone(content.dictionary)
    dictionary.navigation = dictionary.navigation.map((item) => ({_key: item.id, ...item}))
    const fields = missingFields(document.dictionary, dictionary)
    const navigation = document.dictionary?.navigation
    if (Array.isArray(navigation)) {
      const sections = ['home', 'academics', 'career', 'projects', 'contact']
      const ids = sections.map((section) => document.dictionary[section]?.id ?? dictionary[section].id)
      fields['dictionary.navigation'] = [...navigation].sort((a, b) => {
        const rank = (id) => ids.includes(id) ? ids.indexOf(id) : ids.length
        return rank(a.id) - rank(b.id)
      })
    }
    if (document.careerSkills == null) fields.careerSkills = careerSkills
    fields.contentOwnershipVersion = 1
    return fields
  })

  patchRecord('academicRecord.college-of-the-ozarks', (document) => {
    const fields = {}
    for (const [key, text] of Object.entries(content.descriptions)) {
      requireItem(document, 'focuses', key)
      fields[`focuses[_key=="${key}"].description`] = descriptionBlock(key, text)
    }
    for (const [key, values] of Object.entries(content.awards)) {
      const award = requireItem(document, 'commendations', key)
      requireItem(document, 'focuses', values.focusKey)
      for (const [field, value] of Object.entries(values)) {
        if (award[field] == null) fields[`commendations[_key=="${key}"].${field}`] = value
      }
    }
    return fields
  })

  for (const [id, summaries] of Object.entries(content.roleSummaries)) {
    patchRecord(id, (document) => {
      const fields = {}
      for (const [key, summary] of Object.entries(summaries)) {
        const role = requireItem(document, 'roles', key)
        if (role.summary == null) fields[`roles[_key=="${key}"].summary`] = summary
      }
      return fields
    })
  }

  return {creates, patches, alreadyApplied: false}
}
