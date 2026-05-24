"use client"
import { Project } from "@/types/project";
import { memo, useMemo, FC, useState, useCallback } from "react"
import ProjectCardList from "./project-card-list";
import { Info as InfoIcon } from "lucide-react"
import ProjectDrawer from "./project-drawer";
import MobileTabletOnly from "../breakpoints/mobile-tablet-only";
import ProjectDisplay from "./project-display";
import { getDictionary } from "@/dictionaries";
import { ClickTooltip } from "../shared/click-tooltip";
import { TypographyP } from "../ui/typography";

interface ProjectDashboardProps {
    projects: Project[];
}
  
const ProjectDashboard: FC<ProjectDashboardProps> = ({ projects }: ProjectDashboardProps) => {
    const $t = getDictionary();
    const [selectedProject, setSelectedProject] = useState<Project>()
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>()

    const selectProject = useCallback((project: Project)=>{
        setIsDrawerOpen(true)
        setSelectedProject(project)
    }, [setSelectedProject, setIsDrawerOpen])
    
    // Memoized component
    const content = useMemo(() => (
        <div className="h-page-content max-h-page-content w-full flex flex-1 flex-col overflow-hidden rounded-md bg-dashboard shadow-inner border dark:border-border">
            <div className="min-h-14 p-4 flex items-center justify-between gap-4 bg-dashboard-header border-b border-dashboard-header shadow-xl dark:border-border">
                <TypographyP variant="dashboard">
                    ({$t.projects.instruction})
                </TypographyP>
                <ClickTooltip tooltip={$t.projects.info} className="font-serif tracking-tight">
                    <InfoIcon className="cursor-pointer hover:text-muted-foreground"/>
                </ClickTooltip>
            </div>
            <div className="min-h-0 w-full flex flex-1 flex-col lg:flex-row">
                <div className="min-h-0 w-full flex-1 lg:hidden">
                    <ProjectCardList orientation="horizontal" projects={projects} handleClick={selectProject} />
                </div>
                <div className="hidden h-full min-h-0 shrink-0 lg:flex lg:w-80 xl:w-96 2xl:w-96">
                    <ProjectCardList orientation="vertical" projects={projects} handleClick={selectProject} />
                </div>
                <div className="m-4 hidden min-h-0 flex-1 lg:flex">
                    <ProjectDisplay project={selectedProject}/>
                </div>
            </div>
            <MobileTabletOnly>
                <ProjectDrawer openState={!!isDrawerOpen} setIsOpen={setIsDrawerOpen}>
                    <div className="h-full w-full flex py-2 gap-4 flex-col">
                        <ProjectDisplay project={selectedProject}/>
                    </div>
                </ProjectDrawer>
            </MobileTabletOnly>
        </div>
    ), [$t, projects, selectedProject, isDrawerOpen, selectProject, setIsDrawerOpen]);

    return (content);
};

export default memo(ProjectDashboard);
