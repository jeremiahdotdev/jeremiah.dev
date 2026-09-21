"use client";

import { useLayoutEffect, useRef, useState, type FC, memo } from "react";
import Image from "next/image";
import { Lock, RotateCw } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";
import ProjectAvatar from "./project-avatar";
import { useDictionary } from "@/components/content/content-provider";
import { formatTemplate } from "@/lib/format-template";

interface ProjectPreviewProps {
  project: Project;
  moving?: boolean;
}

const PREVIEW_VIEWPORT_WIDTH = 1440;

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

const ProjectPreview: FC<ProjectPreviewProps> = ({ project, moving = false }) => {
  const { projects: labels } = useDictionary();
  const [loadedFrame, setLoadedFrame] = useState<string | null>(null);
  const [frameKey, setFrameKey] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const fallbackText = getProjectInitials(project.name);
  const host = getProjectHost(project);
  const demoHref = project.demo?.href;
  const frameId = `${demoHref ?? ""}:${frameKey}`;
  const frameReady = loadedFrame === frameId;
  const canPreviewDemo = Boolean(demoHref);
  const showOverlay = moving || (canPreviewDemo && !frameReady);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const frame = frameRef.current;
    if (!viewport || !frame) return;
    const desktop = window.matchMedia("(min-width: 1024px)");

    function fitPreview(width: number, height: number) {
      if (!frame || width <= 0 || height <= 0) return;
      const scale = width / PREVIEW_VIEWPORT_WIDTH;
      // Below lg, keep the hosted site's desktop layout while fitting the card.
      frame.style.transform = desktop.matches ? "" : `scale(${scale})`;
      frame.style.height = desktop.matches ? "" : `${height / scale}px`;
    }

    function fitViewport() {
      if (viewport) fitPreview(viewport.clientWidth, viewport.clientHeight);
    }

    fitViewport();
    const observer = new ResizeObserver(([entry]) => {
      fitPreview(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(viewport);
    desktop.addEventListener("change", fitViewport);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", fitViewport);
    };
  }, [frameId]);

  return (
    <div className="w-full aspect-[4/3] sm:aspect-video lg:flex-1 lg:aspect-auto dark:shadow-black/25 relative flex flex-col overflow-clip rounded-xl bg-muted shadow-md shadow-black/10">
      <div className="border-black/10 bg-[#ededee] text-[#171a1e] dark:border-white/10 dark:bg-[#24272b] dark:text-[#e7e9ec] relative flex h-10 shrink-0 items-center gap-3 border-b px-3 sm:h-12 sm:gap-5 sm:px-5">
        <div aria-hidden="true" className="flex items-center gap-1.5 sm:gap-2">
          <span className="size-2.5 rounded-full bg-[#ff5f57] sm:size-3" />
          <span className="size-2.5 rounded-full bg-[#febc2e] sm:size-3" />
          <span className="size-2.5 rounded-full bg-[#28c840] sm:size-3" />
        </div>
        <Lock aria-hidden="true" className="text-gray-500 dark:text-[#aeb6bf] hidden size-3.5 shrink-0 sm:block" />
        <span className="min-w-0 flex-1 truncate text-xs tracking-tight sm:text-sm">{host}</span>
        {canPreviewDemo && (
          <span className="flex shrink-0 items-center gap-2">
            <span className="size-2 rounded-full bg-lime-400" />
            <Typography as="span" variant="label">
              <span className="text-gray-500 dark:text-[#aeb6bf]">{labels.preview.live}</span>
            </Typography>
          </span>
        )}
        {canPreviewDemo && (
          <button
            type="button"
            aria-label={formatTemplate(labels.preview.reloadAria, { project: project.name })}
            onClick={() => setFrameKey((key) => key + 1)}
            className="hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-current -mr-2 flex size-10 shrink-0 items-center justify-center rounded-md focus-visible:outline focus-visible:outline-2 -outline-offset-2 sm:size-11"
          >
            <RotateCw aria-hidden="true" className="size-4" />
          </button>
        )}
      </div>
      <span role="status" className="sr-only">
        {canPreviewDemo && !frameReady && labels.preview.loading}
      </span>
      <div ref={viewportRef} aria-busy={showOverlay} className="relative min-h-0 flex-1 overflow-clip bg-muted">
        <Skeleton
          aria-hidden="true"
          data-preview-overlay=""
          className={cn(
            "pointer-events-none absolute inset-0 z-10 animate-none overflow-hidden rounded-none opacity-0 transition-opacity duration-200 ease-in-out motion-reduce:transition-none",
            showOverlay && "pointer-events-auto opacity-100",
          )}
        >
          {showOverlay && (
            <>
              <span
                className="absolute inset-0 motion-safe:animate-preview-waves"
                style={{
                  backgroundImage: "linear-gradient(135deg, transparent 0%, hsl(var(--foreground) / 0.01) 25%, transparent 50%, hsl(var(--foreground) / 0.01) 75%, transparent 100%)",
                  backgroundSize: "240px 240px",
                }}
              />
              {canPreviewDemo && (
                <div className="absolute inset-0 flex items-center justify-center px-4 opacity-[0.12]">
                  <Typography as="span" variant="label" noWrap>
                    {Array.from(labels.preview.loading).map((character, index) => (
                      <span
                        key={index}
                        className="inline-block whitespace-pre motion-safe:animate-preview-ripple"
                        style={{ animationDelay: `${index * 60}ms` }}
                      >
                        {character}
                      </span>
                    ))}
                  </Typography>
                </div>
              )}
            </>
          )}
        </Skeleton>
        {canPreviewDemo && (
          <div className={cn("absolute inset-0 overflow-hidden", showOverlay && "invisible")}>
            <iframe
              key={frameId}
              ref={frameRef}
              title={formatTemplate(labels.preview.title, { project: project.name })}
              src={demoHref}
              loading="lazy"
              onLoad={() => setLoadedFrame(frameId)}
              width={PREVIEW_VIEWPORT_WIDTH}
              className="absolute left-0 top-0 h-[900px] origin-top-left scale-0 border-0 lg:h-[calc(100%/0.75+24px)] lg:w-[calc(100%/0.75+24px)] lg:scale-75"
            />
          </div>
        )}
        {!canPreviewDemo && (
          <div className={cn("absolute inset-0", showOverlay && "invisible")}>
            {project.icon?.src && (
              <Image
                src={project.icon.src}
                alt={project.icon.alt}
                fill
                sizes="(max-width: 1023px) 95vw, 62vw"
                className="object-cover"
              />
            )}
            {!project.icon?.src && (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <ProjectAvatar
                  icon={project.icon}
                  fallbackText={fallbackText}
                  className="size-24 rounded-3xl border border-border/60 bg-accent text-2xl font-semibold text-accent-foreground"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ProjectPreview);
