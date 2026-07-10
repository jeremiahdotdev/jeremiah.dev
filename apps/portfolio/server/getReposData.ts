import { GetGitHubRepositories } from './gateway/github';

export async function getReposData() { 
  const data = await GetGitHubRepositories()
  return data
}