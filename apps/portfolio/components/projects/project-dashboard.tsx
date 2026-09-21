"use client";

import { useEffect, useEffectEvent, useState } from "react";
import type { Project } from "@/types/project";
import { useDictionary } from "@/components/content/content-provider";
import { Carousel, CarouselContent, CarouselItem, CarouselNavigation, type CarouselApi } from "@/components/ui/carousel";
import ProjectCard from "./project-card";
import { formatTemplate } from "@/lib/format-template";

export default function ProjectDashboard({ projects }: { projects: Project[] }) {
  const { projects: labels, carousel } = useDictionary();
  const projectNames = projects.map(({ name }) => name);
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [moving, setMoving] = useState(false);
  const syncSelection = useEffectEvent(() => {
    setSelected(api?.selectedScrollSnap() ?? 0);
  });

  useEffect(() => {
    if (!api) return;
    let movementTimer = 0;
    const onSelect = () => syncSelection();
    const onSettle = () => {
      window.clearTimeout(movementTimer);
      setMoving(false);
    };
    const onMove = () => {
      setMoving(true);
      window.clearTimeout(movementTimer);
      movementTimer = window.setTimeout(onSettle, 150);
    };
    api.on("select", onSelect);
    api.on("scroll", onMove);
    api.on("settle", onSettle);
    api.on("reInit", onSettle);
    api.on("reInit", onSelect);
    const frame = window.requestAnimationFrame(onSelect);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(movementTimer);
      api.off("select", onSelect);
      api.off("scroll", onMove);
      api.off("settle", onSettle);
      api.off("reInit", onSettle);
      api.off("reInit", onSelect);
    };
  }, [api]);

  if (!projects.length) return null;

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "start", loop: true }}
      aria-label={labels.heading}
      className="flex w-full flex-1 flex-col"
    >
      <div className="flex flex-1 flex-col justify-start py-2 lg:justify-center">
        <CarouselContent className="ml-0 gap-8 lg:gap-16 lg:flex-1" viewportClassName="px-0 py-4 lg:flex lg:flex-1 lg:flex-col" fadeEdges={false}>
          {projects.map((project, index) => (
            <CarouselItem key={project.link.href} className="flex items-start px-5 sm:px-8 lg:items-stretch lg:px-10 xl:px-12" aria-label={formatTemplate(carousel.position, { index: index + 1, total: projects.length })} inert={index !== selected}>
              <ProjectCard
                project={project}
                index={index}
                total={projects.length}
                moving={moving}
                mobileNavigation={<CarouselNavigation itemLabel={labels.item} itemNames={projectNames} />}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </div>
      <div className="hidden lg:block">
        <CarouselNavigation
          itemLabel={labels.item}
          itemNames={projectNames}
          className="mx-auto shrink-0 px-5 sm:px-8 lg:px-10 xl:px-12"
        />
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{formatTemplate(labels.announcement, { index: selected + 1, total: projects.length, project: projects[selected]?.name ?? "" })}</span>
    </Carousel>
  );
}
