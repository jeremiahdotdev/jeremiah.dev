"use client"
import { Project } from "@/types/project";
import { memo, FC } from "react"
import ProjectCardList from "./project-card-list";
import ProjectCard from "./project-card";
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/components/ui/carousel";

interface ProjectDashboardProps {
    projects: Project[];
}

function chunkProjects(projects: Project[], size: number) {
    const pages: Project[][] = [];

    for (let index = 0; index < projects.length; index += size) {
        pages.push(projects.slice(index, index + size));
    }

    return pages;
}
  
const ProjectDashboard: FC<ProjectDashboardProps> = ({ projects }: ProjectDashboardProps) => {
    function handleOpenProject(href: string) {
        window.open(href, "_blank", "noopener,noreferrer");
    }

    const mediumPages = chunkProjects(projects, 4);
    const extraLargePages = chunkProjects(projects, 6);

    return (
        <>
            <div className="hidden w-full md:block xl:hidden">
                <Carousel
                    opts={{
                        align: "center",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-8 px-6 py-3 lg:px-10">
                        {mediumPages.map((page, pageIndex) => (
                            <CarouselItem key={`md-page-${pageIndex}`} className="basis-full pl-8">
                                <div className="grid grid-cols-2 gap-x-10 gap-y-14">
                                    {page.map((project) => (
                                        <ProjectCard
                                            key={project.name}
                                            project={project}
                                            handleClick={handleOpenProject}
                                        />
                                    ))}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {mediumPages.length > 1 && <CarouselDots label="Show project page" />}
                </Carousel>
            </div>
            <div className="hidden w-full xl:block">
                <Carousel
                    opts={{
                        align: "center",
                        loop: false,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-8 px-14 py-3">
                        {extraLargePages.map((page, pageIndex) => (
                            <CarouselItem key={`xl-page-${pageIndex}`} className="basis-full pl-8">
                                <div className="grid grid-cols-3 gap-x-10 gap-y-14">
                                    {page.map((project) => (
                                        <ProjectCard
                                            key={project.name}
                                            project={project}
                                            handleClick={handleOpenProject}
                                        />
                                    ))}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {extraLargePages.length > 1 && <CarouselDots label="Show project page" />}
                </Carousel>
            </div>
            <div className="relative w-full overflow-x-hidden md:hidden">
                <ProjectCardList projects={projects} handleClick={handleOpenProject} />
            </div>
        </>
    );
};

export default memo(ProjectDashboard);
