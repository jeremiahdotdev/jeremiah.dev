"use client";

import { useLayoutEffect, useRef, useState, type FC, memo } from "react";
import { ExternalLink, Lock } from "lucide-react";
import Image from "next/image";

import { useDictionary } from "@/components/content/content-provider";
import ProjectAvatar from "./project-avatar";
import ProjectLanguageMeter from "./project-language-meter";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  handleClick?: (href: string) => void;
}

function getProjectInitials(name: string) {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? "")
    .join("");
}

function getProjectHost(project: Project) {
  const href = project.demo?.href ?? project.link.href;

  try {
    return new URL(href).host.replace(/^www\./, "");
  } catch {
    return href;
  }
}

const PREVIEW_VIEWPORT_WIDTH = 1440;
const PREVIEW_VIEWPORT_HEIGHT = 1024;
const PREVIEW_SCALE = 0.5;

interface PreviewFrameLayout {
  offsetX: number;
  offsetY: number;
  scale: number;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, handleClick }) => {
  const [frameReady, setFrameReady] = useState(false);
  const [previewFrameLayout, setPreviewFrameLayout] =
    useState<PreviewFrameLayout>({
      offsetX: 0,
      offsetY: 0,
      scale: PREVIEW_SCALE,
    });
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const $t = useDictionary();

  const fallbackText = getProjectInitials(project.name);
  const host = getProjectHost(project);
  const isSelectable = !!handleClick;
  const demoHref = project.demo?.href;
  const canPreviewDemo = Boolean(demoHref);
  const clickHref = project.demo?.href ?? project.link.href;

  useLayoutEffect(() => {
    const previewViewport = previewViewportRef.current;

    if (!previewViewport) {
      return;
    }

    const previewViewportElement = previewViewport;

    function updatePreviewFrameLayout() {
      const { width, height } = previewViewportElement.getBoundingClientRect();

      if (!width || !height) {
        return;
      }

      const coverScale = Math.max(
        width / PREVIEW_VIEWPORT_WIDTH,
        height / PREVIEW_VIEWPORT_HEIGHT,
      );

      const nextLayout = {
        scale: coverScale,
        offsetX: (width - PREVIEW_VIEWPORT_WIDTH * coverScale) / 2,
        offsetY: (height - PREVIEW_VIEWPORT_HEIGHT * coverScale) / 2,
      };

      setPreviewFrameLayout((currentLayout) => {
        const layoutChanged =
          Math.abs(currentLayout.scale - nextLayout.scale) > 0.001 ||
          Math.abs(currentLayout.offsetX - nextLayout.offsetX) > 0.5 ||
          Math.abs(currentLayout.offsetY - nextLayout.offsetY) > 0.5;

        return layoutChanged ? nextLayout : currentLayout;
      });
    }

    updatePreviewFrameLayout();

    const resizeObserver = new ResizeObserver(updatePreviewFrameLayout);
    resizeObserver.observe(previewViewportElement);

    return () => resizeObserver.disconnect();
  }, []);

  const projectLabel = (template: string) =>
    template.replace("{project}", project.name);

  const previewPanel = (
    <div className="relative flex aspect-video flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl shadow-foreground/10">
      <div className="relative flex h-11 items-center border-b border-border/60 bg-muted px-4 text-xs uppercase tracking-widest text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-foreground/25" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </div>
        <span className="pointer-events-none absolute inset-x-0 text-center normal-case tracking-widest text-muted-foreground">
          {host}
        </span>
      </div>
      <div ref={previewViewportRef} className="relative flex-1 overflow-hidden bg-background">
        {canPreviewDemo && (
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              title={`${project.name} preview`}
              src={demoHref}
              loading="lazy"
              scrolling="no"
              onLoad={() => setFrameReady(true)}
              className={cn(
                "absolute left-0 top-0 border-0 transition-opacity duration-500 pointer-events-none",
                frameReady ? "opacity-100" : "opacity-0",
              )}
              style={{
                width: PREVIEW_VIEWPORT_WIDTH,
                height: PREVIEW_VIEWPORT_HEIGHT,
                transform: `translate(${previewFrameLayout.offsetX}px, ${previewFrameLayout.offsetY}px) scale(${previewFrameLayout.scale})`,
                transformOrigin: "top left",
              }}
            />
          </div>
        )}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            frameReady && canPreviewDemo && "opacity-0",
          )}
        >
          {project.icon?.src ? (
            <Image
              src={project.icon.src}
              alt={project.icon.alt}
              fill
              sizes="(max-width: 640px) 84vw, (max-width: 1024px) 32rem, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <ProjectAvatar
                icon={project.icon}
                fallbackText={fallbackText}
                className="size-24 rounded-3xl border border-border/60 bg-accent text-2xl font-semibold text-accent-foreground"
              />
            </div>
          )}
        </div>
        {isSelectable && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-all duration-300 group-hover:bg-background/80 group-hover:opacity-100 group-focus-visible:bg-background/80 group-focus-visible:opacity-100">
            <span className="rounded-full border border-border/60 bg-card px-5 py-2 text-sm font-semibold uppercase tracking-widest text-card-foreground shadow-sm shadow-foreground/10 backdrop-blur-sm">
              View Site
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const cardContent = (
    <>
      <div className="space-y-3 px-2 sm:px-1">
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
        {project.languages?.length ? (
          <ProjectLanguageMeter languages={project.languages} />
        ) : null}
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
    </>
  );

  if (!isSelectable) {
    return (
      <article className="flex h-full flex-col gap-6 px-2 sm:px-0">
        {previewPanel}
        {cardContent}
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col gap-6 px-2 sm:px-0">
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
