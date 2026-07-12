import { GetGitHubProjects } from './gateway/github';
import { parseProjects } from './service/parseProjects';
import { unstable_cache } from 'next/cache';

const getCachedProjectsData = unstable_cache(
  async () => {
    const data = await GetGitHubProjects()
    const projects = parseProjects(data.value)
    return projects
  },
  ['github-projects'],
  { revalidate: 3600 }
)

export async function getProjectsData() { 
  try {
    const projects = await getCachedProjectsData()
    return projects
  } catch (error) {
    console.error('Unable to load project data.', error)
    return []
  }
}