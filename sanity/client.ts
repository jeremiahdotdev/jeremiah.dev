import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

export const client = createClient({
  apiVersion,
  dataset,
  projectId: projectId || 'missing-project-id',
  useCdn: true,
})
