import { Project } from "@/types/project";
import { memo, useMemo, FC, useCallback } from "react"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ProjectAvatar from "./project-avatar";
import BadgeList from "../shared/badge-list";
import { getDictionary } from "@/dictionaries";
import { GitBranch, Lock } from "lucide-react"
import { twMerge } from "tailwind-merge";
import { HoverTooltip } from "../shared/hover-tooltip";
import { Progress } from "../ui/progress";

interface ProjectCardProps {
    project: Project;
    handleClick: (project: Project) => void
}
  
const ProjectCard: FC<ProjectCardProps> = ({ project, handleClick }: ProjectCardProps) => {
    const $t = getDictionary();
    const badges = project.topics?.map(el =>({ subtitle: el}))
    const linkStyle = "text-sm font-tight font-serif flex gap-1 text-blue-600 absolute top-3 right-3"

    const onSelect = useCallback(()=>{
        handleClick(project)
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
                <HoverTooltip tooltip={$t.projects.github.public}>
                    <a href={project?.link.href} target="_blank" className={twMerge(linkStyle, "hover:underline")}>
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
                    <span className="text-gray-600">{value}%</span>
                </div>
                <Progress value={value} className="h-1" />
            </div>
        )) : null
    , [project]);

    // Memoized component
    const content = useMemo(() => (
        <Card onClick={onSelect} className="rounded-xl hover:cursor-pointer hover:shadow-outer h-full max-h-full w-full flex flex-col overflow-hidden relative">
            <CardHeader className="min-h-64 px-5 pb-4 pt-5 lg:min-h-0">
                {link}
                <CardTitle>
                    <div className="flex max-w-full items-center gap-3 py-1 pr-20 tracking-tight font-mono">
                        <ProjectAvatar icon={project.icon}/>
                        <span className="break-words lg:max-w-48">
                            {project.name}    
                        </span>
                    </div>
                </CardTitle>
                <CardDescription className="mb-2">{project.description}</CardDescription>
                <BadgeList badges={badges}/>
            </CardHeader>
            {languages && (
                <div className="bg-card rounded-b-xl p-4">
                    <h4 className="text-sm font-semibold font-serif mb-3">{$t.projects.languages}</h4>
                    <div className="w-full flex flex-col gap-2">
                        {languages}
                    </div>
                </div>
            )}
        </Card>
    ), [project, onSelect, badges, link, languages, $t]);

    return (content);
};

export default memo(ProjectCard);
