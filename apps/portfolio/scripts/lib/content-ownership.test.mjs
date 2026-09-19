import assert from 'node:assert/strict'
import test from 'node:test'
import {buildContentOwnershipPlan, missingFields, ownershipContent} from './content-ownership.mjs'

const academicId = 'academicRecord.college-of-the-ozarks'
const roleEntries = Object.entries(ownershipContent.roleSummaries)
const own = (object, key) => Object.hasOwn(object, key)
const patchFor = (plan, id) => plan.patches.find((patch) => patch.id === id)

function fixtures() {
  return [
    {_id: 'siteSettings', _type: 'siteSettings', _rev: 'settings-revision', dictionary: {}},
    {
      _id: academicId,
      _type: 'academicRecord',
      _rev: 'academics-revision',
      institution: 'Authored institution',
      focuses: Object.keys(ownershipContent.descriptions).map((_key) => ({
        _key,
        name: `Authored ${_key}`,
        gpa: '4.00',
        description: [{_type: 'block', _key: 'old-description', children: []}],
      })),
      commendations: Object.keys(ownershipContent.awards).map((_key) => ({
        _key, title: `Authored ${_key}`, subtitle: 'Authored organization', tooltip: 'Keep this tooltip',
      })),
    },
    ...roleEntries.map(([id, summaries]) => ({
      _id: id,
      _type: 'careerEmployer',
      _rev: `${id}-revision`,
      name: 'Authored employer',
      roles: Object.keys(summaries).map((_key) => ({
        _key, title: 'Authored role', startDate: '2024-01-01',
        skills: [{_type: 'reference', _key: 'existing-reference', _ref: 'skill.typescript'}],
      })),
    })),
    {_id: 'skill.typescript', _type: 'skill', title: 'TypeScript', subtitle: 'TypeScript', href: 'https://example.com/typescript'},
  ]
}

test('plans only the approved descriptions, award fields, role summaries, settings and new skills', () => {
  const documents = fixtures()
  const before = structuredClone(documents)
  const plan = buildContentOwnershipPlan(documents)

  assert.equal(plan.alreadyApplied, false)
  assert.deepEqual(plan.creates, ownershipContent.featuredSkills.map((skill) => ({...skill, _type: 'skill'})))
  assert.deepEqual(plan.patches.map(({id}) => id), ['siteSettings', academicId, ...roleEntries.map(([id]) => id)])

  const academics = patchFor(plan, academicId)
  assert.equal(academics.revision, 'academics-revision')
  const academicFields = {}
  for (const [key, text] of Object.entries(ownershipContent.descriptions)) {
    academicFields[`focuses[_key=="${key}"].description`] = [{
      _type: 'block', _key: `${key}-description`, style: 'normal', markDefs: [],
      children: [{_type: 'span', _key: 'text', text, marks: []}],
    }]
  }
  for (const [key, fields] of Object.entries(ownershipContent.awards)) {
    for (const [field, value] of Object.entries(fields)) {
      academicFields[`commendations[_key=="${key}"].${field}`] = value
    }
  }
  assert.deepEqual(academics.set, academicFields)
  for (const [id, summaries] of roleEntries) {
    assert.deepEqual(patchFor(plan, id), {
      id,
      revision: `${id}-revision`,
      set: Object.fromEntries(Object.entries(summaries).map(([key, summary]) => [`roles[_key=="${key}"].summary`, summary])),
    })
  }
  const settings = patchFor(plan, 'siteSettings').set
  assert.equal(settings.contentOwnershipVersion, 1)
  assert.deepEqual(settings.careerSkills.map(({_ref}) => _ref), [
    ...ownershipContent.featuredSkills.map(({_id}) => _id), 'skill.typescript',
  ])
  assert.deepEqual(settings['dictionary.navigation'], ownershipContent.dictionary.navigation.map((item) => ({_key: item.id, ...item})))
  assert.deepEqual(documents, before)
})

test('fills missing dictionary fields while preserving authored strings, blank text and arrays', () => {
  assert.deepEqual(missingFields({
    title: 'CMS title', blank: '', enabled: false, items: [], nested: {label: 'CMS label'},
  }, {
    title: 'Default title', blank: 'Default blank', enabled: true, items: ['Default'],
    nested: {label: 'Default label', missing: 'New label'}, newSection: {label: 'New section'},
  }), {
    'dictionary.nested.missing': 'New label',
    'dictionary.newSection': {label: 'New section'},
  })
  assert.throws(() => missingFields({nested: 'Unexpected string'}, {nested: {label: 'Default'}}), /Expected an object at dictionary.nested/)
})

test('reorders existing navigation with authored IDs and preserves complete navigation entries', () => {
  const documents = fixtures()
  const navigation = [
    {_key: 'contact-link', id: 'get-in-touch', heading: 'Say hello', icon: {_type: 'image', asset: {_ref: 'image-contact'}}},
    {_key: 'work-link', id: 'career', heading: 'My work', icon: 'briefcase'},
    {_key: 'school-link', id: 'academics', heading: 'Studies', icon: 'school'},
    {_key: 'home-link', id: 'home', heading: '', icon: 'home'},
    {_key: 'extra-link', id: 'journal', heading: 'Writing', icon: 'journal'},
  ]
  documents[0].dictionary = {
    contact: {id: 'get-in-touch', heading: 'Reach out'},
    academics: {intro: 'Authored intro', focus: {gpaLabel: ''}},
    home: {typeHeading: []},
    navigation,
  }
  const fields = patchFor(buildContentOwnershipPlan(documents), 'siteSettings').set
  assert.deepEqual(fields['dictionary.navigation'], [navigation[3], navigation[2], navigation[1], navigation[0], navigation[4]])
  for (const path of ['dictionary.contact.id', 'dictionary.contact.heading', 'dictionary.academics.intro', 'dictionary.academics.focus.gpaLabel', 'dictionary.home.typeHeading']) {
    assert.equal(own(fields, path), false, `${path} must remain authored`)
  }
  assert.deepEqual(navigation.map(({id}) => id), ['get-in-touch', 'career', 'academics', 'home', 'journal'])
})

test('reuses existing skills by ID or name without overwriting CMS metadata', () => {
  const documents = fixtures()
  const existing = [
    {_id: 'skill.jenkins', _type: 'skill', title: 'Custom Jenkins title', subtitle: 'CMS Jenkins label', href: 'https://example.com/jenkins', image: {_ref: 'image-jenkins'}},
    {_id: 'skill.custom-next', _type: 'skill', title: 'CMS Next title', subtitle: 'Next.js', href: 'https://example.com/next', image: {_ref: 'image-next'}},
  ]
  documents.push(...existing)
  const before = structuredClone(existing)
  const plan = buildContentOwnershipPlan(documents)
  assert.deepEqual(plan.creates.map(({_id}) => _id), ['skill.expo', 'skill.react-native'])
  assert.deepEqual(patchFor(plan, 'siteSettings').set.careerSkills.slice(0, 2).map(({_ref}) => _ref), ['skill.jenkins', 'skill.custom-next'])
  assert.equal(plan.patches.some(({id}) => id.startsWith('skill.')), false)
  assert.deepEqual(existing, before)
})

test('preserves intentionally empty career skills and navigation arrays', () => {
  const documents = fixtures()
  documents[0].careerSkills = []
  documents[0].dictionary.navigation = []
  const plan = buildContentOwnershipPlan(documents)
  const fields = patchFor(plan, 'siteSettings').set
  assert.equal(own(fields, 'careerSkills'), false)
  assert.deepEqual(fields['dictionary.navigation'], [])
  assert.deepEqual(plan.creates, [])
})

test('creates featured skills only when a published or draft settings record needs its initial list', () => {
  const documents = fixtures()
  documents[0].careerSkills = [{_key: 'authored-skill', _type: 'reference', _ref: 'skill.typescript'}]
  documents.push({_id: 'drafts.siteSettings', _type: 'siteSettings', _rev: 'draft-revision', dictionary: {}})
  const plan = buildContentOwnershipPlan(documents)
  assert.equal(own(patchFor(plan, 'siteSettings').set, 'careerSkills'), false)
  assert.equal(plan.creates.length, ownershipContent.featuredSkills.length)
  assert.deepEqual(patchFor(plan, 'drafts.siteSettings').set.careerSkills.map(({_ref}) => _ref), [
    ...ownershipContent.featuredSkills.map(({_id}) => _id), 'skill.typescript',
  ])
  documents.at(-1).careerSkills = []
  const populatedPlan = buildContentOwnershipPlan(documents)
  assert.deepEqual(populatedPlan.creates, [])
  assert.equal(own(patchFor(populatedPlan, 'drafts.siteSettings').set, 'careerSkills'), false)
})

test('does not publish a default featured skill over an authored draft-only skill', () => {
  const documents = fixtures()
  documents.push({_id: 'drafts.skill.nextjs', _type: 'skill', subtitle: 'Next.js', href: 'https://example.com/unpublished-next'})
  const before = structuredClone(documents)
  assert.throws(() => buildContentOwnershipPlan(documents), /unpublished draft/)
  assert.deepEqual(documents, before)
})

test('recognizes unpublished featured skills by name when their draft has a custom ID', () => {
  const documents = fixtures()
  documents.push({_id: 'drafts.skill.custom-next', _type: 'skill', subtitle: 'Next JS', href: 'https://example.com/unpublished-next'})
  const before = structuredClone(documents)
  assert.throws(() => buildContentOwnershipPlan(documents), /Skill skill.nextjs has an unpublished draft/)
  assert.deepEqual(documents, before)
})

test('deduplicates references by ID without dropping C++, C# or separate authored skill records', () => {
  const documents = fixtures()
  documents.push(
    {_id: 'skill.cpp', _type: 'skill', subtitle: 'C++'},
    {_id: 'skill.csharp', _type: 'skill', subtitle: 'C#'},
    {_id: 'skill.other-typescript', _type: 'skill', subtitle: 'TypeScript'},
  )
  documents[2].roles[0].startDate = '2025-01-01'
  documents[2].roles[0].skills = ['skill.cpp', 'skill.csharp', 'skill.cpp', 'skill.other-typescript'].map((_ref, index) => ({
    _type: 'reference', _key: `existing-${index}`, _ref,
  }))
  const before = structuredClone(documents)
  const plan = buildContentOwnershipPlan(documents)
  assert.deepEqual(patchFor(plan, 'siteSettings').set.careerSkills.map(({_ref}) => _ref), [
    ...ownershipContent.featuredSkills.map(({_id}) => _id),
    'skill.cpp', 'skill.csharp', 'skill.other-typescript', 'skill.typescript',
  ])
  assert.deepEqual(documents, before)
})

test('does not use a scheduled release version as a published featured skill', () => {
  const documents = fixtures()
  documents.push({_id: 'versions.release.skill.nextjs', _type: 'skill', subtitle: 'Next.js', href: 'https://example.com/unpublished-release'})
  const plan = buildContentOwnershipPlan(documents)
  assert.equal(plan.creates.some(({_id}) => _id === 'skill.nextjs'), true)
  assert.equal(patchFor(plan, 'siteSettings').set.careerSkills.some(({_ref}) => _ref.startsWith('versions.')), false)
})

test('preserves authored role summaries and award labels, including blanks and explicit relationships', () => {
  const documents = fixtures()
  const academics = documents.find(({_id}) => _id === academicId)
  academics.commendations[0].label = ''
  academics.commendations[0].focusKey = 'computer-science'
  academics.commendations[1].label = 'CMS award label'
  const employer = documents.find(({_id}) => _id === roleEntries[0][0])
  employer.roles[0].summary = ''
  employer.roles[1].summary = 'CMS role summary'

  const plan = buildContentOwnershipPlan(documents)
  const awardFields = patchFor(plan, academicId).set
  assert.equal(own(awardFields, `commendations[_key=="${academics.commendations[0]._key}"].label`), false)
  assert.equal(own(awardFields, `commendations[_key=="${academics.commendations[0]._key}"].focusKey`), false)
  assert.equal(own(awardFields, `commendations[_key=="${academics.commendations[1]._key}"].label`), false)
  const roleFields = patchFor(plan, employer._id).set
  assert.equal(own(roleFields, `roles[_key=="${employer.roles[0]._key}"].summary`), false)
  assert.equal(own(roleFields, `roles[_key=="${employer.roles[1]._key}"].summary`), false)
})

test('patches drafts with their own revisions while preserving independent draft edits', () => {
  const documents = fixtures()
  const settingsDraft = {...structuredClone(documents[0]), _id: 'drafts.siteSettings', _rev: 'draft-settings-revision', careerSkills: []}
  settingsDraft.dictionary = {academics: {intro: 'Unpublished intro'}}
  const academicDraft = {...structuredClone(documents[1]), _id: `drafts.${academicId}`, _rev: 'draft-academics-revision'}
  academicDraft.focuses[0].name = 'Unpublished focus name'
  academicDraft.commendations[0].label = 'Unpublished award'
  const employerDraft = {...structuredClone(documents[2]), _id: `drafts.${documents[2]._id}`, _rev: 'draft-employer-revision'}
  employerDraft.roles[0].summary = 'Unpublished summary'
  documents.push(settingsDraft, academicDraft, employerDraft)
  const before = structuredClone(documents)

  const plan = buildContentOwnershipPlan(documents)
  const settingsPatch = patchFor(plan, settingsDraft._id)
  assert.equal(settingsPatch.revision, settingsDraft._rev)
  assert.equal(settingsPatch.set.contentOwnershipVersion, 1)
  assert.equal(own(settingsPatch.set, 'careerSkills'), false)
  assert.equal(own(settingsPatch.set, 'dictionary.academics.intro'), false)
  const academicPatch = patchFor(plan, academicDraft._id)
  assert.equal(academicPatch.revision, academicDraft._rev)
  assert.equal(own(academicPatch.set, `commendations[_key=="${academicDraft.commendations[0]._key}"].label`), false)
  assert.equal(own(academicPatch.set, `focuses[_key=="${academicDraft.focuses[0]._key}"].name`), false)
  const employerPatch = patchFor(plan, employerDraft._id)
  assert.equal(employerPatch.revision, employerDraft._rev)
  assert.equal(own(employerPatch.set, `roles[_key=="${employerDraft.roles[0]._key}"].summary`), false)
  assert.deepEqual(documents, before)
})

test('unknown or duplicate expected keys, missing documents and unresolved references fail without mutations', async (context) => {
  const cases = [
    ['unknown focus key', (documents) => {documents[1].focuses[0]._key = 'unexpected-focus'}, /Expected exactly one focuses item/],
    ['unknown award key', (documents) => {documents[1].commendations[0]._key = 'unexpected-award'}, /Expected exactly one commendations item/],
    ['unknown role key', (documents) => {documents[2].roles[0]._key = 'unexpected-role'}, /Expected exactly one roles item/],
    ['duplicate focus key', (documents) => {documents[1].focuses.push(structuredClone(documents[1].focuses[0]))}, /Expected exactly one focuses item/],
    ['missing employer', (documents) => {documents.splice(2, 1)}, /Expected document careerEmployer/],
    ['missing skill', (documents) => {documents[2].roles[0].skills[0]._ref = 'skill.unknown'}, /Expected document skill.unknown/],
    ['featured ID is not a skill', (documents) => {documents.push({_id: 'skill.nextjs', _type: 'post', title: 'Not a skill'})}, /Expected skill.nextjs to be a skill document/],
    ['role reference is not a skill', (documents) => {documents.find(({_id}) => _id === 'skill.typescript')._type = 'post'}, /Expected skill.typescript to be a skill document/],
    ['changed draft key', (documents) => {
      const draft = {...structuredClone(documents[1]), _id: `drafts.${academicId}`}
      draft.focuses[0]._key = 'unexpected-draft-focus'
      documents.push(draft)
    }, /Expected exactly one focuses item.*drafts\./],
  ]
  for (const [name, change, error] of cases) {
    await context.test(name, () => {
      const documents = fixtures()
      change(documents)
      const before = structuredClone(documents)
      assert.throws(() => buildContentOwnershipPlan(documents), error)
      assert.deepEqual(documents, before)
    })
  }
})

test('ambiguous existing skill names fail before a plan can be applied', () => {
  const documents = fixtures()
  documents.push(
    {_id: 'skill.next-one', _type: 'skill', subtitle: 'Next.js'},
    {_id: 'skill.next-two', _type: 'skill', subtitle: 'Next JS'},
  )
  const before = structuredClone(documents)
  assert.throws(() => buildContentOwnershipPlan(documents), /Multiple skills match Next.js/)
  assert.deepEqual(documents, before)
})

test('migration version prevents reapplying approved copy over later CMS edits', () => {
  const documents = fixtures()
  documents[0].contentOwnershipVersion = 1
  documents[0].dictionary = {academics: {intro: 'Edited after migration'}}
  documents[0].careerSkills = []
  documents[1].focuses[0].description = [{_type: 'block', _key: 'edited', children: [{_type: 'span', text: 'Edited after migration'}]}]
  documents[1].commendations[0].label = 'Edited after migration'
  documents[2].roles[0].summary = 'Edited after migration'
  const before = structuredClone(documents)
  assert.deepEqual(buildContentOwnershipPlan(documents), {creates: [], patches: [], alreadyApplied: true})
  assert.deepEqual(documents, before)
  assert.deepEqual(buildContentOwnershipPlan([documents[0]]), {creates: [], patches: [], alreadyApplied: true})
  documents[0].contentOwnershipVersion = 2
  assert.deepEqual(buildContentOwnershipPlan(documents), {creates: [], patches: [], alreadyApplied: true})
})
