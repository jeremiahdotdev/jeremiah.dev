"use client"
import { Project } from "@/types/project";
import { memo, FC, useState } from "react"
import ProjectCardList from "./project-card-list";
import { Info as InfoIcon } from "lucide-react"
import ProjectDisplay from "./project-display";
import { useDictionary } from "@/components/content/content-provider";
import { ClickTooltip } from "../shared/click-tooltip";
import { TypographyP } from "../ui/typography";

interface ProjectDashboardProps {
    projects: Project[];
}
  
const ProjectDashboard: FC<ProjectDashboardProps> = ({ projects }: ProjectDashboardProps) => {
    const $t = useDictionary();
    const [selectedProject, setSelectedProject] = useState<Project>();

    return (
        <>
            <div className="hidden h-dashboard-content max-h-page-content w-full flex-1 flex-col overflow-hidden rounded-md border border-border bg-dashboard shadow-inner lg:flex">
                <div className="flex min-h-14 items-center justify-end gap-4 border-b border-border bg-dashboard-header p-4 shadow-xl">
                    <ClickTooltip tooltip={$t.projects.info} className="font-serif tracking-tight">
                        <InfoIcon className="cursor-pointer hover:text-muted-foreground"/>
                    </ClickTooltip>
                </div>
                <div className="flex min-h-0 w-full flex-1 flex-row">
                    <div className="flex min-h-0 w-[25rem] shrink-0 overflow-hidden border-r border-border">
                        <ProjectCardList orientation="vertical" projects={projects} handleClick={setSelectedProject} />
                    </div>
                    <div className="m-4 flex min-h-0 flex-1">
                        <ProjectDisplay project={selectedProject}/>
                    </div>
                </div>
            </div>
            <div className="relative flex min-h-page-content w-full flex-1 flex-col justify-center overflow-x-hidden lg:hidden">
                <ProjectCardList orientation="horizontal" projects={projects} />
            </div>
        </>
    );
};

export default memo(ProjectDashboard);
