import { GetGitHubRepositories } from './gateway/github';
import { unstable_cache } from 'next/cache';

const getCachedReposData = unstable_cache(
  async () => {
    const data = await GetGitHubRepositories()
    return data
  },
  ['github-repositories'],
  { revalidate: 3600 }
)

export async function getReposData() { 
  try {
    const data = await getCachedReposData()
    return data
  } catch (error) {
    console.error('Unable to load repository data.', error)
    return { value: [], dateUpdated: null }
  }
}