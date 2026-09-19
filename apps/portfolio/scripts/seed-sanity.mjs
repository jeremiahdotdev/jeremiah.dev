import {createClient} from '@sanity/client'
import {createRequire} from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const require = createRequire(import.meta.url)
const nextDir = path.dirname(require.resolve('next/package.json'))
const nextEnv = require(require.resolve('@next/env', {paths: [nextDir]}))
nextEnv.loadEnvConfig(process.cwd())

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-24'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId) {
  throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID is required.')
}

if (!token) {
  throw new Error('SANITY_API_WRITE_TOKEN is required. Create a write token in Sanity and add it to your local env.')
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

const dictionary = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'dictionaries/en.json'), 'utf8'),
)

dictionary.navigation = dictionary.navigation.map((item) => ({_key: item.id, ...item}))

const academicFocusDescriptions = JSON.parse(
  fs.readFileSync(new URL('../data/academic-focus-descriptions.json', import.meta.url), 'utf8'),
)

const careerRoleSummaries = JSON.parse(
  fs.readFileSync(new URL('../data/career-role-summaries.json', import.meta.url), 'utf8'),
)

const block = (text) => ({
  _type: 'block',
  style: 'normal',
  children: [{_type: 'span', text, marks: []}],
})

const bullets = (items) => items.map((text) => ({
  ...block(text),
  listItem: 'bullet',
  level: 1,
}))

const ref = (_ref) => ({_type: 'reference', _ref})

const skillIconsDir = path.join(process.cwd(), 'scripts', 'skill-icons')
const academicFocusIconsDir = path.join(process.cwd(), 'scripts', 'academic-focus-icons')

const findExistingSvgAsset = async (filename) => {
  return client.fetch(
    '*[_type == "sanity.fileAsset" && originalFilename == $filename && mimeType == "image/svg+xml"][0]{_id}',
    {filename},
  )
}

const uploadSkillIconAsset = async (iconKey) => {
  const filename = `${iconKey}.svg`
  const filePath = path.join(skillIconsDir, filename)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const existingAsset = await findExistingSvgAsset(filename)
  if (existingAsset?._id) {
    console.log(`Re-using existing SVG asset for ${iconKey}`)
    return existingAsset
  }

  console.log(`Uploading SVG asset for ${iconKey} from ${filePath}`)
  return client.assets.upload('file', fs.createReadStream(filePath), {
    filename,
    contentType: 'image/svg+xml',
  })
}

const uploadAcademicFocusIconAsset = async (iconName) => {
  const filename = `${iconName}.svg`
  const filePath = path.join(academicFocusIconsDir, filename)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const existingAsset = await findExistingSvgAsset(filename)
  if (existingAsset?._id) {
    console.log(`Re-using existing SVG asset for academic focus ${iconName}`)
    return existingAsset
  }

  console.log(`Uploading SVG asset for academic focus ${iconName} from ${filePath}`)
  return client.assets.upload('file', fs.createReadStream(filePath), {
    filename,
    contentType: 'image/svg+xml',
  })
}

const skills = [
  ['skill.javascript', 'JavaScript', 'JavaScript', 'javascript', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'],
  ['skill.html5', 'HTML 5', 'HTML 5', 'html5', 'https://developer.mozilla.org/en-US/docs/Web/HTML'],
  ['skill.jquery', 'jQuery', 'jQuery', 'jquery', 'https://jquery.com/'],
  ['skill.vuejs', 'VueJS', 'VueJS', 'vuejs', 'https://vuejs.org/'],
  ['skill.google-tag-manager', 'Google Tag Manager', 'GTM', 'googleTagManager', 'https://support.google.com/tagmanager/', 'Google Tag Manager'],
  ['skill.dynamodb', 'DynamoDB', 'DynamoDB', 'dynamodb', 'https://aws.amazon.com/dynamodb/'],
  ['skill.reactjs', 'ReactJS', 'ReactJS', 'reactjs', 'https://reactjs.org/'],
  ['skill.typescript', 'TypeScript', 'TypeScript', 'typescript', 'https://www.typescriptlang.org/'],
  ['skill.telerik', 'KendoUI', 'KendoUI', 'telerik', 'https://www.telerik.com/kendo-ui'],
  ['skill.dotnet-core', '.NET Core', '.NET Core', 'dotnetcore', 'https://docs.microsoft.com/en-us/dotnet/core/'],
  ['skill.latex', 'LaTeX', 'LaTeX', 'latex', 'https://www.latex-project.org/'],
  ['skill.mathematica', 'Mathematica', 'Mathematica', 'mathematica', 'https://www.wolfram.com/mathematica/'],
  ['skill.pspp', 'PSPP', 'PSPP', 'pspp', 'https://www.gnu.org/software/pspp/'],
  ['skill.matlab', 'MatLab', 'MatLab', 'matlab', 'https://www.mathworks.com/products/matlab.html'],
  ['skill.geogabra', 'Geogabra', 'Geogabra', 'geogabra', 'https://www.geogebra.org/'],
  ['skill.golang', 'GoLang', 'GoLang', 'golang', 'https://golang.org/'],
  ['skill.thymeleaf', 'Thymeleaf', 'Thymeleaf', 'thymeleaf', 'https://www.thymeleaf.org/'],
  ['skill.docker', 'Docker', 'Docker', 'docker', 'https://www.docker.com/'],
  ['skill.gcp', 'Google Cloud Platform', 'GCP', 'googleCloudPlatform', 'https://cloud.google.com/'],
  ['skill.nodejs', 'NodeJS', 'NodeJS', 'nodejs', 'https://nodejs.org/'],
].map(([_id, title, subtitle, iconKey, href, tooltip]) => ({
  _id,
  _type: 'skill',
  title,
  subtitle,
  tooltip,
  iconKey,
  href,
}))

const featuredSkillDocuments = JSON.parse(
  fs.readFileSync(new URL('../data/featured-skills.json', import.meta.url), 'utf8'),
).map((skill) => ({...skill, _type: 'skill'}))
skills.push(...featuredSkillDocuments)

const careerEmployers = [
  {
    _id: 'careerEmployer.oreilly',
    _type: 'careerEmployer',
    name: "O'Reilly Auto Parts",
    location: 'Springfield, MO · Remote',
    orderRank: 10,
    roles: [
      {
        _key: 'software-engineer-ii',
        summary: careerRoleSummaries['careerEmployer.oreilly']['software-engineer-ii'],
        title: 'Software Engineer II',
        employmentType: 'Full-time',
        startDate: '2025-09-01',
        description: bullets([
          'Designs, develops, tests, and maintains high-quality software solutions across the full SDLC.',
          'Enhances existing systems, builds new applications, and supports cloud-based solutions with a focus on performance, scalability, and security.',
          'Participates in code reviews, improves development processes, and mentors junior engineers as needed.',
        ]),
        skills: ['skill.gcp', 'skill.reactjs', 'skill.nodejs', 'skill.typescript', 'skill.docker'].map(ref),
      },
      {
        _key: 'scrum-master',
        summary: careerRoleSummaries['careerEmployer.oreilly']['scrum-master'],
        title: 'Scrum Master',
        employmentType: 'Part-time',
        startDate: '2025-06-01',
        endDate: '2025-03-01',
        description: bullets([
          'Facilitates Agile and Scrum practices to help teams deliver high-quality solutions efficiently.',
          'Coaches teams on Scrum principles, removes impediments, and fosters continuous improvement.',
          'Partners with product owners and stakeholders to support planning, ceremonies, collaboration, transparency, and timely delivery.',
        ]),
        skills: [],
      },
      {
        _key: 'technical-lead',
        summary: careerRoleSummaries['careerEmployer.oreilly']['technical-lead'],
        title: 'Technical Lead',
        employmentType: 'Full-time',
        startDate: '2024-03-01',
        description: bullets([
          'Works as a front-end technical lead and liaison for the Online Store Team.',
          'Plans, leads, and engineers technical solutions across front-end initiatives.',
        ]),
        skills: ['skill.vuejs', 'skill.typescript', 'skill.nodejs', 'skill.thymeleaf'].map(ref),
      },
      {
        _key: 'software-engineer-i',
        summary: careerRoleSummaries['careerEmployer.oreilly']['software-engineer-i'],
        title: 'Software Engineer I',
        employmentType: 'Full-time',
        startDate: '2025-06-01',
        endDate: '2025-09-01',
        description: bullets([
          'Contributed to the design, development, testing, and deployment of software solutions.',
          'Wrote clean, well-documented code, supported application enhancements, assisted with testing and monitoring, and collaborated with cross-functional teams.',
        ]),
        skills: ['skill.reactjs', 'skill.gcp', 'skill.nodejs', 'skill.typescript'].map(ref),
      },
      {
        _key: 'ui-ux-developer-ii',
        summary: careerRoleSummaries['careerEmployer.oreilly']['ui-ux-developer-ii'],
        title: 'UI/UX Developer II',
        employmentType: 'Full-time',
        startDate: '2022-02-01',
        endDate: '2025-06-01',
        description: bullets([
          'Documented, developed, and tested computer software by applying knowledge of programming techniques and computer systems.',
          'Wrote clean, semantic HTML and CSS in conjunction with client-side JavaScript frameworks.',
        ]),
        skills: ['skill.html5', 'skill.vuejs', 'skill.typescript', 'skill.jquery', 'skill.google-tag-manager', 'skill.thymeleaf', 'skill.docker'].map(ref),
      },
    ],
  },
  {
    _id: 'careerEmployer.netsmart',
    _type: 'careerEmployer',
    name: 'Netsmart',
    location: 'Springfield, MO',
    orderRank: 20,
    roles: [{
      _key: 'software-engineer',
      summary: careerRoleSummaries['careerEmployer.netsmart']['software-engineer'],
      title: 'Software Engineer',
      employmentType: 'Full-time',
      startDate: '2020-07-01',
      endDate: '2022-02-01',
      description: bullets([
        'Participates in the software development life cycle including requirement analysis, planning, software design, development, review, unit/integration testing, and deployment.',
        'Identify, implement and support technical solutions to deliver business requirements',
      ]),
      skills: ['skill.dynamodb', 'skill.reactjs', 'skill.typescript', 'skill.telerik', 'skill.dotnet-core', 'skill.nodejs', 'skill.golang', 'skill.html5', 'skill.jquery'].map(ref),
    }],
  },
  {
    _id: 'careerEmployer.college-of-the-ozarks',
    _type: 'careerEmployer',
    name: 'College of the Ozarks',
    location: 'Point Lookout, MO',
    orderRank: 30,
    roles: [{
      _key: 'lab-assistant',
      summary: careerRoleSummaries['careerEmployer.college-of-the-ozarks']['lab-assistant'],
      title: 'Lab Assistant',
      employmentType: 'Part-time',
      startDate: '2017-09-01',
      endDate: '2020-06-01',
      description: [
        block("Worked as a lab assistant in the College's mathematics and physics department. Assisted in instructing students in the areas of Calculus, Calculus-based Physics, Abstract Algebra, Statistics, both Numerical and Real analysis, and more."),
      ],
      skills: ['skill.latex', 'skill.mathematica', 'skill.pspp', 'skill.matlab', 'skill.geogabra'].map(ref),
    }],
  },
]

const academicRecord = {
  _id: 'academicRecord.college-of-the-ozarks',
  _type: 'academicRecord',
  degree: "Bachelor's Degree",
  emblem: {
    lightSrc: '/academics/cofo_light.png',
    darkSrc: '/academics/cofo_dark.png',
    alt: 'College of the Ozarks emblem',
  },
  institution: 'College of the Ozarks',
  location: 'Point Lookout, Missouri',
  startDate: '2015-09-01',
  endDate: '2020-06-01',
  description: [
    block('Received a liberal arts degree. Has proficiency in the arts, including expressing oneself orally and through composition.'),
  ],
  focuses: [
    {
      _key: 'computer-science',
      type: 'Major',
      name: 'Computer Science',
      gpa: '3.90',
      description: [block(academicFocusDescriptions['computer-science'])],
    },
    {
      _key: 'mathematics',
      type: 'Major',
      name: 'Mathematics',
      gpa: '3.91',
      description: [block(academicFocusDescriptions['mathematics'])],
    },
    {
      _key: 'christian-apologetics',
      type: 'Minor',
      name: 'Biblical Studies',
      gpa: '3.71',
      description: [block(academicFocusDescriptions['christian-apologetics'])],
    },
  ],
  commendations: [
    {
      _key: 'major-field-exam',
      focusKey: 'mathematics',
      label: 'Major Field Exam 189/200',
      title: '189/200',
      dates: '2020',
      subtitle: 'Major Field Exam',
      tooltip: 'Major Field Exam for Mathematics',
      link: process.env.EDUCATIONAL_TESTING_SERVICE_URL,
      iconKey: 'majorFieldExam',
    },
    {
      _key: 'math-and-physics-club-president',
      focusKey: 'mathematics',
      label: 'Math & Physics Club President',
      title: 'President',
      dates: '2019-2020',
      subtitle: 'Math & Physics Club',
      link: process.env.COLLEGE_OF_THE_OZARKS_URL,
      iconKey: 'mathAndPhysicsClub',
    },
    {
      _key: 'sigma-zeta-president',
      focusKey: 'mathematics',
      label: 'Sigma Zeta President',
      title: 'President',
      dates: '2020',
      subtitle: 'ΣΖ Honor Society',
      tooltip: 'Sigma Zeta Honor Society Beta-Phi Chapter',
      link: process.env.SIGMA_ZETA_URL,
      iconKey: 'sigmaZeta',
    },
    {
      _key: 'association-for-computing-machinery',
      focusKey: 'computer-science',
      label: 'ACM Vice-president',
      title: 'Vice-President',
      dates: '2018-2019',
      subtitle: 'ACM Club',
      tooltip: 'Association for Computing Machinery',
      link: process.env.ASSOCIATION_FOR_COMPUTING_MACHINERY_URL,
      iconKey: 'associationForComputingMachinery',
    },
  ],
}

const academicFocusIconNames = {
  'computer-science': 'computerScience',
  mathematics: 'mathematics',
  'christian-apologetics': 'christianApologetics',
}

const careerSkillIds = [...new Set([
  ...featuredSkillDocuments.map((skill) => skill._id),
  ...careerEmployers.flatMap((employer) => employer.roles)
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .flatMap((role) => role.skills.map((skill) => skill._ref)),
])]

const siteSettings = {
  _id: 'siteSettings',
  contentOwnershipVersion: 1,
  careerSkills: careerSkillIds.map((_ref, index) => ({...ref(_ref), _key: `career-skill-${index + 1}`})),
  _type: 'siteSettings',
  title: 'jeremiah.dev',
  description: 'Jeremiah "J" Gage Portfolio, Works, Skills, Achievements.',
  dictionary,
}

async function seed() {
  const transaction = client.transaction()

  for (const skill of skills) {
    if (skill.iconKey) {
      try {
        const asset = await uploadSkillIconAsset(skill.iconKey)
        if (asset?._id) {
          skill.icon = {
            _type: 'file',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          }
        }
      } catch (error) {
        console.warn(`Failed to upload SVG asset for ${skill.iconKey}:`, error)
      }
    }

    transaction.createOrReplace(skill)
  }

  for (const employer of careerEmployers) transaction.createOrReplace(employer)

  for (const focus of academicRecord.focuses) {
    const iconName = academicFocusIconNames[focus._key]

    if (iconName) {
      try {
        const asset = await uploadAcademicFocusIconAsset(iconName)
        if (asset?._id) {
          focus.icon = {
            _type: 'file',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          }
        }
      } catch (error) {
        console.warn(`Failed to upload SVG asset for academic focus ${iconName}:`, error)
      }
    }
  }

  transaction.createOrReplace(siteSettings)
  transaction.createOrReplace(academicRecord)

  const result = await transaction.commit()

  console.log(`Seeded ${1 + skills.length + careerEmployers.length + 1} documents into ${projectId}/${dataset}.`)
  console.log(`Transaction ID: ${result.transactionId}`)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
