import fallbackDictionary from '@/dictionaries/en.json'
import type { Dictionary } from '@/types/dictionary'
import { client } from '../client'
import { hasSanityConfig } from '../env'
import { siteSettingsQuery } from '../queries'

export type SiteSettings = {
  title: string
  description: string
  dictionary: Dictionary
}

const fallbackSettings: SiteSettings = {
  title: 'jeremiah.dev',
  description: 'Jeremiah "J" Gage Portfolio, Works, Skills, Achievements.',
  dictionary: fallbackDictionary,
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasSanityConfig) return fallbackSettings

  try {
    const settings = await client.fetch<Partial<SiteSettings> | null>(
      siteSettingsQuery,
      {},
      {next: {revalidate: 60}},
    )

    return {
      title: settings?.title || fallbackSettings.title,
      description: settings?.description || fallbackSettings.description,
      dictionary: settings?.dictionary || fallbackSettings.dictionary,
    }
  } catch {
    return fallbackSettings
  }
}

export async function getSiteDictionary(): Promise<Dictionary> {
  return (await getSiteSettings()).dictionary
}
