"use client";

import { useLayoutEffect, useRef } from "react";
import type { Skill } from "@/types/skill";
import type { CareerMilestone } from "@/lib/career-milestones";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { useDictionary } from "@/components/content/content-provider";
import { formatTemplate } from "@/lib/format-template";
import { Carousel, CarouselContent, CarouselItem, CarouselNavigation } from "@/components/ui/carousel";
import CareerMilestoneCard from "./career-milestone-card";
import CareerSkills from "./career-skills";

const accents = [
  "career-accent-green",
  "career-accent-blue",
  "career-accent-terracotta",
];

export default function Timeline({ milestones, skills }: { milestones: CareerMilestone[]; skills: Skill[] }) {
  const $t = useDictionary();
  const timelineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    let disposed = false;
    const titles = Array.from(timeline.querySelectorAll<HTMLElement>("[data-role-title]"));

    function syncTitleWrapping() {
      if (disposed || !timeline) return;
      // Measure the unbroken text so forcing a line break cannot toggle wrapping back off.
      const shouldWrap = titles.some((title) => {
        const text = title.querySelector<HTMLElement>("[data-role-title-measure]");
        const width = title.getBoundingClientRect().width;
        return width > 0 && Boolean(text && text.getBoundingClientRect().width > width);
      });
      timeline.dataset.wrapTitles = String(shouldWrap);
    }

    syncTitleWrapping();
    const observer = new ResizeObserver(syncTitleWrapping);
    titles.forEach((title) => observer.observe(title));
    window.addEventListener("resize", syncTitleWrapping);
    document.fonts.addEventListener("loadingdone", syncTitleWrapping);
    void document.fonts.ready.then(syncTitleWrapping);

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("resize", syncTitleWrapping);
      document.fonts.removeEventListener("loadingdone", syncTitleWrapping);
    };
  }, [milestones]);

  if (!milestones.length) return null;

  return (
    <>
      <Carousel opts={{ align: "start", loop: false }} aria-label={$t.career.timeline.label} className="shrink-0 text-foreground">
        <CarouselContent ref={timelineRef} className="group/timeline -ml-2 items-stretch" viewportClassName="pb-1 pl-3 pr-1" fadeEdges={false}>
          {milestones.map((milestone, index) => (
            <CarouselItem key={milestone.id} aria-label={formatTemplate($t.career.timeline.roleAria, { role: milestone.role.title, employer: milestone.role.employer })} className={cn("flex basis-[90%] flex-col pl-2 sm:basis-64 lg:basis-72 hxl:lg:basis-80 h2xl:sm:basis-80", accents[milestone.employerIndex % accents.length])}>
              <div className="relative flex h-16 shrink-0 flex-col items-center pt-2 hlg:h-20">
                <Typography as="span" variant="eyebrow">{milestone.year}</Typography>
                <span aria-hidden="true" className={cn("absolute -left-2 right-0 top-12 h-px bg-career-accent/65", index === 0 && "left-1/2", index === milestones.length - 1 && "right-1/2")} />
                <span aria-hidden="true" className="absolute top-9 flex size-6 items-center justify-center rounded-full border border-career-accent bg-background">
                  <span className="size-3 rounded-full bg-career-accent" />
                </span>
                <span aria-hidden="true" className="absolute bottom-0 top-[60px] border-l border-dashed border-career-accent/65" />
              </div>
              <CareerMilestoneCard milestone={milestone} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNavigation itemLabel={$t.career.timeline.item} className="mt-2 shrink-0 px-1" />
      </Carousel>
      <CareerSkills skills={skills} />
    </>
  );
}
