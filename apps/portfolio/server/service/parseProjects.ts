import type { InternalGithubProject, RawGithubLanguages } from "@/types/github"
import type { Languages } from "@/types/languages"
import type { Project } from "@/types/project"
import { parseProjectDescription } from "@/lib/project-description"

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: "#2563eb",
    Vue: "#30b90e",
    JavaScript: "#ff9900",
    CSS: "#8b5cf6",
    HTML: "#d7c100",
    SCSS: "#ec4899",
    Ruby: "#dc2626",
    PHP: "#6366f1",
    Java: "#f59e0b",
    Python: "#22c55e",
    Shell: "#94a3b8",
};

const FALLBACK_LANGUAGE_COLORS = [
    "#14b8a6",
    "#facc15",
    "#2563eb",
    "#f97316",
    "#8b5cf6",
];

function parseLanguages(languages?: RawGithubLanguages): Languages {
    if (!languages) return [];
    const totalBytes = Object.values(languages).reduce((acc, bytes)=>acc+=bytes, 0)

    return Object.entries(languages)
        .map(([name, value], index) => ({
            name,
            value: Math.round((value * 1000 / totalBytes)) / 10,
            color: LANGUAGE_COLORS[name] ?? FALLBACK_LANGUAGE_COLORS[index % FALLBACK_LANGUAGE_COLORS.length]
        }))
        .filter((language) => language.value > 0)
        .sort((a, b) => b.value - a.value)
}

function parseProject(project: InternalGithubProject): Project {
    const languages = parseLanguages(project.languages);
    const { description: rawDescription, badges } = parseProjectDescription(project.description ?? "");
    const separatorIndex = rawDescription.indexOf(":");
    const readableName = separatorIndex >= 0 ? rawDescription.slice(0, separatorIndex).trim() : "";
    const name = readableName || project.name;
    const description = readableName ? rawDescription.slice(separatorIndex + 1).trim() : rawDescription;
    const parsedProject: Project = {
        name,
        description,
        summary: description,
        badges,
        icon: project.image ? { src: project.image, alt: name } : undefined,
        private: project.private,
        link: { href: project.html_url, label: ""},
        demo: project.homepage ? { href: project.homepage, label: ""} : undefined,
        image: project.owner?.avatar_url,
        topics: project.topics,
        languages
    }
    return parsedProject
}

export function parseProjects(projects: InternalGithubProject[]): Project[] {
    return projects.map(parseProject)
}
