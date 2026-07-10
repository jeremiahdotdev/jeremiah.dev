import { GetGitHubProjects } from './gateway/github';
import { parseProjects } from './service/parseProjects';

export async function getProjectsData() { 
  const data = await GetGitHubProjects()
  const projects = parseProjects(data.value)
  return projects
}