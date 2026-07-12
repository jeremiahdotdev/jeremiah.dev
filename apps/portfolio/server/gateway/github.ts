import config from "@/config.json";
import { Octokit } from "octokit";
import { GithubDocument, GithubRepository, InternalGithubDocument, InternalGithubLanguages, InternalGithubProject, SimpleCache } from "@/types/github";
import { scopePortfolioTheme } from "../service/scopePortfolioTheme";

const githubAuthToken = [
    process.env.GITHUB_TOKEN,
    process.env.GITHUB_API_TOKEN,
    process.env.GITHUB_API_URL,
].find((value) => value && !value.startsWith("http"));

const octokit = new Octokit({
    auth: githubAuthToken
});

const basePath = config.github.api + config.github.repos

//STATE VARIABLES
const GITHUB_REPOSITORIES: SimpleCache<GithubRepository> = { value: [], dateUpdated: null }
const GITHUB_PROJECTS: SimpleCache<InternalGithubProject> = { value: [], dateUpdated: null }
const GITHUB_LANGUAGES: SimpleCache<InternalGithubLanguages> = { value: [], dateUpdated: null }
const GITHUB_DOCUMENTS: SimpleCache<InternalGithubDocument> = { value: [], dateUpdated: null }

type GitHubResourceKey = "repositories" | "projects" | "languages" | "documents";

const GITHUB_RETRY_AFTER: Record<GitHubResourceKey, Date | null> = {
    repositories: null,
    projects: null,
    languages: null,
    documents: null
};

const RATE_LIMIT_FALLBACK_MS = 5 * 60 * 1000;

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

function hasStateValue(state: SimpleCache<unknown>) {
    return state.value.length > 0
}

function retryWindowIsActive(resource: GitHubResourceKey) {
    const retryAfter = GITHUB_RETRY_AFTER[resource];
    return Boolean(retryAfter && retryAfter.getTime() > Date.now())
}

function clearRetryWindow(resource: GitHubResourceKey) {
    GITHUB_RETRY_AFTER[resource] = null
}

function getGitHubRetryDate(error: unknown) {
    const headers = typeof error === "object" && error !== null && "response" in error
        ? (error.response as { headers?: Record<string, string | number | undefined> })?.headers
        : undefined;
    const retryAfterHeader = headers?.["retry-after"];
    const rateLimitResetHeader = headers?.["x-ratelimit-reset"];

    if (typeof retryAfterHeader === "string" || typeof retryAfterHeader === "number") {
        const retryAfterSeconds = Number(retryAfterHeader);
        if (!Number.isNaN(retryAfterSeconds) && retryAfterSeconds > 0) {
            return new Date(Date.now() + retryAfterSeconds * 1000);
        }
    }

    if (typeof rateLimitResetHeader === "string" || typeof rateLimitResetHeader === "number") {
        const resetUnixSeconds = Number(rateLimitResetHeader);
        if (!Number.isNaN(resetUnixSeconds) && resetUnixSeconds > 0) {
            return new Date(resetUnixSeconds * 1000);
        }
    }

    return new Date(Date.now() + RATE_LIMIT_FALLBACK_MS);
}

function isGitHubRateLimitError(error: unknown) {
    if (typeof error !== "object" || error === null) {
        return false;
    }

    const status = "status" in error ? error.status : undefined;
    const message = "message" in error && typeof error.message === "string"
        ? error.message.toLowerCase()
        : "";

    return status === 403
        || status === 429
        || message.includes("rate limit")
        || message.includes("quota exhausted");
}

async function loadWithRetryWindow<T>(
    resource: GitHubResourceKey,
    state: SimpleCache<T>,
    loader: () => Promise<unknown>
) {
    if (retryWindowIsActive(resource)) {
        return state;
    }

    try {
        await loader();
        clearRetryWindow(resource);
    } catch (error) {
        if (isGitHubRateLimitError(error)) {
            GITHUB_RETRY_AFTER[resource] = getGitHubRetryDate(error);
        }

        throw error;
    }

    return state;
}

export async function GetGitHubRepositories() {
    if (!stateIsValid(GITHUB_REPOSITORIES) && !retryWindowIsActive("repositories")) {
        try {
            await loadWithRetryWindow("repositories", GITHUB_REPOSITORIES, LoadGitHubRepositories)
        } catch (error) {
            console.error("Failed to load GitHub repositories.", error)
        }
    }
    return GITHUB_REPOSITORIES
}

export async function GetGitHubProjects() {
    if (!stateIsValid(GITHUB_PROJECTS) && !retryWindowIsActive("projects")) {
        try {
            await loadWithRetryWindow("projects", GITHUB_PROJECTS, LoadGitHubProjects)
        } catch (error) {
            console.error("Failed to load GitHub projects.", error)
        }
    }
    return GITHUB_PROJECTS
}

export async function GetGitHubLanguages() {
    if (!stateIsValid(GITHUB_LANGUAGES) && !retryWindowIsActive("languages")) {
        try {
            await loadWithRetryWindow("languages", GITHUB_LANGUAGES, LoadGitHubLanguages)
        } catch (error) {
            console.error("Failed to load GitHub languages.", error)
        }
    }
    return GITHUB_LANGUAGES
}

export async function GetGitHubDocumentsByDocument(documentPath: string) {
    const documentIsMissing = !stateContainsValue(GITHUB_DOCUMENTS, documentPath);

    if ((!stateIsValid(GITHUB_DOCUMENTS) || documentIsMissing) && !retryWindowIsActive("documents")) {
        try {
            await loadWithRetryWindow(
                "documents",
                GITHUB_DOCUMENTS,
                () => LoadGitHubDocumentsByDocument(documentPath)
            )
        } catch (error) {
            console.error(`Failed to load GitHub documents for '${documentPath}'.`, error)
        }
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
    if (!hasStateValue(repositories)) {
        GITHUB_PROJECTS.value = [];
        GITHUB_PROJECTS.dateUpdated = new Date();
        return true;
    }

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
                    hasTheme: hasTheme || hasCard,
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
                    hasTheme: hasTheme || hasFile(portfolioConfig.card),
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
    if (!hasStateValue(repositories)) {
        GITHUB_LANGUAGES.value = []
        GITHUB_LANGUAGES.dateUpdated = new Date()
        return [];
    }

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
        if (!data) {
            return
        }

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
