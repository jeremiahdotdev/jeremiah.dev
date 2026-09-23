export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-24'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN || process.env.LOCAL_SANITY_API_EDIT_TOKEN

export const hasSanityConfig = Boolean(projectId && dataset)

export function requireSanityConfig() {
  if (!hasSanityConfig) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID must be configured. Site content is managed in Sanity.')
  if (!token) throw new Error('A server-side Sanity token is required to read academic and career content.')
}
