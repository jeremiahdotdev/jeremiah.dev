"use client";

import { type FC, memo } from "react";
import { ExternalLink, Lock } from "lucide-react";

import { useDictionary } from "@/components/content/content-provider";
import ProjectLanguageMeter from "./project-language-meter";
import { Project } from "@/types/project";
import ProjectPreview from "./project-preview";

interface ProjectCardProps {
  project: Project;
  handleClick?: (href: string) => void;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, handleClick }) => {
  const $t = useDictionary();

  const isSelectable = !!handleClick;
  const clickHref = project.demo?.href ?? project.link.href;

  const projectLabel = (template: string) =>
    template.replace("{project}", project.name);

  const previewPanel = <ProjectPreview project={project} isSelectable={isSelectable} />;

  const cardContent = (
    <div className="flex flex-1 flex-col px-2 sm:px-1">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-2xl font-semibold tracking-tight text-foreground">
              {project.name}
            </h3>
          </div>
        </div>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      </div>
      <div className="mt-auto space-y-3 pt-4">
        {project.languages?.length && (
          <ProjectLanguageMeter languages={project.languages} />
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-muted-foreground">
          {project.private ? (
            <span
              title={$t.projects.github.privateTitle}
              className="inline-flex items-center gap-1.5 opacity-70"
            >
              <Lock size={14} />
              {$t.projects.github.link}
            </span>
          ) : (
            <a
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={projectLabel($t.projects.github.projectAria)}
              title={$t.projects.github.sourceTitle}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
            >
              {$t.projects.github.link}
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );

  if (!isSelectable) {
    return (
      <article className="flex h-full w-full flex-col gap-6">
        {previewPanel}
        {cardContent}
      </article>
    );
  }

  return (
    <article className="flex h-full w-full flex-col gap-6">
      <button
        type="button"
        onClick={() => handleClick(clickHref)}
        aria-label={projectLabel($t.projects.github.detailsAria)}
        className="group text-left transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
      >
        {previewPanel}
      </button>
      {cardContent}
    </article>
  );
};

export default memo(ProjectCard);
