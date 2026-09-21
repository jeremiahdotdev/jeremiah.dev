"use client";

import type { ReactNode } from "react";
import { useDictionary } from "@/components/content/content-provider";
import { Typography } from "@/components/ui/typography";
import type { Project } from "@/types/project";
import ProjectPreview from "./project-preview";
import ProjectLanguageMeter from "./project-language-meter";
import ProjectLinks from "./project-links";
import SectionHeading from "@/components/shared/section-heading";
import { splitProjectDescription } from "@/lib/project-description";
import ProjectStatusBadge from "./project-status-badge";
import ProjectTitle from "./project-title";
import ProjectBadgeLabel from "./project-badge-label";

interface ProjectCardProps {
  project: Project;
  index?: number;
  total?: number;
  moving?: boolean;
  mobileNavigation?: ReactNode;
}

export default function ProjectCard({ project, index = 0, total = 1, moving = false, mobileNavigation }: ProjectCardProps) {
  const { projects: labels } = useDictionary();
  const technologies = [...new Set(project.topics ?? [])].slice(0, 6);
  const languages = project.languages ?? [];
  const { description, summary, badges } = project;
  const { intro, remainder } = splitProjectDescription(description);
  const productSummary = intro && summary.startsWith(intro) ? summary.slice(intro.length).trim() : summary;
  const hasSummary = productSummary && productSummary !== remainder;
  const heading = <SectionHeading as="h2" label={labels.heading} metadata={`${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`} />;

  return (
    <article className="mx-auto grid w-full content-start items-start gap-x-8 gap-y-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.85fr)] lg:content-stretch lg:gap-x-10 xl:gap-x-14">
      <div className="block lg:hidden">{heading}</div>
      <div className="min-w-0 max-md:self-stretch lg:flex lg:self-stretch">
        <ProjectPreview project={project} moving={moving} />
      </div>
      <div className="min-w-0">
        {mobileNavigation && <div className="lg:hidden">{mobileNavigation}</div>}
        <header className="flex flex-col gap-3 border-b border-foreground/40 pb-5">
            <div className="hidden lg:block">{heading}</div>
            <ProjectTitle name={project.name} />
            {intro && (
              <Typography variant="intro">{intro}</Typography>
            )}
        </header>
        <div className="flex flex-col pt-4 gap-4">
          {badges.map((label) => (
            <div key={`status-${label}`} className="min-w-0 max-w-full">
              <ProjectStatusBadge label={label} />
            </div>
          ))}
          {remainder && (
            <Typography variant="body">{remainder}</Typography>
          )} 
          {hasSummary && (
            <>
              <Typography as="h4" variant="eyebrow">{labels.product}</Typography>
              <Typography variant="body">{productSummary}</Typography>
            </>
          )}
          {(badges.length > 0 || technologies.length > 0 || languages.length > 0) && (
            <>
              <Typography as="h4" variant="eyebrow">{labels.topics}</Typography>
              {(badges.length > 0 || technologies.length > 0) && (
                <ul className="inline-flex flex-nowrap gap-1">
                  {technologies.map((technology) => (
                    <li key={technology} className="flex min-w-0 max-w-full items-center rounded-full bg-foreground/10 px-3 py-2">
                      <ProjectBadgeLabel label={technology.replace(/-/g, " ")} />
                    </li>
                  ))}
                </ul>
              )}
              {languages.length > 0 && (
                <ProjectLanguageMeter languages={languages} />
              )}
            </>
          )}
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}
