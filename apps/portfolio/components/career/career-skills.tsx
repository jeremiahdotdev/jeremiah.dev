"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Typography } from "@/components/ui/typography";
import { useDictionary } from "@/components/content/content-provider";
import { formatTemplate } from "@/lib/format-template";
import type { Skill } from "@/types/skill";
import SkillCard from "./skill-card";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const carouselOptions = { align: "start" as const, loop: true, slidesToScroll: 3 };

function subscribeToReducedMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function getDocumentVisibility() {
  return document.visibilityState === "visible";
}

export default function CareerSkills({ skills, autoPlay = true }: { skills: Skill[]; autoPlay?: boolean }) {
  const $t = useDictionary();
  const rootRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, () => true);
  const documentVisible = useSyncExternalStore(subscribeToVisibility, getDocumentVisibility, () => false);
  const automaticallyAdvancing = autoPlay && inView && documentVisible && !reducedMotion && !paused && !hovered && !focused;
  const advance = useEffectEvent(() => {
    if (!api || api.scrollSnapList().length <= 1) return;
    if (api.canScrollNext()) api.scrollNext();
    else api.scrollTo(0);
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [skills.length]);

  useEffect(() => {
    if (!api || !automaticallyAdvancing) return;
    const interval = window.setInterval(advance, 4000);
    return () => window.clearInterval(interval);
  }, [api, automaticallyAdvancing]);

  if (skills.length === 0) return null;

  return (
    <Carousel
      ref={rootRef}
      opts={carouselOptions}
      setApi={setApi}
      aria-label={$t.career.skills.label}
      className="min-w-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div className="flex min-h-10 items-center hxl:min-h-16">
        <div className="shrink-0 pr-4">
          <Typography as="span" variant="label">
            {$t.career.skills.heading}
          </Typography>
        </div>
        <div aria-hidden="true" className="h-px min-w-4 flex-1 bg-foreground/30" />
        {autoPlay && !reducedMotion && skills.length > 1 && (
          <button
            type="button"
            aria-label={paused ? $t.career.skills.play : $t.career.skills.pause}
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
            className="flex size-11 shrink-0 items-center justify-end rounded-sm p-0 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
          >
            {paused && <Play aria-hidden="true" className="size-7" strokeWidth={1.5} />}
            {!paused && <Pause aria-hidden="true" className="size-7" strokeWidth={1.5} />}
          </button>
        )}
      </div>
      <CarouselContent
        fadeEdges={false}
        viewportClassName="pl-5 pr-0 py-0 hlg:py-6 h2xl:py-8"
        aria-live={automaticallyAdvancing ? "off" : "polite"}
      >
        {skills.map((skill, index) => (
          <CarouselItem key={`${index}-${skill.subtitle}`} className="mr-5 flex min-w-20 basis-24 pl-0 sm:basis-32" aria-label={formatTemplate($t.carousel.position, { index: index + 1, total: skills.length })}>
            <SkillCard skill={skill} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNavigation
        itemLabel={$t.career.skills.item}
        itemNames={skills
          .filter((_, index) => index % carouselOptions.slidesToScroll === 0)
          .map((_, index) => skills
            .slice(index * carouselOptions.slidesToScroll, (index + 1) * carouselOptions.slidesToScroll)
            .map((skill) => skill.subtitle)
            .join(", "))}
      />
    </Carousel>
  );
}
