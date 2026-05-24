export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-24'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN
export const studioUrl = '/studio'

export const hasSanityConfig = Boolean(projectId && dataset)
