import {createClient} from '@sanity/client'
import {createRequire} from 'node:module'
import {isDeepStrictEqual} from 'node:util'
import {readFile, mkdtemp, writeFile} from 'node:fs/promises'
import {dirname, join} from 'node:path'
import {homedir, tmpdir} from 'node:os'
import {fileURLToPath} from 'node:url'
import {buildContentOwnershipPlan, ownershipContent} from './lib/content-ownership.mjs'

async function migrateContentOwnership() {
  const apply = process.argv.includes('--apply')
  const inspect = process.argv.includes('--dry-run')

  if (!apply && !inspect) {
    console.log(JSON.stringify({
      descriptions: ownershipContent.descriptions,
      awards: ownershipContent.awards,
      roleSummaries: ownershipContent.roleSummaries,
      featuredSkills: ownershipContent.featuredSkills,
      dictionary: ownershipContent.dictionary,
      note: 'Use --dry-run to inspect patches against Sanity, or --apply to publish. Existing authored values are preserved except the three approved descriptions and the one-time navigation reorder.',
    }, null, 2))
  } else {
    const require = createRequire(import.meta.url)
    const nextDir = dirname(require.resolve('next/package.json'))
    const {loadEnvConfig} = require(require.resolve('@next/env', {paths: [nextDir]}))
    loadEnvConfig(fileURLToPath(new URL('../', import.meta.url)))
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    let cliToken
    try {
      cliToken = JSON.parse(await readFile(join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken
    } catch { /* CLI login is optional when a project token is configured. */ }
    const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN || cliToken || (!apply && process.env.SANITY_API_READ_TOKEN)
    if (!projectId || !token) throw new Error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and a Sanity write token, or use an existing Sanity CLI login, before accessing Sanity.')

    const client = createClient({projectId, dataset, token, useCdn: false, perspective: 'raw', apiVersion: '2026-05-24'})
    const documents = await client.fetch('*[_type in ["siteSettings", "academicRecord", "careerEmployer", "skill"] && !(_id in path("versions.**"))]')
    const plan = buildContentOwnershipPlan(documents)
    if (plan.alreadyApplied) {
      console.log('Content ownership migration already applied; no changes made.')
    } else if (!apply) {
      console.log(JSON.stringify(plan, null, 2))
    } else {
      const backupDir = await mkdtemp(join(tmpdir(), 'sanity-content-ownership-'))
      await writeFile(join(backupDir, 'before.json'), JSON.stringify(documents, null, 2), {mode: 0o600})
      await writeFile(join(backupDir, 'plan.json'), JSON.stringify(plan, null, 2), {mode: 0o600})
      let transaction = client.transaction()
      for (const document of plan.creates) transaction = transaction.create(document)
      for (const patch of plan.patches) {
        transaction = transaction.patch(patch.id, (builder) => builder.ifRevisionId(patch.revision).set(patch.set))
      }
      const result = await transaction.commit({visibility: 'sync'})

      // Verify every changed path with GROQ, including array members selected by key.
      for (const patch of plan.patches) {
        const entries = Object.entries(patch.set)
        const projection = entries.map(([path], index) => `"field${index}": ${path.replace(/(\[_key=="[^"]+"\])/g, '$1[0]')}`).join(',')
        const updated = await client.fetch(`*[_id == $id][0]{${projection}}`, {id: patch.id})
        for (const [index, [, expected]] of entries.entries()) {
          if (!isDeepStrictEqual(updated?.[`field${index}`], expected)) {
            throw new Error(`Verification failed for ${patch.id}:${entries[index][0]}. Backup: ${backupDir}`)
          }
        }
      }
      for (const created of plan.creates) {
        const updated = await client.getDocument(created._id)
        for (const [key, value] of Object.entries(created)) {
          if (!isDeepStrictEqual(updated?.[key], value)) throw new Error(`Verification failed for new skill ${created._id}. Backup: ${backupDir}`)
        }
      }
      console.log(`Updated and verified ${plan.patches.length} documents and ${plan.creates.length} new skills. Transaction ${result.transactionId}. Backup: ${backupDir}`)
    }
  }
}

migrateContentOwnership().catch((error) => {
  console.error(error instanceof Error ? error.message : "Content migration failed.")
  process.exitCode = 1
})
