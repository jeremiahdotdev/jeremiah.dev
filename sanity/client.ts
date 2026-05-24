import 'server-only'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, token } from './env'

export const client = createClient({
  apiVersion,
  dataset,
  projectId: projectId || 'missing-project-id',
  token,
  useCdn: false,
})
