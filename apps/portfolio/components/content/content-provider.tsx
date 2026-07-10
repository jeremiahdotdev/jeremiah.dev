"use client"

import { createContext, ReactNode, useContext } from 'react'
import fallbackDictionary from '@/dictionaries/en.json'
import type { Dictionary } from '@/types/dictionary'

const ContentContext = createContext<Dictionary>(fallbackDictionary)

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
  return useContext(ContentContext)
}
