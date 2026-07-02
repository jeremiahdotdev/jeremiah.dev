import config from "@/config.json";
import { Octokit } from "octokit";
import { GithubDocument, GithubRepository, InternalGithubDocument, InternalGithubLanguages, InternalGithubProject, SimpleCache } from "@/types/github";
import { scopePortfolioTheme } from "../service/scopePortfolioTheme";

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
    const portfolioConfig = config.github.portfolio;
    const getPortfolioAssetPath = (filename: string) => `${portfolioConfig.path}/${filename}`;
    const getPortfolioFiles = async (repo: InternalGithubProject) => {
        const response = await octokit.request(repo.contents_url, {
            path: portfolioConfig.path
        }).catch(() => null);
        const files = Array.isArray(response?.data) ? response.data : [];

        return {
            hasFile: (filename: string) =>
                files.some((file) => file.type === "file" && file.name === filename)
        };
    };
    const getPrivateRepoFileDataUrl = async (
        repo: InternalGithubProject,
        filename: string,
        mimeType: string
    ) => {
        const response = await octokit.request(repo.contents_url, {
            path: getPortfolioAssetPath(filename)
        }).catch(() => null);
        const content = "content" in (response?.data ?? {})
            ? response?.data.content
            : undefined;

        return content
            ? `data:${mimeType};base64,${content.replace(/\s/g, "")}`
            : undefined;
    };
    const getPortfolioThemeCss = async (
        repo: InternalGithubProject,
        filename: string,
        dark = false
    ) => {
        const response = await octokit.request(repo.contents_url, {
            path: getPortfolioAssetPath(filename)
        }).catch(() => null);
        const content = "content" in (response?.data ?? {})
            ? response?.data.content
            : undefined;

        if (!content) return undefined;

        return scopePortfolioTheme(
            Buffer.from(content, "base64").toString("utf8"),
            repo.name,
            dark
        );
    };

    const getPublicRepoPortfolio = async (repo: InternalGithubProject) => {
        const owner = repo.owner?.login;
        if (!owner) return {};

        const branch = repo.default_branch ?? "main";
        const rawPortfolioPath = `${config.github.raw}/${owner}/${repo.name}/${branch}/${portfolioConfig.path}`;
        const { hasFile } = await getPortfolioFiles(repo);
        const hasTheme = hasFile(portfolioConfig.theme);
        const hasDarkTheme = hasFile(portfolioConfig.themeDark);
        const hasCard = hasFile(portfolioConfig.card);
        const hasCardDark = hasFile(portfolioConfig.cardDark);
        const [css, darkCss] = await Promise.all([
            hasTheme ? getPortfolioThemeCss(repo, portfolioConfig.theme) : undefined,
            hasDarkTheme ? getPortfolioThemeCss(repo, portfolioConfig.themeDark, true) : undefined
        ]);

        return {
            image: `${rawPortfolioPath}/${portfolioConfig.thumbnail}`,
            theme: css || darkCss
                ? {
                    css,
                    darkCss,
                    hasDarkTheme: hasDarkTheme || hasCardDark,
                    cardSrc: hasCard
                        ? `${rawPortfolioPath}/${portfolioConfig.card}`
                        : undefined,
                    cardDarkSrc: hasCardDark
                        ? `${rawPortfolioPath}/${portfolioConfig.cardDark}`
                        : undefined
                }
                : undefined
        };
    };
    const getPrivateRepoPortfolio = async (repo: InternalGithubProject) => {
        const { hasFile } = await getPortfolioFiles(repo);
        const hasTheme = hasFile(portfolioConfig.theme);
        const hasDarkTheme = hasFile(portfolioConfig.themeDark);
        const [image, css, darkCss, cardSrc, cardDarkSrc] = await Promise.all([
            hasFile(portfolioConfig.thumbnail)
                ? getPrivateRepoFileDataUrl(repo, portfolioConfig.thumbnail, "image/png")
                : undefined,
            hasTheme
                ? getPortfolioThemeCss(repo, portfolioConfig.theme)
                : undefined,
            hasDarkTheme
                ? getPortfolioThemeCss(repo, portfolioConfig.themeDark, true)
                : undefined,
            hasTheme && hasFile(portfolioConfig.card)
                ? getPrivateRepoFileDataUrl(repo, portfolioConfig.card, "image/webp")
                : undefined,
            hasTheme && hasFile(portfolioConfig.cardDark)
                ? getPrivateRepoFileDataUrl(repo, portfolioConfig.cardDark, "image/webp")
                : undefined
        ]);

        return {
            image,
            theme: css || darkCss
                ? {
                    css,
                    darkCss,
                    hasDarkTheme: hasDarkTheme || hasFile(portfolioConfig.cardDark),
                    cardSrc,
                    cardDarkSrc
                }
                : undefined
        };
    };
    const getLanguages = async (repo: InternalGithubProject) => {
        const response = await octokit.request(repo.languages_url).catch(console.log);
        return response?.data;
    };
    
    const projects = await Promise.all(repositories.value.map(async (el: GithubRepository) => {
        const portfolio = el.private
            ? await getPrivateRepoPortfolio(el)
            : await getPublicRepoPortfolio(el);

        return {
            ...el,
            image: portfolio.image,
            theme: portfolio.theme,
            languages: await getLanguages(el)
        };
    }));

    GITHUB_PROJECTS.value = projects.sort((a: InternalGithubProject, b: InternalGithubProject) => {
        const lastWorkedOnA = a.pushed_at ?? a.updated_at;
        const lastWorkedOnB = b.pushed_at ?? b.updated_at;
        return new Date(lastWorkedOnB).getTime() - new Date(lastWorkedOnA).getTime();
    });
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
