"use client";

import { Project } from "@/types/project";
import { CSSProperties, FC, memo } from "react";
import { ExternalLink, Lock } from "lucide-react";
import { twMerge } from "tailwind-merge";

import { Card } from "@/components/ui/card";
import { TypographyH3, TypographyP, TypographySmall } from "@/components/ui/typography";
import { useDictionary } from "@/components/content/content-provider";
import ProjectAvatar from "./project-avatar";
import ProjectLanguageMeter from "./project-language-meter";
import ProjectTopicBadgeList from "./project-topic-badge-list";

interface ProjectCardProps {
  project: Project;
  handleClick?: (project: Project) => void;
}

const linkClassName =
  "portfolio-url inline-flex items-center gap-1 transition-opacity hover:opacity-75";

function ProjectCardLink({
  href,
  label,
  ariaLabel,
  title,
  className,
  iconSize = 13,
}: {
  href: string;
  label: string;
  ariaLabel: string;
  title?: string;
  className?: string;
  iconSize?: number;
}) {
  return <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} title={title} onClick={(event) => event.stopPropagation()} className={twMerge(linkClassName, className)}>
    {label}
    <ExternalLink size={iconSize} />
  </a>;
}

function getTitleSize(name: string) {
  return name.length > 22 ? "clamp(1rem, 5vw, 1.25rem)" : "clamp(1.25rem, 5vw, 1.5rem)";
}

const ProjectCard: FC<ProjectCardProps> = ({ project, handleClick }) => {
  const $t = useDictionary();

  const topics = project.topics ?? [];
  const languageEntries = project.languages ?? [];
  const primaryLanguageColor = languageEntries[0]?.color;

  const hasTopics = topics.length > 0;
  const isSelectable = !!handleClick;

  const projectLabel = (template: string) =>
    template.replace("{project}", project.name);

  const themeStyle = {
    "--portfolio-card-image": project.theme?.cardSrc
      ? `url("${project.theme.cardSrc}")`
      : "none",
    "--portfolio-card-dark-image": project.theme?.cardDarkSrc
      ? `url("${project.theme.cardDarkSrc}")`
      : project.theme?.cardSrc
        ? `url("${project.theme.cardSrc}")`
        : "none",
    "--portfolio-url-color": primaryLanguageColor,
  } as CSSProperties;

  const cardClassName = twMerge(
    "relative flex h-full w-full overflow-hidden rounded-2xl border border-border bg-card",
    isSelectable && "hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  );

  const githubLink = project.private ? (
    <span
      title={$t.projects.github.privateTitle}
      className={twMerge(linkClassName, "opacity-50")}
    >
      {$t.projects.github.link}
      <Lock size={13} />
    </span>
  ) : (
    <ProjectCardLink
      href={project.link.href}
      label={$t.projects.github.link}
      ariaLabel={projectLabel($t.projects.github.projectAria)}
      title={$t.projects.github.sourceTitle}
    />
  );

  const demoLink = project.demo ? (
    <ProjectCardLink
      href={project.demo.href}
      label={$t.projects.demo.link}
      ariaLabel={projectLabel($t.projects.demo.aria)}
      className="shrink-0"
      iconSize={14}
    />
  ) : null;

  return (
    <Card
      role={isSelectable ? "button" : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      aria-label={
        isSelectable ? projectLabel($t.projects.github.detailsAria) : undefined
      }
      onClick={handleClick ? () => handleClick(project) : undefined}
      onKeyDown={
        handleClick
          ? (event) => {
              if (event.key !== "Enter" && event.key !== " ") return;

              event.preventDefault();
              handleClick(project);
            }
          : undefined
      }
      style={themeStyle}
      data-portfolio-theme={project.name}
      className={cardClassName}
    >
      {project.theme?.css && (
        <style>{project.theme.css}</style>
      )}
      <div className="portfolio-card-background absolute inset-0" />
      <div className="relative z-10 flex min-h-full w-full flex-col">
        <div className="flex flex-1 flex-col p-5">
          <header className="mb-4 flex items-start gap-3">
            <span className="shrink-0">
              <ProjectAvatar icon={project.icon} />
            </span>
            <div className="min-w-0">
              <TypographyH3
                className="break-words leading-tight"
                style={{ fontSize: getTitleSize(project.name) }}
              >
                {project.name}
              </TypographyH3>
            </div>
          </header>
          <div className="portfolio-surface rounded-md p-4">
            <TypographyP>{project.description}</TypographyP>
          </div>
          {(hasTopics || languageEntries.length > 0) && (
            <section className="mt-auto grid grid-cols-2 items-center gap-5 pt-5">
              {hasTopics && (
                <ProjectTopicBadgeList
                  topics={topics}
                  surfaceClassName="portfolio-surface"
                />
              )}
              {languageEntries.length > 0 && (
                <div className={twMerge("flex justify-center", !hasTopics && "col-start-2")}>
                  <ProjectLanguageMeter languages={languageEntries} />
                </div>
              )}
            </section>
          )}
        </div>
        <footer className="portfolio-footer relative overflow-hidden border-t border-border px-5 py-4">
          <div className="portfolio-footer-surface absolute inset-0 rounded-b-[1rem]" />
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="portfolio-footer-surface flex size-10 shrink-0 items-center justify-center rounded-md text-md">
                {"</>"}
              </div>
              <div className="flex min-w-0 flex-col justify-center gap-1">
                <TypographySmall>{$t.projects.repository}</TypographySmall>
                {githubLink}
              </div>
            </div>
            <div className="flex shrink-0 items-center">{demoLink}</div>
          </div>
        </footer>
      </div>
    </Card>
  );
};

export default memo(ProjectCard);
