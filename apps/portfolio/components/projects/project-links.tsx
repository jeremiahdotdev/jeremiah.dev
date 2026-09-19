"use client";

import { ExternalLink, Github, Lock } from "lucide-react";
import { useDictionary } from "@/components/content/content-provider";
import { Typography } from "@/components/ui/typography";
import type { Project } from "@/types/project";
import { formatTemplate } from "@/lib/format-template";

const linkClass = "inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-foreground/50 px-2 text-center transition-colors hover:bg-foreground/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

export default function ProjectLinks({ project }: { project: Project }) {
  const { projects: labels } = useDictionary();
  const projectLabel = (template: string) => formatTemplate(template, { project: project.name });

  return (
    <div className="grid w-full auto-cols-fr grid-flow-col gap-2">
      {project.demo && (
        <a href={project.demo.href} target="_blank" rel="noopener noreferrer" aria-label={projectLabel(labels.demo.aria)} className={linkClass}>
          <Typography as="span" variant="caption">{labels.demo.link}</Typography>
          <ExternalLink aria-hidden="true" className="size-4 shrink-0" />
        </a>
      )}
      {project.private ? (
        <span title={labels.github.private} className="inline-flex min-h-11 min-w-0 items-center justify-center gap-1.5 px-2 text-center">
          <Lock aria-hidden="true" className="size-4 shrink-0" />
          <Typography as="span" variant="caption">{labels.github.privateTitle}</Typography>
        </span>
      ) : (
        <a href={project.link.href} target="_blank" rel="noopener noreferrer" aria-label={projectLabel(labels.github.projectAria)} title={labels.github.sourceTitle} className={linkClass}>
          <Typography as="span" variant="caption">{labels.github.link}</Typography>
          <Github aria-hidden="true" className="size-4 shrink-0" />
        </a>
      )}
    </div>
  );
}
