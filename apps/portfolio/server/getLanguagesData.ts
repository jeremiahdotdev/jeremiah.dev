import { GetGitHubLanguages } from "./gateway/github"

export async function getLanguagesData() { 
  const data = await GetGitHubLanguages()
  const languages = data.value
  return languages
}