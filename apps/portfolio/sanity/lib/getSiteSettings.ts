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

function mergeDictionaries<T>(fallback: T, override: Partial<T> | undefined): T {
  if (!override) return fallback

  const mergedEntries = Object.entries(fallback as Record<string, unknown>).map(([key, value]) => {
    const overrideValue = (override as Record<string, unknown>)[key]

    if (Array.isArray(value) || value === null || typeof value !== 'object') {
      return [key, overrideValue ?? value]
    }

    if (!overrideValue || Array.isArray(overrideValue) || typeof overrideValue !== 'object') {
      return [key, value]
    }

    return [key, mergeDictionaries(value, overrideValue)]
  })

  return Object.fromEntries(mergedEntries) as T
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
      dictionary: mergeDictionaries(fallbackSettings.dictionary, settings?.dictionary),
    }
  } catch {
    return fallbackSettings
  }
}

export async function getSiteDictionary(): Promise<Dictionary> {
  return (await getSiteSettings()).dictionary
}
