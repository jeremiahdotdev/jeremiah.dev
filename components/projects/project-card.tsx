import { Project } from "@/types/project";
import { memo, useMemo, FC, useCallback, KeyboardEvent } from "react"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ProjectAvatar from "./project-avatar";
import BadgeList from "../shared/badge-list";
import { useDictionary } from "@/components/content/content-provider";
import { GitBranch, Lock } from "lucide-react"
import { twMerge } from "tailwind-merge";
import { HoverTooltip } from "../shared/hover-tooltip";
import { Progress } from "../ui/progress";
import { TypographySmall } from "../ui/typography";

interface ProjectCardProps {
    project: Project;
    handleClick: (project: Project) => void
}
  
const ProjectCard: FC<ProjectCardProps> = ({ project, handleClick }: ProjectCardProps) => {
    const $t = useDictionary();
    const badges = project.topics?.map(el =>({ subtitle: el}))
    const linkStyle = "absolute right-3 top-3 z-10 flex min-h-11 items-center gap-1 text-sm font-tight font-serif text-blue-800 dark:text-blue-200"

    const onSelect = useCallback(()=>{
        handleClick(project)
    }, [handleClick, project])

    const onSelectWithKeyboard = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            handleClick(project)
        }
    }, [handleClick, project])

    // Memoized GitHub link component
    const link = useMemo(() => (
        project?.private 
            ? (
                <HoverTooltip tooltip={$t.projects.github.private} className={twMerge(linkStyle, "opacity-40")}>
                    {$t.projects.github.link}
                    <Lock size={16} />
                </HoverTooltip>
              )
            : (
                <HoverTooltip tooltip={$t.projects.github.public} asChild>
                    <a
                        href={project?.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.name} on GitHub`}
                        onClick={(event) => event.stopPropagation()}
                        className={twMerge(linkStyle, "hover:underline")}
                    >
                        {$t.projects.github.link}
                        <GitBranch size={16} />
                    </a>
                </HoverTooltip>
            )
    ), [$t, project]);

    // Memoized languages component
    const languages = useMemo(() => project?.languages 
        ?  Object.entries(project.languages).map(([key, value]) => (
            <div key={key} className="w-full space-y-1">
                <div className="flex justify-between text-xs">
                    <span className="font-medium">{key}</span>
                    <span className="text-foreground">{value}%</span>
                </div>
                <Progress value={value} aria-label={`${project.name} ${key} usage`} className="h-1" />
            </div>
        )) : null
    , [project]);

    // Memoized component
    const content = useMemo(() => (
        <Card
            role="button"
            tabIndex={0}
            aria-label={`View details for ${project.name}`}
            onClick={onSelect}
            onKeyDown={onSelectWithKeyboard}
            className="rounded-xl hover:cursor-pointer hover:shadow-outer h-full max-h-full w-full flex flex-col overflow-hidden relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
            <CardHeader className="min-h-64 px-5 pb-4 pt-5 lg:min-h-0">
                {link}
                <div className="flex min-h-44 w-full flex-col items-start rounded-md text-left">
                    <CardTitle className="w-full">
                        <span className="flex min-w-0 max-w-full items-center gap-3 py-1 pr-20 tracking-tight font-mono">
                            <span className="shrink-0">
                                <ProjectAvatar icon={project.icon}/>
                            </span>
                            <span className="min-w-0 max-w-full break-words [overflow-wrap:anywhere]">
                                {project.name}    
                            </span>
                        </span>
                    </CardTitle>
                    <CardDescription className="mb-2 text-foreground">{project.description}</CardDescription>
                    <BadgeList badges={badges}/>
                </div>
            </CardHeader>
            {languages && (
                <div className="bg-card rounded-b-xl border-t p-4 0">
                    <TypographySmall variant="label" className="mb-3">{$t.projects.languages}</TypographySmall>
                    <div className="w-full flex flex-col gap-2">
                        {languages}
                    </div>
                </div>
            )}
        </Card>
    ), [project, onSelect, onSelectWithKeyboard, badges, link, languages, $t]);

    return (content);
};

export default memo(ProjectCard);
