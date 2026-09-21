import { GetGitHubProjects } from './gateway/github';
import { parseProjects } from './service/parseProjects';
import { unstable_cache } from 'next/cache';

const getCachedGitHubProjects = unstable_cache(
  async () => {
    const data = await GetGitHubProjects()
    return data.value
  },
  ['github-projects-raw'],
  { revalidate: 3600 }
)

export async function getProjectsData() { 
  try {
    const projects = await getCachedGitHubProjects()
    return parseProjects(projects)
  } catch (error) {
    console.error('Unable to load project data.', error)
    return []
  }
}
