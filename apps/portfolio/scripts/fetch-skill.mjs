import {createClient} from '@sanity/client'
import nextEnv from '@next/env'
import process from 'node:process'

nextEnv.loadEnvConfig(process.cwd())

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-24'

if (!projectId) {
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID not set')
  process.exit(1)
}

const token = process.env.SANITY_API_WRITE_TOKEN
const client = createClient({projectId, dataset, apiVersion, token, useCdn: false})

const id = process.argv[2] || 'skill.typescript'

async function run() {
  console.log('projectId=', projectId, 'dataset=', dataset, 'apiVersion=', apiVersion)
  if (id === 'all') {
    const docs = await client.fetch(`*[_type == "skill"]{_id, title, subtitle, tooltip, iconKey, icon{asset->{_id, url}}}`)
    console.log(JSON.stringify(docs, null, 2))
  } else {
    const doc = await client.fetch(`*[_type == "skill" && _id == $id][0]{_id, title, subtitle, tooltip, iconKey, icon{asset->{_id, url}}}`, {id})
    console.log(JSON.stringify(doc, null, 2))
  }
}

run().catch((err) => { console.error(err); process.exit(1) })
