"use client"

import { Project } from "@/types/project";
import { memo, FC } from "react"
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/components/ui/carousel";
import ProjectCard from "./project-card";

interface ProjectCardProps {
    projects: Project[];
    handleClick?: (project: Project) => void;
    orientation?: "vertical" | "horizontal";
}
  
const ProjectCardList: FC<ProjectCardProps> = ({ projects, handleClick, orientation = "horizontal" }: ProjectCardProps) => {
    const isVertical = orientation === "vertical";

    if (!isVertical) {
        return (
            <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="min-h-0 w-full"
            >
                <CarouselContent className="items-stretch px-4 py-4">
                    {projects.map((project) => (
                        <CarouselItem
                            key={project.name}
                            className="flex basis-[calc(100vw-2rem)] sm:basis-[24rem] lg:basis-[20rem] xl:basis-[24rem]"
                        >
                            <ProjectCard project={project} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselDots label="Show project group" />
            </Carousel>
        );
    }

    return (
        <div className="h-full min-h-0 w-full max-w-[25rem] overflow-y-auto overflow-x-hidden pb-6">
            <div className="flex min-h-full flex-col gap-4 p-4">
                {projects.map((project) => (
                    <div key={project.name} className="flex w-full shrink-0">
                        <ProjectCard handleClick={handleClick} project={project} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(ProjectCardList);
