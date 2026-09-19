import fallbackDictionary from '@/dictionaries/en.json'

type FallbackDictionary = typeof fallbackDictionary

export type Dictionary = Omit<FallbackDictionary, 'navigation'> & {
  navigation: Array<FallbackDictionary['navigation'][number] & {icon?: string}>
}
