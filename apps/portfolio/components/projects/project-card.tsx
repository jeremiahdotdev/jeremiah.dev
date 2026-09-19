"use client";

import type { ReactNode } from "react";
import { useDictionary } from "@/components/content/content-provider";
import { Typography } from "@/components/ui/typography";
import type { Project } from "@/types/project";
import ProjectPreview from "./project-preview";
import ProjectLanguageMeter from "./project-language-meter";
import ProjectLinks from "./project-links";
import SectionHeading from "@/components/shared/section-heading";
import { parseProjectDescription, splitProjectDescription } from "@/lib/project-description";
import ProjectStatusBadge from "./project-status-badge";
import ProjectTitle from "./project-title";

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
  const { description, badges } = parseProjectDescription(project.description);
  const { description: summary } = parseProjectDescription(project.summary);
  const { intro, remainder } = splitProjectDescription(description);
  const productSummary = intro && summary.startsWith(intro) ? summary.slice(intro.length).trim() : summary;
  const hasSummary = productSummary && productSummary !== remainder;
  const heading = <SectionHeading as="h2" label={labels.heading} metadata={`${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`} />;

  return (
    <article className="mx-auto grid w-full max-w-project items-start gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.85fr)] lg:gap-x-10 xl:gap-x-14 max-md:min-h-[calc(100svh-126px)] max-md:grid-rows-[auto_auto_1fr]">
      <div className="block lg:hidden">{heading}</div>
      <div className="min-w-0 max-md:self-stretch lg:flex lg:self-stretch">
        <ProjectPreview project={project} moving={moving} />
      </div>
      <div className="min-w-0 py-1">
        {mobileNavigation && <div className="lg:hidden">{mobileNavigation}</div>}
        <header>
          <div className="hidden lg:block">{heading}</div>
          <div className="mt-5 border-b border-foreground/40 pb-5">
            <ProjectTitle name={project.name} />
            {intro && (
              <div className="mt-3">
                <Typography variant="project-intro">{intro}</Typography>
              </div>
            )}
          </div>
        </header>
        {remainder && (
          <div className="mt-5">
            <Typography variant="body-muted">{remainder}</Typography>
          </div>
        )}
        <div className="mt-7 space-y-7 lg:mt-8 lg:space-y-8">
          {hasSummary && (
            <div>
              <Typography as="h4" variant="detail-label">{labels.product}</Typography>
              <div className="mt-3">
                <Typography variant="body">{productSummary}</Typography>
              </div>
            </div>
          )}
          {(badges.length > 0 || technologies.length > 0 || languages.length > 0) && (
            <div>
              <Typography as="h4" variant="detail-label">{labels.topics}</Typography>
              {(badges.length > 0 || technologies.length > 0) && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {badges.map((label) => (
                    <li key={`status-${label}`}>
                      <ProjectStatusBadge label={label} />
                    </li>
                  ))}
                  {technologies.map((technology) => (
                    <li key={technology} className="rounded-full bg-foreground/10 px-4 py-2">
                      <Typography as="span" variant="caption">{technology.replace(/-/g, " ")}</Typography>
                    </li>
                  ))}
                </ul>
              )}
              {languages.length > 0 && (
                <div className="mt-5">
                  <ProjectLanguageMeter languages={languages} />
                </div>
              )}
            </div>
          )}
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}
