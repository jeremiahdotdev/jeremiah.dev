import { Endpoints } from "@octokit/types";

export interface SimpleCache<T> {
    value: T[], 
    dateUpdated: Date | null 
}

export type GithubRepository = Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];

export type RawGithubLanguages = Record<string, number>;

export type InternalGithubProject = GithubRepository & { 
    image?: string 
    languages?: RawGithubLanguages
};

export interface InternalGithubLanguages {
    key: string,
    name: string,
    value: number;
}
