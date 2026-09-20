"use client";

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
  "[--career-accent:153_30%_35%] dark:[--career-accent:151_30%_62%]",
  "[--career-accent:208_38%_42%] dark:[--career-accent:208_42%_66%]",
  "[--career-accent:12_35%_45%] dark:[--career-accent:12_40%_66%]",
];

export default function Timeline({ milestones, skills }: { milestones: CareerMilestone[]; skills: Skill[] }) {
  const $t = useDictionary();

  if (!milestones.length) return null;

  return (
    <>
      <Carousel opts={{ align: "start", loop: false }} aria-label={$t.career.timeline.label} className="shrink-0 text-foreground">
        <CarouselContent className="items-stretch" viewportClassName="px-1 pb-1" fadeEdges={false}>
          {milestones.map((milestone, index) => (
            <CarouselItem key={milestone.id} aria-label={formatTemplate($t.career.timeline.roleAria, { role: milestone.role.title, employer: milestone.role.employer })} className={cn("flex basis-[90%] flex-col sm:basis-[clamp(15rem,calc(13.5rem_+_6.75vw),18rem)]", accents[milestone.employerIndex % accents.length])}>
              <div className="relative flex h-20 shrink-0 flex-col items-center pt-2">
                <Typography as="span" variant="detail-label">{milestone.year}</Typography>
                <span aria-hidden="true" className={cn("absolute -left-4 right-0 top-12 h-px bg-career-accent/65", index === 0 && "left-1/2", index === milestones.length - 1 && "right-1/2")} />
                <span aria-hidden="true" className="absolute top-9 flex size-6 items-center justify-center rounded-full border border-career-accent bg-background">
                  <span className="size-3 rounded-full bg-career-accent" />
                </span>
                <span aria-hidden="true" className="absolute bottom-0 top-[3.75rem] border-l border-dashed border-career-accent/65" />
              </div>
              <CareerMilestoneCard milestone={milestone} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNavigation itemLabel={$t.career.timeline.item} className="mt-2 shrink-0 px-1" />
      </Carousel>
      <div className="shrink-0">
        <CareerSkills skills={skills} />
      </div>
    </>
  );
}
