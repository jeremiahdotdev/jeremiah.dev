import config from "@/config.json";
import { Octokit } from "octokit";
import { GithubDocument, GithubRepository, InternalGithubDocument, InternalGithubLanguages, InternalGithubProject, SimpleCache } from "@/types/github";

const octokit = new Octokit({
    auth: process.env.GITHUB_API_URL ?? ""
});

const basePath = config.github.api + config.github.repos

//STATE VARIABLES
const GITHUB_REPOSITORIES: SimpleCache<GithubRepository> = { value: [], dateUpdated: null }
const GITHUB_PROJECTS: SimpleCache<InternalGithubProject> = { value: [], dateUpdated: null }
const GITHUB_LANGUAGES: SimpleCache<InternalGithubLanguages> = { value: [], dateUpdated: null }
const GITHUB_DOCUMENTS: SimpleCache<InternalGithubDocument> = { value: [], dateUpdated: null }

function isDifferenceLessThanThreshold(date: Date | null, thresholdInHours: number): boolean {
    if (!date) return false;
    const differenceInMilliseconds = Math.abs(new Date().getTime() - date.getTime());
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
    return differenceInHours < thresholdInHours;
}

function stateIsValid(state: SimpleCache<GithubRepository | InternalGithubLanguages | InternalGithubDocument>) {
    var stateIsNotNull = !!state
    const stateIsNotOutdated = isDifferenceLessThanThreshold(state.dateUpdated, 1)

    return stateIsNotNull && stateIsNotOutdated
}

function stateContainsValue(state: SimpleCache<InternalGithubLanguages | InternalGithubDocument>, keyValue: string) {
    for (const item of state.value) {
        if (item.key === keyValue) return item
    }

    return null
}

export async function GetGitHubRepositories() {
    if (!stateIsValid(GITHUB_REPOSITORIES)) {
        await LoadGitHubRepositories() 
    }    
    return GITHUB_REPOSITORIES
}

export async function GetGitHubProjects() {
    if (!stateIsValid(GITHUB_PROJECTS)) {
        await LoadGitHubProjects() 
    }    
    return GITHUB_PROJECTS
}

export async function GetGitHubLanguages() {
    if (!stateIsValid(GITHUB_LANGUAGES)) {
        await LoadGitHubLanguages() 
    }    
    return GITHUB_LANGUAGES
}

export async function GetGitHubDocumentsByDocument(documentPath: string) {
    if (!stateIsValid(GITHUB_DOCUMENTS) || !stateContainsValue(GITHUB_DOCUMENTS, documentPath)) {
        await LoadGitHubDocumentsByDocument(documentPath) 
    }    

    return stateContainsValue(GITHUB_DOCUMENTS, documentPath)
}

async function LoadGitHubDocumentsByDocument(documentPath: string) {
    const response = await octokit.request(basePath + documentPath);
    
    const documents = []
    for (let file of response.data) {
        const document = await octokit.request(file.url);
        documents.push({title: file.name, document: Buffer.from(document.data.content, 'base64').toString('ascii')});
    }

    GITHUB_DOCUMENTS.value.push({ key: documentPath, documents: documents})
    GITHUB_DOCUMENTS.dateUpdated = new Date()

    return response.status;
}

async function LoadGitHubRepositories() {
    const response = await octokit.request(basePath)
    const repositories = response.data
    
    GITHUB_REPOSITORIES.value = repositories
    GITHUB_REPOSITORIES.dateUpdated = new Date()
    
    return response.status;
}

async function LoadGitHubProjects() {
    const repositories = await GetGitHubRepositories();

    const getPublicRepoImage = (repo: InternalGithubProject) => `${repo.html_url}/blob/main/thumbnail.png?raw=true`;
    const getPrivateRepoImage = async (repo: InternalGithubProject) => {
        const response = await octokit.request(repo.contents_url, {
            path: config.github.thumbnailName
        }).catch(console.log);
        return `data:image/png;base64,${response?.data?.content}`;
    };
    const getLanguages = async (repo: InternalGithubProject) => {
        const response = await octokit.request(repo.languages_url).catch(console.log);
        return response?.data;
    };
    
    const projects = await Promise.all(repositories.value.map(async (el: GithubRepository) => ({
        ...el,
        image: el.private? await getPrivateRepoImage(el) : getPublicRepoImage(el),
        languages: await getLanguages(el)
    })));

    GITHUB_PROJECTS.value = projects.sort((a: InternalGithubProject, b: InternalGithubProject) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    GITHUB_PROJECTS.dateUpdated = new Date();
    return true;
}

async function LoadGitHubLanguages() {
    const repositories = await GetGitHubRepositories()

    const languageURLs = []
    for (let repo of repositories.value) {
        languageURLs.push(repo.languages_url)
    }

    const languageResponses = []
    for (let url of languageURLs) {
        const languageResponse = await octokit.request(url).catch(console.log)        
        languageResponses.push(languageResponse)
    }

    const languages: any = []
    languageResponses.forEach((languageResponse) => {
        const data = languageResponse?.data
        for (var prop in data) {
            if (
                !languages.some((item: any) => {
                    if (item.name === prop) {
                        item.value += data[prop]
                        return true
                    }
                }) 
                ) {
                languages.push({name : prop, value : data[prop]});  
            }
        } 
    })

    GITHUB_LANGUAGES.value = languages
    GITHUB_LANGUAGES.dateUpdated = new Date()

    return languages;
}