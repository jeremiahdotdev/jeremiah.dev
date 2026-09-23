"use client"

import { createContext, ReactNode, useContext } from 'react'
import type { Dictionary } from '@/types/dictionary'

const ContentContext = createContext<Dictionary | null>(null)

export function ContentProvider({
  children,
  dictionary,
}: {
  children: ReactNode
  dictionary: Dictionary
}) {
  return (
    <ContentContext.Provider value={dictionary}>
      {children}
    </ContentContext.Provider>
  )
}

export function useDictionary() {
  const dictionary = useContext(ContentContext)
  if (!dictionary) throw new Error('useDictionary requires ContentProvider with Sanity content.')
  return dictionary
}
