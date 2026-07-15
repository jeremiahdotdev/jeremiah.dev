"use client"

import { Project } from "@/types/project";
import { memo, FC } from "react"
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/components/ui/carousel";
import ProjectCard from "./project-card";

interface ProjectCardProps {
    projects: Project[];
    handleClick?: (href: string) => void;
}
  
const ProjectCardList: FC<ProjectCardProps> = ({ projects, handleClick }: ProjectCardProps) => {
    return (
        <Carousel
            opts={{
                align: "start",
                loop: false,
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-6 items-stretch px-6 py-3">
                {projects.map((project) => (
                    <CarouselItem
                        key={project.name}
                        className="basis-[84vw] pl-6 sm:basis-[32rem]"
                    >
                        <ProjectCard handleClick={handleClick} project={project} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselDots label="Show project group" />
        </Carousel>
    );
};

export default memo(ProjectCardList);
