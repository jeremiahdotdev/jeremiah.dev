"use client";

import { useLayoutEffect, useRef, useState, type FC, memo } from "react";
import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";
import ProjectAvatar from "./project-avatar";

interface ProjectPreviewProps {
  project: Project;
  isSelectable?: boolean;
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

const ProjectPreview: FC<ProjectPreviewProps> = ({ project, isSelectable }) => {
  const [frameReady, setFrameReady] = useState(false);
  const [previewFrameLayout, setPreviewFrameLayout] =
    useState<PreviewFrameLayout>({
      offsetX: 0,
      offsetY: 0,
      scale: PREVIEW_SCALE,
    });
  const previewViewportRef = useRef<HTMLDivElement | null>(null);

  const fallbackText = getProjectInitials(project.name);
  const host = getProjectHost(project);
  const demoHref = project.demo?.href;
  const canPreviewDemo = Boolean(demoHref);

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
        offsetY: 0,
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

  return (
    <div className="relative flex aspect-preview flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl shadow-foreground/10">
      {isSelectable && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-background/0 opacity-0 transition-all duration-300 group-hover:bg-background/80 group-hover:opacity-100 group-focus-visible:bg-background/80 group-focus-visible:opacity-100">
          <span className="rounded-full border border-border/60 bg-card px-5 py-2 text-sm font-semibold uppercase tracking-widest text-card-foreground shadow-sm shadow-foreground/10 backdrop-blur-sm">
            View Site
          </span>
        </div>
      )}
      <div className="relative flex h-11 items-center border-b border-border/60 bg-muted px-4 text-xs uppercase tracking-widest text-muted-foreground">
        <div className="hidden items-center gap-2 md:flex">
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
            <Skeleton
              className={cn(
                "absolute inset-0 animate-none rounded-none transition-opacity duration-300",
                frameReady && "opacity-0",
              )}
            />
            <iframe
              title={`${project.name} preview`}
              src={demoHref}
              loading="lazy"
              scrolling="no"
              onLoad={() => setFrameReady(true)}
              className="pointer-events-none absolute left-0 top-0 border-0"
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
            canPreviewDemo && "pointer-events-none",
            frameReady && canPreviewDemo && "opacity-0",
          )}
        >
          {!canPreviewDemo && project.icon?.src && (
            <Image
              src={project.icon.src}
              alt={project.icon.alt}
              fill
              sizes="(max-width: 640px) 84vw, (max-width: 1024px) 32rem, 33vw"
              className="object-cover"
            />
          )}
          {!canPreviewDemo && !project.icon?.src && (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <ProjectAvatar
                icon={project.icon}
                fallbackText={fallbackText}
                className="size-24 rounded-3xl border border-border/60 bg-accent text-2xl font-semibold text-accent-foreground"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ProjectPreview);
