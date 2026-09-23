import type { Dictionary } from '@/types/dictionary'
import { client } from '../client'
import { requireSanityConfig } from '../env'
import { siteSettingsQuery } from '../queries'

type SiteSettings = {
  title: string
  description: string
  dictionary: Dictionary
}

export async function getSiteSettings(): Promise<SiteSettings> {
  requireSanityConfig()
  const settings = await client.fetch<SiteSettings | null>(
    siteSettingsQuery,
    {},
    {next: {revalidate: 60}},
  )
  if (!settings?.dictionary) throw new Error('Sanity Site Settings and its dictionary are required.')
  return settings
}

export async function getSiteDictionary(): Promise<Dictionary> {
  return (await getSiteSettings()).dictionary
}
