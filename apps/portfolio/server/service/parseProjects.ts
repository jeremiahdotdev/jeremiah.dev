import { InternalGithubProject } from "@/types/github"
import { Languages } from "@/types/languages"
import { Project } from "@/types/project"
import { RawGithubLanguages } from "@/types/github";

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

export function parseLanguages(languages?: RawGithubLanguages): Languages {
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

export function parseProject(project: InternalGithubProject): Project {
    const languages = parseLanguages(project.languages);
    const parsedProject: Project = {
        name: project.name,
        description: project.description ?? "",
        summary: project.description ?? "",
        icon: project.image ? { src: project.image, alt:project.name.split("-").map(e=>e[0].toUpperCase()).join("")} : undefined,
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
