import { GetGitHubLanguages } from "./gateway/github"
import { unstable_cache } from "next/cache"

const getCachedLanguagesData = unstable_cache(
  async () => {
    const data = await GetGitHubLanguages()
    return data.value
  },
  ["github-languages"],
  { revalidate: 3600 }
)

export async function getLanguagesData() { 
  try {
    const languages = await getCachedLanguagesData()
    return languages
  } catch (error) {
    console.error('Unable to load language data.', error)
    return []
  }
}