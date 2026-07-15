import { Endpoints } from "@octokit/types";
import { Languages } from "./languages";

export interface SimpleCache<T> {
    value: T[], 
    dateUpdated: Date | null 
}

export type GithubRepository = Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];

export type GithubDocument = Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]["data"];

export type GithubLanguages = Endpoints["GET /repos/{owner}/{repo}/languages"]["response"]["data"];
export type RawGithubLanguages = Record<string, number>;

export type InternalGithubProject = GithubRepository & { 
    image?: string 
    languages?: RawGithubLanguages
};

export interface InternalGithubDocument {
    key: string,
    documents: {
        title: string,
        document: string;
    }[]
}

export interface InternalGithubLanguages {
    key: string,
    name: string,
    value: number;
}
