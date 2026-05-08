import { Project } from "@/types/project";
import { memo, useMemo, FC } from "react"
import ProjectCard from "./project-card";

interface ProjectCardProps {
    projects: Project[];
    handleClick: (project: Project) => void;
    orientation?: "vertical" | "horizontal";
}
  
const ProjectCardList: FC<ProjectCardProps> = ({ projects, handleClick, orientation = "horizontal" }: ProjectCardProps) => {
    const isVertical = orientation === "vertical";
    const cardClassName = isVertical
        ? "flex w-full flex-shrink-0"
        : "flex h-[32rem] max-h-[32rem] flex-shrink-0 w-80 sm:w-96 lg:h-auto lg:max-h-none lg:w-80 xl:w-96";
    const listClassName = isVertical
        ? "flex min-h-full flex-col gap-4 p-4"
        : "flex min-h-full flex-row items-center gap-4 px-4 py-4";
    const scrollClassName = isVertical
        ? "h-full min-h-0 w-full overflow-y-auto overflow-x-hidden"
        : "h-full min-h-0 w-full overflow-x-auto overflow-y-hidden";

    // Memoized component
    const content = useMemo(() => (
        <div className={scrollClassName}>
            <div className={listClassName}>
                {projects.map((project: Project) => (
                    <div key={project.name} className={cardClassName}>
                        <ProjectCard handleClick={handleClick} project={project} />
                    </div>
                ))}
            </div>
        </div>
    ), [projects, handleClick, cardClassName, listClassName, scrollClassName]);
    return (content);
};

export default memo(ProjectCardList);
